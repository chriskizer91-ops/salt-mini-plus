/* =====================================================================================
   THE HATCH'S ENGINE BAY (Studio 2), in place of 87's: its own, the way the car is built, and drawn all the time
   (whatever reaches down out of it meets the underside, 91):
   - The bay: the aprons up to their flanges under the hood's edges, the tubs over the front wheels and their inner
     walls down to the frame's legs, the struts' towers with their top mounts, the firewall down to the toe board (its
     pad, the tunnel's mouth), the cowl's tray; the radiator support, the radiator and its two electric fans, the
     intercooler low ahead of it; the battery, the fuse box, the coolant and washer bottles, the brake servo and the
     master cylinder on the driver's side, the steering rack low on the firewall and its column up through it, the
     harness, the prop rod.
   - The engine across the nose (the game's i18t, in its colours: a grey block, a red cam cover): the block, the sump,
     the head and its ribbed cover, the plug leads to the distributor at its left end, the timing belt's cover and the
     crank's pulley on its right end with the alternator and the belt; the intake (four runners forward into the
     plenum, the throttle body on its left end, the fuel rail and injectors); the exhaust behind (the manifold under
     its shield into the turbo, the wastegate, the downpipe down behind the engine to the underside's flange); the
     charge pipes round both sides to the intercooler and back, the blow-off valve; the airbox on the right and its
     duct to the turbo; the oil filter, the dipstick, the mounts.
   - The transaxle on the engine's left end: the bell housing, the gearbox's case, the differential behind the crank,
     the transfer box beside it (its output back to the propshaft), the gear linkage's rods back to the tunnel.
   - Under the hood: the hood's pressed inner frame, the latch's striker (o.noPad leaves the pad out).
   o.engine: block, head, cover (colours), turbo ('big': a bigger one), antilag (its air valve and the plumbing),
   ram (the intake's air from a scoop's duct in place of the airbox), brace (a strut brace across the towers).
   Returns the bay, the engine, the liner, and ex: the downpipe's flange for the underside.
   ===================================================================================== */
