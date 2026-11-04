/* =====================================================================================
   THE SUV'S UNDERSIDE (Studio 2), in place of the game's, which hangs a ladder of boxes, a box for a tank and stick
   suspension under every body. What the Stock has under it, an all-wheel-drive body on a frame with independent
   suspension at both ends (32_builds 'stock', susp 'ifs'; the game's physics gives it a centre differential), nose to
   tail:
   - The frame: two boxed rails, close together between the front wheels, out under the cabin, kicked up over the
     rear axle and level again to the hitch; the front bumper's beam on their horns with the tow eye's socket, the
     radiator support's crossmember, the front crossmember carrying the rack and the differential, the K-member
     behind the axle, the gearbox's crossmember, a tube ahead of the tank, the rear crossmember with the hitch's
     receiver; outriggers out to the sills, and the rubber body mounts the body sits on.
   - The floor: the body's own, pressed, with the toe board rising to the firewall, the tunnel, the pocket over the
     tank, the heel kick and the cargo floor; beads, the sills' pinch welds and jacking pads, drain plugs, the seats'
     bolts coming through, heat shields over the catalysts and the muffler.
   - The front: double wishbones (pressed lower arms on bushes on the frame, forged upper arms on the wheelhouse
     wall, cast knuckles with the hub), coilovers up into the towers, the rack in its boots and the tie rods, the
     anti-roll bar under the rack; the front differential bolted beside the engine's sump, its short left shaft and
     the long right one through a support bearing, the half-shafts in their boots; the splash shield under the nose.
   - The drivetrain: the six-speed automatic (the bell housing, the ribbed case, the pan and its bolts, the cooler's
     lines), the single-speed transfer case behind it with the front output on the left, the front driveshaft forward
     to the front differential, the rear one in a tube with a U-joint each end and the slip yoke.
   - The exhaust: from the engine's cast manifolds two downpipes to two catalysts under their shields, each with its
     oxygen sensors, joined in a Y, one pipe to the muffler, on beside the tank through the resonator, up over the
     rear axle, down under the right rail and out to the tip where the game has it.
   - The rear: the subframe on four bushes, the differential on it, lower and upper arms, the toe links, coilovers
     behind the axle, the anti-roll bar; the half-shafts in their boots; the handbrake's cables.
   - The tank between the rails ahead of the rear axle, in its straps, the filler hose to the flap; the spare wheel
     hung flat under the cargo floor on its winch's cable.
   - The lines: two brake lines and the fuel feed and return clipped along the right rail, the vapour line.
   o: the build's choices (the Stock's are the defaults): exhaust 'single' or 'dual' (from the bay's turbos: an X, two
   mufflers, two tips), tank 'cell' (a fuel cell under the cargo floor where the spare hangs), spare and hitch (false:
   left off), trans 'race4' (a race automatic, its deep finned pan), nos (the bottle's feed line forward to the bay).
   A lowered or lifted build's frame, and so everything on it, moves with its body (dy); what's on the wheel stays
   with the wheel, out at its track.
   ===================================================================================== */
