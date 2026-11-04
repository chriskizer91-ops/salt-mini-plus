/* A picture of each car (Studio or Game) at a front three-quarter view, the menu hidden, then all of them on one sheet.
   usage: node tools/car_shots.js <out-dir> [studio|studio2|game] [ids, comma separated]  (env W, H: each picture's size, 800 x 500) */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const out=process.argv[2]||'/tmp/cars',ver=process.argv[3]||'studio',only=process.argv[4]?process.argv[4].split(','):null,view=process.env.VIEW||'front';fs.mkdirSync(out,{recursive:true});
(async()=>{const W=+(process.env.W||800),H=+(process.env.H||500);
  const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(path.join(__dirname,'..','salt-mini-flames.html'))+'?shots=1');
  await p.waitForFunction(()=>window.MINI&&MINI.truck&&document.getElementById('loading').hidden,null,{timeout:900000,polling:500});
  await p.evaluate(()=>MINI.hold(true));
  for(const [id] of (await p.evaluate(()=>MINI.CARS)).filter(([id])=>!only||only.includes(id))){
    const r=await p.evaluate(async({id,ver,view})=>{await MINI.switchCar(id,ver);MINI.bayOpen();document.getElementById('menu').style.display='none';
      const c=MINI.car,TH=MINI.THREE,V=TH.Vector3,f=new V(c.M[0],0,c.M[6]).normalize(),r=new V(-f.z,0,f.x),ctr=new V(c.p[0],.75,c.p[2]),cam=MINI.camera;
      cam.clearViewOffset();if(view==='rearlow'){cam.position.copy(ctr).addScaledVector(f,-4.6).addScaledVector(r,2.6).add(new V(0,-.42,0));cam.lookAt(ctr.clone().addScaledVector(f,-1.2).add(new V(0,-.35,0)));}
      else{cam.position.copy(ctr).addScaledVector(f,5.2).addScaledVector(r,-3.6).add(new V(0,.9,0));cam.lookAt(ctr);}cam.fov=38;cam.updateProjectionMatrix();
      MINI.renderer.render(MINI.scene,cam);return {tris:Math.round(MINI.truck.tris/1000)+'k',draws:MINI.truck.draws,s:+(MINI.truck.ms/1000).toFixed(1)};},{id,ver,view});
    await p.waitForTimeout(200);await p.screenshot({path:path.join(out,id+'_'+ver+(view==='front'?'':'_'+view)+'.png'),timeout:240000});console.log(id,ver,JSON.stringify(r));}
  console.log(errs.length?'page errors: '+errs.join(' | '):'no page errors');await b.close();})();
