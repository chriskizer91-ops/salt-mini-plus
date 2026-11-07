"""Tests redtail-versions.html: it opens on the newest, builds the others, and the version chip swaps them with the
camera, view, cowl and Move left as they were. Shots of the same spot on each version."""
import os
import asyncio, sys, time, json
from playwright.async_api import async_playwright
URL = 'file://' + os.path.abspath('redtail/redtail-versions.html')
OUT = 'redtail/work/shots-v/'
SPOTS = {'34': "__rt.setView('3/4')", 'Side': "__rt.setView('Side')",
         'tip': "__rt.look([-.9,2.0,-5.7],[.0,.95,-4.75])", 'tail': "__rt.look([-2.9,.95,-2.5],[-4.15,.3,.2])",
         'engine': "__rt.cowl(false);__rt.look([3.55,.25,-1.55],[1.85,-.08,-.12])"}
async def main():
    import os; os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        for dev, vp in (('phone', {'width': 412, 'height': 915}), ('laptop', {'width': 1400, 'height': 800})):
            pg = await b.new_page(viewport=vp, device_scale_factor=1)
            errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            t0 = time.time(); await pg.goto(URL)
            for i in range(90):
                await asyncio.sleep(.5)
                if await pg.evaluate("()=>!!window.__rt && !!__rt.version"): break
            t1 = time.time() - t0
            for i in range(120):
                await asyncio.sleep(.5)
                if await pg.evaluate("()=>__rt.built.length==__rt.VERSIONS.length"): break
            print(dev, 'first picture', round(t1, 1), 's, all built', round(time.time() - t0, 1), 's, opens on', await pg.evaluate("()=>__rt.version"), flush=True)
            await pg.screenshot(path=OUT + f'{dev}-open.png')
            # the chip: tap it, check the version and the info line
            for i in range(2):
                await pg.click('#ui button.ver'); await asyncio.sleep(1.2)
                print(' tap ->', await pg.evaluate("()=>__rt.version"), '|', await pg.inner_text('#info'), '| chip', await pg.inner_text('#ui button.ver'), flush=True)
            if dev == 'phone': await pg.screenshot(path=OUT + 'phone-chip.png')
            spots = SPOTS if dev == 'laptop' else {'34': SPOTS['34'], 'tip': SPOTS['tip']}
            for name, js in spots.items():
                for vid in ('redtail-1', 'redtail-2'):
                    await pg.evaluate(f"()=>{{__rt.cowl(true);{js};}}"); await pg.evaluate(f"()=>__rt.show('{vid}')"); await asyncio.sleep(2.2)
                    await pg.screenshot(path=OUT + f'{dev}-{name}-{vid}.png')
                print(' shot', name, flush=True)
            # Move and the cowl kept across a swap: cowl off + moving on v1, swap to v2, read the parts
            await pg.evaluate("()=>{__rt.show('redtail-1');}"); await asyncio.sleep(.8)
            await pg.evaluate("()=>{__rt.setView('3/4');__rt.cowl(false);__rt.setMoving(true);}"); await asyncio.sleep(1)
            await pg.evaluate("()=>__rt.show('redtail-2')"); await asyncio.sleep(1.5)
            st = await pg.evaluate("""()=>{const v=__rt.VERSIONS.map(o=>({id:o.id,shown:o.m.root.visible,cowl:o.m.groups.cowl.visible,prop:+o.m.PV.prop.rotation.x.toFixed(2),
                 wheel:+o.m.PV.wheelR.rotation.z.toFixed(2),rudder:+o.m.PV.rudder.rotation.y.toFixed(2),aileronR:+o.m.PV.aileronR.rotation.z.toFixed(2)})); return v;}""")
            print(' after swap with cowl off + Move on:', json.dumps(st), flush=True)
            if dev == 'laptop':
                await pg.keyboard.press('1'); await asyncio.sleep(.6); a = await pg.evaluate("()=>__rt.version")
                await pg.keyboard.press('v'); await asyncio.sleep(.6); c = await pg.evaluate("()=>__rt.version")
                print(' keys: 1 ->', a, ', V ->', c, flush=True)
            print(' errors:', errs[:6] or 'none', flush=True)
            await pg.close()
        # opening straight on a version from the address
        pg = await b.new_page(viewport={'width': 412, 'height': 915}); await pg.goto(URL + '#v1')
        for i in range(90):
            await asyncio.sleep(.5)
            if await pg.evaluate("()=>!!window.__rt && !!__rt.version"): break
        print('#v1 opens on', await pg.evaluate("()=>__rt.version"))
        await b.close()
asyncio.run(main())
