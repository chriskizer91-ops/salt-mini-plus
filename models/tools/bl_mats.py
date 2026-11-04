"""Each of the game's material ids, and the Studio's own, as a Blender material: for the path-traced render
   (cycles_render.py, the SUV Studio's own table) and for the .glb files (studio_glb.py, as glTF can carry them:
   the base colour or the vertex colour, metal, roughness, clear coat, transmission for the lenses, see-through glass,
   and the lamps with their glow colour ready, switched off).
   mat_for(i, inv, B, target): i the id, inv id -> name, B the build's colours (paint, rim, clad, cal), target
   'cycles' or 'gltf'."""
import bpy
def hexlin(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return [(v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4) for v in c] + [1]
LAMP_GLOW = {'head': '#fff3df', 'tail': '#ff1a0a', 'amber': '#ff8a14', 'reverse': '#ffffff'}
def principled(name, base=None, vc=False, metal=0., rough=.5, coat=0., coat_r=.03, emit=None, emit_s=0., sheen=0., trans=0., alpha=1., ior=1.5):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; p = nt.nodes['Principled BSDF']
    if vc:
        a = nt.nodes.new('ShaderNodeVertexColor'); a.layer_name = 'col'
        if base:
            mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs['Factor'].default_value = 1
            nt.links.new(a.outputs['Color'], mx.inputs['A']); mx.inputs['B'].default_value = base; nt.links.new(mx.outputs['Result'], p.inputs['Base Color'])
        else: nt.links.new(a.outputs['Color'], p.inputs['Base Color'])
    elif base: p.inputs['Base Color'].default_value = base
    p.inputs['Metallic'].default_value = metal; p.inputs['Roughness'].default_value = rough; p.inputs['IOR'].default_value = ior
    if coat: p.inputs['Coat Weight'].default_value = coat; p.inputs['Coat Roughness'].default_value = coat_r
    if sheen: p.inputs['Sheen Weight'].default_value = sheen
    if trans: p.inputs['Transmission Weight'].default_value = trans
    if emit: p.inputs['Emission Color'].default_value = emit; p.inputs['Emission Strength'].default_value = emit_s
    if alpha < 1:
        p.inputs['Alpha'].default_value = alpha
        try: m.surface_render_method = 'BLENDED'
        except Exception: pass
        try: m.blend_method = 'BLEND'
        except Exception: pass
    m.use_backface_culling = False
    return m
def thin_glass(name, tint, rough=0.):
    """(Cycles: a single sheet of glass: the reflection it gives by Fresnel, the rest let through with its tint, unbent)"""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    o = nt.nodes.new('ShaderNodeOutputMaterial'); mix = nt.nodes.new('ShaderNodeMixShader'); fr = nt.nodes.new('ShaderNodeFresnel'); fr.inputs['IOR'].default_value = 1.5
    tr = nt.nodes.new('ShaderNodeBsdfTransparent'); tr.inputs['Color'].default_value = tint
    gl = nt.nodes.new('ShaderNodeBsdfGlossy'); gl.inputs['Roughness'].default_value = rough
    nt.links.new(fr.outputs[0], mix.inputs[0]); nt.links.new(tr.outputs[0], mix.inputs[1]); nt.links.new(gl.outputs[0], mix.inputs[2]); nt.links.new(mix.outputs[0], o.inputs['Surface'])
    return m
def lamp_tag(m, kind):
    m['lamp'] = kind; m['glow'] = LAMP_GLOW[kind]; return m
def mat_for(i, inv, B, target='cycles'):
    k = inv.get(i, 'COL'); C = target == 'cycles'
    glass = (lambda n, tint, a: thin_glass(n, tint)) if C else (lambda n, tint, a: principled(n, [tint[0] * .2, tint[1] * .2, tint[2] * .2, 1], rough=.02, alpha=a))
    lens = (lambda n, tint: thin_glass(n, tint)) if C else (lambda n, tint: principled(n, tint, rough=.02, trans=1, ior=1.49))
    if k == 'PAINT': return principled(k, hexlin(B['paint']), metal=.22, rough=.42, coat=1)
    if k == 'ACCENT': return principled(k, hexlin(B['paint2']), metal=.22, rough=.42, coat=1)
    if k == 'GLASS': return glass(k, (.16, .17, .18, 1), .72)
    if k == 'GLASSL': return glass(k, (.6, .62, .64, 1), .42)
    if k in ('CHROME', 'SM_REFLC', 'SM_LUG', 'REV'): return principled(k, (.92, .92, .93, 1), metal=1, rough=.05)
    if k == 'HEAD': return lamp_tag(principled(k, (.92, .92, .93, 1), metal=1, rough=.05, emit=hexlin(LAMP_GLOW['head']), emit_s=0), 'head')
    if k == 'SM_MIRROR': return principled(k, (.95, .95, .95, 1), metal=1, rough=0)
    if k in ('TYRE', 'SM_TREAD', 'SM_TREADAT'): return principled(k, (.025, .025, .027, 1), rough=.9)
    if k == 'SM_WALL': return principled(k, (.028, .028, .03, 1), rough=.75)
    if k == 'TAIL': return lamp_tag(principled(k, (.35, .01, .01, 1), rough=.1, coat=1, emit=hexlin(LAMP_GLOW['tail']), emit_s=0), 'tail')
    if k == 'AMBER': return lamp_tag(principled(k, (.75, .3, .04, 1), rough=.1, coat=1, emit=hexlin(LAMP_GLOW['amber']), emit_s=0), 'amber')
    if k == 'SM_LENS': return lens(k, (.93, .93, .93, 1))
    if k == 'SM_LENSH': return lamp_tag(lens(k, (.95, .95, .95, 1)), 'head') if C else lamp_tag(principled(k, (.95, .95, .95, 1), rough=.02, trans=1, ior=1.49, emit=hexlin(LAMP_GLOW['head']), emit_s=0), 'head')
    if k == 'SM_LENSR': return lamp_tag(lens(k, (.95, .95, .95, 1)), 'reverse') if C else lamp_tag(principled(k, (.95, .95, .95, 1), rough=.02, trans=1, ior=1.49, emit=(1, 1, 1, 1), emit_s=0), 'reverse')
    if k == 'SM_REDL': return lamp_tag(thin_glass(k, (.75, .03, .02, 1)), 'tail') if C else lamp_tag(principled(k, (.6, .02, .015, 1), rough=.03, trans=.55, ior=1.49, emit=hexlin(LAMP_GLOW['tail']), emit_s=0), 'tail')
    if k == 'SM_AMBERL': return lamp_tag(thin_glass(k, (.95, .45, .05, 1)), 'amber') if C else lamp_tag(principled(k, (.95, .45, .05, 1), rough=.02, trans=.75, ior=1.49, emit=hexlin(LAMP_GLOW['amber']), emit_s=0), 'amber')
    if k == 'SM_REFR': return principled(k, (.45, .02, .01, 1), metal=.2, rough=.12, coat=1)
    if k == 'SM_LAMPH': return lamp_tag(principled(k, (.95, .96, .97, 1), rough=.04, coat=1, emit=hexlin(LAMP_GLOW['head']), emit_s=0), 'head')
    if k == 'SM_TINT': return glass(k, (.3, .3, .3, 1), .6)
    if k in ('MESH', 'SM_HONEY', 'SM_GLOSSBLK', 'SMOKE'): return principled(k, vc=k == 'SM_GLOSSBLK', base=None if k == 'SM_GLOSSBLK' else (.01, .01, .011, 1), rough=.18, coat=.6)
    if k == 'RIM': return principled(k, hexlin(B['rim']), metal=1, rough=.25)
    if k in ('UNDERGLOW', 'STRIP'): return principled(k, hexlin(B['paint2']), rough=.3, emit=hexlin(B['paint2']), emit_s=3.0)
    if k == 'SM_WHITE': return principled(k, vc=True, metal=.05, rough=.35, coat=.8, coat_r=.06)
    if k == 'SM_BRUSH': return principled(k, vc=True, metal=1, rough=.15)
    if k == 'SM_ROTORF': return principled(k, vc=True, metal=.85, rough=.38)
    if k in ('SM_CAST', 'SM_ENGINE'): return principled(k, vc=True, metal=.7 if k == 'SM_CAST' else .6, rough=.55 if k == 'SM_CAST' else .42)
    if k in ('CLAD', 'SM_CLADS'): return principled(k, hexlin(B['clad']), rough=.72)
    if k in ('SM_LINER', 'SM_BEDLINER'): return principled(k, vc=True, rough=.82)
    if k == 'SM_PLASTIC': return principled(k, vc=True, rough=.7)
    if k == 'SM_PAINTED': return principled(k, vc=True, metal=.1, rough=.42, coat=.6, coat_r=.08)
    if k == 'SM_HOSE': return principled(k, vc=True, rough=.6)
    if k == 'CALIPER': return principled(k, hexlin(B['cal']), rough=.35, coat=.6)
    if k == 'ROTOR': return principled(k, (.35, .35, .37, 1), metal=.9, rough=.32)
    if k == 'PLATE': return principled(k, (.72, .72, .66, 1), rough=.4)
    if k == 'SHUT': return principled(k, (.01, .01, .01, 1), rough=.7)
    if k in ('SM_SEAT', 'SM_CARPET', 'SM_HEADLINER', 'FABRIC', 'SM_CLOTH'): return principled(k, vc=True, rough=.95, sheen=.5)
    if k in ('SM_VINYL', 'SM_DASH', 'SM_SEAL', 'SM_TRIMIN'): return principled(k, vc=True, rough=.7)
    if k == 'SM_SATIN': return principled(k, vc=True, metal=.8, rough=.32)
    if k == 'SM_BOLT': return principled(k, vc=True, metal=1, rough=.3)
    if k == 'SM_BULB': return principled(k, (1, .97, .9, 1), rough=.2, emit=(1, .95, .85, 1), emit_s=1.5 if C else 0)
    if k in ('LED', 'HALO'): return lamp_tag(principled(k, (1, 1, 1, 1), emit=(1, 1, 1, 1), emit_s=3 if C else 0), 'head')
    if k == 'EMIT': return principled(k, (1, 1, 1, 1), emit=(1, 1, 1, 1), emit_s=3)
    if k == 'SM_GAUGE': return principled(k, vc=True, rough=.3)
    if k in ('METAL', 'RUBBER'): return principled(k, vc=True, metal=.55 if k == 'METAL' else 0, rough=.45 if k == 'METAL' else .85)
    if k == 'CARBON': return principled(k, (.015, .015, .017, 1), rough=.25, coat=.8)
    return principled(k, vc=True, rough=.55)
