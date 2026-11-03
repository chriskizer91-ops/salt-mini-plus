"""The baked car as a .glb (Blender's glTF exporter), from models/tools/bake.py's out folder: the game's own meshes
   wearing the baked pictures, in the pieces the game drives: the body, the lamps on their own (lamp_head, lamp_tail,
   lamp_amber, lamp_reverse: their materials carry a 'lamp' and a 'glow' colour in their extras, the glow switched
   off), what the hood hides, the hood with its origin on its hinge (it opens by turning about its z), and at each hub
   a steer_ node (turn it about its y to steer) holding the wheel_ (turn it about its z to roll; the game's own wheel,
   its brake with it). Two materials, the skin's and the wheel's: the colour (its alpha the paint mask: the material
   is opaque, so a viewer ignores it; a game reads it to repaint the car), the normals in the surface's frame,
   occlusion + roughness + metal in one picture, the clear coat. The pictures go in as WebP, the colour kept under
   the clear alpha.
   usage: python3 models/tools/baked_glb.py <bake-out-dir> <export-dir>/studio/manifest.json <out.glb>"""
import sys, os, json, io, struct
import numpy as np
from PIL import Image
import bpy
D, MANI, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
man = json.load(open(MANI)); bk = json.load(open(os.path.join(D, 'bake.json')))
bpy.ops.wm.read_factory_settings(use_empty=True)
G2B = np.array([[1, 0, 0], [0, 0, -1], [0, 1, 0]], dtype=np.float32); g2b = lambda v: (v[0], -v[2], v[1])
def raw(name, uv):
    r = np.fromfile(os.path.join(D, name + '.bin'), dtype=np.float32); k = 10 if uv else 8; n = len(r) // k
    P = r[:n * 3].reshape(-1, 3); N = r[n * 3:n * 6].reshape(-1, 3); o = n * 6
    U = r[o:o + n * 2].reshape(-1, 2) if uv else None; o += n * 2 if uv else 0
    return P, N, U, r[o:o + n].astype(np.int32), r[o + n:o + 2 * n].astype(np.int32)
# ---------- the pictures ----------
TMP = os.path.join(D, 'glb'); os.makedirs(TMP, exist_ok=True)
L = lambda n: Image.open(os.path.join(D, n + '.png'))
grey = lambda n: np.asarray(L(n).convert('L'), np.float32)
def pics(tag, paint):
    c = np.asarray(L(tag + '_col').convert('RGB'), np.uint8); a = grey(tag + '_paint').clip(0, 255).astype(np.uint8) if paint else np.zeros(c.shape[:2], np.uint8)
    Image.fromarray(np.concatenate([c, a[..., None]], -1), 'RGBA').save(os.path.join(TMP, tag + '_col.png'))
    ao, me = grey(tag + '_ao'), grey(tag + '_metal'); ao = np.maximum(ao, me * .9)
    Image.fromarray(np.stack([ao, grey(tag + '_rough'), me], -1).clip(0, 255).astype(np.uint8), 'RGB').save(os.path.join(TMP, tag + '_orm.png'))
    cc = grey(tag + '_coat') if paint else np.zeros_like(ao); cc = np.where(cc > 110, cc, 0)
    Image.fromarray(np.stack([cc, cc, cc], -1).astype(np.uint8), 'RGB').save(os.path.join(TMP, tag + '_coat.png'))
    L(tag + '_tnrm').convert('RGB').save(os.path.join(TMP, tag + '_tnrm.png'))
pics('skin', True); pics('wheel', False)
def img(name, colour):
    im = bpy.data.images.load(os.path.join(TMP, name + '.png')); im.colorspace_settings.name = 'sRGB' if colour else 'Non-Color'
    im.alpha_mode = 'STRAIGHT' if colour else 'NONE'; return im
