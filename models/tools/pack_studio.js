/* The Studio car in the game's own mesh form, packed as Baked SUV Test packs its baked truck (33b_baked_data.js), so
   the game can draw it without building it (building takes seconds): models/<car>/<car>_studio_data.js,
   STUDIO_CARS[<car>] = {parts: {...}, hinge, hubs}. Each part is one mesh in the game's form, its triangles indexed:
   position (16-bit in the part's box), normal (8-bit), colour (8-bit, gamma 2.2) with the emissive (8-bit, x100), the
   game's or the Studio's material (8-bit: the game's 0-31, the Studio's 70-108, the lamps by what they do: 96 head,
   83 tail and brake lens, 82 amber lens, 97 reversing lens, 108 headlamp lens; the game's own 7, 8, 10, 23 too).
   Parts: body (the shell, face, tail, cabin, trim), under (the underside), hide (what the hood hides), hood (in the
   car's frame; it turns about the hinge), bay (with the hood up), wheel (what turns; the right one, the left is it
   mirrored) and brake (what only steers), and hubs: where each wheel goes [x, y, z, side, front].
   usage: node models/tools/pack_studio.js <car> <out.js> */
const fs=require('fs');const [id,out]=process.argv.slice(2);
const K=require('./kit.js')();K.setHD(true);const T=K.studioBuild(id,.25),D=T.D,b=T.b;
function pack(list){const P=[],N=[],C=[],M=[];for(const s of list){if(!s||!s.p)continue;for(let i=0;i<s.p.length;i++){P.push(s.p[i]);N.push(s.n[i]);}for(let i=0;i<s.c.length;i++)C.push(s.c[i]);for(let i=0;i<s.m.length;i++)M.push(s.m[i]);}
  const nv=P.length/3;let lo=[1e9,1e9,1e9],hi=[-1e9,-1e9,-1e9];for(let i=0;i<nv;i++)for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],P[i*3+k]);hi[k]=Math.max(hi[k],P[i*3+k]);}
  const sc=hi.map((h,k)=>Math.max(h-lo[k],1e-6)),map=new Map(),qp=[],qn=[],qc=[],qm=[],I=new Uint32Array(nv);
  const g=v=>Math.round(Math.pow(Math.min(1,Math.max(0,v)),1/2.2)*255);
  for(let i=0;i<nv;i++){const p=[0,1,2].map(k=>Math.round((P[i*3+k]-lo[k])/sc[k]*65535)),l=Math.hypot(N[i*3],N[i*3+1],N[i*3+2])||1,n=[0,1,2].map(k=>Math.round(N[i*3+k]/l*127)),
      c=[g(C[i*4]),g(C[i*4+1]),g(C[i*4+2]),Math.min(255,Math.round(C[i*4+3]*100))],m=M[i]|0,key=p.join(',')+'|'+n.join(',')+'|'+c.join(',')+'|'+m;
    let j=map.get(key);if(j===undefined){j=qm.length;map.set(key,j);qp.push(...p);qn.push(...n);qc.push(...c);qm.push(m);}I[i]=j;}
  const v=qm.length,b64=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength).toString('base64');
  return {v,t:nv/3,box:[...lo,...sc],P:b64(new Uint16Array(qp)),N:b64(new Int8Array(qn)),C:b64(new Uint8Array(qc)),M:b64(new Uint8Array(qm)),I:b64(v>65535?I:new Uint16Array(I)),i32:v>65535};}
const fixed=[T.body,...Object.entries(T.hd||{}).filter(([k,v])=>v&&v.p&&k!=='hood').map(([k,v])=>v)];
const parts={body:pack(fixed),under:pack([T.under]),hide:pack([T.hide]),hood:pack([T.hood,T.bay&&T.bay.liner,T.hd&&T.hd.hood]),bay:pack([T.bay.bay,T.bay.engine]),wheel:pack([T.wheel]),brake:pack([T.brake])};
const fx=D.X(D.uFa),wb=D.uRa-D.uFa,hubs=[];for(const front of [1,0])for(const s of [1,-1])hubs.push([front?fx:fx-wb*Math.cos(D.pitch),front?b.look.tyre.R:D.Rr,s*(front?b.look.track:b.look.trackR||b.look.track)/2,s,front]);
const js=`/* =====================================================================================
   THE STUDIO ${id.toUpperCase()} IN THE GAME'S OWN MESH FORM, written by models/tools/pack_studio.js from the Studio's code
   (models/src): every part of the car, indexed and packed (see the tool for the layout). One file a car:
   STUDIO_CARS['${id}'].
   ===================================================================================== */
var STUDIO_CARS=STUDIO_CARS||{};STUDIO_CARS[${JSON.stringify(id)}]=${JSON.stringify({parts,hinge:D.hood.hinge,hubs})};
`;
fs.writeFileSync(out,js);console.log(out,(js.length/1048576).toFixed(1)+' MB',Object.fromEntries(Object.entries(parts).map(([k,v])=>[k,[v.v,v.t]])));
