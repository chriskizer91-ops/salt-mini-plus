"""The bake (Baked SUV Test's, cargames baked-suv-test/tools/bake/bake.py, for any car): the game's own car (light:
   about 35 000 to 45 000 triangles) wearing the Studio car's detail as pictures. Blender's Python module does it: the light truck is unwrapped flat (each triangle
   given a place on a square picture), then for every pixel a ray goes from the light truck's surface into the
   studio truck, and what it finds there is written into the pictures:
   - colour: the surface's own colour, no light in it (the paint, the chrome, the honeycomb, the lenses' red and amber)
   - normals: which way the studio truck's surface faces there, in the truck's own axes (so light catches the grooves,
     bowls and lips the light truck doesn't have)
   - occlusion: how much of the sky the spot can see (dark down in the lamps, the grille, the wheel wells, the treads)
   - roughness and metal: how glossy and how metallic, packed with the occlusion into one picture (R, G, B)
   - clear coat: where the paint is (the coat goes only there)
   Writes into the out folder: skin_{col,nrm,orm,coat}.png and wheel_{col,nrm,orm}.png, and the light meshes with their
   new picture coordinates: skin.bin, glass.bin, under.bin, wheel.bin (Float32: positions, normals, uv; tri soup).
   This copy (Baked SUV Test's) also keeps which part of the truck each triangle belongs to (body, hood, what the
   hood hides) and bakes a paint mask (where the paint is, so the game can still repaint the truck).
   Salt Mini Plus adds: the Studio's new materials (models/src/hd/77_kit.js), each light triangle's game material
   kept with it (so the .glb can keep the lamps apart), and the normals baked a second time in the light car's own
   surface's frame (tangent space: the kind a .glb carries; the game's are in the car's own axes).
   usage: python3 models/tools/bake.py <export-dir>/bake-in <out-dir> [skin size] [wheel size] [ao samples]"""
import sys, os, json, math, time
import numpy as np
import bpy
IN, OUT = sys.argv[1], sys.argv[2]
SKIN = int(sys.argv[3]) if len(sys.argv) > 3 else 2048
WHEEL = int(sys.argv[4]) if len(sys.argv) > 4 else 1024
AOS = int(sys.argv[5]) if len(sys.argv) > 5 else 32
os.makedirs(OUT, exist_ok=True)
man = json.load(open(os.path.join(IN, 'manifest.json'))); MAT, SM, B = man['MAT'], man['SM'], man['build']
inv = {v: k for k, v in MAT.items()}; inv.update({v: 'SM_' + k for k, v in SM.items()})
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'
# the occlusion looks only 8 cm round each spot: the darkening where surfaces meet and down in recesses, not the
# whole underside of the truck gone black (and a lamp's cavity, under a clear lens, is not a cave)
sc.world = bpy.data.worlds.new('w'); sc.world.light_settings.distance = .08
T0 = time.time()
def log(*a): print('[bake %5.0fs]' % (time.time() - T0), *a, flush=True)
def load(name):
    raw = np.fromfile(os.path.join(IN, name + '.bin'), dtype=np.float32); n = man['pieces'][name]['tris']
    P = raw[:n * 9].reshape(-1, 3); N = raw[n * 9:n * 18].reshape(-1, 3); C = raw[n * 18:n * 30].reshape(-1, 4); M = raw[n * 30:n * 31].astype(np.int32)
    GP = raw[n * 31:n * 32].astype(np.int32) if len(raw) >= n * 32 else np.zeros(n, np.int32)
    load.grp[name] = GP
    return P, N, C, M, n
