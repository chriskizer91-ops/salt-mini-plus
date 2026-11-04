/* =====================================================================================
   THE HYPERCAR'S V10 AND THE BAY ROUND IT, behind the cabin, seen through the canopy's long rear glass and between
   the engine cover's louvres (84). Built here, as the game draws no engine there (31_engine_bay draws a front bay,
   which 87 keeps as a front trunk).
   - The bay: a floor, the side walls with a ledge out to the skin, the rear wall behind the silencer, all in dark grey
     liner; the bulkhead behind the cabin faced in gold heat foil; a carbon strut brace across between the towers.
   - The V10, lengthwise ahead of the rear axle, its crank low: the block and its sump in cast grey, two cylinder
     heads at ninety degrees, cam covers in red crinkle with fins along them and five coils down each in the
     build's accent colour; between the banks a carbon plenum with ten short runners into the heads, two throttle
     bodies at its front fed by ducts from the carbon air boxes either side (the flank intakes' air).
   - The exhaust: five primaries a bank curling out and down from the heads into a collector, a pipe from each
     back over the drive shafts to the silencer across the tail, two pipes out of its back to the tips (83).
   - The transaxle behind the engine: the bell housing, the differential across the axle line, the gearbox case
     behind it; the drive shafts out to the wheels with their joints' boots.
   - The dry-sump oil tank and the coolant header tank either side, ahead of the rear wheels.
   ===================================================================================== */
