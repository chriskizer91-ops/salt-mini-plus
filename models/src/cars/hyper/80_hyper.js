/* =====================================================================================
   THE HYPERCAR IN THE STUDIO: the game's own mid-engine V10 (36_hyper BODIES.hyper, the Stock build in
   37_newbuilds: "Nothing in town is faster"), built finer, with each part modelled again in this folder, one file a
   part: 81 the wheel, 82 the face (lamps, intakes, the slot, the bonnet's vents, the flank intakes), 83 the tail
   (the light blades, the mesh panel, the two fat tips, the diffuser), 84 the bolt-ons and the engine cover's
   louvres, 85 the cabin, 86 the V10 behind the cabin and the bay round it, 87 the front trunk (79_bay's
   mid-engine layout). What the game paints on as decals or builds as plain boxes and this folder builds again is
   left off the game's body (skip); the game's own pipes and tips, which nothing skips, are taken off its body
   here and built again. The Track edition (../hyper-track) is built by the same hpBuild with its own parts added.
   ===================================================================================== */
HD_CARS.hyper={
  skip:{FACES:['hyper'],TAILS:['hyper'],FRONTS:['lip'],REARS:['coupeDiff']},
  build(out){hpBuild(out,{});},
  views:{cabin:D=>{const G=D.G,u=G.rr-.05;return {p:[D.X(u),D.belt(u)+.36,1.75],t:[D.X(G.cowl+.5),D.belt(u)-.25,-.25]};}}
};
/* the build, shared with the Track: o {wheel (a function of the tyre), track (the Track's parts), short (the flank
   intakes shortened by this much, clear of the flares)} */
function hpBuild(out,o){
  const b=out.b,lk=b.look;
  const W=(o.wheel||hpWheel)(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
  /* (with flares, the widebody's way: the fender's own skin kept, the game's flare taken off out to its full stand-off) */
  const ar=new MB();hdArches(ar,out,lk.flares?{skin:1}:{});out.hd.arches=ar;
  if(lk.flares){const fl=new MB();hdFlares(fl);out.hd.flares=fl;}
  {const f=new MB(),h=new MB();hpFace(f,out,o);hpHoodVents(h,out);out.hd.face=f;out.hd.hood=h;}
  {const t=new MB();hpTail(t,out);out.hd.tail=t;}
  {const c=new MB();hpCabin(c,out);out.hd.cabin=c;}
  {const t=new MB();hdMirrorsRace(t,out);hpHandles(t,out);hdWipers(t,out);hpCover(t,out);out.hd.trim=t;}
  {const e=new MB();hpEngine(e,out);out.hd.engine=e;}
  if(o.track)o.track(out);
  out.bay=hpBay(out);
  out.under=hdUnder(out);
}
/* where a line a + t d meets a convex outline P (2D): [t0, t1], or null */
function hpClip(P,a,d){let t0=-1e9,t1=1e9;const w=hdCCW(P);
  for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],n=[-(q[1]-p[1])*w,(q[0]-p[0])*w],num=(a[0]-p[0])*n[0]+(a[1]-p[1])*n[1],den=d[0]*n[0]+d[1]*n[1];
    if(Math.abs(den)<1e-12){if(num<0)return null;continue;}const t=-num/den;if(den>0)t0=Math.max(t0,t);else t1=Math.min(t1,t);}
  return t1>t0?[t0,t1]:null;}
/* a woven mesh across a convex outline P (2D): bars on the two diagonals every pc metres, each from at(p2, lift) */
function hpMesh(mb,P,pc,r,m,at){const c=hdCen(P);
  for(const d of [[Math.SQRT1_2,Math.SQRT1_2],[Math.SQRT1_2,-Math.SQRT1_2]]){const n=[-d[1],d[0]];
    for(let k=-60;k<=60;k++){const a=[c[0]+n[0]*k*pc,c[1]+n[1]*k*pc],T=hpClip(P,a,d);if(!T||T[1]-T[0]<.01)continue;
      const path=[];const ns=Math.max(1,Math.ceil((T[1]-T[0])/.03));for(let i=0;i<=ns;i++){const t=T[0]+(T[1]-T[0])*i/ns;path.push(at([a[0]+d[0]*t,a[1]+d[1]*t],d[0]>0===d[1]>0?0:r*1.6));}
      hdTube(mb,path,r,4,m,false,false);}}}