load.grp = {}
def hexlin(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return [(v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4) for v in c]
# ---------- what each material is, for the bake: colour (None: the vertex colour), metal, roughness, coat ----------
def look(i):
    k = inv.get(i, 'COL'); p = hexlin
    T = {'PAINT': (p(B['paint']), .22, .42, 1), 'ACCENT': (p(B['paint2']), .22, .42, 1), 'CHROME': ([.9, .9, .92], 1, .05, 0),
         'SM_REFLC': ([.92, .92, .93], 1, .05, 1), 'SM_LUG': ([.9, .9, .92], 1, .06, 0), 'HEAD': ([.85, .86, .88], .95, .07, 1), 'REV': ([.88, .89, .9], .9, .06, 1),
         'SM_MIRROR': ([.95, .95, .95], 1, 0, 0), 'TYRE': ([.025, .025, .027], 0, .9, 0), 'SM_TREAD': ([.025, .025, .027], 0, .9, 0), 'SM_WALL': ([.028, .028, .03], 0, .75, 0),
         'TAIL': ([.35, .01, .01], .1, .1, 1), 'SM_REDL': ([.55, .02, .015], 0, .05, 1), 'AMBER': ([.8, .32, .04], .1, .1, 1), 'SM_AMBERL': ([.85, .38, .05], 0, .05, 1),
         'MESH': ([.01, .01, .011], .2, .5, 0), 'SM_HONEY': (None, 0, .35, .5), 'SM_GLOSSBLK': (None, 0, .15, .6), 'SMOKE': ([.01, .01, .01], 0, .05, 1),
         'RIM': (p(B['rim']), 1, .22, 0), 'SM_BRUSH': (None, 1, .16, 0), 'SM_ROTORF': (None, .85, .38, 0), 'SM_CAST': (None, .7, .55, 0),
         'CLAD': (p(B['clad']), 0, .74, 0), 'SM_CLADS': (p(B['clad']), 0, .72, 0), 'SM_LINER': ([.012, .012, .013], 0, .8, 0), 'CALIPER': (p(B['cal']), .2, .35, .6),
         'ROTOR': ([.35, .35, .37], .9, .32, 0), 'PLATE': ([.72, .72, .66], .1, .4, 0), 'SHUT': ([.01, .01, .01], 0, .7, 0), 'SM_SATIN': (None, .8, .32, .6),
         'SM_BOLT': (None, 1, .3, 0), 'SM_BULB': ([1, .97, .9], 0, .2, 1), 'SM_SEAL': (None, 0, .7, 0), 'METAL': (None, .55, .45, 0), 'RUBBER': (None, 0, .85, 0),
         'LED': ([1, 1, 1], 0, .2, 0), 'HALO': ([1, 1, 1], 0, .2, 0), 'EMIT': (None, 0, .3, 0),
         'SM_LAMPH': ([.95, .96, .97], 0, .04, 1), 'SM_REFR': ([.45, .02, .01], .2, .12, 1), 'SM_TREADAT': ([.025, .025, .027], 0, .9, 0), 'SM_BEDLINER': (None, 0, .82, 0),
         'SM_PLASTIC': (None, 0, .7, 0), 'SM_CLOTH': (None, 0, .95, 0), 'SM_PAINTED': (None, .1, .42, .6), 'SM_ENGINE': (None, .6, .42, 0), 'SM_HOSE': (None, 0, .6, 0),
         'SM_WHITE': (None, .05, .35, .8), 'SM_TRIMIN': (None, 0, .7, 0), 'CARBON': ([.015, .015, .017], 0, .25, .8)}
    return T.get(k, (None, 0, .55, 0))
# ---------- meshes ----------
def make(name, P, N, C=None, M=None, weld=False, grp=None, gm=None):
    n = len(P) // 3
    me = bpy.data.meshes.new(name); me.vertices.add(len(P)); me.vertices.foreach_set('co', P.ravel())
    me.loops.add(len(P)); me.loops.foreach_set('vertex_index', np.arange(len(P), dtype=np.int32))
    me.polygons.add(n); me.polygons.foreach_set('loop_start', np.arange(0, len(P), 3, dtype=np.int32)); me.polygons.foreach_set('loop_total', np.full(n, 3, np.int32))
    me.update()
    if C is not None:
        ca = me.color_attributes.new('col', 'FLOAT_COLOR', 'CORNER'); ca.data.foreach_set('color', np.c_[C[:, :3], np.ones(len(C))].astype(np.float32).ravel())
    if M is not None:
        ids = sorted(set(M.tolist())); idx = {v: i for i, v in enumerate(ids)}
        for v in ids:
            me.materials.append(bake_mat(v))
        me.polygons.foreach_set('material_index', np.array([idx[v] for v in M], dtype=np.int32))
    if grp is not None:
        ga = me.attributes.new('grp', 'INT', 'FACE'); ga.data.foreach_set('value', grp.astype(np.int32))
    if gm is not None:
        gb = me.attributes.new('gm', 'INT', 'FACE'); gb.data.foreach_set('value', gm.astype(np.int32))
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob)
    if weld:
        bpy.context.view_layer.objects.active = ob
        for o in sc.objects: o.select_set(o == ob)
        bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.object.mode_set(mode='OBJECT')
        for p in me.polygons: p.use_smooth = True
        # (Salt Mini Plus: kept sharp where the game's surfaces meet at more than 50 degrees, as a box bumper's or a flare's
        # edges do: welded smooth there, the normals bend round the edge and the bake's rays go sideways into the wrong
        # surface, smearing it)
        me.set_sharp_from_angle(angle=math.radians(50))
    return ob
