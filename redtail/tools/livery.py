"""A paint job for redtail-2 from five pictures of it (left side, right side, top, underside, front, each framed on
its own): python3 livery.py <folder> <prefix> <out-name>
1. redtail-2's own low model (the GLB): every texel of its 2048 colour picture gets its 3D point, normal and piece;
   the detailed model (redtail-1) says which texels are paint (fabric and painted metal: 109-112).
2. Each picture: the plane cut out from its grey background; the model's own outline in that view (drawn straight
   on) fitted onto it (scale across and up, a turn, a shift) by making the two outlines overlap as much as they can.
3. Each paint texel takes its colour from the pictures that see it: weighted by how squarely it faces each view, and
   only where nothing stands in front of it in that view (a depth test against the model drawn from that side).
4. Texels no picture sees are filled from their neighbours; the model's crevice shading (AO) goes on top, lightly;
   everything that isn't paint (tyres, glass, metal, seats) keeps redtail-2's own colour.
Writes <out>.png (sRGB, 2048) and <out>-fit.json (each view's fit and its overlap)."""
import sys, json, struct, numpy as np
from PIL import Image
from scipy import ndimage, optimize
from scipy.spatial import cKDTree
SRC, PRE, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
GLB = 'redtail/versions/redtail-2/redtail-2.glb'
N = 2048
# ---------- the low model (redtail-2) ----------
b = open(GLB, 'rb').read(); L = struct.unpack('<I', b[12:16])[0]; J = json.loads(b[20:20 + L]); BIN = b[20 + L + 8:]
def acc(i):
    a = J['accessors'][i]; v = J['bufferViews'][a['bufferView']]; o = v.get('byteOffset', 0) + a.get('byteOffset', 0)
    n = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3}[a['type']]; dt = {5126: np.float32, 5123: np.uint16, 5125: np.uint32}[a['componentType']]
    return np.frombuffer(BIN, dt, a['count'] * n, o).reshape(-1, n) if n > 1 else np.frombuffer(BIN, dt, a['count'], o)
P, NR, UV, TRI, PID, NAMES = [], [], [], [], [], []
base = 0
for nd in J['nodes']:
    if nd['name'] == 'glass': continue
    pr = J['meshes'][nd['mesh']]['primitives'][0]; A = pr['attributes']
    p = acc(A['POSITION']).astype(np.float64) + np.array(nd.get('translation', [0, 0, 0])); n = acc(A['NORMAL']).astype(np.float64); uv = acc(A['TEXCOORD_0']).astype(np.float64)
    t = acc(pr['indices']).reshape(-1, 3).astype(np.int64) + base
    P.append(p); NR.append(n); UV.append(uv); TRI.append(t); PID += [len(NAMES)] * len(t); NAMES.append(nd['name']); base += len(p)
P = np.concatenate(P); NR = np.concatenate(NR); UV = np.concatenate(UV); TRI = np.concatenate(TRI); PID = np.array(PID)
print('low model', len(TRI), 'triangles', NAMES)
# ---------- texel -> point, normal, piece (rasterised in the picture's own layout) ----------
pos = np.zeros((N, N, 3)); nrm = np.zeros((N, N, 3)); cov = np.zeros((N, N), bool); tpid = np.full((N, N), -1)
U = UV * N - .5
for k, (i0, i1, i2) in enumerate(TRI):
    a, b2, c = U[i0], U[i1], U[i2]
    x0, x1 = int(np.floor(min(a[0], b2[0], c[0]))), int(np.ceil(max(a[0], b2[0], c[0]))); y0, y1 = int(np.floor(min(a[1], b2[1], c[1]))), int(np.ceil(max(a[1], b2[1], c[1])))
    x0, y0 = max(x0, 0), max(y0, 0); x1, y1 = min(x1, N - 1), min(y1, N - 1)
    if x1 < x0 or y1 < y0: continue
    X, Y = np.meshgrid(np.arange(x0, x1 + 1), np.arange(y0, y1 + 1))
    d = (b2[1] - c[1]) * (a[0] - c[0]) + (c[0] - b2[0]) * (a[1] - c[1])
    if abs(d) < 1e-12: continue
    w0 = ((b2[1] - c[1]) * (X - c[0]) + (c[0] - b2[0]) * (Y - c[1])) / d; w1 = ((c[1] - a[1]) * (X - c[0]) + (a[0] - c[0]) * (Y - c[1])) / d; w2 = 1 - w0 - w1
    m = (w0 >= -1e-4) & (w1 >= -1e-4) & (w2 >= -1e-4)
    if not m.any(): continue
    yy, xx = Y[m], X[m]; W = np.stack([w0[m], w1[m], w2[m]], 1)
    pos[yy, xx] = W @ P[[i0, i1, i2]]; nn = W @ NR[[i0, i1, i2]]; nrm[yy, xx] = nn / np.linalg.norm(nn, axis=1, keepdims=True).clip(1e-9); cov[yy, xx] = True; tpid[yy, xx] = PID[k]
