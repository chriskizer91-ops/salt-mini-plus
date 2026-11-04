/* A car's Studio and Studio 2 from the same five cameras, for the pictures side by side (s2_docs.py): the front
   three-quarter, the rear three-quarter low, the underside, the engine bay with the hood up, and the cabin.
   usage: node models/tools/s2_shots.js <out-dir> <car>    (env: PAGE, another built page; W, H, the picture's size) */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [out,car]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
(async()=>{
  const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const W=+(process.env.W||1280),H=+(process.env.H||800),errs=[];
  for(const ver of ['studio','studio2']){
    const p=await b.newPage({viewport:{width:W,height:H}});p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+path.resolve(process.env.PAGE||path.join(__dirname,'..','..','viewer','viewer.html'))+`?shots=1&car=${car}&v=${ver}`);
    await p.waitForFunction(()=>window.VIEWER&&VIEWER.cur,null,{timeout:900000,polling:500});
    await p.evaluate(()=>{VIEWER.hold(true);document.getElementById('hint').hidden=true;});
    const st=await p.evaluate(()=>VIEWER.stats());console.log(ver,JSON.stringify(st));
    /* (the cameras: the viewer's own views, and the rear three-quarter brought down to the low view's height) */
    for(const [name,hood] of [['front34',0],['rear34low',0],['under',0],['bay',1],['cabin',0]]){
      const d=await p.evaluate(([name,hood])=>{VIEWER.setHood(!!hood);VIEWER.setLights(0);
        if(name==='rear34low'){const V=VIEWER.VIEWS,r=V.rear34,l=V.low;VIEWER.setView('rear34');VIEWER.camera.position.set(r.p[0]*.95,l.p[1]+.12,r.p[2]*.9);VIEWER.controls.target.set(r.t[0],l.t[1],0);VIEWER.controls.update();}
        else VIEWER.setView(name);VIEWER.snap();return VIEWER.snap();},[name,hood]);
      fs.writeFileSync(path.join(out,`${car}_${ver}_${name}.png`),Buffer.from(d.split(',')[1],'base64'));}
    await p.close();}
  if(errs.length)console.log('page errors:',errs.slice(0,5));else console.log('no page errors');
  await b.close();})();
