"""A baked car packed for the game (Baked SUV Test's pack_game.py, cargames baked-suv-test/tools/bake, for any car),
   from models/tools/bake.py's out folder, as models/<car>/<car>_baked_data.js (BAKED_CARS[<car>], one file a car).
   - One picture set for the whole truck, an atlas 2048 x 3072: the body's 2048 square on top, the wheel's 1024
     square under it on the left. Three pictures: colour (its alpha the paint mask), normals (in the truck's own
     axes), and occlusion + roughness + metal (its alpha the clear coat). One set means the car's shader needs only
     three more samplers and the wheel draws with the body's.
   - The meshes the game draws a car with, as its builders split them: the body, the hood, what the hood hides,
     and the wheel. Each vertex: position (16-bit in its box), normal (8-bit), its place on the atlas (16-bit, already
     turned to the way the game uploads pictures: the top row first), and its material (32: baked; 33-36: baked
     and a lamp, so it still lights: 33 a tail and brake lamp, 34 a headlamp, 35 an amber lamp, 36 a reversing lamp;
     2 and 3: the game's two glasses; 16: the dark underside). Which of the game's materials each baked triangle had
     is found by matching it to the game's own triangle in tools/bake/export.js's lists (the same corners).
   Which of the game's materials each baked triangle had is kept with it by the bake (models/tools/bake.py).
   usage: python3 models/tools/pack_game.py <bake-out-dir> <car> <out.js> [quality]"""
import sys, os, io, json, base64
import numpy as np
from PIL import Image
D, CAR, OUT = sys.argv[1], sys.argv[2], sys.argv[3]; Q = int(sys.argv[4]) if len(sys.argv) > 4 else 85
W, H, SK, WH = 2048, 3072, 2048, 1024
b64 = lambda a: base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()
def raw(name, uv):
    """a bake mesh: positions, normals, (picture coordinates), part, game material, each a block"""
    r = np.fromfile(os.path.join(D, name + '.bin'), dtype=np.float32); k = 10 if uv else 8; n = len(r) // k
    P = r[:n * 3].reshape(-1, 3); N = r[n * 3:n * 6].reshape(-1, 3); o = n * 6
    U = r[o:o + n * 2].reshape(-1, 2) if uv else np.zeros((n, 2), np.float32); o += n * 2 if uv else 0
    G = r[o:o + n].astype(np.int32); GM = r[o + n:o + 2 * n].astype(np.int32)
    return P, N, U, G, GM
def atlas_uv(U, region):
    s, t = U[:, 0].copy(), 1 - U[:, 1]
    if region == 'skin': return np.c_[s * SK / W, t * SK / H]
    return np.c_[s * WH / W, (SK + t * WH) / H]
LAMP = {7: 33, 8: 34, 9: 34, 29: 34, 10: 35, 23: 36}
pieces = {'body': [], 'hood': [], 'hide': [], 'wheel': []}
P, N, U, G, GM = raw('skin', True); UA = atlas_uv(U, 'skin'); MS = np.array([LAMP.get(m, 32) for m in GM])
for g, part in enumerate(('body', 'hood', 'hide')):
    sel = G == g; pieces[part].append((P[sel], N[sel], UA[sel], MS[sel]))
P, N, U, G, MG = raw('glass', False)
for g, part in enumerate(('body', 'hood', 'hide')):
    sel = G == g; pieces[part].append((P[sel], N[sel], np.zeros((sel.sum(), 2)), MG[sel]))
P, N, U, G, _ = raw('under', False)
for g, part in enumerate(('body', 'hood', 'hide')):
    sel = G == g; pieces[part].append((P[sel], N[sel], np.zeros((sel.sum(), 2)), np.full(sel.sum(), 16)))