MATS = {}
def bake_mat(i):
    if i in MATS: return MATS[i]
    col, metal, rough, coat = look(i)
    m = bpy.data.materials.new('m%d' % i); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    o = nt.nodes.new('ShaderNodeOutputMaterial'); pr = nt.nodes.new('ShaderNodeBsdfPrincipled')
    if col is None:
        a = nt.nodes.new('ShaderNodeAttribute'); a.attribute_name = 'col'; nt.links.new(a.outputs['Color'], pr.inputs['Base Color'])
    else: pr.inputs['Base Color'].default_value = col + [1]
    pr.inputs['Metallic'].default_value = metal; pr.inputs['Roughness'].default_value = rough
    nt.links.new(pr.outputs[0], o.inputs['Surface'])
    # (the base colour as light, for the colour bake: a diffuse-colour bake gives a metal no colour at all)
    ce = nt.nodes.new('ShaderNodeEmission'); ce.name = 'C'; ce.inputs['Strength'].default_value = 1
    if col is None: nt.links.new(a.outputs['Color'], ce.inputs['Color'])
    else: ce.inputs['Color'].default_value = col + [1]
    # (an emission shader standing by: the metal and the coat are baked as light, swapped in for those two bakes)
    em = nt.nodes.new('ShaderNodeEmission'); em.name = 'X'; em.inputs['Strength'].default_value = 1
    m['metal'] = metal; m['coat'] = coat; m['paint'] = 1.0 if inv.get(i) in ('PAINT',) else 0.0
    # (where the head and tail lamps are, for a glow mask: GLOW=1. A traffic car's lamps are painted on with the rest, so
    # the page lights them from this; the indicators and reversing lamps are left dark)
    m['glow'] = 1.0 if inv.get(i) in GLOWING else 0.0; MATS[i] = m; return m
GLOWING = ('HEAD', 'LED', 'HALO', 'TAIL', 'SM_REDL', 'SM_LAMPH', 'SM_REFR', 'SM_BULB', 'SM_REFLC', 'SM_LENSH')
def as_emit(which):
    for m in MATS.values():
        nt = m.node_tree; o = nt.nodes['Material Output']; em = nt.nodes['X']; v = m[which]
        em.inputs['Color'].default_value = (v, v, v, 1); nt.links.new(em.outputs[0], o.inputs['Surface'])
def as_colour():
    for m in MATS.values():
        nt = m.node_tree; nt.links.new(nt.nodes['C'].outputs[0], nt.nodes['Material Output'].inputs['Surface'])
def as_bsdf():
    for m in MATS.values():
        nt = m.node_tree; nt.links.new(nt.nodes['Principled BSDF'].outputs[0], nt.nodes['Material Output'].inputs['Surface'])
def unwrap(ob, margin):
    bpy.context.view_layer.objects.active = ob
    for o in sc.objects: o.select_set(o == ob)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=margin, area_weight=0.0, correct_aspect=True, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode='OBJECT')
def target(ob, size, name, fill, colour):
    img = bpy.data.images.new(name, size, size, alpha=False, float_buffer=False); img.generated_color = fill
    # (the colour space is set before the bake: changing it afterwards reloads a generated picture, losing the bake)
    img.colorspace_settings.name = 'sRGB' if colour else 'Non-Color'
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; t = nt.nodes.new('ShaderNodeTexImage'); t.image = img; nt.nodes.active = t
    ob.data.materials.clear(); ob.data.materials.append(m); return img