print('texels covered', int(cov.sum()))
# ---------- which texels are paint: the detailed model's material, nearest triangle facing the same way ----------
HI = 'redtail/work/bake/hi/'; meta = json.load(open(HI + 'meta.json'))
C, CN, CM = [], [], []
for nm in meta['pieces']:
    if nm == 'glass': continue
    pp = np.fromfile(HI + nm + '.pos', np.float32).reshape(-1, 3, 3); nn = np.fromfile(HI + nm + '.nrm', np.float32).reshape(-1, 3, 3); mm = np.fromfile(HI + nm + '.mat', np.uint8)
    C.append(pp.mean(1)); CN.append(nn.mean(1)); CM.append(mm)
C = np.concatenate(C); CN = np.concatenate(CN); CM = np.concatenate(CM)
tree = cKDTree(C); iy, ix = np.nonzero(cov); q = pos[iy, ix]; qn = nrm[iy, ix]
dd, ii = tree.query(q, k=6); ok = np.einsum('ijk,ik->ij', CN[ii], qn) > .2; pick = np.where(ok.any(1), ii[np.arange(len(ii)), ok.argmax(1)], ii[:, 0])
mat = np.zeros((N, N), np.int32); mat[iy, ix] = CM[pick]
paint = cov & np.isin(mat, [109, 110, 111, 112])
print('paint texels', int(paint.sum()), {int(k): int((mat[cov] == k).sum()) for k in (109, 110, 111, 112)})
# ---------- the five views: straight on, canonical axes (across, up) and depth toward the camera ----------
VIEWS = {'left-side': (lambda p: (-p[..., 0], p[..., 1], -p[..., 2]), np.array([0, 0, -1.])),
         'right-side': (lambda p: (p[..., 0], p[..., 1], p[..., 2]), np.array([0, 0, 1.])),
         'top': (lambda p: (p[..., 2], p[..., 0], p[..., 1]), np.array([0, 1., 0])),
         'underside': (lambda p: (-p[..., 2], p[..., 0], -p[..., 1]), np.array([0, -1., 0])),
         'front': (lambda p: (-p[..., 2], p[..., 1], p[..., 0]), np.array([1., 0, 0]))}
K = 100.0                                    # the model drawn at 100 px a metre in each view
OCC = [i for i, nm in enumerate(NAMES) if nm != 'prop']
def zbuffer(f):
    a, bb, d = f(P); a0, b0 = a.min() - .2, bb.max() + .2; Wd, Hd = int((a.max() - a0 + .2) * K) + 2, int((b0 - bb.min() + .2) * K) + 2
    Z = np.full((Hd, Wd), -1e9); X = (a - a0) * K; Y = (b0 - bb) * K
    for k in np.nonzero(np.isin(PID, OCC))[0]:
        i = TRI[k]; xa, ya, za = X[i], Y[i], d[i]
        x0, x1 = max(int(np.floor(xa.min())), 0), min(int(np.ceil(xa.max())), Wd - 1); y0, y1 = max(int(np.floor(ya.min())), 0), min(int(np.ceil(ya.max())), Hd - 1)
        if x1 < x0 or y1 < y0: continue
        XX, YY = np.meshgrid(np.arange(x0, x1 + 1), np.arange(y0, y1 + 1)); den = (ya[1] - ya[2]) * (xa[0] - xa[2]) + (xa[2] - xa[1]) * (ya[0] - ya[2])
        if abs(den) < 1e-9: continue
        w0 = ((ya[1] - ya[2]) * (XX - xa[2]) + (xa[2] - xa[1]) * (YY - ya[2])) / den; w1 = ((ya[2] - ya[0]) * (XX - xa[2]) + (xa[0] - xa[2]) * (YY - ya[2])) / den; w2 = 1 - w0 - w1
        m = (w0 >= -.02) & (w1 >= -.02) & (w2 >= -.02)
        if m.any(): z = w0 * za[0] + w1 * za[1] + w2 * za[2]; Z[YY[m], XX[m]] = np.maximum(Z[YY[m], XX[m]], z[m])
    return Z, a0, b0