P, N, U, G, _ = raw('wheel', True); pieces['wheel'].append((P, N, atlas_uv(U, 'wheel'), np.full(len(P), 32)))
def pack(lst):
    P = np.concatenate([a[0] for a in lst]); N = np.concatenate([a[1] for a in lst]); U = np.concatenate([a[2] for a in lst]); M = np.concatenate([a[3] for a in lst])
    # (a piece with nothing in it, as a traffic car's hood, which is part of its body: written empty)
    if len(P) == 0: return {'v': 0, 't': 0}
    N = N / (np.linalg.norm(N, axis=1, keepdims=True) + 1e-9)
    key = np.c_[np.round(P * 2e4), np.round(N * 127), np.round(U * 65535), M].astype(np.int64)
    uq, inv = np.unique(key, axis=0, return_inverse=True); inv = inv.ravel()
    first = np.zeros(len(uq), np.int64); first[inv[::-1]] = np.arange(len(inv))[::-1]
    p, nn, u, m = P[first], N[first], U[first], M[first]
    lo = p.min(0); sc = np.maximum(p.max(0) - lo, 1e-6)
    I = inv.astype(np.uint32 if len(uq) > 65535 else np.uint16)
    return {'v': int(len(uq)), 't': int(len(I) // 3), 'box': [float(x) for x in list(lo) + list(sc)],
            'P': b64(np.round((p - lo) / sc * 65535).astype(np.uint16)), 'N': b64(np.round(nn * 127).astype(np.int8)),
            'U': b64(np.round(np.clip(u, 0, 1) * 65535).astype(np.uint16)), 'M': b64(m.astype(np.uint8)), 'I': b64(I), 'i32': bool(len(uq) > 65535)}
parts = {k: pack(v) for k, v in pieces.items()}
# ---------- the atlas ----------
L = lambda n: Image.open(os.path.join(D, n + '.png'))
def put(dst, skin, wheel):
    dst.paste(skin.resize((SK, SK), Image.LANCZOS), (0, 0)); dst.paste(wheel.resize((WH, WH), Image.LANCZOS), (0, SK)); return dst
grey = lambda n: np.asarray(L(n).convert('L'), np.float32)
def orm(tag, coat):
    ao, me = grey(tag + '_ao'), grey(tag + '_metal'); ao = np.maximum(ao, me * .9)
    # (the clear coat as a clean mask: the paint and the lamps' insides have it whole; a faint coat bled in round
    # their edges onto the black plastics would make them glossy)
    cc = grey(tag + '_coat') if coat else np.zeros_like(ao); cc = np.where(cc > 110, cc, 0)
    ch = [ao, grey(tag + '_rough'), me, cc]
    return Image.fromarray(np.stack(ch, -1).clip(0, 255).astype(np.uint8), 'RGBA')
def colour(tag, paint):
    c = np.asarray(L(tag + '_col').convert('RGB'), np.uint8); a = grey(tag + '_paint') if paint else np.zeros(c.shape[:2], np.float32)
    return Image.fromarray(np.concatenate([c, a.clip(0, 255).astype(np.uint8)[..., None]], -1), 'RGBA')
col = put(Image.new('RGBA', (W, H), (8, 8, 8, 0)), colour('skin', True), colour('wheel', False))
nrm = put(Image.new('RGB', (W, H), (128, 255, 128)), L('skin_nrm').convert('RGB'), L('wheel_nrm').convert('RGB'))
# (a traffic car baked with GLOW=1: where its head and tail lamps are, in the normals' alpha, so the page can light them)
GLOW = os.path.exists(os.path.join(D, 'skin_glow.png'))
if GLOW:
    g = Image.new('L', (W, H), 0); g.paste(L('skin_glow').convert('L').resize((SK, SK), Image.LANCZOS), (0, 0)); nrm.putalpha(g)
ormi = put(Image.new('RGBA', (W, H), (255, 128, 0, 0)), orm('skin', True), orm('wheel', False))
def webp(im, q):
    # (exact: WebP otherwise throws away the colour under a fully clear alpha, and here the alpha is a mask, not see-through)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=6, alpha_quality=100, exact=True); return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode(), len(b.getvalue())
(cs, cn), (ns, nn_), (os_, on) = webp(col, Q), webp(nrm, 92), webp(ormi, Q)
js = ('/* =====================================================================================\n'
      '   THE BAKED ' + CAR.upper() + '\'S DATA, in the game\'s own mesh form, written by models/tools/pack_game.py: the game\'s own\n'
      '   meshes of the car (the body, the hood, what the hood hides, the wheel) with their places on one picture atlas,\n'
      '   and the atlas (colour + paint mask, normals in the car\'s own axes, occlusion + roughness + metal + clear coat) as\n'
      '   WebP. Materials as Baked SUV Test\'s: 32 baked, 33 tail and brake, 34 head, 35 amber, 36 reversing (baked and\n'
      '   a lamp), 2 and 3 the game\'s glass, 16 the dark underside. One file a car: BAKED_CARS[\'' + CAR + '\'].\n'
      '   ===================================================================================== */\n'
      'var BAKED_CARS=BAKED_CARS||{};BAKED_CARS[' + json.dumps(CAR) + ']=' + json.dumps({'atlas': {'w': W, 'h': H, 'col': cs, 'nrm': ns, 'orm': os_, **({'glow': 1} if GLOW else {})}, 'parts': parts}) + ';\n')
open(OUT, 'w').write(js)
print({k: (v['v'], v['t']) for k, v in parts.items()}, 'lamps', {m: int((MS == m).sum() // 3) for m in (33, 34, 35, 36)}, 'pictures KB', cn // 1024, nn_ // 1024, on // 1024, 'file KB', len(js) // 1024)
