/* =====================================================================================
   THE SUV STOCK'S ENGINE BAY, ITS OWN (Studio 2, in place of the game's small one): the factory 4.6 three-valve V8
   (the game's v46, 16_engines; its colours, 31_engine_bay BAYLOOK: a dark grey block, black covers), set where the
   game sets it, back against the firewall, its crank 58 cm up. Laid out round the deeper wheel houses and the
   frame below (91_under), and drawn all the time: whatever reaches down out of it meets the underside.
   - The bay: the aprons with a rolled flange, the tubs over the wheel houses with their inner walls standing on the
     frame, the coilovers' top mounts, the firewall down to the toe board with the tunnel's mouth open, its
     insulation, the cowl's vented tray; the harness along the aprons and the firewall.
   - The front: the radiator support, its latch and prop rod, the condenser, the radiator with its tanks, the deep
     shroud back to the engine-driven fan on its viscous clutch; the hoses; the condenser's lines.
   - Furniture: the battery in its tray with the hold-down and its cables, the fuse box, the coolant bottle, the
     washer bottle low in the corner, the airbox behind the grille with the tube to the throttle body, the brake
     booster and master cylinder, the ABS unit and its lines, the engine computer on the firewall.
   - The engine: a sump shallow over the front differential and deep behind the axle, the block, the heads, black
     cam covers with a coil on every plug and their looms, the composite intake with its eight runners, the fuel
     rails, the electronic throttle body, cast iron manifolds down to the underside's flanges under their shields,
     the front's belt round the damper, water pump, alternator, power steering pump and compressor, the tensioner,
     the thermostat's housing and the hoses, the starter, the oil filter, the engine's mounts on the rails, the oil
     filler and the dipstick.
   - Under the hood: the insulation pad and the hood's pressed inner frame, the latch's striker (these lift with it).
   ===================================================================================== */
