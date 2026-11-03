/* =====================================================================================
   AN ENGINE BAY FOR THE OTHER CARS, in place of the game's (31_engine_bay, which the SUV Studio kept as it was),
   laid out where the game lays its own: the engine against the firewall as low as its sump allows, under the hood.
   Three pieces, as the game splits them: the bay (shown with the hood up), the engine in it, and the pad under the
   hood (which lifts with it).
   - The bay: inner fenders with a rolled flange and the wheel tubs moulded round the tyre, shock towers on an
     independent front, the firewall and its insulation, the cowl's vented cover under the windshield, the radiator
     support with its latch, the radiator (tanks, a finned core, the cap), the shroud and the fan (or two electric
     fans), the battery and its hold-down, the fuse box, the coolant and washer bottles, the brake booster and master
     cylinder, the airbox, the wiring along the fenders, the hood's prop rod.
   - The engine, from what the car has (o.engine): a V8 (the block and pan, two heads, valve covers with their
     bolts and coil packs, the intake's plenum and eight runners, the throttle body, the fuel rails, the cast
     manifolds and their shields) or an inline four (the block, the head, the cam cover, the plug leads to a
     distributor, the intake runners, a turbo on the exhaust side with its intercooler piping); the front of either:
     the crank damper, water pump, alternator, compressor and the serpentine belt round them, the dipstick and filler.
   - Under the hood: the insulation pad and the hood's pressed inner frame.
   ===================================================================================== */
