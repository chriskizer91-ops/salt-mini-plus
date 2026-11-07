"""redtail-2's paint jobs against his pictures: each view of each paint drawn straight on in redtail-versions.html,
beside the picture it came from; and a 3/4 view of each. Writes redtail/docs/redtail-2-paint-compare.png"""
import asyncio, os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
OUT = 'redtail/work/shots-paint/'; os.makedirs(OUT, exist_ok=True)
PAINTS = [('yellow-black', 1, 'redtail/versions/redtail-2/paint/pictures/02-yellow-black'), ('wilderness-olive', 2, 'redtail/versions/redtail-2/paint/pictures/04-wilderness-olive')]
VIEWS = [('left-side', 'Side', None), ('right-side', 'Side', 'right'), ('top', 'Top', None), ('underside', 'Under', None)]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': 1200, 'height': 700}, device_scale_factor=1)
        await pg.goto('file://' + os.path.abspath('redtail/redtail-versions.html'))
        for i in range(120):
            await asyncio.sleep(.5)
            if await pg.evaluate("()=>!!window.__rt && __rt.version=='redtail-2'"): break
        for pid, pi, _ in PAINTS:
            await pg.evaluate(f"()=>__rt.setPaint({pi})"); await asyncio.sleep(2)
            for vn, view, flip in VIEWS:
                await pg.evaluate(f"()=>{{__rt.setView('{view}');" + ("const c=__rt.cam;c.position.z=-c.position.z;c.lookAt(c.position.x,c.position.y,0);" if flip else "") + "}")
                await asyncio.sleep(2.2); await pg.screenshot(path=OUT + f'{pid}_{vn}.png')
            await pg.evaluate("()=>{__rt.setView('3/4');}"); await pg.click('text=3/4'); await asyncio.sleep(2.5); await pg.screenshot(path=OUT + f'{pid}_34.png')
            await pg.evaluate("()=>__rt.look([-7.5,1.6,7.5],[-1,.4,0])"); await asyncio.sleep(2.5); await pg.screenshot(path=OUT + f'{pid}_34r.png')
        await b.close()
    F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    W, H = 560, 320
    sheet = Image.new('RGB', (2 * (2 * W + 20) + 30, len(VIEWS) * (H + 34) + H + 70), '#f4f4f2'); d = ImageDraw.Draw(sheet)
    for c, (pid, pi, pic) in enumerate(PAINTS):
        x0 = 10 + c * (2 * W + 40); d.text((x0, 6), {'yellow-black': 'YELLOW & BLACK', 'wilderness-olive': 'WILDERNESS OLIVE'}[pid] + ':  your picture  |  on the model', fill='#30343a', font=F)
        for r, (vn, view, flip) in enumerate(VIEWS):
            y = 36 + r * (H + 34)
            for k, f in enumerate((f'{pic}_{vn}.png', OUT + f'{pid}_{vn}.png')):
                im = Image.open(f).convert('RGB')
                if k == 1:   # crop the viewer shot to the plane (drop the chips and the info line)
                    im = im.crop((0, 50, im.width, im.height - 40))
                s = min(W / im.width, H / im.height); im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
                sheet.paste(im, (x0 + k * (W + 10) + (W - im.width) // 2, y + (H - im.height) // 2))
            d.text((x0, y + H + 4), vn.replace('-', ' '), fill='#6a707a', font=F)
        y = 36 + len(VIEWS) * (H + 34)
        for k, f in enumerate((OUT + f'{pid}_34.png', OUT + f'{pid}_34r.png')):
            im = Image.open(f).convert('RGB').crop((0, 50, 1200, 660)); s = min(W / im.width, H / im.height); im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
            sheet.paste(im, (x0 + k * (W + 10), y))
    sheet.save('redtail/docs/redtail-2-paint-compare.png'); print(sheet.size)
asyncio.run(main())
