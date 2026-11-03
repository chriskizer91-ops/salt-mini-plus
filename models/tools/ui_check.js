/* The viewer as a phone and a laptop show it (Playwright's Pixel 7 for the Pixel 7a: the same screen; and a laptop's
   1536 x 864 screen at 1.25), with the page's own buttons pressed as a finger or the mouse would: the car list, the
   baked version, the hood, the paints, the lights. Each step a picture.
   usage: node models/tools/ui_check.js <out-dir> [car] */
const {chromium,devices}=require('playwright'),fs=require('fs'),path=require('path');
const [out,car]=[process.argv[2],process.argv[3]||'pickup'];fs.mkdirSync(out,{recursive:true});
const PAGE='file://'+path.resolve(path.join(__dirname,'..','..','viewer','viewer.html'))+'?car='+car;
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  for(const [tag,ctx] of [['phone',devices['Pixel 7']],['laptop',{viewport:{width:1536,height:864},deviceScaleFactor:1.25}]]){
    const c=await b.newContext(ctx),p=await c.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.goto(PAGE);await p.waitForFunction(()=>window.VIEWER&&VIEWER.cur,null,{timeout:900000,polling:500});await p.waitForTimeout(1500);
    const tap=async sel=>{const el=await p.$(sel);if(tag==='phone')await el.tap();else await el.click();await p.waitForTimeout(900);};
    await p.screenshot({path:path.join(out,`${tag}_1_open.png`)});
    await tap('#carb');await p.screenshot({path:path.join(out,`${tag}_2_cars.png`)});await tap('#carb');
    await tap('#vers button[data-v="baked"]');await p.waitForFunction(()=>VIEWER.cur&&VIEWER.cur.v==='baked',null,{timeout:300000});await p.waitForTimeout(1500);
    await tap('#hood');await p.waitForTimeout(1500);await p.screenshot({path:path.join(out,`${tag}_3_baked_hood.png`)});
    if(tag==='phone'){await tap('#moreb');await p.screenshot({path:path.join(out,`${tag}_4_more.png`)});const m=await p.$$('#more button');for(const x of m)if((await x.textContent())==='Paint'){await x.tap();break;}}
    else await tap('#paintb');
    await p.waitForTimeout(500);const sw=await p.$$('#paints .sw');if(tag==='phone')await sw[5].tap();else await sw[5].click();await p.waitForTimeout(900);
    await p.screenshot({path:path.join(out,`${tag}_5_paint.png`)});
    console.log(tag,JSON.stringify(await p.evaluate(()=>VIEWER.stats())),errs.length?errs:'no page errors');await c.close();}
  await b.close();})();