function hdBayGen(car,o){
  const K=HDK,D=K.D,b=car.b,lk=b.look,X=K.X,topY=D.topY,H=D.hood,hz=H.hz;
  const st=new MB(),en=new MB(),ln=new MB(),PAINT=SV([1,1,1],MAT.PAINT),UND=HC.LINER,DARK=SMC('#161618',SM.ENGINE),ALU=SMC('#8a8d92',SM.ENGINE),CASTI=SMC('#3c3833',SM.ENGINE),
    HOSE=SMC('#141414',SM.HOSE),PL=HC.PLASTIC,BLKP=SMC('#0f0f10',SM.PLASTIC);
  const uF=H.u0+.09,uR=H.u1-.02,edge=u=>topY(u,hz(u)),yFloor=D.sill((uF+uR)/2)+.02,tw=lk.track/2,zin=tw-lk.tyre.W/2-.05;
  const E=o.engine,trans=!!E.trans,np=E.layout==='V8'?4:E.cyl||4,len=np*.095+.14,hx=len/2;
  /* where the game puts it: back against the firewall (or across the nose), as low as the hood allows */
  const uc=trans?clamp((uF+.5+uR-.34)/2,uF+.42,uR-.3):Math.max(uF+.27,uR-.12-len)+hx;
  const topCore=E.layout==='V8'?.4:.47;let hm=9;for(let u=trans?uc-.35:uc-hx;u<=(trans?uc+.32:uc+hx+.1);u+=.05)hm=Math.min(hm,topY(u,.22));
  const yC=Math.max(yFloor+.12,Math.min(D.arch.cy+.2,hm-topCore-.03));
  const EM=trans?M4.basis([X(uc),yC,.06],[0,0,1],[0,1,0],[-1,0,0]):M4.basis([X(uc),yC,0],[1,0,0],[0,1,0],[0,0,1]);
  const Ew=p=>M4.xform(EM,p);
  /* (Salt Mini Plus: an electric car's layout 'EV' has no engine: nothing is drawn where it would be, no hoses run to it
     and nothing breathes; a front trunk stands in its place, the motor's inverter under it) */
  const EV=E.layout==='EV';
  const P=(f,deg=32)=>hdPart(st,f,deg),Q=(f,deg=32)=>EV?null:hdPart(en,f,deg,null,EM);
  /* ---------- the inner fenders: aprons from the tub up to a rolled flange, the tubs round the tyres ---------- */
  const N=40,ytub=u=>{const a=archY(D,u);return a>0?Math.min(edge(u)-.03,a+.045):-1;};
  for(const s of [1,-1]){
    P(mb=>{for(let k=0;k<N;k++){const ua=uF+(uR-uF)*k/N,ub=uF+(uR-uF)*(k+1)/N,za=s*(hz(ua)-.005),zb=s*(hz(ub)-.005),la=Math.max(yFloor,ytub(ua)),lb=Math.max(yFloor,ytub(ub));
      mb.quad([X(ua),la,za],[X(ub),lb,zb],[X(ub),edge(ub)-.03,zb],[X(ua),edge(ua)-.03,za],PAINT[0],0,PAINT[2]);
      /* the flange along the top, rolled outward */
      mb.quad([X(ua),edge(ua)-.03,za],[X(ub),edge(ub)-.03,zb],[X(ub),edge(ub)-.016,zb+s*.012],[X(ua),edge(ua)-.016,za+s*.012],PAINT[0],0,PAINT[2]);}});
    /* the tub: moulded round the tyre, from the apron in to the inner wall */
    P(mb=>{const rows=[];for(let k=0;k<=N;k++){const u=uF+(uR-uF)*k/N,t=ytub(u);if(t<=yFloor){rows.push(null);continue;}const zA=hz(u)-.005,row=[];
      for(let j=0;j<=6;j++){const f=j/6,z=zA+(zin-zA)*f,y=t+.03*Math.sin(f*PI)-.0*f;row.push([X(u),y,s*z]);}row.push([X(u),yFloor,s*zin]);rows.push(row);}
      for(let k=0;k<rows.length-1;k++){const A=rows[k],B=rows[k+1];if(!A||!B)continue;for(let j=0;j<A.length-1;j++)mb.quad(A[j],B[j],B[j+1],A[j+1],UND[0],0,UND[2]);}});
    if(lk.susp!=='solid'){const u=D.uFa,z=s*(hz(u)-.15),y0=Math.max(yFloor,ytub(u)),y1=edge(u)-.07;
      P(mb=>{hdCyl(mb,[X(u),y0,z],[X(u),y1,z],.09,.085,28,PAINT);hdCyl(mb,[X(u),y1,z],[X(u),y1+.008,z],.07,.07,28,DARK);hdCyl(mb,[X(u),y1,z],[X(u),y1+.04,z],.013,.013,10,HC.BOLT);
        for(let q=0;q<3;q++){const a=q/3*TAU;hdCyl(mb,[X(u)+Math.cos(a)*.065,y1,z+Math.sin(a)*.065],[X(u)+Math.cos(a)*.065,y1+.018,z+Math.sin(a)*.065],.008,.008,6,HC.BOLT);}});}
    /* the wiring along the apron's top, clipped down */
    P(mb=>{const pts=[];for(let k=0;k<=12;k++){const u=uF+.15+(uR-uF-.25)*k/12;pts.push([X(u),edge(u)-.06,s*(hz(u)-.035)]);}hdTube(mb,pts,.011,8,HOSE,false,true);
      for(let k=1;k<12;k+=3)hdRBox(mb,pts[k],[.008,.016,.016],.004,BLKP,2);});}
  /* ---------- the firewall, its insulation, the cowl's vented cover ---------- */
  {const z=hz(uR)-.005,ym=yFloor+(edge(uR)-yFloor)*.45,x=X(uR),FAB=SMC('#1d1d20',MAT.FABRIC);
    P(mb=>{mb.quad([x,yFloor,-z],[x,yFloor,z],[x,ym,z],[x,ym,-z],PAINT[0],0,PAINT[2]);
      const nn=16;for(let k=0;k<nn;k++){const za=-z+2*z*k/nn,zb=-z+2*z*(k+1)/nn,ba=.008*Math.sin(k*1.7);mb.quad([x+.004,ym,za],[x+.004,ym,zb],[x+.012+ba,edge(uR)-.02,zb],[x+.012+ba,edge(uR)-.02,za],FAB[0],0,FAB[2]);}});
    const y=edge(uR)-.015,xc=X(H.u1+.03);P(mb=>{const nn=40;for(let k=0;k<nn;k++){const za=-z+2*z*k/nn,zb=-z+2*z*(k+1)/nn,slot=k%3===1&&Math.abs(za)<z*.85;
      mb.quad([x,y,za],[x,y,zb],[xc,y+.012,zb],[xc,y+.012,za],(slot?HC.GB:PL)[0],0,(slot?HC.GB:PL)[2]);}});}
  /* ---------- the radiator support, the radiator, the shroud and fan ---------- */
  const yrT=edge(uF)-.1,yrB=Math.max(yFloor+.08,yrT-.45),yr=(yrT+yrB)/2,hr=(yrT-yrB)/2,zr=Math.min(.6,hz(uF)-.1);
  P(mb=>{hdRBox(mb,[X(uF),edge(uF)-.05,0],[.03,.025,hz(uF)-.02],.008,BLKP,2);
    /* the hood latch in the middle of it */
    hdRBox(mb,[X(uF)+.03,edge(uF)-.045,0],[.012,.03,.035],.004,HC.CAST,2);hdCyl(mb,[X(uF)+.04,edge(uF)-.02,0],[X(uF)+.04,edge(uF)-.005,0],.006,.006,8,HC.BOLT);
    /* the radiator: plastic tanks either side of a finned core, the cap on top */
    for(const s of [1,-1])hdRBox(mb,[X(uF+.05),yr,s*(zr+.025)],[.03,hr+.012,.025],.01,BLKP,3);
    hdRBox(mb,[X(uF+.05),yr,0],[.016,hr,zr],.003,SMC('#262728',SM.ENGINE),1);
    hdCyl(mb,[X(uF+.05),yrT+.012,zr*.7],[X(uF+.05),yrT+.045,zr*.7],.024,.022,18,MM.CHROME);},28);
  /* the core's fins: thin bars across it */
  P(mb=>{for(let y=yrB+.012;y<yrT-.008;y+=.012)hdRBox(mb,[X(uF+.05)+.017,y,0],[.002,.0025,zr-.005],.001,SMC('#3a3b3d',SM.ENGINE),1);},20);
  {const up=E.efans;if(up)for(const s of [1,-1]){const c=[X(uF+.115),yr,s*zr*.5],R=Math.min(hr,zr*.5)*.9;
      P(mb=>{hdCyl(mb,c,[c[0]-.035,c[1],c[2]],R+.012,R+.012,32,BLKP,false);hdCyl(mb,[c[0]-.035,c[1],c[2]],[c[0]-.06,c[1],c[2]],R*.3,R*.3,20,BLKP);
        for(let q=0;q<7;q++){const a=q/7*TAU;hdRBox(mb,[c[0]-.02,c[1]+Math.cos(a)*R*.62,c[2]+Math.sin(a)*R*.62],[.004,R*.32,.03],.004,BLKP,1);}});}
    else{const c=[X(uF+.13),yr,0],R=Math.min(hr,zr)*.92;
      P(mb=>{const sh=hdRRect(zr,hr,.06,6);hdLoft(mb,[sh.map(([a,bb])=>[X(uF+.075),yr+bb,a]),sh.map(([a,bb])=>[X(uF+.13),yr+bb*.92,a*.92])],BLKP,true);
        hdCyl(mb,[X(uF+.13),yr,0],[X(uF+.16),yr,0],R*.95,R*.95,48,BLKP,false);});
      Q(mb=>{const f=[hx+.16,.19,0];hdCyl(mb,[f[0]-.02,f[1],0],[f[0]+.02,f[1],0],.06,.06,20,DARK);
        for(let q=0;q<7;q++){const a=q/7*TAU,c2=Math.cos(a),s2=Math.sin(a);const M=[c2,s2];
          mb.quad([f[0],f[1]+c2*.07,s2*.07],[f[0]+.03,f[1]+Math.cos(a+.35)*.07,Math.sin(a+.35)*.07],[f[0]+.02,f[1]+Math.cos(a+.25)*R*.85,Math.sin(a+.25)*R*.85],[f[0]-.01,f[1]+Math.cos(a-.1)*R*.85,Math.sin(a-.1)*R*.85],DARK[0],0,DARK[2]);}});}}
  /* the hoses: top to the thermostat, bottom to the water pump, each with its clamps */
  if(!EV){const c=Ew([hx+.02,.26,0]),w=Ew([hx+.03,.12,-.05]),yu=Math.min(yrT-.04,c[1]+.04);
    P(mb=>{const top=[[X(uF+.08),yrT-.04,zr*.6],[X(uF+.18),yu,zr*.6],[c[0]+.1,yu,zr*.35],c],bot=[[X(uF+.08),yrB+.05,-zr*.6],[X(uF+.18),yrB+.05,-zr*.6],[w[0]+.1,yrB+.05,-zr*.35],w];
      hdTube(mb,top,.022,12,HOSE,false,true);hdTube(mb,bot,.024,12,HOSE,false,true);
      for(const pth of [top,bot])for(const p of [pth[0],pth[pth.length-1]]){const q=V3.lerp(p,pth[pth[0]===p?1:pth.length-2],.15);hdCyl(mb,V3.add(q,[.006,0,0]),V3.add(q,[-.006,0,0]),.027,.027,14,HC.BOLT);}});}
  /* ---------- the furniture ---------- */
  /* the battery: a black case, its ribs, the red and black terminal covers, the hold-down */
  {const u=uF+.22,z=-(hz(u)-.17),yb=Math.max(yFloor+.2,edge(u)-.38),c=[X(u),yb+.09,z];
    P(mb=>{hdRBox(mb,c,[.1,.09,.075],.008,BLKP,3);hdRBox(mb,[c[0],c[1]+.092,c[2]],[.095,.004,.07],.004,SMC('#242427',SM.PLASTIC),2);
      hdRBox(mb,[c[0]+.055,c[1]+.1,c[2]+.04],[.016,.012,.016],.005,SMC('#b01e18',SM.PLASTIC),2);hdRBox(mb,[c[0]-.055,c[1]+.1,c[2]+.04],[.016,.012,.016],.005,BLKP,2);
      hdRBox(mb,[c[0],c[1]+.094,c[2]-.06],[.11,.006,.008],.003,HC.CAST,1);for(const dx of [-.105,.105])hdCyl(mb,[c[0]+dx,c[1]+.094,c[2]-.06],[c[0]+dx,c[1]-.1,c[2]-.06],.004,.004,6,HC.BOLT);
      hdTube(mb,[[c[0]+.055,c[1]+.11,c[2]+.04],[c[0]+.1,c[1]+.14,c[2]+.08],[c[0]+.2,c[1]+.08,c[2]+.12]],.008,8,SMC('#b01e18',SM.HOSE),false,true);
      hdTube(mb,[[c[0]-.055,c[1]+.11,c[2]+.04],[c[0]-.12,c[1]+.12,c[2]+.03],[c[0]-.16,c[1],c[2]+.1]],.008,8,HOSE,false,true);});}
  /* the brake booster and master cylinder on the driver's side of the firewall */
  {const u=uR-.12,z=-(hz(u)-.26),y=edge(u)-.21,x=X(uR);
    hdPart(st,mb=>{hdRev(mb,[[0,0],[.12,0],[.135,.02],[.135,.07],[.12,.09],[0,.095]],40,BLKP);},30,null,M4.mul(M4T(x,y,z),M4RZ(-PI/2)));
    P(mb=>{hdCyl(mb,[x+.095,y+.02,z],[x+.27,y+.02,z],.032,.032,16,ALU);hdRBox(mb,[x+.19,y+.08,z],[.05,.032,.04],.008,SMC('#cfc8b8',SM.PLASTIC),3);
      hdCyl(mb,[x+.19,y+.112,z],[x+.19,y+.13,z],.022,.022,16,SMC('#d6b21a',SM.PLASTIC));});}
  /* the fuse box, the coolant bottle (its cap), the washer bottle (its blue cap) */
  {const u=uR-.14,z=hz(u)-.2;P(mb=>{hdRBox(mb,[X(u),edge(u)-.13,z],[.08,.05,.1],.012,BLKP,3);hdRBox(mb,[X(u),edge(u)-.078,z],[.082,.004,.102],.006,BLKP,2);
    for(const dz of [-.08,.08])hdRBox(mb,[X(u)+.082,edge(u)-.1,z+dz],[.004,.012,.008],.002,BLKP,1);});}
  {const u=uF+.5,z=hz(u)-.15;P(mb=>{hdRBox(mb,[X(u),edge(u)-.2,z],[.07,.07,.055],.02,SMC('#d4d0c4',SM.PLASTIC),4);hdCyl(mb,[X(u),edge(u)-.13,z],[X(u),edge(u)-.105,z],.027,.025,18,SMC('#1b1b1c',SM.PLASTIC));
    hdRBox(mb,[X(u)+.071,edge(u)-.2,z],[.001,.03,.002],.0005,BLKP,1);});}
  {const u=uF+.3,z=hz(u)-.13;P(mb=>{hdRBox(mb,[X(u),edge(u)-.18,z],[.06,.08,.05],.02,SMC('#cfd2d4',SM.PLASTIC),4);hdCyl(mb,[X(u),edge(u)-.1,z],[X(u),edge(u)-.08,z],.022,.02,16,SMC('#1d5fb0',SM.PLASTIC));});}
  /* the hood's prop rod, folded along the radiator support */
  P(mb=>{const a=[X(uF)-.01,edge(uF)-.04,-(hz(uF)-.12)],bb=[X(uF)-.01,edge(uF)-.04,hz(uF)-.3];hdCyl(mb,a,bb,.0045,.0045,8,SMC('#2a2a2c',SM.ENGINE));hdCyl(mb,a,V3.add(a,[0,-.03,0]),.006,.006,8,BLKP);});
  /* ---------- the engine ---------- */
  const I={tb:null,turbo:null,top:topCore};
  const BLK=SMC(E.block||'#2b2c2f',SM.ENGINE),HEAD=SMC(E.head||'#74777c',SM.ENGINE),COV=SMC(E.cover||'#1b1c1e',E.coverPaint?SM.PAINTED:SM.ENGINE),xs=k=>-hx+.07+(k+.5)*(len-.14)/np;
  /* the bottom end, the pan, the front cover, the bell housing */
  Q(mb=>{hdRBox(mb,[0,-.13,0],[hx-.02,.075,E.layout==='V8'?.19:.13],.02,SMC('#141416',SM.ENGINE),3);hdRBox(mb,[hx+.015,.1,0],[.016,.17,E.layout==='V8'?.17:.12],.02,BLK,3);
    hdCyl(mb,[-hx,.03,0],[-hx-.22,0,0],.21,.13,32,ALU);
    for(let k=0;k<np+1;k++)hdRBox(mb,[-hx+.06+k*(len-.12)/np,-.06,0],[.006,.02,E.layout==='V8'?.2:.14],.004,SMC('#141416',SM.ENGINE),1);});
  /* the front: crank damper, water pump, alternator, compressor, tensioner, and the belt round them */
  {const pul=[[[hx+.07,-.03,0],.085,DARK],[[hx+.06,.17,0],.06,ALU],[[hx+.07,E.layout==='V8'?.33:.1,-.2],.042,ALU],[[hx+.07,-.0,.2],.052,ALU],[[hx+.07,.25,.11],.032,DARK]];
    Q(mb=>{for(const [c,r,m] of pul){hdCyl(mb,[c[0]-.03,c[1],c[2]],[c[0]+.012,c[1],c[2]],r,r,32,m);hdCyl(mb,[c[0]+.012,c[1],c[2]],[c[0]+.016,c[1],c[2]],r*.45,r*.45,20,HC.BOLT);}
      /* the alternator's body behind its pulley, the compressor's */
      hdCyl(mb,[hx-.1,pul[2][0][1],pul[2][0][2]],[hx+.04,pul[2][0][1],pul[2][0][2]],.065,.065,24,ALU);hdCyl(mb,[hx-.12,pul[3][0][1],pul[3][0][2]],[hx+.04,pul[3][0][1],pul[3][0][2]],.06,.06,24,ALU);
      /* the belt: round the pulleys in order, a flat band */
      const ord=[0,3,1,4,2],pts=[];for(let k=0;k<=ord.length;k++){const [c,r]=pul[ord[k%ord.length]],[c2]=pul[ord[(k+1)%ord.length]],[c0]=pul[ord[(k+ord.length-1)%ord.length]];
        const mid=[(c0[1]+c2[1])/2-c[1],(c0[2]+c2[2])/2-c[2]],l=Math.hypot(mid[0],mid[1])||1;pts.push([hx+.075,c[1]-mid[0]/l*r*1.02,c[2]-mid[1]/l*r*1.02]);}
      hdSweep(mb,pts,[[-.003,-.011],[.003,-.011],[.003,.011],[-.003,.011]],HOSE,[1,0,0],true,false);});}
  if(E.layout==='V8'){
    Q(mb=>{hdRBox(mb,[0,.02,0],[hx,.11,.2],.02,BLK,3);});
    for(const s of [1,-1]){const a=PI/4,d=[0,Math.cos(a),s*Math.sin(a)],az=V3.norm([0,-d[2],d[1]]),out2=V3.mul(az,s),Pt=(t,oo)=>V3.add(V3.mul(d,t),V3.mul(out2,oo));
      Q(mb=>{obox(mb,Pt(.15,0),[1,0,0],d,az,[hx,.1,.12],BLK);obox(mb,Pt(.29,0),[1,0,0],d,az,[hx-.02,.04,.118],HEAD);});
      /* the valve cover: rounded, ribbed on top, its bolts round the edge, a coil pack over each plug */
      Q(mb=>{rbox(mb,Pt(.37,0),[1,0,0],d,az,[hx-.035,.042,.105],COV,.28,20,8);
        for(let k=0;k<6;k++)obox(mb,V3.add(Pt(.412,-.04+k*.016),[0,0,0]),[1,0,0],d,az,[hx-.08,.004,.004],COV);
        for(let k=0;k<5;k++)for(const e of [-1,1])hdCyl(mb,V3.add(Pt(.335,e*.1),[-hx+.06+k*(len-.12)/4,0,0]),V3.add(Pt(.35,e*.1),[-hx+.06+k*(len-.12)/4,0,0]),.007,.007,6,HC.BOLT);
        for(let k=0;k<np;k++){const c=V3.add(Pt(.41,s*-.035),[xs(k)+s*.024,0,0]);hdRBox(mb,c,[.022,.022,.034],.006,BLKP,2);hdTube(mb,[V3.add(c,[0,.01,-s*.03]),V3.add(c,[0,.03,-s*.07]),[xs(k)+s*.024,.42,0]],.005,6,HOSE,false,false);}},30);
      /* the exhaust: a cast log off the head's outer side, its heat shield, the pipe down */
      Q(mb=>{const a2=V3.add(Pt(.24,.14),[-hx+.07,0,0]),b2=V3.add(Pt(.24,.14),[hx-.07,0,0]);hdCyl(mb,a2,b2,.034,.034,14,CASTI);
        for(let k=0;k<np;k++){const p=V3.add(Pt(.27,.12),[xs(k)+s*.024,0,0]);hdCyl(mb,p,V3.add(p,V3.mul(out2,.05)),.024,.026,12,CASTI);}
        hdTube(mb,[a2,[a2[0]-.06,a2[1]-.06,a2[2]],[a2[0]-.08,-.24,a2[2]*.9]],.032,12,CASTI,false,true);
        const sh=[];for(let k=0;k<=8;k++){const t=k/8;sh.push(V3.add(V3.lerp(a2,b2,t),V3.mul(out2,.045)));}hdSweep(mb,sh,[[-.05,-.012],[.05,-.012],[.054,0],[-.054,0]],ALU,[0,1,0],false,true);},30);}
    /* the intake: a plastic plenum on eight runners, the throttle body on its front, the fuel rails */
    Q(mb=>{hdRBox(mb,[-.02,.38,0],[hx-.08,.05,.11],.04,SMC('#1e1f21',SM.PLASTIC),5);
      for(const s of [1,-1])for(let k=0;k<np;k++){const x=xs(k)+s*.024;hdTube(mb,[[x,.36,0],[x,.36,s*.09],[x,.3,s*.14]],.022,12,SMC('#1e1f21',SM.PLASTIC),false,true);}
      for(const s of [1,-1])hdCyl(mb,[-hx+.05,.31,s*.16],[hx-.05,.31,s*.16],.009,.009,10,ALU);
      hdCyl(mb,[hx-.1,.38,0],[hx+.02,.38,0],.045,.045,24,ALU);hdCyl(mb,[hx+.02,.38,0],[hx+.035,.38,0],.05,.05,24,ALU);
      hdRBox(mb,[hx-.04,.4,.055],[.02,.02,.012],.004,DARK,1);});
    I.tb=[hx+.035,.38,0];
    /* the oil filler and the dipstick's yellow loop */
    Q(mb=>{hdCyl(mb,[-.1,.42,.15],[-.1,.45,.15],.022,.024,18,SMC('#d6b21a',SM.PLASTIC));const lp=[];for(let k=0;k<=12;k++){const a=k/12*TAU;lp.push([hx-.12+Math.cos(a)*.016,.43+Math.sin(a)*.016,-.2]);}hdTube(mb,lp,.004,6,SMC('#d6b21a',SM.PLASTIC),true,false);
      hdCyl(mb,[hx-.12,.41,-.2],[hx-.12,.1,-.22],.005,.005,6,ALU);});
  }else{
    /* an inline four (or five): the block, the head, the cam cover (bolted, ribbed), the plug leads to the distributor
       (or a coil on each plug) */
    Q(mb=>{hdRBox(mb,[0,.1,0],[hx,.16,.15],.02,BLK,3);hdRBox(mb,[0,.31,0],[hx-.02,.05,.14],.012,HEAD,3);
      rbox(mb,[0,.39,0],[1,0,0],[0,1,0],[0,0,1],[hx-.04,.048,.118],COV,.28,20,8);
      for(let k=0;k<4;k++)obox(mb,[-.06+k*.04,.437,0],[1,0,0],[0,1,0],[0,0,1],[.004,.006,.09],COV);
      for(let k=0;k<6;k++)for(const e of [-1,1])hdCyl(mb,[-hx+.06+k*(len-.12)/5,.36,e*.12],[-hx+.06+k*(len-.12)/5,.37,e*.12],.007,.007,6,HC.BOLT);
      if(E.coils){
        /* (Salt Mini Plus: a later engine's coil on each plug, in a row down the cam cover, their loom along the top) */
        for(let k=0;k<np;k++){const x=xs(k);hdRBox(mb,[x,.465,.02],[.026,.03,.038],.008,BLKP,3);hdCyl(mb,[x,.495,.042],[x,.505,.06],.007,.007,8,SMC('#3a3a3c',SM.PLASTIC));}
        hdTube(mb,[[-hx+.02,.5,.07],[hx-.02,.5,.07],[hx+.04,.46,.09]],.009,8,SMC('#141414',SM.HOSE),false,true);}
      else{const dist=[-hx-.05,.36,-.06];hdCyl(mb,[dist[0]+.06,dist[1],dist[2]],dist,.04,.035,20,DARK);hdCyl(mb,dist,[dist[0]-.03,dist[1],dist[2]],.045,.04,20,SMC('#2b2b2d',SM.PLASTIC));
      for(let k=0;k<np;k++){const p=[xs(k),.44,.02],q=[dist[0]-.03,dist[1]+.01+Math.cos(k)*.02,dist[2]+Math.sin(k)*.02];hdTube(mb,[p,[p[0],.5,.03],[(p[0]+q[0])/2,.5,.0],q],.0055,6,SMC(E.leads||'#1a1a1a',SM.HOSE),false,false);hdCyl(mb,[p[0],.44,.02],[p[0],.47,.02],.012,.011,10,BLKP);}}
      /* the intake runners on the front side, the throttle body */
      hdRBox(mb,[0,.31,-.33],[hx-.04,.06,.05],.03,ALU,4);for(let k=0;k<np;k++)hdTube(mb,[[xs(k),.33,-.13],[xs(k),.38,-.22],[xs(k),.33,-.29]],.022,12,ALU,false,true);
      hdCyl(mb,[hx-.06,.31,-.33],[hx+.05,.31,-.33],.042,.042,20,ALU);
      /* the exhaust manifold on the back, into the turbo */
      for(let k=0;k<np;k++){const p=[xs(k),.27,.155];hdTube(mb,[p,[p[0],.24,.22],[-hx*.15,.16,.27]],.022,10,CASTI,false,true);}});
    I.tb=[hx+.05,.31,-.33];
    if(E.turbo){const c=[-hx*.15,.14,.3],r0=.075;I.turbo={c,r0};
      Q(mb=>{ball(mb,c,r0*1.1,16,CASTI);hdCyl(mb,[c[0]-.04,c[1],c[2]],[c[0]+.03,c[1],c[2]],r0,r0,24,CASTI);hdCyl(mb,[c[0]+.03,c[1],c[2]],[c[0]+.07,c[1],c[2]],r0*.45,r0*.45,16,DARK);
        const cc=[c[0]+.11,c[1],c[2]];ball(mb,cc,r0,16,ALU);hdCyl(mb,[cc[0]-.04,cc[1],cc[2]],[cc[0]+.03,cc[1],cc[2]],r0*1.02,r0*1.02,24,ALU);
        hdTube(mb,[[c[0],c[1]-r0,c[2]],[c[0]-.03,-.12,c[2]*.95],[c[0]-.05,-.26,c[2]*.9]],.04,14,CASTI,false,true);
        /* the wastegate's actuator, its rod */
        hdCyl(mb,[cc[0]+.02,cc[1]+.09,cc[2]-.04],[cc[0]+.06,cc[1]+.09,cc[2]-.04],.028,.028,18,ALU);hdCyl(mb,[cc[0]+.02,cc[1]+.09,cc[2]-.04],[c[0]+.02,c[1]+.04,c[2]-.05],.003,.003,6,ALU);},30);}
  }
  /* ---------- an electric car's front trunk ---------- */
  if(EV){const TUB=SMC('#1b1b1d',SM.PLASTIC),u0=uF+.36,u1=uR-.32,uc2=(u0+u1)/2,zt=Math.min(.5,zin-.1),yTop=u=>edge(u)-.075,yBot=Math.max(yFloor+.25,D.arch.cy+.12);
    const ring=(t,grow=0)=>hdRRect((u1-u0)/2*(1-.08*t)+grow,zt*(1-.08*t)+grow,.07*(1-.3*t)+grow,6).map(([a,b])=>{const u=uc2+a;return [X(u),yTop(u)+(yBot-yTop(u))*t,b];});
    /* the tub, moulded in one: walls drawing in a little to a flat floor */
    hdPart(en,mb=>{const R=[0,.12,.4,.75,.93,1].map(t=>ring(t));hdLoft(mb,R,TUB,true,true);hdCap(mb,R[5],TUB,false);},35);
    /* its rim, a flange out to the aprons, and the seal round it */
    hdPart(en,mb=>{hdLoft(mb,[ring(0,.035),ring(0)],TUB,true,true);},35);
    hdPart(en,mb=>{const r=ring(0,.02).map(v=>[v[0],v[1]+.006,v[2]]);r.push(r[0]);hdTube(mb,r,.007,8,SV([.015,.015,.016],MAT.RUBBER),false,false);},40);
    /* four tie-down loops in its corners, a ribbed mat on its floor */
    for(const [a,b] of [[1,1],[1,-1],[-1,1],[-1,-1]]){const u=uc2+a*((u1-u0)/2-.09),z=b*(zt-.09),y=yBot+.004,P0=[X(u),y,z];
      hdPart(en,mb=>{const pts=[];for(let k=0;k<=10;k++){const t=k/10*PI;pts.push([P0[0]+Math.cos(t)*.018*a,y+Math.sin(t)*.022,z]);}hdTube(mb,pts,.0035,8,MM.CHROME,false,true);hdRBox(mb,[P0[0],y,z],[.026,.004,.012],.003,HC.CAST,1);},40);}
    hdPart(en,mb=>{for(let z=-zt+.08;z<=zt-.08+1e-6;z+=.04)hdRBox(mb,[X(uc2),yBot+.003,z],[(u1-u0)/2-.06,.003,.008],.003,SMC('#141415',SM.RUBBER),1);},30);
    /* under it, the front motor's inverter in its cast case, the orange high-voltage cables back along the aprons */
    const xi=X(D.uFa),yi=Math.max(yFloor+.08,yBot-.12);
    hdPart(en,mb=>{hdRBox(mb,[xi,yi,0],[.13,.06,.24],.025,ALU,4);for(let k=-4;k<=4;k++)hdRBox(mb,[xi+.131,yi,k*.05],[.004,.045,.01],.003,ALU,1);
      hdCyl(mb,[xi,yi-.06,0],[xi,yi-.14,0],.12,.12,32,ALU);},35);
    for(const s2 of [1,-1])hdPart(en,mb=>{const ORA=SMC('#e8761e',SM.HOSE),z0=s2*.2,pts=[[xi-.13,yi+.03,z0],[xi-.2,yi+.08,s2*(zt+.06)],[X(u1-.05),yTop(u1)-.12,s2*(zt+.07)],[X(uR-.06),edge(uR)-.2,s2*(zt+.02)]];
      hdTube(mb,pts,.013,10,ORA,false,true);hdTube(mb,pts.map(v=>[v[0],v[1]-.028,v[2]]),.01,10,ORA,false,true);},40);}
  /* ---------- breathing: an airbox and its tube to the throttle body, or a turbo's pipes and the intercooler ---------- */
  if(!EV){const tb=Ew(I.tb),zA=hz(uF+.25)-.22,box=[X(uF+.25),edge(uF+.25)-.17,-zA];
    if(E.turbo&&I.turbo){const c=Ew(I.turbo.c),cc=Ew([I.turbo.c[0]+.14,I.turbo.c[1],I.turbo.c[2]]),zic=zr+.05,yic=yrB+.02,xic=X(uF-.035);
      P(mb=>{hdRBox(mb,[xic,yic,0],[.025,.07,zic+.02],.006,SMC('#2a2b2d',SM.ENGINE),2);for(let y=yic-.06;y<yic+.06;y+=.01)hdRBox(mb,[xic+.026,y,0],[.002,.002,zic],.001,SMC('#3a3b3d',SM.ENGINE),1);
        for(const s of [1,-1])hdRBox(mb,[xic,yic,s*(zic+.04)],[.03,.08,.02],.008,ALU,2);});
      P(mb=>{hdTube(mb,[cc,[cc[0],cc[1]+.08,cc[2]],[X(uF+.12),yic+.06,zic],[xic,yic,zic]],.033,12,ALU,false,true);hdTube(mb,[[xic,yic,-zic],[X(uF+.12),yic+.06,-zic],[tb[0]+.12,tb[1],tb[2]],tb],.036,12,ALU,false,true);
        const inl=Ew([I.turbo.c[0]+.14,I.turbo.c[1],I.turbo.c[2]]);hdTube(mb,[V3.add(inl,[0,0,0]),[inl[0],inl[1]+.1,inl[2]],[box[0]-.1,box[1],box[2]]],.04,12,HOSE,false,true);
        /* the blow-off valve on the charge pipe */
        const bo=V3.lerp([X(uF+.12),yic+.06,-zic],tb,.4);hdCyl(mb,bo,V3.add(bo,[0,.05,0]),.022,.02,16,ALU);});}
    else P(mb=>{const ribs=[];for(let k=0;k<=14;k++){const t=k/14;ribs.push(V3.lerp([box[0]-.12,box[1],box[2]],tb,t).map((v,i)=>i===1?v+.04*Math.sin(t*PI):v));}
      ribs.push(V3.add(tb,[.01,0,0]));hdTube(mb,ribs,o.tubeR||.045,16,HOSE,false,true);
      for(let k=2;k<13;k+=2)hdCyl(mb,V3.add(ribs[k],[.004,0,0]),V3.add(ribs[k],[-.004,0,0]),(o.tubeR||.045)*1.08,(o.tubeR||.045)*1.08,16,HOSE);});
    P(mb=>{hdRBox(mb,box,[.12,.075,.11],.02,BLKP,4);hdRBox(mb,[box[0],box[1]+.076,box[2]],[.118,.004,.108],.012,SMC('#18181a',SM.PLASTIC),3);
      for(const [dx,dz] of [[-.1,.1],[.1,.1],[-.1,-.1],[.1,-.1]])hdRBox(mb,[box[0]+dx,box[1]+.06,box[2]+dz*1.08],[.008,.018,.004],.002,HC.CAST,1);
      hdCyl(mb,[box[0]+.12,box[1]-.03,box[2]],[box[0]+.2,box[1]-.05,box[2]],.05,.055,20,BLKP);});}
  /* ---------- under the hood: the insulation pad, the hood's pressed inner frame ---------- */
  {const FAB=SMC('#1c1c1e',MAT.FABRIC),nz=10;
    for(let u=H.u0+.06;u<H.u1-.04;u+=.06){const v=Math.min(u+.06,H.u1-.04);for(let k=0;k<nz;k++){const f=u=>hz(u)-.06,z0=-f(u)+2*f(u)*k/nz,z1=-f(u)+2*f(u)*(k+1)/nz,w0=-f(v)+2*f(v)*k/nz,w1=-f(v)+2*f(v)*(k+1)/nz;
      ln.quad([X(u),topY(u,z0)-.014,z0],[X(u),topY(u,z1)-.014,z1],[X(v),topY(v,w1)-.014,w1],[X(v),topY(v,w0)-.014,w0],FAB[0],0,FAB[2]);}}
    hdPart(ln,mb=>{const rib=(pts)=>hdSweep(mb,pts,[[-.012,-.016],[.012,-.016],[.018,-.004],[-.018,-.004]],PAINT,[0,1,0],false,true);
      for(const s of [1,-1]){const pts=[];for(let u=H.u0+.03;u<=H.u1-.02;u+=.05)pts.push([X(u),topY(u,hz(u)-.03),s*(hz(u)-.03)]);rib(pts);
        const d=[];for(let t=0;t<=1.001;t+=.1){const u=H.u0+.12+(H.u1-H.u0-.25)*t,z=s*(hz(u)-.08)*(1-t*.8);d.push([X(u),topY(u,Math.abs(z))-.004,z]);}rib(d);}
      for(const u of [H.u0+.04,H.u1-.04]){const pts=[];for(let k=0;k<=16;k++){const z=-(hz(u)-.03)+2*(hz(u)-.03)*k/16;pts.push([X(u),topY(u,Math.abs(z))-.004,z]);}rib(pts);}},30);}
  return {bay:st,engine:en,liner:ln,pivot:[X(uc),yC,0],trans,tris:(st.p.length+en.p.length+ln.p.length)/9};
}
