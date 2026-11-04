/* =====================================================================================
   THE SUV'S STUDIO 2 KIT (models/src/cars/suv-stock, 90 to 99): what the SUV's second Studio version is built on, for
   all four of its builds (the Stock here; the Sleeper, the Rock & Mud and the Race in their own folders call it).
   The SUV is a body on a ladder frame (21_suv: "an original mid-2000s midsize SUV"), so its underside is two things:
   the body's own floor, pressed with a tunnel down the middle, and the frame under it, which everything hangs from.
   - suvLay: the numbers the underside, the bay and the cabin share for a build: where its body sits (the lift), where
     its wheels are, and the drivetrain's line from the crank back to the rear differential.
   - suvPanY: the floor's underside at (u, z): the toe board rising to the firewall, the flat floor, the tunnel over
     the gearbox and the transfer case (tallest at the bell housing, coming down over the driveshaft), a pocket
     raised over the tank, the heel kick over the rear axle and the cargo floor behind it. The cabin's carpet lies
     6 cm above it.
   - suvRail: the frame's rail at u: how far out (z) and how high (y) its centre is: close together between the front
     wheels, out under the cabin, kicked up over the rear axle, level again to the rear crossmember.
   - suvKeys: a smooth line through key points (each stretch eased in and out, so the rail's bends are S-shaped
     like a pressed frame's).
   ===================================================================================== */
function suvKeys(K,i){return u=>{if(u<=K[0][0])return K[0][i];for(let k=0;k<K.length-1;k++){const a=K[k],b=K[k+1];if(u<=b[0]){const t=sm01((u-a[0])/(b[0]-a[0]));return a[i]+(b[i]-a[i])*t;}}return K[K.length-1][i];};}
/* the layout for a build: o.lift (the body's height over the Stock's, the game's dy), the wheels (the game's) */
function suvLay(car,o={}){const K=HDK,D=K.D,lk=D.look,dy=D.dy,R=lk.tyre.R;
  const L={D,dy,R,Rr:D.Rr,tw:lk.track/2,twR:(lk.trackR||lk.track)/2,W:lk.tyre.W,uFa:D.uFa,uRa:D.uRa,yb:y=>y+dy,
    /* the drivetrain: the crank's height (the game's engine, 31_engine_bay), the gearbox down to its tail, the transfer
       case, and the rear driveshaft down to the differential's pinion just ahead of the axle */
    crankY:o.crankY||.578+dy,uBell:1.29,uTail:2.3,uTc:2.62,uPin:D.uRa-.2};
  L.pinY=Math.min(L.yb(.43),R+.05);
  return L;}
/* ---------- the floor's underside ---------- */
/* the tunnel: its height over the flat floor and its half width at u (the bell housing's mouth at the firewall, the
   gearbox, the transfer case, then the rear driveshaft) */
const suvTunH=suvKeys([[1.4,.36],[1.68,.34],[2.25,.29],[2.6,.23],[2.9,.14],[3.38,.065],[3.5,0]],1);
const suvTunW=suvKeys([[1.4,.25],[1.7,.24],[2.05,.19],[2.4,.21],[2.7,.13],[3.4,.11]],1);
/* the tank's pocket: [u0, u1, z0, z1, rise] (the tank is left of the rear driveshaft) */
const SUV_TANK=[2.92,3.44,-.5,-.04,.04];
function suvPanY(u,z,dy=0){
  const az=Math.abs(z);
  /* the toe board up to the firewall, the flat floor, the heel kick over the rear axle to the cargo floor */
  let y=.44+.24*sm01((1.8-u)/.27)+.1*sm01((u-3.4)/.16);
  /* the pocket over the tank */
  const [t0,t1,z0,z1,tr]=SUV_TANK;y+=tr*sm01((u-t0)/.04)*sm01((t1-u)/.04)*sm01((z-z0)/.04)*sm01((z1-z)/.04);
  /* the tunnel, flat-topped with steep sides */
  const th=suvTunH(u),tw=suvTunW(u);if(th>0)y=Math.max(y,.44+th*sm01((tw-az)/.07+.5));
  return y+dy;}
