"""The Redtail's patina: each orthographic view of Christopher's reference sheet warped onto the model's own
coordinates (1 cm a pixel), and its weathering pulled out of it: the picture's brightness over its local average
(stains, seams, stitching, streaks), kept only on paint and fabric (not glass, tyres, shadows or the background)."""
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates, gaussian_filter
S = np.asarray(Image.open('redtail/ref/sheet1.png').convert('RGB')).astype(np.float32) / 255
lin = S ** 2.2
def pl(K):
    a = np.array([k[0] for k in K]); b = np.array([k[1] for k in K]); o = np.argsort(a); a, b = a[o], b[o]
    return lambda x: np.interp(x, a, b)
RES = .01
def grid(a0, a1, b0, b1):
    A = np.arange(a0, a1, RES); B = np.arange(b0, b1, RES); return np.meshgrid(A, B)  # columns a, rows b
VIEWS = {}
# side: columns X (nose at the right of the image as stored: X rising), rows Y (rising)
X, Yg = grid(-4.75, 2.55, -1.95, 1.50); VIEWS['side'] = (267 - 86 * X, 131 - 86 * Yg, (-4.75, 2.55, -1.95, 1.50))
# top: columns Z, rows X
topX = pl([[2.40, 547.5], [1.44, 598], [.52, 620], [-.70, 688], [-1.10, 716], [-3.20, 882], [-4.60, 991]])
Zg, X = grid(-5.4, 5.4, -4.75, 2.55); VIEWS['top'] = (377.5 + 62 * Zg, topX(X), (-5.4, 5.4, -4.75, 2.55))
botX = pl([[2.40, 540], [1.44, 593], [.52, 615], [-.70, 680], [-1.10, 713], [-3.20, 882], [-4.60, 985]])
Zg, X = grid(-5.4, 5.4, -4.75, 2.55); VIEWS['bottom'] = (1082.5 - 64.6 * Zg, botX(X), (-5.4, 5.4, -4.75, 2.55))
# front: columns Z, rows Y
Zg, Yg = grid(-5.4, 5.4, -1.95, 1.50); VIEWS['front'] = (1113 - 77.5 * Zg, 131 - 85 * Yg, (-5.4, 5.4, -1.95, 1.50))
CROP = {'side': (10, 5, 675, 300), 'top': (40, 540, 715, 1005), 'bottom': (735, 535, 1440, 1005), 'front': (690, 5, 1530, 295)}
info = {}
for name, (px, py, ext) in VIEWS.items():
    x0, y0, x1, y1 = CROP[name]; inside = (px >= x0) & (px < x1) & (py >= y0) & (py < y1)
    W = np.stack([map_coordinates(lin[..., c], [py, px], order=1, mode='nearest') for c in range(3)], -1)
    L = W @ np.array([.2126, .7152, .0722]); mx, mn = W.max(-1), W.min(-1); sat = (mx - mn) / np.maximum(mx, 1e-4)
    # the paint: cream (bright, a little warm) or the red (saturated, red the strongest); not the grey background, glass, tyres
    srgb = W ** (1 / 2.2); bg = (np.abs(srgb - np.array([.886, .894, .91])).max(-1) < .035)
    cream = (L > .30) & (sat < .35) & (W[..., 0] >= W[..., 2]) & ~bg
    red = (sat > .45) & (W[..., 0] > 1.6 * W[..., 1]) & (L > .02)
    paint = (cream | red) & inside
    m = gaussian_filter(paint.astype(np.float32), 1.2); m = np.clip((m - .55) / .4, 0, 1)
    # the detail: brightness over its own local mean within the same paint (normalised convolution, so the stripe's
    # edge and the background don't leak in), 9 cm wide
    sig = 9
    def nmean(v, mask): return gaussian_filter(v * mask, sig) / np.maximum(gaussian_filter(mask, sig), 1e-3)
    det = np.ones_like(L)
    for k in (cream, red):
        mk = (k & inside).astype(np.float32); mu = nmean(L, mk); d = L / np.maximum(mu, 1e-4); det = np.where(k, d, det)
    det = np.clip(det, .55, 1.3); det = 1 + (det - 1) * m
    enc = np.clip(det / 1.6, 0, 1); img = np.stack([enc, enc, enc, m], -1)
    Image.fromarray((img[::-1] * 255 + .5).astype(np.uint8), 'RGBA').save(f'redtail/work/bake/pat/{name}.png')   # rows flipped: image top = high value
    info[name] = {'ext': ext, 'shape': det.shape, 'mean': float(det[m > .5].mean()), 'cover': float((m > .5).mean())}
    print(name, det.shape, 'paint cover %.2f' % (m > .5).mean(), 'detail range %.2f-%.2f' % (np.percentile(det[m > .5], 2), np.percentile(det[m > .5], 98)))
import json; json.dump(info, open('redtail/work/bake/pat/info.json', 'w'))
