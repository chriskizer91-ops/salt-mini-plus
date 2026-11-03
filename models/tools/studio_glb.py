"""The Studio car as a .glb (Blender's glTF exporter), from export_parts.js's studio folder: a node for each piece,
   as the game will drive them: the body (one primitive a material: the shell, the face and tail, the cabin and trim
   merged), the lamps on their own (lamp_head, lamp_tail, lamp_amber, lamp_reverse: their materials carry a 'lamp' and a
   'glow' colour in their extras, their glow switched off), the underside and what the hood hides on their own (the
   traffic can leave them out), the hood with its origin on its hinge (it opens by turning about its z), the bay, and
   at each hub a steer_ node (turn it about its y to steer) holding the wheel_ (turn it about its z to roll) and the
   brake_ (the caliper and shield, which only steer).
   usage: python3 models/tools/studio_glb.py <export-dir>/studio <out.glb>"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
from bl_load import load
obs, man = load(sys.argv[1], 'gltf')
bpy.ops.export_scene.gltf(filepath=sys.argv[2], export_format='GLB', export_yup=True, export_extras=True, export_apply=False,
                          export_normals=True, export_tangents=False, export_vertex_color='MATERIAL', export_all_vertex_colors=False, export_materials='EXPORT')
print('saved', sys.argv[2], os.path.getsize(sys.argv[2]))
