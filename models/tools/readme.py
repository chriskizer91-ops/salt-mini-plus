"""The table at the top of the repo's README, from each car's numbers.json: run after make_car.sh.
   usage: python3 models/tools/readme.py   (rewrites the lines between the two TABLE markers in README.md)"""
import os, json
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
CARS = [('suv', 'stock', 'SUV'), ('pickup', 'pickup', 'Pickup'), ('hatch', 'hatch', 'Hatch'), ('wagon', 'wagon', 'Wagon'), ('ev', 'ev', 'EV'),
        ('trail', 'trail', 'Trail (4x4)'), ('coupe', 'coupe', 'Coupe'), ('muscle', 'muscle', 'Muscle')]
f = lambda n: '{:,}'.format(n)
rows = ['| Car | Status | Studio triangles | Baked triangles | Game\'s own | Baked pictures (Low / Medium) | Picture |', '| --- | --- | --- | --- | --- | --- | --- |']
for folder, id_, name in CARS:
    p = os.path.join(ROOT, 'models', folder, 'numbers.json')
    if not os.path.exists(p): rows.append('| %s | To do | | | | | |' % name); continue
    N = json.load(open(p)); S, B, G = N['studio'], N['baked'], N['game']
    st = N.get('status', 'Done')
    rows.append('| [%s](models/%s/) | %s | %s (+%s engine bay) | %s | %s | 1024 x 1536, %s MB / 2048 x 3072, %s MB | ![%s](models/%s/docs/front34.webp) |' % (
        name, folder, st, f(S['triangles']), f(S['triangles_bay']), f(B['triangles']), f(G['triangles']), B['texture_mb_low'], B['texture_mb_medium'], name, folder))
r = open(os.path.join(ROOT, 'README.md')).read(); a = r.index('<!-- TABLE -->'); b = r.index('<!-- /TABLE -->')
open(os.path.join(ROOT, 'README.md'), 'w').write(r[:a] + '<!-- TABLE -->\n' + '\n'.join(rows) + '\n' + r[b:])
print('\n'.join(rows))
