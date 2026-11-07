"""The Redtail's paint template: the plane straight on from five sides (left, right, top, underneath, front), each at
a known scale, on one 1536 x 1024 sheet (ChatGPT's landscape size). ChatGPT repaints this sheet; because every view's
scale and place is known, the new paint can be laid back onto the model exactly. Writes redtail-paint-template.png
and template.json (each view's box on the sheet and the model coordinates it covers)."""
import os
import asyncio, json
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
URL = 'file://' + os.path.abspath('redtail/redtail-versions.html') + '#v1'
X0, X1, Y0, Y1, Z0, Z1 = -4.9, 2.7, -1.9, 1.5, -5.5, 5.5          # the model's box (level), metres
GY = 1.79                                                           # level, the airframe sits this high
# name: camera direction (from the centre), up, scale px/m, place on the sheet, (column axis, sign), (row axis, sign)
V = {
  'LEFT SIDE':  dict(cam=[0, 0, -1], up=[0, 1, 0], s=86, at=(40, 30),  ext=(X1 - X0, Y1 - Y0)),
  'RIGHT SIDE': dict(cam=[0, 0, 1],  up=[0, 1, 0], s=86, at=(842, 30), ext=(X1 - X0, Y1 - Y0)),
  'TOP':        dict(cam=[0, 1, 0],  up=[1, 0, 0], s=68, at=(10, 350), ext=(Z1 - Z0, X1 - X0)),
  'UNDERSIDE':  dict(cam=[0, -1, 0], up=[1, 0, 0], s=68, at=(778, 350), ext=(Z1 - Z0, X1 - X0)),
  'FRONT':      dict(cam=[1, 0, 0],  up=[0, 1, 0], s=40, at=(548, 878), ext=(Z1 - Z0, Y1 - Y0)),
}
C = [(X0 + X1) / 2, (Y0 + Y1) / 2 + GY, 0]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': 800, 'height': 600}, device_scale_factor=1)
        await pg.goto(URL)
        for i in range(120):
            await asyncio.sleep(.5)
            if await pg.evaluate("()=>!!window.__rt && __rt.version=='redtail-1'"): break
        await pg.add_style_tag(content='#ui,#info{display:none!important}')
        await pg.evaluate("()=>{__rt.scene.traverse(o=>{if(o.isDirectionalLight){o.castShadow=false;o.intensity=2.1;} if(o.isHemisphereLight)o.intensity=.25;}); __rt.scene.environmentIntensity=.45;}")
        shots = {}
        for n, v in V.items():
            w, h = round(v['ext'][0] * v['s']), round(v['ext'][1] * v['s'])
            await pg.set_viewport_size({'width': w, 'height': h}); await asyncio.sleep(.4)
            await pg.evaluate(f"""()=>{{__rt.setView('Side'); const c=__rt.cam, d={v['cam']}, C={C};
              c.left=-{v['ext'][0]}/2; c.right={v['ext'][0]}/2; c.top={v['ext'][1]}/2; c.bottom=-{v['ext'][1]}/2; c.updateProjectionMatrix();
              c.position.set(C[0]+30*d[0],C[1]+30*d[1],C[2]+30*d[2]); c.up.set(...{v['up']}); c.lookAt(C[0],C[1],C[2]);
              __rt.scene.traverse(o=>{{if(o.isDirectionalLight){{o.position.set(C[0]+30*d[0]+3*{v['up']}[0],C[1]+30*d[1]+3*{v['up']}[1],C[2]+30*d[2]+3*{v['up']}[2]);o.target.position.set(C[0],C[1],C[2]);o.target.updateMatrixWorld();}}}});}}""")
            await asyncio.sleep(1.5)
            f = f'redtail/work/tmp/tpl_{n.replace(" ", "_")}.png'; await pg.screenshot(path=f); shots[n] = (f, w, h)
            print(n, w, h, flush=True)
        await b.close()
    sheet = Image.new('RGB', (1536, 1024), (228, 230, 234)); d = ImageDraw.Draw(sheet)
    F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
    info = {'sheet': [1536, 1024], 'box': [X0, X1, Y0, Y1, Z0, Z1], 'views': {}}
    for n, v in V.items():
        f, w, h = shots[n]; sheet.paste(Image.open(f).convert('RGB'), v['at'])
        lx, ly = {'LEFT SIDE': (v['at'][0] + 4, v['at'][1] + h + 2), 'RIGHT SIDE': (v['at'][0] + 4, v['at'][1] + h + 2),
                  'TOP': (v['at'][0] + 4, v['at'][1] + 4), 'UNDERSIDE': (v['at'][0] + 4, v['at'][1] + 4), 'FRONT': (v['at'][0] - 70, v['at'][1] + h // 2 - 8)}[n]
        d.text((lx, ly), n, fill=(110, 116, 126), font=F)
        info['views'][n] = {'x': v['at'][0], 'y': v['at'][1], 'w': w, 'h': h, 'scale': v['s'], 'cam': v['cam'], 'up': v['up']}
    sheet.save('redtail/paint-template/redtail-paint-template.png'); json.dump(info, open('redtail/paint-template/template.json', 'w'), indent=1)
    print('sheet ok')
asyncio.run(main())