/* ---------- the frame ---------- */
/* the rail's centre: [u, z, y] (the Stock's; a build moves it with the body, + dy) */
const SUV_RAIL=[[.16,.42,.455],[.55,.42,.43],[.72,.40,.40],[1.18,.40,.40],[1.42,.45,.385],[1.78,.53,.36],[3.28,.53,.36],[3.68,.53,.45],[4.06,.53,.45],[4.36,.5,.43],[4.88,.5,.45]];
const suvRailZ=suvKeys(SUV_RAIL,1),suvRailY=suvKeys(SUV_RAIL,2);
/* the rail's half height at u: a shallower horn ahead of the front wheels, deepest under the cabin */
const suvRailH=suvKeys([[.16,.042],[.6,.05],[1.4,.058],[1.8,.062],[3.3,.062],[3.7,.055],[4.74,.05]],1);
/* ---------- small pieces ---------- */
/* a profile that changes along the path: sec(i) gives the [x,y] outline at the i-th point (as hdSweep's) */
function suvSweepVar(mb,path,sec,m,upv=[0,1,0],caps=true){const rings=[];
  for(let i=0;i<path.length;i++){const a=path[Math.max(0,i-1)],b=path[Math.min(path.length-1,i+1)],t=V3.norm(V3.sub(b,a));
    const u=V3.norm(V3.sub(upv,V3.mul(t,V3.dot(upv,t)))),s=V3.cross(t,u);rings.push(sec(i).map(q=>V3.add(path[i],V3.add(V3.mul(s,q[0]),V3.mul(u,q[1])))));}
  hdLoft(mb,rings,m,true);if(caps){hdCap(mb,rings[0],m,true);hdCap(mb,rings[rings.length-1],m,false);}}
/* a path through points, each corner rounded (subdivided, then each inner point pulled toward its neighbours) */
function suvPath(pts,n=5,passes=1){let P=[];for(let i=0;i<pts.length-1;i++)for(let k=0;k<n;k++)P.push(V3.lerp(pts[i],pts[i+1],k/n));P.push(pts[pts.length-1]);
  for(let q=0;q<passes;q++)P=P.map((p,i)=>i===0||i===P.length-1?p:V3.mul(V3.add(V3.add(P[i-1],P[i+1]),V3.mul(p,2)),.25));return P;}
/* a U-joint: two yokes crossing, the cross's four caps, between a shaft ending at a and the next starting at a along d */
function suvUJoint(dst,a,d,r,m,cap){const M=cpAx(V3.add(a,V3.mul(d,-r*1.2)),V3.add(a,V3.mul(d,r*1.2)));
  hdPart(dst,mb=>{for(const [s,rot] of [[-1,0],[1,PI/2]]){const c=Math.cos(rot),sn=Math.sin(rot);
      for(const e of [-1,1]){const off=[c*e*r*.78,sn*e*r*.78];hdRBox(mb,[off[0],off[1],r*1.2+s*r*.55],[c?r*.22:r*.5,c?r*.5:r*.22,r*.6],r*.12,m,2);}}
    for(let q=0;q<4;q++){const ang=q*PI/2,cx=Math.cos(ang)*r*.82,cy=Math.sin(ang)*r*.82;hdCyl(mb,[cx*.2,cy*.2,r*1.2],[cx,cy,r*1.2],r*.18,r*.18,10,m);hdCyl(mb,[cx,cy,r*1.2],[cx*1.12,cy*1.12,r*1.2],r*.26,r*.26,12,cap||m);}},30,null,M);}
/* a rubber body mount: the puck between the frame and the body, its steel cup and the bolt's head under it */
function suvBodyMount(dst,c,h){const RB=SV([.02,.02,.021],MAT.RUBBER),ST=SMC('#1c1d1f',SM.PAINTED);
  hdPart(dst,mb=>{hdCyl(mb,c,V3.add(c,[0,h,0]),.036,.036,20,RB);hdCyl(mb,V3.add(c,[0,-.004,0]),V3.add(c,[0,.006,0]),.042,.042,20,ST);
    hdCyl(mb,V3.add(c,[0,-.02,0]),V3.add(c,[0,-.004,0]),.013,.013,6,HC.BOLT);hdCyl(mb,V3.add(c,[0,-.009,0]),V3.add(c,[0,-.004,0]),.02,.02,16,HC.BOLT);},30);}
