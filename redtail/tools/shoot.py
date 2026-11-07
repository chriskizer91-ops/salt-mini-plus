import os
import asyncio, sys, time
from playwright.async_api import async_playwright
URL='file://' + os.path.abspath('redtail/versions/redtail-1/redtail-1-viewer.html')
VIEWS=sys.argv[1].split(',') if len(sys.argv)>1 else ['3/4','Side','Front','Top','Under','Rear']
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg=await b.new_page(viewport={'width':1400,'height':800},device_scale_factor=1)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        t0=time.time(); await pg.goto(URL)
        for i in range(60):
            await asyncio.sleep(1)
            if await pg.evaluate("()=>!!window.__rt"): break
        print('built in',round(time.time()-t0,1),'s',flush=True)
        for v in VIEWS:
            extra=''
            CL={'c_engine':('false','[3.55,.25,-1.55]','[1.85,-.08,-.12]'),'c_cockpit':('true','[1.05,.55,-1.75]','[-.15,.0,.1]'),
                'c_tail':('true','[-2.9,.95,-2.5]','[-4.15,.3,.2]'),'c_gear':('true','[1.75,-1.05,-3.3]','[.98,-1.15,-1.25]'),
                'c_tip':('true','[-.9,2.0,-5.7]','[.0,.95,-4.75]'),'c_strut':('true','[.6,-.2,-3.2]','[.25,.9,-3.0]')}
            if v in CL:
                cw,p,t=CL[v]; await pg.evaluate(f"()=>{{__rt.cowl({cw});__rt.look({p},{t});}}")
            elif v=='engine': await pg.evaluate("()=>{__rt.cowl(false);__rt.look([4.2,.9,-2.6],[1.8,-.1,0]);}")
            elif v=='cabin': await pg.evaluate("()=>{__rt.cowl(true);__rt.look([.9,.9,-2.2],[-.1,.25,0]);}")
            elif v=='gear': await pg.evaluate("()=>{__rt.cowl(true);__rt.look([2.6,-.2,-3.4],[.9,-.8,-1.1]);}")
            elif v=='tail': await pg.evaluate("()=>{__rt.cowl(true);__rt.look([-2.0,1.4,-3.0],[-4.0,.5,0]);}")
            else: await pg.evaluate(f"()=>{{__rt.cowl(true);__rt.setView({v!r});}}")
            await asyncio.sleep(2.5)
            await pg.screenshot(path=f'redtail/work/shots/{v.replace("/","")}.png')
            print('shot',v,flush=True)
        print('\n'.join(errs[:10]))
        await b.close()
asyncio.run(main())
