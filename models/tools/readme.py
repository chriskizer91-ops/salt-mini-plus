"""The tables at the top of the repo's README, from each car's numbers.json (and numbers_s2.json, s2_numbers.js, for a
   car with a Studio 2): run after make_car.sh or s2_car.sh.
   usage: python3 models/tools/readme.py   (rewrites the lines between the TABLE markers, and between the S2TABLE
   markers, in README.md)"""
import os, json
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
CARS = [('suv', 'stock', 'SUV'), ('pickup', 'pickup', 'Pickup'), ('hatch', 'hatch', 'Hatch'), ('wagon', 'wagon', 'Wagon'), ('ev', 'ev', 'EV'),
        ('trail', 'trail', 'Trail (4x4)'), ('coupe', 'coupe', 'Coupe'), ('muscle', 'muscle', 'Muscle'),
        # (the other builds and the two cars traffic doesn't have, Studio-only: no baked version)
        ('suv-sleeper', 'sleeper', 'SUV Sleeper'), ('suv-rockmud', 'crawler', 'SUV Rock & Mud'), ('suv-race', 'race', 'SUV Race'),
        ('coupe-gt', 'coupeGT', 'Coupe GT'), ('hatch-groupb', 'hatchB', 'Hatch Group B'), ('wedge', 'wedge', 'Wedge'),
        ('wedge-nightrunner', 'wedgeNR', 'Wedge Night Runner'), ('hyper', 'hyper', 'Hypercar'), ('hyper-track', 'hyperTrack', 'Hypercar Track')]
f = lambda n: '{:,}'.format(n)
rows = ['| Car | Status | Studio triangles | Studio 2 triangles | Baked triangles | Game\'s own | Baked pictures (Low / Medium) | Picture |', '| --- | --- | --- | --- | --- | --- | --- | --- |']
s2rows = ['| Car | Whole car | Body | Underside | Engine bay | Cabin | Hood | One wheel | One brake | Build | Pictures |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |']
def s2(folder, name):
    p = os.path.join(ROOT, 'models', folder, 'numbers_s2.json')
    if not os.path.exists(p): return 'To do'
    S2 = json.load(open(p))['studio2']
    if not S2: return 'To do'
    P = S2['by_piece']
    s2rows.append('| %s | %s | %s | %s | %s | %s | %s | %s | %s | %.1f s | [front](models/%s/docs/s2_front34.webp), [rear](models/%s/docs/s2_rear34low.webp), [under](models/%s/docs/s2_under.webp), [bay](models/%s/docs/s2_bay.webp), [cabin](models/%s/docs/s2_cabin.webp) |' % (
        name, f(S2['triangles']), f(P['body']), f(P['under']), f(P['bay']) if P['bay'] else 'in the underside', f(P['cabin']), f(P['hood']), f(P['wheel']), f(P['brake']), S2['build_ms'] / 1000, folder, folder, folder, folder, folder))
    return f(S2['triangles'])
for folder, id_, name in CARS:
    p = os.path.join(ROOT, 'models', folder, 'numbers.json')
    if not os.path.exists(p): rows.append('| %s | To do | | | | | | |' % name); continue
    N = json.load(open(p)); S, B, G = N['studio'], N.get('baked'), N['game']
    st = N.get('status', 'Done')
    if not B:
        rows.append('| [%s](models/%s/) | %s | %s (+%s engine bay) | %s | Studio only | %s | Studio only | ![%s](models/%s/docs/front34.webp) |' % (
            name, folder, st, f(S['triangles']), f(S['triangles_bay']), s2(folder, name), f(G['triangles']), name, folder)); continue
    rows.append('| [%s](models/%s/) | %s | %s (+%s engine bay) | %s | %s | %s | 1024 x 1536, %s MB / 2048 x 3072, %s MB | ![%s](models/%s/docs/front34.webp) |' % (
        name, folder, st, f(S['triangles']), f(S['triangles_bay']), s2(folder, name), f(B['triangles']), f(G['triangles']), B['texture_mb_low'], B['texture_mb_medium'], name, folder))
r = open(os.path.join(ROOT, 'README.md')).read(); a = r.index('<!-- TABLE -->'); b = r.index('<!-- /TABLE -->')
r = r[:a] + '<!-- TABLE -->\n' + '\n'.join(rows) + '\n' + r[b:]
a = r.index('<!-- S2TABLE -->'); b = r.index('<!-- /S2TABLE -->')
open(os.path.join(ROOT, 'README.md'), 'w').write(r[:a] + '<!-- S2TABLE -->\n' + '\n'.join(s2rows) + '\n' + r[b:])
print('\n'.join(rows + [''] + s2rows))
