/* =====================================================================================
   THE HATCH'S UNDERSIDE (Studio 2), in place of the game's (the SUV's ladder frame, a box for a tank and stick
   suspension, as it hangs under every body). What a three-door unibody with its engine across the nose and four-
   wheel drive has under it, nose to tail:
   - The skin's own floor kept at the nose, along the rockers and at the tail, in the floor's coating; between them
     the pan built here (90 htPanY): the toe board, the tunnel, the step under the rear seat, the boot's floor and the
     spare's well; its beads, the sills' pinch welds and four jacking pads, the drain plugs.
   - The legs (the frame's rails, pressed into the shell): from the bumper's beam back under the bay, down under the
     toe board and along the floor, up over the rear wheels to the tail; the front's undertray under the radiator.
   - The front: the subframe under the engine on four bushes, L-shaped lower arms on it, MacPherson struts (the
     knuckle, its steering arm, the damper and its spring up into the tower), the anti-roll bar and its links; the
     drive shafts out of the transaxle in their boots.
   - The drivetrain: the propshaft from the transfer box down the tunnel in two pieces (its centre bearing, a
     viscous coupling, three joints) to the rear differential on its subframe, the rear drive shafts.
   - The rear: struts again, two transverse links a side and a trailing rod forward, the anti-roll bar ahead of the
     axle.
   - The exhaust: from the turbo's downpipe a flex section, the catalyst under its shield and its oxygen sensor, the
     centre box, along the right of the tank, under the rear subframe to the transverse box behind the axle, and out
     to the game's tip; the hangers.
   - The tank in its straps under the rear seat, a saddle over the propshaft; the lines along the floor (two brake
     lines, the fuel's feed and return), the handbrake's cables to the rear calipers.
   o: the build's choices: skids (an aluminium guard under the sump, the gearbox and the subframe, one under the
   tank), spring (the struts' springs' colour), exhaust 'straight' (a pipe in place of the centre box).
   ===================================================================================== */
