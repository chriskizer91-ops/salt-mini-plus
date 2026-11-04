/* =====================================================================================
   THE WEDGE'S UNDERSIDE (Studio 2), in place of the game's (the SUV's ladder frame and stick suspension). What a low
   mid-engined car has under it, nose to tail:
   - The skin's own floor kept at the nose, along the rockers and at the tail, in the floor's coating.
   - The front: the undertray under the radiator; the cradle (two crossmembers), double wishbones (the lower on two
     bushes, the upper on the tub's wall), cast uprights and their steering arms, a coilover each side up into the
     trunk's tub, the anti-roll bar, the steering rack ahead of the axle and its tie rods.
   - The middle: the flat floor panels under the cabin, their seams and fasteners, two NACA ducts feeding the
     gearbox's cooler; the sills' pinch welds and four jacking points.
   - The rear: the engine's room open underneath (86 wdV12 o.noFloor), its two fuel tanks either side ahead of the
     rear wheels; the cradle, double wishbones, two coilovers a side, the anti-roll bar behind, the drive shafts out
     of the gearbox; the oil cooler's lines.
   - The exhaust's tailpipes: from the silencer across the tail (86's) out to the game's four tips; (o.side: the
     Night Runner's two side exits off the right turbo, along inside the right sill).
   o: spring and damper colours, side.
   ===================================================================================== */
