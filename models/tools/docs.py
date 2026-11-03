"""A car's pictures and numbers, from what make_car.sh has made in its work folder:
   - models/<car>/docs/*.webp: each picture as WebP (exact: the colour kept under any clear alpha); the side by side
     of the game's own, the Studio and the baked car; the Cycles render; the .glb check.
   - models/<car>/numbers.json: triangles, draws and texture memory for each version, the files' sizes.
   usage: python3 models/tools/docs.py <car> <work-dir>"""
import sys, os, json, glob, struct
from PIL import Image, ImageDraw, ImageFont
CAR, X = sys.argv[1], sys.argv[2]
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); M = os.path.join(ROOT, CAR); DOC = os.path.join(M, 'docs'); os.makedirs(DOC, exist_ok=True)
F = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', s)
def webp(im, name, q=90):
    p = os.path.join(DOC, name + '.webp'); im.save(p, 'WEBP', quality=q, method=6, exact=True); return p
SH = os.path.join(X, 'shots')
# ---------- the Studio's pictures ----------
for f in sorted(glob.glob(os.path.join(SH, CAR + '_studio_*.png'))):
    v = os.path.basename(f)[len(CAR + '_studio_'):-4]; webp(Image.open(f).convert('RGB'), v)
# ---------- the three side by side ----------
ims = [Image.open(os.path.join(SH, '%s_%s_front34.png' % (CAR, v))).convert('RGB') for v in ('game', 'studio', 'baked')]
W, H = ims[0].size; cw = int(W * .84); x0 = int(W * .12); y0, y1 = int(H * .14), int(H * .9)
sbs = Image.new('RGB', (cw * 3, y1 - y0), (230, 229, 226)); d = ImageDraw.Draw(sbs)
for i, (im, t) in enumerate(zip(ims, ('Game\'s own', 'Studio', 'Baked'))):
    sbs.paste(im.crop((x0, y0, x0 + cw, y1)), (i * cw, 0)); d.text((i * cw + 28, 26), t, fill=(40, 40, 40), font=F(30))
webp(sbs, 'compare')
for f, n in ((os.path.join(X, 'cycles_front34.png'), 'cycles_front34'), (os.path.join(X, 'glb_check.png'), 'glb_check'), (os.path.join(X, 'glb_check_baked.png'), 'glb_check_baked')):
    if os.path.exists(f): webp(Image.open(f).convert('RGB'), n)
# ---------- the numbers ----------
st = json.load(open(os.path.join(X, 'studio', 'manifest.json'))); bk = json.load(open(os.path.join(X, 'bake-in', 'manifest.json')))
T = st['tris']; shut = sum(v for k, v in T.items() if k != 'bay')
def glb_prims(p, skip=()):
    b = open(p, 'rb').read(); jl = struct.unpack('<I', b[12:16])[0]; J = json.loads(b[20:20 + jl]); n = 0; t = 0
    for nd in J['nodes']:
        if 'mesh' in nd and nd.get('name') not in skip:
            for pr in J['meshes'][nd['mesh']]['primitives']: n += 1; t += J['accessors'][pr['indices']]['count'] // 3
    return n, t
glbS = os.path.join(M, CAR + '_studio.glb'); glbB = os.path.join(M, CAR + '_baked.glb')
gS, gB = glb_prims(glbS, ('bay',)), glb_prims(glbB, ('bay', 'hood_pad'))
gSt = glb_prims(glbS, ('bay', 'under', 'hide'))
lowT = bk['pieces']['low_skin']['tris'] + bk['pieces']['low_glass']['tris'] + bk['pieces']['low_under']['tris'] + 4 * bk['pieces']['low_wheel']['tris']
mb = lambda p: round(os.path.getsize(p) / 1048576, 1)
tex = lambda w, h: round(w * h * 4 * 3 * 4 / 3 / 1048576, 1)
N = {'car': CAR,
     'game': {'triangles': lowT, 'draws_game': 7, 'texture_mb': 0},
     'studio': {'triangles': shut, 'triangles_bay': T.get('bay', 0), 'by_piece': T, 'draws_game': 13, 'draws_game_traffic': 11, 'draws_glb': gS[0], 'draws_glb_traffic': gSt[0],
                'texture_mb': 0, 'glb_mb': mb(glbS), 'data_mb': mb(os.path.join(M, CAR + '_studio_data.js'))},
     'baked': {'triangles': gB[1], 'draws_game': 7, 'draws_glb': gB[0], 'texture_mb_low': tex(1024, 1536), 'texture_mb_medium': tex(2048, 3072),
               'glb_mb': mb(glbB), 'data_mb': mb(os.path.join(M, CAR + '_baked_data.js'))}}
json.dump(N, open(os.path.join(M, 'numbers.json'), 'w'), indent=1)
print(json.dumps(N, indent=1))
