"""A traffic car (models/tools/traffic_lod.py's out folder) packed plain, without the bake, for the traffic test page:
   the game's own flat colours and materials on the cut-down mesh, as TRAFFIC_PLAIN[<key>] in one .js file.
   Each piece in the game's mesh form, as viewer/src/mats.js mergedMeshes takes it: positions (9 a triangle),
   normals (9), colours (12: RGBA, A the game's glow flag) and the material (3, one a corner), Float32 in base64.
   usage: python3 models/tools/pack_traffic.py <lod-dir> <key> <out.js> <export-dir>/bake-in/manifest.json (for the materials)"""
import sys, os, json, base64
import numpy as np
D, KEY, OUT = sys.argv[1:4]; MAT = json.load(open(sys.argv[4]))['MAT']
b64 = lambda a: base64.b64encode(np.ascontiguousarray(a, np.float32).tobytes()).decode()
def piece(name, colour=None):
    raw = np.fromfile(os.path.join(D, name + '.bin'), np.float32); n = len(raw) // 32
    P, N, C, M = raw[:n * 9], raw[n * 9:n * 18], raw[n * 18:n * 30].reshape(-1, 4).copy(), raw[n * 30:n * 31]
    if colour is not None: C[:] = colour(np.repeat(M, 3))
    C[:, 3] = np.where(C[:, 3] > 0, C[:, 3], 0)
    return {'t': int(n), 'p': b64(P), 'n': b64(N), 'c': b64(C.reshape(-1)), 'm': b64(np.repeat(M, 3))}
lod = json.load(open(os.path.join(D, 'lod.json')))
# (the underside the game's own dark grey, the wheel's tyre near black and its face mid grey: none of them glowing)
under = lambda m: np.tile(np.array([.028, .028, .03, 0], np.float32), (len(m), 1))
def wheel(m):
    c = np.tile(np.array([.4, .4, .42, 0], np.float32), (len(m), 1)); c[m == MAT['TYRE']] = [.032, .032, .034, 0]; return c
data = {'skin': piece('low_skin'), 'glass': piece('low_glass'), 'under': piece('low_under', under), 'wheel': piece('low_wheel', wheel), 'lod': lod}
js = ('/* A TRAFFIC CAR, PLAIN: ' + KEY + ', the game\'s own colours on the cut-down mesh (models/tools/traffic_lod.py, packed by\n'
      '   models/tools/pack_traffic.py). TRAFFIC_PLAIN[\'' + KEY + '\']. */\n'
      'var TRAFFIC_PLAIN=TRAFFIC_PLAIN||{};TRAFFIC_PLAIN[' + json.dumps(KEY) + ']=' + json.dumps(data) + ';\n')
open(OUT, 'w').write(js)
print(KEY, {k: v['t'] for k, v in data.items() if k != 'lod'}, 'file KB', len(js) // 1024)
