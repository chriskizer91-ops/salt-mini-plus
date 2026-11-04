"""A car's Studio and Studio 2 side by side, from what s2_shots.js has taken: models/<folder>/docs/s2_<view>.webp for the
   front three-quarter, the rear three-quarter low, the underside, the engine bay with the hood up, and the cabin.
   usage: python3 models/tools/s2_docs.py <car> <shots-dir> <folder>"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
CAR, SH, FOLDER = sys.argv[1], sys.argv[2], sys.argv[3]
DOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', FOLDER, 'docs'); os.makedirs(DOC, exist_ok=True)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 26)
for v in ('front34', 'rear34low', 'under', 'bay', 'cabin'):
    ims = [Image.open(os.path.join(SH, '%s_%s_%s.png' % (CAR, ver, v))).convert('RGB') for ver in ('studio', 'studio2')]
    # (each at 1024 wide, a strip above for the names)
    ims = [im.resize((1024, round(im.size[1] * 1024 / im.size[0])), Image.LANCZOS) for im in ims]
    w, h, top = ims[0].size[0], ims[0].size[1], 50
    out = Image.new('RGB', (w * 2 + 8, h + top), (230, 229, 226)); d = ImageDraw.Draw(out)
    for i, (im, t) in enumerate(zip(ims, ('Studio', 'Studio 2'))):
        out.paste(im, (i * (w + 8), top)); d.text((i * (w + 8) + 22, 12), t, fill=(40, 40, 40), font=F)
    out.save(os.path.join(DOC, 's2_%s.webp' % v), 'WEBP', quality=88, method=6)
    print('s2_%s.webp' % v)
