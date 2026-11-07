"""The Redtail, baked (redtail-2): the detailed model (redtail-1's 241k triangles, the reference sheet's patina in
its paint, the patina's relief as a bump) baked onto a light copy of itself. Each moving part stays its own piece
round its own hinge; the glass stays as it is."""
import bpy, bmesh, json, math, numpy as np, sys
from mathutils import Matrix, Vector
H = 'redtail/work/bake/hi/'; O = 'redtail/work/bake/out/'; import os; os.makedirs(O, exist_ok=True)
SIZE = int(sys.argv[sys.argv.index('--size') + 1]) if '--size' in sys.argv else 2048
meta = json.load(open(H + 'meta.json')); I = meta['info']
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
# the game's materials: roughness, metalness, and whether the patina goes on (paint and fabric)
RM = {109: (.78, 0), 110: (.74, 0), 111: (.48, .05), 112: (.45, .05), 2: (.05, 0), 76: (.93, 0), 77: (.88, 0), 78: (.32, 1), 79: (.12, 1), 93: (.55, .7), 80: (.38, .9),
      88: (.32, .9), 84: (.5, 0), 75: (.7, 0), 86: (.15, 0), 87: (.48, .3), 89: (.82, 0), 16: (.45, .75), 74: (.95, 0), 73: (.75, 0), 0: (.5, 0), 72: (.22, 0), 83: (.3, 0), 71: (.3, 0), 85: (.9, 0)}
def load(name):
    P = np.fromfile(H + name + '.pos', np.float32).reshape(-1, 3); C = np.fromfile(H + name + '.col', np.float32).reshape(-1, 3); Mi = np.fromfile(H + name + '.mat', np.uint8)
    nt = len(Mi); me = bpy.data.meshes.new(name); me.vertices.add(nt * 3); me.vertices.foreach_set('co', P.ravel())
    me.loops.add(nt * 3); me.loops.foreach_set('vertex_index', np.arange(nt * 3)); me.polygons.add(nt); me.polygons.foreach_set('loop_start', np.arange(0, nt * 3, 3)); me.update()
    col = me.color_attributes.new('Col', 'FLOAT_COLOR', 'CORNER'); C4 = np.concatenate([C, np.ones((len(C), 1), np.float32)], 1); col.data.foreach_set('color', C4.ravel())
    for an, f in (('rough', lambda m: RM.get(m, (.6, 0))[0]), ('metal', lambda m: RM.get(m, (.6, 0))[1]), ('patw', lambda m: 1. if 109 <= m <= 112 else 0.)):
        a = me.attributes.new(an, 'FLOAT', 'FACE'); a.data.foreach_set('value', np.array([f(int(m)) for m in Mi], np.float32))
    a = me.attributes.new('mid', 'INT', 'FACE'); a.data.foreach_set('value', Mi.astype(np.int32))
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob)
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    return ob
def smooth_angle(ob, deg):
    bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); bpy.context.view_layer.objects.active = ob
    bpy.ops.object.shade_smooth_by_angle(angle=math.radians(deg), keep_sharp_edges=True)
HI = {k: load(k) for k in meta['pieces']}
for ob in HI.values(): smooth_angle(ob, 40)
print('loaded', sum(len(o.data.polygons) for o in HI.values()), flush=True)
# ---------- the light copy: each piece decimated (symmetric across the plane's middle), the glass kept ----------
RATIO = {'body': .29, 'cowl': .36, 'cabin': .4, 'wing': .16, 'flapR': .15, 'flapL': .15, 'aileronR': .15, 'aileronL': .15, 'wheelR': .22, 'wheelL': .22,
         'brakeR': 1, 'brakeL': 1, 'tailwheel': .5, 'stab': .3, 'elevR': .35, 'elevL': .35, 'fin': .5, 'rudder': .55, 'prop': .18, 'engine': .3}
LO = {}
for k, ob in HI.items():
    if k == 'glass': continue
    me = ob.data.copy(); lo = bpy.data.objects.new(k + '_lo', me); sc.collection.objects.link(lo)
    r = RATIO.get(k, .3)
    if r < 1:
        md = lo.modifiers.new('dec', 'DECIMATE'); md.decimate_type = 'COLLAPSE'; md.ratio = r; md.use_symmetry = k not in ('flapR', 'flapL', 'aileronR', 'aileronL', 'wheelR', 'wheelL', 'elevR', 'elevL', 'brakeR', 'brakeL'); md.symmetry_axis = 'Z'
        bpy.context.view_layer.objects.active = lo; lo.select_set(True); bpy.ops.object.modifier_apply(modifier='dec'); lo.select_set(False)
    a = me.attributes.get('piece') or me.attributes.new('piece', 'INT', 'FACE'); idx = list(meta['pieces']).index(k); a.data.foreach_set('value', np.full(len(me.polygons), idx, np.int32))
    LO[k] = lo