def bake(low, highs, kind, img, fill, extr, dist, samples=1, margin=6, **kw):
    for o in sc.objects: o.select_set(o in highs or o == low)
    bpy.context.view_layer.objects.active = low
    sc.cycles.samples = samples; b = sc.render.bake
    b.use_selected_to_active = True; b.cage_extrusion = extr; b.max_ray_distance = dist; b.margin = margin; b.margin_type = 'EXTEND'
    bpy.ops.object.bake(type=kind, **kw)
def save(img, path):
    img.filepath_raw = path; img.file_format = 'PNG'; img.save()
def write_mesh(ob, path):
    me = ob.data; me.calc_loop_triangles() if hasattr(me, 'calc_loop_triangles') else None
    tris = me.loop_triangles; n = len(tris)
    li = np.zeros(n * 3, np.int32); tris.foreach_get('loops', li)
    vi = np.zeros(len(me.loops), np.int32); me.loops.foreach_get('vertex_index', vi)
    co = np.zeros(len(me.vertices) * 3, np.float32); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
    uv = np.zeros(len(me.loops) * 2, np.float32); me.uv_layers.active.data.foreach_get('uv', uv); uv = uv.reshape(-1, 2)
    nr = np.zeros(len(me.loops) * 3, np.float32)
    try: me.corner_normals.foreach_get('vector', nr)
    except Exception: me.loops.foreach_get('normal', nr)
    nr = nr.reshape(-1, 3)
    P = co[vi[li]]; N = nr[li]; U = uv[li]
    pi = np.zeros(n, np.int32); tris.foreach_get('polygon_index', pi)
    g = np.zeros(len(me.polygons), np.int32)
    if 'grp' in me.attributes: me.attributes['grp'].data.foreach_get('value', g)
    G = np.repeat(g[pi], 3).astype(np.float32)
    h = np.zeros(len(me.polygons), np.int32)
    if 'gm' in me.attributes: me.attributes['gm'].data.foreach_get('value', h)
    GM = np.repeat(h[pi], 3).astype(np.float32)
    with open(path, 'wb') as f: f.write(P.astype(np.float32).tobytes()); f.write(N.astype(np.float32).tobytes()); f.write(U.astype(np.float32).tobytes()); f.write(G.tobytes()); f.write(GM.tobytes())
    return n
def plain(name, P, N, path, M=None):
    G = np.repeat(load.grp[name], 3).astype(np.float32)
    with open(path, 'wb') as f:
        f.write(P.astype(np.float32).tobytes()); f.write(N.astype(np.float32).tobytes()); f.write(G.tobytes())
        if M is not None: f.write(np.repeat(M, 3).astype(np.float32).tobytes())
    return len(P) // 3
# ---------- one bake: a light object, its studio counterpart, the pictures ----------
def facing(P, N, C, M):
    # the game keeps no one winding: each triangle is turned to face the way its normals do, so the welded mesh has
    # one inside and one outside (the bake's cage pushes out along it, and the page draws it by it)
    T = P.reshape(-1, 3, 3); g = np.cross(T[:, 1] - T[:, 0], T[:, 2] - T[:, 0]); bad = (g * N.reshape(-1, 3, 3).sum(1)).sum(1) < 0
    for A, k in ((P, 3), (N, 3), (C, 4)):
        V = A.reshape(-1, 3, k); V[bad] = V[bad][:, ::-1]
    return P, N, C, M
