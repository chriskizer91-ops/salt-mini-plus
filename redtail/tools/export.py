"""redtail-2.glb: the light model in its pieces, each moving part's origin on its hinge, one baked material, the
glass its own see-through material. Coordinates as the game's (x forward, y up, z right): exported without the
glTF y-up turn."""
import bpy, bmesh, json, numpy as np
from mathutils import Matrix, Vector
O = 'redtail/work/bake/out/'; meta = json.load(open('redtail/work/bake/hi/meta.json')); I = meta['info']; names = list(meta['pieces'])
bpy.ops.wm.open_mainfile(filepath=O + 'redtail-2.blend'); sc = bpy.context.scene
low = bpy.data.objects['redtail_low']; glass = bpy.data.objects['glass']; hi = bpy.data.objects['redtail_high']
bpy.data.objects.remove(hi)
# the baked material
m = bpy.data.materials.new('redtail'); m.use_nodes = True; N = m.node_tree.nodes; L = m.node_tree.links; b = N['Principled BSDF']
def img(n, cs): i = bpy.data.images.load(O + n); i.colorspace_settings.name = cs; t = N.new('ShaderNodeTexImage'); t.image = i; return t
ta = img('albedo_ao.png', 'sRGB'); L.new(ta.outputs['Color'], b.inputs['Base Color'])
tn = img('normal.png', 'Non-Color'); nm = N.new('ShaderNodeNormalMap'); L.new(tn.outputs['Color'], nm.inputs['Color']); L.new(nm.outputs['Normal'], b.inputs['Normal'])
to = img('orm.png', 'Non-Color'); sp = N.new('ShaderNodeSeparateColor'); L.new(to.outputs['Color'], sp.inputs[0]); L.new(sp.outputs[1], b.inputs['Roughness']); L.new(sp.outputs[2], b.inputs['Metallic'])
g = bpy.data.materials.new('glass'); g.use_nodes = True; gb = g.node_tree.nodes['Principled BSDF']; gb.inputs['Base Color'].default_value = (1, 1, 1, 1); gb.inputs['Alpha'].default_value = .22; gb.inputs['Roughness'].default_value = .03
try: g.surface_render_method = 'BLENDED'
except Exception: g.blend_method = 'BLEND'
glass.data.materials.clear(); glass.data.materials.append(g)
for at in [a.name for a in glass.data.attributes if a.name in ('rough', 'metal', 'patw', 'mid')]: glass.data.attributes.remove(glass.data.attributes[at])
# the pieces and their hinges
fl = lambda k: [I[k]['hinge'][0], I[k]['hingeY'], 0]
GROUPS = {'body': (['body', 'wing', 'stab', 'fin', 'cabin', 'brakeR', 'brakeL', 'engine'], None), 'cowl': (['cowl'], None), 'prop': (['prop'], I['prop']['hub']),
  'rudder': (['rudder'], I['rudder']['hinge']), 'elevR': (['elevR'], I['elev']['hinge']), 'elevL': (['elevL'], I['elev']['hinge']),
  'flapR': (['flapR'], fl('flapR')), 'flapL': (['flapL'], fl('flapL')), 'aileronR': (['aileronR'], fl('aileronR')), 'aileronL': (['aileronL'], fl('aileronL')),
  'wheelR': (['wheelR'], I['wheelR']['hub']), 'wheelL': (['wheelL'], I['wheelL']['hub']), 'tailwheel': (['tailwheel'], I['tailwheel']['hub'])}
tot = 0
for gname, (parts, pv) in GROUPS.items():
    want = {names.index(p) for p in parts}; me = low.data.copy(); me.name = gname; bm = bmesh.new(); bm.from_mesh(me)
    lay = bm.faces.layers.int.get('piece'); bmesh.ops.delete(bm, geom=[f for f in bm.faces if f[lay] not in want], context='FACES'); bm.to_mesh(me); bm.free()
    for at in [a.name for a in me.attributes if a.name in ('rough', 'metal', 'patw', 'mid', 'piece', 'Col')]: me.attributes.remove(me.attributes[at])
    ob = bpy.data.objects.new(gname, me); sc.collection.objects.link(ob); me.materials.clear(); me.materials.append(m)
    if pv: me.transform(Matrix.Translation(-Vector(pv))); ob.location = Vector(pv)
    tot += len(me.polygons); print(gname, len(me.polygons))
bpy.data.objects.remove(low)
print('total', tot, '+ glass', len(glass.data.polygons))
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=O + 'redtail-2.glb', export_format='GLB', use_selection=True, export_yup=False, export_apply=True, export_tangents=True,
    export_image_format='WEBP', export_image_quality=88, export_normals=True, export_texcoords=True, export_materials='EXPORT', export_attributes=False)
import os; print('glb MB', round(os.path.getsize(O + 'redtail-2.glb') / 1e6, 2))
