/* A car written out for Blender (tools/studio_glb.py, cycles_render.py, bake.py), exactly as the viewer builds it.
   usage: node models/tools/export_parts.js <car> <out-dir>
   - <out-dir>/studio: the Studio car in its pieces, as the .glb has them: the body (with the face, tail, cabin and
     trim fixed to it), the four lamps by what they do (head, tail and brake, amber, reversing), the underside, what
     the hood hides, the hood (about its hinge), the engine bay, and for each wheel what turns and what only steers
     (the caliper and the shield); each piece split by material, a flat triangle list (Float32 positions, normals,
     colours) in the piece's own frame, with where the piece goes and what it hangs from.
   - <out-dir>/bake-in: what the bake needs (as Baked SUV Test's export.js): the game's own car (skin, glass, underside,
     each triangle tagged with its part: 0 the body, 1 the hood, 2 what the hood hides) and its wheel; the Studio car
     without its clear glass and lenses (the bake looks through them) and without the cabin (the game's glass can't be
     seen through); each list: Float32 positions (9 a triangle), normals (9), colours (12), a material and a part each. */
const fs=require('fs'),path=require('path');
const [id,outDir]=process.argv.slice(2);if(!id||!outDir){console.log('usage: node export_parts.js <car> <out-dir>');process.exit(1);}
const K=require('./kit.js')(),MAT=K.MAT,SM=K.SM;
/* ---------- the Studio car ---------- */
K.setHD(true);const T=K.studioBuild(id,.25),b=T.b,D=T.D,look=b.look;
const S=path.join(outDir,'studio');fs.mkdirSync(S,{recursive:true});
const LAMP={head:[SM.LAMPH,SM.LENSH,MAT.HEAD,MAT.LED,MAT.HALO],tail:[SM.REDL,MAT.TAIL],amber:[SM.AMBERL,MAT.AMBER],reverse:[SM.LENSR,MAT.REV]};
const lampOf={};for(const [k,ids] of Object.entries(LAMP))for(const i of ids)lampOf[i]='lamp_'+k;
const man={id,build:{paint:b.paint,paint2:b.paint2,rim:b.rim,cal:b.cal,clad:b.clad},MAT,SM,nodes:[],pieces:[]};
let fileN=0;const tris={};
/* a node: a name, where it is in its parent, what it hangs from */
const node=(name,parent,t=[0,0,0],extra={})=>{man.nodes.push({name,parent,t,...extra});};
/* triangles from builders' arrays into a piece, split by material; xf(p) moves a point into the piece's frame, mir
   mirrors it across z (the left wheels: their own mirrored copy, so no node is scaled by -1) */
function put(srcs,name,{xf=null,mir=false,keep=null}={}){const by=new Map();
  for(const src of srcs){if(!src||!src.p)continue;const P=src.p,N=src.n,C=src.c,M=src.m;
    for(let t=0;t<P.length/9;t++){const m=M[t*3]|0;if(keep&&!keep(m))continue;let a=by.get(m);if(!a)by.set(m,a=[]);a.push(src,t);}}
  for(const [m,lst] of by){const n=lst.length/2,pp=new Float32Array(n*9),nn=new Float32Array(n*9),cc=new Float32Array(n*12);
    for(let i=0;i<n;i++){const src=lst[i*2],t=lst[i*2+1],ord=mir?[0,2,1]:[0,1,2];
      for(let v=0;v<3;v++){const s=ord[v];let p=[src.p[t*9+s*3],src.p[t*9+s*3+1],src.p[t*9+s*3+2]],q=[src.n[t*9+s*3],src.n[t*9+s*3+1],src.n[t*9+s*3+2]];
        if(mir){p[2]=-p[2];q[2]=-q[2];}if(xf)p=xf(p);for(let k=0;k<3;k++){pp[i*9+v*3+k]=p[k];nn[i*9+v*3+k]=q[k];}for(let k=0;k<4;k++)cc[i*12+v*4+k]=src.c[t*12+s*4+k];}}
    const f='p'+(fileN++);fs.writeFileSync(path.join(S,f+'.bin'),Buffer.concat([pp,nn,cc].map(a=>Buffer.from(a.buffer))));
    man.pieces.push({file:f,node:name,mat:m,tris:n});tris[name]=(tris[name]||0)+n;}}
