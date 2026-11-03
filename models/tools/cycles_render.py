"""The Studio car rendered by Blender's path tracer (Cycles), from the pieces tools/export_parts.js writes out (the SUV
   Studio's cycles_render.py, for any car): what the same model looks like when light is traced properly (soft
   shadows that fall off with distance, light bouncing inside the cabin, glass that bends and reflects), with nothing
   about the model changed. Needs Blender's Python module: pip install bpy.
   usage: python3 models/tools/cycles_render.py <export-dir>/studio <out.png> [view] [width] [height] [samples]
   views: front34 rear34 side wheel cabin (the viewer's own, scaled to the car)"""
import sys, json, math, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import bpy
src, outp = sys.argv[1], sys.argv[2]
view = sys.argv[3] if len(sys.argv) > 3 else 'front34'
W, H = int(sys.argv[4]) if len(sys.argv) > 4 else 1600, int(sys.argv[5]) if len(sys.argv) > 5 else 1000
SAMPLES = int(sys.argv[6]) if len(sys.argv) > 6 else 96
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
from bl_load import load
# (the bay and what the hood hides when it's shut: the render is of the car closed up)
obs, man = load(src, 'cycles', skip=('bay',))
# ---------- the studio: a floor that catches only the shadow, soft boxes, a light grey backdrop ----------
bpy.ops.mesh.primitive_plane_add(size=60); fl = bpy.context.active_object; fl.is_shadow_catcher = True
for o in list(sc.objects):
    if o.name == 'hide': pass
def area(name, size, loc, rot, power, color=(1, 1, 1)):
    d = bpy.data.lights.new(name, 'AREA'); d.shape = 'RECTANGLE'; d.size, d.size_y = size; d.energy = power; d.color = color
    o = bpy.data.objects.new(name, d); o.location = loc; o.rotation_euler = rot; sc.collection.objects.link(o); return o
def aim(o, target):
    import mathutils
    d = mathutils.Vector(target) - o.location; o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
k = area('top', (12, 4), (0, 0, 9), (0, 0, 0), 1100); aim(k, (0, 0, 0))
for y in (-9, 9):
    s = area('strip', (1.6, 8), (1.5, y, 4.5), (0, 0, 0), 260); aim(s, (0, 0, 1))
f = area('front', (6, 4), (11, -3, 4), (0, 0, 0), 520, (1, .97, .93)); aim(f, (0, 0, .8))
r = area('back', (6, 3), (-11, 2, 4), (0, 0, 0), 300, (.92, .96, 1)); aim(r, (0, 0, 1))
key = bpy.data.lights.new('key', 'SUN'); key.energy = 1.6; key.angle = math.radians(6)
ko = bpy.data.objects.new('key', key); ko.location = (3.2, -2.4, 7.5); aim(ko, (0, 0, 0)); sc.collection.objects.link(ko)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (.07, .07, .072, 1)
# ---------- the camera, from the page's views (game axes) ----------
Dm = man['D']; s, h = Dm['L'] / 4.92, Dm['Hr'] / 1.79
VIEWS = {'front34': ((5.6 * s, 1.55 * h, 4.6 * s), (.15 * s, .8 * h, 0)), 'rear34': ((-5.4 * s, 1.7 * h, 4.8 * s), (-.1 * s, .85 * h, 0)), 'side': ((0, 1.0 * h, 8.2 * s), (0, .85 * h, 0))}
pos, tgt = VIEWS[view]; g2b = lambda v: (v[0], -v[2], v[1])
cd = bpy.data.cameras.new('cam'); cd.sensor_fit = 'VERTICAL'; cd.angle = math.radians(28)
co = bpy.data.objects.new('cam', cd); co.location = g2b(pos); aim(co, g2b(tgt)); sc.collection.objects.link(co); sc.camera = co
# ---------- render ----------
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.cycles.max_bounces = 10; sc.cycles.diffuse_bounces = 6; sc.cycles.transparent_max_bounces = 16
sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.resolution_percentage = 100
sc.render.film_transparent = True
try: sc.view_settings.view_transform = 'Khronos PBR Neutral'
except Exception: sc.view_settings.view_transform = 'Standard'
sc.render.filepath = outp + '.raw.png'; sc.render.image_settings.color_mode = 'RGBA'
bpy.ops.render.render(write_still=True)
# the backdrop: the page's light grey behind the truck and its shadow
from PIL import Image
im = Image.open(outp + '.raw.png').convert('RGBA'); bgc = Image.new('RGBA', im.size, (230, 229, 226, 255)); bgc.alpha_composite(im); bgc.convert('RGB').save(outp)
print("saved", outp)