def cutout(im):
    a = np.asarray(im, np.float64); h, w = a.shape[:2]; edge = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
    bg = np.median(edge, 0); d = np.sqrt(((a - bg) ** 2).sum(2)); sat = a.max(2) - a.min(2)
    m = (d > 26) | ((d > 14) & (sat > 22)); m[int(h * .9):, :int(w * .14)] = False          # (the view's label, bottom left)
    m = ndimage.binary_opening(m, iterations=1); lab, nl = ndimage.label(m)
    if nl > 1:
        sz = ndimage.sum(m, lab, range(1, nl + 1)); keep = np.isin(lab, 1 + np.nonzero(sz > sz.max() * .004)[0]); m = keep
    return m, bg
def fitview(name, im, Z, a0, b0):
    m, bg = cutout(im); h, w = m.shape; ds = max(1, int(round(w / 520))); ms = m[::ds, ::ds].astype(float); hs, ws = ms.shape
    mm = Z > -1e8; Hm, Wm = mm.shape
    ys, xs = np.nonzero(m); yz, xz = np.nonzero(mm)
    sx0 = (xs.max() - xs.min()) / (xz.max() - xz.min()) / ds; sy0 = (ys.max() - ys.min()) / (yz.max() - yz.min()) / ds
    tx0 = xs.min() / ds - xz.min() * sx0; ty0 = ys.min() / ds - yz.min() * sy0
    gy, gx = np.mgrid[0:hs, 0:ws].astype(float); sm = ndimage.gaussian_filter(ms, 1.2); mmf = ndimage.gaussian_filter(mm.astype(float), 1.2 * K / 100)
    def pred(p):
        sx, sy, th, tx, ty = p; c, s = np.cos(th), np.sin(th); X = gx - tx; Y = gy - ty
        u = (c * X + s * Y) / sx; v = (-s * X + c * Y) / sy                                   # image -> model-drawing pixels
        return ndimage.map_coordinates(mmf, [v, u], order=1, cval=0)
    def cost(p): q = pred(p); r = p[1] / p[0]; return -(2 * (q * sm).sum() / (q.sum() + sm.sum() + 1e-9)) + 4 * max(0, abs(np.log(r)) - .16) ** 2 + 2 * max(0, abs(p[2]) - .06) ** 2
    p0 = np.array([sx0, sy0, 0, tx0, ty0]); best = optimize.minimize(cost, p0, method='Powell', options={'xtol': 1e-3, 'ftol': 1e-5, 'maxiter': 4000})
    q = pred(best.x) > .5; iou = (q & (ms > .5)).sum() / ((q | (ms > .5)).sum() + 1e-9)
    sx, sy, th, tx, ty = best.x
    # model metres (across, up) -> picture pixels
    def to_px(a, bb):
        X = (a - a0) * K * sx; Y = (b0 - bb) * K * sy; c, s = np.cos(th), np.sin(th)
        return (c * X - s * Y + tx) * ds, (s * X + c * Y + ty) * ds
    return to_px, m, {'iou': round(float(iou), 3), 'scale_px_per_m': [round(float(sx * K * ds), 1), round(float(sy * K * ds), 1)], 'turn_deg': round(float(np.degrees(th)), 2)}
