/* Every car built in every version, and a fingerprint of every part's arrays (positions, normals, colours, materials),
   so two copies of the models can be compared exactly: the same fingerprint is the same numbers, bit for bit.
   usage: node models/tools/same_check.js [repo-root] > prints.json      (the repo root defaults to this one)
          node models/tools/same_check.js --compare a.json b.json         (lists every part that differs)
   Versions: game (the game's own, setHD false), studio (setHD true), and each other Studio version the car has
   (HD_CARS[id+alt], setAlt(alt): studio2 for '2', studio2d for '2d', ...). */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
if(process.argv[2]==='--compare'){
  const A=JSON.parse(fs.readFileSync(process.argv[3],'utf8')),B=JSON.parse(fs.readFileSync(process.argv[4],'utf8'));let same=0,diff=0;
  for(const k of Object.keys(A)){if(!(k in B)){console.log('only in the first:',k);diff++;continue;}
    const a=A[k],b=B[k];for(const p of new Set([...Object.keys(a),...Object.keys(b)])){if(p==='ms')continue;
      if(JSON.stringify(a[p])===JSON.stringify(b[p]))same++;else{diff++;console.log('DIFFERS:',k,p,JSON.stringify(a[p]),JSON.stringify(b[p]));}}}
  for(const k of Object.keys(B))if(!(k in A))console.log('only in the second:',k);
  console.log(diff?`${diff} parts differ, ${same} identical`:`identical: all ${same} parts`);process.exit(diff?1:0);}
const root=path.resolve(process.argv[2]||path.join(__dirname,'..','..'));
const K=require(path.join(root,'models','tools','kit.js'))();
const fp=a=>{if(!a)return null;const f=new Float64Array(a.length);for(let i=0;i<a.length;i++)f[i]=a[i];return crypto.createHash('sha1').update(Buffer.from(f.buffer)).digest('hex').slice(0,16);};
const part=s=>s&&s.p?{tris:s.p.length/9,p:fp(s.p),n:fp(s.n),c:fp(s.c),m:fp(s.m)}:null;
const ids=process.env.CARS?process.env.CARS.split(','):K.BUILDS.map(b=>b.id).filter(id=>id==='stock'||K.HD_CARS[id]);
/* (a car's other Studio versions: the HD_CARS entries named its id and an alt that starts with a digit, e.g. coupe2) */
const alts=id=>Object.keys(K.HD_CARS).filter(k=>k.length>id.length&&k.startsWith(id)&&/^[0-9]/.test(k.slice(id.length))).map(k=>k.slice(id.length));
const out={};
for(const id of ids)for(const v of ['game','studio',...alts(id).map(a=>'studio'+a)]){
  const alt=v.startsWith('studio')?v.slice(6):'';
  K.setHD(v!=='game');if(K.setAlt)K.setAlt(alt);const t0=Date.now();
  let T;try{T=K.studioBuild(id,v==='game'?1:.25);}finally{K.setHD(true);if(K.setAlt)K.setAlt('');}
  const o={ms:Date.now()-t0};
  for(const k of ['body','hood','hide','wheel','wheelR','brake','brakeR','under'])if(T[k]&&T[k].p&&!(k==='wheelR'&&T.wheelR===T.wheel)&&!(k==='brakeR'&&T.brakeR===T.brake))o[k]=part(T[k]);
  if(T.bay)for(const k of ['bay','engine','liner'])if(T.bay[k])o['bay.'+k]=part(T.bay[k]);
  for(const [k,s] of Object.entries(T.hd||{}))if(s&&s.p)o['hd.'+k]=part(s);
  out[id+'/'+v]=o;process.stderr.write(`${id}/${v} ${o.ms} ms\n`);}
console.log(JSON.stringify(out,null,1));