function htUnder2(car,o={}){
  const K=HDK,D=K.D,X=K.X,lk=D.look,L=D.L,LY=htLay(car,o),dy=LY.dy,yb=LY.yb,U=new MB(),G=D.G;
  const Pt=(u,y,z)=>[X(u),y,z],part=(f,deg=35,oo=null,M=null)=>hdPart(U,f,deg,oo,M);
  const COAT=SMC('#8a8d91',SM.BEDLINER),COATD=SMC('#74777b',SM.BEDLINER),SEAM=SMC('#6a6d71',SM.ENGINE),FRAME=SMC('#2a2b2e',SM.PAINTED),
    ARM=SMC('#34363a',SM.PAINTED),ALU=SMC('#a3a6ab',SM.CAST),FORGE=SMC('#5c5f63',SM.ENGINE),STEEL=SMC('#2a2b2e',SM.ENGINE),
    EXH=SMC('#8b867c',SM.SATIN),EXHB=SMC('#6e5c4a',SM.CAST),SHIELD=SMC('#c6c6c1',SM.BRUSH),TANK=SMC('#1b1c1e',SM.PLASTIC),
    RB=SV([.02,.02,.021],MAT.RUBBER),LINE=SMC('#c0c2c5',SM.BOLT),FUEL=SMC('#121213',SM.HOSE),HOSE=SMC('#141415',SM.HOSE),CLIP=SMC('#121214',SM.PLASTIC),
    SPR=SMC(o.spring||'#2c2d30',SM.PAINTED),DAMP=SMC(o.damper||'#2a2b2e',SM.PAINTED),BOLT=HC.BOLT,BLK=SMC('#141516',SM.PAINTED),CV=SMC('#7d8086',SM.ENGINE);
  const pan=(u,z)=>htPanY(u,z,dy),tw=LY.tw,hubZ=LY.hubZ,R=LY.R,uFa=D.uFa,uRa=D.uRa,uT=G.cowl+.06,uB=L-.1;
  /* (the floor's edge: the rockers' inner face, the wheel houses' inner walls at the rear) */
  const zE=u=>Math.min(secKeys(D,clamp(u,0,L)).P[0][0]-.012,Math.abs(u-uRa)<D.archB.a+.04?.5:.72);

  /* ================= the skin's underside ================= */
  {const sk=hdUnder(car);
    hdDrop(sk,c=>{const u=D.uC-c[0];return u>.2&&u<uB&&Math.abs(c[2])<D.plan(clamp(u,0,L))*.82;});
    for(let t=0;t<sk.m.length/3;t++)for(let k=0;k<3;k++){const i=t*12+k*4;sk.c[i]=COAT[0][0];sk.c[i+1]=COAT[0][1];sk.c[i+2]=COAT[0][2];sk.m[t*3+k]=COAT[2];}
    hdPut(U,sk);Object.assign(car.hide,{p:[],n:[],c:[],m:[]});}

  /* ================= the floor ================= */
  {const zs=[];for(let k=0;k<=40;k++)zs.push(-1+2*k/40);
    part(mb=>{const rows=[];for(let u=uT;u<=uB+1e-6;u+=.03){const ze=zE(u);rows.push(zs.map(t=>{const z=t*ze;return Pt(u,pan(u,z),z);}));}hdLoft(mb,rows,COAT,false,true);},40);
    /* its walls up to the rockers where the pan stands above them, and in the rear wheel houses */
    for(const s of [1,-1])part(mb=>{const rows=[];for(let u=uT;u<=uB+1e-6;u+=.03){const ze=zE(u),y0=pan(u,s*ze),P0=secKeys(D,clamp(u,0,L)).P[0];rows.push([Pt(u,y0,s*ze),Pt(u,Math.min(y0,Math.max(P0[1],yb(.21))),s*(ze+.006)),Pt(u,Math.min(y0,Math.max(P0[1],yb(.21)))-.002,s*(P0[0]+.004))]);}
      hdLoft(mb,rows,COATD,false,s>0);},30);}
  /* the pressed beads across the pan, either side of the tunnel */
  for(const s of [1,-1])part(mb=>{for(const u of [1.55,1.75,1.95,2.15])hdRBox(mb,Pt(u,pan(u,s*.42)-.003,s*.42),[.012,.004,.2],.004,COAT,2);
    for(const u of [2.6,2.8])hdRBox(mb,Pt(u,pan(u,s*.3)-.003,s*.3),[.04,.004,.12],.004,COAT,2);},30);
  /* the sills: the pinch weld along the bottom, the jacking pads */
  for(const s of [1,-1]){part(mb=>{const pts=[];for(let u=uFa+D.arch.a+.04;u<=uRa-D.archB.a-.04;u+=.05){const P1=secKeys(D,u).P[1];pts.push(Pt(u,P1[1]+.004,s*(P1[0]-.012)));}
      hdSweep(mb,pts,[[-.002,-.016],[.002,-.016],[.002,.006],[-.002,.006]],SEAM,[0,1,0],true,true);},30);
    for(const u of [uFa+D.arch.a+.12,uRa-D.archB.a-.12]){const P1=secKeys(D,u).P[1],c=Pt(u,P1[1]-.01,s*(P1[0]-.012));
      part(mb=>{hdRBox(mb,V3.add(c,[0,.005,-s*.008]),[.05,.004,.026],.004,STEEL,2);hdCyl(mb,V3.add(c,[0,.004,-s*.01]),V3.add(c,[0,-.008,-s*.01]),.028,.026,24,RB);},30);}}
  /* the drain plugs */
  part(mb=>{for(const [u,z] of [[1.5,.55],[2.05,.28],[2.3,.6],[3.0,.25]])for(const s of [1,-1]){const c=Pt(u,pan(u,s*z)-.001,s*z);hdCyl(mb,c,V3.add(c,[0,-.005,0]),.02,.018,18,RB);}},30);
  /* the heat shield over the exhaust, from the catalyst to the tank */
  part(mb=>{const rows=[];for(let u=1.02;u<=2.36;u+=.04){const row=[];for(let k=0;k<=10;k++){const z=.15+.2*k/10;row.push(Pt(u,pan(u,z)-.008-.0015*Math.sin(u*90+k),z));}rows.push(row);}hdLoft(mb,rows,SHIELD,false,true);},30);

  /* ================= the legs ================= */
  const RZ=.5,RW=.03,legY=u=>u<1.0?yb(.36):u<1.45?lerp(yb(.36),pan(1.45,RZ)-.025,sm01((u-1.0)/.45)):u<2.55?pan(u,RZ)-.025:u<2.7?lerp(pan(2.55,RZ)-.025,yb(.34),sm01((u-2.55)/.15)):yb(.34),
    legH=u=>u<1.0?.04:.025;
  for(const s of [1,-1]){const us=[];for(let u=.1;u<=uB+1e-6;u+=.03)us.push(u);
    part(mb=>{suvSweepVar(mb,us.map(u=>Pt(u,legY(u),s*RZ)),i=>hdRRect(RW,legH(us[i]),.007,3),COATD,[0,1,0],true);},40);
    part(mb=>{for(const u of [.3,.9,1.7,2.2,3.3]){const c=Pt(u,legY(u)-legH(u)-.0005,s*RZ);hdCyl(mb,c,V3.add(c,[0,-.002,0]),.012,.012,14,SMC('#060607',SM.PAINTED));}},20);}
  /* the bumper's beam across the legs' ends, the front tow eye's socket; the rear beam and its tow eye */
  {const y=yb(.34);part(mb=>{const pts=[];for(let z=-.62;z<=.621;z+=.05)pts.push(Pt(.08+.02*Math.pow(Math.abs(z)/.62,2),y,z));hdSweep(mb,pts,hdRRect(.022,.04,.006,3),FRAME,[0,1,0],true,true);},40);
    part(mb=>{const c=Pt(.06,y-.02,.42);hdCyl(mb,c,V3.add(c,[.03,0,0]),.016,.016,16,STEEL);const r=[];for(let k=0;k<=20;k++){const a=k/20*TAU;r.push(V3.add(c,[.045+Math.cos(a)*.022,Math.sin(a)*.022,0]));}hdTube(mb,r,.006,8,STEEL,true,false);},30);
    const yr=yb(.36);part(mb=>{const pts=[];for(let z=-.62;z<=.621;z+=.05)pts.push(Pt(L-.12,yr,z));hdSweep(mb,pts,hdRRect(.02,.035,.006,3),FRAME,[0,1,0],true,true);
      const c=Pt(L-.11,yr-.035,-.38),r=[];for(let k=0;k<=20;k++){const a=k/20*TAU;r.push(V3.add(c,[-.02+Math.cos(a)*.02,-.022+Math.sin(a)*.02,0]));}hdTube(mb,r,.006,8,STEEL,true,false);},40);}
  /* the front's undertray under the radiator and the intercooler, its louvres, screwed on */
  if(!o.skids){const y=yb(.205);part(mb=>{const rows=[];for(let u=.06;u<=.38+1e-6;u+=.02){const row=[];for(let z=-.5;z<=.501;z+=.025)row.push(Pt(u,y+.01*sm01((.12-u)/.06),z));rows.push(row);}hdLoft(mb,rows,SMC('#1a1b1d',SM.PLASTIC),false,true);},30);
    part(mb=>{for(let z=-.2;z<=.201;z+=.05)hdRBox(mb,Pt(.3,y-.003,z),[.06,.003,.012],.002,SMC('#0b0b0c',SM.PLASTIC),1);for(const [u,z] of [[.1,-.4],[.1,.4],[.36,-.45],[.36,.45],[.36,0]])cpHex(mb,Pt(u,y-.002,z),[0,-1,0],.008,.005);},30);}

  /* ================= the front ================= */
  /* the subframe under the engine: two side members, the crossmembers ahead and behind, on bushes up to the legs */
  const sfy=yb(.215),sfz=.34;
  for(const s of [1,-1]){cpBar(U,[Pt(.42,sfy,s*sfz),Pt(.6,sfy-.005,s*sfz),Pt(.8,sfy-.005,s*sfz),Pt(.91,sfy,s*sfz)],.025,.022,.007,FRAME,[0,1,0],38);
    for(const u of [.45,.89]){part(mb=>{hdSweep(mb,[Pt(u,sfy,s*sfz),Pt(u,sfy+.01,s*.42),Pt(u,sfy+.02,s*(RZ-.03))],[[-.025,-.02],[.025,-.02],[.025,.02],[-.025,.02]],FRAME,[0,1,0],true,true);},30);
      cpBush(U,Pt(u,(sfy+.03+legY(u)-legH(u))/2,s*(RZ-.01)),[0,1,0],.028,Math.max(.02,legY(u)-legH(u)-sfy-.04));}}
  for(const u of [.42,.9])part(mb=>{const pts=[];for(let k=0;k<=12;k++)pts.push(Pt(u,sfy+.002,-sfz+2*sfz*k/12));hdSweep(mb,pts,hdRRect(.024,.022,.007,3),FRAME,[0,1,0],true,true);},40);
  /* each side: the L-shaped lower arm (its front bush and the rear one), the ball joint; the knuckle and its steering
     arm, the strut (its damper up through the spring into the tower); the drive shaft out of the transaxle */
  for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*z),bj=Q([uFa,yb(.19)+(R-.3),hubZ-.02]),fp=Q([uFa-.11,sfy+.01,sfz+.02]),rp=Q([uFa+.22,sfy+.01,sfz+.04]);
    cpBar(U,[fp,Q([uFa-.06,sfy+.005,(sfz+hubZ)/2]),bj],.02,.012,.006,ARM,[0,1,0],40);cpBar(U,[rp,Q([uFa+.1,sfy+.004,(sfz+hubZ)/2+.02]),bj],.018,.011,.006,ARM,[0,1,0],40);
    cpBush(U,fp,[1,0,0],.022,.05);cpBush(U,rp,[0,1,0],.03,.03);
    part(mb=>{ball(mb,bj,.022,14,FORGE);hdCyl(mb,bj,V3.add(bj,[0,.04,0]),.012,.01,12,FORGE);},30);
    /* the knuckle: a cast upright behind the hub, its arm back to the tie rod's end */
    const kn=Q([uFa,R,hubZ-.035]);part(mb=>{hdRBox(mb,V3.add(kn,[0,-.04,0]),[.05,.09,.025],.015,CV,3);hdTube(mb,[V3.add(kn,[-.03,-.04,0]),Q([uFa+.1,yb(.36)+(R-.3),tw-.13])],.012,10,CV,false,true);},30);
    /* the strut: from the knuckle up and in to the tower's mount */
    const sb=V3.add(kn,[0,.06,-s*.0]),top=Q([uFa+.03,archY(D,uFa+.03)+.035,.56]);
    cpCoilover(U,sb,top,{bodyL:V3.len(V3.sub(top,sb))*.55,s0:V3.len(V3.sub(top,sb))*.48,s1:V3.len(V3.sub(top,sb))*.9,rs:.052,turns:5,wire:.01,spring:SPR,body:DAMP});
    /* the drive shaft: inner joint at the transaxle (or the transfer box on the right), outer at the hub */
    const ji=s<0?Pt(LY.diff[0],LY.diff[1],LY.diff[2]-.25):Pt(LY.diff[0]+.04,LY.diff[1]+.005,LY.diff[2]+.2),jo=Q([uFa,R,hubZ-.07]);
    cpBoot(U,ji,V3.lerp(ji,jo,.18),.042,.022,5,SMC('#141415',SM.HOSE));cpBoot(U,jo,V3.lerp(jo,ji,.14),.045,.022,6,SMC('#141415',SM.HOSE));
    part(mb=>{hdCyl(mb,V3.lerp(ji,jo,.16),V3.lerp(ji,jo,.88),.014,.014,12,CV);hdCyl(mb,ji,V3.add(ji,V3.mul(V3.norm(V3.sub(ji,jo)),.03)),.045,.045,20,CV);},30);}
  /* the anti-roll bar ahead, in its clamps under the subframe's front, its links up to the arms */
  {const y=sfy-.03,u=.42;part(mb=>{const pts=[];for(const s of [-1,1])pts.push(Pt(uFa-.02,y+.01,s*.56),Pt(u+.02,y,s*.48));pts.splice(2,0,Pt(u,y,0));
      const P2=[pts[0],pts[1],pts[2],pts[4],pts[3]];hdTube(mb,suvPath(P2,4,2),.011,10,BLK,false,true);
      for(const s of [1,-1]){hdRBox(mb,Pt(u+.02,y,s*.3),[.022,.016,.018],.004,RB,2);hdCyl(mb,Pt(uFa-.02,y+.01,s*.56),Pt(uFa-.04,sfy+.02,s*.56),.006,.006,8,STEEL);}},35);}

  /* ================= the drivetrain ================= */
  /* the propshaft: its front joint on the transfer box's output, the centre bearing and the viscous coupling, the rear
     joint at the differential's pinion */
  const pr0=Pt(LY.ptu[0]+.03,LY.ptu[1],LY.ptu[2]),pyR=LY.rdiff[1]+.005,pr2=Pt(LY.uPin-.04,pyR,0),uM=1.9,pr1=Pt(uM,(pr0[1]+pyR)/2+.01,.0);
  part(mb=>{hdCyl(mb,pr0,V3.lerp(pr0,pr1,.97),.032,.032,16,STEEL);hdCyl(mb,V3.lerp(pr1,pr2,.03),pr2,.034,.034,16,STEEL);
    for(const p of [pr0,pr2])hdCyl(mb,V3.add(p,[.015,0,0]),V3.add(p,[-.015,0,0]),.045,.045,18,FORGE);},35);
  suvUJoint(U,pr1,[-1,0,0],.026,FORGE);
  part(mb=>{hdRBox(mb,V3.add(pr1,[.06,.04,0]),[.035,.02,.08],.006,STEEL,2);hdCyl(mb,V3.add(pr1,[.09,0,0]),V3.add(pr1,[.03,0,0]),.045,.045,20,RB);
    const vc=V3.add(pr1,[-.25,0,0]);hdCyl(mb,vc,V3.add(vc,[-.16,0,0]),.055,.055,24,ALU);for(let k=0;k<8;k++)hdRBox(mb,V3.add(vc,[-.08,0,0]),[.08,.004,.058],.002,ALU,1);
    for(const e of [-1,1])hdRBox(mb,V3.add(pr1,[.06,.04,e*.1]),[.02,.006,.02],.003,STEEL,1);},30);
  /* the rear differential: its case, the finned cover behind, the outputs; on its subframe */
  const RD=Pt(uRa,pyR,0);
  part(mb=>{const rings=[];for(let k=0;k<=12;k++){const t=k/12,u=LY.uPin-.03+(uRa+.12-LY.uPin+.03)*t,e=Math.sin(Math.max(.1,Math.min(1,t*1.05))*PI)**.5,w=.12*e,h=.1*e;rings.push(hdRRect(Math.max(.02,w),Math.max(.02,h),Math.max(.01,Math.min(w,h)*.55),5).map(([z,y])=>Pt(u,pyR+y,z)));}
    hdLoft(mb,rings,ALU,true);hdCap(mb,rings[0],ALU,true);hdCap(mb,rings[12],ALU,false);
    for(let k=-3;k<=3;k++)hdRBox(mb,Pt(uRa+.1,pyR+k*.025,0),[.012,.004,.08],.003,ALU,1);cpHex(mb,Pt(uRa+.03,pyR-.1,0),[0,-1,0],.01,.006);
    for(const s of [1,-1])hdCyl(mb,Pt(uRa,pyR,s*.1),Pt(uRa,pyR,s*.14),.045,.04,18,ALU);},30);
  /* the rear subframe: crossmembers ahead of and behind the differential, side members, bushes up to the legs */
  const rfy=yb(.28),rfz=.44;
  for(const u of [uRa-.2,uRa+.17])part(mb=>{const pts=[];for(let k=0;k<=12;k++)pts.push(Pt(u,rfy,-rfz+2*rfz*k/12));hdSweep(mb,pts,hdRRect(.022,.022,.007,3),FRAME,[0,1,0],true,true);},40);
  for(const s of [1,-1]){cpBar(U,[Pt(uRa-.22,rfy,s*rfz),Pt(uRa+.19,rfy,s*rfz)],.022,.022,.007,FRAME,[0,1,0],38);
    for(const u of [uRa-.2,uRa+.17])cpBush(U,Pt(u,(rfy+legY(u)-legH(u))/2,s*RZ),[0,1,0],.026,Math.max(.02,legY(u)-legH(u)-rfy-.03));
    /* the differential's arms to the crossmembers */
    part(mb=>{hdTube(mb,[Pt(LY.uPin,pyR-.03,s*.06),Pt(uRa-.2,rfy,s*.12)],.012,10,FRAME,false,true);hdTube(mb,[Pt(uRa+.1,pyR,s*.09),Pt(uRa+.17,rfy,s*.16)],.012,10,FRAME,false,true);},30);}
  /* each side: two transverse links and the trailing rod, the hub carrier, the strut up into the boot's tower, the
     drive shaft */
  for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*z),hc=Q([uRa,R,hubZ-.035]);
    part(mb=>{hdRBox(mb,V3.add(hc,[0,-.03,0]),[.06,.085,.024],.015,CV,3);},30);
    for(const du of [-.06,.06]){const a=Q([uRa+du,rfy-.005,rfz-.01]),bb=Q([uRa+du,yb(.2)+(R-.3),hubZ-.04]);cpBar(U,[a,V3.lerp(a,bb,.5),bb],.014,.014,.005,ARM,[0,1,0],40);cpBush(U,a,[1,0,0],.02,.04);cpBush(U,bb,[1,0,0],.02,.04);}
    {const a=Q([uRa-.3,legY(uRa-.3)-.06,RZ+.02]),bb=Q([uRa-.03,R-.04,hubZ-.05]);part(mb=>{hdCyl(mb,a,bb,.012,.012,12,ARM);},30);cpBush(U,a,[0,0,1],.022,.04);
      part(mb=>{hdRBox(mb,V3.add(a,[0,.035,0]),[.03,.035,.02],.004,FRAME,2);},30);}
    const sb=V3.add(hc,[0,.06,0]),top=Q([uRa+.02,archY(D,uRa+.02)+.03,.55]);
    cpCoilover(U,sb,top,{bodyL:V3.len(V3.sub(top,sb))*.55,s0:V3.len(V3.sub(top,sb))*.5,s1:V3.len(V3.sub(top,sb))*.95,rs:.06,turns:5,wire:.01,spring:SPR,body:DAMP});
    const ji=Q([uRa,pyR,.15]),jo=Q([uRa,R,hubZ-.07]);
    cpBoot(U,ji,V3.lerp(ji,jo,.2),.04,.02,5,SMC('#141415',SM.HOSE));cpBoot(U,jo,V3.lerp(jo,ji,.16),.042,.02,6,SMC('#141415',SM.HOSE));
    part(mb=>{hdCyl(mb,V3.lerp(ji,jo,.18),V3.lerp(jo,ji,.14),.013,.013,12,CV);},30);}
  /* the rear anti-roll bar ahead of the axle, its links to the hub carriers */
  {const u=uRa-.13,y=rfy-.02;part(mb=>{const pts=[Pt(u-.06,y+.03,-(hubZ-.08)),Pt(u,y,-.38),Pt(u,y,0),Pt(u,y,.38),Pt(u-.06,y+.03,hubZ-.08)];hdTube(mb,suvPath(pts,4,2),.009,10,BLK,false,true);
    for(const s of [1,-1])hdRBox(mb,Pt(u,y,s*.3),[.02,.014,.016],.004,RB,2);},35);}

  /* ================= the exhaust ================= */
  {const r=.026,TUBE=(pts,rr=r,m=EXH)=>part(mb=>{hdTube(mb,suvPath(pts,5,2),rr,14,m,false,true);},40);D.tips=[];
    const e=((car.bay&&car.bay.ex)||[])[0],fl=e?e.p:Pt(.97,yb(.25),.25),ys=yb(.215);
    part(mb=>{obox(mb,V3.add(fl,[-.004,0,0]),[1,0,0],[0,1,0],[0,0,1],[.004,.036,.036],EXHB);for(const dd of [-.026,.026])cpHex(mb,V3.add(fl,[-.008,dd,0]),[-1,0,0],.007,.006);},30);
    /* the flex section */
    TUBE([V3.add(fl,[-.008,0,0]),Pt(1.0,yb(.235),.25)],.03);part(mb=>{for(let k=0;k<=8;k++){const c=Pt(1.0+k*.012,yb(.233)-k*.001,.25);hdCyl(mb,V3.add(c,[.005,0,0]),V3.add(c,[-.005,0,0]),.034,.034,18,SMC('#b8b6b0',SM.SATIN));}},30);
    /* the catalyst: an oval can under its shield, the sensor */
    {const u0=1.12,u1=1.42,zc=.25,yc=ys+.005;
      part(mb=>{const rings=[];for(const [t,k] of [[0,.5],[.06,.95],[.1,1],[.9,1],[.94,.95],[1,.5]]){const u=u0+(u1-u0)*t;rings.push(hdRRect(.075*k,.045*k,.035*k,8).map(([z,y])=>Pt(u,yc+y,zc+z)));}hdLoft(mb,rings,EXH,true);hdCap(mb,rings[0],EXH,true);hdCap(mb,rings[5],EXH,false);},40);
      part(mb=>{const rows=[];for(let u=u0-.02;u<=u1+.02;u+=.02){const row=[];for(let k=0;k<=10;k++){const a=PI*.05+PI*.9*k/10;row.push(Pt(u,yc-Math.sin(a)*.056,zc+Math.cos(a)*.088));}rows.push(row);}hdLoft(mb,rows,SHIELD,false,true);},30);
      TUBE([Pt(1.06,yb(.232),.25),Pt(u0,yc,zc)],.03);
      part(mb=>{const c=Pt(1.08,yb(.26),.25);cpHex(mb,c,[0,1,0],.01,.007);hdCyl(mb,V3.add(c,[0,.01,0]),V3.add(c,[0,.035,0]),.007,.006,12,STEEL);hdTube(mb,[V3.add(c,[0,.035,0]),Pt(1.0,yb(.34),.3)],.003,6,HOSE,false,true);},35);
      /* the centre box (o.exhaust 'straight': a straight pipe), along the right of the tank, under the subframe */
      const ub0=1.75,ub1=2.15,zb=.27;
      TUBE([Pt(u1,yc,zc),Pt(1.5,ys,.25),Pt(ub0,ys,zb)],r);
      if(o.exhaust!=='straight')cpRev(U,Pt(ub0,ys,zb),Pt(ub1,ys,zb),[[0,0],[.024,0],[.05,.03],[.055,.05],[.055,.35],[.05,.37],[.024,.4],[0,.4]],EXH,28,35);
      else TUBE([Pt(ub0,ys,zb),Pt(ub1,ys,zb)],r+.004,EXH);
      TUBE([Pt(ub1,ys,zb),Pt(2.3,ys,.34),Pt(2.5,ys,.37),Pt(2.9,ys,.37),Pt(3.12,yb(.225),.33),Pt(3.27,yb(.24),.3)],r);
      /* the rear box across behind the axle, its tailpipe out to the game's tip */
      const mb0=3.26,mb1=3.45,mz0=.16,mz1=.56,my=yb(.255);
      part(mb=>{hdRBox(mb,Pt((mb0+mb1)/2,my,(mz0+mz1)/2),[(mb1-mb0)/2,.05,(mz1-mz0)/2],.035,EXH,5);for(const z of [mz0+.01,mz1-.01])hdRBox(mb,Pt((mb0+mb1)/2,my,z),[(mb1-mb0)/2+.002,.052,.003],.03,EXHB,3);},40);
      const F=D.B.fit,Yt=y=>y+dy+F.rdy,a=Pt(L-.13,Yt(.39),.6),bw=V3.add(a,[-.12,0,0]);
      TUBE([Pt(mb1-.02,my-.01,mz1-.04),Pt(mb1,Yt(.37),.57),[a[0]+.02,a[1],a[2]]],.022);
      cpRev(U,V3.add(a,[.03,0,0]),bw,[[.02,0],[.032,.012],[.037,.02],[.037,.146],[.034,.15],[.031,.146],[.031,.03]],MM.CHROME,32,40);
      cpRev(U,V3.add(bw,[.05,0,0]),V3.add(bw,[.004,0,0]),[[0,0],[.028,0],[.028,.046]],SMC('#151515',SM.CAST),20,40);D.tips.push({p:bw,d:[-1,0,0],r:.037});
      /* the hangers */
      for(const [u,z,y] of [[1.6,.25,ys],[2.4,.36,ys],[2.95,.37,ys],[3.3,.2,my+.05],[3.3,.52,my+.05]])part(mb=>{const c=Pt(u,y,z),t=V3.add(c,[0,.04,0]);hdCyl(mb,c,t,.005,.005,8,STEEL);
        hdCyl(mb,V3.add(t,[-.014,0,0]),V3.add(t,[.014,0,0]),.017,.017,14,RB);hdRBox(mb,V3.add(t,[0,.02,0]),[.02,.004,.02],.003,STEEL,1);},30);}}

  /* ================= the tank, the spare's well ================= */
  {const t0=2.44,t1=2.88,top=pan(2.6,.3)-.008,bot=yb(.2);
    part(mb=>{for(const [z0,z1] of [[-.42,-.075],[.075,.29]])hdRBox(mb,Pt((t0+t1)/2,(top+bot)/2,(z0+z1)/2),[(t1-t0)/2,(top-bot)/2,(z1-z0)/2],.03,TANK,4);
      hdRBox(mb,Pt((t0+t1)/2,top-.008,0),[(t1-t0)/2-.02,.008,.1],.006,TANK,2);
      for(let k=-3;k<=3;k++)for(const zz of [-.25,.18])hdRBox(mb,Pt((t0+t1)/2+k*.055,bot-.002,zz),[.006,.003,.08],.002,TANK,1);},35);
    part(mb=>{for(const u of [t0+.08,t1-.08])for(const s of [1,-1]){const z=s>0?.18:-.25;hdRBox(mb,Pt(u,bot-.006,z),[.016,.003,.2],.002,STEEL,1);}
      for(const u of [t0+.08,t1-.08])for(const zz of [-.44,.31])cpHex(mb,Pt(u,top-.01,zz),[0,-1,0],.008,.006);},30);
    /* its filler hose up into the right rear wheel house, the pump's flange and lines */
    part(mb=>{hdTube(mb,suvPath([Pt(t1-.05,top-.04,.27),Pt(t1+.06,yb(.4),.42),Pt(uRa-.25,yb(.62),.52)],4,2),.022,14,FUEL,false,true);},35);
    if(o.skids)part(mb=>{const SK=SMC('#b4b7bb',SM.BRUSH);hdRBox(mb,Pt((t0+t1)/2,bot-.012,-.07),[(t1-t0)/2+.02,.004,.38],.004,SK,2);for(const u of [t0,t1])for(const zz of [-.43,.29])cpHex(mb,Pt(u,bot-.016,zz),[0,-1,0],.008,.005);},30);}
  part(mb=>{hdRBox(mb,Pt(3.33,yb(.31),-.15),[.2,.06,.24],.06,COAT,5);hdCyl(mb,Pt(3.33,yb(.248),-.15),Pt(3.33,yb(.244),-.15),.05,.05,20,RB);},35);

  /* ================= the lines ================= */
  part(mb=>{for(const [dz,m,rr] of [[0,LINE,.003],[.012,LINE,.003],[.03,FUEL,.004],[.045,FUEL,.004]]){const p=[Pt(.95,yb(.36),-.3-dz)];for(let u=1.2;u<=2.4;u+=.2)p.push(Pt(u,pan(u,-.3-dz)-.008,-.3-dz));p.push(Pt(2.6,pan(2.6,-.46)-.01,-.46-dz*.5),Pt(2.9,rfy+.04,-.42-dz*.5));
      hdTube(mb,suvPath(p,3,1),rr,6,m,false,true);}
    for(let u=1.3;u<2.4;u+=.35)hdRBox(mb,Pt(u,pan(u,-.32)-.01,-.32),[.008,.006,.04],.003,CLIP,2);},35);
  part(mb=>{for(const s of [1,-1]){const p=[Pt(1.9,pan(1.9,.05)-.01,s*.06),Pt(2.3,pan(2.3,s*.2)-.01,s*.2),Pt(2.7,yb(.3),s*.4),Pt(uRa-.04,R+.05,s*(hubZ-.08))];hdTube(mb,suvPath(p,4,1),.0035,6,STEEL,false,true);}},30);

  /* ================= the guards (o.skids) ================= */
  if(o.skids){const SK=SMC('#b4b7bb',SM.BRUSH),y=yb(.165);
    part(mb=>{const rows=[];for(let u=.04;u<=1.05+1e-6;u+=.02){const row=[];for(let z=-.46;z<=.461;z+=.023)row.push(Pt(u,y+.04*sm01((.16-u)/.12)+.03*sm01((u-.9)/.15),z));rows.push(row);}hdLoft(mb,rows,SK,false,true);},30);
    part(mb=>{for(let k=0;k<6;k++)hdRBox(mb,Pt(.3+k*.12,y-.003,0),[.004,.003,.42],.002,SK,1);for(const [u,z] of [[.3,-.2],[.3,.2],[.62,0],[.85,-.25],[.85,.25]])hdCyl(mb,Pt(u,y-.001,z),Pt(u,y-.004,z),.028,.028,20,SMC('#111214',SM.PAINTED));
      for(const u of [.1,.5,.95])for(const z of [-.43,.43])cpHex(mb,Pt(u,y-.002,z),[0,-1,0],.009,.005);},25);}
  return U;
}