function suvBay2(car,o={}){
  const K=HDK,D=K.D,b=car.b,lk=b.look,X=K.X,topY=D.topY,H=D.hood,hz=H.hz,LY=suvLay(car,o),dy=LY.dy,yb=LY.yb;
  const st=new MB(),en=new MB(),ln=new MB(),PAINT=SV([1,1,1],MAT.PAINT),LIN=HC.LINER,DARK=SMC('#161618',SM.ENGINE),ALU=SMC('#8a8d92',SM.ENGINE),CASTA=SMC('#a3a6ab',SM.CAST),
    IRON=SMC('#4a433c',SM.CAST),HOSE=SMC('#141414',SM.HOSE),PL=HC.PLASTIC,BLKP=SMC('#0f0f10',SM.PLASTIC),LINE=SMC('#c0c2c5',SM.BOLT),BOLT=HC.BOLT,
    YEL=SMC('#d6b21a',SM.PLASTIC),WHT=SMC('#d4d0c4',SM.PLASTIC),RED=SMC('#b0201c',SM.PLASTIC),SHIELD=SMC('#c4c4c0',SM.BRUSH),FRAME=SMC('#222326',SM.PAINTED);
  const E0=o.engine||{},BL={block:E0.block||'#2b2c2f',cover:E0.cover||'#1b1c1e',head:E0.head||'#3a3c40'};
  const uF=H.u0+.09,uR=H.u1-.02,edge=u=>topY(u,hz(u)),Pt=(u,y,z)=>[X(u),y,z],zin=o.zin||.48,TT=!!E0.turbo,SS=SMC('#b3aea4',SM.SATIN),SSB=SMC('#8d7a66',SM.SATIN);
  const P=(f,deg=32)=>hdPart(st,f,deg);
  /* ---------- the engine, placed as the game places it (31_engine_bay): back against the firewall ---------- */
  /* (o.engine: layout 'V8' or 'V6' (sixty degrees between its banks), turbo (two, low by the banks, headers into them,
     a front-mounted intercooler), ram (a box under the hood's scoop feeding them), efans (two electric fans in place
     of the engine's own), nos (a plate under the throttle body, its solenoids), coverPaint (red crinkle covers)) */
  const V6=E0.layout==='V6',np=V6?3:4,len=np*.095+.14,hx=len/2,uc=Math.max(uF+.27,uR-.12-len)+hx,yC=LY.crankY;
  const EM=M4.basis([X(uc),yC,0],[1,0,0],[0,1,0],[0,0,1]),Ew=p=>M4.xform(EM,p),Q=(f,deg=32)=>hdPart(en,f,deg,null,EM),Eo=(f,deg=32)=>hdPart(en,f,deg);
  const xs=k=>-hx+.07+(k+.5)*(len-.14)/np,ang=V6?PI/3:PI/2,ex=[];
  /* (a bank's frame: d up the bank, az across it, out of the vee) */
  const bank=s=>{const a=ang/2,d=[0,Math.cos(a),s*Math.sin(a)],az=V3.norm([0,-d[2],d[1]]),out=V3.mul(az,s);return {d,az,out,P:(t,oo)=>V3.add(V3.mul(d,t),V3.mul(out,oo))};};

  /* ================= the bay ================= */
  /* the wheel houses' tops (over the liners, hdArches zi), the tubs' inner walls down to the frame */
  const tubY=u=>{const a=archY(D,u);return a<0?-1:a+.035;},railTop=u=>suvRailY(u)+dy+suvRailH(u);
  const N=48;
  for(const s of [1,-1]){
    /* the apron: from the tub (or, ahead of the wheel, the bumper's height) up to a flange under the hood's edge */
    P(mb=>{for(let k=0;k<N;k++){const ua=uF+(uR-uF)*k/N,ub=uF+(uR-uF)*(k+1)/N,za=s*(hz(ua)-.005),zb=s*(hz(ub)-.005);
      const la=Math.max(yb(.56),tubY(ua)),lb=Math.max(yb(.56),tubY(ub));
      mb.quad([X(ua),la,za],[X(ub),lb,zb],[X(ub),edge(ub)-.03,zb],[X(ua),edge(ua)-.03,za],PAINT[0],0,PAINT[2]);
      mb.quad([X(ua),edge(ua)-.03,za],[X(ub),edge(ub)-.03,zb],[X(ub),edge(ub)-.016,zb+s*.012],[X(ua),edge(ua)-.016,za+s*.012],PAINT[0],0,PAINT[2]);}});
    /* the tub over the wheel house, in to its inner wall, and the wall down to the frame's rail */
    P(mb=>{const rows=[];for(let k=0;k<=N;k++){const u=uF+(uR-uF)*k/N,t=tubY(u);if(t<0){rows.push(null);continue;}const zA=hz(u)-.005,row=[];
      for(let j=0;j<=8;j++){const f=j/8,z=zA+(zin-zA)*f;row.push([X(u),t+.006*Math.sin(f*PI),s*z]);}row.push([X(u),Math.min(t,Math.max(railTop(u),yb(.3))),s*zin]);rows.push(row);}
      for(let k=0;k<rows.length-1;k++){const A=rows[k],B=rows[k+1];if(!A||!B)continue;for(let j=0;j<A.length-1;j++)mb.quad(A[j],B[j],B[j+1],A[j+1],LIN[0],0,LIN[2]);}});
    /* ahead of the wheel and behind it, the apron's foot turned in to the frame */
    for(const [ua,ub] of [[uF,D.uFa-D.arch.a],[D.uFa+D.arch.a,uR]])P(mb=>{const rows=[];for(let u=ua;u<=ub+1e-6;u+=(ub-ua)/6){const y0=Math.max(yb(.56),tubY(u));rows.push([[X(u),y0,s*(hz(u)-.005)],[X(u),y0,s*(zin+.02)],[X(u),railTop(u)+.01,s*(zin-.02)]]);}
      for(let k=0;k<rows.length-1;k++)for(let j=0;j<2;j++)mb.quad(rows[k][j],rows[k+1][j],rows[k+1][j+1],rows[k][j+1],LIN[0],0,LIN[2]);});
    /* the coilover's top mount on the tub: a plate, three studs and nuts, the shaft's nut under its rubber cap */
    {const u=.935,z=s*.565,y=tubY(u)+.006,c=[X(u),y,z];
      P(mb=>{hdCyl(mb,c,V3.add(c,[0,.004,0]),.058,.056,28,SMC('#2a2b2e',SM.ENGINE));for(let q=0;q<3;q++){const a=q/3*TAU+.3;hdCyl(mb,V3.add(c,[Math.cos(a)*.044,.004,Math.sin(a)*.044]),V3.add(c,[Math.cos(a)*.044,.018,Math.sin(a)*.044]),.006,.006,6,BOLT);
          cpHex(mb,V3.add(c,[Math.cos(a)*.044,.004,Math.sin(a)*.044]),[0,1,0],.009,.008);}
        hdCyl(mb,V3.add(c,[0,.004,0]),V3.add(c,[0,.03,0]),.022,.018,20,SV([.02,.02,.021],MAT.RUBBER));},30);}
    /* the harness along the apron's top, clipped down */
    P(mb=>{const pts=[];for(let k=0;k<=14;k++){const u=uF+.12+(uR-uF-.22)*k/14;pts.push([X(u),edge(u)-.065,s*(hz(u)-.04)]);}hdTube(mb,pts,.011,8,HOSE,false,true);
      for(let k=1;k<14;k+=3)hdRBox(mb,pts[k],[.008,.016,.016],.004,BLKP,2);});}

  /* ---------- the firewall, down to the toe board (open round the tunnel's mouth), its pad, the cowl's tray ---------- */
  {const z=hz(uR)-.005,x=X(uR),ym=edge(uR)-.02,FAB=SMC('#1d1d20',MAT.FABRIC),nz=40,foot=zz=>suvPanY(uR,zz,dy);
    P(mb=>{for(let k=0;k<nz;k++){const za=-z+2*z*k/nz,zb=-z+2*z*(k+1)/nz;mb.quad([x,foot(za),za],[x,foot(zb),zb],[x,ym-.2,zb],[x,ym-.2,za],PAINT[0],0,PAINT[2]);}});
    P(mb=>{const n2=20;for(let k=0;k<n2;k++){const za=-z+2*z*k/n2,zb=-z+2*z*(k+1)/n2,ba=.006*Math.sin(k*1.7);mb.quad([x+.004,ym-.2,za],[x+.004,ym-.2,zb],[x+.012+ba,ym,zb],[x+.012+ba,ym,za],FAB[0],0,FAB[2]);}});
    const y=ym+.005,xc=X(H.u1+.03);P(mb=>{const n3=40;for(let k=0;k<n3;k++){const za=-z+2*z*k/n3,zb=-z+2*z*(k+1)/n3,slot=k%3===1&&Math.abs(za)<z*.85;
      mb.quad([x,y,za],[x,y,zb],[xc,y+.012,zb],[xc,y+.012,za],(slot?HC.GB:PL)[0],0,(slot?HC.GB:PL)[2]);}});
    /* the harness across the firewall, the bulkhead's grommets where it and the heater hoses go through */
    P(mb=>{const pts=[];for(let k=0;k<=16;k++){const zz=-z*.85+1.7*z*k/16;pts.push([x+.03,ym-.12+.01*Math.sin(k),zz]);}hdTube(mb,pts,.013,8,HOSE,false,true);
      for(const zz of [-.3,.34])hdCyl(mb,[x+.002,ym-.12,zz],[x+.03,ym-.12,zz],.03,.024,18,BLKP);for(let k=2;k<16;k+=4)hdRBox(mb,pts[k],[.016,.008,.016],.004,BLKP,2);});}

  /* ================= the front ================= */
  const uRad=uF+.07,yrT=edge(uF)-.11,yrB=yb(.5),yr=(yrT+yrB)/2,hr=(yrT-yrB)/2,zr=o.zr||Math.min(.62,hz(uF)-.12);
  /* the radiator support: a black frame round the radiator, its top bar under the hood's front with the latch */
  P(mb=>{hdRBox(mb,[X(uF-.01),edge(uF)-.05,0],[.03,.025,hz(uF)-.02],.008,BLKP,2);for(const s of [1,-1])hdRBox(mb,[X(uF-.01),yr,s*(zr+.07)],[.025,hr+.05,.022],.006,BLKP,2);
    hdRBox(mb,[X(uF-.01),yrB-.03,0],[.03,.02,zr+.09],.006,BLKP,2);
    hdRBox(mb,[X(uF)+.03,edge(uF)-.045,0],[.012,.03,.035],.004,HC.CAST,2);hdCyl(mb,[X(uF)+.04,edge(uF)-.02,0],[X(uF)+.04,edge(uF)-.005,0],.006,.006,8,BOLT);
    hdRBox(mb,[X(uF)-.041,edge(uF)-.05,.15],[.001,.014,.04],.001,SMC('#e8e2c8',SM.PLASTIC),1);hdRBox(mb,[X(uF)-.0415,edge(uF)-.05,.12],[.0008,.009,.008],.0008,YEL,1);
    for(const s of [1,-1])hdRBox(mb,[X(uF-.01),yrB-.03,s*(zr+.09)],[.03,.04,.03],.006,BLKP,2);},28);
  /* the condenser and the radiator (plastic tanks either side of a finned core, its cap), the core's fins */
  P(mb=>{hdRBox(mb,[X(uRad-.025),yr+.01,0],[.008,hr-.02,zr-.04],.003,SMC('#1e1f21',SM.ENGINE),1);for(let y=yrB+.03;y<yrT-.03;y+=.016)hdRBox(mb,[X(uRad-.025)+.0085,y,0],[.0015,.002,zr-.05],.001,SMC('#2c2d2f',SM.ENGINE),1);
    for(const s of [1,-1])hdRBox(mb,[X(uRad),yr,s*(zr+.025)],[.03,hr+.012,.025],.01,BLKP,3);
    hdRBox(mb,[X(uRad),yr,0],[.016,hr,zr],.003,SMC('#262728',SM.ENGINE),1);
    hdCyl(mb,[X(uRad),yrT+.012,zr*.7],[X(uRad),yrT+.045,zr*.7],.024,.022,18,MM.CHROME);},28);
  P(mb=>{for(let y=yrB+.012;y<yrT-.008;y+=.012)hdRBox(mb,[X(uRad)+.017,y,0],[.002,.0025,zr-.005],.001,SMC('#3a3b3d',SM.ENGINE),1);},20);
  /* the fan: on the water pump's shaft, its viscous clutch, seven curved blades, in a deep shroud from the radiator */
  if(E0.efans)for(const s of [1,-1]){const c=[X(uRad+.065),yr,s*zr*.5],R=Math.min(hr,zr*.5)*.9;
    P(mb=>{hdCyl(mb,c,[c[0]-.035,c[1],c[2]],R+.012,R+.012,32,BLKP,false);hdCyl(mb,[c[0]-.035,c[1],c[2]],[c[0]-.062,c[1],c[2]],R*.3,R*.3,20,BLKP);
      for(let q=0;q<7;q++){const a=q/7*TAU;hdRBox(mb,[c[0]-.02,c[1]+Math.cos(a)*R*.62,c[2]+Math.sin(a)*R*.62],[.004,R*.32,.03],.004,BLKP,1);}
      for(let q=0;q<4;q++){const a=q/4*TAU+PI/4;hdRBox(mb,[c[0]-.045,c[1]+Math.cos(a)*R*.62,c[2]+Math.sin(a)*R*.62],[.004,R*.36,.006],.003,BLKP,1);}
      hdTube(mb,[[c[0]-.06,c[1]-R*.3,c[2]],[c[0]-.09,c[1]-R*.6,c[2]+s*.05],[X(uRad+.2),yrB+.06,s*.1]],.005,6,HOSE,false,true);},30);}
  if(E0.efans)P(mb=>{const sh=hdRRect(zr,hr,.06,6);hdLoft(mb,[sh.map(([a,bb])=>[X(uRad+.03),yr+bb,a]),sh.map(([a,bb])=>[X(uRad+.04),yr+bb*.98,a*.98])],BLKP,true);},30);
  else{const fc=Ew([hx+.13,.17,0]),uFan=uc-(hx+.13),Rf=Math.min(.22,hr*.95);
    /* (the shroud: a box on the radiator's back, closed but for the ring round the fan; the ring a short drum over
       the blades' tips, on four struts back from the box) */
    P(mb=>{const sh=hdRRect(zr,hr,.06,6),n=sh.length,ring=[];for(let k=0;k<n;k++){const a=Math.atan2(sh[k][1],sh[k][0]);ring.push([Math.cos(a)*(Rf+.03),Math.sin(a)*(Rf+.03)]);}
      const xb=X(uRad+.06),xa=X(uRad+.03),fz=0,fy=fc[1];
      hdLoft(mb,[sh.map(([a,bb])=>[xa,yr+bb,a]),sh.map(([a,bb])=>[xb,yr+bb,a])],BLKP,true);
      hdLoft(mb,[sh.map(([a,bb])=>[xb,yr+bb,a]),ring.map(([a,bb])=>[xb,fy+bb,fz+a])],BLKP,true);
      const dr=[];for(let k=0;k<=40;k++){const a=k/40*TAU;dr.push([Math.cos(a)*(Rf+.025),Math.sin(a)*(Rf+.025)]);}
      hdLoft(mb,[dr.map(([a,bb])=>[X(uFan-.05),fy+bb,a]),dr.map(([a,bb])=>[X(uFan+.03),fy+bb,a])],BLKP,true);
      for(let q=0;q<4;q++){const a=q/4*TAU+PI/4;hdCyl(mb,[xb,fy+Math.sin(a)*(Rf+.03),Math.cos(a)*(Rf+.03)],[X(uFan-.05),fy+Math.sin(a)*(Rf+.025),Math.cos(a)*(Rf+.025)],.008,.008,8,BLKP);}},30);
    hdPart(en,mb=>{hdCyl(mb,[fc[0]-.015,fc[1],0],[fc[0]+.06,fc[1],0],.075,.07,32,CASTA);for(let k=0;k<12;k++){const a=k/12*TAU;hdRBox(mb,[fc[0]+.02,fc[1]+Math.cos(a)*.072,Math.sin(a)*.072],[.03,.003,.006],.002,CASTA,1);}
      },28);
    for(let k=0;k<7;k++){const a=k/7*TAU,c=Math.cos(a),s2=Math.sin(a),r0=.08,r1=Rf,q=[[c*r0,s2*r0],[c*r1-s2*.04,s2*r1+c*.04],[c*r1+s2*.05,s2*r1-c*.05],[c*r0+s2*.03,s2*r0-c*.03]];
      hdPart(en,mb=>{hdExtrude(mb,q,-.006,.006,BLKP,.002,1,true);},28,null,M4.basis([fc[0]-.025,fc[1],0],[0,0,1],[0,1,0],[1,0,0]));}}
  /* the hoses: top from the thermostat to the radiator's right tank, bottom from its left tank to the water pump */
  {const th=Ew([hx+.04,.3,.06]),wp=Ew([hx+.05,.1,-.08]),yu=Math.min(yrT-.04,th[1]+.02);
    P(mb=>{const top=[[X(uRad+.02),yrT-.05,zr*.75],[X(uRad+.12),yu+.02,zr*.72],[th[0]+.14,yu,zr*.35],th],bot=[[X(uRad+.02),yrB+.05,-zr*.75],[X(uRad+.15),yrB+.04,-zr*.7],[wp[0]+.12,yrB+.05,-zr*.35],wp];
      hdTube(mb,suvPath(top,4,1),.022,12,HOSE,false,true);hdTube(mb,suvPath(bot,4,1),.024,12,HOSE,false,true);
      for(const pth of [top,bot])for(const p of [pth[0],pth[pth.length-1]]){const q=V3.lerp(p,pth[pth[0]===p?1:pth.length-2],.12);hdCyl(mb,V3.add(q,[.006,0,0]),V3.add(q,[-.006,0,0]),.027,.027,14,BOLT);}});
    /* the condenser's lines back to the compressor, the gearbox cooler's into the radiator's left tank */
    const comp=Ew([hx-.02,-.02,-.2]);P(mb=>{hdTube(mb,suvPath([V3.add(comp,[.02,.06,-.05]),Pt(.6,yb(.56),-.5),Pt(.4,yb(.62),-.58),[X(uRad-.025),yrT-.08,-(zr-.06)]],4,1),.009,10,ALU,false,true);
      hdTube(mb,suvPath([V3.add(comp,[-.03,.07,-.06]),Pt(.9,yb(.72),-.42),Pt(1.25,edge(1.25)-.2,-.5),Pt(uR-.02,edge(uR)-.25,-.42)],4,1),.007,10,ALU,false,true);},35);}

  /* ================= the furniture ================= */
  /* the battery in its tray in the left front corner, the hold-down, the cables (the red one to the fuse box) */
  {const c=Pt(.72,tubY(.72)+.105,-.66);
    P(mb=>{hdRBox(mb,V3.add(c,[0,-.098,0]),[.135,.01,.1],.004,BLKP,2);hdRBox(mb,c,[.125,.088,.088],.006,SMC('#1c1d1f',SM.PLASTIC),3);hdRBox(mb,V3.add(c,[0,.09,0]),[.122,.004,.085],.004,SMC('#2a2b2d',SM.PLASTIC),2);
      for(const du of [-.08,.08])hdCyl(mb,V3.add(c,[du,.093,.05]),V3.add(c,[du,.112,.05]),.01,.009,14,SMC('#9a8a60',SM.CAST));
      hdRBox(mb,V3.add(c,[-.08,.105,.05]),[.016,.012,.014],.004,RED,2);hdRBox(mb,V3.add(c,[.08,.105,.05]),[.016,.012,.014],.004,BLKP,2);
      hdRBox(mb,V3.add(c,[0,.096,-.02]),[.004,.006,.09],.002,BOLT,1);for(const s2 of [1,-1])hdCyl(mb,V3.add(c,[0,.096,-.02+s2*.09]),V3.add(c,[0,-.1,-.02+s2*.1]),.003,.003,6,BOLT);
      hdTube(mb,suvPath([V3.add(c,[-.08,.12,.05]),V3.add(c,[-.16,.14,.06]),Pt(.98,tubY(.98)+.12,-.62)],4,1),.008,8,RED,false,true);
      hdTube(mb,suvPath([V3.add(c,[.08,.12,.05]),V3.add(c,[.14,.1,.12]),Pt(.7,yb(.82),-.42),Ew([.2,.05,-.21])],4,1),.008,8,HOSE,false,true);
      hdRBox(mb,V3.add(c,[.061,0,-.089]),[.03,.025,.001],.001,SMC('#e8e2c8',SM.PLASTIC),1);},30);}
  /* the fuse box on the left tub, its lid's latches */
  {const c=Pt(.98,tubY(.98)+.055,-.66);P(mb=>{hdRBox(mb,c,[.11,.05,.06],.012,BLKP,3);hdRBox(mb,V3.add(c,[0,.052,0]),[.112,.006,.062],.01,BLKP,2);
    for(const du of [-.08,.08])hdRBox(mb,V3.add(c,[du,.03,.062]),[.012,.012,.004],.002,BLKP,1);hdRBox(mb,V3.add(c,[0,.058,0]),[.04,.0008,.02],.0008,SMC('#e8e2c8',SM.PLASTIC),1);},30);}
  /* the coolant bottle on the right tub, its cap and the hoses; the washer bottle low in the left corner, its neck up */
  {const c=Pt(.76,tubY(.76)+.07,.64);P(mb=>{hdRBox(mb,c,[.09,.07,.06],.025,WHT,4);hdCyl(mb,V3.add(c,[.02,.07,0]),V3.add(c,[.02,.095,0]),.028,.026,20,SMC('#1b1b1c',SM.PLASTIC));
    for(const yy of [-.02,.02])hdRBox(mb,V3.add(c,[.091,yy,0]),[.001,.0012,.03],.0005,BLKP,1);
    hdTube(mb,suvPath([V3.add(c,[-.09,-.05,-.02]),Pt(.95,yb(.86),.5),Ew([hx-.02,.33,.1])],4,1),.008,8,HOSE,false,true);});}
  {const c=Pt(.4,yb(.62),-.72);P(mb=>{hdRBox(mb,c,[.07,.07,.06],.02,SMC('#cfd2d4',SM.PLASTIC),4);hdCyl(mb,V3.add(c,[-.01,.07,0]),Pt(.4,yb(.98),-.72),.018,.018,14,SMC('#cfd2d4',SM.PLASTIC));
    hdCyl(mb,Pt(.4,yb(.98),-.72),Pt(.4,yb(1.0),-.72),.024,.022,16,SMC('#1d5fb0',SM.PLASTIC));});}
  /* the airbox behind the grille on the right, its lid's clips, the tube with its sensor to the throttle body */
  if(!TT&&!E0.carb){const box=Pt(.5,yb(.86),.66),tb=Ew([hx+.02,.405,0]);
    P(mb=>{hdRBox(mb,box,[.1,.07,.1],.02,BLKP,4);hdRBox(mb,V3.add(box,[0,.071,0]),[.098,.004,.098],.012,SMC('#18181a',SM.PLASTIC),3);
      for(const [du,dz] of [[-.08,.1],[.08,.1],[-.08,-.1],[.08,-.1]])hdRBox(mb,V3.add(box,[du,.05,dz*1.02]),[.008,.018,.004],.002,HC.CAST,1);
      hdTube(mb,[Pt(.41,yb(.85),.7),Pt(.3,yb(.87),.72),Pt(.25,yb(.9),.72)],.035,16,BLKP,false,true);},32);
    P(mb=>{const pts=[Pt(.55,yb(.94),.58),Pt(.62,yb(1.01),.36),Pt(.69,yb(1.0),.12),[tb[0]+.05,tb[1]+.005,tb[2]],tb],R=suvPath(pts,4,1);
      hdTube(mb,R,.042,18,HOSE,false,true);for(const t of [.06,.94]){const p=R[Math.round(t*(R.length-1))];hdCyl(mb,V3.add(p,[.005,0,0]),V3.add(p,[-.005,0,0]),.046,.046,18,BOLT);}
      for(let k=3;k<R.length-3;k+=2){const p=R[k];hdCyl(mb,V3.add(p,[.004,0,0]),V3.add(p,[-.004,0,0]),.0445,.0445,18,HOSE);}
      const m=R[Math.round(R.length*.3)];hdRBox(mb,V3.add(m,[0,.045,0]),[.018,.01,.022],.004,BLKP,2);hdTube(mb,[V3.add(m,[0,.055,0]),V3.add(m,[.05,.07,.05]),Pt(.9,yb(1.02),.12)],.003,6,HOSE,false,false);},40);}
  /* the brake booster and master cylinder on the left of the firewall, the ABS unit on the left tub behind the wheel,
     their hard lines */
  {const u=uR-.13,z=-.44,y=edge(u)-.24,x=X(uR);
    hdPart(st,mb=>{hdRev(mb,[[0,0],[.13,0],[.145,.02],[.145,.08],[.13,.1],[0,.105]],40,BLKP);},30,null,M4.mul(M4T(x,y,z),M4RZ(-PI/2)));
    P(mb=>{hdCyl(mb,[x+.105,y,z],[x+.3,y,z],.033,.033,16,ALU);hdRBox(mb,[x+.21,y+.065,z],[.055,.032,.04],.008,SMC('#cfc8b8',SM.PLASTIC),3);
      hdCyl(mb,[x+.21,y+.097,z],[x+.21,y+.115,z],.022,.022,16,YEL);for(const s2 of [1,-1])cpHex(mb,[x+.11,y+s2*.05,z+s2*.05],[1,0,0],.01,.008);});
    const ab=Pt(1.24,tubY(1.24)+.06,-.64);
    P(mb=>{hdRBox(mb,ab,[.05,.045,.045],.006,CASTA,2);hdRBox(mb,V3.add(ab,[0,-.005,.05]),[.055,.05,.012],.008,BLKP,2);hdRBox(mb,V3.add(ab,[-.02,0,.068]),[.022,.016,.008],.004,SMC('#202022',SM.PLASTIC),1);
      for(let k=0;k<6;k++)cpHex(mb,V3.add(ab,[-.035+k*.014,.045,-.03]),[0,1,0],.0055,.004);
      for(let k=0;k<6;k++){const s0=V3.add(ab,[-.035+k*.014,.053,-.03]),e=k<2?[x+.25+k*.04,y+.02,z+.03]:k<4?Pt(1.0+k*.05,tubY(1.1)+.03,-.5):Pt(uR-.01,edge(uR)-.3,-.2-k*.03);
        hdTube(mb,[s0,V3.add(s0,[0,.03,0]),[(s0[0]+e[0])/2,Math.max(s0[1],e[1])+.04,(s0[2]+e[2])/2],e],.0028,6,LINE,false,true);}},40);}
  /* the engine computer on the firewall's right, its two plugs and the loom */
  {const c=Pt(uR-.03,edge(uR)-.22,.56);P(mb=>{hdRBox(mb,c,[.02,.085,.11],.006,CASTA,2);for(let k=-4;k<=4;k++)hdRBox(mb,V3.add(c,[-.021,0,k*.022]),[.002,.075,.003],.001,CASTA,1);
    for(const dz of [-.04,.05])hdRBox(mb,V3.add(c,[-.02,-.09,dz]),[.014,.014,.025],.004,BLKP,2);hdTube(mb,suvPath([V3.add(c,[-.02,-.1,0]),Pt(uR-.1,edge(uR)-.36,.45),Ew([-hx+.06,.38,.12])],4,1),.012,8,HOSE,false,true);});}
  /* the prop rod, folded along the radiator support */
  P(mb=>{const a=[X(uF)-.015,edge(uF)-.05,-(hz(uF)-.14)],bb=[X(uF)-.015,edge(uF)-.05,hz(uF)-.32];hdCyl(mb,a,bb,.005,.005,8,SMC('#2a2a2c',SM.ENGINE));hdCyl(mb,a,V3.add(a,[0,-.03,0]),.007,.007,8,BLKP);});

  /* ================= the engine ================= */
  const BLK=SMC(BL.block,SM.ENGINE),HEAD=SMC(BL.head,SM.ENGINE),COV=E0.polish?SMC(BL.cover,SM.BRUSH):E0.coverPaint?SMC(BL.cover,SM.PAINTED):SMC(BL.cover,SM.PLASTIC);
  /* the sump: cast, shallow over the front differential and the right shaft, deep behind the axle; its ribs, the drain
     plug, the bolts round its rail */
  Q(mb=>{const xf=-.06,y0=-.035,yF=yb(.512)-yC,yS=yb(.345)-yC;
    const rings=[];for(let k=0;k<=16;k++){const t=k/16,x=-hx+.02+(len-.04)*t,deep=sm01((xf-x)/.06);const yy=lerp(yF,yS,deep),w=lerp(.19,.165,deep);
      rings.push(hdRRect(w,(y0-yy)/2,.03,5).map(([z,y])=>[x,(y0+yy)/2+y,z]));}hdLoft(mb,rings,CASTA,true);hdCap(mb,rings[0],CASTA,true);hdCap(mb,rings[16],CASTA,false);
    for(let k=0;k<5;k++)hdRBox(mb,[-hx+.06+k*.035,yS+.004,0],[.004,.006,.14],.002,CASTA,1);cpHex(mb,[-hx+.12,yS-.001,.08],[0,-1,0],.012,.006);
    for(let k=0;k<14;k++){const x=-hx+.03+(len-.06)*(k/13);for(const e of [-1,1])cpHex(mb,[x,y0-.002,e*.196],[0,-1,0],.005,.004);}},30);
  /* (the intake's own colour: the composite's black, or cast aluminium on a built engine) */
  const PLN=TT?SMC('#9a9da2',SM.CAST):COV;
  /* the bottom end, the block's banks, the heads */
  Q(mb=>{hdRBox(mb,[0,.0,0],[hx,.05,.2],.015,BLK,3);});
  for(const s of [1,-1]){const B=bank(s);
    Q(mb=>{obox(mb,B.P(.15,0),[1,0,0],B.d,B.az,[hx,.1,.12],BLK);obox(mb,B.P(.29,0),[1,0,0],B.d,B.az,[hx-.02,.04,.118],HEAD);
      for(let k=0;k<6;k++)cpHex(mb,V3.add(B.P(.25,s*-.118),[-hx+.05+k*(len-.1)/5,0,0]),B.out,.006,.005);},30);
    /* the cam cover: black, rounded, its ribs and bolts round the edge; a coil on every plug, its plug and loom */
    Q(mb=>{rbox(mb,B.P(.37,0),[1,0,0],B.d,B.az,[hx-.035,.042,.105],COV,.28,20,8);
      for(let k=0;k<3;k++)obox(mb,B.P(.412,s*(.06-k*.012)),[1,0,0],B.d,B.az,[hx-.09,.004,.003],COV);
      for(let k=0;k<5;k++)for(const e of [-1,1])hdCyl(mb,V3.add(B.P(.335,e*.1),[-hx+.06+k*(len-.12)/4,0,0]),V3.add(B.P(.35,e*.1),[-hx+.06+k*(len-.12)/4,0,0]),.007,.007,6,BOLT);
      if(s>0){const f=V3.add(B.P(.415,-.02),[hx-.09,0,0]);hdCyl(mb,f,V3.add(f,V3.mul(B.d,.03)),.025,.024,20,BLKP);hdRBox(mb,V3.add(f,V3.mul(B.d,.03)),[.006,.006,.03],.002,YEL,1);}},30);
    if(E0.carb)Q(mb=>{for(let k=0;k<np;k++){const c=V3.add(B.P(.3,.115),[xs(k)+s*.024,0,0]);hdCyl(mb,c,V3.add(c,V3.mul(B.out,.035)),.009,.008,10,SMC('#8a1a14',SM.HOSE));
      hdTube(mb,suvPath([V3.add(c,V3.mul(B.out,.035)),V3.add(B.P(.45,.13),[xs(k)+s*.024,0,0]),[-hx+.03+(k-np/2)*.006,.45,s*.04],[-hx+.01,.42,s*.02]],3,1),.0045,6,SMC('#8a1a14',SM.HOSE),false,false);}},30);
    else Q(mb=>{for(let k=0;k<np;k++){const c=V3.add(B.P(.415,s*-.03),[xs(k)+s*.024,0,0]);hdRBox(mb,c,[.02,.024,.03],.006,BLKP,2);
        hdRBox(mb,V3.add(c,[0,.018,-s*.028]),[.012,.012,.012],.003,SMC('#3a3a3c',SM.PLASTIC),1);hdRBox(mb,V3.add(c,[0,.025,-s*.04]),[.008,.006,.006],.002,SMC('#3d5a2a',SM.PLASTIC),1);
        for(const dd of [-.012,.012])cpHex(mb,V3.add(c,[dd,.024,s*.018]),[0,1,0],.004,.003);}
      const lm=[];for(let k=0;k<=8;k++){const x=-hx+.04+(len-.08)*k/8;lm.push(V3.add(B.P(.43,s*-.075),[x,0,0]));}hdTube(mb,lm,.009,8,HOSE,false,true);
      for(let k=0;k<np;k++)hdTube(mb,[V3.add(B.P(.43,s*-.075),[xs(k)+s*.024,0,0]),V3.add(B.P(.428,s*-.055),[xs(k)+s*.024,0,0])],.004,6,HOSE,false,false);},30);
    /* the exhaust manifold: cast iron, a runner from each port into a log along the head, out the back and down to the
       flange the underside's downpipe bolts to; its shield over it */
    if(!TT){const fl=[X(1.25)-X(uc),yb(.47)-yC,s*.37],ports=[...Array(np).keys()].map(k=>V3.add(B.P(.27,.12),[xs(k)+s*.024,0,0]));ex.push({s,p:Pt(1.265,yb(.47),s*.37)});
      const lg=ports.map(p=>V3.add(p,V3.add(V3.mul(B.out,.05),V3.mul(B.d,-.05))));
      /* (o.engine.headers: tubular headers, one primary a port, into a collector at the same flange) */
      if(E0.headers){for(let k=0;k<np;k++){const p0=ports[k],p1=V3.add(p0,V3.mul(B.out,.06)),p2=V3.add(p1,[0,-.1,s*.03]),pc=V3.add(fl,[.06+(k-(np-1)/2)*.005,.05+((k%2)-.5)*.02,((k>>1)-.5)*s*.02]);
          const R=suvPath([p0,p1,p2,[p2[0]*.5+pc[0]*.5,(p2[1]+pc[1])/2,(p2[2]+pc[2])/2],pc],4,2);Q(mb=>{hdTube(mb,R.slice(0,7),.019,12,SSB,false,true);hdTube(mb,R.slice(6),.019,12,SS,false,true);obox(mb,V3.add(p0,V3.mul(B.out,.004)),[1,0,0],B.d,B.out,[.026,.026,.004],SSB);},40);}
        Q(mb=>{hdCyl(mb,V3.add(fl,[.07,.05,0]),fl,.04,.03,20,SS);obox(mb,[fl[0]+.004,fl[1],fl[2]],[1,0,0],[0,1,0],[0,0,1],[.004,.034,.034],SSB);},35);}
      else Q(mb=>{for(let k=0;k<np;k++){hdTube(mb,[ports[k],V3.lerp(ports[k],lg[k],.5),lg[k]],.021,12,IRON,false,true);obox(mb,V3.add(ports[k],V3.mul(B.out,.004)),[1,0,0],B.d,B.out,[.026,.026,.004],IRON);}
        const path=[V3.add(lg[0],[.03,0,0]),lg[0],lg[1],lg[2],lg[3],V3.add(lg[3],[-.04,-.04,s*.03]),[fl[0]+.045,fl[1]+.02,fl[2]],[fl[0]+.005,fl[1],fl[2]]];hdTube(mb,suvPath(path,4,2),.026,14,IRON,false,true);
        obox(mb,[fl[0]+.004,fl[1],fl[2]],[1,0,0],[0,1,0],[0,0,1],[.004,.034,.034],IRON);
        const sh=[];for(let k=0;k<=10;k++){const t=k/10;sh.push(V3.add(V3.lerp(lg[0],lg[3],t),V3.add(V3.mul(B.out,.035),V3.mul(B.d,.025))));}
        hdSweep(mb,sh,[[-.05,-.004],[.05,-.004],[.054,.004],[-.054,.004]],SHIELD,B.out,false,true);
        for(let k=0;k<4;k++)cpHex(mb,V3.add(sh[k*3],V3.mul(B.out,.005)),B.out,.006,.005);},35);}
    /* (a turbocharged engine: stainless headers from each port down into a turbo low by the bank, its turbine in iron
       behind its compressor, the wastegate's actuator, the downpipe back to the underside's flange) */
    else{const tc=[uc-1.105,yb(.502)-yC,s*.35],r0=.085,cc=[tc[0]+.11,tc[1],tc[2]],ports=[...Array(np).keys()].map(k=>V3.add(B.P(.27,.12),[xs(k)+s*.024,0,0]));
      const tin=[tc[0]-.01,tc[1]+r0*1.05,tc[2]-s*.02];
      for(let k=0;k<np;k++){const p0=ports[k],p1=V3.add(p0,V3.mul(B.out,.06)),p2=V3.add(p1,[0,-.08,s*.04]),pc=V3.add(tin,[(k-(np-1)/2)*.018,.035,0]);
        const R=suvPath([p0,p1,p2,[pc[0],pc[1]+.04,pc[2]],pc],4,2);Q(mb=>{hdTube(mb,R.slice(0,7),.019,12,SSB,false,true);hdTube(mb,R.slice(6),.019,12,SS,false,true);obox(mb,V3.add(p0,V3.mul(B.out,.004)),[1,0,0],B.d,B.out,[.026,.026,.004],SSB);},40);}
      Q(mb=>{hdCyl(mb,V3.add(tin,[0,.05,0]),tin,.036,.03,20,SS);ball(mb,tc,r0*1.1,20,IRON);hdCyl(mb,[tc[0]-.045,tc[1],tc[2]],[tc[0]+.03,tc[1],tc[2]],r0,r0,28,IRON);
        hdCyl(mb,[tc[0]+.03,tc[1],tc[2]],[tc[0]+.07,tc[1],tc[2]],r0*.45,r0*.45,18,DARK);ball(mb,cc,r0,20,CASTA);hdCyl(mb,[cc[0]-.04,cc[1],cc[2]],[cc[0]+.03,cc[1],cc[2]],r0*1.02,r0*1.02,28,CASTA);
        hdCyl(mb,[cc[0]+.03,cc[1],cc[2]],[cc[0]+.06,cc[1],cc[2]],r0*.62,r0*.58,24,CASTA);
        /* the wastegate's can on the compressor, its rod back to the turbine; the oil and water lines */
        const wg=[cc[0]+.0,cc[1]-r0*.6,cc[2]+s*r0*.9];hdCyl(mb,wg,V3.add(wg,[0,0,s*.04]),.028,.028,20,SMC('#c8a23a',SM.PAINTED));hdCyl(mb,wg,[tc[0]-.02,tc[1]-r0*.5,tc[2]+s*r0*.7],.003,.003,6,BOLT);
        hdTube(mb,[[tc[0]+.05,tc[1]+r0*.5,tc[2]],[tc[0]+.05,tc[1]+.2,tc[2]-s*.08],[tc[0]+.02,.2,s*.2]],.004,6,SMC('#7d7f83',SM.SATIN),false,true);
        hdTube(mb,[[tc[0]+.05,tc[1]-r0*.5,tc[2]],[tc[0]+.08,tc[1]-.15,tc[2]-s*.1],[tc[0]+.1,-.12,s*.16]],.006,8,HOSE,false,true);
        /* the downpipe out of the turbine's back, down to the flange */
        const dp=[uc-1.34,yb(.42)-yC,s*.36];hdTube(mb,suvPath([[tc[0]-.04,tc[1],tc[2]],[tc[0]-.1,tc[1]-.02,tc[2]],[dp[0]+.06,dp[1]+.02,dp[2]],dp],4,2),.034,14,SS,false,true);
        obox(mb,dp,[1,0,0],[0,1,0],[0,0,1],[.004,.04,.04],SSB);for(const e of [-1,1])cpHex(mb,[dp[0]-.004,dp[1]+e*.03,dp[2]],[-1,0,0],.007,.006);},35);
      /* the heat shield over the headers */
      Q(mb=>{const sh=[];for(let k=0;k<=8;k++){const t=k/8;sh.push(V3.add(V3.lerp(ports[0],ports[np-1],t),V3.add(V3.mul(B.out,.075),V3.mul(B.d,-.03))));}hdSweep(mb,sh,[[-.045,-.003],[.045,-.003],[.048,.003],[-.048,.003]],SHIELD,B.out,false,true);},30);
      ex.push({s,p:Pt(1.34,yb(.42),s*.36),turbo:{c:Ew(tc),cc:Ew(cc),inlet:Ew([cc[0]+.06,cc[1],cc[2]]),out:Ew([cc[0],cc[1]+r0,cc[2]+s*.02])}});}}
  /* the intake: a composite plenum in the vee, eight runners curling down to the heads, its ribs, the fuel rails and
     injectors, the throttle body at its front with its plug, the PCV and vacuum lines */
  if(!E0.carb)Q(mb=>{hdRBox(mb,[-.03,.38,0],[hx-.05,.05,.1],.04,PLN,5);hdRBox(mb,[-.03,.43,0],[hx-.08,.008,.075],.008,PLN,2);
    for(let k=-Math.round(hx/.052);k<=Math.round(hx/.052);k++)hdRBox(mb,[-.03+k*.038,.432,0],[.005,.006,.07],.002,PLN,1);
    for(const s of [1,-1])for(let k=0;k<np;k++){const x=xs(k)+s*.024;hdTube(mb,[[x,.37,s*.07],[x,.39,s*.11],[x,.35,s*.14],[x,.3,s*.15]],.022,14,PLN,false,true);}},30);
  if(!E0.carb)Q(mb=>{for(const s of [1,-1]){for(let k=0;k<np;k++){const x=xs(k)+s*.024;hdCyl(mb,[x,.29,s*.18],[x,.325,s*.168],.009,.008,10,SMC('#2a2a2c',SM.PLASTIC));hdRBox(mb,[x,.33,s*.176],[.008,.007,.009],.002,BLKP,1);}
      hdCyl(mb,[-hx+.03,.335,s*.178],[hx-.04,.335,s*.178],.009,.009,12,SMC('#55575b',SM.ENGINE));for(const x of [-hx+.07,hx-.08])cpHex(mb,[x,.345,s*.178],[0,1,0],.006,.005);}
    hdTube(mb,[[hx-.04,.335,.178],[hx+.01,.35,.12],[hx+.01,.35,-.12],[hx-.04,.335,-.178]],.005,8,SMC('#55575b',SM.ENGINE),false,false);
    hdCyl(mb,[hx-.06,.4,0],[hx+.0,.4,0],.042,.042,24,SMC('#7c7f84',SM.CAST));hdCyl(mb,[hx+.0,.405,0],[hx+.025,.405,0],.046,.046,24,SMC('#7c7f84',SM.CAST));
    hdRBox(mb,[hx-.03,.4,.06],[.03,.03,.02],.008,BLKP,2);hdRBox(mb,[hx-.05,.42,.075],[.012,.008,.01],.003,SMC('#3a3a3c',SM.PLASTIC),1);
    hdTube(mb,[[-.15,.44,.07],[-.2,.46,.12],[-hx+.03,.44,.2]],.004,6,HOSE,false,false);hdTube(mb,[[-hx+.05,.42,-.05],[-hx-.02,.44,-.1],[-hx-.08,.4,-.12]],.008,8,HOSE,false,true);},35);
  /* the harness over the intake to the coils' looms and the injectors */
  if(!E0.carb)Q(mb=>{hdTube(mb,[[-hx+.02,.45,0],[-.1,.455,.02],[.08,.452,-.02],[hx-.06,.44,0]],.012,8,HOSE,false,true);for(const x of [-.12,.04])hdRBox(mb,[x,.455,0],[.012,.008,.02],.003,BLKP,1);},30);
  /* the front: the timing cover, the damper, water pump, alternator, power steering pump and its reservoir, the
     compressor, the tensioner and idler, the belt round them */
  {const pul=[[[hx+.07,-.03,0],.085,DARK],[[hx+.06,.17,0],.065,ALU],[[hx+.08,.26,.21],.04,ALU],[[hx+.08,.29,-.2],.058,ALU],[[hx+.07,-.0,-.21],.055,ALU],[[hx+.07,.22,.1],.033,DARK],[[hx+.07,.12,-.12],.03,DARK]];
    Q(mb=>{hdRBox(mb,[hx+.018,.12,0],[.02,.2,.17],.03,CASTA,4);
      for(const [c,r,m] of pul){hdCyl(mb,[c[0]-.03,c[1],c[2]],[c[0]+.012,c[1],c[2]],r,r,32,m);hdCyl(mb,[c[0]+.012,c[1],c[2]],[c[0]+.016,c[1],c[2]],r*.45,r*.45,20,BOLT);
        for(let q=0;q<5;q++){const a=q/5*TAU;hdCyl(mb,[c[0]+.012,c[1]+Math.cos(a)*r*.7,c[2]+Math.sin(a)*r*.7],[c[0]+.017,c[1]+Math.cos(a)*r*.7,c[2]+Math.sin(a)*r*.7],r*.06,r*.06,6,BOLT);}}
      /* the alternator's ribbed body and its terminal; the pump's body and its reservoir with the cap; the compressor */
      {const a=pul[2][0];hdCyl(mb,[hx-.04,a[1],a[2]],[hx+.06,a[1],a[2]],.068,.068,24,ALU);for(let k=0;k<4;k++){const x=hx-.03+k*.026;hdCyl(mb,[x-.004,a[1],a[2]],[x+.004,a[1],a[2]],.071,.071,24,ALU);}
        hdRBox(mb,[hx-.0,a[1]+.065,a[2]-.03],[.012,.01,.01],.003,RED,1);}
      {const a=pul[3][0];hdCyl(mb,[hx-.03,a[1],a[2]],[hx+.05,a[1],a[2]],.05,.05,24,ALU);hdCyl(mb,[hx+.01,a[1]+.05,a[2]],[hx+.01,a[1]+.13,a[2]],.04,.04,24,SMC('#2a2b2d',SM.PLASTIC));
        hdCyl(mb,[hx+.01,a[1]+.13,a[2]],[hx+.01,a[1]+.145,a[2]],.03,.028,20,BLKP);}
      {const a=pul[4][0];hdCyl(mb,[hx-.14,a[1],a[2]],[hx+.04,a[1],a[2]],.062,.062,24,ALU);hdRBox(mb,[hx-.06,a[1]+.065,a[2]-.02],[.025,.012,.02],.004,ALU,2);}
      const ord=[0,4,6,3,2,5,1],pts=[];for(let k=0;k<=ord.length;k++){const [c,r]=pul[ord[k%ord.length]],[c2]=pul[ord[(k+1)%ord.length]],[c0]=pul[ord[(k+ord.length-1)%ord.length]];
        const mid=[(c0[1]+c2[1])/2-c[1],(c0[2]+c2[2])/2-c[2]],l=Math.hypot(mid[0],mid[1])||1;pts.push([hx+.075,c[1]-mid[0]/l*r*1.02,c[2]-mid[1]/l*r*1.02]);}
      hdSweep(mb,pts,[[-.003,-.011],[.003,-.011],[.003,.011],[-.003,.011]],HOSE,[1,0,0],true,false);
      /* the thermostat's housing on the front of the intake, its outlet for the top hose */
      hdRBox(mb,[hx+.02,.3,.06],[.025,.025,.03],.008,CASTA,2);hdCyl(mb,[hx+.02,.3,.06],[hx+.045,.3,.06],.02,.02,16,CASTA);},30);}
  /* the heater hoses back to the firewall; the bell housing's front ribs and bolts; the starter; the oil filter; the
     engine's mounts on the frame's rails; the dipstick */
  Eo(mb=>{for(const dz of [.05,.11])hdTube(mb,suvPath([Ew([-hx,.22,dz]),Ew([-hx-.06,.27,dz+.02]),Pt(uR-.01,edge(uR)-.32,dz+.28)],4,1),.012,10,HOSE,false,true);},35);
  Q(mb=>{hdCyl(mb,[-hx-.06,-.07,.2],[-hx+.1,-.07,.2],.045,.045,20,SMC('#1d1e20',SM.ENGINE));hdCyl(mb,[-hx-.06,-.07,.2],[-hx-.09,-.07,.2],.03,.03,16,ALU);hdCyl(mb,[-hx+.0,-.025,.2],[-hx+.08,-.025,.2],.022,.022,14,SMC('#1d1e20',SM.ENGINE));
    hdRBox(mb,[-hx+.04,-.0,.2],[.012,.012,.012],.003,RED,1);},30);
  Q(mb=>{const c=[.1,-.045,.205],d=V3.norm([0,-.35,1]);hdCyl(mb,c,V3.add(c,V3.mul(d,.09)),.034,.034,24,SMC('#2c4fb0',SM.PAINTED));hdCyl(mb,V3.add(c,V3.mul(d,.09)),V3.add(c,V3.mul(d,.1)),.034,.028,24,SMC('#2c4fb0',SM.PAINTED));
    hdCyl(mb,V3.add(c,V3.mul(d,-.02)),c,.04,.04,20,CASTA);},30);
  for(const s of [1,-1]){const top=Ew([.03,-.02,s*.2]),rail=Pt(uc-.03,suvRailY(uc-.03)+dy+suvRailH(uc-.03),s*suvRailZ(uc-.03));
    Eo(mb=>{hdRBox(mb,V3.add(top,[0,0,s*.03]),[.05,.04,.03],.008,CASTA,2);hdSweep(mb,[V3.add(top,[0,-.02,s*.05]),V3.lerp(V3.add(top,[0,-.02,s*.05]),V3.add(rail,[0,.06,0]),.5),V3.add(rail,[0,.06,0])],[[-.03,-.02],[.03,-.02],[.03,.02],[-.03,.02]],FRAME,[1,0,0],true,true);
      hdCyl(mb,V3.add(rail,[0,.0,0]),V3.add(rail,[0,.045,0]),.04,.04,20,SV([.02,.02,.021],MAT.RUBBER));hdCyl(mb,V3.add(rail,[0,.0,0]),V3.add(rail,[0,.006,0]),.05,.05,20,FRAME);
      for(const dd of [-.03,.03])cpHex(mb,V3.add(rail,[dd,.006,0]),[0,1,0],.008,.007);},30);}
  Q(mb=>{hdCyl(mb,[hx-.12,.34,-.22],[hx-.12,.1,-.21],.005,.005,6,ALU);const lp=[];for(let k=0;k<=12;k++){const a=k/12*TAU;lp.push([hx-.12+Math.cos(a)*.016,.36+Math.sin(a)*.016,-.22]);}hdTube(mb,lp,.004,6,YEL,true,false);},35);

  /* ================= under the hood: the insulation pad, the pressed inner frame ================= */
  {const FAB=SMC('#1c1c1e',MAT.FABRIC),nz=12;
    /* (o.noPad: a race car's hood, its inner frame bare) */
    if(!o.noPad)for(let u=H.u0+.06;u<H.u1-.04;u+=.06){const v=Math.min(u+.06,H.u1-.04);for(let k=0;k<nz;k++){const f=u=>hz(u)-.06,z0=-f(u)+2*f(u)*k/nz,z1=-f(u)+2*f(u)*(k+1)/nz,w0=-f(v)+2*f(v)*k/nz,w1=-f(v)+2*f(v)*(k+1)/nz;
      ln.quad([X(u),topY(u,z0)-.014,z0],[X(u),topY(u,z1)-.014,z1],[X(v),topY(v,w1)-.014,w1],[X(v),topY(v,w0)-.014,w0],FAB[0],0,FAB[2]);}}
    hdPart(ln,mb=>{const rib=(pts)=>hdSweep(mb,pts,[[-.012,-.016],[.012,-.016],[.018,-.004],[-.018,-.004]],PAINT,[0,1,0],false,true);
      for(const s of [1,-1]){const pts=[];for(let u=H.u0+.03;u<=H.u1-.02;u+=.05)pts.push([X(u),topY(u,hz(u)-.03),s*(hz(u)-.03)]);rib(pts);
        const d=[];for(let t=0;t<=1.001;t+=.1){const u=H.u0+.12+(H.u1-H.u0-.25)*t,z=s*(hz(u)-.08)*(1-t*.8);d.push([X(u),topY(u,Math.abs(z))-.004,z]);}rib(d);}
      for(const u of [H.u0+.04,H.u1-.04,(H.u0+H.u1)/2]){const pts=[];for(let k=0;k<=16;k++){const z=-(hz(u)-.03)+2*(hz(u)-.03)*k/16;pts.push([X(u),topY(u,Math.abs(z))-.004,z]);}rib(pts);}},30);
    hdPart(ln,mb=>{const x=X(H.u0+.07);hdTube(mb,[[x,topY(H.u0+.07,0)-.02,-.02],[x,topY(H.u0+.07,0)-.05,-.02],[x,topY(H.u0+.07,0)-.05,.02],[x,topY(H.u0+.07,0)-.02,.02]],.004,8,BOLT,false,true);
      for(const s of [1,-1])hdCyl(mb,[x,topY(H.u0+.07,.5)-.016,s*.5],[x,topY(H.u0+.07,.5)-.03,s*.5],.012,.01,12,SV([.02,.02,.021],MAT.RUBBER));},30);}
  /* ================= a blown big-block's top (o.engine.blower, carb): the blower's manifold between the heads, the
     Roots case on it (polished, finned), its snout and the cogged belt down to the crank, two four-barrels on it under
     a low air cleaner ducted to the snorkel, their linkage and fuel; the distributor at the back ================= */
  let BLW=null;
  if(E0.carb&&E0.blower){const POL=SMC('#c9ccd1',SM.BRUSH),CA=SMC('#a3a6ab',SM.CAST),top=Math.min(.55,topY(uc,0)-.03-yC-.004);
    const y1=top-.03,yc1=y1-.04,yc0=yc1-.1;BLW={yc1};
    Q(mb=>{hdRBox(mb,[-.03,.36,0],[hx-.04,.04,.115],.015,CA,3);for(let k=0;k<8;k++)cpHex(mb,[-hx+.05+k*(len-.1)/7,.4,(k%2?1:-1)*.105],[0,1,0],.006,.005);},30);
    Q(mb=>{hdRBox(mb,[-.02,(yc0+yc1)/2,0],[.17,(yc1-yc0)/2,.1],.02,POL,4);for(let k=-6;k<=6;k++)for(const e of [-1,1])hdRBox(mb,[-.02+k*.025,(yc0+yc1)/2,e*.104],[.004,(yc1-yc0)/2-.012,.006],.002,POL,1);
      hdRBox(mb,[-.02,yc1+.003,0],[.15,.004,.085],.004,CA,2);},30);
    /* the snout to the front, the blower's pulley, the crank's own pulley ahead of the damper, the cogged belt */
    Q(mb=>{const yS=(yc0+yc1)/2-.01,xp=hx+.12;hdCyl(mb,[.15,yS,0],[xp-.02,yS,0],.032,.028,20,POL);hdCyl(mb,[xp-.025,yS,0],[xp+.02,yS,0],.06,.06,32,SMC('#3a3b3e',SM.ENGINE));
      hdCyl(mb,[xp-.025,-.03,0],[xp+.02,-.03,0],.075,.075,32,SMC('#3a3b3e',SM.ENGINE));
      const pts=[];for(let k=0;k<=12;k++){const a=-PI/2+k/12*PI;pts.push([xp,yS+Math.sin(a)*.062,Math.cos(a)*.062]);}for(let k=0;k<=12;k++){const a=PI/2+k/12*PI;pts.push([xp,-.03+Math.sin(a)*.077,Math.cos(a)*.077]);}pts.push(pts[0]);
      hdSweep(mb,pts,[[-.003,-.026],[.003,-.026],[.003,.026],[-.003,.026]],HOSE,[1,0,0],true,false);},40);
    /* the two four-barrels, their linkage, the fuel log and its regulator */
    for(const x of [-.085,.075])Q(mb=>{hdRBox(mb,[x,yc1+.022,0],[.05,.018,.05],.006,SMC('#b5a77a',SM.CAST),3);for(const e of [-1,1])hdCyl(mb,[x+e*.045,yc1+.02,.045],[x+e*.045,yc1+.02,.065],.01,.01,10,CA);},30);
    Q(mb=>{hdCyl(mb,[-.085,yc1+.03,.07],[.075,yc1+.03,.07],.004,.004,6,BOLT);hdTube(mb,[[-.13,yc1+.03,.075],[-.15,yc1+.02,.09],[-hx-.02,.45,.2]],.005,8,SMC('#7d7f83',SM.SATIN),false,true);
      hdRBox(mb,[-hx+.02,.46,.2],[.025,.02,.02],.006,SMC('#1b3a8a',SM.PAINTED),2);},35);
    /* the air cleaner: a low oval pan over both carburettors, its lid, the duct to the snorkel's base on the right */
    {const R=(y,k)=>{const r=[];for(let q=0;q<48;q++){const a=q/48*TAU;r.push([Math.cos(a)*.17*k-.005,y,Math.sin(a)*.09*k]);}return r;};
      Q(mb=>{hdLoft(mb,[R(y1,.9),R(y1,1),R(y1+.006,1)],POL,true);hdCap(mb,R(y1,.9),POL,true);
        hdLoft(mb,[R(y1+.006,.97),R(y1+.018,.97)],SMC('#2e2f31',SM.PLASTIC),true);for(let q=0;q<48;q++){const a=(q+.5)/48*TAU;hdRBox(mb,[Math.cos(a)*.166-.005,y1+.012,Math.sin(a)*.088],[.0025,.006,.0025],.001,SMC('#55565a',SM.PLASTIC),1);}
        hdLoft(mb,[R(y1+.018,1),R(y1+.022,.97),R(y1+.024,.6)],POL,true);hdCap(mb,R(y1+.024,.6),POL);hdCyl(mb,[-.005,y1+.024,0],[-.005,y1+.032,0],.018,.016,16,POL);},40);}
    Eo(mb=>{const a=Ew([-.005,y1+.012,.08]),yS=secKeys(D,1.35).yB-.08,R=suvPath([a,V3.add(a,[0,.0,.1]),Pt(1.27,yS+.01,.66),Pt(1.35,yS,.93)],5,2);hdTube(mb,R,.045,16,HOSE,false,true);
      for(let k=2;k<R.length-2;k+=2)hdCyl(mb,V3.add(R[k],[0,0,.004]),V3.add(R[k],[0,0,-.004]),.048,.048,16,HOSE);},40);
    /* the distributor at the back, its cap and the leads' clamp */
    Q(mb=>{hdCyl(mb,[-hx+.0,.34,0],[-hx+.0,.4,0],.022,.022,16,CA);hdCyl(mb,[-hx+.0,.4,0],[-hx+.0,.43,0],.04,.035,20,SMC('#1a1a1c',SM.PLASTIC));for(let k=0;k<8;k++){const a=k/8*TAU;hdCyl(mb,[-hx+Math.cos(a)*.028,.43,Math.sin(a)*.028],[-hx+Math.cos(a)*.028,.445,Math.sin(a)*.028],.006,.006,8,SMC('#8a1a14',SM.HOSE));}},35);}
  /* ================= a turbocharged engine's breathing ================= */
  if(TT){const T=ex.map(e=>e.turbo),tb=Ew([hx+.025,.405,0]),uic=uF+.01,xic=X(uic),yic0=yb(.53),yic1=yb(.8),zic=zr+.04,yic=(yic0+yic1)/2,hic=(yic1-yic0)/2;
    /* the front-mounted intercooler ahead of the radiator: two cores side by side, each fed at its outer end, out at its
       inner top; its fins */
    P(mb=>{for(const s of [1,-1]){hdRBox(mb,[xic,yic,s*zic/2],[.022,hic,zic/2-.025],.004,SMC('#2a2b2d',SM.ENGINE),2);hdRBox(mb,[xic,yic,s*(zic+.01)],[.028,hic+.01,.03],.008,CASTA,2);hdRBox(mb,[xic,yic,s*.02],[.026,hic+.006,.018],.006,CASTA,2);}
      for(let y=yic0+.01;y<yic1-.005;y+=.01)hdRBox(mb,[xic+.023,y,0],[.002,.002,zic-.02],.001,SMC('#3a3b3d',SM.ENGINE),1);},20);
    for(const s of [1,-1]){const t=T[s>0?0:1]||T[0];if(!t)continue;
      /* the charge pipe: up out of the compressor, along inside the wheelhouse wall and down into the cooler's end */
      P(mb=>{const R=suvPath([t.out,V3.add(t.out,[0,.1,s*.04]),Pt(uc-.08,yb(.76),s*.44),Pt(.55,yb(.74),s*.45),Pt(.36,yb(.7),s*(zic+.02)),[xic+.03,yic1-.01,s*(zic+.02)]],5,2);
        hdTube(mb,R,.034,14,ALU,false,true);for(const q of [R[3],R[R.length-4]])hdCyl(mb,V3.add(q,[.008,0,0]),V3.add(q,[-.008,0,0]),.038,.038,14,SMC('#1b3a8a',SM.HOSE));},40);}
    /* out of the cooler's inner tops, joined, back over the radiator to the throttle body; the blow-off valve on it */
    P(mb=>{const m=Pt(uic+.05,yrT+.06,0),R=suvPath([m,Pt(.42,yrT+.07,0),[tb[0]+.1,tb[1]+.005,0],[tb[0]+.02,tb[1],0]],5,2);hdTube(mb,R,.038,16,ALU,false,true);
      for(const s of [1,-1])hdTube(mb,[[xic+.02,yic1+.004,s*.04],[xic+.04,yrT+.03,s*.03],m],.03,12,ALU,false,true);
      const bo=R[Math.round(R.length*.3)];hdCyl(mb,bo,V3.add(bo,[0,.055,.0]),.024,.022,16,CASTA);hdCyl(mb,V3.add(bo,[0,.055,0]),V3.add(bo,[0,.065,0]),.018,.016,16,SMC('#b0201c',SM.PAINTED));
      hdCyl(mb,V3.add(R[R.length-3],[.008,0,0]),V3.add(R[R.length-3],[-.008,0,0]),.042,.042,16,SMC('#1b3a8a',SM.HOSE));},40);
    /* the ram-air box under the hood's scoop, its foam seal up to the hood, its tubes down to each turbo's inlet */
    if(E0.ram){const u0=.56,u1=.8,y0=yb(.985),y1=Math.min(topY(u1,.2),topY(u0,.2))-.03,b0=[X((u0+u1)/2),(y0+y1)/2,0];
      P(mb=>{hdRBox(mb,b0,[(u1-u0)/2,(y1-y0)/2,.2],.02,BLKP,4);const ring=hdRRect((u1-u0)/2-.02,.17,.03,5).map(([a,c])=>[b0[0]+a,y1+.008,c]);ring.push(ring[0]);hdTube(mb,ring,.009,8,SMC('#202022',SM.CLOTH),false,false);
        hdRBox(mb,[b0[0]+(u1-u0)/2-.02,b0[1],0],[.004,(y1-y0)/2-.01,.18],.003,SMC('#2a2b2d',SM.PLASTIC),2);},32);
      for(const s of [1,-1]){const t=T[s>0?0:1]||T[0];if(!t)continue;
        P(mb=>{const R=suvPath([Pt(.68,y0+.01,s*.19),Pt(.74,y0-.08,s*.3),Pt(.84,yb(.72),s*.39),[t.inlet[0]+.07,t.inlet[1]+.06,t.inlet[2]],t.inlet],5,2);hdTube(mb,R,.04,16,HOSE,false,true);
          for(let k=2;k<R.length-2;k+=2)hdCyl(mb,V3.add(R[k],[.004,0,0]),V3.add(R[k],[-.004,0,0]),.043,.043,16,HOSE);
          hdCyl(mb,V3.add(t.inlet,[.012,0,0]),V3.add(t.inlet,[-.004,0,0]),.044,.044,16,BOLT);},40);}}
    /* (no ram box: a cone filter on each turbo's inlet, on a short silicone elbow, turned out toward the wheel house) */
    else for(const s of [1,-1]){const t=T[s>0?0:1]||T[0];if(!t)continue;const a=t.inlet,d=V3.norm([1,.05,s*.35]),b=V3.add(V3.add(a,[.06,0,0]),V3.mul(d,.05)),e=V3.add(b,V3.mul(d,.17));
      P(mb=>{hdTube(mb,[V3.add(a,[-.004,0,0]),V3.add(a,[.04,0,0]),b],.042,16,SMC('#1b3a8a',SM.HOSE),false,true);hdCyl(mb,V3.add(a,[.01,0,0]),V3.add(a,[.022,0,0]),.046,.046,16,BOLT);
        hdCyl(mb,b,V3.add(b,V3.mul(d,.025)),.05,.05,24,MM.CHROME);const n=V3.norm(V3.cross(d,[0,1,0])),w=V3.cross(n,d);
        for(let k=0;k<28;k++){const q=k/28*TAU,dir=V3.add(V3.mul(n,Math.cos(q)),V3.mul(w,Math.sin(q))),p0=V3.add(V3.add(b,V3.mul(d,.025)),V3.mul(dir,.054)),p1=V3.add(V3.add(e,V3.mul(d,-.012)),V3.mul(dir,.042));hdCyl(mb,p0,p1,.0065,.0055,5,SMC('#9e1c18',SM.CLOTH));}
        hdCyl(mb,V3.add(b,V3.mul(d,.02)),V3.add(e,V3.mul(d,-.01)),.048,.036,20,SMC('#2a1210',SM.CLOTH));hdCyl(mb,V3.add(e,V3.mul(d,-.012)),e,.044,.04,24,MM.CHROME);hdCyl(mb,e,V3.add(e,V3.mul(d,.004)),.03,.02,18,HC.BOLT);},40);}}
  /* ================= the nitrous: a plate under the throttle body, its two solenoids on the intake, the lines ================= */
  /* (on the blower: a plate under each carburettor, the two solenoids on the manifold ahead of the case) */
  const NS=BLW?[.175,.46,-.065]:[hx-.18,.48,-.06];
  if(E0.nos&&BLW)Q(mb=>{const y=BLW.yc1+.002;for(const x of [-.085,.075]){hdRBox(mb,[x,y,0],[.053,.003,.053],.002,SMC('#2a3a8a',SM.PAINTED),1);hdCyl(mb,[x+.053,y,.03],[x+.07,y,.03],.004,.004,8,BOLT);}
      for(const [zz,col] of [[-.065,'#b0201c'],[.065,'#1b3a8a']]){const c=[.175,.4,zz];hdCyl(mb,c,V3.add(c,[0,.055,0]),.017,.017,18,SMC('#cfd2d5',SM.BRUSH));hdRBox(mb,V3.add(c,[0,.061,0]),[.012,.008,.012],.003,SMC(col,SM.PLASTIC),1);
        hdTube(mb,[V3.add(c,[-.01,.045,0]),[.15,y+.004,zz*.7],[.13,y,.03*Math.sign(zz)],[.13-.02,y,.03]],.004,8,SMC('#7d7f83',SM.SATIN),false,true);}},35);
  if(E0.nos&&!BLW){Q(mb=>{const x=hx-.065;hdRBox(mb,[x,.405,0],[.006,.058,.058],.003,SMC('#2a3a8a',SM.PAINTED),2);for(const zz of [-.03,.03])hdCyl(mb,[x,.465,zz],[x,.49,zz],.006,.006,8,BOLT);
      for(const [zz,col] of [[-.06,'#b0201c'],[.0,'#1b3a8a']]){const c=[hx-.18,.45,zz];hdRBox(mb,V3.add(c,[0,-.008,0]),[.03,.004,.022],.002,SMC("#3a3b3e",SM.ENGINE),1);
        hdCyl(mb,c,V3.add(c,[0,.06,0]),.017,.017,18,SMC('#cfd2d5',SM.BRUSH));hdRBox(mb,V3.add(c,[0,.066,0]),[.012,.008,.012],.003,SMC(col,SM.PLASTIC),1);
        hdTube(mb,[V3.add(c,[.02,.02,0]),[hx-.1,.48,zz*.5],[x,.49,zz*.5]],.005,8,SMC('#7d7f83',SM.SATIN),false,true);}},35);
    /* the feed from the bottle (in the cargo area, along under the car) up behind the left tub, to the solenoid */
    Eo(mb=>{hdTube(mb,suvPath([Pt(uR-.02,yb(.7),-.47),Pt(uR-.05,edge(uR)-.28,-.44),Pt(uc-.05,yb(1.0),-.2),Ew(NS)],4,2),.005,8,SMC('#7d7f83',SM.SATIN),false,true);},35);}
  return {bay:st,engine:en,liner:ln,pivot:[X(uc),yC,0],trans:false,ex,tris:(st.p.length+en.p.length+ln.p.length)/9};
}
