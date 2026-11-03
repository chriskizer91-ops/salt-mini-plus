/* Pictures of a car in the viewer (viewer/viewer.html), drawn frame by frame with the page's loop held.
   usage: node models/tools/shot.js <out-dir> <car> <version> view[:hood[:lights]] ...
     version: game, studio or baked; views: front34 rear34 side front rear top wheel face tail low under cabin bay (or a
     car's own, models/src/cars/<car>); hood: open; lights: 0-3. e.g. node models/tools/shot.js /tmp/p pickup studio front34 bay:open
   env: W, H (viewport, 1280 x 800), PAGE (another built page), CAM='px,py,pz,tx,ty,tz' (a camera of its own) */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [out,car,ver,...shots]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
(async()=>{
  const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:+(process.env.W||1280),height:+(process.env.H||800)}});const errs=[];
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text());});
  const t0=Date.now();
  await p.goto('file://'+path.resolve(process.env.PAGE||path.join(__dirname,'..','..','viewer','viewer.html'))+`?shots=1&car=${car}&v=${ver}`);
  await p.waitForFunction(()=>window.VIEWER&&VIEWER.cur,null,{timeout:900000,polling:500});
  await p.evaluate(()=>{VIEWER.hold(true);document.getElementById('hint').hidden=true;});
  console.log('booted',((Date.now()-t0)/1000).toFixed(0)+'s',JSON.stringify(await p.evaluate(()=>VIEWER.stats())));
  for(const s of shots.length?shots:['front34']){const [v,hd,li]=s.split(':');const t1=Date.now();
    const d=await p.evaluate(([v,hd,li,cam])=>{VIEWER.setHood(hd==='open');VIEWER.setLights(+(li||0));VIEWER.setView(v);
      if(cam){const c=cam.split(',').map(Number);VIEWER.camera.position.set(c[0],c[1],c[2]);VIEWER.controls.target.set(c[3],c[4],c[5]);VIEWER.controls.update();}
      VIEWER.snap();return VIEWER.snap();},[v,hd,li,process.env.CAM||'']);
    const f=path.join(out,`${car}_${ver}_${s.replace(/:/g,'_')}.png`);fs.writeFileSync(f,Buffer.from(d.split(',')[1],'base64'));console.log('saved',f,((Date.now()-t1)/1000).toFixed(0)+'s');}
  console.log(JSON.stringify(await p.evaluate(()=>VIEWER.stats())));
  if(errs.length)console.log('page messages:',errs.slice(0,8));else console.log('no page errors');
  await b.close();
})();