print('light', {k: len(o.data.polygons) for k, o in LO.items()}, sum(len(o.data.polygons) for o in LO.values()), flush=True)
# one light object for the bake (pieces kept by their 'piece' number), one detailed object to bake from
def join(obs, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in obs: o.select_set(True)
    bpy.context.view_layer.objects.active = obs[0]; bpy.ops.object.join(); obs[0].name = name; return obs[0]
low = join(list(LO.values()), 'redtail_low')
hi = join([o for k, o in HI.items() if k != 'glass'], 'redtail_high'); glass = HI['glass']
smooth_angle(low, 40)
# ---------- the unwrap: islands by angle, packed into one square ----------
bpy.ops.object.select_all(action='DESELECT'); low.select_set(True); bpy.context.view_layer.objects.active = low
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=.002, area_weight=0, scale_to_bounds=False)
bpy.ops.uv.pack_islands(margin=.0025, rotate=True)
bpy.ops.object.mode_set(mode='OBJECT')
print('unwrapped', flush=True)
# ---------- the detailed object's material: its colours, the patina from the four views, the patina's relief ----------
PI_ = json.load(open('redtail/work/bake/pat/info.json'))
mat = bpy.data.materials.new('hi'); mat.use_nodes = True; nt = mat.node_tree; N = nt.nodes; L = nt.links; N.clear()
def node(t, **kw):
    n = N.new(t)
    for k, v in kw.items(): setattr(n, k, v)
    return n
out = node('ShaderNodeOutputMaterial'); bsdf = node('ShaderNodeBsdfPrincipled'); L.new(bsdf.outputs[0], out.inputs['Surface'])
tc = node('ShaderNodeTexCoord'); sep = node('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Object'], sep.inputs[0])
geo = node('ShaderNodeNewGeometry'); sn = node('ShaderNodeSeparateXYZ'); L.new(geo.outputs['Normal'], sn.inputs[0])
def attr(name, kind='GEOMETRY'): a = node('ShaderNodeAttribute', attribute_name=name, attribute_type=kind); return a
def math_(op, a, b=None, clamp=False):
    m = node('ShaderNodeMath', operation=op, use_clamp=clamp)
    for i, v in enumerate((a, b)):
        if v is None: continue
        if isinstance(v, (int, float)): m.inputs[i].default_value = v
        else: L.new(v, m.inputs[i])
    return m.outputs[0]
AX = {'X': sep.outputs[0], 'Y': sep.outputs[1], 'Z': sep.outputs[2]}
# each view: (column axis, row axis, facing weight)
VW = {'side': ('X', 'Y', math_('ABSOLUTE', sn.outputs[2])), 'top': ('Z', 'X', math_('MAXIMUM', sn.outputs[1], 0)),
      'bottom': ('Z', 'X', math_('MAXIMUM', math_('MULTIPLY', sn.outputs[1], -1), 0)), 'front': ('Z', 'Y', math_('MAXIMUM', sn.outputs[0], 0))}
num = None; den = None
for v, (ca, ra, face) in VW.items():
    a0, a1, b0, b1 = PI_[v]['ext']; img = bpy.data.images.load(f'redtail/work/bake/pat/{v}.png'); img.colorspace_settings.name = 'Non-Color'
    u = math_('MULTIPLY', math_('SUBTRACT', AX[ca], a0), 1 / (a1 - a0)); w = math_('MULTIPLY', math_('SUBTRACT', AX[ra], b0), 1 / (b1 - b0))
    cv = node('ShaderNodeCombineXYZ'); L.new(u, cv.inputs[0]); L.new(w, cv.inputs[1])
    tx = node('ShaderNodeTexImage', image=img, extension='CLIP', interpolation='Linear'); L.new(cv.outputs[0], tx.inputs[0])
    wt = math_('MULTIPLY', math_('POWER', face, 4), tx.outputs['Alpha'])
    d = math_('MULTIPLY', tx.outputs['Color'], 1.6)   # (the colour's first channel as a float)
    num = math_('ADD', num, math_('MULTIPLY', d, wt)) if num else math_('MULTIPLY', d, wt); den = math_('ADD', den, wt) if den else wt
