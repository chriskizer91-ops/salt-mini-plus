/* A car's Studio 2 in numbers, beside its Studio: the triangles of each piece (the body with the face, tail, trim and
   wheel houses on it; the hood with what lifts with it; the cabin; the underside; the engine bay; one wheel, what
   turns; one brake, what only steers) and the whole car as the viewer draws it (the four wheels and brakes counted,
   Studio 2's bay drawn all the time, Studio's only with the hood up, so left out), and how long it takes to build
   here (the best of three, in Node on this machine).
   usage: node models/tools/s2_numbers.js <car> <folder>   (writes models/<folder>/numbers_s2.json) */
const fs=require('fs'),path=require('path');
const [id,folder]=process.argv.slice(2);if(!id||!folder){console.log('usage: node s2_numbers.js <car> <folder>');process.exit(1);}
const K=require('./kit.js')();
const n=s=>s&&s.p?s.p.length/9:0;
function measure(alt){let best=1e9,T;for(let k=0;k<3;k++){K.setHD(true);K.setAlt(alt);const t0=Date.now();T=K.studioBuild(id,.25);best=Math.min(best,Date.now()-t0);}K.setAlt('');
  const hd=T.hd||{},body=n(T.body)+Object.entries(hd).filter(([k])=>k!=='cabin'&&k!=='hood').reduce((a,[,v])=>a+n(v),0),hood=n(T.hood)+n(hd.hood)+n(T.bay&&T.bay.liner),
    cabin=n(hd.cabin),under=n(T.under),bay=n(T.bay&&T.bay.bay)+n(T.bay&&T.bay.engine),wheel=n(T.wheel),brake=n(T.brake),wheelR=T.wheelR&&T.wheelR!==T.wheel?n(T.wheelR):wheel,brakeR=T.brakeR&&T.brakeR!==T.brake?n(T.brakeR):brake,
    spares=(T.D.spares||[]).length*wheel;
  const shut=body+hood+n(T.hide)+cabin+under+2*(wheel+brake+wheelR+brakeR)+spares;
  return {triangles:alt?shut+bay:shut,triangles_bay_up:shut+bay,by_piece:{body,hood,hide:n(T.hide),cabin,under,bay,wheel,brake},build_ms:best};}
const N={car:id,studio:measure(''),studio2:K.HD_CARS[id+'2']?measure('2'):null};
fs.writeFileSync(path.join(__dirname,'..',folder,'numbers_s2.json'),JSON.stringify(N,null,1)+'\n');
console.log(JSON.stringify(N));