def baked_mat(tag, name, lamp=None, glow=None):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; p = nt.nodes['Principled BSDF']
    tx = lambda im: (lambda t: (setattr(t, 'image', im), t)[1])(nt.nodes.new('ShaderNodeTexImage'))
    c = tx(IM[tag + '_col']); nt.links.new(c.outputs['Color'], p.inputs['Base Color'])
    o = tx(IM[tag + '_orm']); sp = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(o.outputs['Color'], sp.inputs['Color'])
    nt.links.new(sp.outputs['Green'], p.inputs['Roughness']); nt.links.new(sp.outputs['Blue'], p.inputs['Metallic'])
    # (the occlusion, as Blender's glTF exporter takes it: a group named glTF Material Output with an Occlusion input)
    g = bpy.data.node_groups.get('glTF Material Output')
    if g is None:
        g = bpy.data.node_groups.new('glTF Material Output', 'ShaderNodeTree'); g.interface.new_socket('Occlusion', in_out='INPUT', socket_type='NodeSocketFloat')
    gn = nt.nodes.new('ShaderNodeGroup'); gn.node_tree = g; nt.links.new(sp.outputs['Red'], gn.inputs['Occlusion'])
    nm = tx(IM[tag + '_tnrm']); nmap = nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(nm.outputs['Color'], nmap.inputs['Color']); nt.links.new(nmap.outputs['Normal'], p.inputs['Normal'])
    if tag == 'skin':
        ct = tx(IM[tag + '_coat']); s2 = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(ct.outputs['Color'], s2.inputs['Color']); nt.links.new(s2.outputs['Red'], p.inputs['Coat Weight'])
        p.inputs['Coat Roughness'].default_value = .03
    if lamp:
        p.inputs['Emission Color'].default_value = glow; p.inputs['Emission Strength'].default_value = 0; m['lamp'] = lamp; m['glow'] = GLOW_HEX[lamp]
    m.use_backface_culling = False; return m
IM = {k: img(k, k.endswith('_col')) for k in [t + '_' + s for t in ('skin', 'wheel') for s in ('col', 'orm', 'coat', 'tnrm')] if os.path.exists(os.path.join(TMP, k + '.png'))}
def hexlin(h): c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]; return [(v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4) for v in c] + [1]
GLOW_HEX = {'head': '#fff3df', 'tail': '#ff1a0a', 'amber': '#ff8a14', 'reverse': '#ffffff'}; GLOWS = {k: hexlin(v) for k, v in GLOW_HEX.items()}
M_SKIN = baked_mat('skin', 'baked'); M_WHEEL = baked_mat('wheel', 'baked_wheel')
M_LAMP = {k: baked_mat('skin', 'baked_lamp_' + k, k, GLOWS[k]) for k in GLOWS}
def plain(name, col, rough, metal, alpha=1.):
    m = bpy.data.materials.new(name); m.use_nodes = True; p = m.node_tree.nodes['Principled BSDF']; p.inputs['Base Color'].default_value = col
    p.inputs['Roughness'].default_value = rough; p.inputs['Metallic'].default_value = metal
    if alpha < 1:
        p.inputs['Alpha'].default_value = alpha
        try: m.surface_render_method = 'BLENDED'
        except Exception: pass
    m.use_backface_culling = False; return m
M_GLASS = {2: plain('glass', (.012, .014, .018, 1), .02, 0, .86), 3: plain('glass_light', (.02, .025, .03, 1), .02, 0, .8)}; M_UNDER = plain('underside', (.011, .011, .012, 1), .7, .3)
LAMP = {7: 'tail', 8: 'head', 9: 'head', 29: 'head', 10: 'amber', 23: 'reverse'}
# ---------- the meshes ----------
def mesh(name, P, N, U, mats, mi, off=(0, 0, 0), mir=False, C=None):
    P = P.copy(); N = N.copy()
    if mir: P[:, 2] = -P[:, 2]; N[:, 2] = -N[:, 2]; P = P.reshape(-1, 3, 3)[:, ::-1].reshape(-1, 3); N = N.reshape(-1, 3, 3)[:, ::-1].reshape(-1, 3); U = U.reshape(-1, 3, 2)[:, ::-1].reshape(-1, 2) if U is not None else None; mi = mi.copy()
    P = (P - np.array(off, np.float32)) @ G2B.T; N = N @ G2B.T; N /= np.linalg.norm(N, axis=1, keepdims=True) + 1e-9
    key = np.round(P * 2e4).astype(np.int64); uq, vi = np.unique(key, axis=0, return_inverse=True); vi = vi.ravel().astype(np.int32)
    first = np.zeros(len(uq), np.int64); first[vi[::-1]] = np.arange(len(vi))[::-1]
    T = vi.reshape(-1, 3); ok = (T[:, 0] != T[:, 1]) & (T[:, 1] != T[:, 2]) & (T[:, 0] != T[:, 2]); n = int(ok.sum())
    me = bpy.data.meshes.new(name); me.vertices.add(len(uq)); me.vertices.foreach_set('co', P[first].ravel())
    me.loops.add(n * 3); me.loops.foreach_set('vertex_index', T[ok].ravel())
    me.polygons.add(n); me.polygons.foreach_set('loop_start', np.arange(0, n * 3, 3, dtype=np.int32)); me.polygons.foreach_set('loop_total', np.full(n, 3, np.int32))
    me.update(); me.validate()
    me.polygons.foreach_set('material_index', mi[ok]); me.polygons.foreach_set('use_smooth', np.ones(n, bool))
    if U is not None:
        uv = me.uv_layers.new(name='uv'); uv.data.foreach_set('uv', U.reshape(-1, 3, 2)[ok].ravel())
    me.normals_split_custom_set(N.reshape(-1, 3, 3)[ok].reshape(-1, 3).tolist())
    if C is not None:
        ca = me.color_attributes.new('col', 'BYTE_COLOR', 'CORNER'); cc = C.reshape(-1, 3, 4)[ok].reshape(-1, 4)
        ca.data.foreach_set('color', np.c_[np.clip(cc[:, :3], 0, 1), np.ones(len(cc))].astype(np.float32).ravel())
    for m in mats: me.materials.append(m)
    ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob); return ob
