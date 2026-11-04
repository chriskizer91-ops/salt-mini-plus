/* Pictures of the traffic test page (viewer/traffic.html), each a setting of the page, drawn with its loop held.
   usage: node models/tools/traffic_shot.js <out-dir> name=key:value,key:value ...
     keys: scene (studio, parked, road), v (the car or traffic car: game studio studio2 baked t25000_plain t5000_s2 ...),
     you (your car), cam (hood chase far look), d (metres), dir (coming, going), pic (1 .5 .25), lights (0 1)
   env: W, H (1600 x 900), PAGE (another page) */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [out,...shots]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
(async()=>{
  const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:+(process.env.W||1600),height:+(process.env.H||900)}});const errs=[];
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto('file://'+path.resolve(process.env.PAGE||path.join(__dirname,'..','..','viewer','traffic.html'))+'?shots=1');
  await p.waitForFunction(()=>window.VIEWER,null,{timeout:120000});
  for(const s of shots){const [name,spec]=s.split('=');const o={};for(const kv of (spec||'').split(',').filter(Boolean)){const [k,v]=kv.split(':');o[k]=isNaN(+v)?v:+v;}
    const t0=Date.now();
    const st=await p.evaluate(async o=>{await VIEWER.set(o);VIEWER.hold(true);for(let i=0;i<3;i++)VIEWER.snap();return VIEWER.stats();},o);
    await p.evaluate(()=>new Promise(r=>setTimeout(r,200)));
    const url=await p.evaluate(()=>VIEWER.snap());fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(url.split(',')[1],'base64'));
    console.log(name,JSON.stringify(st),((Date.now()-t0)/1000).toFixed(0)+'s');}
  if(errs.length)console.log('page messages:',errs.slice(0,8));await b.close();})();
