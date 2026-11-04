/* Numbers from the page without pictures: each argument is code run in the page with its handle (MINI) and the
   game's (DRIVE), the page's loop held; what it returns is printed. usage: node tools/eval.js 'code' ... */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:480,height:270}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(path.join(__dirname,'..','salt-mini-flames.html'))+'?shots=1');
  await p.waitForFunction(()=>window.MINI&&MINI.truck&&document.getElementById('loading').hidden,null,{timeout:900000,polling:500});
  await p.evaluate(()=>MINI.hold(true));
  for(const code of process.argv.slice(2)){const t0=Date.now();
    const r=await p.evaluate(async code=>(new Function('MINI','DRIVE','return (async()=>{'+(code.includes('return')?code:'return '+code)+'})()'))(MINI,window.DRIVE),code);
    console.log(((Date.now()-t0)/1000).toFixed(0)+'s',JSON.stringify(r));}
  console.log(errs.length?'page errors: '+errs.slice(0,5).join(' | '):'no page errors');await b.close();})();