def empty(name, parent=None, loc=(0, 0, 0)):
    ob = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(ob); ob.parent = parent; ob.location = g2b(loc); return ob
car = empty('car')
sP, sN, sU, sG, sM = raw('skin', True); gP, gN, _, gG, gM = raw('glass', False); uP, uN, _, uG, _ = raw('under', False)
hinge = man['D']['hinge']
def tri(a): return np.repeat(a.reshape(-1, 3)[:, 0], 1)
for g, name in enumerate(('body', 'hood', 'hide')):
    off = (hinge[0], hinge[1], 0) if name == 'hood' else (0, 0, 0)
    st = tri(sG) == g; lk = np.array([LAMP.get(m, '') for m in tri(sM)])
    keep = st & (lk == '')
    Ps, Ns, Us, mis = [sP.reshape(-1, 9)[keep].reshape(-1, 3)], [sN.reshape(-1, 9)[keep].reshape(-1, 3)], [sU.reshape(-1, 6)[keep].reshape(-1, 2)], [np.zeros(keep.sum(), np.int32)]
    mats = [M_SKIN]
    for gm, gmat in M_GLASS.items():
        s2 = (tri(gG) == g) & (tri(gM) == gm)
        if s2.any(): Ps.append(gP.reshape(-1, 9)[s2].reshape(-1, 3)); Ns.append(gN.reshape(-1, 9)[s2].reshape(-1, 3)); Us.append(np.zeros((s2.sum() * 3, 2), np.float32)); mis.append(np.full(s2.sum(), len(mats), np.int32)); mats.append(gmat)
    s3 = tri(uG) == g
    if s3.any(): Ps.append(uP.reshape(-1, 9)[s3].reshape(-1, 3)); Ns.append(uN.reshape(-1, 9)[s3].reshape(-1, 3)); Us.append(np.zeros((s3.sum() * 3, 2), np.float32)); mis.append(np.full(s3.sum(), len(mats), np.int32)); mats.append(M_UNDER)
    ob = mesh(name, np.concatenate(Ps), np.concatenate(Ns), np.concatenate(Us), mats, np.concatenate(mis), off); ob.parent = car; ob.location = g2b(off)
    if name == 'hood': ob['hinge'] = True; ob['open'] = 1.0
    if name == 'body':
        for k in GLOWS:
            s4 = st & (lk == k)
            if s4.any():
                lo = mesh('lamp_' + k, sP.reshape(-1, 9)[s4].reshape(-1, 3), sN.reshape(-1, 9)[s4].reshape(-1, 3), sU.reshape(-1, 6)[s4].reshape(-1, 2), [M_LAMP[k]], np.zeros(s4.sum(), np.int32)); lo.parent = car; lo['lamp'] = k