/* the body and everything fixed to it, the lamps apart */
const fixed=[T.body,...Object.entries(T.hd||{}).filter(([k,v])=>v&&v.p&&k!=='hood').map(([k,v])=>v)];
node('car',null);node('body','car');put(fixed,'body',{keep:m=>!lampOf[m]});
for(const k of Object.keys(LAMP)){node('lamp_'+k,'car',[0,0,0],{lamp:k});put(fixed,'lamp_'+k,{keep:m=>lampOf[m]==='lamp_'+k});}
if(T.under){node('under','car');put([T.under],'under');}
node('hide','car');put([T.hide],'hide');
/* the hood about its hinge (it opens by turning about z there); the pad under it lifts with it */
{const [hx,hy]=D.hood.hinge;node('hood','car',[hx,hy,0],{hinge:true,open:1.0});put([T.hood,T.bay&&T.bay.liner,T.hd&&T.hd.hood].filter(Boolean),'hood',{xf:p=>[p[0]-hx,p[1]-hy,p[2]]});}
if(T.bay){node('bay','car');put([T.bay.bay,T.bay.engine],'bay');}
/* the wheels: a steering node at each hub, what turns under it, and what only steers beside it */
{const fx=D.X(D.uFa),wb=D.uRa-D.uFa;
  for(const [front,s,tag] of [[1,1,'fr'],[1,-1,'fl'],[0,1,'rr'],[0,-1,'rl']]){const x=front?fx:fx-wb*Math.cos(D.pitch),tw=(front?look.track:look.trackR||look.track)/2,y=front?look.tyre.R:D.Rr;
    node('steer_'+tag,'car',[x,y,s*tw],{steers:!!front});node('wheel_'+tag,'steer_'+tag,[0,0,0],{spins:true});put([front?T.wheel:T.wheelR],'wheel_'+tag,{mir:s<0});
    const br=front?T.brake:T.brakeR;if(br){node('brake_'+tag,'steer_'+tag);put([br],'brake_'+tag,{mir:s<0});}}}
man.tris=tris;man.total=Object.values(tris).reduce((a,v)=>a+v,0);
man.D={L:D.L,uC:D.uC,uFa:D.uFa,uRa:D.uRa,Hr:D.Hr,R:look.tyre.R,track:look.track,hinge:D.hood.hinge,belt:[D.belt(D.G.cowl+.5),D.belt(D.G.pillars[0][0])],cowl:D.G.cowl,rf:D.G.rf,pil:D.G.pillars.map(p=>p[0])};
fs.writeFileSync(path.join(S,'manifest.json'),JSON.stringify(man,null,1));
console.log(id,'studio:',man.pieces.length,'pieces,',man.total,'triangles',JSON.stringify(tris));
/* ---------- what the bake needs ---------- */
const B=path.join(outDir,'bake-in');fs.mkdirSync(B,{recursive:true});
const bm={MAT,SM,pieces:{}};
function write(name,list){const P=[],N=[],C=[],M=[],G=[];
  for(const [src,keep,part] of list){if(!src||!src.p)continue;const p=src.p;for(let t=0;t<p.length/9;t++){const m=src.m[t*3]|0;if(keep&&!keep(t,m,src.c[t*12]))continue;
    for(let k=0;k<9;k++){P.push(p[t*9+k]);N.push(src.n[t*9+k]);}for(let k=0;k<12;k++)C.push(src.c[t*12+k]);M.push(m);G.push(part||0);}}
  fs.writeFileSync(path.join(B,name+'.bin'),Buffer.concat([P,N,C,M,G].map(a=>Buffer.from(new Float32Array(a).buffer))));bm.pieces[name]={tris:M.length};}
K.setHD(false);const G=K.studioBuild(id,1);
const UNDER=.028,isGlass=m=>m===MAT.GLASS||m===MAT.GLASSL,isUnder=(m,c)=>m===MAT.METAL&&Math.abs(c-UNDER)<1e-4,parts=[G.body,G.hood,G.hide];
write('low_skin',parts.map((s,i)=>[s,(t,m,c)=>!isGlass(m)&&!isUnder(m,c),i]));
write('low_glass',parts.map((s,i)=>[s,(t,m)=>isGlass(m),i]));
write('low_under',parts.map((s,i)=>[s,(t,m,c)=>isUnder(m,c),i]));
write('low_wheel',[[G.wheel,null]]);
/* (the game's own engine bay and the pad under its hood, for the baked .glb: the game builds them when the hood opens) */
write('low_bay',[[G.bay.bay,null],[G.bay.engine,null]]);write('low_liner',[[G.bay.liner,null]]);
bm.D={uC:G.D.uC,uFa:G.D.uFa,uRa:G.D.uRa,R:G.b.look.tyre.R,track:G.b.look.track,pitch:G.D.pitch,spares:G.D.spares||null,hinge:G.D.hood.hinge};
const clear=m=>m===MAT.GLASS||m===MAT.GLASSL||m===SM.LENS||m===SM.TINT||m===SM.LENSH||m===SM.LENSR;
const hi=[[T.body,(t,m)=>!clear(m)],[T.hood,(t,m)=>!clear(m)],[T.hide,(t,m)=>!clear(m)],[T.under,(t,m)=>!clear(m)]];
for(const [nm,src] of Object.entries(T.hd))if(src&&src.p&&nm!=='cabin')hi.push([src,(t,m)=>!clear(m)]);
write('high_body',hi);write('high_wheel',[[T.wheel,(t,m)=>!clear(m)],[T.brake,(t,m)=>!clear(m)]]);
bm.build=man.build;bm.id=id;fs.writeFileSync(path.join(B,'manifest.json'),JSON.stringify(bm,null,1));
console.log(id,'bake-in:',JSON.stringify(Object.fromEntries(Object.entries(bm.pieces).map(([k,v])=>[k,v.tris]))));