function htBay2(car,o={}){
  const K=HDK,D=K.D,b=car.b,lk=b.look,X=K.X,topY=D.topY,H=D.hood,hz=H.hz,LY=htLay(car,o),dy=LY.dy,yb=LY.yb,E0=Object.assign({},o.engine||{});
  const st=new MB(),en=new MB(),ln=new MB(),PAINT=SV([1,1,1],MAT.PAINT),LIN=HC.LINER,DARK=SMC('#161618',SM.ENGINE),ALU=SMC('#8a8d92',SM.ENGINE),CASTA=SMC('#a3a6ab',SM.CAST),
    IRON=SMC('#4a433c',SM.CAST),HOSE=SMC('#141414',SM.HOSE),PL=HC.PLASTIC,BLKP=SMC('#0f0f10',SM.PLASTIC),LINE=SMC('#c0c2c5',SM.BOLT),BOLT=HC.BOLT,
    YEL=SMC('#d6b21a',SM.PLASTIC),WHT=SMC('#d4d0c4',SM.PLASTIC),RED=SMC('#b0201c',SM.PLASTIC),SHIELD=SMC('#c4c4c0',SM.BRUSH),FRAME=SMC('#222326',SM.PAINTED),
    SIL=SMC(E0.silicone||'#1b3a8a',SM.HOSE);
  const uF=H.u0+.09,uR=H.u1-.02,edge=u=>topY(u,hz(u)),Pt=(u,y,z)=>[X(u),y,z],zin=o.zin||.5;
  const P=(f,deg=32)=>hdPart(st,f,deg);
  const uc=LY.uc,yC=LY.yC,zc=LY.zc,hx=LY.hx,EM=M4.basis([X(uc),yC,zc],[0,0,1],[0,1,0],[-1,0,0]),Ew=p=>M4.xform(EM,p),Q=(f,deg=32)=>hdPart(en,f,deg,null,EM),Eo=(f,deg=32)=>hdPart(en,f,deg);
  /* (the engine's own frame: x along the crank to the timing end on the right, y up, z back toward the firewall) */
  const np=4,xs=k=>-hx+.06+(k+.5)*(2*hx-.12)/np,ex=[];
  const tubY=u=>{const a=archY(D,u);return a<0?-1:a+.035;},railTop=u=>yb(.4);
  const N=40;

  /* ================= the bay ================= */
  for(const s of [1,-1]){
    /* the apron: from the tub (ahead of the wheel, the front's height) up to a flange under the hood's edge */
    P(mb=>{for(let k=0;k<N;k++){const ua=uF+(uR-uF)*k/N,ub=uF+(uR-uF)*(k+1)/N,za=s*(hz(ua)-.005),zb=s*(hz(ub)-.005);
      const la=Math.max(yb(.46),tubY(ua)),lb=Math.max(yb(.46),tubY(ub));
      mb.quad([X(ua),la,za],[X(ub),lb,zb],[X(ub),edge(ub)-.03,zb],[X(ua),edge(ua)-.03,za],PAINT[0],0,PAINT[2]);
      mb.quad([X(ua),edge(ua)-.03,za],[X(ub),edge(ub)-.03,zb],[X(ub),edge(ub)-.016,zb+s*.012],[X(ua),edge(ua)-.016,za+s*.012],PAINT[0],0,PAINT[2]);}});
    /* the tub over the wheel house, in to its inner wall, and the wall down to the leg */
    P(mb=>{const rows=[];for(let k=0;k<=N;k++){const u=uF+(uR-uF)*k/N,t=tubY(u);if(t<0){rows.push(null);continue;}const zA=hz(u)-.005,row=[];
      for(let j=0;j<=8;j++){const f=j/8,z=zA+(zin-zA)*f;row.push([X(u),t+.006*Math.sin(f*PI),s*z]);}row.push([X(u),Math.min(t,railTop(u)),s*zin]);rows.push(row);}
      for(let k=0;k<rows.length-1;k++){const A=rows[k],B=rows[k+1];if(!A||!B)continue;for(let j=0;j<A.length-1;j++)mb.quad(A[j],B[j],B[j+1],A[j+1],LIN[0],0,LIN[2]);}});
    for(const [ua,ub] of [[uF,D.uFa-D.arch.a],[D.uFa+D.arch.a,uR]])if(ub>ua+.01)P(mb=>{const rows=[];for(let u=ua;u<=ub+1e-6;u+=(ub-ua)/6){const y0=Math.max(yb(.46),tubY(u));rows.push([[X(u),y0,s*(hz(u)-.005)],[X(u),y0,s*(zin+.02)],[X(u),railTop(u)+.01,s*(zin-.02)]]);}
      for(let k=0;k<rows.length-1;k++)for(let j=0;j<2;j++)mb.quad(rows[k][j],rows[k+1][j],rows[k+1][j+1],rows[k][j+1],LIN[0],0,LIN[2]);});
    /* the strut's tower: a dome on the tub, the top mount's plate, three studs and nuts, the damper's nut under its cap */
    {const u=D.uFa+.03,z=s*.56,y=tubY(u)+.004,c=[X(u),y,z];
      P(mb=>{hdCyl(mb,V3.add(c,[0,-.03,0]),c,.085,.075,32,PAINT);hdCyl(mb,c,V3.add(c,[0,.004,0]),.06,.058,28,SMC('#2a2b2e',SM.ENGINE));
        for(let q=0;q<3;q++){const a=q/3*TAU+.4;const p=V3.add(c,[Math.cos(a)*.046,.004,Math.sin(a)*.046]);hdCyl(mb,p,V3.add(p,[0,.016,0]),.006,.006,6,BOLT);cpHex(mb,p,[0,1,0],.009,.008);}
        hdCyl(mb,V3.add(c,[0,.004,0]),V3.add(c,[0,.028,0]),.022,.018,20,SV([.02,.02,.021],MAT.RUBBER));},30);}
    /* the harness along the apron's top, clipped down */
    P(mb=>{const pts=[];for(let k=0;k<=12;k++){const u=uF+.06+(uR-uF-.14)*k/12;pts.push([X(u),edge(u)-.06,s*(hz(u)-.035)]);}hdTube(mb,pts,.009,8,HOSE,false,true);
      for(let k=1;k<12;k+=3)hdRBox(mb,pts[k],[.007,.014,.014],.004,BLKP,2);});}
  /* (o.brace: a strut brace across the towers, its two plates on the studs) */
  if(o.brace)P(mb=>{const u=D.uFa+.03,y=tubY(u)+.03,a=[X(u),y,-.56],c=[X(u),y,.56],m=[X(u+.08),Math.min(edge(u+.08)-.06,y+.06),0];hdTube(mb,suvPath([a,V3.lerp(a,m,.6),m,V3.lerp(c,m,.6),c],4,2),.016,14,SMC('#c41e1a',SM.PAINTED),false,true);
    for(const e of [a,c])hdCyl(mb,V3.add(e,[0,-.012,0]),V3.add(e,[0,-.004,0]),.065,.065,28,SMC('#c41e1a',SM.PAINTED));});

  /* ---------- the firewall, its pad and the toe board's slope (open round the tunnel's mouth), the cowl's tray ---------- */
  {const z=hz(uR)-.005,x=X(uR),ym=edge(uR)-.02,FAB=SMC('#1d1d20',MAT.FABRIC),nz=40,yfo=yb(.44),uT=D.G.cowl+.06,
    /* (its foot: the tunnel's mouth in the middle, the toe board's slope back to the floor, the wheel houses' tops out
       beyond their inner walls) */
    foot=zz=>Math.abs(zz)>zin?Math.max(yfo,tubY(uR)):Math.abs(zz)<.14?htPanY(uT,zz,dy):yfo;
    P(mb=>{for(let k=0;k<nz;k++){const za=-z+2*z*k/nz,zb=-z+2*z*(k+1)/nz;mb.quad([x,foot(za),za],[x,foot(zb),zb],[x,ym-.2,zb],[x,ym-.2,za],PAINT[0],0,PAINT[2]);}
      const n4=24;for(let k=0;k<n4;k++){const za=-zin+2*zin*k/n4,zb=-zin+2*zin*(k+1)/n4;if(Math.abs(za+zb)/2<.14)continue;mb.quad([x,yfo,za],[x,yfo,zb],[X(uT),htPanY(uT,zb,dy),zb],[X(uT),htPanY(uT,za,dy),za],PAINT[0],0,PAINT[2]);}});
    P(mb=>{const n2=20;for(let k=0;k<n2;k++){const za=-z+2*z*k/n2,zb=-z+2*z*(k+1)/n2,ba=.005*Math.sin(k*1.7);mb.quad([x+.004,ym-.2,za],[x+.004,ym-.2,zb],[x+.012+ba,ym,zb],[x+.012+ba,ym,za],FAB[0],0,FAB[2]);}});
    const y=ym+.005,xc=X(H.u1+.03);P(mb=>{const n3=36;for(let k=0;k<n3;k++){const za=-z+2*z*k/n3,zb=-z+2*z*(k+1)/n3,slot=k%3===1&&Math.abs(za)<z*.85;
      mb.quad([x,y,za],[x,y,zb],[xc,y+.012,zb],[xc,y+.012,za],(slot?HC.GB:PL)[0],0,(slot?HC.GB:PL)[2]);}});
    P(mb=>{const pts=[];for(let k=0;k<=14;k++){const zz=-z*.85+1.7*z*k/14;pts.push([x+.025,ym-.11+.008*Math.sin(k),zz]);}hdTube(mb,pts,.011,8,HOSE,false,true);
      for(const zz of [-.26,.3])hdCyl(mb,[x+.002,ym-.11,zz],[x+.026,ym-.11,zz],.026,.02,18,BLKP);for(let k=2;k<14;k+=4)hdRBox(mb,pts[k],[.014,.007,.014],.004,BLKP,2);});}

  /* ================= the front ================= */
  const uRad=.205,yrT=Math.min(edge(.2)-.1,yb(.7)),yrB=yb(.36),yr=(yrT+yrB)/2,hr=(yrT-yrB)/2,zr=.42;
  /* the radiator support: its top bar under the hood's front with the latch, its sides, the bottom bar */
  P(mb=>{hdRBox(mb,[X(uRad-.04),edge(uRad-.04)-.045,0],[.025,.022,hz(uRad)-.04],.008,BLKP,2);for(const s of [1,-1])hdRBox(mb,[X(uRad-.03),yr,s*(zr+.06)],[.022,hr+.05,.02],.006,BLKP,2);
    hdRBox(mb,[X(uRad-.03),yrB-.03,0],[.025,.018,zr+.08],.006,BLKP,2);
    const lu=uRad-.04;hdRBox(mb,[X(lu)-.03,edge(lu)-.04,0],[.012,.026,.03],.004,HC.CAST,2);hdCyl(mb,[X(lu)-.03,edge(lu)-.018,0],[X(lu)-.03,edge(lu)-.004,0],.006,.006,8,BOLT);
    hdRBox(mb,[X(lu)+.026,edge(lu)-.045,.14],[.001,.012,.035],.001,SMC('#e8e2c8',SM.PLASTIC),1);},28);
  /* the radiator: plastic tanks either side of the finned core, its cap; the fins */
  P(mb=>{for(const s of [1,-1])hdRBox(mb,[X(uRad),yr,s*(zr+.02)],[.025,hr+.01,.022],.008,BLKP,3);hdRBox(mb,[X(uRad),yr,0],[.014,hr,zr],.003,SMC('#262728',SM.ENGINE),1);
    hdCyl(mb,[X(uRad),yrT+.01,zr*.72],[X(uRad),yrT+.04,zr*.72],.022,.02,18,MM.CHROME);},28);
  P(mb=>{for(let y=yrB+.012;y<yrT-.008;y+=.012)hdRBox(mb,[X(uRad)+.015,y,0],[.002,.0025,zr-.005],.001,SMC('#3a3b3d',SM.ENGINE),1);},20);
  /* two electric fans on its back in a shroud */
  for(const s of [1,-1]){const c=[X(uRad+.05),yr,s*zr*.5],R=Math.min(hr,zr*.5)*.9;
    P(mb=>{hdCyl(mb,c,[c[0]-.03,c[1],c[2]],R+.012,R+.012,32,BLKP,false);hdCyl(mb,[c[0]-.03,c[1],c[2]],[c[0]-.055,c[1],c[2]],R*.3,R*.3,20,BLKP);
      for(let q=0;q<7;q++){const a=q/7*TAU;hdRBox(mb,[c[0]-.018,c[1]+Math.cos(a)*R*.62,c[2]+Math.sin(a)*R*.62],[.004,R*.32,.028],.004,BLKP,1);}
      for(let q=0;q<4;q++){const a=q/4*TAU+PI/4;hdRBox(mb,[c[0]-.04,c[1]+Math.cos(a)*R*.62,c[2]+Math.sin(a)*R*.62],[.004,R*.36,.006],.003,BLKP,1);}},30);}
  P(mb=>{const sh=hdRRect(zr,hr,.05,6);hdLoft(mb,[sh.map(([a,bb])=>[X(uRad+.022),yr+bb,a]),sh.map(([a,bb])=>[X(uRad+.032),yr+bb*.98,a*.98])],BLKP,true);},30);
  /* the intercooler low ahead of it, its end tanks; its brackets */
  const uic=uRad-.06,yic0=yb(.25),yic1=yb(.44),zic=.36;
  P(mb=>{hdRBox(mb,[X(uic),(yic0+yic1)/2,0],[.022,(yic1-yic0)/2,zic],.004,SMC('#2a2b2d',SM.ENGINE),2);for(const s of [1,-1])hdRBox(mb,[X(uic),(yic0+yic1)/2,s*(zic+.03)],[.028,(yic1-yic0)/2+.01,.03],.008,CASTA,2);
    for(let y=yic0+.01;y<yic1-.005;y+=.01)hdRBox(mb,[X(uic)-.023,y,0],[.002,.002,zic-.01],.001,SMC('#3a3b3d',SM.ENGINE),1);
    for(const s of [1,-1])hdRBox(mb,[X(uic-.0)+.0,yic0-.02,s*.25],[.03,.02,.012],.004,FRAME,1);},20);
  /* the hoses: the top from the thermostat on the head's right to the radiator, the bottom to the water pump */
  {const th=Ew([hx-.02,.25,-.1]),wp=Ew([hx+.0,.06,-.12]);
    P(mb=>{const top=[[X(uRad+.02),yrT-.04,zr*.8],[X(uRad+.1),yrT-.02,zr*.7],[th[0]+.08,th[1]+.03,th[2]+.05],th],bot=[[X(uRad+.02),yrB+.05,-zr*.8],[X(uRad+.08),yrB+.03,-zr*.5],[wp[0]+.1,wp[1]-.05,wp[2]-.1],wp];
      hdTube(mb,suvPath(top,4,1),.02,12,HOSE,false,true);hdTube(mb,suvPath(bot,4,1),.021,12,HOSE,false,true);
      for(const pth of [top,bot])for(const p of [pth[0],pth[pth.length-1]]){const q=V3.lerp(p,pth[pth[0]===p?1:pth.length-2],.12);hdCyl(mb,V3.add(q,[.006,0,0]),V3.add(q,[-.006,0,0]),.025,.025,14,BOLT);}});}

  /* ================= the furniture ================= */
  /* the battery on its tray over the gearbox, the hold-down, the cables */
  {const c=Pt(.7,yb(.585),-.38);
    P(mb=>{hdRBox(mb,V3.add(c,[0,-.082,0]),[.11,.007,.085],.004,BLKP,2);hdRBox(mb,c,[.1,.075,.075],.006,SMC('#1c1d1f',SM.PLASTIC),3);hdRBox(mb,V3.add(c,[0,.077,0]),[.098,.004,.073],.004,SMC('#2a2b2d',SM.PLASTIC),2);
      for(const du of [-.065,.065])hdCyl(mb,V3.add(c,[du,.08,.045]),V3.add(c,[du,.097,.045]),.009,.008,14,SMC('#9a8a60',SM.CAST));
      hdRBox(mb,V3.add(c,[-.065,.09,.045]),[.014,.011,.012],.004,RED,2);hdRBox(mb,V3.add(c,[0,.082,-.02]),[.004,.005,.08],.002,BOLT,1);
      for(const e of [-1,1])hdCyl(mb,V3.add(c,[0,.082,-.02+e*.08]),V3.add(c,[0,-.08,-.02+e*.08]),.003,.003,6,BOLT);
      hdTube(mb,suvPath([V3.add(c,[-.065,.1,.045]),V3.add(c,[-.12,.12,.08]),Pt(uR-.03,edge(uR)-.1,-.62)],4,1),.007,8,RED,false,true);
      hdTube(mb,suvPath([V3.add(c,[.065,.1,.045]),V3.add(c,[.11,.06,.12]),Ew([-hx-.1,.05,.12])],4,1),.007,8,HOSE,false,true);},30);}
  /* the fuse box on the firewall's left, beyond the servo */
  {const c=Pt(uR-.03,edge(uR)-.1,-.62);P(mb=>{hdRBox(mb,c,[.03,.05,.07],.01,BLKP,3);hdRBox(mb,V3.add(c,[-.032,0,0]),[.004,.052,.072],.008,BLKP,2);
    for(const dz of [-.05,.05])hdRBox(mb,V3.add(c,[-.036,.03,dz]),[.004,.01,.01],.002,BLKP,1);},30);}
  /* the coolant bottle on the right tub behind the tower, its cap and the hose; the washer bottle in the right front
     corner ahead of the wheel */
  {const c=Pt(.83,tubY(.83)+.04,.58);P(mb=>{hdRBox(mb,c,[.06,.04,.05],.016,WHT,4);hdCyl(mb,V3.add(c,[.02,.04,-.02]),V3.add(c,[.02,.056,-.02]),.022,.02,20,SMC('#1b1b1c',SM.PLASTIC));
    for(const yy of [-.012,.012])hdRBox(mb,V3.add(c,[.061,yy,0]),[.001,.0012,.026],.0005,BLKP,1);
    hdTube(mb,suvPath([V3.add(c,[-.06,-.02,-.03]),Pt(.8,yb(.66),.4),Ew([hx-.04,.28,-.06])],4,1),.007,8,HOSE,false,true);});}
  {const c=Pt(.255,yb(.55),.63);P(mb=>{hdRBox(mb,c,[.03,.07,.06],.015,SMC('#cfd2d4',SM.PLASTIC),4);hdCyl(mb,V3.add(c,[0,.07,0]),V3.add(c,[0,.16,0]),.014,.014,14,SMC('#cfd2d4',SM.PLASTIC));
    hdCyl(mb,V3.add(c,[0,.16,0]),V3.add(c,[0,.172,0]),.019,.017,16,SMC('#1d5fb0',SM.PLASTIC));});}
  /* the brake servo and master cylinder on the firewall's left, the fluid's reservoir, the lines */
  {const z=-.4,x=X(uR),y=edge(uR)-.22;
    hdPart(st,mb=>{hdRev(mb,[[0,0],[.11,0],[.122,.018],[.122,.07],[.11,.088],[0,.092]],40,BLKP);},30,null,M4.mul(M4T(x,y,z),M4RZ(-PI/2)));
    P(mb=>{hdCyl(mb,[x+.09,y,z],[x+.25,y,z],.028,.028,16,ALU);hdRBox(mb,[x+.17,y+.055,z],[.045,.027,.035],.008,SMC('#cfc8b8',SM.PLASTIC),3);
      hdCyl(mb,[x+.17,y+.083,z],[x+.17,y+.1,z],.019,.019,16,YEL);for(const s2 of [1,-1])cpHex(mb,[x+.095,y+s2*.045,z+s2*.045],[1,0,0],.009,.007);
      for(let k=0;k<4;k++){const s0=[x+.2+k*.012,y-.02,z+.02],e=k<2?Pt(.62,tubY(.62)+.02,-.52):Pt(uR-.02,yb(.42),-.1-k*.04);hdTube(mb,[s0,V3.add(s0,[0,-.03,.02]),[(s0[0]+e[0])/2,Math.max(s0[1],e[1])-.02,(s0[2]+e[2])/2],e],.0026,6,LINE,false,true);}});}
  /* the steering rack low on the firewall behind the engine, its boots and tie rods out to the struts' arms; the
     column's shaft up through the firewall on the driver's side */
  {const u=uR-.01,y=yb(.42),zl=.36,R0=SMC('#3a3b3e',SM.ENGINE);
    P(mb=>{hdCyl(mb,Pt(u,y,-zl+.05),Pt(u,y,zl-.05),.024,.024,16,ALU);for(const s of [1,-1])hdRBox(mb,Pt(u,y+.02,s*.2),[.022,.03,.03],.006,ALU,2);
      hdCyl(mb,Pt(u,y,-zl+.1),Pt(u-.03,y+.16,-zl+.06),.018,.018,14,ALU);hdCyl(mb,Pt(u-.03,y+.16,-zl+.06),Pt(u-.06,y+.24,-zl+.03),.012,.012,10,R0);},30);
    for(const s of [1,-1]){cpBoot(st,Pt(u,y,s*(zl-.05)),Pt(u,y,s*(zl+.06)),.026,.02,6);
      const k=Pt(D.uFa+.1,.36+(LY.R-.3),s*(LY.tw-.13));P(mb=>{hdCyl(mb,Pt(u,y,s*(zl+.06)),k,.009,.009,10,R0);ball(mb,k,.016,12,R0);},30);}}
  /* the prop rod along the radiator support */
  P(mb=>{const a=[X(uRad-.04),edge(uRad-.04)-.045,-(hz(uRad)-.12)],bb=[X(uRad-.04),edge(uRad-.04)-.045,hz(uRad)-.3];hdCyl(mb,a,bb,.0045,.0045,8,SMC('#2a2a2c',SM.ENGINE));});

  /* ================= the engine ================= */
  const BLK=SMC(E0.block||'#85888d',SM.ENGINE),HEAD=SMC(E0.head||'#9a9da2',SM.ENGINE),COV=SMC(E0.cover||'#b0201c',SM.PAINTED),LEAD=SMC(E0.leads||'#b0201c',SM.HOSE);
  /* the block, the sump under it (its ribs, the drain), the head, the cam cover (ribbed, its oil filler) */
  Q(mb=>{hdRBox(mb,[0,.075,0],[hx,.125,.1],.012,BLK,3);for(let k=0;k<np;k++)for(const e of [-1,1])hdRBox(mb,[xs(k),.1,e*.102],[.022,.09,.004],.004,BLK,1);
    hdRBox(mb,[.0,-.11,.01],[hx-.03,.06,.095],.02,CASTA,3);for(let k=0;k<7;k++)hdRBox(mb,[-hx+.06+k*(2*hx-.12)/6,-.172,.01],[.004,.006,.08],.002,CASTA,1);cpHex(mb,[.08,-.171,.06],[0,-1,0],.011,.006);
    for(let k=0;k<12;k++){const x=-hx+.04+(2*hx-.08)*(k/11);for(const e of [-1,1])cpHex(mb,[x,-.048,e*.099],[0,0,e],.0045,.004);}},30);
  Q(mb=>{hdRBox(mb,[0,.255,0],[hx-.01,.055,.105],.01,HEAD,3);for(let k=0;k<10;k++)cpHex(mb,[-hx+.03+k*(2*hx-.06)/9,.31,(k%2?1:-1)*.098],[0,1,0],.006,.005);},30);
  Q(mb=>{rbox(mb,[0,.345,0],[1,0,0],[0,1,0],[0,0,1],[hx-.03,.04,.092],COV,.28,20,8);for(let k=0;k<4;k++)obox(mb,[-.06+k*.04,.388,0],[1,0,0],[0,1,0],[0,0,1],[.004,.003,.07],COV);
    hdCyl(mb,[hx-.08,.38,-.05],[hx-.08,.405,-.05],.024,.024,18,SMC('#1a1a1c',SM.PLASTIC));for(let k=0;k<8;k++)cpHex(mb,[-hx+.05+k*(2*hx-.1)/7,.33,(k%2?1:-1)*.088],[0,1,0],.006,.005);},30);
  /* the plugs' leads from the cover's middle to the distributor on the head's left end, its cap */
  {const dc=[-hx-.03,.27,.03];Q(mb=>{hdCyl(mb,[-hx+.01,.27,.03],dc,.03,.03,18,CASTA);hdCyl(mb,dc,V3.add(dc,[-.05,0,0]),.045,.04,20,SMC('#1a1a1c',SM.PLASTIC));
      for(let k=0;k<np;k++){const p=[xs(k),.39,0];hdCyl(mb,p,V3.add(p,[0,.02,0]),.009,.008,10,LEAD);hdTube(mb,suvPath([V3.add(p,[0,.02,0]),V3.add(p,[0,.05,.03]),[-hx+.02,.36,.05+k*.01],[dc[0]-.04,dc[1]+.02+(k%2)*.02,dc[2]+(k-1.5)*.018]],3,1),.0045,6,LEAD,false,false);}
      hdTube(mb,suvPath([[dc[0]-.05,dc[1],dc[2]],[dc[0]-.08,dc[1]+.02,dc[2]-.05],[-hx-.06,.12,-.14]],3,1),.006,6,HOSE,false,true);},30);}
  /* the timing belt's cover on the right end, the crank's pulley and damper, the water pump's, the alternator, the belt */
  Q(mb=>{hdRBox(mb,[hx+.025,.15,-.01],[.022,.22,.095],.02,BLKP,3);hdCyl(mb,[hx+.05,0,-.01],[hx+.075,0,-.01],.07,.07,28,DARK);hdCyl(mb,[hx+.05,.1,-.12],[hx+.07,.1,-.12],.04,.04,22,DARK);
    const al=[hx-.04,.14,-.17];hdCyl(mb,V3.add(al,[-.08,0,0]),V3.add(al,[.06,0,0]),.06,.06,24,CASTA);for(let k=0;k<10;k++){const a=k/10*TAU;hdRBox(mb,V3.add(al,[-.01,Math.cos(a)*.06,Math.sin(a)*.06]),[.06,.004,.004],.002,CASTA,1);}
    hdCyl(mb,V3.add(al,[.06,0,0]),V3.add(al,[.082,0,0]),.03,.03,18,DARK);
    const lp=[];for(const [cy0,cz,r,a0,a1] of [[0,-.01,.072,PI*.55,PI*1.75],[.1,-.12,.042,PI*1.75,PI*2.6],[.14,-.17,.032,PI*.6,PI*1.6]]){for(let q=0;q<=8;q++){const a=a0+(a1-a0)*q/8;lp.push([hx+.07,cy0+Math.sin(a)*r,cz+Math.cos(a)*r]);}}lp.push(lp[0]);
    hdSweep(mb,lp,[[-.0025,-.012],[.0025,-.012],[.0025,.012],[-.0025,.012]],HOSE,[1,0,0],true,false);},30);
  /* the intake: four runners forward from the head into the plenum along the front, the throttle body on its left end;
     the fuel rail over the runners, its injectors; the idle valve */
  const PLN=SMC('#9a9da2',SM.CAST),tb=Ew([-hx+.02,.31,-.25]);
  Q(mb=>{for(let k=0;k<np;k++){const x=xs(k);hdTube(mb,suvPath([[x,.24,-.1],[x,.26,-.15],[x,.3,-.2],[x,.32,-.22]],3,1),.021,12,PLN,false,true);obox(mb,[x,.24,-.106],[1,0,0],[0,1,0],[0,0,1],[.026,.026,.006],PLN);}
    hdRBox(mb,[.01,.33,-.245],[hx-.05,.04,.04],.03,PLN,4);for(let k=-4;k<=4;k++)hdRBox(mb,[.01+k*.045,.372,-.245],[.004,.004,.034],.002,PLN,1);
    hdCyl(mb,[-hx+.04,.32,-.25],[-hx+.0,.31,-.25],.036,.036,20,PLN);hdCyl(mb,[-hx+.0,.31,-.25],[-hx-.01,.31,-.25],.04,.04,20,CASTA);
    hdCyl(mb,[-hx+.06,.265,-.16],[hx-.06,.265,-.16],.008,.008,10,ALU);for(let k=0;k<np;k++){hdCyl(mb,[xs(k),.265,-.16],[xs(k),.235,-.12],.006,.006,8,BLKP);}
    hdRBox(mb,[hx-.07,.38,-.22],[.03,.02,.02],.006,BLKP,2);},30);
  /* the oil filter low at the front, the dipstick's loop */
  Q(mb=>{hdCyl(mb,[.08,.02,-.11],[.08,-.0,-.2],.04,.04,20,SMC('#1b4aa0',SM.PAINTED));const lp=[];for(let k=0;k<=12;k++){const a=k/12*TAU;lp.push([-.12+Math.cos(a)*.015,.43+Math.sin(a)*.015,-.12]);}hdTube(mb,lp,.0035,6,YEL,true,false);
    hdCyl(mb,[-.12,.41,-.12],[-.12,.1,-.1],.005,.005,6,ALU);},30);
  /* the exhaust: the manifold's four runners back from the head into the collector under its shield, the turbo (its
     iron turbine, the compressor beside it to the right, the wastegate's actuator), the downpipe down behind the
     engine and back to the underside's flange */
  const big=E0.turbo==='big',r0=big?.078:.062,tc=[.04,.17,.24],cc=[tc[0]+.11+(big?.02:0),tc[1],tc[2]];
  Q(mb=>{for(let k=0;k<np;k++){const x=xs(k);hdTube(mb,suvPath([[x,.25,.1],[x,.24,.15],[x*.6+tc[0]*.4,.21,.19],[tc[0]+(k-1.5)*.02,tc[1]+r0*.9,tc[2]-.02]],3,1),.019,12,IRON,false,true);obox(mb,[x,.25,.106],[1,0,0],[0,1,0],[0,0,1],[.026,.026,.006],IRON);}
    const sh=[];for(let k=0;k<=10;k++){const t=k/10;sh.push([-hx+.06+(2*hx-.12)*t,.27,.165]);}hdSweep(mb,sh,[[-.04,-.004],[.04,-.004],[.044,.004],[-.044,.004]],SHIELD,[0,.4,1],false,true);},35);
  Q(mb=>{ball(mb,tc,r0*1.1,20,IRON);hdCyl(mb,[tc[0]-.045,tc[1],tc[2]],[tc[0]+.03,tc[1],tc[2]],r0,r0,28,IRON);hdCyl(mb,[tc[0]+.03,tc[1],tc[2]],[tc[0]+.07,tc[1],tc[2]],r0*.45,r0*.45,18,DARK);
    ball(mb,cc,r0,20,CASTA);hdCyl(mb,[cc[0]-.04,cc[1],cc[2]],[cc[0]+.03,cc[1],cc[2]],r0*1.02,r0*1.02,28,CASTA);hdCyl(mb,[cc[0]+.03,cc[1],cc[2]],[cc[0]+.06,cc[1],cc[2]],r0*.6,r0*.56,24,CASTA);
    const wg=[tc[0]-.02,tc[1]+r0+.04,tc[2]+.05];hdCyl(mb,wg,V3.add(wg,[0,.035,0]),.026,.026,18,SMC('#2a2b2e',SM.PAINTED));hdCyl(mb,wg,[tc[0]-.03,tc[1]+.02,tc[2]+.03],.003,.003,6,ALU);},35);
  {const out=Ew([tc[0]-.04,tc[1]-.02,tc[2]+.04]),fl=Pt(.98,yb(.265),.25);ex.push({s:1,p:fl,turbo:{out:Ew([cc[0],cc[1]+r0*.9,cc[2]-.03]),inlet:Ew([cc[0]+.06,cc[1],cc[2]])}});
    Eo(mb=>{const R=suvPath([out,V3.add(out,[-.02,-.06,.1]),Pt(.84,yb(.34),.27),Pt(.9,yb(.28),.26),[fl[0]+.03,fl[1],fl[2]],fl],4,2);hdTube(mb,R,.03,14,SMC('#8b867c',SM.SATIN),false,true);
      obox(mb,[fl[0]+.004,fl[1],fl[2]],[1,0,0],[0,1,0],[0,0,1],[.004,.036,.036],IRON);},40);}
  /* the charge pipes: up out of the compressor, forward down the right side to the intercooler's right end; out of its
     left end, up the left of the radiator and back to the throttle body; the blow-off valve on it */
  {const t=ex[0].turbo;
    Eo(mb=>{const R=suvPath([t.out,V3.add(t.out,[0,.06,.03]),Pt(.62,yb(.62),.44),Pt(.4,yb(.5),.46),Pt(uic+.04,(yic0+yic1)/2,zic+.04),[X(uic),(yic0+yic1)/2,zic+.03]],5,2);hdTube(mb,R,.028,14,ALU,false,true);
      for(const q of [R[3],R[R.length-4]])hdCyl(mb,V3.add(q,[.008,0,0]),V3.add(q,[-.008,0,0]),.032,.032,14,SIL);},40);
    Eo(mb=>{const R=suvPath([[X(uic),(yic0+yic1)/2,-(zic+.03)],Pt(uic+.05,(yic0+yic1)/2,-(zic+.06)),Pt(.3,yb(.58),-.44),Pt(.38,tb[1]+.02,-.4),[tb[0]+.05,tb[1],tb[2]-.03],[tb[0]+.01,tb[1],tb[2]]],5,2);hdTube(mb,R,.03,14,ALU,false,true);
      for(const q of [R[4],R[R.length-3]])hdCyl(mb,V3.add(q,[.008,0,0]),V3.add(q,[-.008,0,0]),.034,.034,14,SIL);
      const bo=R[Math.round(R.length*.55)];hdCyl(mb,bo,V3.add(bo,[0,.05,0]),.022,.02,16,CASTA);hdCyl(mb,V3.add(bo,[0,.05,0]),V3.add(bo,[0,.06,0]),.016,.014,16,SMC('#b0201c',SM.PAINTED));},40);
    /* the air: the airbox on the right ahead of the tower and its duct to the compressor; or (o.engine.ram) the duct
       from a scoop's box down to it */
    if(!E0.ram){const box=Pt(.36,yb(.64),.42);
      P(mb=>{hdRBox(mb,box,[.06,.05,.07],.02,BLKP,4);hdRBox(mb,V3.add(box,[0,.051,0]),[.058,.004,.068],.012,SMC('#18181a',SM.PLASTIC),3);
        for(const [du,dz] of [[-.04,.07],[.04,.07],[-.04,-.07],[.04,-.07]])hdRBox(mb,V3.add(box,[du,.035,dz*1.02]),[.007,.013,.004],.002,HC.CAST,1);
        hdTube(mb,[Pt(.3,yb(.64),.45),Pt(.24,yb(.63),.48),Pt(.21,yb(.6),.5)],.026,14,BLKP,false,true);},32);
      Eo(mb=>{const R=suvPath([Pt(.42,yb(.64),.42),Pt(.52,yb(.63),.42),Pt(.66,yb(.6),.4),[t.inlet[0]+.04,t.inlet[1]+.04,t.inlet[2]+.06],[t.inlet[0],t.inlet[1],t.inlet[2]+.02],t.inlet],4,2);hdTube(mb,R,.034,16,HOSE,false,true);
        for(let k=3;k<R.length-3;k+=2)hdCyl(mb,V3.add(R[k],[.004,0,0]),V3.add(R[k],[-.004,0,0]),.037,.037,16,HOSE);hdCyl(mb,V3.add(t.inlet,[0,0,.012]),V3.add(t.inlet,[0,0,-.004]),.038,.038,16,BOLT);},40);}
    else{const a=Pt(.9,edge(.9)-.06,.2);
      Eo(mb=>{const R=suvPath([a,Pt(.86,yb(.62),.28),[t.inlet[0]+.02,t.inlet[1]+.06,t.inlet[2]+.04],[t.inlet[0],t.inlet[1],t.inlet[2]+.02],t.inlet],4,2);hdTube(mb,R,.042,16,HOSE,false,true);
        for(let k=2;k<R.length-2;k+=2)hdCyl(mb,V3.add(R[k],[.004,0,0]),V3.add(R[k],[-.004,0,0]),.045,.045,16,HOSE);hdCyl(mb,V3.add(t.inlet,[0,0,.012]),V3.add(t.inlet,[0,0,-.004]),.046,.046,16,BOLT);
        hdRBox(mb,V3.add(a,[0,.03,0]),[.06,.03,.08],.015,BLKP,3);},40);}
    /* (o.engine.antilag: the air valve between the intercooler's pipe and the exhaust manifold, its plumbing) */
    if(E0.antilag)Eo(mb=>{const v=Pt(.7,yb(.66),-.18),m=Ew([-.05,.25,.16]);hdCyl(mb,V3.add(v,[0,-.025,0]),V3.add(v,[0,.025,0]),.028,.028,18,CASTA);hdCyl(mb,V3.add(v,[0,.025,0]),V3.add(v,[0,.045,0]),.02,.02,16,SMC('#2a2b2e',SM.PAINTED));
      hdTube(mb,suvPath([V3.add(v,[.01,0,-.03]),Pt(.6,yb(.63),-.32),Pt(.45,yb(.62),-.4)],3,1),.012,10,SIL,false,true);hdTube(mb,suvPath([V3.add(v,[-.01,-.02,.02]),V3.add(v,[-.05,-.06,.08]),m],3,1),.011,10,SMC('#8b867c',SM.SATIN),false,true);
      hdTube(mb,suvPath([V3.add(v,[0,.045,0]),Pt(.8,yb(.72),-.1),Pt(uR-.02,edge(uR)-.16,.0)],3,1),.003,6,HOSE,false,true);},40);}
  /* the engine's mounts: the right on the right leg's top, the gearbox's on the left, the torque rod behind */
  Eo(mb=>{const r=Ew([hx+.02,.22,.05]);hdRBox(mb,V3.add(r,[0,0,.08]),[.05,.03,.05],.008,CASTA,2);hdCyl(mb,Pt(uc-.05,railTop(uc),.46),Pt(uc-.05,railTop(uc)+.07,.46),.035,.035,18,SV([.02,.02,.021],MAT.RUBBER));
    hdRBox(mb,Pt(uc-.05,railTop(uc)+.09,.4),[.04,.015,.08],.006,CASTA,2);},30);

  /* ================= the transaxle on the engine's left end ================= */
  {const xl=zc-hx-.05,GB=CASTA,ug=.64,yg=yC-.04,[du,dyD,dz]=LY.diff;
    /* the bell housing round the crank's end, the gearbox's case behind it out to the end cover; its ribs and bolts */
    Eo(mb=>{const ring=(z,r)=>{const o2=[];for(let k=0;k<32;k++){const a=k/32*TAU;o2.push([X(uc)+Math.cos(a)*r,yC+Math.sin(a)*r,z]);}return o2;};
      const R=[ring(xl,.17),ring(xl-.03,.18),ring(xl-.07,.165)];hdLoft(mb,R,GB,true);
      for(let k=0;k<12;k++){const a=k/12*TAU;cpHex(mb,[X(uc)+Math.cos(a)*.172,yC+Math.sin(a)*.172,xl-.004],[0,0,1],.007,.005);}
      const c=[X((uc+.8)/2),yC-.02,xl-.15];hdRBox(mb,c,[(.8-uc)/2+.05,.13,.09],.06,GB,5);hdRBox(mb,[c[0],c[1],xl-.245],[(.8-uc)/2+.02,.11,.012],.03,GB,3);
      for(const z of [xl-.08,xl-.13,xl-.19])hdRBox(mb,[c[0],c[1],z],[(.8-uc)/2+.055,.135,.004],.04,GB,2);
      for(let k=0;k<8;k++){const a=k/8*TAU;cpHex(mb,[c[0]+Math.cos(a)*.13,c[1]+Math.sin(a)*.09,xl-.257],[0,0,-1],.006,.005);}},30);
    /* the differential's housing behind and below the crank, its outputs; the transfer box beside it on the right, its
       output back to the propshaft */
    Eo(mb=>{const c=Pt(du,dyD,dz-.08);hdCyl(mb,V3.add(c,[0,0,-.1]),V3.add(c,[0,0,.1]),.11,.11,28,GB);hdCyl(mb,V3.add(c,[0,0,-.13]),V3.add(c,[0,0,-.1]),.05,.06,20,GB);
      const t=Pt(du+.04,dyD+.01,dz+.09);hdRBox(mb,t,[.085,.08,.07],.03,GB,4);hdCyl(mb,Pt(LY.ptu[0]-.04,LY.ptu[1],LY.ptu[2]),Pt(LY.ptu[0]+.02,LY.ptu[1],LY.ptu[2]),.05,.045,20,GB);
      hdCyl(mb,V3.add(t,[0,0,.07]),V3.add(t,[0,0,.1]),.045,.04,20,GB);for(let k=0;k<8;k++){const a=k/8*TAU;cpHex(mb,V3.add(c,[Math.cos(a)*.09,Math.sin(a)*.09,-.101]),[0,0,-1],.006,.005);}},30);
    /* the gear linkage's two rods back from the selector to the tunnel */
    Eo(mb=>{for(const dd of [0,.03]){const a=[X(ug+.1),yg+.1+dd,xl-.12],b=Pt(D.G.cowl+.1,yb(.4)+dd,-.05);hdCyl(mb,a,b,.006,.006,8,STEEL0());ball(mb,a,.01,10,STEEL0());}},30);}

  /* ================= under the hood: the pad (o.noPad: none), the pressed inner frame, the latch's striker ================= */
  {const FAB=SMC('#1c1c1e',MAT.FABRIC),nz=12;
    if(!o.noPad)for(let u=H.u0+.06;u<H.u1-.04;u+=.06){const v=Math.min(u+.06,H.u1-.04);for(let k=0;k<nz;k++){const f=u=>hz(u)-.06,z0=-f(u)+2*f(u)*k/nz,z1=-f(u)+2*f(u)*(k+1)/nz,w0=-f(v)+2*f(v)*k/nz,w1=-f(v)+2*f(v)*(k+1)/nz;
      ln.quad([X(u),topY(u,z0)-.014,z0],[X(u),topY(u,z1)-.014,z1],[X(v),topY(v,w1)-.014,w1],[X(v),topY(v,w0)-.014,w0],FAB[0],0,FAB[2]);}}
    hdPart(ln,mb=>{const rib=pts=>hdSweep(mb,pts,[[-.012,-.016],[.012,-.016],[.018,-.004],[-.018,-.004]],PAINT,[0,1,0],false,true);
      for(const s of [1,-1]){const pts=[];for(let u=H.u0+.03;u<=H.u1-.02;u+=.05)pts.push([X(u),topY(u,hz(u)-.03),s*(hz(u)-.03)]);rib(pts);
        const d=[];for(let t=0;t<=1.001;t+=.1){const u=H.u0+.1+(H.u1-H.u0-.2)*t,z=s*(hz(u)-.08)*(1-t*.8);d.push([X(u),topY(u,Math.abs(z))-.004,z]);}rib(d);}
      for(const u of [H.u0+.04,H.u1-.04,(H.u0+H.u1)/2]){const pts=[];for(let k=0;k<=16;k++){const z=-(hz(u)-.03)+2*(hz(u)-.03)*k/16;pts.push([X(u),topY(u,Math.abs(z))-.004,z]);}rib(pts);}},30);
    hdPart(ln,mb=>{const u=H.u0+.07,x=X(u);hdTube(mb,[[x,topY(u,0)-.02,-.02],[x,topY(u,0)-.05,-.02],[x,topY(u,0)-.05,.02],[x,topY(u,0)-.02,.02]],.004,8,BOLT,false,true);
      for(const s of [1,-1])hdCyl(mb,[x,topY(u,.5)-.016,s*.5],[x,topY(u,.5)-.03,s*.5],.012,.01,12,SV([.02,.02,.021],MAT.RUBBER));},30);}
  return {bay:st,engine:en,liner:ln,pivot:[X(uc),yC,zc],trans:true,ex,tris:(st.p.length+en.p.length+ln.p.length)/9};
}
function STEEL0(){return SMC('#2a2b2e',SM.ENGINE);}