# the patina: the weighted mean where any view sees it (1 elsewhere), on paint and fabric only
P = math_('DIVIDE', math_('ADD', num, math_('MULTIPLY', math_('SUBTRACT', 1, math_('MINIMUM', den, 1)), 1)), math_('ADD', den, math_('SUBTRACT', 1, math_('MINIMUM', den, 1))))
pw = attr('patw'); Pm = math_('ADD', 1, math_('MULTIPLY', math_('MULTIPLY', math_('SUBTRACT', P, 1), 1.7), pw.outputs['Fac']))
col = attr('Col'); mix = node('ShaderNodeVectorMath', operation='SCALE'); L.new(col.outputs['Color'], mix.inputs[0]); L.new(Pm, mix.inputs['Scale'])
warm = node('ShaderNodeMix', data_type='RGBA'); warm.inputs[6].default_value = (1, 1, 1, 1); warm.inputs[7].default_value = (.97, .93, .84, 1); L.new(pw.outputs['Fac'], warm.inputs[0])
base = node('ShaderNodeVectorMath', operation='MULTIPLY'); L.new(mix.outputs[0], base.inputs[0]); L.new(warm.outputs[2], base.inputs[1]); L.new(base.outputs[0], bsdf.inputs['Base Color'])
L.new(attr('rough').outputs['Fac'], bsdf.inputs['Roughness']); L.new(attr('metal').outputs['Fac'], bsdf.inputs['Metallic'])
bump = node('ShaderNodeBump', invert=False); bump.inputs['Strength'].default_value = .35; bump.inputs['Distance'].default_value = .002
L.new(math_('MULTIPLY', math_('SUBTRACT', Pm, 1), 4), bump.inputs['Height']); L.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
hi.data.materials.clear(); hi.data.materials.append(mat)
# ---------- the bakes ----------
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.use_denoising = False
bk = sc.render.bake; bk.use_selected_to_active = True; bk.cage_extrusion = .012; bk.max_ray_distance = .035; bk.margin = 6; bk.margin_type = 'EXTEND'
lmat = bpy.data.materials.new('lo'); lmat.use_nodes = True; low.data.materials.clear(); low.data.materials.append(lmat)
def bake(kind, name, size, cs, samples, **kw):
    img = bpy.data.images.new(name, size, size, alpha=False, float_buffer=False); img.colorspace_settings.name = cs
    ln = lmat.node_tree.nodes; t = ln.get('target') or ln.new('ShaderNodeTexImage'); t.name = 'target'; t.image = img; ln.active = t
    sc.cycles.samples = samples; bpy.ops.object.select_all(action='DESELECT'); hi.select_set(True); low.select_set(True); bpy.context.view_layer.objects.active = low
    import time; t0 = time.time(); bpy.ops.object.bake(type=kind, **kw); img.filepath_raw = O + name + '.png'; img.file_format = 'PNG'; img.save(); print('baked', name, round(time.time() - t0), 's', flush=True)
em0 = N.new('ShaderNodeEmission'); L.new(base.outputs[0], em0.inputs[0]); L.new(em0.outputs[0], out.inputs['Surface']); bake('EMIT', 'albedo', SIZE, 'sRGB', 4); L.new(bsdf.outputs[0], out.inputs['Surface'])
bake('NORMAL', 'normal', SIZE, 'Non-Color', 4, normal_space='TANGENT')
# roughness and metalness through the emission (the bake has no metalness pass): emission = (0, rough, metal)
nt2 = mat.node_tree; em = nt2.nodes.new('ShaderNodeEmission'); cc = nt2.nodes.new('ShaderNodeCombineColor')
nt2.links.new(attr_r := [n for n in nt2.nodes if n.bl_idname == 'ShaderNodeAttribute' and n.attribute_name == 'rough'][0].outputs['Fac'], cc.inputs[1])
nt2.links.new([n for n in nt2.nodes if n.bl_idname == 'ShaderNodeAttribute' and n.attribute_name == 'metal'][0].outputs['Fac'], cc.inputs[2])
nt2.links.new(cc.outputs[0], em.inputs[0]); outn = [n for n in nt2.nodes if n.bl_idname == 'ShaderNodeOutputMaterial'][0]; old = outn.inputs['Surface'].links[0].from_socket
nt2.links.new(em.outputs[0], outn.inputs['Surface']); bake('EMIT', 'rm', SIZE // 2, 'Non-Color', 1); nt2.links.new(old, outn.inputs['Surface'])
sc.world = bpy.data.worlds.new('w'); bake('AO', 'ao', SIZE // 2, 'Non-Color', int(sys.argv[sys.argv.index('--ao') + 1]) if '--ao' in sys.argv else 24)
bpy.ops.wm.save_as_mainfile(filepath=O + 'redtail-2.blend')
print('done', flush=True)