lin = lambda x: np.where(x <= .04045, x / 12.92, ((x + .055) / 1.055) ** 2.4)
srgb = lambda x: np.where(x <= .0031308, x * 12.92, 1.055 * np.power(np.clip(x, 0, None), 1 / 2.4) - .055)
acc_c = np.zeros((N, N, 3)); acc_w = np.zeros((N, N)); fits = {}
py, px = np.nonzero(paint); pp = pos[py, px]; pn = nrm[py, px]
for name, (f, dirv) in VIEWS.items():
    if name == 'front' and '--nofront' in sys.argv: continue
    im = Image.open(f'{SRC}/{PRE}_{name}.png').convert('RGB'); Z, a0, b0 = zbuffer(f)
    to_px, m, info = fitview(name, im, Z, a0, b0); fits[name] = info; print(name, info, flush=True)
    if info['iou'] < .6: print('  (fit too poor: this view left out)'); continue
    a, bb, d = f(pp); u, v = to_px(a, bb)
    zx = ((a - a0) * K).round().astype(int).clip(0, Z.shape[1] - 1); zy = ((b0 - bb) * K).round().astype(int).clip(0, Z.shape[0] - 1)
    zmax = ndimage.maximum_filter(Z, size=3)[zy, zx]; vis = d >= zmax - .035
    face = (pn @ dirv).clip(0, 1) ** 2
    me = ndimage.binary_erosion(m, iterations=3); inside = (u >= 0) & (u < m.shape[1] - 1) & (v >= 0) & (v < m.shape[0] - 1)
    ui, vi = u.clip(0, m.shape[1] - 1).round().astype(int), v.clip(0, m.shape[0] - 1).round().astype(int); onplane = inside & me[vi, ui]
    w = face * vis * onplane; A = lin(np.asarray(im, np.float64) / 255)
    col = np.stack([ndimage.map_coordinates(A[..., ch], [v, u], order=1, mode='nearest') for ch in range(3)], 1)
    acc_c[py, px] += col * w[:, None]; acc_w[py, px] += w
    print('  texels it paints', int((w > .05).sum()), flush=True)
json.dump(fits, open(OUT + '-fit.json', 'w'), indent=1)
got = paint & (acc_w > .03); colr = np.zeros((N, N, 3)); colr[got] = acc_c[got] / acc_w[got][:, None]
print('paint texels seen by a picture', int(got.sum()), 'of', int(paint.sum()))
# ---------- unseen paint: filled from the neighbours, out to 40 texels; the rest the paint's own middle colour ----------
fill = got.copy()
for it in range(40):
    todo = paint & ~fill
    if not todo.any(): break
    s = ndimage.uniform_filter(colr * fill[..., None], (5, 5, 1)); c = ndimage.uniform_filter(fill.astype(float), 5)
    new = todo & (c > .05); colr[new] = s[new] / c[new][:, None]; fill |= new
rest = paint & ~fill
if rest.any(): colr[rest] = np.median(colr[got], 0)
print('filled from neighbours', int((fill & ~got).sum()), 'left to the middle colour', int(rest.sum()))
# ---------- the crevices' shade, lightly; the rest keeps redtail-2's own colour ----------
ao = np.asarray(Image.open('redtail/versions/redtail-2/ao.png').convert('L').resize((N, N), Image.BILINEAR), np.float64) / 255
orig = lin(np.asarray(Image.open('redtail/versions/redtail-2/albedo_ao.png').convert('RGB'), np.float64) / 255)
outl = orig.copy(); outl[paint] = colr[paint] * (.72 + .28 * ao[paint])[:, None]
# (a seam's margin: paint pushed out a few texels past each island so the mipmaps don't pull the old colour in)
grow = paint.copy(); cl = outl.copy()
for it in range(6):
    s = ndimage.uniform_filter(cl * grow[..., None], (3, 3, 1)); c = ndimage.uniform_filter(grow.astype(float), 3); new = ~cov & ~grow & (c > .1)
    cl[new] = s[new] / c[new][:, None]; grow |= new
outl[grow & ~cov] = cl[grow & ~cov]
Image.fromarray((srgb(outl.clip(0, 1)) * 255 + .5).astype(np.uint8)).save(OUT + '.png'); print('wrote', OUT + '.png')
np.save(OUT + '-paintmask.npy', paint)