function wdUnder2(car,o={}){
  const K=HDK,D=K.D,X=K.X,lk=D.look,L=D.L,LY=wdLay(car,o),dy=LY.dy,yb=LY.yb,U=new MB(),G=D.G;
  const Pt=(u,y,z)=>[X(u),y,z],part=(f,deg=35,oo=null,M=null)=>hdPart(U,f,deg,oo,M);
  const COAT=SMC('#8a8d91',SM.BEDLINER),COATD=SMC('#74777b',SM.BEDLINER),SEAM=SMC('#6a6d71',SM.ENGINE),FRAME=SMC('#2a2b2e',SM.PAINTED),
    ARM=SMC('#34363a',SM.PAINTED),ALU=SMC('#a3a6ab',SM.CAST),FORGE=SMC('#8d9095',SM.ENGINE),STEEL=SMC('#2a2b2e',SM.ENGINE),
    EXH=SMC('#8b867c',SM.SATIN),TANK=SMC('#26272a',SM.PAINTED),RB=SV([.02,.02,.021],MAT.RUBBER),LINE=SMC('#c0c2c5',SM.BOLT),HOSE=SMC('#141415',SM.HOSE),
    TRAY=SMC('#2c2d30',SM.PLASTIC),SPR=SMC(o.spring||'#c8a21a',SM.PAINTED),DAMP=SMC(o.damper||'#2a2b2e',SM.PAINTED),BOLT=HC.BOLT,BLK=SMC('#141516',SM.PAINTED),CV=SMC('#7d8086',SM.ENGINE);
  const R=LY.R,tw=LY.tw,hubZ=LY.hubZ,uFa=D.uFa,uRa=D.uRa,u0=G.cowl+.1,u1=G.rr,yT=yb(.158);
  /* ================= the skin's underside: the nose, the rockers and the tail kept ================= */
  {const sk=hdUnder(car);
    hdDrop(sk,c=>{const u=D.uC-c[0];return u>.25&&u<L-.12&&Math.abs(c[2])<D.plan(clamp(u,0,L))*.82;});
    for(let t=0;t<sk.m.length/3;t++)for(let k=0;k<3;k++){const i=t*12+k*4;sk.c[i]=COAT[0][0];sk.c[i+1]=COAT[0][1];sk.c[i+2]=COAT[0][2];sk.m[t*3+k]=COAT[2];}
    hdPut(U,sk);Object.assign(car.hide,{p:[],n:[],c:[],m:[]});}

  /* ================= the flat floor under the cabin ================= */
  {const ze=u=>secKeys(D,clamp(u,0,L)).P[0][0]-.01;
    part(mb=>{const rows=[];for(let u=u0;u<=u1+1e-6;u+=.03){const z0=ze(u),row=[];for(let j=0;j<=30;j++){const z=-z0+2*z0*j/30;row.push(Pt(u,yT,z));}rows.push(row);}hdLoft(mb,rows,TRAY,false,true);},40);
    /* the panels' seams, their fasteners round the edges, two NACA ducts toward the back */
    part(mb=>{for(const u of [u0+.4,u0+.8])hdRBox(mb,Pt(u,yT-.0015,0),[.003,.0015,ze(u)-.03],.001,SMC('#141416',SM.PLASTIC),1);hdRBox(mb,Pt((u0+u1)/2,yT-.0015,0),[(u1-u0)/2-.03,.0015,.003],.001,SMC('#141416',SM.PLASTIC),1);
      for(let u=u0+.05;u<u1;u+=.1)for(const s of [1,-1]){cpHex(mb,Pt(u,yT-.001,s*(ze(u)-.03)),[0,-1,0],.006,.003);cpHex(mb,Pt(u,yT-.001,s*.02),[0,-1,0],.006,.003);}},30);
    for(const s of [1,-1])part(mb=>{const c=[X(u1-.2),yT-.001,s*.25],P=[[-.12,-.02],[-.12,.02],[.06,.045],[.1,.045],[.1,-.045],[.06,-.045]].map(([a,b])=>[c[0]+a,c[2]+b]);
      hdLoft(mb,[P.map(([x,z])=>[x,yT-.0012,z]),P.map(([x,z])=>[x+(x-c[0])*.0,yT+.025*((x-c[0]+.12)/.22),z])],SMC('#0c0c0d',SM.PLASTIC),true,true);},30);}
  /* the sills: the pinch weld along the bottom, four jacking points */
  for(const s of [1,-1]){part(mb=>{const pts=[];for(let u=uFa+D.arch.a+.04;u<=uRa-D.archB.a-.04;u+=.05){const P1=secKeys(D,u).P[1];pts.push(Pt(u,P1[1]+.004,s*(P1[0]-.012)));}
      hdSweep(mb,pts,[[-.002,-.014],[.002,-.014],[.002,.005],[-.002,.005]],SEAM,[0,1,0],true,true);},30);
    for(const u of [uFa+D.arch.a+.12,uRa-D.archB.a-.12]){const P1=secKeys(D,u).P[1],c=Pt(u,P1[1]-.006,s*(P1[0]-.06));
      part(mb=>{hdRBox(mb,V3.add(c,[0,.004,0]),[.045,.004,.03],.004,STEEL,2);hdCyl(mb,V3.add(c,[0,.002,0]),V3.add(c,[0,-.006,0]),.024,.022,20,RB);},30);}}

  /* ================= the front ================= */
  /* the undertray under the radiator, its louvres */
  {const y=yb(.19);part(mb=>{const rows=[];for(let u=.12;u<=.62+1e-6;u+=.02){const ze=Math.min(.55,D.plan(u)*.62),row=[];for(let j=0;j<=20;j++)row.push(Pt(u,y,-ze+2*ze*j/20));rows.push(row);}hdLoft(mb,rows,TRAY,false,true);},30);
    part(mb=>{for(let z=-.24;z<=.241;z+=.06)hdRBox(mb,Pt(.4,y-.003,z),[.08,.003,.012],.002,SMC('#0b0b0c',SM.PLASTIC),1);for(const [u,z] of [[.15,-.4],[.15,.4],[.6,-.45],[.6,.45]])cpHex(mb,Pt(u,y-.002,z),[0,-1,0],.007,.004);},30);}
  /* the cradle: two crossmembers under the trunk */
  const cy=yb(.2),cz=.36;
  for(const u of [uFa-.2,uFa+.22])part(mb=>{const pts=[];for(let k=0;k<=12;k++)pts.push(Pt(u,cy,-cz-.04+2*(cz+.04)*k/12));hdSweep(mb,pts,hdRRect(.022,.02,.006,3),FRAME,[0,1,0],true,true);},40);
  for(const s of [1,-1])cpBar(U,[Pt(uFa-.22,cy+.002,s*cz),Pt(uFa+.24,cy+.002,s*cz)],.02,.018,.006,FRAME,[0,1,0],38);
  /* each side: the wishbones, the upright and its steering arm, the coilover, the brake's hose */
  const corner=(ua,s,front)=>{const Q=([u,y,z])=>Pt(u,y,s*z),B=Q([ua,R-.14,hubZ-.03]),UB=Q([ua,R+.13,hubZ-.06]),HB=Q([ua,R,hubZ-.03]);
    const lf=Q([ua-.13,cy+.01,cz+.02]),lr=Q([ua+.13,cy+.01,cz+.02]),uf=Q([ua-.11,R+.16,cz+.16]),ur=Q([ua+.11,R+.16,cz+.16]);
    for(const p of [lf,lr])cpBar(U,[p,V3.lerp(p,B,.5),B],.016,.011,.005,FORGE,[0,1,0],40);for(const p of [uf,ur])cpBar(U,[p,V3.lerp(p,UB,.5),UB],.012,.009,.004,FORGE,[0,1,0],40);
    for(const p of [lf,lr])cpBush(U,p,[1,0,0],.024,.05);for(const p of [uf,ur]){cpBush(U,p,[1,0,0],.02,.04);part(mb=>{hdRBox(mb,Q([D.uC-p[0],p[1],cz+.12]),[.03,.03,.006],.004,STEEL,2);},30);}
    part(mb=>{ball(mb,B,.02,12,FORGE);ball(mb,UB,.017,12,FORGE);},30);
    cpBar(U,[V3.add(B,[0,.03,0]),HB,V3.add(UB,[0,-.025,0])],.022,.015,.007,ALU,[0,0,1],40);
    cpRev(U,Q([ua,R,hubZ-.06]),Q([ua,R,hubZ-.0]),[[0,0],[.048,0],[.055,.012],[.055,.05],[.048,.06],[0,.06]],ALU,28,35);
    /* the coilover(s), from the lower wishbone up into the tub */
    for(const du of front?[0]:[-.08,.08]){const a=Q([ua+du,R-.11,hubZ-.1]),t=Q([ua+du,archY(D,ua+du)+.035,Math.min(hubZ-.07,.64)]);
      cpCoilover(U,a,t,{bodyL:V3.len(V3.sub(t,a))*.5,s0:V3.len(V3.sub(t,a))*.2,s1:V3.len(V3.sub(t,a))*.62,rs:.042,turns:5,wire:.008,spring:SPR,body:DAMP});}
    part(mb=>{const p=[Q([ua+.06,R+.24,cz+.2]),Q([ua+.06,R+.2,hubZ-.12]),Q([ua+.04,R+.08,hubZ-.06])];hdTube(mb,suvPath(p,3,1),.006,8,SMC('#111',SM.HOSE),false,true);},40);
    return {B,HB,Q};};
  for(const s of [1,-1]){const c=corner(uFa,s,true),Q=c.Q;
    /* the steering arm forward to the tie rod */
    cpBar(U,[Q([uFa,R-.02,hubZ-.05]),Q([uFa-.12,R-.03,hubZ-.08])],.011,.009,.004,ALU,[0,1,0],40);}
  /* the rack ahead of the axle, its boots and tie rods */
  {const u=uFa-.13,y=R-.03;part(mb=>{hdCyl(mb,Pt(u,y,-.3),Pt(u,y,.3),.02,.02,18,ALU);hdRBox(mb,Pt(u,y+.01,-.18),[.03,.035,.04],.01,ALU,3);hdCyl(mb,Pt(u,y+.04,-.18),Pt(u+.08,y+.2,-.25),.014,.014,12,ALU);},35);
    for(const s of [1,-1]){cpBoot(U,Pt(u,y,s*.3),Pt(u,y,s*.4),.022,.026,5);part(mb=>{const a=Pt(u,y,s*.4),b=Pt(uFa-.12,R-.03,s*(hubZ-.08));hdCyl(mb,a,b,.009,.009,12,STEEL);ball(mb,b,.014,12,STEEL);},35);}}
  /* the anti-roll bar behind the axle, its links */
  {const u=uFa+.2,y=cy-.025;part(mb=>{const pts=[Pt(uFa+.06,y+.03,-(hubZ-.12)),Pt(u,y,-.4),Pt(u,y,0),Pt(u,y,.4),Pt(uFa+.06,y+.03,hubZ-.12)];hdTube(mb,suvPath(pts,4,2),.011,10,BLK,false,true);
    for(const s of [1,-1])hdRBox(mb,Pt(u,y,s*.3),[.02,.016,.016],.004,RB,2);},35);}

  /* ================= the rear ================= */
  /* the fuel tanks either side of the engine's room, ahead of the rear wheels */
  for(const s of [1,-1])part(mb=>{const c=Pt(2.73,yb(.3),s*.71);hdRBox(mb,c,[.19,.11,.09],.03,TANK,4);for(let k=-3;k<=3;k++)hdRBox(mb,V3.add(c,[k*.05,-.111,0]),[.006,.003,.075],.002,TANK,1);
    for(const du of [-.12,.12]){hdRBox(mb,V3.add(c,[du,-.113,0]),[.016,.003,.1],.002,STEEL,1);}},35);
  /* the cradle under the gearbox, two crossmembers */
  const ry=yb(.21),rz=.36;
  for(const u of [uRa-.24,uRa+.26])part(mb=>{const pts=[];for(let k=0;k<=12;k++)pts.push(Pt(u,ry,-rz-.04+2*(rz+.04)*k/12));hdSweep(mb,pts,hdRRect(.022,.02,.006,3),FRAME,[0,1,0],true,true);},40);
  for(const s of [1,-1])cpBar(U,[Pt(uRa-.26,ry+.002,s*rz),Pt(uRa+.28,ry+.002,s*rz)],.02,.018,.006,FRAME,[0,1,0],38);
  for(const s of [1,-1]){const c=corner(uRa,s,false),Q=c.Q;
    /* the toe link forward of the upright */
    cpBar(U,[Q([uRa-.2,cy+.05,cz+.02]),Q([uRa-.08,R-.06,hubZ-.06])],.01,.009,.004,FORGE,[0,1,0],40);
    /* the drive shaft out of the gearbox */
    const ji=Q([uRa,R,.16]),jo=Q([uRa,R,hubZ-.07]);cpBoot(U,ji,V3.lerp(ji,jo,.18),.04,.02,5,SMC('#141415',SM.HOSE));cpBoot(U,jo,V3.lerp(jo,ji,.16),.042,.02,6,SMC('#141415',SM.HOSE));
    part(mb=>{hdCyl(mb,V3.lerp(ji,jo,.16),V3.lerp(jo,ji,.14),.015,.015,12,CV);hdCyl(mb,ji,V3.add(ji,[0,0,-s*.04]),.05,.05,20,ALU);},30);}
  /* the anti-roll bar behind the axle */
  {const u=uRa+.2,y=ry-.025;part(mb=>{const pts=[Pt(uRa+.06,y+.03,-(hubZ-.13)),Pt(u,y,-.4),Pt(u,y,0),Pt(u,y,.4),Pt(uRa+.06,y+.03,hubZ-.13)];hdTube(mb,suvPath(pts,4,2),.012,10,BLK,false,true);},35);}
  /* the gearbox's oil cooler lines forward to the NACA ducts' cooler */
  part(mb=>{for(const dz of [-.02,.02])hdTube(mb,suvPath([Pt(3.5,LY.yC-.12,.12+dz),Pt(3.2,yb(.22),.2+dz),Pt(2.6,yb(.2),.25+dz),Pt(u1-.1,yT+.02,.25+dz)],3,1),.006,8,HOSE,false,true);
    hdRBox(mb,Pt(u1-.05,yT+.035,.25),[.07,.025,.09],.006,SMC('#2a2b2d',SM.ENGINE),2);},35);

  /* ================= the tailpipes and the tips ================= */
  {const yS=LY.yC-.07,F=D.B.fit,ys=D.sill(L)+.01;D.tips=[];
    for(const s of [1,-1])for(const z of [.52,.64]){const c=Pt(L-.06,ys,s*z),b=V3.add(c,[-.1,0,0]),a=Pt(3.915,yS,s*(z>.6?.44:.36));
      part(mb=>{hdTube(mb,suvPath([a,Pt(3.98,yS,s*(z>.6?.5:.42)),Pt(4.06,(yS+ys)/2,s*z),[c[0]+.03,c[1],c[2]]],4,2),.024,12,EXH,false,true);},40);
      cpRev(U,V3.add(c,[.03,0,0]),b,[[.03,0],[.038,.01],[.042,.018],[.042,.124],[.039,.13],[.035,.126],[.035,.03]],MM.CHROME,32,40);
      cpRev(U,V3.add(b,[.05,0,0]),V3.add(b,[.004,0,0]),[[0,0],[.032,0],[.032,.046]],SMC('#151515',SM.CAST),20,40);D.tips.push({p:b,d:[-1,0,0],r:.042});}
    /* (o.side: two side exits off the right turbo, forward inside the right sill, out through it) */
    if(o.side){const uo=k=>D.uRa-D.arch.a-.18+k,yo=u=>F.sideExY!=null?D.sill(u)+F.sideExY:.36+dy+F.rdy,zo=F.sideEx||.86,yl=yb(.2);
      part(mb=>{hdTube(mb,suvPath([Pt(3.62,LY.yC-.03,.46),Pt(3.5,yb(.26),.62),Pt(3.2,yl,.72),Pt(3.0,yl,.74)],4,2),.026,12,EXH,false,true);},40);
      for(const k of [-.09,.09]){const ua=uo(k),ya=yo(ua),c=Pt(ua,ya,zo),d0=[0,-.15,1],bw=V3.add(c,V3.mul(d0,.1)),d=V3.norm(d0);
        part(mb=>{hdTube(mb,suvPath([Pt(3.0,yl,.74),Pt(ua+.06,yl,.76),Pt(ua,ya,.8),c],3,2),.024,12,EXH,false,true);},40);
        cpRev(U,V3.add(c,V3.mul(d,-.03)),bw,[[.03,0],[.042,.012],[.046,.02],[.046,.124],[.042,.13],[.038,.126],[.038,.03]],MM.CHROME,32,40);
        cpRev(U,V3.add(bw,V3.mul(d,-.06)),V3.add(bw,V3.mul(d,-.004)),[[0,0],[.036,0],[.036,.056]],SMC('#151515',SM.CAST),20,40);D.tips.push({p:bw,d,r:.046});}}}
  return U;
}
