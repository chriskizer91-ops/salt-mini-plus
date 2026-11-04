/* =====================================================================================
   THE SUV'S CABIN, FINISHED (Studio 2): the SUV Studio's own cabin (75_cabin hdCabin, copied here as it is) on the
   Studio 2 floor, with what it leaves out:
   - the carpet over the floor's own pan (91_under): the toe board, the tall tunnel over the gearbox and the transfer
     case, the heel kick under the rear bench; the console stands on the tunnel, the shifter on the console;
   - the front seats' rails and their feet, the levers;
   - the seat belts: the webbing down each pillar from its height adjuster to the floor's anchor, the latch plates,
     the buckles on their stalks beside the seats; the rear's from the C pillars;
   - the pedals: the brake and the accelerator on their arms, the footrest, the parking brake's pedal and release;
   - the wheelhouses' carpeted humps in the cargo area, its tie-down hooks, the cargo cover's cassette, the cargo lamp
     and the power socket; the trims on the B and C pillars;
   - (o.nos: the nitrous bottle on the cargo floor's left in its two clamps, its valve, gauge and feed line.)
   ===================================================================================== */
function suvCabin2(out,car,o={}){
  const K=HDK,D=K.D,G=D.G,X=K.X,L=D.L,dy=D.dy;
  /* open the shell behind the side glass, both sides */
  for(const P of hdSideGlass())for(const s of [1,-1])for(const src of [car.body,car.hood])hdCutSide(src,s,P);
  const STONE=SV(lin('#6d675f'),SM.SEAT),STONED=SV(lin('#57524b'),SM.SEAT),CHAR=SV(lin('#242322'),SM.DASH),CHARV=SV(lin('#2c2b2a'),SM.VINYL),
    INS=SV(lin('#6a645c'),SM.VINYL),HL=SV(lin('#7a746b'),SM.HEADLINER),CARP=SV(lin('#2a2826'),SM.CARPET),SAT=HC.SATIN,BLK=SV([.012,.012,.013],SM.DASH);
  const yF=.5+dy,zw=u=>K.sideZ(u,Math.min(D.belt(u)-.1,.95+dy))-.05;
  /* ---------- the floor: carpet from the toe board to the tailgate, the tunnel down the middle ---------- */
  /* (Studio 2: the carpet lies 6 cm over the floor's own pan, 91_under: the toe board, the tall tunnel over the gearbox
     and the transfer case, the heel kick under the rear bench, the cargo floor) */
  const cy=(u,z)=>suvPanY(u,z,dy)+.06;
  hdPart(out,mb=>{const rows=[],u0=G.cowl+.05,u1=G.be-.05;
    for(let u=u0;u<=u1+1e-6;u+=.03){const zz=zw(u)-.01,row=[];
      for(let j=0;j<=32;j++){const z=-zz+2*zz*j/32;row.push([X(u),cy(u,z),z]);}rows.push(row);}
    hdLoft(mb,rows,CARP,false,true);},40);
  /* ---------- door panels and quarter trims: inside the shell from the floor to the window sill ---------- */
  for(const s of [1,-1])hdPart(out,mb=>{const rows=[];
    for(let u=G.cowl+.02;u<=G.be-.05+1e-6;u+=.025){const yb=yF-.02,yt=D.belt(u)-.035,row=[];
      for(let j=0;j<=10;j++){const t=j/10,y=yb+(yt-yb)*t,arm=.035*Math.exp(-Math.pow((y-(.82+dy))/.04,2))*(u<G.pillars[1][0]+.1?1:0),zi=K.sideZ(u,Math.min(y,D.belt(u)-.04))-.035-arm-.02*(1-t);
        row.push([X(u),y,s*zi]);}
      /* the sill's cap, rolling over to meet the glass */
      const zt=K.sideZ(u,D.belt(u)-.03);row.push([X(u),D.belt(u)-.005,s*(zt-.03)],[X(u),D.belt(u)+.006,s*(zt-.012)]);rows.push(row);}
    hdLoft(mb,rows,CHARV,false,s<0);},40);
  /* stone inserts and pulls on the four doors */
  for(const s of [1,-1])for(const [u0,u1] of [[G.cowl+.18,G.pillars[0][0]-.06],[G.pillars[0][0]+.08,G.pillars[1][0]-.06]]){
    hdPart(out,mb=>{const rows=[];for(let u=u0;u<=u1+1e-6;u+=.02){const row=[];for(let j=0;j<=4;j++){const y=.86+dy+.16*j/4;row.push([X(u),y,s*(K.sideZ(u,y)-.058-.004*Math.sin(j/4*PI))]);}rows.push(row);}
      hdLoft(mb,rows,INS,false,s<0);},40);
    hdPart(out,mb=>{const u=(u0+u1)/2-.05;hdRBox(mb,[X(u),.86+dy,s*(K.sideZ(u,.86+dy)-.085)],[.13,.016,.022],.012,CHARV,3);
      hdRBox(mb,[X(u0+.06),1.03+dy,s*(K.sideZ(u0+.06,1.03+dy)-.06)],[.035,.012,.008],.005,MM.CHROME,2);},40);}
  /* ---------- the headliner: under the roof from the windshield header to the liftgate ---------- */
  hdPart(out,mb=>{const rows=[],u0=G.rf-.12,u1=G.rr-.04;
    for(let u=u0;u<=u1+1e-6;u+=.04){const row=[];const zm=secKeys(D,u).P[10][0]-.035;
      for(let j=0;j<=16;j++){const z=-zm+2*zm*j/16,y=K.topY(u,Math.abs(z))-.045-.05*Math.pow(Math.abs(z)/zm,6);row.push([X(u),y,z]);}rows.push(row);}
    hdLoft(mb,rows,HL,false);},40);
  /* the visors and the mirror */
  for(const s of [1,-1])hdPart(out,mb=>{const u=G.rf+.03,y=K.topY(u,.35)-.07;hdRBox(mb,[X(u),y,s*.38],[.08,.012,.17],.01,HL,3);},40);
  hdPart(out,mb=>{const u=G.rf+.02,y=K.topY(u,0)-.12;hdRBox(mb,[X(u),y,0],[.012,.03,.12],.012,BLK,3);hdCyl(mb,[X(u)+.01,y+.02,0],[X(u)+.03,y+.075,0],.006,.006,8,BLK);},40);
  hdPart(out,mb=>{const u=G.rf+.012,y=K.topY(u,0)-.12;hdRBox(mb,[X(u)-.0135,y,0],[.001,.026,.115],.001,HC.MIRROR,1);},20);
  /* ---------- the dashboard: lofted across the cabin, a gauge hood over the driver's side ---------- */
  const uD=G.cowl,uE=G.cowl+.5;
  hdPart(out,mb=>{const rows=[];for(let k=0;k<=40;k++){const z=-.86+1.72*k/40,az=Math.abs(z),zc=Math.min(az,zw(uE)-.01)*Math.sign(z);
      const hood=.055*Math.exp(-Math.pow((z+.38)/.17,4)),stack=Math.exp(-Math.pow(z/.2,4));
      const yt=1.08+dy+hood,yw=secKeys(D,uD+.06).yG-.01;
      const prof=[[uD+.04,yw],[uD+.22,yt-.01],[uE-.12,yt],[uE-.05,yt-.012-hood*.3],[uE-.02,yt-.06],[uE-.015,.92+dy],[uE-.05-.06*stack,.8+dy],[uE-.1+.18*stack,.66+dy],[uE-.18+.14*stack,yF+.12]];
      rows.push(prof.map(([u,y])=>[X(u),y,zc]));}
    const R=rows[0].map((_,j)=>rows.map(r=>r[j]));hdLoft(mb,R,CHAR,false);},34);
  /* the gauge cluster: two dials and a strip of warning lamps behind a dark face, under the hood */
  {const u=uE-.09,y=1.035+dy,z0=-.38;
    hdPart(out,mb=>{hdRBox(mb,[X(u-.02),y,z0],[.012,.06,.17],.02,BLK,3);},40);
    for(const [dz,r] of [[-.075,.058],[.075,.058]]){const M=M4.mul(hdM([X(u)-.008,y,z0+dz]),M4RY(-PI/2));
      hdPart(out,mb=>{hdRev(mb,[[0,0],[r,0]],48,HC.GAUGE);hdRev(mb,[[r,0],[r+.004,.006],[r+.006,.004]],48,MM.CHROME);},30,null,M);
      /* the ticks and the needle */
      hdPart(out,mb=>{for(let k=0;k<=10;k++){const a=PI*1.25-k/10*PI*1.5,c=Math.cos(a),s2=Math.sin(a);mb.quad([c*r*.8,s2*r*.8-.0012,.0008],[c*r*.92,s2*r*.92-.0012,.0008],[c*r*.92,s2*r*.92+.0012,.0008],[c*r*.8,s2*r*.8+.0012,.0008],lin('#e8e4dc'),.6,MAT.COL);}
        const a=PI*.9;mb.quad([0,-.0015,.002],[Math.cos(a)*r*.85,Math.sin(a)*r*.85-.001,.002],[Math.cos(a)*r*.85,Math.sin(a)*r*.85+.001,.002],[0,.0015,.002],lin('#ff5a1a'),.8,MAT.COL);},20,null,M);}}
  /* the centre stack: vents, the radio, the climate knobs */
  {const u=uE-.03,ys=[.98,.9,.82];
    for(const zz of [-.6,-.12,.12,.6])hdPart(out,mb=>{const yy=zz*zz>.1?1.0+dy:.995+dy;hdRBox(mb,[X(u)+.004,yy,zz],[.01,.032,.06],.012,BLK,3);for(let k=-2;k<=2;k++)hdRBox(mb,[X(u)+.012,yy+k*.011,zz],[.004,.002,.052],.0015,SAT,1);},40);
    hdPart(out,mb=>{hdRBox(mb,[X(u)+.004,.9+dy,0],[.012,.045,.1],.01,BLK,3);hdRBox(mb,[X(u)+.014,.915+dy,0],[.002,.012,.06],.002,SV(lin('#0a1a10'),MAT.COL,.25),1);
      for(const zz of [-.075,.075])hdCyl(mb,[X(u)+.012,.89+dy,zz],[X(u)+.03,.89+dy,zz],.014,.013,20,SAT);
      for(let k=-3;k<=3;k++)hdRBox(mb,[X(u)+.017,.868+dy,k*.016],[.004,.005,.006],.002,SAT,1);},40);
    hdPart(out,mb=>{for(const zz of [-.07,0,.07])hdCyl(mb,[X(u+.04),ys[2]+dy,zz],[X(u+.04)+.02,ys[2]+dy,zz],.016,.015,20,SAT);},40);}
  /* the glove box's shut line */
  hdPart(out,mb=>{hdRBox(mb,[X(uE-.03)+.002,.9+dy,.42],[.002,.06,.2],.004,BLK,2);},20);
  /* ---------- the steering wheel on its column, tilted toward the driver ---------- */
  {const c=[X(uE+.2),1.0+dy,-.38],n=V3.norm([-.9,.44,0]),f=V3.norm([.44,.9,0]),M=M4.basis(c,f,[0,0,-1],n);
    hdPart(out,mb=>{const path=[];for(let k=0;k<=72;k++){const a=k/72*TAU;path.push([Math.cos(a)*.19,Math.sin(a)*.19,0]);}hdTube(mb,path,.016,14,CHARV,true,false);},45,null,M);
    hdPart(out,mb=>{hdRBox(mb,[0,0,.018],[.075,.085,.028],.03,CHAR,4);
      for(const a of [PI/2,-PI/2,PI]){const d=[Math.cos(a),Math.sin(a),0];hdTube(mb,[V3.mul(d,.07),V3.add(V3.mul(d,.13),[0,0,-.005]),V3.mul(d,.18)],.012,10,CHAR,false,true);}},40,null,M);
    hdPart(out,mb=>{hdCyl(mb,V3.add(c,V3.mul(n,-.02)),V3.add(c,V3.mul(n,-.3)),.034,.042,18,BLK);
      /* the stalks either side of the column */
      for(const s2 of [1,-1])hdCyl(mb,V3.add(c,V3.add(V3.mul(n,-.09),[0,0,s2*.03])),V3.add(c,V3.add(V3.mul(n,-.06),[.02,.01,s2*.15])),.006,.006,8,BLK);},40);}
  /* ---------- the console and shifter between the front seats ---------- */
  {const u0=uE-.02,u1=G.pillars[0][0]+.15;
    /* (on the tunnel: its foot follows the carpet, its top level with the seats' bolsters) */
    const yT=cy(u0,0)+.1;
    hdPart(out,mb=>{const rows=[];for(let k=0;k<=10;k++){const u=u0+(u1-u0)*k/10,yb0=cy(u,0)-.01,row=[];for(const [zz,yy] of [[-.11,yb0],[-.11,yT-.03],[-.095,yT],[.095,yT],[.11,yT-.03],[.11,yb0]])row.push([X(u),yy,zz]);rows.push(row);}
      hdLoft(mb,rows,CHAR,false);hdCap(mb,rows[0],CHAR,true);hdCap(mb,rows[10],CHAR,false);},40);
    hdPart(out,mb=>{hdRBox(mb,[X(u1-.16),yT+.03,0],[.16,.028,.1],.025,CHARV,4);for(let k=-2;k<=2;k++)hdRBox(mb,[X(u0+.12),yT+.001,k*.025],[.04,.002,.008],.002,SAT,1);},40);
    hdPart(out,mb=>{hdRev(mb,[[.04,0],[.03,.03],[.015,.07]],24,SV([.02,.02,.02],MAT.RUBBER));},40,null,M4.mul(M4T(X(u0+.25),yT,0),M4RX(-PI/2)));
    hdPart(out,mb=>{const p=[X(u0+.25),yT+.09,0];ball(mb,p,.026,18,CHARV);hdCyl(mb,[X(u0+.25),yT+.03,0],[X(u0+.25),yT+.07,0],.01,.01,10,SAT);hdRBox(mb,[X(u0+.25)-.008,yT+.1,.018],[.012,.008,.004],.003,SAT,1);},40);}
  /* ---------- the seats: two buckets, the rear bench ---------- */
  const seat=(c,w,recl,head=1,bolst=1)=>{const M=M4.mul(M4T(c[0],c[1],c[2]),M4RZ(0));
    /* the cushion, its side bolsters and the plastic skirt under it */
    hdPart(out,mb=>{hdRBox(mb,[.24,.05,0],[.25,.06,w/2-.01],.045,STONE,5);},40,null,M);
    if(bolst)for(const s2 of [1,-1])hdPart(out,mb=>{hdRBox(mb,[.22,.085,s2*(w/2-.04)],[.22,.05,.045],.04,STONED,4);},40,null,M);
    hdPart(out,mb=>{hdRBox(mb,[.22,-.07,0],[.22,.07,w/2-.03],.02,CHAR,2);},40,null,M);
    /* the back, reclined, with its bolsters, and the headrests on chrome posts */
    const Mb=M4.mul(M,M4RZ(recl));
    hdPart(out,mb=>{hdRBox(mb,[-.04,.34,0],[.07,.31,w/2-.01],.05,STONE,5);},40,null,Mb);
    if(bolst)for(const s2 of [1,-1])hdPart(out,mb=>{hdRBox(mb,[-.02,.3,s2*(w/2-.045)],[.075,.27,.05],.045,STONED,4);},40,null,Mb);
    const hs=head===1?[0]:head===3?[-w/3,0,w/3]:[];
    for(const hz of hs){hdPart(out,mb=>{hdRBox(mb,[-.05,.75,hz],[.05,.095,head===1?.13:.12],.04,STONE,4);},40,null,Mb);
      hdPart(out,mb=>{for(const s2 of [1,-1])hdCyl(mb,[-.05,.62,hz+s2*.07],[-.05,.68,hz+s2*.07],.006,.006,8,MM.CHROME);},40,null,Mb);}};
  const uHF=G.pillars[0][0]+.2,uHR=G.pillars[1][0]+.12;
  for(const s of [1,-1])seat([X(uHF),yF+.36,s*.38],.5,.3);
  seat([X(uHR),yF+.33,0],1.42,.26,3,0);
  /* the cargo floor's sill plate at the tailgate */
  hdPart(out,mb=>{const u=G.be-.07;hdRBox(mb,[X(u),cy(u,0)+.012,0],[.025,.02,zw(u)-.02],.008,SAT,2);},40);
  suvCabinFinish(out,car,{yF,zw,cy,uHF,uHR,STONE,STONED,CHAR,CHARV,CARP,SAT,BLK,nos:o.nos});
}
/* the pieces the Studio's cabin leaves out */
function suvCabinFinish(out,car,c){
  const K=HDK,D=K.D,G=D.G,X=K.X,L=D.L,dy=D.dy,{yF,zw,cy,uHF,uHR,STONE,STONED,CHAR,CHARV,CARP,SAT,BLK}=c,WEB=SMC('#1e1e1f',SM.CLOTH),RUBP=SV([.02,.02,.021],MAT.RUBBER);
  /* ---------- the front seats' rails, their feet and the levers ---------- */
  for(const s of [1,-1]){const zc=s*.38;
    for(const e of [-1,1]){const z=zc+e*.18;hdPart(out,mb=>{hdRBox(mb,[X(uHF-.22),yF+.13,z],[.24,.012,.016],.004,SMC('#2a2b2d',SM.ENGINE),2);hdRBox(mb,[X(uHF-.22),yF+.152,z],[.22,.01,.012],.003,SMC('#3a3b3e',SM.ENGINE),2);
      for(const du of [-.42,-.02]){const fy=cy(uHF+du,z);hdRBox(mb,[X(uHF+du),(fy+yF+.13)/2,z],[.02,Math.max(.006,(yF+.13-fy)/2),.018],.004,SMC('#2a2b2d',SM.ENGINE),2);cpHex(mb,[X(uHF+du),fy+.002,z],[0,1,0],.008,.006);}},30);}
    hdPart(out,mb=>{hdTube(mb,[[X(uHF-.47),yF+.18,zc-.12],[X(uHF-.52),yF+.17,zc-.06],[X(uHF-.52),yF+.17,zc+.06],[X(uHF-.47),yF+.18,zc+.12]],.006,8,BLK,false,true);
      const zo=s*(.38+.25);hdRBox(mb,[X(uHF-.2),yF+.3,zo],[.15,.04,.012],.01,CHAR,3);hdRBox(mb,[X(uHF-.08),yF+.32,zo+s*.014],[.03,.012,.006],.004,BLK,2);},35);}
  /* ---------- the seat belts ---------- */
  const belt=(u0,u1,yTop,yBot,s,lean)=>{const zt=K.sideZ(u0,yTop)-.06,zb=K.sideZ(u1,yBot)-.05,top=[X(u0),yTop,s*zt],bot=[X(u1),yBot,s*zb];
    /* the adjuster's track and the D-ring, the webbing down to the latch plate and on to the anchor at the floor */
    hdPart(out,mb=>{hdRBox(mb,V3.add(top,[0,.05,s*.006]),[.012,.07,.004],.003,CHAR,2);hdRBox(mb,top,[.03,.012,.008],.005,BLK,2);hdCyl(mb,V3.add(top,[0,0,-s*.006]),V3.add(top,[0,0,-s*.014]),.008,.008,12,SAT);},40);
    hdPart(out,mb=>{const path=[];for(let k=0;k<=12;k++){const t=k/12,p=V3.lerp(V3.add(top,[0,-.012,-s*.012]),bot,t);path.push(V3.add(p,[lean*Math.sin(t*PI),0,-s*.02*Math.sin(t*PI)]));}
      hdSweep(mb,path,[[-.024,-.0012],[.024,-.0012],[.024,.0012],[-.024,.0012]],WEB,[0,0,s],true,true);
      const lp=V3.lerp(top,bot,.62);hdRBox(mb,V3.add(lp,[0,0,-s*.006]),[.022,.03,.004],.003,SAT,2);hdRBox(mb,V3.add(lp,[0,.035,-s*.006]),[.018,.014,.005],.004,BLK,2);},40);
    hdPart(out,mb=>{hdRBox(mb,V3.add(bot,[0,0,s*.004]),[.02,.03,.006],.004,CHAR,2);cpHex(mb,V3.add(bot,[0,0,-s*.002]),[0,0,-s],.009,.006);},30);};
  for(const s of [1,-1]){belt(G.pillars[0][0]+.04,uHF+.12,D.belt(G.pillars[0][0])+.24,yF+.08,s,.0);belt(G.pillars[1][0]+.06,uHR+.2,D.belt(G.pillars[1][0])+.2,yF+.25,s,.0);
    /* the buckle on its stalk beside the seat, toward the console */
    hdPart(out,mb=>{const b=[X(uHF-.08),yF+.33,s*.13],f=cy(uHF-.08,s*.13);hdTube(mb,[[b[0],f,b[2]],[b[0],(f+b[1])/2,b[2]-s*.005],b],.008,8,BLK,false,true);hdRBox(mb,V3.add(b,[0,.035,0]),[.018,.04,.012],.006,BLK,2);
      hdRBox(mb,V3.add(b,[0,.07,0]),[.012,.004,.009],.002,SMC('#b01e18',SM.PLASTIC),1);},35);
    for(const dz of [-.3,.3])hdPart(out,mb=>{const b=[X(uHR-.22),yF+.32,s*.22+dz*.0+(s>0?0:0)],q=[b[0],b[1],dz];hdRBox(mb,q,[.016,.03,.01],.005,BLK,2);},35);}
  /* ---------- the pedals: brake and accelerator on their arms, the footrest, the parking brake ---------- */
  {const toe=u=>cy(u,-.35);
    for(const [u,z,w,h,arm] of [[1.66,-.43,.06,.05,1],[1.64,-.27,.035,.09,0]]){const y=toe(u)+(arm?.13:.03),p=[X(u),y,z];
      hdPart(out,mb=>{const M=M4.basis(p,V3.norm([.35,1,0]),V3.norm([-1,.35,0]),[0,0,1]);hdRBox(mb,M4.xform(M,[0,0,0]),[h,.008,w],.006,RUBP,3);
        if(arm)hdTube(mb,[p,[X(u+.04),y+.12,z],[X(u+.07),yF+.42,z]],.008,8,BLK,false,true);else hdTube(mb,[V3.add(p,[.01,h*.8,0]),[X(u+.05),y+.14,z],[X(u+.06),yF+.42,z]],.005,8,BLK,false,true);},35);}
    hdPart(out,mb=>{const u=1.66,y=cy(u,-.62)+.05;hdRBox(mb,[X(u),y,-.62],[.07,.012,.04],.006,RUBP,3);},35);
    hdPart(out,mb=>{const u=1.62,y=yF+.3;hdRBox(mb,[X(u),y,-.66],[.022,.03,.03],.006,RUBP,3);hdTube(mb,[[X(u),y,-.66],[X(u+.08),y+.1,-.66],[X(u+.1),yF+.44,-.66]],.008,8,BLK,false,true);
      hdRBox(mb,[X(1.86),yF+.43,-.62],[.012,.015,.03],.006,BLK,2);},35);}
  /* ---------- the cargo area: the wheelhouses' carpeted humps, tie-down hooks, the cargo cover's cassette, the lamp,
     the power socket ---------- */
  for(const s of [1,-1]){const zi=.56;
    hdPart(out,mb=>{const rows=[],n=28;for(let k=0;k<=n;k++){const ph=-.03+(PI+.06)*k/n,[u,y]=archPt(D,D.uRa,ph,.06),zo=zw(u)-.005,row=[];
        for(let j=0;j<=6;j++){const t=j/6,z=zi+(zo-zi)*t;row.push([X(u),Math.max(cy(u,s*z),y+.012*Math.sin(t*PI)),s*z]);}rows.push(row);}
      hdLoft(mb,rows,CARP,false,s>0);const ib=rows.map(r=>r[0]),fl=ib.map(v=>[v[0],cy(D.uC-v[0],s*zi)-.005,v[2]]);hdLoft(mb,[ib,fl],CARP,false,s>0);},40);
    for(const u of [4.0,4.68])hdPart(out,mb=>{const z=s*(zw(u)-.03),y=cy(u,z)+.03,p=[X(u),y,z];hdRBox(mb,V3.add(p,[0,0,s*.006]),[.02,.02,.004],.004,SAT,2);
      const lp=[];for(let k=0;k<=10;k++){const a=k/10*PI;lp.push(V3.add(p,[Math.cos(a)*.016,-Math.sin(a)*.016+.004,-s*.008]));}hdTube(mb,lp,.003,6,MM.CHROME,false,true);},40);}
  {const u=uHR+.24,y=D.belt(u)+.06;hdPart(out,mb=>{hdRBox(mb,[X(u),y,0],[.035,.03,zw(u)-.04],.02,CHAR,4);hdRBox(mb,[X(u+.036),y-.01,0],[.002,.012,zw(u)-.06],.002,SMC('#3a3a3c',SM.PLASTIC),1);
    for(const s of [1,-1])hdRBox(mb,[X(u),y,s*(zw(u)-.035)],[.04,.035,.008],.006,BLK,2);},40);}
  hdPart(out,mb=>{const u=4.4,z=-(zw(u)-.012),y=D.belt(u)-.12;hdRBox(mb,[X(u),y,z],[.04,.015,.005],.004,SMC('#e8e6df',SM.PLASTIC),2);
    const u2=4.2,y2=D.belt(u2)-.25,z2=zw(u2)-.012;hdCyl(mb,[X(u2),y2,z2],[X(u2),y2,z2-.012],.016,.016,18,BLK);hdCyl(mb,[X(u2),y2,z2-.012],[X(u2),y2,z2-.014],.011,.011,18,SMC('#0a0a0b',SM.PLASTIC));},40);
  /* ---------- the nitrous bottle: blue, lying on the cargo floor's left on a plate in two clamps, the valve and its gauge
     at the front, the braided feed down through the floor ---------- */
  if(c.nos){const u0=4.16,u1=4.66,z=-.5,r=.088,y=cy(4.4,z)+r+.012,A=[X(u1),y,z],B=[X(u0),y,z];
    hdPart(out,mb=>{cpRev(mb,A,B,[[0,0],[r*.5,0],[r*.92,.03],[r,.07],[r,.44],[r*.85,.48],[.03,.5],[.022,.5]],SMC('#1d4fb8',SM.PAINTED),36,40);},40);
    hdPart(out,mb=>{hdCyl(mb,B,V3.add(B,[.03,0,0]),.02,.02,16,SMC('#c9a24a',SM.BRUSH));hdRBox(mb,V3.add(B,[.045,0,0]),[.015,.02,.014],.004,SMC('#c9a24a',SM.BRUSH),2);
      hdCyl(mb,V3.add(B,[.045,.02,0]),V3.add(B,[.045,.05,0]),.006,.006,10,SMC('#c9a24a',SM.BRUSH));hdCyl(mb,V3.add(B,[.045,.055,-.012]),V3.add(B,[.045,.055,.012]),.022,.022,24,SMC('#111',SM.PLASTIC));
      hdCyl(mb,V3.add(B,[.045,.055,.012]),V3.add(B,[.045,.055,.014]),.019,.019,24,SMC('#e8e6df',SM.PLASTIC));
      hdTube(mb,suvPath([V3.add(B,[.06,0,0]),[X(4.12),y-.03,z],[X(4.3),cy(4.3,-.46)+.02,-.46],[X(4.3),cy(4.3,-.46)-.03,-.46]],4,1),.005,8,SMC('#7d7f83',SM.SATIN),false,true);
      hdRBox(mb,[X(4.41),cy(4.41,z)+.004,z],[.26,.004,.07],.003,SMC('#2a2b2e',SM.ENGINE),2);
      for(const u of [4.24,4.58]){const ring=[];for(let k=0;k<=24;k++){const a=k/24*TAU;ring.push([X(u),y+Math.sin(a)*(r+.004),z+Math.cos(a)*(r+.004)]);}hdTube(mb,ring,.006,6,SMC('#2a2b2e',SM.ENGINE),true,false);
        hdRBox(mb,[X(u),y+r+.012,z],[.012,.01,.014],.003,SMC('#2a2b2e',SM.ENGINE),1);}},40);}
  /* ---------- the B and C pillars' trims, from the window sill to the headliner ---------- */
  for(const s of [1,-1])for(const [pu,ln,w] of G.pillars)hdPart(out,mb=>{const rows=[],y0=D.belt(pu)+.01,y1=K.topY(pu,.6)-.07;
    for(let k=0;k<=10;k++){const t=k/10,y=y0+(y1-y0)*t,u=pu+ln*t,row=[];for(const [du,dz] of [[-w-.03,.0],[-w-.02,.02],[w+.02,.02],[w+.03,0]])row.push([X(u+du),y,s*(K.sideZ(u+du,Math.min(y,D.Hr-.05))-.03-dz)]);rows.push(row);}
    hdLoft(mb,rows,CHARV,false,s<0);},40);
}
