#!/bin/sh
# The traffic test's pictures (models/coupe-traffic/docs), from the test page (viewer/traffic.html, built by
# viewer/build_traffic.sh): every version from the front three-quarter, the fronts close up, the tails with the lamps
# lit, your car parked by the traffic car, and the road from the Chase camera at 30, 100 and 200 m.
# usage: sh models/tools/traffic_docs.sh   (run from the repo's top; about ten minutes; SKIP_SHOTS=1 lays out the last run's again)
set -e
X=${W_DIR:-/tmp/smp-traffic-docs}; D=models/coupe-traffic/docs; mkdir -p $X $D
S="game studio studio2 studio2d baked t25000_plain t25000_s1 t25000_s2 t10000_plain t10000_s1 t10000_s2 t5000_plain t5000_s1 t5000_s2"
A=""; for v in $S; do A="$A v_$v=scene:studio,v:$v"; done
for v in studio2 baked t25000_s2 t5000_s2; do A="$A f_$v=scene:studio,v:$v,view:face t_$v=scene:studio,v:$v,view:tail"; done
A="$A p_t25000_s2=scene:parked,v:t25000_s2,you:studio2 p_t5000_s2=scene:parked,v:t5000_s2,you:studio2"
for d in 30 100 200; do A="$A r_$d=scene:road,v:t5000_s2,you:studio2,cam:chase,d:$d"; done
[ -n "$SKIP_SHOTS" ] || node models/tools/traffic_shot.js $X/shots $A | grep -v '^ ' > $X/shots.log
python3 - $X/shots $D $X/shots.log <<'PY'
import sys, os
from PIL import Image, ImageDraw, ImageFont
import json
SH, D, LOG = sys.argv[1:]; F = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', s)
# (each picture's numbers, as the page counted them: the shots' log)
ST = {l.split(' ')[0]: json.loads(l[l.index('{'):l.rindex('}') + 1]) for l in open(LOG) if '{' in l}
n = lambda k: '{:,}'.format(round(ST[k]['A']['n']))
def crop(name, box=(.14, .2, .9, .86)):
    im = Image.open(os.path.join(SH, name + '.png')).convert('RGB'); w, h = im.size
    return im.crop((int(w * box[0]), int(h * box[1]), int(w * box[2]), int(h * box[3])))
def sheet(rows, out, cw=640, top=44, side=0, box=(.14, .2, .9, .86)):
    """rows: [(row label, [(name, caption) or None, ...]), ...]"""
    cols = max(len(r[1]) for r in rows); first = crop(next(c[0] for r in rows for c in r[1] if c), box); ch = int(cw * first.size[1] / first.size[0])
    g = Image.new('RGB', (side + cols * cw, len(rows) * (ch + top)), (230, 229, 226)); d = ImageDraw.Draw(g)
    for i, (lab, cells) in enumerate(rows):
        y = i * (ch + top)
        if side: d.text((14, y + top + ch // 2 - 14), lab, fill=(40, 40, 40), font=F(24))
        for j, c in enumerate(cells):
            if not c: continue
            x = side + j * cw; g.paste(crop(c[0], box).resize((cw, ch), Image.LANCZOS), (x, y + top)); d.text((x + 14, y + 10), c[1], fill=(40, 40, 40), font=F(22))
    g.save(os.path.join(D, out + '.webp'), 'WEBP', quality=88, method=6, exact=True)
sheet([('As it is', [(k, '%s · %s' % (t, n(k))) for k, t in (('v_game', 'Game'), ('v_studio', 'Studio'), ('v_studio2', 'Studio 2'), ('v_studio2d', 'Studio 2 Drive'), ('v_baked', 'Baked'))]),
       *[('About %dk' % (L // 1000), [(k, '%s · %s' % (t, n(k))) for k, t in (('v_t%d_plain' % L, 'Plain'), ('v_t%d_s1' % L, 'Studio baked'), ('v_t%d_s2' % L, 'Studio 2 baked'))] + [None])
         for L in (25000, 10000, 5000)]], 'versions', side=150)
sheet([('', [('f_studio2', 'Studio 2 (your car)'), ('f_baked', 'Baked on the game mesh'), ('f_t25000_s2', '25k Studio 2 baked'), ('f_t5000_s2', '5k Studio 2 baked')])], 'fronts', cw=560, box=(.0, .08, .8, .82))
sheet([('', [('t_studio2', 'Studio 2 (your car)'), ('t_baked', 'Baked on the game mesh'), ('t_t25000_s2', '25k Studio 2 baked'), ('t_t5000_s2', '5k Studio 2 baked')])], 'tails', cw=560, box=(.15, .1, .95, .84))
sheet([('', [('p_t25000_s2', 'Studio 2 (back) by the 25k traffic car'), ('p_t5000_s2', 'Studio 2 (back) by the 5k traffic car')])], 'parked', cw=900, box=(.08, .3, .92, .9))
sheet([('', [('r_30', '30 m, Chase camera'), ('r_100', '100 m'), ('r_200', '200 m')])], 'road', cw=720, box=(0, 0, 1, 1))
# the numbers: each version as the page counts it (triangles with the four wheels, draws, picture memory at full size)
NUM = {}
for k, v in ST.items():
    if k.startswith('v_'): NUM[k[2:]] = {'triangles': round(v['A']['n']), 'draws_page': v['A']['d'], 'pictures_mb_2048': round(v['A']['tex'], 1)}
for L in (25000, 10000, 5000):
    lp = os.path.join(os.path.dirname(D), 'lod', '%d.json' % L)
    if os.path.exists(lp): NUM['t%d_plain' % L]['pieces'] = {k: v for k, v in json.load(open(lp)).items() if k in ('body', 'lamps', 'glass', 'under', 'wheel', 'wheels')}
for k in NUM:
    f = os.path.join(os.path.dirname(D), 'data', 'coupe_%s.js' % k)
    if os.path.exists(f): NUM[k]['data_kb'] = os.path.getsize(f) // 1024
NUM['pictures_mb'] = {'2048 x 3072': 96, '1024 x 1536': 24, '512 x 768': 6}
json.dump(NUM, open(os.path.join(os.path.dirname(D), 'numbers.json'), 'w'), indent=1)
PY
cat $X/shots.log
