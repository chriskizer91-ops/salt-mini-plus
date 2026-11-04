/* =====================================================================================
   A CABIN FOR THE OTHER CARS, built the SUV Studio's way (75_cabin), each car saying what its own has. The shell is
   cut open behind each side window (the game's own window outlines, 75_cabin hdSideGlass), so the glass is all there
   is between you and the inside; inside, from the options o:
   - the floor in carpet (the toe board rising to the firewall, the tunnel), the pedals;
   - the door panels on every door (armrest, pull, an insert, a map pocket, a speaker; power-window switches or
     window winders), the quarter trims behind them;
   - the headliner, the visors, the mirror, the dome lamp, grab handles;
   - the dashboard lofted across the cabin with a hood over the gauges; the dials (each with its ring, ticks and
     needle); the centre stack (vents, the radio, the climate knobs); the glove box; the steering wheel on its column,
     its spokes as the car has them, the stalks;
   - the shifter as the car has it: on the column, an automatic's lever in the console, or a manual's knob in a
     gaiter with the handbrake beside it; the console (a big box with its lid and cup holders, or a small tray);
   - the seats: two buckets (plain or with deep side bolsters), the rear bench or two rear seats, their headrests;
   - what is behind the seats: a pickup's cab wall, an SUV's cargo floor, a hatch's parcel shelf; the seat belts.
   ===================================================================================== */