function hpEngine(out,car){
  const K=HDK,D=K.D,X=K.X,lk=D.look,ACC=car.b.cal||'#e8b21b',
    LIN=SMC('#2b2c2f',SM.LINER),FOIL=SMC('#b89238',SM.BRUSH),CASTG=SMC('#3b3c3f',SM.ENGINE),ALU=SMC('#8a8d92',SM.ENGINE),COVER=SMC('#8c1a12',SM.ENGINE),DARKE=SMC('#151517',SM.ENGINE),FIN=SMC('#9a9da2',SM.BRUSH),
    CARB=SV([1,1,1],MAT.CARBON),COIL=SMC('#121213',SM.PLASTIC),CAP=SMC(ACC,SM.PLASTIC),HDR=SMC('#7a6a5a',SM.BRUSH),STEEL=SMC('#b6b9bd',SM.BRUSH),
    HOSE=SMC('#141414',SM.HOSE),BOOT=SV([.02,.02,.02],MAT.RUBBER),TANK=SMC('#d8d4c8',SM.PLASTIC);
  const uB=2.885,uW=4.46,yFl=.16,zW=.66,yc=.31,ue0=2.98,ue1=3.6,um=(ue0+ue1)/2,tip=hpTipAt();
  /* ---------- the bay ---------- */
  const yTop=u=>Math.min(K.topY(u,zW+.02)-.022,D.belt(u)+.3);
  hdPart(out,mb=>{const n=40;for(let k=0;k<n;k++){const a=uB+(uW-uB)*k/n,b=uB+(uW-uB)*(k+1)/n;
    mb.quad([X(a),yFl,-zW],[X(b),yFl,-zW],[X(b),yFl,zW],[X(a),yFl,zW],LIN[0],0,LIN[2]);
    for(const s of [1,-1]){const q=s<0?(p,q2,r,t)=>mb.quad(p,q2,r,t,LIN[0],0,LIN[2]):(p,q2,r,t)=>mb.quad(t,r,q2,p,LIN[0],0,LIN[2]);
      q([X(a),yTop(a),s*zW],[X(b),yTop(b),s*zW],[X(b),yFl,s*zW],[X(a),yFl,s*zW]);
      const za=K.sideZ(a,yTop(a))-.012,zb=K.sideZ(b,yTop(b))-.012;
      q([X(a),yTop(a),s*za],[X(b),yTop(b),s*zb],[X(b),yTop(b),s*zW],[X(a),yTop(a),s*zW]);}}},30);
  /* the rear wall, and the bulkhead's back in its foil (quilted in squares) */
  hdPart(out,mb=>{const x=X(uW),n=16;for(let k=0;k<n;k++){const za=-zW+2*zW*k/n,zb=-zW+2*zW*(k+1)/n,ya=K.topY(uW,Math.abs(za))-.02,yb=K.topY(uW,Math.abs(zb))-.02;
    mb.quad([x,ya,za],[x,yb,zb],[x,yFl,zb],[x,yFl,za],LIN[0],0,LIN[2]);}},30);
  hdPart(out,mb=>{const x=X(uB),yT=D.belt(uB)-.01,nz=12,ny=6;for(let i=0;i<nz;i++)for(let j=0;j<ny;j++){const za=-zW+2*zW*i/nz,zb=-zW+2*zW*(i+1)/nz,ya=yFl+(yT-yFl)*j/ny,yb=yFl+(yT-yFl)*(j+1)/ny,
    zm=(za+zb)/2,ym=(ya+yb)/2,c=[x-.006,ym,zm];
    for(const [p,q] of [[[x,ya,za],[x,ya,zb]],[[x,ya,zb],[x,yb,zb]],[[x,yb,zb],[x,yb,za]],[[x,yb,za],[x,ya,za]]])mb.tri(p,q,c,FOIL[0],0,FOIL[2]);}},25);
  /* the strut brace across between the towers, under the rear glass */
  {const u=3.45,y=Math.min(K.topY(u,.6)-.07,.86);
    hdPart(out,mb=>{hdCyl(mb,[X(u),y,-zW+.02],[X(u),y,zW-.02],.022,.022,20,CARB,true);
      for(const s of [1,-1]){hdRBox(mb,[X(u),y,s*(zW-.03)],[.05,.035,.012],.008,ALU,2);for(const du of [-.03,.03])hdCyl(mb,[X(u+du),y+.02,s*(zW-.045)],[X(u+du),y+.02,s*(zW-.02)],.006,.006,8,HC.BOLT);}},35);}
  /* ---------- the V10 ---------- */
  const EM=M4.basis([X(ue0),0,0],[0,0,1],[0,1,0],[-1,0,0]);
  /* the block and its sump: one section along the crank, the vee between the banks */
  hdPart(out,mb=>{hdExtrude(mb,[[-.13,yc-.14],[.13,yc-.14],[.17,yc-.07],[.2,yc-.01],[.212,yc+.072],[.083,yc+.2],[0,yc+.12],[-.083,yc+.2],[-.212,yc+.072],[-.2,yc-.01],[-.17,yc-.07]],0,ue1-ue0,CASTG,.006,2);},30,null,EM);
  /* the front of the engine: the timing cover, the crank's damper */
  hdPart(out,mb=>{hdRBox(mb,[X(ue0)+.012,yc+.08,0],[.012,.17,.2],.04,CASTG,3);hdCyl(mb,[X(ue0)+.024,yc,0],[X(ue0)+.05,yc,0],.075,.075,32,DARKE,true);},30);
  for(const s of [1,-1]){const c45=Math.SQRT1_2,ay=[0,c45,s*c45],ax=[-1,0,0],az=[0,s*c45,-c45],
      BM=M4.basis([X(um),yc,0],ax,ay,az),bank=s>0?.04:-.04,L2=(ue1-ue0)/2;
    /* the head, the cam cover and its fins, the five coils */
    hdPart(out,mb=>{hdRBox(mb,[0,.265,0],[L2-.005,.06,.098],.02,ALU,3);},30,null,BM);
    hdPart(out,mb=>{hdRBox(mb,[0,.355,0],[L2-.02,.032,.088],.028,COVER,4);},35,null,BM);
    hdPart(out,mb=>{for(const zz of [-.06,-.03,.03,.06])hdRBox(mb,[0,.389,s*zz],[L2-.06,.004,.0035],.002,FIN,1);},30,null,BM);
    hdPart(out,mb=>{for(let i=0;i<5;i++){const x=-L2+.07+i*(ue1-ue0-.14)/4+bank*.5;
        hdCyl(mb,[x,.38,0],[x,.418,0],.017,.017,16,COIL,true);hdCyl(mb,[x,.418,0],[x,.426,0],.019,.015,16,CAP,true);hdRBox(mb,[x,.408,-s*.024],[.01,.008,.008],.003,COIL,2);}},35,null,BM);
    /* the exhaust: five primaries curling out and down from the head into a collector behind it */
    const port=(i,d)=>{const x=-L2+.07+i*(ue1-ue0-.14)/4+bank*.5;return M4.xform(BM,[x,.27,s>0?-.108-d:.108+d]);};
    hdPart(out,mb=>{const col=[X(ue1+.02),yc-.01,s*.36];for(let i=0;i<5;i++){const p0=port(i,0),p1=port(i,.04),p2=[p1[0],p1[1]-.08,s*(Math.abs(p1[2])+.06)],
        p3=[X(ue1-.08+i*.02),yc-.02,s*.4];hdTube(mb,[p0,p1,p2,p3,col].map((p,k)=>k===4?V3.add(p,[0,0,s*(i-2)*.008]):p),.017,10,HDR,false,true);}
      hdCyl(mb,[X(ue1-.04),yc-.01,s*.37],[X(ue1+.06),yc-.01,s*.37],.04,.035,16,HDR,true);},30);
    /* the pipe back over the drive shaft to the silencer */
    hdPart(out,mb=>{hdTube(mb,[[X(ue1+.05),yc-.01,s*.37],[X(3.72),.46,s*.42],[X(3.9),.47,s*.42],[X(4.14),.45,s*.42]],.034,14,STEEL,false,true);},35);
    /* the runners from the plenum into the head's inner side */
    hdPart(out,mb=>{for(let i=0;i<5;i++){const p0=port(i,0).slice(),pin=M4.xform(BM,[-L2+.07+i*(ue1-ue0-.14)/4+bank*.5,.27,s>0?.11:-.11]);
        const m1=[pin[0],pin[1]+.05,pin[2]+s*.04],a=[pin[0],yc+.345,s*.098];hdTube(mb,[pin,m1,a],.021,12,CARB,false,true);}},35);
    /* the air box beside the engine and its duct to the throttle body */
    hdPart(out,mb=>{hdRBox(mb,[X(3.13),.66,s*.5],[.14,.065,.1],.04,CARB,4);hdTube(mb,[[X(3.02),.66,s*.4],[X(2.98),.665,s*.25],[X(3.0),.66,s*.13]],.042,16,ALU,false,true);},35);
    hdPart(out,mb=>{hdCyl(mb,[X(3.0),.66,s*.13],[X(3.06),.655,s*.07],.04,.04,20,ALU,true);},35);}
  /* the plenum between the banks */
  hdPart(out,mb=>{hdRBox(mb,[X(um+.02),yc+.34,0],[.27,.042,.1],.038,CARB,5);hdRBox(mb,[X(um+.02),yc+.383,0],[.22,.005,.07],.005,FIN,2);},35);
  /* the oil tank and the coolant header tank */
  hdPart(out,mb=>{hdCyl(mb,[X(3.42),yFl+.02,.55],[X(3.42),.58,.55],.065,.065,28,ALU,true);hdCyl(mb,[X(3.42),.58,.55],[X(3.42),.605,.55],.033,.033,20,DARKE,true);
    hdRBox(mb,[X(3.42),.6,-.55],[.07,.06,.07],.02,TANK,3);hdCyl(mb,[X(3.42),.66,-.55],[X(3.42),.685,-.55],.028,.028,20,CAP,true);
    hdTube(mb,[[X(3.36),.24,.5],[X(3.2),.2,.3],[X(3.1),.19,.12]],.014,10,HOSE,false,true);hdTube(mb,[[X(3.36),.58,-.5],[X(3.2),.52,-.3],[X(3.04),.46,-.15]],.012,10,HOSE,false,true);},35);
  /* ---------- the transaxle and the drive shafts ---------- */
  hdPart(out,mb=>{hdCyl(mb,[X(ue1-.01),yc,0],[X(ue1+.12),yc+.01,0],.17,.14,36,ALU,true);
    hdCyl(mb,[X(D.uRa+.02),.33,-.2],[X(D.uRa+.02),.33,.2],.11,.11,32,ALU,true);
    hdRBox(mb,[X(3.95),.3,0],[.19,.12,.14],.05,ALU,4);
    for(const du of [-.12,0,.12])hdRBox(mb,[X(3.95+du),.42,0],[.008,.006,.1],.004,ALU,1);},30);
  for(const s of [1,-1])hdPart(out,mb=>{const y=D.arch.cy,z0=.2,z1=lk.track/2-lk.tyre.W/2-.02;
    hdCyl(mb,[X(D.uRa),y,s*z0],[X(D.uRa),y,s*z1],.022,.022,14,STEEL,false);},30);
  for(const s of [1,-1])for(const zb of [.2,lk.track/2-lk.tyre.W/2-.12])hdPart(out,mb=>{hdRev(mb,[[.028,0],[.05,.02],[.042,.04],[.05,.06],[.035,.08],[.028,.1]],20,BOOT);},30,null,M4.basis([X(D.uRa),D.arch.cy,s*zb],[1,0,0],[0,s,0],[0,0,s]));
  /* ---------- the silencer across the tail and the two pipes to the tips ---------- */
  hdPart(out,mb=>{hdRBox(mb,[X(4.28),.45,0],[.13,.1,.5],.06,STEEL,5);for(const du of [-.08,-.03,.03,.08])hdRBox(mb,[X(4.28+du),.553,0],[.006,.004,.46],.003,STEEL,1);},35);
  hdPart(out,mb=>{for(const s of [1,-1])hdTube(mb,[[X(4.36),tip.y,s*tip.z],[X(4.43),tip.y,s*tip.z]],.058,24,STEEL,false,false);},35);
}
