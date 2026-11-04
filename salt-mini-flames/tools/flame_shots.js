/* Close-up pictures of the flames, the camera set by hand at the pipe (the bay's own camera aims at the truck).
   usage: node tools/flame_shots.js <out-dir>  (env W, H: the picture's size, 1280 x 720) */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const out=process.argv[2]||'/tmp/flames';fs.mkdirSync(out,{recursive:true});
(async()=>{
  const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:+(process.env.W||1280),height:+(process.env.H||720)},deviceScaleFactor:1});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(path.join(__dirname,'..','salt-mini-flames.html'))+'?shots=1');
  await p.waitForFunction(()=>window.MINI&&MINI.truck&&document.getElementById('loading').hidden,null,{timeout:900000,polling:500});
  await p.evaluate(()=>{MINI.hold(true);MINI.bayOpen();document.getElementById('menu').style.display='none';});
  /* each shot: how to rev, how long, then wait for a strong flame; the camera: side (metres to the side), back, up */
  const shots=[['side_limiter',{pad:1},150,.85,[-2.4,.55,.22]],['side_lift',{pad:0},40,.85,[-2.4,.55,.22]],
               ['low_rear',{pad:1},150,.85,[-1.6,1.9,.12]],['close',{pad:0},40,.8,[-1.1,.35,.15]]];
  for(const [name,inp,n,want,[side,back,up]] of shots){
    if(name==='side_lift'||name==='close')await p.evaluate(()=>{for(let i=0;i<150;i++)MINI.fx(1/60,{pad:1});});
    const r=await p.evaluate(({inp,n,want,side,back,up})=>{let r;for(let i=0;i<n;i++){r=MINI.fx(1/60,inp);if(i>3&&r.k>want)break;}
      const T=MINI.FX.tips[0],TH=MINI.THREE,V=TH.Vector3,tp=new V();T.g.getWorldPosition(tp);
      const d=new V(...T.d.toArray()).transformDirection(MINI.truck.root.matrixWorld),s=new V(-d.z,0,d.x),cam=MINI.camera;
      cam.clearViewOffset();cam.position.copy(tp).addScaledVector(s,side).addScaledVector(d,back).add(new V(0,up,0));
      cam.lookAt(tp.clone().addScaledVector(d,.5));cam.fov=40;cam.updateProjectionMatrix();MINI.renderer.render(MINI.scene,cam);return r;},{inp,n,want,side,back,up});
    {const t0=Date.now();await p.waitForTimeout(300);await p.screenshot({path:path.join(out,name+'.png'),timeout:240000});console.log('  shot',(Date.now()-t0)/1000+'s');}console.log(name,JSON.stringify(r));}
  console.log(errs.length?'page errors: '+errs.join(' | '):'no page errors');await b.close();
})();