# ---------- the game's own engine bay (with the hood up) and the pad under its hood, in plain materials ----------
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bl_mats import mat_for
BI = os.path.join(os.path.dirname(os.path.dirname(MANI)), 'bake-in'); bim = json.load(open(os.path.join(BI, 'manifest.json')))
inv = {v: k for k, v in bim['MAT'].items()}; inv.update({v: 'SM_' + k for k, v in bim['SM'].items()}); PM = {}
def game_piece(name, fname, off=(0, 0, 0), parent=None):
    if fname not in bim['pieces'] or not bim['pieces'][fname]['tris']: return None
    n = bim['pieces'][fname]['tris']; r = np.fromfile(os.path.join(BI, fname + '.bin'), dtype=np.float32)
    P = r[:n * 9].reshape(-1, 3); N = r[n * 9:n * 18].reshape(-1, 3); C = r[n * 18:n * 30].reshape(-1, 4); Mt = r[n * 30:n * 31].astype(np.int32)
    T3 = P.reshape(-1, 3, 3); g = np.cross(T3[:, 1] - T3[:, 0], T3[:, 2] - T3[:, 0]); bad = (g * N.reshape(-1, 3, 3).sum(1)).sum(1) < 0
    for A, k in ((P, 3), (N, 3), (C, 4)):
        V = A.reshape(-1, 3, k); V[bad] = V[bad][:, ::-1]
    ids = sorted(set(Mt.tolist())); mi = np.array([ids.index(m) for m in Mt], np.int32)
    for m in ids:
        if m not in PM: PM[m] = mat_for(m, inv, bim['build'], 'gltf')
    ob = mesh(name, P, N, None, [PM[m] for m in ids], mi, off, C=C)
    ob.parent = parent or car; ob.location = g2b(off); return ob
game_piece('bay', 'low_bay')
hood_ob = bpy.data.objects.get('hood'); game_piece('hood_pad', 'low_liner', (hinge[0], hinge[1], 0), hood_ob)
if hood_ob: bpy.data.objects['hood_pad'].location = (0, 0, 0)
wP, wN, wU, _, _ = raw('wheel', True); nd = {n['name']: n for n in man['nodes']}
for tag in ('fr', 'fl', 'rr', 'rl'):
    s = nd['steer_' + tag]; st = empty('steer_' + tag, car, s['t']); st['steers'] = s.get('steers', False)
    w = mesh('wheel_' + tag, wP, wN, wU, [M_WHEEL], np.zeros(len(wP) // 3, np.int32), mir=tag.endswith('l')); w.parent = st; w['spins'] = True
# (Salt Mini Plus) the spares, where the game puts them: the game's own wheel, turned to face backward on a door
for n_ in man['nodes']:
    if not n_['name'].startswith('spare_'): continue
    Pq, Nq = wP.copy(), wN.copy()
    if n_.get('spare') == 'back': Pq = np.c_[-Pq[:, 2], Pq[:, 1], Pq[:, 0]].astype(np.float32); Nq = np.c_[-Nq[:, 2], Nq[:, 1], Nq[:, 0]].astype(np.float32)
    so = mesh(n_['name'], Pq, Nq, wU, [M_WHEEL], np.zeros(len(wP) // 3, np.int32), mir=n_.get('spare') != 'back' and n_['t'][2] < 0); so.parent = car; so.location = g2b(n_['t'])
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=True, export_extras=True, export_apply=False, export_normals=True, export_tangents=False,
                          export_image_format='WEBP', export_materials='EXPORT')
# ---------- the pictures again, encoded here: WebP keeping the colour under a clear alpha (exact) ----------
def glb_rewrite(path):
    b = open(path, 'rb').read(); jl = struct.unpack('<I', b[12:16])[0]; J = json.loads(b[20:20 + jl]); BIN = b[20 + jl + 8:]
    bvs = J['bufferViews']; out = bytearray(); views = []
    src_of = {}
    for i, im in enumerate(J.get('images', [])):
        src_of[im.get('bufferView')] = im.get('name', '')
    for vi, bv in enumerate(bvs):
        data = BIN[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']]
        nm = src_of.get(vi)
        if nm is not None:
            pn = os.path.join(TMP, nm.replace('.webp', '').replace('.png', '') + '.png')
            if os.path.exists(pn):
                im = Image.open(pn); bb = io.BytesIO()
                im.save(bb, 'WEBP', quality=88 if 'col' in nm or 'orm' in nm else 92, method=6, alpha_quality=100, exact=True) if im.mode == 'RGBA' else im.save(bb, 'WEBP', quality=90, method=6)
                data = bb.getvalue()
        while len(out) % 4: out.append(0)
        views.append((len(out), len(data))); out += data
    for bv, (o, l) in zip(bvs, views): bv['byteOffset'] = o; bv['byteLength'] = l
    while len(out) % 4: out.append(0)
    J['buffers'][0]['byteLength'] = len(out)
    js = json.dumps(J, separators=(',', ':')).encode();
    while len(js) % 4: js += b' '
    tot = 12 + 8 + len(js) + 8 + len(out)
    open(path, 'wb').write(struct.pack('<III', 0x46546C67, 2, tot) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(out), 0x004E4942) + bytes(out))
glb_rewrite(OUT)
print('saved', OUT, os.path.getsize(OUT))