function hdCabinGen(out,car,o){
  const K=HDK,D=K.D,G=D.G,X=K.X,L=D.L,dy=D.dy;
  for(const P of hdSideGlass())for(const s of [1,-1])for(const src of [car.body,car.hood])hdCutSide(src,s,P);
  const C=Object.assign({dash:'#242322',dashTop:'#1d1c1b',vinyl:'#2c2b2a',insert:'#6a645c',head:'#7a746b',carpet:'#2a2826',seat:'#6d675f',seatSide:'#57524b',accent:null},o.col||{});
  const SEAT=SV(lin(C.seat),o.cloth?SM.CLOTH:SM.SEAT),SEATS=SV(lin(C.seatSide),o.cloth?SM.CLOTH:SM.SEAT),CHAR=SV(lin(C.dash),SM.DASH),TOP=SV(lin(C.dashTop),SM.DASH),
    VIN=SV(lin(C.vinyl),SM.VINYL),INS=SV(lin(C.insert),o.cloth?SM.CLOTH:SM.VINYL),HL=SV(lin(C.head),SM.HEADLINER),CARP=SV(lin(C.carpet),SM.CARPET),SAT=HC.SATIN,
    BLK=SV([.012,.012,.013],SM.DASH),ACC=C.accent?SV(lin(C.accent),o.cloth?SM.CLOTH:SM.SEAT):SEATS;
  const yF=o.floorY,u0=G.cowl+.05,uEnd=o.uEnd,zw=u=>K.sideZ(u,Math.min(D.belt(u)-.1,yF+.42))-.05,pil=G.pillars.map(p=>p[0]);
  /* ---------- the floor: carpet from the toe board to the back, the tunnel down the middle ---------- */
  hdPart(out,mb=>{const rows=[];
    for(let u=u0;u<=uEnd+1e-6;u+=.04){const toe=sm01((G.cowl+.34-u)/.28),y=yF+toe*(o.toe||.22),rise=o.rearRise?sm01((u-o.rearRise[0])/.06)*o.rearRise[1]:0,zz=zw(u)-.01,row=[];
      for(let j=0;j<=14;j++){const z=-zz+2*zz*j/14,tun=u<(o.tunnelEnd||pil[0]+.5)?(o.tunnel||.11)*Math.exp(-Math.pow(z/(o.tunnelW||.13),2)):0;row.push([X(u),y+rise+tun,z]);}rows.push(row);}
    hdLoft(mb,rows,CARP,false,true);},40);
  /* ---------- the door panels and the quarter trims, from the floor to the window sill ---------- */
  const uArmEnd=o.doors===2?(D.B.doorR||pil[0]):pil[1]+.1;
  for(const s of [1,-1])hdPart(out,mb=>{const rows=[];
    for(let u=G.cowl+.02;u<=uEnd+.02+1e-6;u+=.025){const yb=yF-.02,yt=D.belt(u)-.035,row=[];
      for(let j=0;j<=10;j++){const t=j/10,y=yb+(yt-yb)*t,arm=.035*Math.exp(-Math.pow((y-(yF+o.armY))/.04,2))*(u<uArmEnd?1:0),zi=K.sideZ(u,Math.min(y,D.belt(u)-.04))-.035-arm-.02*(1-t);row.push([X(u),y,s*zi]);}
      const zt=K.sideZ(u,D.belt(u)-.03);row.push([X(u),D.belt(u)-.005,s*(zt-.03)],[X(u),D.belt(u)+.006,s*(zt-.012)]);rows.push(row);}
    hdLoft(mb,rows,VIN,false,s<0);},40);
  /* each door: an insert, a pull, the armrest's pad, a map pocket, a speaker, and the window's switches or winder */
  const doors=o.doors===2?[[G.cowl+.16,(D.B.doorR||pil[0])-.08]]:[[G.cowl+.16,pil[0]-.06],[pil[0]+.08,pil[1]-.06]];
  const inner=(u,y,d)=>K.sideZ(u,Math.min(y,D.belt(u)-.04))-.055-d;
  for(const s of [1,-1])for(const [a,b] of doors){const ya=yF+o.armY;
    hdPart(out,mb=>{const rows=[];for(let u=a;u<=b+1e-6;u+=.02){const row=[];for(let j=0;j<=4;j++){const y=ya+.04+.15*j/4;row.push([X(u),y,s*(inner(u,y,0)-.004*Math.sin(j/4*PI))]);}rows.push(row);}hdLoft(mb,rows,INS,false,s<0);},40);
    hdPart(out,mb=>{const u=(a+b)/2-.04;hdRBox(mb,[X(u),ya,s*inner(u,ya,.028)],[Math.min(.14,(b-a)/2-.02),.016,.024],.012,VIN,3);
      hdRBox(mb,[X(a+.07),ya+.2,s*inner(a+.07,ya+.2,.004)],[.035,.012,.008],.005,MM.CHROME,2);
      /* the map pocket low on the door, a speaker grille in front of it */
      hdRBox(mb,[X((a+b)/2),yF+.1,s*inner((a+b)/2,yF+.1,.018)],[Math.min(.18,(b-a)/2-.03),.045,.012],.008,VIN,3);
      const us=a+.1,ys=yF+.2,c=[X(us),ys,s*inner(us,ys,-.004)];hdCyl(mb,c,[c[0],c[1],c[2]-s*.006],.065,.064,28,BLK);
      for(let r=.012;r<.06;r+=.012)hdCyl(mb,[c[0],c[1],c[2]-s*.0062],[c[0],c[1],c[2]-s*.0072],r,r,28,SAT,false);
      if(o.winders){const w=[X(b-.12),ya+.08,s*inner(b-.12,ya+.08,.02)];hdCyl(mb,[w[0],w[1],w[2]+s*.015],w,.02,.018,16,SAT);
        hdTube(mb,[w,[w[0]+.05,w[1]-.03,w[2]],[w[0]+.07,w[1]-.04,w[2]-s*.02]],.006,8,SAT,false,true);hdCyl(mb,[w[0]+.07,w[1]-.04,w[2]-s*.02],[w[0]+.07,w[1]-.04,w[2]-s*.05],.009,.009,10,BLK);}
      else for(let q=0;q<(s<0&&a<pil[0]?4:1);q++)hdRBox(mb,[X(u+.05-q*.03),ya+.017,s*inner(u,ya,.04)],[.009,.004,.012],.003,BLK,2);},40);}
  /* ---------- the headliner, from the windshield's header to the back ---------- */
  hdPart(out,mb=>{const rows=[],a=G.rf-.12,b=o.headEnd||G.rr-.04;
    for(let u=a;u<=b+1e-6;u+=.04){const row=[],zm=secKeys(D,u).P[10][0]-.035;for(let j=0;j<=16;j++){const z=-zm+2*zm*j/16,y=K.topY(u,Math.abs(z))-.045-.05*Math.pow(Math.abs(z)/zm,6);row.push([X(u),y,z]);}rows.push(row);}
    hdLoft(mb,rows,HL,false);},40);
  for(const s of [1,-1])hdPart(out,mb=>{const u=G.rf+.03,y=K.topY(u,.35)-.07;hdRBox(mb,[X(u),y,s*.37],[.08,.012,.165],.01,HL,3);},40);
  hdPart(out,mb=>{const u=G.rf+.02,y=K.topY(u,0)-.12;hdRBox(mb,[X(u),y,0],[.012,.028,.11],.012,BLK,3);hdCyl(mb,[X(u)+.01,y+.02,0],[X(u)+.03,y+.075,0],.006,.006,8,BLK);},40);
  hdPart(out,mb=>{const u=G.rf+.012,y=K.topY(u,0)-.12;hdRBox(mb,[X(u)-.0135,y,0],[.001,.024,.105],.001,HC.MIRROR,1);},20);
  hdPart(out,mb=>{const u=(G.rf+(o.headEnd||G.rr))/2,y=K.topY(u,0)-.05;hdRBox(mb,[X(u),y,0],[.07,.008,.1],.006,BLK,2);hdRBox(mb,[X(u),y-.008,0],[.05,.002,.07],.002,HC.LENS,1);},40);
  /* grab handles over the doors (not the driver's) */
  for(const [u,s] of [[(G.cowl+pil[0])/2+.15,1],...(o.doors===4?[[(pil[0]+pil[1])/2,1],[(pil[0]+pil[1])/2,-1]]:[])])hdPart(out,mb=>{const zt=secKeys(D,u).P[10][0]-.06,y=K.topY(u,zt)-.06,pts=[];
    for(let i=0;i<=10;i++){const t=i/10,uu=u-.12+.24*t;pts.push([X(uu),y-.035*Math.sin(t*PI),s*(zt-.03*Math.sin(t*PI))]);}hdTube(mb,pts,.011,8,BLK,false,true);},40);
  /* ---------- the dashboard ---------- */
  const uD=G.cowl,uE=G.cowl+o.dashDepth,yt=o.dashTop,dz=o.driverZ||-.38;
  hdPart(out,mb=>{const rows=[];for(let k=0;k<=44;k++){const z=-.88+1.76*k/44,az=Math.abs(z),zc=Math.min(az,zw(uE)-.01)*Math.sign(z);
      const hood=o.hoodH*Math.exp(-Math.pow((z-dz)/.17,4)),stack=Math.exp(-Math.pow(z/(o.stackW||.2),4));
      const yy=yt+hood,yw=secKeys(D,uD+.06).yG-.01;
      const prof=[[uD+.04,yw],[uD+.22,yy-.01],[uE-.12,yy],[uE-.05,yy-.012-hood*.3],[uE-.02,yy-.06],[uE-.015,yt-.16],[uE-.05-.06*stack,yt-.28],[uE-.1+.18*stack,yt-.42],[uE-.18+.14*stack,yF+.12]];
      rows.push(prof.map(([u,y])=>[X(u),y,zc]));}
    const R=rows[0].map((_,j)=>rows.map(r=>r[j]));hdLoft(mb,R,CHAR,false);},34);
  /* a top pad over it in the darker colour, its edge stitched round */
  hdPart(out,mb=>{const rows=[];for(let k=0;k<=44;k++){const z=-.86+1.72*k/44,zc=Math.min(Math.abs(z),zw(uE)-.02)*Math.sign(z),hood=o.hoodH*Math.exp(-Math.pow((z-dz)/.17,4));
      rows.push([[uD+.25,yt+hood-.006],[uE-.12,yt+hood+.003],[uE-.06,yt+hood-.006]].map(([u,y])=>[X(u),y,zc]));}
    const R=rows[0].map((_,j)=>rows.map(r=>r[j]));hdLoft(mb,R,TOP,false);},34);
  /* the dials under the hood: each a dark face, a chrome ring, ticks and a needle */
  {const u=uE-.09,y=yt-.045;
    hdPart(out,mb=>{hdRBox(mb,[X(u-.02),y,dz],[.012,.062,o.clusterW||.18],.02,BLK,3);},40);
    for(const [ddz,r,dy2] of o.dials||[[-.075,.058,0],[.075,.058,0]]){const M=M4.mul(hdM([X(u)-.008,y+dy2,dz+ddz]),M4RY(-PI/2));
      hdPart(out,mb=>{hdRev(mb,[[0,0],[r,0]],48,HC.GAUGE);hdRev(mb,[[r,0],[r+.004,.006],[r+.006,.004]],48,MM.CHROME);},30,null,M);
      hdPart(out,mb=>{const n=r>.04?10:6;for(let k=0;k<=n;k++){const a=PI*1.25-k/n*PI*1.5,c=Math.cos(a),s2=Math.sin(a);mb.quad([c*r*.8,s2*r*.8-.0012,.0008],[c*r*.92,s2*r*.92-.0012,.0008],[c*r*.92,s2*r*.92+.0012,.0008],[c*r*.8,s2*r*.8+.0012,.0008],lin('#e8e4dc'),.6,MAT.COL);}
        const a=PI*.9;mb.quad([0,-.0015,.002],[Math.cos(a)*r*.85,Math.sin(a)*r*.85-.001,.002],[Math.cos(a)*r*.85,Math.sin(a)*r*.85+.001,.002],[0,.0015,.002],lin(o.needle||'#ff5a1a'),.8,MAT.COL);},20,null,M);}}
  /* the centre stack: vents, the radio, the climate knobs; the glove box */
  {const u=uE-.03;
    for(const zz of o.vents||[-.6,-.12,.12,.6])hdPart(out,mb=>{const yy=yt-.08;hdRBox(mb,[X(u)+.004,yy,zz],[.01,.032,.06],.012,BLK,3);for(let k=-2;k<=2;k++)hdRBox(mb,[X(u)+.012,yy+k*.011,zz],[.004,.002,.052],.0015,SAT,1);},40);
    hdPart(out,mb=>{const yr=yt-.18;hdRBox(mb,[X(u)+.004,yr,0],[.012,.045,.1],.01,BLK,3);hdRBox(mb,[X(u)+.014,yr+.015,0],[.002,.012,.06],.002,SV(lin('#0a1a10'),MAT.COL,.25),1);
      for(const zz of [-.075,.075])hdCyl(mb,[X(u)+.012,yr-.01,zz],[X(u)+.03,yr-.01,zz],.014,.013,20,SAT);
      for(let k=-3;k<=3;k++)hdRBox(mb,[X(u)+.017,yr-.032,k*.016],[.004,.005,.006],.002,SAT,1);},40);
    hdPart(out,mb=>{for(const zz of [-.07,0,.07])hdCyl(mb,[X(u+.04),yt-.26,zz],[X(u+.04)+.02,yt-.26,zz],.016,.015,20,SAT);},40);
    hdPart(out,mb=>{hdRBox(mb,[X(uE-.03)+.002,yt-.18,-dz*1.1],[.002,.06,.2],.004,BLK,2);hdRBox(mb,[X(uE-.03)+.004,yt-.135,-dz*1.1+.15],[.004,.008,.03],.003,SAT,1);},20);
    /* (a truck's: the four-wheel-drive knob by the light switch) */
    if(o.fourKnob)hdPart(out,mb=>{const p=[X(u)+.006,yt-.12,dz-.24];hdCyl(mb,p,[p[0]+.026,p[1],p[2]],.024,.022,24,BLK);hdRBox(mb,[p[0]+.027,p[1],p[2]],[.002,.019,.004],.001,SAT,1);
      hdCyl(mb,[p[0],p[1],p[2]+.08],[p[0]+.02,p[1],p[2]+.08],.02,.019,20,BLK);},40);}
  /* ---------- the steering wheel on its column ---------- */
  {const c=[X(uE+o.wheelU),yt-o.wheelDrop,dz],n=V3.norm([-.9,.44,0]),f=V3.norm([.44,.9,0]),M=M4.basis(c,f,[0,0,-1],n),R=o.wheelR||.19;
    hdPart(out,mb=>{const path=[];for(let k=0;k<=72;k++){const a=k/72*TAU;path.push([Math.cos(a)*R,Math.sin(a)*R,0]);}hdTube(mb,path,o.rimT||.016,14,VIN,true,false);},45,null,M);
    hdPart(out,mb=>{const sp=o.spokes||[PI/2,-PI/2,PI];hdRBox(mb,[0,0,.018],o.hub||[.075,.085,.028],.03,CHAR,4);
      for(const a of sp){const d=[Math.cos(a),Math.sin(a),0];hdTube(mb,[V3.mul(d,.07),V3.add(V3.mul(d,R*.68),[0,0,-.005]),V3.mul(d,R*.95)],o.spokeT||.012,10,o.spokeM||CHAR,false,true);}},40,null,M);
    hdPart(out,mb=>{hdCyl(mb,V3.add(c,V3.mul(n,-.02)),V3.add(c,V3.mul(n,-.3)),.034,.042,18,BLK);
      for(const s2 of [1,-1])hdCyl(mb,V3.add(c,V3.add(V3.mul(n,-.09),[0,0,s2*.03])),V3.add(c,V3.add(V3.mul(n,-.06),[.02,.01,s2*.15])),.006,.006,8,BLK);
      /* a column shifter: its lever out to the right of the column, a knob on its end */
      if(o.shifter==='column'){const a=V3.add(c,V3.add(V3.mul(n,-.12),[0,.02,.035])),b=V3.add(a,[.05,-.03,.2]);hdTube(mb,[a,V3.lerp(a,b,.5),b],.008,10,SAT,false,true);ball(mb,b,.016,14,BLK);}},40);}
  /* the pedals */
  hdPart(out,mb=>{const u=G.cowl+.26,ys=yF+.2+(o.toe||.22)*.4;for(const [z,w,h] of (o.shifter==='manual'?[[dz-.13,.035,.04],[dz+.02,.035,.04],[dz+.13,.025,.06]]:[[dz-.06,.06,.04],[dz+.12,.025,.06]])){
    hdRBox(mb,[X(u),ys,z],[.008,h,w],.006,RUBP,2);hdCyl(mb,[X(u)-.01,ys+h,z],[X(u-.06),ys+.25,z],.006,.006,6,SAT);}},40);
  /* ---------- the console and the shifter ---------- */
  {const a=uE-.02,b=pil[0]+(o.consoleBack||.15);
    if(o.console==='big'){hdPart(out,mb=>{hdRBox(mb,[X((a+b)/2),yF+.15,0],[(b-a)/2,.15,.12],.03,CHAR,4);hdRBox(mb,[X(b-.18),yF+.32,0],[.18,.03,.11],.025,VIN,4);
        for(const zz of [-.05,.05])hdCyl(mb,[X(a+.14),yF+.305,zz],[X(a+.14),yF+.24,zz],.037,.035,24,BLK,false);hdRBox(mb,[X(a+.14),yF+.25,0],[.045,.004,.095],.004,BLK,1);},40);}
    else if(o.console==='small')hdPart(out,mb=>{hdRBox(mb,[X((a+b)/2-.1),yF+.12,0],[(b-a)/2-.1,.1,.1],.03,CHAR,4);},40);
    else if(o.console==='tunnel')hdPart(out,mb=>{const hw=.1,top=yF+(o.consoleTop||.22),tw=o.tunnelW||.13,th=o.tunnel||.11,tun=z=>yF+th*Math.exp(-Math.pow(z/tw,2))-.004,R=[];
      for(let k=0;k<=12;k++){const u=a+(b-.2-a)*k/12,ring=[];for(let j=0;j<=8;j++){const z=-hw+2*hw*j/8;ring.push([X(u),tun(z),z]);}
        for(let j=0;j<=6;j++){const q=j/6*PI/2;ring.push([X(u),top-.03+Math.sin(q)*.03,hw-.03+Math.cos(q)*.03]);}for(let j=0;j<=6;j++){const q=PI/2+j/6*PI/2;ring.push([X(u),top-.03+Math.sin(q)*.03,-hw+.03+Math.cos(q)*.03]);}R.push(ring);}
      hdLoft(mb,R,CHAR,true);hdCap(mb,R[0],CHAR,true);hdCap(mb,R[12],CHAR,false);},40);
    if(o.shifter==='auto')hdPart(out,mb=>{const p=X(a+.25);hdRBox(mb,[p,yF+.3,0],[.06,.006,.04],.004,BLK,1);hdCyl(mb,[p,yF+.3,0],[p,yF+.37,0],.008,.008,10,SAT);ball(mb,[p,yF+.39,0],.026,18,VIN);},40);
    if(o.shifter==='manual'){const p=X(a+.22),yb=yF+.24;
      hdPart(out,mb=>{hdRev(mb,[[.06,0],[.052,.02],[.036,.05],[.022,.08],[.014,.1]],24,SV([.02,.02,.02],MAT.RUBBER));},40,null,M4.mul(M4T(p,yb,0),M4RX(-PI/2)));
      hdPart(out,mb=>{hdCyl(mb,[p,yb+.09,0],[p+.01,yb+.16,0],.008,.008,10,SAT);ball(mb,[p+.012,yb+.18,0],.024,18,o.knob||BLK);},40);
      /* the handbrake beside it: a lever in its boot, the button on its end */
      hdPart(out,mb=>{const q=X(a+.48),zq=.04,yq=yb+.02;hdRev(mb,[[.035,0],[.028,.015],[.02,.03]],16,SV([.02,.02,.02],MAT.RUBBER));},40,null,M4.mul(M4T(X(a+.48),yb+.02,.04),M4RX(-PI/2)));
      hdPart(out,mb=>{const a2=[X(a+.48),yb+.03,.04],b2=[X(a+.32),yb+.09,.04];hdTube(mb,[a2,b2],.016,12,VIN,false,true);hdCyl(mb,b2,[b2[0]+.012,b2[1]+.003,b2[2]],.008,.008,10,SAT);},40);}}
  /* ---------- the seats ---------- */
  const seat=(c,w,recl,head=1,bolst=1)=>{const M=M4T(c[0],c[1],c[2]),bs=bolst===2?1.6:1;
    hdPart(out,mb=>{hdRBox(mb,[.24,.05,0],[.25,.06,w/2-.01],.045,SEAT,5);},40,null,M);
    if(bolst)for(const s2 of [1,-1])hdPart(out,mb=>{hdRBox(mb,[.22,.085+.02*(bs-1),s2*(w/2-.04)],[.22,.05*bs,.045*bs],.04,SEATS,4);},40,null,M);
    hdPart(out,mb=>{hdRBox(mb,[.22,-.07,0],[.22,.07,w/2-.03],.02,CHAR,2);},40,null,M);
    const Mb=M4.mul(M,M4RZ(recl));
    hdPart(out,mb=>{hdRBox(mb,[-.04,.34,0],[.07,.31,w/2-.01],.05,SEAT,5);},40,null,Mb);
    if(bolst)for(const s2 of [1,-1])hdPart(out,mb=>{hdRBox(mb,[-.02,.3,s2*(w/2-.045)],[.075+.03*(bs-1),.27,.05*bs],.045,SEATS,4);},40,null,Mb);
    if(o.seatStripe&&bolst)hdPart(out,mb=>{hdRBox(mb,[.03,.36,0],[.002,.22,w/2-.12],.002,ACC,1);},40,null,Mb);
    const hs=head===1?[0]:head===3?[-w/3,0,w/3]:head===2?[-w/4,w/4]:[];
    for(const hz of hs){hdPart(out,mb=>{hdRBox(mb,[-.05,.75,hz],[.05,.095,head===1?.13:.12],.04,SEAT,4);},40,null,Mb);
      hdPart(out,mb=>{for(const s2 of [1,-1])hdCyl(mb,[-.05,.62,hz+s2*.07],[-.05,.68,hz+s2*.07],.006,.006,8,MM.CHROME);},40,null,Mb);}};
  for(const s of [1,-1])seat([X(o.seatF),yF+o.seatY,s*(o.seatZ||.38)],o.seatW||.5,.3,1,o.bolster||1);
  /* (the rear seat's height: o.seatYR, under a low roof; otherwise a little below the front's. o.rearHead 0: a bench
     without headrests) */
  if(o.rear==='bench')seat([X(o.seatR),yF+(o.seatYR!=null?o.seatYR:o.seatY-.03),0],o.rearW||1.42,.2,o.rearHead!=null?o.rearHead:3,0);
  else if(o.rear==='two')for(const s of [1,-1])seat([X(o.seatR),yF+o.seatY-.05,s*.33],.48,.22,1,1);
  /* the belts: webbing down from each pillar's top past the seat */
  for(const s of [1,-1])for(const u of o.doors===4?[pil[0],pil[1]]:[o.beltU||pil[0]])hdPart(out,mb=>{const zt=secKeys(D,u).P[10][0]-.05,yt2=K.topY(u,zt)-.12;
    const pts=[[X(u)+.02,yt2,s*(zt-.02)],[X(u)+.05,yF+.62,s*(zt-.1)],[X(u)+.09,yF+.36,s*(zt-.12)]];hdSweep(mb,pts,[[-.024,-.0012],[.024,-.0012],[.024,.0012],[-.024,.0012]],SV(lin('#1a1a1b'),MAT.FABRIC),[0,0,1],true,true);
    hdRBox(mb,[X(u)+.02,yt2+.01,s*(zt-.02)],[.02,.03,.012],.006,BLK,2);},40);
  /* ---------- behind the seats ---------- */
  if(o.back==='cab'){
    /* a pickup's cab wall: a trim panel from the floor to the rear window, the rear window's frame */
    const u=uEnd+.015;hdPart(out,mb=>{const rows=[];for(let k=0;k<=24;k++){const z=-1+2*k/24,row=[];for(let j=0;j<=6;j++){const y=yF-.02+(D.belt(u)-.01-yF+.02)*j/6,zz=Math.min(Math.abs(z),K.sideZ(u,y)-.05)*Math.sign(z);row.push([X(u),y,zz]);}rows.push(row);}hdLoft(mb,rows,VIN,false);},40);}
  if(o.back==='parcel'){const a=o.parcel[0],b=o.parcel[1],y=o.parcel[2];hdPart(out,mb=>{const rows=[];for(let u=a;u<=b+1e-6;u+=.04){const zz=K.sideZ(u,y)-.04,row=[];for(let j=0;j<=12;j++){const z=-zz+2*zz*j/12;row.push([X(u),y,z]);}rows.push(row);}hdLoft(mb,rows,CHAR,false,true);},40);}
}
const RUBP=SV([.025,.025,.026],MAT.RUBBER);