function suvUnder2(car,o={}){
  const K=HDK,D=K.D,X=K.X,lk=D.look,L=D.L,LY=suvLay(car,o),dy=LY.dy,yb=LY.yb,U=new MB();
  const Pt=(u,y,z)=>[X(u),y,z],part=(f,deg=35,oo=null,M=null)=>hdPart(U,f,deg,oo,M);
  const COAT=SMC('#8a8d91',SM.BEDLINER),COATD=SMC('#74777b',SM.BEDLINER),SEAM=SMC('#6a6d71',SM.ENGINE),FRAME=SMC('#222326',SM.PAINTED),
    ARM=SMC('#34363a',SM.PAINTED),CASTI=SMC('#3e3a35',SM.CAST),ALU=SMC('#a3a6ab',SM.CAST),FORGE=SMC('#5c5f63',SM.ENGINE),STEEL=SMC('#2a2b2e',SM.ENGINE),
    EXH=SMC('#8b867c',SM.SATIN),EXHB=SMC('#6e5c4a',SM.CAST),SHIELD=SMC('#c6c6c1',SM.BRUSH),TANK=SMC('#1b1c1e',SM.PLASTIC),
    RB=SV([.02,.02,.021],MAT.RUBBER),LINE=SMC('#c0c2c5',SM.BOLT),FUEL=SMC('#121213',SM.HOSE),HOSE=SMC('#141415',SM.HOSE),CLIP=SMC('#121214',SM.PLASTIC),
    SPR=SMC('#56606b',SM.PAINTED),DAMP=SMC('#2a2b2e',SM.PAINTED),BOLT=HC.BOLT,BLK=SMC('#141516',SM.PAINTED),CV=SMC('#7d8086',SM.ENGINE);
  const sk0=u=>secKeys(D,clamp(u,0,L)).P[0];
  /* (the frame's drop against the wheel's centre: none on the Stock; the wheel's side out at its track) */
  const dF=dy-(LY.R-.378),tsF=LY.tw-.8,tsR=LY.twR-.8,EXT=o.exhaust||'single',SOLID=o.susp==='solid',wR0=()=>LY.R;
  /* ================= the skin's underside ================= */
  /* the game's floor out of the body into the underside; the floor under the hood (the game's hide, drawn while the hood
     is shut) too, its nose kept, the rest given way to the bay (drawn all the time) and the shield under it */
  {const sk=hdUnder(car),h=car.hide,keepH={p:[],n:[],c:[],m:[]};
    for(let t=0;t<h.p.length/9;t++){const o9=t*9,u=D.uC-(h.p[o9]+h.p[o9+3]+h.p[o9+6])/3,dst=u<.46?sk:null;if(!dst)continue;
      for(let k=0;k<9;k++){dst.p.push(h.p[o9+k]);dst.n.push(h.n[o9+k]);}for(let k=0;k<12;k++)dst.c.push(h.c[t*12+k]);for(let k=0;k<3;k++)dst.m.push(h.m[t*3+k]);}
    Object.assign(h,keepH);
    /* (between the nose and the tail, the floor between the sills gives way to the pan built here) */
    hdDrop(sk,c=>{const u=D.uC-c[0];return u>.46&&Math.abs(c[2])<sk0(u)[0]-.01;});
    for(let t=0;t<sk.m.length/3;t++)for(let k=0;k<3;k++){const i=t*12+k*4;sk.c[i]=COAT[0][0];sk.c[i+1]=COAT[0][1];sk.c[i+2]=COAT[0][2];sk.m[t*3+k]=COAT[2];}
    hdPut(U,sk);}

  /* ================= the floor ================= */
  const pan=(u,z)=>suvPanY(u,z,dy),u0=1.39,uE=L-.004,zi=o.ziR||.58;
  /* (the edge: the sill's floor, except between the rear wheel houses, where the pan meets their inner walls) */
  const inArch=u=>sm01((u-3.3)/.08)*sm01((4.31-u)/.05),zE=u=>lerp(sk0(u)[0],zi,inArch(u));
  {const ts=[];for(let k=-30;k<=30;k++){const s=k/30;ts.push(Math.sign(s)*Math.pow(Math.abs(s),1.35));}
    const Us=[];for(let u=u0;u<uE;u+=u<1.85?.018:u>3.35&&u<3.62?.016:u>L-.1?.012:.03)Us.push(u);Us.push(uE);
    part(mb=>{const rows=Us.map(u=>{const ze=zE(u),ein=1-inArch(u),ye=lerp(pan(u,ze),sk0(u)[1],ein),tail=sm01((u-(L-.07))/.066);
        const yAt=z=>lerp(pan(u,z),D.sill(L)+.004,tail);
        return [Pt(u,lerp(ye,yAt(ze),tail),-ze),...ts.map(t=>{const z=t*(ze-.026);return Pt(u,yAt(z),z);}),Pt(u,lerp(ye,yAt(ze),tail),ze)];});
      hdLoft(mb,rows,COAT,false,true);},38);}
  /* the beads pressed across the floor either side of the tunnel, and across the cargo floor */
  for(const s of [1,-1])part(mb=>{for(const u of [1.96,2.12,2.5,2.66,3.08,3.22])hdRBox(mb,Pt(u,pan(u,s*.5)-.003,s*.5),[.013,.0045,.17],.004,COAT,2);
    for(const u of [4.45,4.62])hdRBox(mb,Pt(u,pan(u,s*.48)-.003,s*.48),[.013,.0045,.12],.004,COAT,2);},30);
  /* the sills: the pinch weld along the bottom, two jacking pads on it each side */
  for(const s of [1,-1]){part(mb=>{const pts=[];for(let u=1.42;u<=3.34;u+=.05){const P1=secKeys(D,u).P[1];pts.push(Pt(u,P1[1]+.004,s*(P1[0]-.014)));}
      hdSweep(mb,pts,[[-.002,-.017],[.002,-.017],[.002,.006],[-.002,.006]],SEAM,[0,1,0],true,true);},30);
    for(const u of [1.58,3.18]){const P1=secKeys(D,u).P[1],c=Pt(u,P1[1]-.013,s*(P1[0]-.014));
      part(mb=>{hdRBox(mb,V3.add(c,[0,.006,0]),[.05,.005,.012],.004,STEEL,2);for(let q=-2;q<=2;q++)hdRBox(mb,V3.add(c,[q*.018,-.001,0]),[.004,.003,.013],.0015,STEEL,1);},30);}}
  /* drain plugs, and the front seats' rail bolts coming through */
  part(mb=>{for(const [u,z] of [[2.02,.66],[2.4,.32],[2.86,.62],[3.3,.36],[4.5,.66],[4.75,.3]])for(const s of [1,-1]){const c=Pt(u,pan(u,s*z)-.001,s*z);
    hdCyl(mb,c,V3.add(c,[0,-.005,0]),.02,.018,20,RB);hdCyl(mb,V3.add(c,[0,-.005,0]),V3.add(c,[0,-.0065,0]),.011,.009,16,RB);}},30);
  part(mb=>{for(const u of [2.6,3.04])for(const s of [1,-1])for(const z of [.17,.6]){const c=Pt(u,pan(u,s*z)-.001,s*z);cpHex(mb,c,[0,-1,0],.0085,.007);}},25);
  /* the heat shields: over each catalyst, along the tunnel over the Y and the muffler, a dimpled pattern pressed in */
  {const sh=(ua,ub,za,zb,dz=.012)=>part(mb=>{const rows=[];for(let u=ua;u<=ub+1e-6;u+=.03){const row=[];for(let k=0;k<=10;k++){const z=za+(zb-za)*k/10;row.push(Pt(u,pan(u,z)-dz-.0015*Math.sin(u*140+k*1.7),z));}rows.push(row);}
      hdLoft(mb,rows,SHIELD,false,true);for(const z of [za,zb]){const e=[];for(let u=ua;u<=ub+1e-6;u+=.03)e.push(Pt(u,pan(u,z)-dz-.001,z));hdTube(mb,e,.0025,6,SHIELD,false,true);}},28);
    if((o.exhaust||'single')==='single'){sh(1.86,2.2,-.46,-.26);sh(1.86,2.2,.16,.4);sh(2.3,2.94,.16,.46,.014);sh(2.96,3.36,.26,.48,.012);}
    else for(const s of [1,-1])sh(2.34,2.9,s>0?.18:-.42,s>0?.42:-.18,.014);}

  /* ================= the frame ================= */
  const RZ=u=>suvRailZ(u),RY=u=>suvRailY(u)+dy,RH=u=>suvRailH(u),RW=.036;
  for(const s of [1,-1]){
    /* the rail: a boxed section swept from the bumper's horn to the hitch, deeper under the cabin */
    const us=[];for(let u=.16;u<=4.88+1e-6;u+=.03)us.push(u);
    part(mb=>{suvSweepVar(mb,us.map(u=>Pt(u,RY(u),s*RZ(u))),i=>hdRRect(RW,RH(us[i]),.008,3),FRAME,[0,1,0],true);},40);
    /* the seam along its top and bottom where the two halves are welded, and the tooling holes in its sides */
    part(mb=>{for(const e of [1,-1]){const p=us.map(u=>Pt(u,RY(u)+e*(RH(u)-.002),s*(RZ(u)+RW+.0015)));hdTube(mb,p,.002,5,FRAME,false,true);}},30);
    part(mb=>{for(const u of [.62,1.25,1.95,2.45,3.0,3.42,4.22,4.6]){const c=Pt(u,RY(u),s*(RZ(u)+RW+.0005)),M=M4.basis(c,[1,0,0],[0,1,0],[0,0,s]);
      const hole=hdRRect(.026,.014,.012,5).map(([a,b])=>M4.xform(M,[a,b,0])),rim=hdRRect(.03,.018,.016,5).map(([a,b])=>M4.xform(M,[a,b,0]));
      hdLoft(mb,[rim,hole],FRAME,true,s<0);hdCap(mb,hole.map(p=>V3.add(p,[0,0,-s*.03])),SMC('#060607',SM.PAINTED),s>0);}},20);
    /* the horn's end plate, where the bumper's beam bolts on */
    part(mb=>{const c=Pt(.15,RY(.16),s*RZ(.16));hdRBox(mb,c,[.006,.06,.055],.004,FRAME,2);for(const [a,b] of [[-.035,-.03],[-.035,.03],[.035,-.03],[.035,.03]])cpHex(mb,V3.add(c,[.006,a,b]),[1,0,0],.008,.006);},30);}
  /* the bumper's beam across the horns, out to the bumper's corners; the tow eye's threaded socket on the right */
  {const y=yb(.47);part(mb=>{const pts=[];for(let z=-.7;z<=.701;z+=.05)pts.push(Pt(.135-.03*Math.pow(Math.abs(z)/.7,2),y,z));hdSweep(mb,pts,hdRRect(.028,.05,.008,3),FRAME,[0,1,0],true,true);},40);
    part(mb=>{const c=Pt(.105,y,.55);hdCyl(mb,c,V3.add(c,[.03,0,0]),.022,.022,20,STEEL);hdCyl(mb,V3.add(c,[.03,0,0]),V3.add(c,[.035,0,0]),.013,.013,16,SMC('#0a0a0b',SM.ENGINE));},30);}
  /* the crossmembers: under the radiator, in front of the axle (the rack and the differential), the K-member behind
     it, the gearbox's, a tube ahead of the tank, one behind it, the rear (the hitch's) */
  const xm=(u,y,hw,hh,m=FRAME)=>part(mb=>{const z=RZ(u)-.01,pts=[];for(let k=0;k<=12;k++){const zz=-z+2*z*k/12;pts.push(Pt(u,y,zz));}hdSweep(mb,pts,hdRRect(hw,hh,.007,3),m,[0,1,0],true,true);},40);
  xm(.3,yb(.45),.03,.032);xm(.74,yb(.345),.028,.026);xm(2.88,yb(.37),.028,.028);xm(3.5,yb(.40),.03,.03);
  if(!SOLID){/* (the K-member: a deep box behind the axle, swept down between the rails under the sump, the lower arms' rear
     brackets on it) */
  part(mb=>{const pts=[];for(let k=0;k<=16;k++){const z=-.4+.8*k/16,dip=.03*Math.cos(z/.4*PI/2);pts.push(Pt(1.16,yb(.335-dip),z));}hdSweep(mb,pts,hdRRect(.045,.03,.008,3),FRAME,[0,1,0],true,true);},40);}
  /* (the gearbox's: from rail to rail, dipping under the gearbox, its mount on top) */
  {const u=2.25;part(mb=>{const pts=[];for(let k=0;k<=18;k++){const z=-RZ(u)+2*RZ(u)*k/18,dip=.012*Math.exp(-Math.pow(z/.2,2));pts.push(Pt(u,yb(.423-dip),z));}hdSweep(mb,pts,hdRRect(.032,.022,.006,3),FRAME,[0,1,0],true,true);},40);
    for(const s of [1,-1])part(mb=>{const c=Pt(u,yb(.423),s*(RZ(u)-.04));hdRBox(mb,c,[.045,.03,.012],.004,FRAME,2);for(const dz of [-.02,.02])cpHex(mb,V3.add(c,[dz,-.03,0]),[0,-1,0],.008,.006);},30);}
  /* the rear crossmember with the hitch: the bar between the rails' ends, the receiver under it with its pin, the
     safety chains' loops and its cap */
  {const u=4.875,y=yb(.455),yr=y-.07,hitch=o.hitch!==false;part(mb=>{const pts=[];for(let k=0;k<=14;k++)pts.push(Pt(u,y,-.5+1.0*k/14));hdSweep(mb,pts,hdRRect(.032,.032,.006,3),FRAME,[0,1,0],true,true);},40);
    /* (the receiver hangs from the bar's middle on a plate, low enough to clear the bumper's foot) */
    if(hitch)part(mb=>{const a=Pt(4.85,yr,0),b=Pt(4.935,yr,0);hdRBox(mb,V3.lerp(a,b,.5),[(4.935-4.85)/2,.026,.026],.004,FRAME,2);hdRBox(mb,Pt(4.87,(yr+y)/2,0),[.02,(y-yr)/2,.03],.004,FRAME,2);
      hdRBox(mb,Pt(4.93,yr,0),[.006,.03,.03],.004,FRAME,2);for(const s of [1,-1]){hdCyl(mb,Pt(4.9,yr,s*.026),Pt(4.9,yr,s*.036),.008,.008,12,BOLT);}
      hdCyl(mb,Pt(4.9,yr,-.05),Pt(4.9,yr,.05),.0045,.0045,10,BOLT);hdTube(mb,[Pt(4.9,yr,.052),Pt(4.9,yr-.018,.058),Pt(4.9,yr-.02,.04)],.002,6,BOLT,false,true);
      for(const s of [1,-1])hdTube(mb,(()=>{const q=[];for(let k=0;k<=10;k++){const a2=k/10*PI;q.push(Pt(4.89-Math.sin(a2)*.02,yr-.03,s*(.06+Math.cos(a2)*.02)));}return q;})(),.005,8,FRAME,false,true);
      hdRBox(mb,V3.add(Pt(4.9,yr,0),[-.03,0,0]),[.004,.022,.022],.004,SMC('#101011',SM.PLASTIC),2);},30);
    for(const s of [1,-1])part(mb=>{const c=Pt(u,y,s*(.5-RW-.008));hdRBox(mb,c,[.04,.05,.008],.004,FRAME,2);for(const dy2 of [-.03,.03])cpHex(mb,V3.add(c,[0,dy2,s*.008]),[0,0,s],.008,.006);},30);}
  /* outriggers out to the sills and the body mounts on them; the mounts on the rails' tops at the front and back */
  for(const s of [1,-1]){
    for(const [u,z1] of [[1.48,.76],[2.15,.72],[2.92,.72],[3.3,.7]]){const z0=RZ(u)+RW,y=RY(u)+.02,top=u<1.6?yb(.385):pan(u,s*z1);
      part(mb=>{hdSweep(mb,[Pt(u,y,s*z0),Pt(u,y+.005,s*(z0+z1)/2),Pt(u,y+.01,s*(z1+.02))],[[-.025,-.03],[.025,-.03],[.025,.012],[-.025,.012]],FRAME,[0,1,0],true,true);},30);
      suvBodyMount(U,Pt(u,y+.022,s*z1),Math.max(.004,top-(y+.022)));}
    for(const u of [.52,4.3,4.72]){const y=RY(u)+RH(u),top=u<1?yb(.5):pan(u,s*RZ(u));suvBodyMount(U,Pt(u,y,s*RZ(u)),Math.max(.004,top-y));}}

  const wR=LY.R,FD=SOLID?Pt(D.uFa+.22,LY.R+.012,.16):Pt(.93,wR0()+.022+dF,-.2),fdz=SOLID?.16:-.2;
  if(!SOLID){
  /* ================= the front suspension ================= */
  /* (the lower arm's pivots on brackets under the rail, its ball joint in the knuckle; the upper arm on the wheelhouse
     wall; the coilover between, through the upper arm's opening into the tower) */
  const FS={F:[.78,yb(.30),.40],R:[1.10,yb(.30),.40],B:[.93,wR-.163,.715],UF:[.76,wR+.322+dF,.49],UR:[1.10,wR+.322+dF,.49],UB:[.935,wR+.267,.625],SA:[.80,wR-.048,.695],C0:[.935,.262+dy*.444+(wR-.378)*.556,.575],C1:[.935,wR+.467+dF,.565]};
  for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*(z>.55?z+tsF:z));
    /* the lower arm: two pressed legs, a brace across them with the coilover's clevis, the ball joint */
    const B=Q(FS.B);
    for(const P of [FS.F,FS.R])cpBar(U,[Q(P),V3.lerp(Q(P),B,.5),B],.02,.012,.006,ARM,[0,1,0],40);
    cpBar(U,[V3.lerp(Q(FS.F),B,.556),V3.lerp(Q(FS.R),B,.556)],.016,.01,.005,ARM,[0,1,0],40);
    for(const P of [FS.F,FS.R]){cpBush(U,Q(P),[1,0,0],.032,.065);part(mb=>{for(const dz of [-.042,.042])hdRBox(mb,Q([P[0]+dz,P[1]+.04,P[2]]),[.004,.05,.03],.004,FRAME,2);},30);}
    part(mb=>{hdCyl(mb,V3.add(B,[0,-.024,0]),V3.add(B,[0,.012,0]),.028,.026,20,FORGE);hdCyl(mb,V3.add(B,[0,-.028,0]),V3.add(B,[0,-.024,0]),.012,.012,12,BOLT);},35);
    cpRev(U,V3.add(B,[0,.012,0]),V3.add(B,[0,.05,0]),[[.024,0],[.026,.008],[.02,.025],[.012,.038]],RB,16,50);
    part(mb=>{const c=Q([.935,.262,.575]);hdRBox(mb,V3.add(c,[0,-.008,0]),[.03,.012,.03],.006,ARM,2);for(const du of [-.02,.02])hdRBox(mb,V3.add(c,[du,.012,0]),[.004,.022,.022],.004,ARM,2);},30);
    /* the knuckle: cast, from the lower ball joint up through the hub's boss and in over the tyre to the upper ball
       joint; the steering arm forward; the hub and its bearing */
    const UB=Q(FS.UB),HB=Q([.93,wR,.722]);
    cpBar(U,[V3.add(B,[0,.04,0]),Q([.93,wR-.09,.72]),HB,Q([.93,wR+.12,.705]),Q([.935,wR+.21,.66]),V3.add(UB,[0,-.03,0])],.026,.017,.008,CASTI,[0,0,1],40);
    cpRev(U,Q([.93,wR,.69]),Q([.93,wR,.756]),[[0,0],[.056,0],[.064,.012],[.064,.058],[.056,.066],[0,.066]],CASTI,28,35);
    part(mb=>{for(let q=0;q<4;q++){const a=q/4*TAU+PI/4;cpHex(mb,Q([.93+Math.cos(a)*.05,wR+Math.sin(a)*.05,.688]),[0,0,-s],.008,.006);}},25);
    cpBar(U,[Q([.92,wR-.04,.715]),Q([.86,wR-.045,.705]),Q(FS.SA)],.014,.011,.005,CASTI,[0,1,0],40);
    /* the upper arm: forged, its bushes on brackets on the wheelhouse wall, the ball joint */
    for(const P of [FS.UF,FS.UR]){cpBar(U,[Q(P),V3.lerp(Q(P),UB,.5),UB],.012,.01,.005,FORGE,[0,1,0],40);cpBush(U,Q(P),[1,0,0],.024,.05);
      part(mb=>{hdRBox(mb,Q([P[0],P[1],.475]),[.04,.035,.006],.004,FRAME,2);for(const dy2 of [-.02,.02])cpHex(mb,Q([P[0]+.025,P[1]+dy2,.469]),[0,0,-s],.007,.005);},30);}
    part(mb=>{hdCyl(mb,V3.add(UB,[0,-.012,0]),V3.add(UB,[0,.02,0]),.021,.019,16,FORGE);cpHex(mb,V3.add(UB,[0,.02,0]),[0,1,0],.012,.01);},35);
    /* the coilover, from the brace up into the tower: black spring, grey damper */
    cpCoilover(U,Q(FS.C0),Q(FS.C1),{bodyL:.25,s0:.14,s1:.53,rs:.05,turns:6,wire:.0095,spring:SPR,body:DAMP,seat:STEEL});
    /* the brake's hose: from the wheelhouse wall down in a loop to the caliper, and the hard line to it */
    part(mb=>{const p=[Q([1.05,wR+.24,.49]),Q([1.07,wR+.18,.56]),Q([1.04,wR+.1,.64]),Q([1.0,wR+.06,.69])];hdTube(mb,p,.0065,8,HOSE,false,true);hdRBox(mb,p[0],[.012,.012,.006],.003,STEEL,1);
      hdTube(mb,[Q([1.35,wR+.27,.49]),Q([1.15,wR+.26,.49]),p[0]],.0025,6,LINE,false,true);},40);
    /* the wheel speed sensor's lead along the upper arm */
    part(mb=>{hdTube(mb,[Q([.96,wR+.02,.705]),Q([.98,wR+.12,.69]),Q([1.0,wR+.3,.6]),Q([1.04,wR+.34,.5])],.003,6,HOSE,false,true);},40);}
  /* the steering rack: its housing on the front crossmember, the pinion's valve body on the left with the column's
     shaft up to the firewall, the boots, the tie rods out to the steering arms */
  {const y=wR+.022+dF,u=.80;
    part(mb=>{hdCyl(mb,Pt(u,y,-.32),Pt(u,y,.32),.023,.023,20,ALU,true);hdRBox(mb,Pt(u+.005,y+.012,-.22),[.036,.042,.045],.012,ALU,3);
      for(const z of [-.14,.14])hdRBox(mb,Pt(u-.022,y-.012,z),[.022,.024,.032],.006,ALU,2);for(const z of [-.14,.14])cpHex(mb,Pt(u-.022,y-.036,z),[0,-1,0],.008,.006);
      for(const z of [-.24,-.2])hdTube(mb,[Pt(u+.03,y+.03,z),Pt(u+.08,y+.07,z-.02),Pt(1.05,yb(.62),-.36)],.005,8,LINE,false,true);},35);
    part(mb=>{const a=Pt(u+.005,y+.05,-.22);hdCyl(mb,a,Pt(u+.06,y+.14,-.24),.017,.017,14,ALU);suvUJoint(U,Pt(u+.07,y+.16,-.245),V3.norm([.4,1,-.05]),.022,STEEL);
      hdCyl(mb,Pt(u+.08,y+.18,-.248),Pt(1.38,yb(.82),-.34),.012,.012,12,STEEL);},35);
    for(const s of [1,-1]){cpBoot(U,Pt(u,y,s*.32),Pt(u,y,s*.42),.025,.031,6);
      part(mb=>{const a=Pt(u,y,s*.42),b=Pt(FS.SA[0],FS.SA[1],s*(FS.SA[2]+tsF));hdCyl(mb,a,V3.lerp(a,b,.84),.0098,.0098,12,STEEL);hdCyl(mb,V3.lerp(a,b,.8),b,.014,.014,12,STEEL);ball(mb,b,.017,12,STEEL);
        hdCyl(mb,V3.lerp(a,b,.7),V3.lerp(a,b,.76),.013,.013,6,BOLT);cpHex(mb,V3.add(b,[0,-.02,0]),[0,-1,0],.01,.008);},35);}}
  /* the anti-roll bar, under the rack: in two clamps on brackets under the rails, its ends back to drop links on the
     lower arms */
  {const y=yb(.322),u=.66;
    part(mb=>{const p=[Pt(.84,y-.02,-.6),Pt(.76,y-.008,-.56),Pt(u,y,-.42),Pt(u,y,-.2),Pt(u,y,.2),Pt(u,y,.42),Pt(.76,y-.008,.56),Pt(.84,y-.02,.6)];hdTube(mb,suvPath(p,4),.014,12,BLK,false,true);},38);
    for(const s of [1,-1]){part(mb=>{hdRBox(mb,Pt(u,y,s*.33),[.022,.022,.02],.008,RB,2);hdRBox(mb,Pt(u,y+.006,s*.33),[.026,.02,.012],.005,STEEL,2);
        hdRBox(mb,Pt(u,y+.04,s*.33),[.02,.03,.006],.004,FRAME,2);for(const du of [-.032,.032])hdCyl(mb,Pt(u+du,y+.02,s*.33),Pt(u+du,y-.006,s*.33),.006,.006,6,BOLT);},30);
      part(mb=>{const a=Pt(.84,y-.02,s*.6),b=Pt(.868,yb(.246),s*.6);hdCyl(mb,a,b,.0065,.0065,8,STEEL);ball(mb,a,.012,10,BOLT);ball(mb,b,.012,10,BOLT);},35);}}
  /* the front differential: cast, bolted to the engine's left beside the sump, its cover facing forward, the pinion
     back toward the transfer case; the left output straight out, the right through a long shaft under the sump to its
     support bearing on the block */

  {part(mb=>{const rings=[];for(let k=0;k<=14;k++){const t=k/14,u=.81+.25*t,e=Math.sin(Math.max(.08,Math.min(1,t*1.05))*PI)**.55,w=.11*e,h=.1*e;
      rings.push(hdRRect(Math.max(.02,w),Math.max(.02,h),Math.max(.01,Math.min(w,h)*.6),5).map(([z,y])=>Pt(u,FD[1]+y,fdz+z)));}hdLoft(mb,rings,ALU,true);hdCap(mb,rings[0],ALU,true);hdCap(mb,rings[14],ALU,false);},35);
    part(mb=>{for(let k=0;k<10;k++){const a=k/10*TAU;cpHex(mb,Pt(.815,FD[1]+Math.sin(a)*.085,fdz+Math.cos(a)*.095),[1,0,0],.007,.006);}
      for(let k=-2;k<=2;k++)hdRBox(mb,Pt(.86,FD[1]-.09,fdz+k*.03),[.04,.004,.004],.002,ALU,1);cpHex(mb,Pt(.85,FD[1]+.1,fdz),[0,1,0],.012,.007);cpHex(mb,Pt(.95,FD[1]-.1,fdz),[0,-1,0],.012,.007);},30);
    cpRev(U,Pt(1.06,FD[1]+.01,fdz),Pt(1.1,FD[1]+.012,fdz-.005),[[0,0],[.045,0],[.048,.012],[.048,.032],[.042,.04],[0,.04]],ALU,28,35);
    /* its mounts: an ear to the front crossmember, two to the engine's block */
    part(mb=>{hdRBox(mb,Pt(.79,yb(.37),fdz),[.03,.025,.03],.006,ALU,2);hdRBox(mb,Pt(.95,FD[1]+.11,fdz+.07),[.04,.03,.02],.006,ALU,2);hdRBox(mb,Pt(1.0,FD[1]+.1,fdz-.08),[.03,.03,.02],.006,ALU,2);},30);
    for(const s of [1,-1])cpRev(U,Pt(.93,FD[1],fdz+s*.105),Pt(.93,FD[1],fdz+s*.15),[[0,0],[.06,0],[.06,.025],[.05,.03],[.05,.045],[0,.045]],ALU,28,35);}
  /* the half-shafts: the inner joints, their boots, the bars, the outer boots into the knuckles; the right one's long
     shaft and its bearing first */
  {const y=FD[1],half=(a,b)=>{cpRev(U,a,V3.lerp(a,b,.12),[[0,0],[.048,0],[.05,.012],[.05,.05],[.04,.06],[0,.06]],CV,24,35);
      cpBoot(U,V3.lerp(a,b,.12),V3.lerp(a,b,.3),.042,.018,6);cpRev(U,V3.lerp(a,b,.3),V3.lerp(a,b,.78),[[.017,0],[.017,V3.len(V3.sub(b,a))*.48]],STEEL,14,40);
      cpBoot(U,V3.lerp(a,b,.78),V3.lerp(a,b,.94),.018,.046,6);cpRev(U,V3.lerp(a,b,.94),b,[[0,0],[.05,0],[.052,.02],[0,.03]],CV,24,35);};
    half(Pt(.93,y,fdz-.15),Pt(.93,wR,-(.69+tsF)));
    cpRev(U,Pt(.93,y,fdz+.15),Pt(.93,y,.27),[[.019,0],[.019,.27-(fdz+.15)]],STEEL,16,40);
    part(mb=>{const c=Pt(.93,y,.28);cpRev(mb,V3.add(c,[0,0,-.02]),V3.add(c,[0,0,.02]),[[.02,0],[.045,0],[.047,.006],[.047,.034],[.045,.04],[.02,.04]],ALU,24,30);
      hdRBox(mb,V3.add(c,[0,.07,0]),[.03,.05,.012],.006,ALU,2);for(const du of [-.02,.02])cpHex(mb,V3.add(c,[du,.11,.012]),[0,0,1],.007,.005);},30);
    half(Pt(.93,y,.31),Pt(.93,wR,.69+tsF));}
  }
  /* the splash shield under the nose and the front of the engine, ribbed, screwed to the crossmember and the bumper */
  if(!o.skids){const ys=yb(.29);part(mb=>{const rows=[];for(let u=.3;u<=.82+1e-6;u+=.02){const row=[];for(let z=-.38;z<=.381;z+=.02)row.push(Pt(u,ys+.012*sm01((.4-u)/.1),z));rows.push(row);}hdLoft(mb,rows,SMC('#1a1b1d',SM.PLASTIC),false,true);},30);
    part(mb=>{for(const z of [-.24,-.08,.08,.24])hdRBox(mb,Pt(.58,ys-.004,z),[.2,.004,.006],.003,SMC('#1a1b1d',SM.PLASTIC),1);
      for(const [u,z] of [[.32,-.3],[.32,.3],[.32,0],[.8,-.3],[.8,.3],[.56,-.37],[.56,.37]])hdCyl(mb,Pt(u,ys-.001,z),Pt(u,ys-.005,z),.008,.007,12,STEEL);
      for(let z=-.12;z<=.121;z+=.04)hdRBox(mb,Pt(.48,ys-.002,z),[.05,.002,.012],.002,SMC('#0b0b0c',SM.PLASTIC),1);},30);}

  /* ================= the drivetrain ================= */
  const cy=LY.crankY,axY=u=>cy-(u-LY.uBell)*.016;
  /* the bell housing and the six-speed's case: cast, ribbed, narrowing to its tail; the pan and its bolts under it, the
     shift cable's bracket, the cooler's two lines forward to the radiator */
  {const ST=[[1.29,.205],[1.34,.2],[1.44,.19],[1.52,.165],[1.56,.158],[1.8,.142],[2.02,.125],[2.18,.112],[2.3,.104]];
    part(mb=>{const R=ST.map(([u,r])=>hdRRect(r*.9,r,r*.75,6).map(([z,y])=>Pt(u,axY(u)+y,z)));hdLoft(mb,R,ALU,true);hdCap(mb,R[R.length-1],ALU,false);},30);
    part(mb=>{for(const u of [1.36,1.48,1.62,1.76,1.92,2.08]){const r=suvKeys(ST.map(([a,b])=>[a,b]),1)(u)+.004;const a=hdRRect(r*.9,r,r*.75,6).map(([z,y])=>Pt(u-.006,axY(u)+y,z)),b=a.map(p=>V3.add(p,[-.012,0,0]));hdLoft(mb,[a,b],ALU,true);}
      for(let k=0;k<12;k++){const a=k/12*TAU;cpHex(mb,Pt(1.3,axY(1.3)+Math.sin(a)*.2,Math.cos(a)*.185),[-1,0,0],.008,.006);}},30);
    /* (a race automatic: a deep cast pan, finned across its bottom, its drain and the trans-brake's lead) */
    if(o.trans==='race4')part(mb=>{const y0=axY(1.86)-.15;hdRBox(mb,Pt(1.86,y0,0),[.24,.04,.125],.012,CASTA2(),3);for(let k=-6;k<=6;k++)hdRBox(mb,Pt(1.86+k*.034,y0-.042,0),[.005,.012,.11],.003,CASTA2(),1);
      for(let k=0;k<16;k++){const t=k/16*TAU;cpHex(mb,Pt(1.86+Math.cos(t)*.23,y0+.03,Math.sin(t)*.118),[0,-1,0],.0065,.005);}cpHex(mb,Pt(1.98,y0-.055,.05),[0,-1,0],.011,.006);
      hdRBox(mb,Pt(1.7,axY(1.7)-.02,.15),[.02,.015,.012],.004,SMC('#b0201c',SM.PLASTIC),1);hdTube(mb,[Pt(1.7,axY(1.7)-.02,.165),Pt(1.6,axY(1.6)+.05,.2),Pt(1.45,yb(.7),.25)],.003,6,HOSE,false,true);},30);
    else part(mb=>{const y0=axY(1.86)-.128;hdRBox(mb,Pt(1.86,y0,0),[.24,.018,.122],.012,ALU,3);for(let k=-6;k<=6;k++)hdRBox(mb,Pt(1.86+k*.034,y0-.019,0),[.004,.003,.1],.002,ALU,1);
      for(let k=0;k<16;k++){const t=k/16*TAU,cu=Math.cos(t),cz=Math.sin(t);cpHex(mb,Pt(1.86+cu*.23,y0-.01,cz*.115),[0,-1,0],.0065,.005);}cpHex(mb,Pt(1.98,y0-.019,.05),[0,-1,0],.011,.006);},30);
    part(mb=>{for(const z of [.09,.11])hdTube(mb,[Pt(1.7,axY(1.7)-.06,.13+z*.1),Pt(1.5,yb(.44),.2+z*.1),Pt(1.2,yb(.4),.33+z*.1),Pt(.7,yb(.45),.4+z*.1),Pt(.34,yb(.62),.45)],.0045,8,LINE,false,true);
      hdRBox(mb,Pt(1.9,axY(1.9)+.02,-.14),[.03,.02,.012],.004,STEEL,2);hdTube(mb,[Pt(1.9,axY(1.9)+.04,-.15),Pt(2.0,axY(2.0)+.12,-.18),Pt(2.3,yb(.66),-.16)],.004,6,HOSE,false,true);},35);
    /* the tail's mount on the crossmember, the transfer case behind (a chain case, its front output on the left), the
       vent hose, the drain and fill plugs */
    part(mb=>{const u=2.25,yt=axY(u)-.1;hdRBox(mb,Pt(u,(yt+yb(.445))/2,0),[.03,(yt-yb(.445))/2+.004,.05],.008,RB,2);hdRBox(mb,Pt(u,yt+.002,0),[.035,.004,.06],.004,STEEL,2);},30);
    part(mb=>{const u0t=2.3,u1t=2.62,yc=axY(2.46);const rings=[];for(let k=0;k<=10;k++){const t=k/10,u=u0t+(u1t-u0t)*t,h=.11+.04*Math.sin(t*PI),w=.1+.03*Math.sin(t*PI);
        rings.push(hdRRect(w,h,.04,5).map(([z,y])=>Pt(u,yc+y-.03,z-.04)));}hdLoft(mb,rings,ALU,true);hdCap(mb,rings[0],ALU,true);hdCap(mb,rings[10],ALU,false);
      for(let k=0;k<12;k++){const a=k/12*TAU;cpHex(mb,Pt(2.46,yc-.03+Math.sin(a)*.15,-.04+Math.cos(a)*.13),[0,0,1],.006,.005);}
      cpHex(mb,Pt(2.5,yc-.18,-.04),[0,-1,0],.011,.006);cpHex(mb,Pt(2.45,yc-.06,.095),[0,0,1],.011,.006);
      hdTube(mb,[Pt(2.44,yc+.12,-.04),Pt(2.44,yc+.2,-.02),Pt(2.3,yb(.74),.05)],.004,6,HOSE,false,true);},30);
    cpRev(U,Pt(2.62,axY(2.62)-.02,0),Pt(2.68,axY(2.62)-.025,0),[[0,0],[.042,0],[.045,.01],[.045,.04],[.035,.05],[.038,.06],[0,.06]],ALU,24,35);
    cpRev(U,Pt(2.33,yb(.49),SOLID?.15:-.15),Pt(2.27,yb(.488),SOLID?.152:-.152),[[0,0],[.038,0],[.04,.012],[.04,.04],[.03,.06],[0,.06]],ALU,24,35);}
  /* the front driveshaft, from the transfer case's front output forward along the left of the gearbox and the sump to
     the front differential's pinion: CV joints each end in their boots */
  {const a=Pt(2.27,yb(.488),SOLID?.152:-.152),b=SOLID?FD:Pt(1.1,FD[1]+.012,fdz-.005),d=V3.norm(V3.sub(b,a));
    cpBoot(U,a,V3.add(a,V3.mul(d,.08)),.034,.022,6);cpRev(U,V3.add(a,V3.mul(d,.08)),V3.add(b,V3.mul(d,-.08)),[[.022,0],[.022,V3.len(V3.sub(b,a))-.16]],STEEL,16,40);
    cpBoot(U,V3.add(b,V3.mul(d,-.08)),b,.022,.034,6);}
  /* the rear driveshaft: the slip yoke out of the transfer case, a U-joint, the tube with its balance weights, a
     U-joint and the flange at the pinion */
  const RP=Pt(LY.uPin,LY.pinY,0);
  {const a=Pt(2.68,axY(2.62)-.025,0),d=V3.norm(V3.sub(RP,a)),Lr=V3.len(V3.sub(RP,a));
    cpRev(U,a,V3.add(a,V3.mul(d,.07)),[[0,0],[.03,0],[.03,.07]],STEEL,18,40);suvUJoint(U,V3.add(a,V3.mul(d,.1)),d,.032,STEEL,SMC('#8a8c90',SM.BOLT));
    cpRev(U,V3.add(a,V3.mul(d,.14)),V3.add(RP,V3.mul(d,-.14)),[[0,0],[.033,0],[.04,.02],[.04,Lr-.3],[.033,Lr-.28],[0,Lr-.28]],SMC('#1b1c1e',SM.PAINTED),24,35);
    part(mb=>{for(const t of [.22,.78]){const c=V3.add(a,V3.mul(d,Lr*t));hdRBox(mb,V3.add(c,[0,.041,0]),[.018,.004,.014],.002,STEEL,1);}},25);
    suvUJoint(U,V3.add(RP,V3.mul(d,-.1)),d,.032,STEEL,SMC('#8a8c90',SM.BOLT));
    cpRev(U,V3.add(RP,V3.mul(d,-.06)),RP,[[0,0],[.048,0],[.048,.014],[.03,.02],[.03,.06],[0,.06]],STEEL,24,35);
    part(mb=>{for(let k=0;k<4;k++){const ang=k/4*TAU+PI/4;const M=cpAx(V3.add(RP,V3.mul(d,-.06)),RP);cpHex(mb,M4.xform(M,[Math.cos(ang)*.036,Math.sin(ang)*.036,.0]),V3.mul(d,-1),.007,.006);}},25);}

  /* ================= the exhaust ================= */
  if(EXT==='single'){const r=.026,TUBE=(pts,rr=r,m=EXH)=>part(mb=>{hdTube(mb,suvPath(pts,5,2),rr,14,m,false,true);},40);
    /* (each side: from the manifold's flange at the back of the head, the downpipe to a catalyst under its shield, an
       oxygen sensor before and after it) */
    for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*z),zc=s>0?.27:.37;
      part(mb=>{for(const du of [0,.01]){const c=Q([1.25+du,yb(.47),.37]);obox(mb,c,[1,0,0],[0,1,0],[0,0,1],[.004,.034,.034],EXHB);}for(const dd of [-.026,.026])cpHex(mb,Q([1.265,yb(.47)+dd,.37]),[1,0,0],.008,.008);},30);
      TUBE([Q([1.265,yb(.47),.37]),Q([1.34,yb(.44),.37]),Q([1.42,yb(.41),(.37+zc)/2]),Q([1.5,yb(.395),zc])],r,EXHB);
      part(mb=>{const rings=[];for(const [u,w,h] of [[1.5,.03,.028],[1.54,.034,.03],[1.57,.06,.05],[1.8,.06,.05],[1.83,.034,.03],[1.87,.03,.028]])rings.push(hdRRect(w,h,Math.min(w,h)*.95,6).map(([z,y])=>Q([u,yb(.392)+y,zc+z])));
        hdLoft(mb,rings,EXH,true);},35);
      part(mb=>{const rows=[];for(let u=1.56;u<=1.811;u+=.02){const row=[];for(let k=0;k<=12;k++){const a=PI*(.05+.9*k/12);row.push(Q([u,yb(.392)-Math.sin(a)*.058-.002*Math.sin(u*300),zc+Math.cos(a)*.07]));}rows.push(row);}hdLoft(mb,rows,SHIELD,false,s>0);},30);
      for(const u of [1.47,1.9])part(mb=>{const c=Q([u,yb(.392)+.026,zc]);cpHex(mb,c,[0,1,0],.011,.008);hdCyl(mb,V3.add(c,[0,.011,0]),V3.add(c,[0,.04,0]),.008,.007,12,STEEL);
        hdTube(mb,[V3.add(c,[0,.04,0]),V3.add(c,[-.03,.05,-s*.02]),Q([u-.1,yb(.43),zc-.08])],.003,6,HOSE,false,true);},35);}
    /* the Y: the two pipes into one under the gearbox's crossmember, and on to the muffler */
    TUBE([Pt(1.87,yb(.392),-.37),Pt(1.98,yb(.375),-.24),Pt(2.08,yb(.36),-.02),Pt(2.16,yb(.358),.1)]);
    TUBE([Pt(1.87,yb(.392),.27),Pt(1.98,yb(.38),.2),Pt(2.08,yb(.362),.13),Pt(2.16,yb(.358),.11)]);
    part(mb=>{ball(mb,Pt(2.165,yb(.358),.105),.034,16,EXH);},40);
    TUBE([Pt(2.17,yb(.358),.11),Pt(2.28,yb(.357),.2),Pt(2.36,yb(.37),.3)],.029);
    /* the muffler: an oval can on its seams, its hangers */
    const MU=[2.38,2.88,.3,yb(.372)];
    part(mb=>{const rings=[];for(const [t,k] of [[0,.55],[.02,.92],[.05,1],[.95,1],[.98,.92],[1,.55]]){const u=MU[0]+(MU[1]-MU[0])*t;rings.push(hdRRect(.11*k,.062*k,.05*k,8).map(([z,y])=>Pt(u,MU[3]+y,MU[2]+z)));}
      hdLoft(mb,rings,EXH,true);hdCap(mb,rings[0],EXH,true);hdCap(mb,rings[5],EXH,false);},40);
    part(mb=>{for(const t of [.035,.965]){const u=MU[0]+(MU[1]-MU[0])*t,a=hdRRect(.112,.064,.052,8).map(([z,y])=>Pt(u-.004,MU[3]+y,MU[2]+z)),b=a.map(p=>V3.add(p,[-.008,0,0]));hdLoft(mb,[a,b],EXHB,true);}
      hdRBox(mb,Pt((MU[0]+MU[1])/2,MU[3]-.062,MU[2]),[.22,.002,.04],.002,EXHB,1);},30);
    /* the tailpipe: beside the tank through the resonator, up over the rear axle, down under the right rail to the tip */
    TUBE([Pt(2.88,MU[3],.3),Pt(2.94,yb(.372),.34),Pt(3.0,yb(.372),.37)],.027);
    cpRev(U,Pt(3.0,yb(.372),.37),Pt(3.32,yb(.372),.37),[[0,0],[.028,0],[.046,.03],[.048,.05],[.048,.27],[.046,.29],[.028,.32],[0,.32]],EXH,28,35);
    TUBE([Pt(3.32,yb(.372),.37),Pt(3.45,yb(.4),.375),Pt(3.6,yb(.455),.38),Pt(3.82,yb(.47),.38),Pt(4.1,yb(.47),.38),Pt(4.3,yb(.455),.39),Pt(4.42,yb(.385),.46),Pt(4.52,yb(.335),.54),Pt(4.6,yb(.345),.595),Pt(4.68,yb(.385),.6),Pt(4.79,yb(.39),.6)],.027);
    /* the hangers: a rod off the pipe into a rubber isolator on a bracket off the frame or the floor */
    for(const [u,z,y] of [[2.0,-.08,yb(.37)],[2.5,.38,MU[3]+.03],[2.82,.38,MU[3]+.03],[3.4,.375,yb(.385)],[4.2,.38,yb(.468)],[4.62,.6,yb(.36)]])part(mb=>{const c=Pt(u,y,z),t=V3.add(c,[0,.04,0]);
      hdCyl(mb,c,t,.005,.005,8,STEEL);hdCyl(mb,V3.add(t,[-.016,0,0]),V3.add(t,[.016,0,0]),.019,.019,14,RB);hdRBox(mb,V3.add(t,[0,.024,0]),[.022,.004,.022],.003,STEEL,1);},30);
    /* the tip: chrome, turned down a little at its end, where the game's comes out */
    D.tips=[];
    {const a=Pt(4.79,yb(.39),.6),b=Pt(L-.01,yb(.39),.6);cpRev(U,a,b,[[.026,0],[.034,.012],[.037,.02],[.037,(L-.01-4.79)-.006],[.034,L-.01-4.79],[.031,L-.01-4.79-.004],[.031,.03]],MM.CHROME,32,40);
      cpRev(U,V3.add(b,[.06,0,0]),V3.add(b,[.004,0,0]),[[0,0],[.028,0],[.028,.05]],SMC('#151515',SM.CAST),20,40);D.tips.push({p:b,d:[-1,0,0],r:.037});}}
  /* (two pipes from the turbos' downpipes, an X under the gearbox's crossmember, a round muffler in each, over the
     rear axle either side and out under the rails to two tips, where the game has them) */
  else if(EXT==='dual'){const r=.029,ys=yb(.355),TUBE=(pts,rr=r,m=EXH2())=>part(mb=>{hdTube(mb,suvPath(pts,5,2),rr,14,m,false,true);},40);D.tips=[];
    for(const e of (car.bay&&car.bay.ex)||[]){const s=e.s,Q=([u,y,z])=>Pt(u,y,s*z);
      part(mb=>{obox(mb,V3.add(e.p,[-.004,0,0]),[1,0,0],[0,1,0],[0,0,1],[.004,.04,.04],EXHB);for(const dd of [-.03,.03])cpHex(mb,V3.add(e.p,[-.008,dd,0]),[-1,0,0],.007,.006);},30);
      TUBE([V3.add(e.p,[-.008,0,0]),Q([1.42,yb(.385),.34]),Q([1.56,ys,.31]),Q([1.95,ys,.3])],.032);
      /* an oxygen sensor in each */
      part(mb=>{const c=Q([1.62,ys+.03,.31]);cpHex(mb,c,[0,1,0],.011,.008);hdCyl(mb,V3.add(c,[0,.011,0]),V3.add(c,[0,.04,0]),.008,.007,12,STEEL);hdTube(mb,[V3.add(c,[0,.04,0]),Q([1.55,yb(.43),.25])],.003,6,HOSE,false,true);},35);}
    for(const s of [1,-1])TUBE([Pt(1.95,ys,s*.3),Pt(2.06,ys,s*.13),Pt(2.2,ys,-s*.13),Pt(2.31,ys,-s*.3)],.03);
    part(mb=>{ball(mb,Pt(2.13,ys,0),.045,18,EXH2());},40);
    for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*z);
      cpRev(U,Q([2.36,ys,.3]),Q([2.86,ys,.3]),[[0,0],[.03,0],[.058,.04],[.06,.07],[.06,.43],[.058,.46],[.03,.5],[0,.5]],SMC('#c9c8c4',SM.BRUSH),28,35);
      TUBE([Q([2.86,ys,.3]),Q([2.96,yb(.36),.37]),Q([3.2,yb(.37),.38]),Q([3.45,yb(.4),.38]),Q([3.6,yb(.455),.38]),Q([3.82,yb(.47),.38]),Q([4.1,yb(.47),.38]),Q([4.3,yb(.455),.39]),
        Q([4.42,yb(.385),.46]),Q([4.52,yb(.33),.54]),Q([4.6,yb(.35),.6]),Q([4.7,yb(.41),.64]),Q([L-.12,yb(.43),.64])]);
      for(const [u,z,y] of [[2.6,.3,ys+.06],[3.4,.38,yb(.385)],[4.2,.38,yb(.468)],[4.62,.6,yb(.36)]])part(mb=>{const c=Q([u,y,z]),t=V3.add(c,[0,.04,0]);
        hdCyl(mb,c,t,.005,.005,8,STEEL);hdCyl(mb,V3.add(t,[-.016,0,0]),V3.add(t,[.016,0,0]),.019,.019,14,RB);hdRBox(mb,V3.add(t,[0,.024,0]),[.022,.004,.022],.003,STEEL,1);},30);
      /* the tip: polished, rolled at its end, where the game's comes out */
      const a=Q([L-.12,yb(.43),.64]),b=Q([L+.04,yb(.43),.64]);cpRev(U,a,b,[[.03,0],[.044,.014],[.048,.022],[.048,.154],[.044,.16],[.04,.156],[.04,.03]],MM.CHROME,32,40);
      cpRev(U,V3.add(b,[.07,0,0]),V3.add(b,[.004,0,0]),[[0,0],[.034,0],[.034,.06]],SMC('#151515',SM.CAST),20,40);D.tips.push({p:b,d:[-1,0,0],r:.048});}}
  /* (a crawler's: the headers' collectors joined in a Y, one pipe tucked up along the right rail, its muffler, over
     the rear axle and out to the game's tip, turned down behind the rear wheel) */
  else if(EXT==='crawl'){const r=.03,TUBE=(pts,rr=r,m=EXH2())=>part(mb=>{hdTube(mb,suvPath(pts,5,2),rr,14,m,false,true);},40);D.tips=[];
    for(const e of (car.bay&&car.bay.ex)||[]){const s=e.s,Q=([u,y,z])=>Pt(u,y,s*z);
      part(mb=>{obox(mb,V3.add(e.p,[-.004,0,0]),[1,0,0],[0,1,0],[0,0,1],[.004,.04,.04],EXHB);for(const dd of [-.03,.03])cpHex(mb,V3.add(e.p,[-.008,dd,0]),[-1,0,0],.007,.006);},30);
      TUBE([V3.add(e.p,[-.008,0,0]),Q([1.42,yb(.43),.36]),Q([1.7,yb(.41),.3]),Q([1.95,yb(.405),s>0?.22:.0]),Q([2.1,yb(.405),s>0?.2:-.18])],.032);}
    part(mb=>{ball(mb,Pt(2.12,yb(.405),.2),.04,16,EXH2());},40);
    TUBE([Pt(2.12,yb(.405),.2),Pt(2.3,yb(.41),.3),Pt(2.38,yb(.41),.34)],.034);
    cpRev(U,Pt(2.38,yb(.41),.34),Pt(2.84,yb(.41),.34),[[0,0],[.034,0],[.06,.04],[.062,.07],[.062,.39],[.06,.42],[.034,.46],[0,.46]],SMC('#2a2b2e',SM.PAINTED),28,35);
    TUBE([Pt(2.84,yb(.41),.34),Pt(3.0,yb(.41),.38),Pt(3.4,yb(.43),.38),Pt(3.65,LY.Rr+.13,.38),Pt(3.95,LY.Rr+.13,.38),Pt(4.2,yb(.48),.42),Pt(4.45,yb(.5),.59),Pt(L-.22,yb(.5),.59),Pt(L-.22+.01,yb(.5),.55)],.03);
    for(const [u,z,y] of [[2.6,.34,yb(.41)+.06],[3.3,.38,yb(.43)],[4.55,.59,yb(.5)]])part(mb=>{const c=Pt(u,y,z),t=V3.add(c,[0,.045,0]);hdCyl(mb,c,t,.005,.005,8,STEEL);hdCyl(mb,V3.add(t,[-.016,0,0]),V3.add(t,[.016,0,0]),.019,.019,14,RB);hdRBox(mb,V3.add(t,[0,.024,0]),[.022,.004,.022],.003,STEEL,1);},30);
    {const a=Pt(L-.22,yb(.5),.55),d=V3.norm([-.6,-.8,0]),bw=V3.add(a,V3.mul(d,.1));
      cpRev(U,V3.add(a,V3.mul(d,-.02)),bw,[[.028,0],[.038,.012],[.04,.02],[.04,.1],[.036,.106],[.033,.102],[.033,.03]],MM.CHROME,32,40);D.tips.push({p:bw,d:[d[0],d[1],d[2]],r:.04});}}

  /* ================= the rear ================= */
  if(!SOLID){
  /* the subframe: two side members, a beam ahead of the axle and one behind, on four bushes up to the rails */
  const sfy=yb(.305),sfz=.34;
  for(const s of [1,-1]){cpBar(U,[Pt(3.56,sfy+.01,s*sfz),Pt(3.7,sfy,s*sfz),Pt(3.95,sfy,s*sfz),Pt(4.16,sfy+.012,s*sfz)],.026,.03,.008,FRAME,[0,1,0],38);
    for(const u of [3.6,4.12]){const top=RY(u)-RH(u);part(mb=>{hdSweep(mb,[Pt(u,sfy,s*sfz),Pt(u,sfy+.01,s*.4),Pt(u,sfy+.02,s*.46)],[[-.028,-.022],[.028,-.022],[.028,.022],[-.028,.022]],FRAME,[0,1,0],true,true);},30);
      cpBush(U,Pt(u,(sfy+.02+top)/2,s*.46),[0,1,0],.034,Math.max(.02,top-sfy-.04));}}
  part(mb=>{for(const [u,y] of [[3.6,sfy+.004],[4.12,sfy+.006]]){const pts=[];for(let k=0;k<=10;k++)pts.push(Pt(u,y,-sfz+2*sfz*k/10));hdSweep(mb,pts,hdRRect(.028,.026,.008,3),FRAME,[0,1,0],true,true);}},38);
  /* the differential: a cast case on the subframe, its nose forward to the driveshaft's flange, the finned cover
     behind, the outputs either side; its ears to the beams, the breather */
  const RD=Pt(D.uRa,LY.R+.02,0);
  {part(mb=>{const rings=[];for(let k=0;k<=14;k++){const t=k/14,u=LY.uPin+.01+(D.uRa+.13-LY.uPin-.01)*t,e=Math.sin(Math.max(.08,Math.min(1,t*1.05))*PI)**.5,w=.13*e,h=.12*e,yc=lerp(LY.pinY,RD[1],sm01(t*2));
      rings.push(hdRRect(Math.max(.02,w),Math.max(.02,h),Math.max(.01,Math.min(w,h)*.55),5).map(([z,y])=>Pt(u,yc+y,z)));}hdLoft(mb,rings,ALU,true);hdCap(mb,rings[0],ALU,true);hdCap(mb,rings[14],ALU,false);},35);
    part(mb=>{const uc=D.uRa+.122;for(let k=-3;k<=3;k++)hdRBox(mb,Pt(uc,RD[1],k*.032),[.016,.08-Math.abs(k)*.011,.004],.003,ALU,1);
      for(let k=0;k<10;k++){const a=k/10*TAU;cpHex(mb,Pt(uc-.012,RD[1]+Math.sin(a)*.095,Math.cos(a)*.11),[-1,0,0],.007,.006);}
      cpHex(mb,Pt(D.uRa+.02,RD[1]-.12,0),[0,-1,0],.012,.007);cpHex(mb,Pt(D.uRa+.05,RD[1]+.02,.13),[0,0,1],.012,.007);
      hdCyl(mb,Pt(D.uRa,RD[1]+.12,.04),Pt(D.uRa,RD[1]+.15,.04),.006,.006,8,STEEL);hdTube(mb,[Pt(D.uRa,RD[1]+.15,.04),Pt(D.uRa-.05,RD[1]+.19,.06),Pt(D.uRa-.15,yb(.53),.08)],.004,6,HOSE,false,true);},30);
    for(const s of [1,-1])cpRev(U,Pt(D.uRa,RD[1],s*.1),Pt(D.uRa,RD[1],s*.16),[[0,0],[.06,0],[.06,.03],[.05,.035],[.05,.05],[.062,.052],[.062,.06],[0,.06]],ALU,28,35);
    for(const s of [1,-1])part(mb=>{hdRBox(mb,Pt(LY.uPin+.04,(LY.pinY+sfy)/2,s*.1),[.025,(LY.pinY-sfy)/2,.016],.006,ALU,2);hdRBox(mb,Pt(D.uRa+.15,(RD[1]+sfy)/2+.01,s*.12),[.02,(RD[1]-sfy)/2,.016],.006,ALU,2);},30);}
  /* the arms, the links, the coilovers behind the axle; the knuckles with their hubs */
  const RS={F:[3.64,yb(.30),.40],R:[4.1,yb(.30),.40],B:[3.82,wR-.158,.71],UF:[3.68,wR+.262+dF,.5],UR:[3.93,wR+.262+dF,.5],UB:[3.82,wR+.267,.63],TI:[4.1,sfy+.03,.34],TO:[4.03,wR-.07,.70],C0:[3.935,.25+dy*.4+(wR-.378)*.6,.6],C1:[3.935,wR+.45+dF,.59]};
  for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*(z>.55?z+tsR:z)),B=Q(RS.B),UB=Q(RS.UB);
    for(const P of [RS.F,RS.R]){cpBar(U,[Q(P),V3.lerp(Q(P),B,.5),B],.018,.012,.006,ARM,[0,1,0],40);cpBush(U,Q(P),[1,0,0],.03,.06);
      part(mb=>{for(const dz of [-.038,.038])hdRBox(mb,Q([P[0]+dz,P[1]+.02,P[2]]),[.004,.035,.03],.004,FRAME,2);},30);}
    cpBar(U,[V3.lerp(Q(RS.F),B,.6),V3.lerp(Q(RS.R),B,.6)],.013,.01,.005,ARM,[0,1,0],40);
    part(mb=>{hdCyl(mb,V3.add(B,[0,-.02,0]),V3.add(B,[0,.012,0]),.026,.024,20,FORGE);},35);
    part(mb=>{const c=Q(RS.C0);hdRBox(mb,V3.add(c,[0,-.012,0]),[.03,.01,.026],.006,ARM,2);for(const du of [-.02,.02])hdRBox(mb,V3.add(c,[du,.008,0]),[.004,.02,.02],.004,ARM,2);},30);
    cpBar(U,[V3.add(B,[0,.035,0]),Q([3.82,wR-.1,.715]),Q([3.82,wR,.72]),Q([3.825,wR+.12,.705]),Q([3.825,wR+.21,.665]),V3.add(UB,[0,-.03,0])],.025,.017,.008,CASTI,[0,0,1],40);
    cpRev(U,Q([3.82,wR,.69]),Q([3.82,wR,.756]),[[0,0],[.054,0],[.062,.012],[.062,.058],[.054,.066],[0,.066]],CASTI,28,35);
    cpBar(U,[Q([3.84,wR-.05,.715]),Q([3.95,wR-.06,.71]),Q(RS.TO)],.014,.012,.006,CASTI,[0,1,0],40);
    for(const P of [RS.UF,RS.UR]){cpBar(U,[Q(P),V3.lerp(Q(P),UB,.5),UB],.011,.009,.005,FORGE,[0,1,0],40);cpBush(U,Q(P),[1,0,0],.022,.045);
      part(mb=>{const y0=RY(P[0])+RH(P[0]);hdRBox(mb,Q([P[0],(P[1]+y0)/2,.505]),[.03,(P[1]-y0)/2+.02,.006],.004,FRAME,2);},30);}
    part(mb=>{hdCyl(mb,V3.add(UB,[0,-.012,0]),V3.add(UB,[0,.018,0]),.02,.018,16,FORGE);},35);
    /* the toe link: a rod with a ball joint each end and its adjuster, the eccentric cam at the subframe */
    part(mb=>{const a=Q(RS.TI),b=Q(RS.TO);hdCyl(mb,V3.lerp(a,b,.08),V3.lerp(a,b,.92),.0095,.0095,12,STEEL);ball(mb,a,.017,12,BOLT);ball(mb,b,.017,12,BOLT);hdCyl(mb,V3.lerp(a,b,.2),V3.lerp(a,b,.27),.013,.013,6,BOLT);
      for(const dz of [-.03,.03])hdRBox(mb,V3.add(a,[0,.04,dz]),[.026,.05,.004],.004,FRAME,2);hdCyl(mb,V3.add(a,[0,0,-.04]),V3.add(a,[0,0,.04]),.008,.008,10,BOLT);hdCyl(mb,V3.add(a,[0,0,-.04]),V3.add(a,[0,0,-.034]),.022,.022,18,STEEL);},35);
    cpCoilover(U,Q(RS.C0),Q(RS.C1),{bodyL:.25,s0:.13,s1:.53,rs:.048,turns:6,wire:.0092,spring:SPR,body:DAMP,seat:STEEL});
    /* the half-shaft */
    {const a=Q([D.uRa,RD[1],.16]),b=Q([3.82,wR,.69]);cpRev(U,a,V3.lerp(a,b,.12),[[0,0],[.05,0],[.052,.01],[.052,.05],[.04,.06],[0,.06]],CV,24,35);
      cpBoot(U,V3.lerp(a,b,.12),V3.lerp(a,b,.3),.043,.017,6);cpRev(U,V3.lerp(a,b,.3),V3.lerp(a,b,.78),[[.0165,0],[.0165,V3.len(V3.sub(b,a))*.48]],STEEL,14,40);
      cpBoot(U,V3.lerp(a,b,.78),V3.lerp(a,b,.94),.017,.045,6);cpRev(U,V3.lerp(a,b,.94),b,[[0,0],[.048,0],[.05,.02],[0,.03]],CV,24,35);}
    /* the brake's hose and the handbrake's cable at the caliper */
    part(mb=>{const p=[Q([3.66,wR+.18,.5]),Q([3.68,wR+.12,.58]),Q([3.71,wR+.07,.66]),Q([3.73,wR+.05,.69])];hdTube(mb,p,.0065,8,HOSE,false,true);hdRBox(mb,p[0],[.012,.012,.005],.003,STEEL,1);},40);}
  /* the anti-roll bar: in clamps on the rear beam, its arms forward to links on the lower arms' rear legs */
  {const y=sfy+.045,u=4.07;
    part(mb=>{const p=[Pt(3.99,y-.005,-.56),Pt(4.03,y,-.5),Pt(u,y,-.38),Pt(u,y,.38),Pt(4.03,y,.5),Pt(3.99,y-.005,.56)];hdTube(mb,suvPath(p,4),.012,12,BLK,false,true);},38);
    for(const s of [1,-1]){part(mb=>{hdRBox(mb,Pt(u,y,s*.26),[.02,.02,.018],.008,RB,2);hdRBox(mb,Pt(u,y+.004,s*.26),[.024,.018,.011],.005,STEEL,2);hdRBox(mb,Pt(u+.03,(y+sfy)/2,s*.26),[.004,(y-sfy)/2+.01,.016],.004,FRAME,2);},30);
      part(mb=>{const a=Pt(3.99,y-.005,s*.56),b=Pt(3.99,yb(.272),s*.56);hdCyl(mb,a,b,.0055,.0055,8,STEEL);ball(mb,a,.011,10,BOLT);ball(mb,b,.011,10,BOLT);},35);}}

  }
  /* ================= solid axles (a lifted build's, susp 'solid') ================= */
  /* each: the housing (its differential on the right, as the game's, a red cover, the truss along its top, the pinion
     toward the transfer case), kingpin knuckles at the front, two long lower links and two upper ones to the frame, a
     track bar at the front, coilovers up into the towers and bypass shocks beside them, hydraulic bump stops, limit
     straps; the front's steering: the box on the left horn, the drag link, the tie rod and its hydraulic ram */
  if(SOLID){const RED=SMC('#b8261c',SM.PAINTED),SPRS=o.spring?SMC(o.spring,SM.PAINTED):SMC('#c8301c',SM.PAINTED),LINK=SMC('#2c2d30',SM.PAINTED),BYP=SMC('#1f4fb8',SM.PAINTED),BYPS=SMC('#c4c6ca',SM.BRUSH);
    for(const front of [1,0]){const ua=front?D.uFa:D.uRa,dir=front?1:-1,R=front?LY.R:LY.Rr,tw=front?LY.tw:LY.twR,zk=tw-.075,zD=.16,yA=R,Pa=(du,y,z)=>Pt(ua+du,y,z);
      /* the centre section: the pumpkin, the cover's bolts, the fill plug, the pinion's snout and its yoke */
      part(mb=>{ball(mb,Pa(0,yA,zD),.15,28,CASTI);hdCyl(mb,Pa(-dir*.06,yA,zD),Pa(-dir*.12,yA,zD),.135,.13,32,RED);for(let k=0;k<10;k++){const a=k/10*TAU;cpHex(mb,Pa(-dir*.122,yA+Math.sin(a)*.115,zD+Math.cos(a)*.115),[-dir,0,0],.008,.007);}
        cpHex(mb,Pa(-dir*.124,yA+.03,zD),[-dir,0,0],.014,.008);for(let k=-2;k<=2;k++)hdRBox(mb,Pa(-dir*.123,yA,zD+k*.04),[.003,.09-Math.abs(k)*.02,.006],.002,RED,1);},35);
      cpRev(U,Pa(dir*.1,yA,zD),Pa(dir*.21,yA+.008,zD),[[0,0],[.075,0],[.06,.04],[.045,.08],[.045,.1],[.05,.11],[0,.11]],CASTI,28,35);
      /* the tubes out to the ends, the truss over them, the brackets for the links and the coilovers */
      part(mb=>{hdCyl(mb,Pa(0,yA,zD-.12),Pa(0,yA,-zk+.05),.047,.047,24,CASTI);hdCyl(mb,Pa(0,yA,zD+.12),Pa(0,yA,zk-.05),.047,.047,24,CASTI);
        for(const z of [-zk+.08,zk-.08,zD-.13,zD+.13])hdCyl(mb,Pa(0,yA,z-.008),Pa(0,yA,z+.008),.052,.052,24,CASTI);},35);
      part(mb=>{const t=[Pa(0,yA+.05,-zk+.12),Pa(0,yA+.09,-.3),Pa(0,yA+.12,zD-.05),Pa(0,yA+.12,zD+.05),Pa(0,yA+.09,.45),Pa(0,yA+.05,zk-.12)];hdSweep(mb,suvPath(t,4,1),[[-.004,-.04],[.004,-.04],[.004,.0],[-.004,0]],LINK,[1,0,0],true,true);
        for(const z of [-.45,-.15,.32,.5])hdRBox(mb,Pa(0,yA+.07+.02*Math.cos(z*3),z),[.004,.025,.012],.002,LINK,1);},30);
      /* the ends: the knuckle round each C, its two ball joints, the steering arm; the rear's flanges */
      for(const s of [1,-1]){const Q=(du,y,z)=>Pa(du,y,s*z);
        if(front){cpRev(U,Q(0,yA,zk-.05),Q(0,yA,zk+.005),[[0,0],[.06,0],[.06,.055],[0,.055]],CASTI,28,35);
          part(mb=>{hdRBox(mb,Q(0,yA+.11,zk-.015),[.04,.022,.035],.01,CASTI,3);hdRBox(mb,Q(0,yA-.11,zk-.015),[.04,.022,.035],.01,CASTI,3);
            for(const e of [1,-1]){hdCyl(mb,Q(0,yA+e*.135,zk-.02),Q(0,yA+e*.16,zk-.02),.022,.02,18,FORGE);cpHex(mb,Q(0,yA+e*.165,zk-.02),[0,e,0],.012,.01);}},35);
          cpBar(U,[Q(-.02,yA+.12,zk-.02),Q(-.1,yA+.13,zk-.03),Q(-.17,yA+.1,zk-.04)],.016,.012,.006,CASTI,[0,1,0],40);}
        else part(mb=>{hdCyl(mb,Q(0,yA,zk-.06),Q(0,yA,zk+.005),.075,.075,28,CASTI);for(let k=0;k<6;k++){const a=k/6*TAU;cpHex(mb,Q(Math.cos(a)*.058,yA+Math.sin(a)*.058,zk+.005),[0,0,s],.007,.006);}},35);
        /* the lower link: long, a rod end each end in its bracket, the frame's bracket hanging under the rail */
        {const a=Q(0,yA-.085,.45),fu=ua+dir*.95,b=Pt(fu,yb(.37),s*.47);
          part(mb=>{hdCyl(mb,V3.lerp(a,b,.04),V3.lerp(a,b,.96),.024,.024,16,LINK);ball(mb,a,.03,14,BOLT);ball(mb,b,.03,14,BOLT);for(const t of [.1,.9])hdCyl(mb,V3.lerp(a,b,t-.02),V3.lerp(a,b,t+.02),.028,.028,6,BOLT);
            for(const dz of [-.03,.03]){hdRBox(mb,V3.add(a,[0,.03,dz]),[.035,.05,.004],.004,LINK,2);hdRBox(mb,V3.add(b,[0,.04,dz]),[.035,.06,.004],.004,FRAME,2);}},35);}
        /* the coilover, up into the tower; the bypass shock beside it, its three tubes and its reservoir */
        cpCoilover(U,Q(dir*.12,yA+.06,tw-.3),Pt(ua+dir*.12,yb(.86),s*.6),{bodyL:.32,s0:.16,s1:.55,rs:.062,turns:7,wire:.012,spring:SPRS,body:DAMP,seat:STEEL});
        {const a=Q(-dir*.12,yA+.03,tw-.27),b=Pt(ua-dir*.12,yb(.9),s*.62),d=V3.norm(V3.sub(b,a)),Lb=V3.len(V3.sub(b,a));
          cpRev(U,a,V3.add(a,V3.mul(d,Lb*.55)),[[0,0],[.033,0],[.035,.02],[.035,Lb*.53],[.025,Lb*.55]],BYP,24,35);cpRev(U,V3.add(a,V3.mul(d,Lb*.55)),b,[[.011,0],[.011,Lb*.45]],MM.CHROME,14,40);
          part(mb=>{const sd=V3.norm(V3.cross(d,[1,0,0]));for(let k=0;k<3;k++){const off=V3.mul(V3.norm(V3.add(V3.mul(sd,Math.cos(k*.5-.5)),[0,0,0])),.048),p0=V3.add(V3.add(a,V3.mul(d,Lb*.08)),off),p1=V3.add(V3.add(a,V3.mul(d,Lb*.48)),off);
            hdCyl(mb,p0,p1,.009,.009,10,BYPS);hdRBox(mb,V3.lerp(p0,p1,.5),[.006,.012,.006],.003,BYP,1);}
            const rv=Pt(ua-dir*.12,yb(.78),s*.5);hdCyl(mb,V3.add(rv,[0,-.1,0]),V3.add(rv,[0,.1,0]),.03,.03,20,BYP);hdTube(mb,[V3.add(a,V3.mul(d,Lb*.5)),V3.add(rv,[0,-.12,0])],.006,8,SMC('#7d7f83',SM.SATIN),false,true);},35);}
        /* the bump stop: a hydraulic can on the frame over the tube, its pad on the axle; the limit strap */
        part(mb=>{const c=Pt(ua,yb(.6),s*.43);hdCyl(mb,c,V3.add(c,[0,-.12,0]),.03,.03,20,SMC('#c8a23a',SM.PAINTED));hdCyl(mb,V3.add(c,[0,-.12,0]),V3.add(c,[0,-.15,0]),.014,.014,12,MM.CHROME);
          hdRBox(mb,Pa(0,yA+.055,s*.43),[.035,.008,.035],.004,LINK,2);hdRBox(mb,V3.add(c,[0,.02,0]),[.05,.012,.05],.004,FRAME,2);},30);
        part(mb=>{const a=Pt(ua+dir*.05,yb(.62),s*.5),b=Pa(dir*.05,yA+.06,s*.5);hdSweep(mb,[a,V3.lerp(a,b,.5),b],[[-.022,-.002],[.022,-.002],[.022,.002],[-.022,.002]],SMC('#d8a21a',SM.CLOTH),[1,0,0],true,true);},30);}
      /* the upper links, triangulated to the frame's crossmember */
      for(const z of [zD-.13,zD+.13]){const a=Pa(dir*.05,yA+.15,z),b=Pt(ua+dir*.6,yb(.47),Math.sign(z-zD)*.27);
        part(mb=>{hdCyl(mb,V3.lerp(a,b,.05),V3.lerp(a,b,.95),.02,.02,14,LINK);ball(mb,a,.026,12,BOLT);ball(mb,b,.026,12,BOLT);for(const dz of [-.025,.025])hdRBox(mb,V3.add(b,[0,.03,dz]),[.03,.045,.004],.004,FRAME,2);},35);}
      part(mb=>{const u=ua+dir*.6,pts=[];for(let k=0;k<=8;k++)pts.push(Pt(u,yb(.5),-.4+.8*k/8));hdSweep(mb,pts,hdRRect(.025,.025,.006,3),FRAME,[0,1,0],true,true);},35);
      /* the diff's guard: a steel shoe round the pumpkin's underside */
      part(mb=>{const rows=[];for(let k=0;k<=10;k++){const a=PI*(.15+.7*k/10),row=[];for(let j=0;j<=6;j++){const z=zD-.13+.26*j/6;row.push(Pa(-Math.cos(a)*.17*dir,yA-Math.sin(a)*.17,z));}rows.push(row);}hdLoft(mb,rows,SMC('#2a2b2e',SM.PAINTED),false,front>0);},30);
      if(front){
        /* the track bar from the frame's left to the axle's right, its brace */
        part(mb=>{const a=Pt(ua-.08,yb(.5),-.42),b=Pa(-.08,yA+.07,.6);hdCyl(mb,V3.lerp(a,b,.04),V3.lerp(a,b,.96),.024,.024,16,LINK);ball(mb,a,.03,12,BOLT);ball(mb,b,.03,12,BOLT);hdRBox(mb,V3.add(a,[0,.04,0]),[.04,.05,.03],.006,FRAME,2);},35);
        /* the steering: the box on the left horn, the pitman arm, the drag link to the right knuckle, the tie rod between the
           arms and its ram, the shaft up to the firewall */
        const box=Pt(.48,yb(.45),-.44),pit=Pt(.52,yb(.32),-.5),arm=e=>Pa(-.17,yA+.1,e*(zk-.04));
        part(mb=>{hdRBox(mb,box,[.07,.06,.05],.015,CASTI,3);hdCyl(mb,V3.add(box,[0,-.06,0]),pit,.016,.016,12,FORGE);ball(mb,pit,.02,12,BOLT);
          hdCyl(mb,pit,arm(1),.017,.017,14,LINK);ball(mb,arm(1),.02,12,BOLT);hdCyl(mb,arm(-1),arm(1),.019,.019,14,LINK);
          const r0=V3.lerp(arm(-1),arm(1),.25),r1=V3.lerp(arm(-1),arm(1),.75);hdCyl(mb,V3.add(r0,[-.03,0,0]),V3.add(V3.lerp(r0,r1,.65),[-.03,0,0]),.025,.025,18,SMC('#2c4fb0',SM.PAINTED));hdCyl(mb,V3.add(V3.lerp(r0,r1,.65),[-.03,0,0]),V3.add(r1,[-.03,0,0]),.011,.011,12,MM.CHROME);
          for(const q of [r0,r1])hdCyl(mb,V3.add(q,[0,0,0]),V3.add(q,[-.03,0,0]),.008,.008,8,BOLT);
          hdTube(mb,suvPath([V3.add(box,[.02,.06,0]),Pt(.7,yb(.6),-.44),Pt(1.1,yb(.72),-.4),Pt(1.38,yb(.82),-.34)],4,1),.012,12,STEEL,false,true);
          for(const zz of [-.03,.03])hdTube(mb,suvPath([V3.add(r0,[-.03,.02,zz]),Pt(.6,yb(.4),-.3+zz),V3.add(box,[.03,.0,.05+zz])],4,1),.005,8,SMC('#7d7f83',SM.SATIN),false,true);},35);}
      /* the brake's hoses, from the frame to each end */
      for(const s of [1,-1])part(mb=>{const p=[Pt(ua+dir*.15,yb(.62),s*.48),Pa(dir*.1,yA+.15,s*.6),Pa(dir*.05,yA+.1,s*(zk-.06))];hdTube(mb,suvPath(p,4,1),.0065,8,HOSE,false,true);},40);}}
  /* ================= skid plates (o.skids) ================= */
  if(o.skids){const SK=SMC('#3b3d41',SM.PAINTED),plate=(u0,u1,y,z,holes)=>{part(mb=>{const rows=[];for(let u=u0;u<=u1+1e-6;u+=.02){const row=[];for(let zz=-z;zz<=z+1e-6;zz+=.03)row.push(Pt(u,y-.01*sm01((u0+.06-u)/.06),zz));rows.push(row);}hdLoft(mb,rows,SK,false,true);
      const e=[];for(let u=u0;u<=u1+1e-6;u+=.04)e.push(Pt(u,y,z));hdTube(mb,e,.004,6,SK,false,true);const e2=e.map(p=>[p[0],p[1],-p[2]]);hdTube(mb,e2,.004,6,SK,false,true);},30);
      part(mb=>{for(const [u,zz] of holes){const c=Pt(u,y-.001,zz);hdCyl(mb,c,V3.add(c,[0,-.002,0]),.03,.03,20,SMC('#111214',SM.PAINTED));}for(const u of [u0+.03,u1-.03])for(const zz of [-z+.03,z-.03])cpHex(mb,Pt(u,y-.002,zz),[0,-1,0],.009,.006);},25);};
    plate(.28,.7,yb(.36),.4,[[.4,-.2],[.4,.2],[.55,0]]);plate(1.18,2.1,yb(.36),.22,[[1.4,0],[1.7,.1],[1.95,-.1]]);plate(2.2,2.72,yb(.37),.22,[[2.46,0]]);
    {const [t0,t1,z0,z1]=SUV_TANK;part(mb=>{hdRBox(mb,Pt((t0+t1)/2,yb(.235),(z0+z1)/2-.01),[(t1-t0)/2+.01,.004,(z1-z0)/2-.01],.004,SK,2);for(let k=-3;k<=3;k++)hdRBox(mb,Pt((t0+t1)/2+k*.06,yb(.231),(z0+z1)/2-.01),[.006,.003,(z1-z0)/2-.04],.002,SK,1);},30);}}
  /* ================= the tank, the filler, the spare ================= */
  if(o.tank!=='cell'){const [t0,t1,z0,z1]=SUV_TANK,top=yb(.465),bot=yb(.25),TC=[(t0+t1)/2,(top+bot)/2,(z0+z1)/2];
    part(mb=>{hdRBox(mb,Pt(TC[0],TC[1],TC[2]-.01),[(t1-t0)/2-.02,(top-bot)/2,(z1-z0)/2-.03],.04,TANK,5);},35);
    /* its moulded ribs underneath, the seam round its middle, the pump's flange on top */
    part(mb=>{for(let k=-4;k<=4;k++)hdRBox(mb,Pt(TC[0]+k*.045,bot-.002,TC[2]-.01),[.006,.004,(z1-z0)/2-.08],.003,TANK,1);
      const seam=hdRRect((t1-t0)/2-.02,(z1-z0)/2-.03,.04,6).map(([u,z])=>Pt(TC[0]+u,TC[1],TC[2]-.01+z));seam.push(seam[0]);hdTube(mb,seam,.005,6,TANK,false,false);},30);
    /* the two straps under it, round to their hangers on the crossmembers */
    for(const z of [z0+.14,z1-.14])part(mb=>{const pts=[Pt(t0-.04,yb(.37),z),Pt(t0+.01,bot-.005,z),Pt(t1-.01,bot-.005,z),Pt(t1+.04,yb(.4),z)];hdSweep(mb,suvPath(pts,4,1),[[-.0015,-.018],[.0015,-.018],[.0015,.018],[-.0015,.018]],STEEL,[0,0,1],true,true);
      cpHex(mb,Pt(t1+.04,yb(.4),z),[1,0,0],.008,.007);},30);
    /* its heat shield on the exhaust's side */
    part(mb=>{hdRBox(mb,Pt(TC[0],TC[1]-.02,z1+.012),[(t1-t0)/2-.04,(top-bot)/2-.03,.002],.002,SHIELD,1);for(let k=-3;k<=3;k++)hdRBox(mb,Pt(TC[0]+k*.06,TC[1]-.02,z1+.014),[.004,(top-bot)/2-.035,.0015],.0015,SHIELD,1);},25);
    /* the filler hose from the tank's back corner, along inside the right rail, over it behind the wheelhouse and up to
       the flap; the vent line beside it */
    const fl=[Pt(t1-.02,top-.01,z1-.06),Pt(t1+.08,yb(.505),.1),Pt(t1+.16,yb(.505),.33),Pt(3.7,yb(.505),.455),Pt(4.1,yb(.51),.455),Pt(4.26,yb(.515),.5),Pt(4.3,yb(.515),.62),Pt(4.33,yb(.62),.73),Pt(4.42,yb(.84),.82),Pt(4.48,yb(.99),.86)];
    part(mb=>{const P=suvPath(fl,6,2);hdTube(mb,P,t=>.022+.003*Math.cos(t*P.length*TAU/2.6)*(t>.2&&t<.45?1:0),14,FUEL,false,true);},40);
    part(mb=>{hdTube(mb,suvPath(fl.map(p=>V3.add(p,[.025,.02,-.01])),6,2),.005,8,HOSE,false,true);},40);
    part(mb=>{for(const t of [3.75,4.05])hdRBox(mb,Pt(t,yb(.5),.475),[.012,.03,.02],.004,STEEL,2);},30);
    /* the pump's flange and its lines on top, the vapour canister beside the tank */
    part(mb=>{const c=Pt(TC[0]-.05,top,TC[2]);hdCyl(mb,c,V3.add(c,[0,.006,0]),.07,.07,28,TANK);for(let k=0;k<8;k++){const a=k/8*TAU;cpHex(mb,V3.add(c,[Math.cos(a)*.06,.006,Math.sin(a)*.06]),[0,1,0],.005,.004);}},30);
    part(mb=>{const c=Pt(3.55,yb(.47),-.36);hdRBox(mb,c,[.07,.04,.05],.015,TANK,3);hdTube(mb,[V3.add(c,[-.07,.01,0]),Pt(3.4,yb(.45),-.25),Pt(3.3,top-.005,-.2)],.004,6,HOSE,false,true);},30);}
  /* (a race build's fuel cell: an aluminium box in the spare's place under the cargo floor, on two straps, its braided
     lines forward along the right rail, the filler hose up to the flap) */
  else{const u0=4.24,u1=4.76,top=pan(4.5,0)-.02,bot=yb(.33),zc=.27,C=Pt((u0+u1)/2,(top+bot)/2,0);
    part(mb=>{hdRBox(mb,C,[(u1-u0)/2,(top-bot)/2,zc],.012,SMC('#232427',SM.PAINTED),3);for(let k=-5;k<=5;k++)hdRBox(mb,V3.add(C,[k*.045,-(top-bot)/2-.001,0]),[.004,.002,zc-.02],.002,SMC('#2c2d30',SM.PAINTED),1);
      for(const du of [-.16,.16]){hdRBox(mb,V3.add(C,[du,-(top-bot)/2-.006,0]),[.02,.004,zc+.04],.003,STEEL,1);for(const e of [-1,1])cpHex(mb,V3.add(C,[du,-(top-bot)/2-.008,e*(zc+.03)]),[0,-1,0],.008,.006);}
      hdCyl(mb,V3.add(C,[-.18,-(top-bot)/2,.16]),V3.add(C,[-.18,-(top-bot)/2-.02,.16]),.02,.02,16,SMC('#1b3a8a',SM.PAINTED));},30);
    part(mb=>{for(const dz of [0,.016]){const p=[V3.add(C,[.2,-(top-bot)/2+.02,.2+dz])];for(let u=4.2;u>=1.75;u-=.25)p.push(Pt(u,RY(u)-.012,RZ(u)-RW-.03+dz*.5));p.push(Pt(1.45,yb(.55),.42));hdTube(mb,suvPath(p,3,1),.005,8,SMC('#7d7f83',SM.SATIN),false,true);}},40);
    part(mb=>{const P=suvPath([V3.add(C,[.15,(top-bot)/2,.22]),Pt(4.32,yb(.52),.55),Pt(4.34,yb(.62),.73),Pt(4.42,yb(.84),.82),Pt(4.48,yb(.99),.86)],6,2);hdTube(mb,P,.022,14,FUEL,false,true);},40);}
  /* the spare: lying flat under the cargo floor, face down, on its winch's cable and the cross-plate */
  if(o.spare!==false){const c=Pt(4.51,yb(.43),0),sw={R:.325,W:.15,rim:16},sp=new MB();
    hdTyre(sp,sw,{kind:'hwy'});
    const rr=hdRimParts(sp,sw,{face:.03,lugs:0,barrel:SMC('#2b2c2e',SM.PAINTED),lip:SMC('#2b2c2e',SM.PAINTED)});
    hdPart(sp,mb=>{hdDiscWin(mb,{rIn:.075,rOut:rr.rimR-.012,zAt:r=>.03+(.068-.03)*sm01((r-.08)/(rr.rimR-.1)),m:SMC('#2b2c2e',SM.PAINTED),n:6,r0:.1,r1:.15,frac:.3,phase:.08});
      hdRev(mb,[[0,.026],[.06,.026],[.075,.03]],48,SMC('#2b2c2e',SM.PAINTED),0,TAU,true);for(let k=0;k<6;k++){const a=k/6*TAU;hdCyl(mb,[Math.cos(a)*.0675,Math.sin(a)*.0675,.032],[Math.cos(a)*.0675,Math.sin(a)*.0675,.022],.008,.008,10,SMC('#0a0a0b',SM.PAINTED));}},30);
    const M=M4.mul(M4T(c[0],c[1],c[2]),M4RX(PI/2));xformMB(sp,M);hdPut(U,sp);
    /* the cross-plate under its centre, the cable up through the centre hole to the winch on the floor */
    part(mb=>{const y=c[1]-.035;hdRBox(mb,[c[0],y,0],[.1,.004,.025],.004,STEEL,2);hdRBox(mb,[c[0],y,0],[.025,.004,.1],.004,STEEL,2);hdCyl(mb,[c[0],y,0],[c[0],yb(.53),0],.004,.004,8,STEEL);
      hdRBox(mb,[c[0],yb(.522),0],[.06,.012,.05],.008,FRAME,2);hdCyl(mb,[c[0]-.06,yb(.52),0],[c[0]-.12,yb(.52),0],.01,.01,10,FRAME);},30);}

  /* ================= the nitrous's feed ================= */
  /* (from the bottle in the cargo area down through the floor, forward along the inside of the left rail, up behind the
     left wheelhouse into the bay) */
  if(o.nos)part(mb=>{const p=[Pt(4.3,pan(4.3,-.46),-.46),Pt(4.28,pan(4.28,-.46)-.04,-.46)];for(let u=4.1;u>=1.7;u-=.2)p.push(Pt(u,RY(u)+.03,-(RZ(u)-RW-.008)));p.push(Pt(1.5,yb(.6),-.47),Pt(1.4,yb(.7),-.47));
    hdTube(mb,suvPath(p,3,1),.005,8,SMC('#7d7f83',SM.SATIN),false,true);for(let u=3.9;u>1.8;u-=.4)hdRBox(mb,Pt(u,RY(u)+.03,-(RZ(u)-RW-.012)),[.008,.012,.008],.003,CLIP,2);},40);
  /* ================= the lines ================= */
  /* two brake lines and the fuel feed and return along the inside of the right rail, clipped to it; the handbrake's
     cable from the pedal down to its equaliser and out to the rear calipers */
  {const run=(dz,dyy,rr,m)=>part(mb=>{const p=[Pt(1.3,yb(.52),.36+dz),Pt(1.5,yb(.44)+dyy,.44+dz)];for(let u=1.75;u<=3.4+1e-6;u+=.1)p.push(Pt(u,RY(u)+dyy,RZ(u)-RW-.012+dz));
      p.push(Pt(3.55,RY(3.55)+dyy+.02,RZ(3.55)-RW-.012+dz));hdTube(mb,suvPath(p,3,1),rr,6,m,false,true);},40);
    run(0,.02,.0028,LINE);run(-.008,.02,.0028,LINE);run(-.002,-.012,.0045,FUEL);run(-.014,-.012,.0045,FUEL);
    part(mb=>{for(let u=1.9;u<3.4;u+=.3){const c=Pt(u,RY(u)+.004,RZ(u)-RW-.016);hdRBox(mb,c,[.008,.03,.012],.003,CLIP,2);}},30);
    part(mb=>{const p=[Pt(1.62,yb(.66),-.62),Pt(1.75,yb(.45),-.6),Pt(2.4,yb(.42),-.42),Pt(2.9,yb(.43),-.2)];hdTube(mb,suvPath(p,4,1),.004,6,CABLE(),false,true);
      hdRBox(mb,Pt(2.92,yb(.43),-.2),[.02,.012,.02],.004,STEEL,2);
      for(const s of [1,-1])hdTube(mb,suvPath([Pt(2.92,yb(.43),-.2),Pt(3.2,yb(.4),s*.42),Pt(3.5,yb(.44),s*.48),Pt(3.7,wR+.07,s*.62)],4,1),.0035,6,CABLE(),false,true);},40);}
  return U;
  function CABLE(){return SMC('#1a1a1b',SM.HOSE);}
  function CASTA2(){return SMC('#b7b9bc',SM.CAST);}
  function EXH2(){return SMC('#a8a59e',SM.SATIN);}
}
