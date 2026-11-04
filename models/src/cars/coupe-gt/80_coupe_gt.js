/* =====================================================================================
   THE COUPE GT IN THE STUDIO: the game's own GT racer on the Coupe's body (32_builds coupeGT: the front-engine V8
   fastback lowered, on wide bolted flares, slicks and gold centre-lock wheels, with a GT wing, a splitter, skirts and
   a roof scoop), built finer, with each part modelled again in this folder, one file a part: 81 the slick and the
   wheel, 82 the face and the splitter, 84 the bonnet's louvres and pins, 85 the cabin and its cage, 86 the wing, the
   skirts, the roof scoop, the sun strip, the filler and the door roundels. The face, the tail and the engine bay are
   the Coupe's (cars/coupe), as the game gives both cars the same; the race mirrors and the diffuser are the EV's
   (79_parts); the flares the Studio's (73_arch hdFlares) with their bolts modelled again here. What the game paints
   on as decals or builds as plain boxes and this folder builds again is left off the game's body (skip, and the
   wing and the flare bolts, which the game always builds, taken off by hand); the side pipes and the quad tailpipes
   are the game's.
   ===================================================================================== */
HD_CARS.coupeGT={
  skip:{FACES:['coupe'],TAILS:['coupe'],FRONTS:['race'],REARS:['coupeDiff'],HOODS:['vents'],EXTRAS:['skirts','raceKit']},
  build(out){
    const b=out.b,lk=b.look;
    const W=cgWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB(),sk=cgSkinSnap(out);hdArches(ar,out);cgSkinBack(out,sk);cgDropFlare(out);out.hd.arches=ar;
    {const fl=new MB();hdFlares(fl);cgFlareBolts(fl,out);out.hd.flares=fl;}
    {const f=new MB();cgFace(f,out);out.hd.face=f;}
    {const t=new MB();cpTail(t,out);out.hd.tail=t;}
    {const h=new MB();cgHood(h,out);out.hd.hood=h;}
    {const c=new MB();cgCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrorsRace(t,out);hdWipers(t,out);cgWing(t,out);cgSkirts(t,out);cgRaceKit(t,out);out.hd.trim=t;}
    out.bay=cpBay(out);
    out.under=hdUnder(out);
  },
  views:{cabin:D=>{const G=D.G,u=G.pillars[0][0]-.3;return {p:[D.X(u),D.belt(u)+.45,1.55],t:[D.X(G.cowl+.45),D.belt(u)-.2,-.3]};}}
};
/* ---------- small shared pieces of this folder (cars/hatch-groupb uses them too) ---------- */
/* the fender's own skin over a front arch that rises past the belt (the GT's, its fenders low): 73_arch hdArches
   takes off whatever stands 4 mm to 6 cm off the side round an arch, which there is the skin swelling over the arch
   as well as the game's flare, and leaves it torn; what it took off above the belt (the flare never goes there) is
   put back, from a copy of the body made before it (cgSkinSnap) */
function cgSkinSnap(car){const b=car.body;return {p:b.p.slice(),n:b.n.slice(),c:b.c.slice(),m:b.m.slice()};}
function cgSkinBack(car,S){const K=HDK,D=K.D,F=D.look.flares;if(!F)return;const b=car.body;
  for(let t=0;t<S.p.length/9;t++){const o=t*9,V=[0,1,2].map(k=>[S.p[o+k*3],S.p[o+k*3+1],S.p[o+k*3+2]]),cx=(V[0][0]+V[1][0]+V[2][0])/3,cy=(V[0][1]+V[1][1]+V[2][1])/3,u=D.uC-cx,m=S.m[t*3];
    if(m===MAT.METAL||cy<=D.arch.cy-.06||Math.max(V[0][1],V[1][1],V[2][1])<=D.belt(u)-.012)continue;
    let hit=false;for(const ua of [D.uFa,D.uRa]){const Ar=ua===D.uRa?D.archB:D.arch;if(Math.abs(u-ua)>Ar.a+F.w+.05)continue;
      let off=-1;for(const v of V){const vu=D.uC-v[0];off=Math.max(off,Math.abs(v[2])-K.sideZ(vu,Math.min(v[1],D.belt(vu)-.02)));}
      if(off>.004&&off<.06){hit=true;break;}}
    if(!hit)continue;for(let k=0;k<9;k++){b.p.push(S.p[o+k]);b.n.push(S.n[o+k]);}for(let k=0;k<12;k++)b.c.push(S.c[t*12+k]);for(let k=0;k<3;k++)b.m.push(S.m[t*3+k]);}}
/* what's left of the game's flares after 73_arch hdArches (which takes off what stands up to 6 cm off the side): a
   flare that stands out further (the GT's 10 cm, the Group B's 16) keeps its outer part, which would show through
   the Studio's flare; taken off here, by the flare's own material, round the arches */