def run(tag, low_name, high_name, size, extr, dist, margin):
    P, N, C, M, n = facing(*load(low_name)[:4]) + (None,); n = len(M); low = make(tag + '_low', P, N, weld=True, grp=load.grp[low_name], gm=M); unwrap(low, margin)
    # (the studio truck turned the same way: a ray reaching the back of a triangle would have Cycles shade it from inside)
    Ph, Nh, Ch, Mh = load(high_name)[:4]
    def studio(Ph, Nh, Ch, Mh):
        Ph, Nh, Ch, Mh = facing(Ph, Nh, Ch, Mh)
        # (a corner whose normal points against its own triangle is turned round too: left, the shading flips
        # partway across the triangle, a wedge of it baked as if seen from inside)
        T = Ph.reshape(-1, 3, 3); g = np.cross(T[:, 1] - T[:, 0], T[:, 2] - T[:, 0]); V = Nh.reshape(-1, 3, 3)
        bad = (V * g[:, None, :]).sum(2) < 0; V[bad] = -V[bad]
        high = make(tag + '_high', Ph, Nh, Ch, Mh)
        for p in high.data.polygons: p.use_smooth = True
        if len(high.data.loops) == len(Nh): high.data.normals_split_custom_set(Nh.tolist())
        return high
    # (Salt Mini Plus: the Studio's parts keep no one winding either: a part built the same way on both sides of the car
    # faces in on one of them, and the page never shows it, drawing both sides. The bake does: a ray meeting the back
    # of a triangle bakes its normal pointing into the car and its occlusion black, on the flares most of all. So the
    # bake is asked first: one quick pass notes, for each pixel, which Studio triangle its ray met and whether that
    # triangle faced back along the ray; a triangle the rays mostly met from behind is turned round.)
    nh = len(Mh); high = studio(Ph, Nh, Ch, Mh)
    tm = bpy.data.materials.new('tid'); tm.use_nodes = True; tn = tm.node_tree; tn.nodes.clear()
    ta = tn.nodes.new('ShaderNodeAttribute'); ta.attribute_name = 'tid'; te = tn.nodes.new('ShaderNodeEmission'); te.inputs['Strength'].default_value = 1
    tn.links.new(ta.outputs['Color'], te.inputs['Color']); tn.links.new(te.outputs[0], tn.nodes.new('ShaderNodeOutputMaterial').inputs['Surface'])
    def votes(high):
        ida = high.data.color_attributes.new('tid', 'FLOAT_COLOR', 'CORNER')
        ida.data.foreach_set('color', np.c_[np.repeat(np.arange(1, nh + 1, dtype=np.float32), 3), np.zeros((nh * 3, 2), np.float32), np.ones(nh * 3, np.float32)].ravel())
        high.data.materials.clear(); high.data.materials.append(tm); high.data.polygons.foreach_set('material_index', np.zeros(nh, np.int32))
        vote = {}
        for key, kind, kw in (('tid', 'EMIT', {}), ('z', 'NORMAL', {'normal_space': 'TANGENT'})):
            img = bpy.data.images.new(tag + '_' + key, size, size, alpha=False, float_buffer=True); img.colorspace_settings.name = 'Non-Color'
            lm = bpy.data.materials.new(tag + '_' + key); lm.use_nodes = True; tx = lm.node_tree.nodes.new('ShaderNodeTexImage'); tx.image = img; lm.node_tree.nodes.active = tx
            low.data.materials.clear(); low.data.materials.append(lm)
            bake(low, [high], kind, img, None, extr, dist, 1, margin=0, **kw)
            a = np.zeros(size * size * 4, np.float32); img.pixels.foreach_get(a); vote[key] = a.reshape(-1, 4); bpy.data.images.remove(img)
        t = np.rint(vote['tid'][:, 0]).astype(np.int64) - 1; z = vote['z'][:, 2] * 2 - 1; ok = (t >= 0) & (t < nh)
        back = np.bincount(t[ok], weights=(z[ok] < 0).astype(np.float64), minlength=nh); seen = np.bincount(t[ok], minlength=nh)
        if os.environ.get('DIAG'):
            r = back[seen > 0] / seen[seen > 0]
            log(tag, 'vote: texels', int(ok.sum()), 'back share %.3f' % (z[ok] < 0).mean(), 'tri ratio hist', np.histogram(r, bins=[0, .01, .2, .4, .6, .8, .99, 1.01])[0].tolist())
            np.save(os.path.join(OUT, tag + '_vote_t.npy'), t.reshape(size, size)); np.save(os.path.join(OUT, tag + '_vote_z.npy'), z.reshape(size, size))
        return back, seen
    back, seen = votes(high); flip = back * 2 > seen
    log(tag, 'turned', int(flip.sum()), 'of', nh, 'Studio triangles the rays met from behind (', int(seen.astype(bool).sum()), 'met at all )')
    bpy.data.objects.remove(high)
    Nh = Nh.reshape(-1, 3, 3).copy(); Nh[flip] = -Nh[flip]; Nh = Nh.reshape(-1, 3)
    high = studio(Ph, Nh, Ch, Mh)
    if os.environ.get('DIAG'):
        OUT0 = OUT; globals()['OUT'] = OUT + '/after'; os.makedirs(OUT + '/after', exist_ok=True); votes(high); globals()['OUT'] = OUT0
        log('diag only'); sys.exit(0)
    log(tag, 'low', n, 'high', nh, 'triangles')
    imgs = {}
    def one(key, kind, fill, colour, samples=1, emit=None, extra=(), **kw):
        img = target(low, size, tag + '_' + key, fill, colour)
        if emit == 'colour': as_colour()
        elif emit: as_emit(emit)
        bake(low, [high, *extra], kind, img, fill, extr, dist, samples, **kw)
        if emit: as_bsdf()
        save(img, os.path.join(OUT, '%s_%s.png' % (tag, key))); imgs[key] = img; log(tag, key, 'done')
    one('col', 'EMIT', (0.02, 0.02, 0.02, 1), True, emit='colour')
    one('nrm', 'NORMAL', (0.5, 1.0, 0.5, 1), False, normal_space='OBJECT', normal_r='POS_X', normal_g='POS_Y', normal_b='POS_Z')
    one('tnrm', 'NORMAL', (0.5, 0.5, 1.0, 1), False, normal_space='TANGENT')
    one('ao', 'AO', (1, 1, 1, 1), False, samples=AOS)
    one('rough', 'ROUGHNESS', (.5, .5, .5, 1), False)
    one('metal', 'EMIT', (0, 0, 0, 1), False, emit='metal')
    if tag == 'skin': one('coat', 'EMIT', (0, 0, 0, 1), False, emit='coat'); one('paint', 'EMIT', (0, 0, 0, 1), False, emit='paint')
    if tag == 'skin' and os.environ.get('GLOW'):
        # (the headlamps' lenses join the Studio car for this one: the lamp lit is the lens glowing, and the other
        # bakes look through it)
        lens = []
        if 'high_lens' in man['pieces'] and man['pieces']['high_lens']['tris']: lens = [studio(*load('high_lens')[:4])]
        one('glow', 'EMIT', (0, 0, 0, 1), False, emit='glow', extra=lens)
        for o in lens: bpy.data.objects.remove(o)
    # (Salt Mini Plus: where two Studio surfaces lie close, a ray can still pass the near one and meet the back of the far
    # one: that pixel bakes a normal pointing into the car and a black occlusion, the speckle on the flares. Every
    # picture takes those pixels from the nearest pixel whose ray met its surface from the front, within a few pixels.)
    from PIL import Image as PI
    from scipy import ndimage
    pth = lambda k: os.path.join(OUT, '%s_%s.png' % (tag, k))
    tz = np.asarray(PI.open(pth('tnrm')).convert('RGB'))[..., 2].astype(np.int16)
    bad = tz < 120
    if bad.any():
        d, (iy, ix) = ndimage.distance_transform_edt(bad, return_indices=True); fix = bad & (d <= 12)
        for k in imgs:
            im = PI.open(pth(k)); a = np.asarray(im).copy(); a[fix] = a[iy[fix], ix[fix]]; PI.fromarray(a, im.mode).save(pth(k))
        log(tag, 'refilled', int(fix.sum()), 'pixels met from behind (of', int(bad.sum()), ')')
    nn = write_mesh(low, os.path.join(OUT, tag + '.bin')); log(tag, 'mesh written', nn, 'triangles')
    bpy.data.objects.remove(low); bpy.data.objects.remove(high)
# (ONLY=wheel or ONLY=skin: that one bake alone, the other's pictures and mesh left as an earlier run wrote them)
ONLY = os.environ.get('ONLY', '')
if ONLY in ('', 'skin'): run('skin', 'low_skin', 'high_body', SKIN, float(os.environ.get('CAGE', .03)), float(os.environ.get('RAY', .14)), .002)
if ONLY in ('', 'wheel'): run('wheel', 'low_wheel', 'high_wheel', WHEEL, .02, .08, .003)
for nm in ('low_glass', 'low_under'):
    P, N, C, M = facing(*load(nm)[:4]); plain(nm, P, N, os.path.join(OUT, nm[4:] + '.bin'), M)
json.dump({'D': man['D'], 'build': B, 'skin': SKIN, 'wheel': WHEEL}, open(os.path.join(OUT, 'bake.json'), 'w'))
log('all done')
