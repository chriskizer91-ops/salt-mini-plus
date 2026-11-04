/* hashes of Studio builds in any page that has window.KIT: node hashpage.js <page.html> <ids comma> [alt] */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const [page,ids,alt]=process.argv.slice(2);const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:320,height:200}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(page)+'?shots=1');await p.waitForFunction(()=>window.KIT&&window.KIT.studioBuild,null,{timeout:600000});await p.waitForTimeout(3000);
  const r=await p.evaluate(({ids,alt})=>{const K=window.KIT,h=a=>{let x=2166136261>>>0;const u=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);for(let i=0;i<u.length;i++){x^=u[i];x=Math.imul(x,16777619)>>>0;}return x.toString(16);};
    const out={};for(const id of ids.split(',')){K.setHD(true);if(K.setAlt)K.setAlt(alt||'');let T;try{T=K.studioBuild(id,.25);}catch(e){out[id]='ERROR '+e.message;continue;}if(K.setAlt)K.setAlt('');
      const parts={body:T.body,hood:T.hood,hide:T.hide,wheel:T.wheel,wheelR:T.wheelR,brake:T.brake,under:T.under,bay:T.bay&&T.bay.bay,engine:T.bay&&T.bay.engine};for(const [k,v] of Object.entries(T.hd||{}))if(v&&v.p)parts['hd.'+k]=v;
      const o={};let tri=0;for(const [k,v] of Object.entries(parts))if(v&&v.p){o[k]=h(new Float32Array(v.p))+':'+h(new Float32Array(v.c))+':'+h(new Float32Array(v.m));tri+=v.p.length/9;}out[id]={tri:Math.round(tri),parts:o};}return out;},{ids,alt});
  console.log(JSON.stringify(r));console.error(errs.length?'page errors: '+errs.join(' | '):'no page errors');await b.close();})();