function cgDropFlare(car){const K=HDK,D=K.D,F=D.look.flares;if(!F)return;const lim=F.out+.05,fm=F.mat?F.mat[2]:MAT.CLAD;
  /* (the game's flare never rises above the belt less 2 cm: what's above it there is the fender's own skin, kept) */
  for(const src of [car.body,car.hide])if(src&&src.p)hdDrop(src,(c,m,col,V)=>{if(m!==fm||c[1]<D.arch.cy-.07)return false;const u=D.uC-c[0];
    if(Math.max(V[0][1],V[1][1],V[2][1])>D.belt(u)-.012)return false;
    for(const ua of [D.uFa,D.uRa]){const Ar=ua===D.uRa?D.archB:D.arch;if(Math.abs(u-ua)>Ar.a+F.w+.05)continue;
      let off=-1;for(const v of V){const vu=D.uC-v[0];off=Math.max(off,Math.abs(v[2])-K.sideZ(vu,Math.min(v[1],D.belt(vu)-.02)));}
      if(off>.004&&off<lim)return true;}return false;});}
/* a polygon's corners rounded (each corner a curve r in from its two edges) */
function cgFillet(P,r,nc=4){const o=[],n=P.length;
  for(let i=0;i<n;i++){const a=P[(i+n-1)%n],p=P[i],b=P[(i+1)%n],da=Math.hypot(a[0]-p[0],a[1]-p[1]),db=Math.hypot(b[0]-p[0],b[1]-p[1]),rr=Math.min(r,da*.45,db*.45);
    const A=[p[0]+(a[0]-p[0])/da*rr,p[1]+(a[1]-p[1])/da*rr],B=[p[0]+(b[0]-p[0])/db*rr,p[1]+(b[1]-p[1])/db*rr];
    for(let k=0;k<=nc;k++){const t=k/nc,u=1-t;o.push([u*u*A[0]+2*u*t*p[0]+t*t*B[0],u*u*A[1]+2*u*t*p[1]+t*t*B[1]]);}}
  return o;}
/* a slab: the outline P in the (x, y) plane from z0 to z1, both faces' edges chamfered by b (eased when smoothed) */
function cgSlab(mb,P,z0,z1,m,b=.0015){const n=P.length;let A=0;for(let i=0;i<n;i++){const p=P[i],q=P[(i+1)%n];A+=p[0]*q[1]-q[0]*p[1];}const s=A>0?1:-1;
  const inset=d=>P.map((p,i)=>{const a=P[(i+n-1)%n],c=P[(i+1)%n],e1=V3.norm([p[0]-a[0],p[1]-a[1],0]),e2=V3.norm([c[0]-p[0],c[1]-p[1],0]);
    const n1=[-e1[1]*s,e1[0]*s],n2=[-e2[1]*s,e2[0]*s],nm=V3.norm([n1[0]+n2[0],n1[1]+n2[1],0]),k=Math.max(.35,nm[0]*n1[0]+nm[1]*n1[1]);return [p[0]+nm[0]*d/k,p[1]+nm[1]*d/k];});
  b=Math.min(b,(z1-z0)*.4);const I=inset(b),R3=(o,z)=>o.map(p=>[p[0],p[1],z]);
  hdLoft(mb,[R3(I,z0),R3(P,z0+b),R3(P,z1-b),R3(I,z1)],m,true,s<0);
  for(const [i,j,k] of hdTri2(I)){mb.tri([I[i][0],I[i][1],z1],[I[j][0],I[j][1],z1],[I[k][0],I[k][1],z1],m[0],m[1],m[2]);mb.tri([I[k][0],I[k][1],z0],[I[j][0],I[j][1],z0],[I[i][0],I[i][1],z0],m[0],m[1],m[2]);}}
/* a plate in the (x, y) plane at z, th thick, its outline's corners rounded and its edges eased */
function cgPlate(out,P,z,th,m,r=.012,deg=30){hdPart(out,mb=>{cgSlab(mb,cgFillet(P,r),z-th/2,z+th/2,m,Math.min(.002,th*.3));},deg);}
/* a path's corners eased (corner cutting, n rounds) */
function cgEase(P,n=2){let Q=P;for(let k=0;k<n;k++){const o=[Q[0]];for(let i=0;i<Q.length-1;i++){const a=Q[i],b=Q[i+1];o.push(a.map((v,j)=>v*.75+b[j]*.25),a.map((v,j)=>v*.25+b[j]*.75));}o.push(Q[Q.length-1]);Q=o;}return Q;}
/* a button-head bolt standing out of a surface at p along the normal n */
function cgBolt(mb,p,n,r,m){const a=V3.add(p,V3.mul(n,-.002)),b=V3.add(p,V3.mul(n,r*.35)),c=V3.add(p,V3.mul(n,r*.75));
  hdCyl(mb,a,b,r*1.15,r*1.15,14,m,false);hdCyl(mb,b,c,r*1.15,r*.7,14,m,false);hdCyl(mb,c,V3.add(c,V3.mul(n,.0006)),r*.7,.0005,14,m,false);}
