/* =====================================================================================
   THE WEDGE IN THE STUDIO: the game's own late-1980s mid-engine V12 supercar (35_wedge BODIES.wedge, the Stock
   build in 37_newbuilds), built finer, with each part modelled again in this folder, one file a part: 81 the wheel,
   82 the face and the pop-up lamps, 83 the tail, 84 the flank intakes and the louvred engine deck, 85 the cabin,
   86 the V12 behind the cabin (seen through the louvres) and the room it sits in, 87 the front trunk. The lip, the
   diffuser and the race mirrors are the shared ones (79_parts), as the game gives the car the same ones. What the
   game paints on as decals or builds as plain boxes and this folder builds again is left off the game's body
   (skip); the four tailpipes are the game's.
   ===================================================================================== */
HD_CARS.wedge={
  skip:{FACES:['wedge'],TAILS:['wedge'],FRONTS:['lip'],REARS:['coupeDiff'],EXTRAS:['popups']},
  build(out){wdBuild(out,{});},
  views:{cabin:D=>{const G=D.G;return {p:[D.X(G.pillars[0][0]-.1),D.belt(2.3)+.27,1.42],t:[D.X(G.cowl+.5),D.belt(2.3)-.3,-.28]};}}
};
/* the Wedge's parts, in the order they cut the body (the Night Runner's, cars/wedge-nightrunner, the same with its own
   on top: o.front, o.wheel, o.extra) */
function wdBuild(out,o){
  const lk=out.b.look;
  const W=(o.wheel||wdWheel)(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
  /* (skin: the Night Runner's widebody flares come off without the front fenders' skin, which rises past the belt) */
  const ar=new MB();hdArches(ar,out,{skin:1});out.hd.arches=ar;
  {const f=new MB();wdFace(f,out);if(o.front)o.front(f,out);else hdLip(f,out);out.hd.face=f;}
  {const t=new MB();wdTail(t,out);hdDiffuser(t,out,{rev:false});out.hd.tail=t;}
  {const h=new MB();wdPopups(h,out);if(o.hood)o.hood(h,out);out.hd.hood=h;}
  {const s=new MB();wdIntakes(s,out);out.hd.flanks=s;}
  {const e=new MB();wdDeck(e,out);wdV12(e,out);out.hd.engine=e;}
  {const c=new MB();wdCabin(c,out);out.hd.cabin=c;}
  {const t=new MB();hdMirrorsRace(t,out);hdHandles(t,out);hdWipers(t,out);out.hd.trim=t;}
  if(o.extra)o.extra(out);
  out.bay=wdBay(out);
  out.under=hdUnder(out);
}
/* a rounded rectangle, its corners in either order */
function wdRR(a0,a1,b0,b1,r){return RR2(Math.min(a0,a1),Math.max(a0,a1),Math.min(b0,b1),Math.max(b0,b1),r);}
/* a patch over a convex outline P (2-D) with convex holes taken out of it exactly: cells cl square, each clipped to P,
   then each hole cut out of it along its edges; pt(a, b) the 3-D point for a 2-D one, m the material, nrm the way the
   patch faces (each triangle wound to face it) */
function wdHoled(mb,P,holes,cl,pt,m,nrm){
  const w=hdCCW(P),bb=Q=>{let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const q of Q){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}return [x0,x1,y0,y1];};
  const [a0,a1,b0,b1]=bb(P),H=holes.map(h=>({h,w:hdCCW(h),b:bb(h)}));
  const na=Math.max(1,Math.ceil((a1-a0)/cl)),nb=Math.max(1,Math.ceil((b1-b0)/cl)),da=(a1-a0)/na,db=(b1-b0)/nb,V=q=>({q,p:[0,0,0],n:[0,0,0],c:[0,0,0,0]});
  const put=poly=>{const S=poly.map(v=>pt(v.q[0],v.q[1]));for(let k=1;k<S.length-1;k++){const A=S[0],B=S[k],C=S[k+1],N=V3.cross(V3.sub(B,A),V3.sub(C,A));
    if(V3.dot(N,typeof nrm==='function'?nrm(A):nrm)>=0)mb.tri(A,B,C,m[0],m[1],m[2]);else mb.tri(A,C,B,m[0],m[1],m[2]);}};
  for(let i=0;i<na;i++)for(let j=0;j<nb;j++){const a=a0+i*da,b=b0+j*db;let c=[[a,b],[a+da,b],[a+da,b+db],[a,b+db]].map(V);
    for(let k=0;k<P.length&&c.length>=3;k++)c=hdClip(c,P[k],P[(k+1)%P.length],w);if(c.length<3)continue;
    let parts=[c];
    for(const o of H){if(o.b[1]<a||o.b[0]>a+da||o.b[3]<b||o.b[2]>b+db)continue;const nx=[];
      for(const pc of parts){let rest=pc;for(let k=0;k<o.h.length&&rest.length>=3;k++){const e0=o.h[k],e1=o.h[(k+1)%o.h.length],op=hdClip(rest,e0,e1,-o.w);if(op.length>=3)nx.push(op);rest=hdClip(rest,e0,e1,o.w);}}
      parts=nx;}
    for(const pc of parts)put(pc);}
}
