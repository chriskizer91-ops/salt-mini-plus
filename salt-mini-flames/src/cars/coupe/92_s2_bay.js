/* =====================================================================================
   THE COUPE'S ENGINE BAY, ITS OWN (models/src/cars/coupe/87_bay, in place of 79_bay hdBayGen's shared one): the
   factory 5.2 flat-plane V8 as a track car's, set where the game sets it, back against the firewall and as high as
   the bonnet allows. Laid out round the deeper wheel houses and the cradle below (88_under), and drawn all the time
   as part of the body, so whatever reaches down out of it meets the underside.
   - The bay: aprons with a rolled flange, the tubs moulded over the wheel houses (their inner walls stopping short
     so the wishbones pass under), the coilovers' top mounts with their adjuster knobs; the firewall with the
     tunnel's mouth left open, its insulation, the cowl's vented tray; a carbon brace from each top mount back to
     the cowl.
   - The front: the radiator support and its latch, the condenser and the radiator, the oil cooler low in front of
     them, the shroud with two fans; the hoses, the condenser's lines to the compressor and the firewall.
   - Furniture: the dry sump's tank with its braided lines, the coolant tank, the washer bottle low down, the airbox
     fed from behind the grille with its tube to the throttle body; the brake booster and master cylinder with the
     ABS unit beside them and its hard lines; the ECU on the right wall, the fuse box, the jump post (the battery is
     in the boot); the harness along the firewall and the aprons; the prop rod.
   - The engine: a shallow dry-sump pan with fins, its scavenge pump and drive; the block, the heads, red crinkle cam
     covers with a coil and its connector over each plug and the looms; stainless four-into-one headers down each
     side to the collectors; a cast plenum with eight runners and a ribbed crinkle top, injectors, fuel rails with
     the crossover and the regulator; the throttle body; the front's belt round the damper, pump, alternator and
     compressor; the thermostat housing, the heater hoses; the bell housing; the filler and the dipstick.
   - Under the bonnet: the insulation pad and the bonnet's pressed inner frame (these lift with it).
   ===================================================================================== */
function cpBay2(car){
  const K=HDK,D=K.D,b=car.b,lk=b.look,X=K.X,topY=D.topY,H=D.hood,hz=H.hz;
  const st=new MB(),en=new MB(),ln=new MB(),PAINT=SV([1,1,1],MAT.PAINT),LIN=HC.LINER,DARK=SMC('#161618',SM.ENGINE),ALU=SMC('#8a8d92',SM.ENGINE),CASTA=SMC('#a3a6ab',SM.CAST),
    CASTI=SMC('#3c3833',SM.ENGINE),HOSE=SMC('#141414',SM.HOSE),PL=HC.PLASTIC,BLKP=SMC('#0f0f10',SM.PLASTIC),CF=SV([1,1,1],MAT.CARBON),
    BRAID=SMC('#7d7f83',SM.SATIN),ANB=SMC('#1f4fb8',SM.PAINTED),ANR=SMC('#b8221c',SM.PAINTED),SS=SMC('#b3aea4',SM.SATIN),SSB=SMC('#8d7a66',SM.SATIN),LINE=SMC('#c0c2c5',SM.BOLT),
    RED=SMC('#b0201c',SM.PAINTED),REDC=SMC('#a51d19',SM.PLASTIC),BOLT=HC.BOLT,YEL=SMC('#d6b21a',SM.PLASTIC),WHT=SMC('#d4d0c4',SM.PLASTIC);
  const uF=H.u0+.09,uR=H.u1-.02,edge=u=>topY(u,hz(u)),yFloor=.205,zin=.51,Pt=(u,y,z)=>[X(u),y,z];
  /* (what may stand in the bay at (u, z): under the bonnet's skin, with room for its pad) */
  const roof=(u,z)=>topY(u,Math.abs(z))-.03;
  /* the engine: placed as the game places it */
  const np=4,len=np*.095+.14,hx=len/2,uc=Math.max(uF+.27,uR-.12-len)+hx;
  let hm=9;for(let u=uc-hx;u<=uc+hx+.1;u+=.05)hm=Math.min(hm,topY(u,.22));
  const yC=Math.max(yFloor+.12,Math.min(D.arch.cy+.2,hm-.43)),EM=M4.basis([X(uc),yC,0],[1,0,0],[0,1,0],[0,0,1]),Ew=p=>M4.xform(EM,p);
  const P=(f,deg=32)=>hdPart(st,f,deg),Q=(f,deg=32)=>hdPart(en,f,deg,null,EM),E=(f,deg=32)=>hdPart(en,f,deg);
  const xs=k=>-hx+.07+(k+.5)*(len-.14)/np;

  /* ================= the bay ================= */
  /* the wheel houses' tops, over the liners and under the bonnet */
  const archTop=(u,z)=>{const a=archY(D,u);if(a<0)return -1;return Math.min(Math.max(a+.035,a+.012+.01+.008),roof(u,z)+.022);};
  const N=48;
  for(const s of [1,-1]){
    /* the apron from the floor (or the tub) up to a rolled flange under the bonnet's edge */
    P(mb=>{for(let k=0;k<N;k++){const ua=uF+(uR-uF)*k/N,ub=uF+(uR-uF)*(k+1)/N,za=s*(hz(ua)-.005),zb=s*(hz(ub)-.005),ta=archTop(ua,za),tb=archTop(ub,zb),la=Math.max(yFloor,ta),lb=Math.max(yFloor,tb);
      mb.quad([X(ua),la,za],[X(ub),lb,zb],[X(ub),edge(ub)-.03,zb],[X(ua),edge(ua)-.03,za],PAINT[0],0,PAINT[2]);
      mb.quad([X(ua),edge(ua)-.03,za],[X(ub),edge(ub)-.03,zb],[X(ub),edge(ub)-.016,zb+s*.012],[X(ua),edge(ua)-.016,za+s*.012],PAINT[0],0,PAINT[2]);}});
    /* the tub: over the wheel house from the apron in to its inner wall, the wall down to where the arms pass under */
    P(mb=>{const rows=[];for(let k=0;k<=N;k++){const u=uF+(uR-uF)*k/N;if(archY(D,u)<0){rows.push(null);continue;}const zA=hz(u)-.005,row=[];
      for(let j=0;j<=8;j++){const f=j/8,z=zA+(zin-zA)*f;row.push([X(u),archTop(u,z),s*z]);}const t=archTop(u,zin);row.push([X(u),Math.min(t,.3),s*zin]);rows.push(row);}
      for(let k=0;k<rows.length-1;k++){const A=rows[k],B=rows[k+1];if(!A||!B)continue;for(let j=0;j<A.length-1;j++)mb.quad(A[j],B[j],B[j+1],A[j+1],LIN[0],0,LIN[2]);}});
    /* the coilover's top mount on the tub: a plate, three studs and nuts, the shaft's nut and the red adjuster knob */
    {const u=D.uFa+.005,z=s*.625,y=archTop(u,.625),c=[X(u),y,z];
      P(mb=>{hdCyl(mb,c,V3.add(c,[0,.003,0]),.052,.05,28,SMC('#2a2b2e',SM.ENGINE));for(let q=0;q<3;q++){const a=q/3*TAU+.3;hdCyl(mb,V3.add(c,[Math.cos(a)*.038,.003,Math.sin(a)*.038]),V3.add(c,[Math.cos(a)*.038,.006,Math.sin(a)*.038]),.008,.008,6,BOLT);}
        hdCyl(mb,V3.add(c,[0,.003,0]),V3.add(c,[0,.006,0]),.014,.014,6,BOLT);hdCyl(mb,V3.add(c,[0,.006,0]),V3.add(c,[0,.01,0]),.011,.011,20,ANR);},30);}
    /* the harness along the apron's top, clipped down */
    P(mb=>{const pts=[];for(let k=0;k<=14;k++){const u=uF+.15+(uR-uF-.25)*k/14;pts.push([X(u),edge(u)-.06,s*(hz(u)-.035)]);}hdTube(mb,pts,.011,8,HOSE,false,true);
      for(let k=1;k<14;k+=3)hdRBox(mb,pts[k],[.008,.016,.016],.004,BLKP,2);});}

  /* ---------- the firewall (its lower part open round the tunnel's mouth), its insulation, the cowl's tray ---------- */
  {const z=hz(uR)-.005,ym=yFloor+(edge(uR)-yFloor)*.45,x=X(uR),FAB=SMC('#1d1d20',MAT.FABRIC),nz=40;
    P(mb=>{for(let k=0;k<nz;k++){const za=-z+2*z*k/nz,zb=-z+2*z*(k+1)/nz,ya=Math.min(ym,cpFloorY(uR,za)),yb=Math.min(ym,cpFloorY(uR,zb));mb.quad([x,ya,za],[x,yb,zb],[x,ym,zb],[x,ym,za],PAINT[0],0,PAINT[2]);}
});
    P(mb=>{const n2=16;for(let k=0;k<n2;k++){const za=-z+2*z*k/n2,zb=-z+2*z*(k+1)/n2,ba=.008*Math.sin(k*1.7);mb.quad([x+.004,ym,za],[x+.004,ym,zb],[x+.012+ba,edge(uR)-.02,zb],[x+.012+ba,edge(uR)-.02,za],FAB[0],0,FAB[2]);}});
    const y=edge(uR)-.015,xc=X(H.u1+.03);P(mb=>{const n3=40;for(let k=0;k<n3;k++){const za=-z+2*z*k/n3,zb=-z+2*z*(k+1)/n3,slot=k%3===1&&Math.abs(za)<z*.85;
      mb.quad([x,y,za],[x,y,zb],[xc,y+.012,zb],[xc,y+.012,za],(slot?HC.GB:PL)[0],0,(slot?HC.GB:PL)[2]);}});
    /* the harness across the firewall's top, the bulkhead's grommets where it goes through */
    P(mb=>{const pts=[];for(let k=0;k<=16;k++){const zz=-z*.85+1.7*z*k/16;pts.push([x+.03,ym+.05+.01*Math.sin(k),zz]);}hdTube(mb,pts,.013,8,HOSE,false,true);
      for(const zz of [-.3,.32])hdCyl(mb,[x+.002,ym+.05,zz],[x+.03,ym+.05,zz],.03,.024,18,BLKP);for(let k=2;k<16;k+=4)hdRBox(mb,pts[k],[.016,.008,.016],.004,BLKP,2);});}
  /* ---------- the braces: carbon tubes from the top mounts back to the cowl ---------- */
  for(const s of [1,-1]){const a=Pt(.935,.752,s*.49),c=Pt(uR-.025,.735,s*.48),m=Pt(D.uFa+.005,archTop(D.uFa,.625)+.004,s*.6);
    P(mb=>{hdCyl(mb,V3.lerp(a,c,.06),V3.lerp(a,c,.94),.015,.015,18,CF);for(const t of [.06,.94])hdCyl(mb,V3.lerp(a,c,t-.03),V3.lerp(a,c,t+.03),.018,.018,18,ALU);},40);
    P(mb=>{const e=V3.lerp(a,c,.03);hdCyl(mb,e,V3.lerp(a,c,.06),.018,.018,18,ALU);hdSweep(mb,[e,V3.lerp(e,m,.5),m],[[-.022,-.003],[.022,-.003],[.022,.003],[-.022,.003]],ALU,[0,1,0],true,true);
      cpHex(mb,V3.add(m,[0,.003,0]),[0,1,0],.008,.006);
      const f=V3.lerp(a,c,.97);hdCyl(mb,V3.lerp(a,c,.94),f,.018,.018,18,ALU);hdRBox(mb,V3.add(f,[-.012,0,0]),[.004,.035,.035],.004,ALU,2);for(const d of [-.022,.022])cpHex(mb,V3.add(f,[-.016,d,0]),[1,0,0],.007,.005);},35);}

  /* ================= the front ================= */
  const yrT=edge(uF)-.1,yrB=Math.max(yFloor+.08,yrT-.45),yr=(yrT+yrB)/2,hr=(yrT-yrB)/2,zr=Math.min(.6,hz(uF)-.1);
  P(mb=>{hdRBox(mb,[X(uF),edge(uF)-.05,0],[.03,.025,hz(uF)-.02],.008,BLKP,2);for(const s of [1,-1])hdRBox(mb,[X(uF),yr,s*(zr+.07)],[.025,hr+.04,.02],.006,BLKP,2);
    hdRBox(mb,[X(uF)+.03,edge(uF)-.045,0],[.012,.03,.035],.004,HC.CAST,2);hdCyl(mb,[X(uF)+.04,edge(uF)-.02,0],[X(uF)+.04,edge(uF)-.005,0],.006,.006,8,BOLT);
    /* a warning label by the latch */
    hdRBox(mb,[X(uF)-.031,edge(uF)-.05,.15],[.001,.014,.04],.001,SMC('#e8e2c8',SM.PLASTIC),1);hdRBox(mb,[X(uF)-.0315,edge(uF)-.05,.12],[.0008,.009,.008],.0008,YEL,1);
    /* the radiator: plastic tanks either side of a finned core, its cap */
    for(const s of [1,-1])hdRBox(mb,[X(uF+.05),yr,s*(zr+.025)],[.03,hr+.012,.025],.01,BLKP,3);
    hdRBox(mb,[X(uF+.05),yr,0],[.016,hr,zr],.003,SMC('#262728',SM.ENGINE),1);
    hdCyl(mb,[X(uF+.05),yrT+.012,zr*.7],[X(uF+.05),yrT+.045,zr*.7],.024,.022,18,MM.CHROME);},28);
  P(mb=>{for(let y=yrB+.012;y<yrT-.008;y+=.012)hdRBox(mb,[X(uF+.05)+.017,y,0],[.002,.0025,zr-.005],.001,SMC('#3a3b3d',SM.ENGINE),1);},20);
  /* the condenser in front of it, and the oil cooler low down in front of that, its braided lines */
  P(mb=>{hdRBox(mb,[X(uF+.012),yr+.01,0],[.008,hr-.02,zr-.04],.003,SMC('#1e1f21',SM.ENGINE),1);for(let y=yrB+.03;y<yrT-.03;y+=.016)hdRBox(mb,[X(uF+.012)+.0085,y,0],[.0015,.002,zr-.05],.001,SMC('#2c2d2f',SM.ENGINE),1);
    hdRBox(mb,[X(uF-.01),yrB+.07,.18],[.012,.05,.16],.004,SMC('#2a2b2d',SM.ENGINE),2);for(let y=yrB+.03;y<yrB+.115;y+=.01)hdRBox(mb,[X(uF-.01)+.013,y,.18],[.0015,.0015,.15],.001,ALU,1);
    for(const s of [1,-1])hdRBox(mb,[X(uF-.01),yrB+.07,.18+s*.17],[.016,.055,.012],.004,ALU,2);},20);
  /* the shroud and two fans behind */
  for(const s of [1,-1]){const c=[X(uF+.115),yr,s*zr*.5],R=Math.min(hr,zr*.5)*.9;
    P(mb=>{hdCyl(mb,c,[c[0]-.035,c[1],c[2]],R+.012,R+.012,32,BLKP,false);hdCyl(mb,[c[0]-.035,c[1],c[2]],[c[0]-.06,c[1],c[2]],R*.3,R*.3,20,BLKP);
      for(let q=0;q<7;q++){const a=q/7*TAU;hdRBox(mb,[c[0]-.02,c[1]+Math.cos(a)*R*.62,c[2]+Math.sin(a)*R*.62],[.004,R*.32,.03],.004,BLKP,1);}
      for(let q=0;q<4;q++){const a=q/4*TAU+PI/4;hdRBox(mb,[c[0]-.045,c[1]+Math.cos(a)*R*.62,c[2]+Math.sin(a)*R*.62],[.004,R*.36,.006],.003,BLKP,1);}});}
  P(mb=>{const sh=hdRRect(zr,hr,.06,6);hdLoft(mb,[sh.map(([a,bb])=>[X(uF+.075),yr+bb,a]),sh.map(([a,bb])=>[X(uF+.085),yr+bb*.98,a*.98])],BLKP,true);});
  /* the hoses: top to the thermostat, bottom to the water pump, their clamps; the condenser's lines */
  {const th=Ew([hx+.03,.27,.05]),wp=Ew([hx+.03,.12,-.05]),yu=Math.min(yrT-.04,th[1]+.02);
    P(mb=>{const top=[[X(uF+.08),yrT-.04,zr*.6],[X(uF+.2),yu,zr*.55],[th[0]+.12,yu,zr*.3],th],bot=[[X(uF+.08),yrB+.05,-zr*.6],[X(uF+.2),yrB+.05,-zr*.6],[wp[0]+.1,yrB+.05,-zr*.35],wp];
      hdTube(mb,top,.022,12,HOSE,false,true);hdTube(mb,bot,.024,12,HOSE,false,true);
      for(const pth of [top,bot])for(const p of [pth[0],pth[pth.length-1]]){const q=V3.lerp(p,pth[pth[0]===p?1:pth.length-2],.15);hdCyl(mb,V3.add(q,[.006,0,0]),V3.add(q,[-.006,0,0]),.027,.027,14,BOLT);}});
    const comp=Ew([hx+.04,-.0,.2]);P(mb=>{hdTube(mb,[V3.add(comp,[-.04,.05,.04]),Pt(.6,.42,.32),Pt(.35,.45,.45),[X(uF+.012),yrT-.06,zr-.05]],.009,10,ALU,false,true);
      hdTube(mb,[V3.add(comp,[-.06,.06,-.02]),Pt(.75,.56,.3),Pt(1.1,.62,.42),Pt(uR-.02,.62,.36)],.007,10,ALU,false,true);
      for(const [u,z] of [[.35,.45],[1.1,.42]])hdRBox(mb,Pt(u,u<1?.45:.62,z),[.012,.012,.012],.003,BLKP,1);},35);}

  /* ================= the furniture ================= */
  /* the dry sump's tank: polished, its cap and breather; the braided lines to the pump and back */
  const OT=Pt(.6,.4,.44);
  P(mb=>{hdCyl(mb,OT,V3.add(OT,[0,.24,0]),.062,.062,32,SMC('#c6c8cb',SM.BRUSH));for(const dy of [.02,.22])hdCyl(mb,V3.add(OT,[0,dy,0]),V3.add(OT,[0,dy+.012,0]),.066,.066,32,ALU);
    hdCyl(mb,V3.add(OT,[0,.24,0]),V3.add(OT,[0,.262,0]),.03,.026,20,BLKP);for(let q=0;q<8;q++){const a=q/8*TAU;hdRBox(mb,V3.add(OT,[Math.cos(a)*.028,.255,Math.sin(a)*.028]),[.004,.006,.004],.002,BLKP,1);}
    hdRBox(mb,V3.add(OT,[0,.08,-.068]),[.022,.03,.004],.002,SMC('#e8e2c8',SM.PLASTIC),1);
    for(const dz of [-.04,.04])hdRBox(mb,V3.add(OT,[0,.13,dz>0?.065:-.065]),[.02,.1,.006],.004,ALU,1);},35);
  /* the coolant tank, the washer bottle low down with its neck up */
  {const c=Pt(.44,.53,.5);P(mb=>{hdRBox(mb,c,[.06,.06,.05],.02,WHT,4);hdCyl(mb,V3.add(c,[0,.06,0]),V3.add(c,[0,.085,0]),.026,.024,18,SMC('#1b1b1c',SM.PLASTIC));
    hdRBox(mb,V3.add(c,[.061,0,0]),[.001,.03,.002],.0005,BLKP,1);hdRBox(mb,V3.add(c,[.061,-.015,0]),[.001,.0012,.03],.0005,BLKP,1);hdRBox(mb,V3.add(c,[.061,.015,0]),[.001,.0012,.03],.0005,BLKP,1);
    hdTube(mb,[V3.add(c,[-.06,-.04,-.02]),Pt(.6,.5,.38),Ew([hx+.03,.3,.12])],.008,8,HOSE,false,true);});}
  {const c=Pt(.44,.33,-.6);P(mb=>{hdRBox(mb,c,[.07,.08,.05],.02,SMC('#cfd2d4',SM.PLASTIC),4);hdCyl(mb,V3.add(c,[-.02,.08,0]),Pt(.4,.58,-.6),.017,.017,14,SMC('#cfd2d4',SM.PLASTIC));
    hdCyl(mb,Pt(.4,.58,-.6),Pt(.4,.6,-.6),.022,.02,16,SMC('#1d5fb0',SM.PLASTIC));});}
  /* the airbox: fed from behind the grille, its lid clipped on, the tube with its sensor to the throttle body */
  {const box=Pt(.52,.52,-.32),tb=Ew([hx+.035,.35,0]);
    P(mb=>{hdRBox(mb,box,[.1,.065,.12],.02,BLKP,4);hdRBox(mb,V3.add(box,[0,.066,0]),[.098,.004,.118],.012,SMC('#18181a',SM.PLASTIC),3);
      for(const [dx,dz] of [[-.08,.12],[.08,.12],[-.08,-.12],[.08,-.12]])hdRBox(mb,V3.add(box,[dx,.05,dz*1.02]),[.008,.018,.004],.002,HC.CAST,1);
      hdTube(mb,[Pt(.42,.54,-.38),Pt(.34,.58,-.42),Pt(.25,.592,-.44)],.035,16,BLKP,false,true);hdRBox(mb,Pt(.235,.592,-.44),[.012,.05,.06],.01,BLKP,2);},32);
    P(mb=>{const pts=[Pt(.62,.54,-.26),Pt(.68,.6,-.2),Pt(.75,.69,-.08),[tb[0]+.05,tb[1],tb[2]],tb],R=[];for(let i=0;i<pts.length-1;i++)for(let k=0;k<4;k++)R.push(V3.lerp(pts[i],pts[i+1],k/4));R.push(tb);
      hdTube(mb,R,.042,18,HOSE,false,true);for(const t of [.06,.94])hdCyl(mb,V3.add(R[Math.round(t*(R.length-1))],[.005,0,0]),V3.add(R[Math.round(t*(R.length-1))],[-.005,0,0]),.046,.046,18,BOLT);
      const m=R[Math.round(R.length*.35)];hdRBox(mb,V3.add(m,[0,.045,0]),[.018,.01,.022],.004,BLKP,2);hdTube(mb,[V3.add(m,[0,.055,0]),V3.add(m,[.05,.07,.05]),Pt(.9,.7,.12)],.003,6,HOSE,false,false);},40);}
  /* the brake booster and master cylinder, the ABS unit beside them and their hard lines */
  {const u=uR-.12,z=-(hz(u)-.26),y=edge(u)-.21,x=X(uR);
    hdPart(st,mb=>{hdRev(mb,[[0,0],[.12,0],[.135,.02],[.135,.07],[.12,.09],[0,.095]],40,BLKP);},30,null,M4.mul(M4T(x,y,z),M4RZ(-PI/2)));
    P(mb=>{hdCyl(mb,[x+.095,y+.02,z],[x+.27,y+.02,z],.032,.032,16,ALU);hdRBox(mb,[x+.19,y+.08,z],[.05,.032,.04],.008,SMC('#cfc8b8',SM.PLASTIC),3);
      hdCyl(mb,[x+.19,y+.112,z],[x+.19,y+.13,z],.022,.022,16,SMC('#d6b21a',SM.PLASTIC));});
    const ab=Pt(1.18,.58,-.45);
    P(mb=>{hdRBox(mb,ab,[.045,.04,.04],.006,CASTA,2);hdRBox(mb,V3.add(ab,[0,-.005,.045]),[.05,.045,.012],.008,BLKP,2);hdRBox(mb,V3.add(ab,[-.02,.0,.062]),[.022,.016,.008],.004,SMC('#202022',SM.PLASTIC),1);
      hdCyl(mb,V3.add(ab,[0,.04,0]),V3.add(ab,[0,.06,0]),.016,.016,16,BLKP);
      for(let k=0;k<6;k++){const s0=V3.add(ab,[-.03+k*.012,.04,-.03]);cpHex(mb,s0,[0,1,0],.0055,.004);}
      const ends=[[x+.2,y+.02,z+.03],[x+.24,y+.02,z+.03],Pt(1.0,.6,-.505),Pt(1.25,.6,.505),Pt(1.5,.5,-.19),Pt(1.5,.5,-.2)];
      for(let k=0;k<6;k++){const s0=V3.add(ab,[-.03+k*.012,.048,-.03]),e=ends[k],m=[(s0[0]+e[0])/2,Math.max(s0[1],e[1])+.03,(s0[2]+e[2])/2];
        const path=k===3?[s0,V3.add(s0,[0,.03,0]),Pt(1.47,.64,-.3),Pt(1.47,.64,.3),Pt(1.36,.63,.48),e]:k>=4?[s0,V3.add(s0,[0,.02,0]),Pt(1.4,.62,-.36),Pt(uR-.01,.58,-.3),Pt(uR-.01,.55,-.22),e]:[s0,V3.add(s0,[0,.025,0]),m,e];
        hdTube(mb,path,.0028,6,LINE,false,true);}},40);}
  /* the ECU on the right wall: its case, the two plugs and the loom; the fuse box behind it; the jump post */
  {const c=Pt(1.13,.6,.448);P(mb=>{hdRBox(mb,c,[.085,.07,.018],.006,CASTA,2);for(let k=-4;k<=4;k++)hdRBox(mb,V3.add(c,[k*.017,0,-.019]),[.003,.06,.002],.001,CASTA,1);
    for(const dy of [-.03,.025])hdRBox(mb,V3.add(c,[.09,dy,-.004]),[.012,.02,.014],.004,BLKP,2);
    hdTube(mb,[V3.add(c,[.1,0,-.01]),Pt(.98,.66,.42),Pt(1.0,.7,.3)],.012,8,HOSE,false,true);});
    const f=Pt(1.41,edge(1.41)-.13,hz(1.41)-.17);P(mb=>{hdRBox(mb,f,[.08,.05,.1],.012,BLKP,3);hdRBox(mb,V3.add(f,[0,.052,0]),[.082,.004,.102],.006,BLKP,2);
      for(const dz of [-.08,.08])hdRBox(mb,V3.add(f,[.082,.03,dz]),[.004,.012,.008],.002,BLKP,1);
      const j=V3.add(f,[-.03,.02,-.15]);hdCyl(mb,j,V3.add(j,[0,.03,0]),.012,.012,12,BOLT);hdCyl(mb,V3.add(j,[0,.015,0]),V3.add(j,[0,.045,0]),.02,.018,18,ANR);});}
  /* the prop rod, folded along the radiator support */
  P(mb=>{const a=[X(uF)-.01,edge(uF)-.04,-(hz(uF)-.12)],bb=[X(uF)-.01,edge(uF)-.04,hz(uF)-.3];hdCyl(mb,a,bb,.0045,.0045,8,SMC('#2a2a2c',SM.ENGINE));hdCyl(mb,a,V3.add(a,[0,-.03,0]),.006,.006,8,BLKP);});

  /* ================= the engine ================= */
  const BLK=SMC('#85888d',SM.ENGINE),HEAD=SMC('#9a9da2',SM.ENGINE),COV=SMC('#b0201c',SM.PAINTED),CRK=SMC('#a01c18',SM.PLASTIC);
  /* the dry sump: a shallow pan, finned underneath, the drain plug; the scavenge pump down the left with its drive */
  Q(mb=>{hdRBox(mb,[0,-.115,0],[hx-.02,.04,.19],.02,CASTA,3);for(let k=-3;k<=3;k++)hdRBox(mb,[0,-.157,k*.05],[hx-.06,.004,.003],.002,CASTA,1);
    for(let k=0;k<np+1;k++)hdRBox(mb,[-hx+.06+k*(len-.12)/np,-.06,0],[.006,.02,.2],.004,SMC('#141416',SM.ENGINE),1);
    cpHex(mb,[.1,-.16,.1],[0,-1,0],.011,.006);for(let k=0;k<12;k++){const a=k/12*TAU;cpHex(mb,[Math.cos(a)*(hx-.03)*1.0,-.079,Math.sin(a)*.18],[0,-1,0],.005,.003);}
    hdRBox(mb,[hx+.015,.1,0],[.016,.17,.17],.02,BLK,3);},30);
  Q(mb=>{const y=-.07,z=-.235;hdCyl(mb,[-.13,y,z],[.22,y,z],.034,.034,20,CASTA);for(const x of [-.06,.04,.14])hdCyl(mb,[x-.006,y,z],[x+.006,y,z],.039,.039,20,CASTA);
    hdCyl(mb,[.22,y,z],[.24,y,z],.024,.024,16,CASTA);hdCyl(mb,[hx+.08,y,z],[hx+.1,y,z],.04,.04,24,DARK);hdCyl(mb,[.24,y,z],[hx+.08,y,z],.008,.008,8,BOLT);
    for(const x of [-.08,.0,.08]){hdCyl(mb,[x,y,z+.03],[x,-.1,-.17],.008,.008,10,BRAID);hdCyl(mb,[x,-.1,-.17],[x,-.1,-.165],.011,.011,6,ANB);}},30);
  /* the cogged belt from the crank's small pulley to the pump's */
  Q(mb=>{const a=[hx+.09,-.03,0],ra=.05,bb=[hx+.09,-.07,-.235],rb=.04,pts=[];
    const d=[bb[1]-a[1],bb[2]-a[2]],L=Math.hypot(...d),nx=[d[1]/L,-d[0]/L];
    for(let k=0;k<=12;k++){const t=-PI/2+k/12*PI,c=Math.cos(t),s2=Math.sin(t);pts.push([a[0],a[1]+(-d[0]/L*c+nx[0]*s2)*ra*-1,a[2]+(-d[1]/L*c+nx[1]*s2)*ra*-1]);}
    for(let k=0;k<=12;k++){const t=PI/2+k/12*PI,c=Math.cos(t),s2=Math.sin(t);pts.push([bb[0],bb[1]+(-d[0]/L*c+nx[0]*s2)*rb*-1,bb[2]+(-d[1]/L*c+nx[1]*s2)*rb*-1]);}pts.push(pts[0]);
    hdSweep(mb,pts,[[-.012,-.002],[.012,-.002],[.012,.002],[-.012,.002]],HOSE,[1,0,0],true,false);hdCyl(mb,[a[0]-.012,a[1],a[2]],[a[0]+.012,a[1],a[2]],ra,ra,24,DARK);},40);
  /* the braided lines: the pump's outlet to the tank, the tank's feed back to the front cover, with their fittings */
  {const out1=Ew([.1,-.07,-.27]),f1=Ew([hx+.03,-.08,.12]),t1=V3.add(OT,[-.05,.02,-.03]),t2=V3.add(OT,[-.05,.02,.03]);
    E(mb=>{hdTube(mb,[out1,Ew([.1,-.13,-.3]),Ew([hx+.12,-.14,-.2]),Ew([hx+.16,-.14,.15]),Pt(.66,.32,.36),t1],.009,10,BRAID,false,true);
      hdTube(mb,[f1,Ew([hx+.09,-.1,.16]),Pt(.68,.33,.4),t2],.009,10,BRAID,false,true);
      for(const p of [out1,f1,t1,t2])hdCyl(mb,V3.add(p,[-.012,0,0]),V3.add(p,[.012,0,0]),.013,.013,6,p===out1||p===t1?ANR:ANB);},40);}
  /* the bottom end's block between the banks */
  Q(mb=>{hdRBox(mb,[0,.02,0],[hx,.11,.2],.02,BLK,3);});
  for(const s of [1,-1]){const a=PI/4,d=[0,Math.cos(a),s*Math.sin(a)],az=V3.norm([0,-d[2],d[1]]),out2=V3.mul(az,s),Pb=(t,oo)=>V3.add(V3.mul(d,t),V3.mul(out2,oo));
    Q(mb=>{obox(mb,Pb(.15,0),[1,0,0],d,az,[hx,.1,.12],BLK);obox(mb,Pb(.29,0),[1,0,0],d,az,[hx-.02,.04,.118],HEAD);});
    /* the cam cover: red crinkle, its raised ribs and bolts round the edge, the plug wells' coils and their plugs */
    Q(mb=>{rbox(mb,Pb(.37,0),[1,0,0],d,az,[hx-.035,.042,.105],CRK,.28,20,8);
      for(let k=0;k<4;k++)obox(mb,Pb(.412,s*(.055-k*.012)),[1,0,0],d,az,[hx-.08,.004,.003],COV);
      for(let k=0;k<5;k++)for(const e of [-1,1])hdCyl(mb,V3.add(Pb(.335,e*.1),[-hx+.06+k*(len-.12)/4,0,0]),V3.add(Pb(.35,e*.1),[-hx+.06+k*(len-.12)/4,0,0]),.007,.007,6,BOLT);
      obox(mb,Pb(.413,s*.075),[1,0,0],d,az,[.032,.002,.008],SMC('#c9ccd1',SM.BRUSH));},30);
    Q(mb=>{for(let k=0;k<np;k++){const c=V3.add(Pb(.41,s*-.035),[xs(k)+s*.024,0,0]);hdRBox(mb,c,[.022,.022,.034],.006,BLKP,2);
        hdRBox(mb,V3.add(c,[.0,.018,-s*.03]),[.012,.012,.01],.003,SMC('#3a3a3c',SM.PLASTIC),1);hdRBox(mb,V3.add(c,[0,.024,-s*.042]),[.008,.006,.006],.002,SMC('#7a2a1a',SM.PLASTIC),1);}
      /* the coils' loom down the cover's inner edge, clipped */
      const lm=[];for(let k=0;k<=8;k++){const x=-hx+.04+(len-.08)*k/8;lm.push(V3.add(Pb(.43,s*-.08),[x,0,0]));}hdTube(mb,lm,.009,8,HOSE,false,true);
      for(let k=0;k<np;k++)hdTube(mb,[V3.add(Pb(.43,s*-.08),[xs(k)+s*.024,0,0]),V3.add(Pb(.425,s*-.06),[xs(k)+s*.024,0,0])],.004,6,HOSE,false,false);},30);
    /* the header: four primaries from the ports, out and down the side and back to a collector under the bell
       housing's corner (where the underside's flange meets it), stainless going bronze near the head; the shield */
    {const col0=[-hx-.025,-.105,s*.29],col1=[-hx-.1,-.14,s*.255],outL=[-hx-.12,-.147,s*.25];
      const ports=[0,1,2,3].map(k=>{const p0=V3.add(Pb(.27,.12),[xs(k)+s*.024,0,0]);return p0;});
      const offs=[[.016,.016],[-.016,.016],[.016,-.016],[-.016,-.016]];
      for(let k=0;k<np;k++){const p0=ports[k],p1=V3.add(p0,V3.mul(out2,.06)),p2=[p0[0]-.01,-.0,s*.345],p3=[Math.min(p0[0]-.07,-.08),-.07,s*.335],o=offs[k],pc=V3.add(col0,[0,o[0],s*o[1]]);
        const path=[p0,p1,p2,p3,pc],R=[];for(let i=0;i<path.length-1;i++)for(let q=0;q<5;q++)R.push(V3.lerp(path[i],path[i+1],q/5));R.push(pc);
        const S=R.map((p,i)=>i===0||i===R.length-1?p:V3.mul(V3.add(V3.add(R[i-1],R[i+1]),V3.mul(p,2)),.25));
        Q(mb=>{hdTube(mb,S.slice(0,8),.0185,12,SSB,false,true);hdTube(mb,S.slice(7),.0185,12,SS,false,true);},40);}
      cpRev(en,Ew(col0),Ew(col1),[[.0,0],[.046,0],[.044,.03],[.034,.075],[.032,V3.len(V3.sub(col1,col0))]],SS,24,35);cpRev(en,Ew(col1),Ew(outL),[[.032,0],[.032,.008],[.05,.008],[.05,.02],[0,.02]],SSB,24,35);
      Q(mb=>{
        /* the flange plates where each port bolts on */
        for(let k=0;k<np;k++){const p0=ports[k];obox(mb,V3.add(p0,V3.mul(out2,.004)),[1,0,0],d,out2,[.026,.026,.004],SSB);for(const e of [-1,1])cpHex(mb,V3.add(V3.add(p0,V3.mul(out2,.008)),[e*.03,0,0]),out2,.006,.005);}},35);
      /* the heat shield over the primaries along the head, pressed and ribbed */
      Q(mb=>{const sh=[];for(let k=0;k<=10;k++){const t=k/10;sh.push(V3.add(Pb(.2,.2),[-hx+.03+(len-.06)*t,0,0]));}hdSweep(mb,sh,[[-.055,-.004],[.055,-.004],[.058,.004],[-.058,.004]],SMC('#c4c4c0',SM.BRUSH),out2,false,true);},30);}}
  /* the intake: a cast plenum with a ribbed crinkle top and its blank badge, eight cast runners down to the heads */
  Q(mb=>{hdRBox(mb,[-.02,.37,0],[hx-.07,.045,.115],.035,CASTA,5);hdRBox(mb,[-.02,.412,0],[hx-.09,.012,.1],.012,SMC('#1b1c1e',SM.PLASTIC),3);
    for(let k=-5;k<=5;k++)hdRBox(mb,[-.02+k*.035,.424,0],[.006,.003,.085],.002,SMC('#2a2b2d',SM.PLASTIC),1);
    hdRBox(mb,[.03,.426,0],[.05,.0025,.03],.004,SMC('#c9ccd1',SM.BRUSH),2);
    for(const s of [1,-1])for(let k=0;k<np;k++){const x=xs(k)+s*.024;hdTube(mb,[[x,.36,s*.06],[x,.37,s*.1],[x,.34,s*.135],[x,.3,s*.15]],.021,14,CASTA,false,true);
      hdCyl(mb,[x,.3,s*.15],[x,.28,s*.158],.026,.026,6,CASTA);}},30);
  /* the injectors under the runners, each with its plug; the rails along them, joined by a crossover at the back,
     the regulator, the feed from the firewall */
  Q(mb=>{for(const s of [1,-1]){for(let k=0;k<np;k++){const x=xs(k)+s*.024,c=[x,.295,s*.185];hdCyl(mb,c,[x,.33,s*.17],.009,.008,10,SMC('#2a3a8a',SM.PLASTIC));
        hdRBox(mb,[x,.335,s*.18],[.008,.007,.009],.002,BLKP,1);}
      hdCyl(mb,[-hx+.03,.335,s*.18],[hx-.04,.335,s*.18],.011,.011,12,CASTA);for(const x of [-hx+.07,hx-.08])cpHex(mb,[x,.347,s*.18],[0,1,0],.006,.005);}
    hdTube(mb,[[-hx+.03,.335,.18],[-hx-.01,.36,.12],[-hx-.01,.36,-.12],[-hx+.03,.335,-.18]],.006,8,BRAID,false,false);
    hdCyl(mb,[-hx+.02,.36,-.06],[-hx-.03,.36,-.06],.018,.018,16,CASTA);hdCyl(mb,[-hx-.03,.36,-.06],[-hx-.04,.36,-.06],.008,.008,8,ANB);},35);
  E(mb=>{hdTube(mb,[Ew([-hx-.04,.36,-.06]),Pt(1.5,.7,-.1),Pt(uR-.01,.66,-.14)],.0045,6,BRAID,false,true);},35);
  /* the throttle body: its bore, the actuator and its plug, the sensors on the plenum and their vacuum lines */
  Q(mb=>{hdCyl(mb,[hx-.1,.37,0],[hx-.04,.35,0],.045,.045,24,CASTA);hdCyl(mb,[hx-.04,.35,0],[hx+.02,.35,0],.045,.045,24,CASTA);hdCyl(mb,[hx+.02,.35,0],[hx+.035,.35,0],.05,.05,24,CASTA);
    hdRBox(mb,[hx-.03,.35,.065],[.028,.028,.02],.008,BLKP,2);hdRBox(mb,[hx-.05,.372,.075],[.012,.008,.01],.003,SMC('#3a3a3c',SM.PLASTIC),1);
    hdRBox(mb,[-.15,.432,.07],[.014,.01,.018],.004,BLKP,2);hdTube(mb,[[-.15,.44,.07],[-.2,.46,.12],[-hx+.03,.44,.2]],.004,6,HOSE,false,false);
    for(const s of [1,-1])hdTube(mb,[[-.2,.42,s*.03],[-.24,.46,s*.08],[-.22,.44,s*.2],Pb2(s,.44,0)],.007,8,HOSE,false,true);},35);
  /* the front: damper, water pump, alternator, compressor, tensioner and idler, the belt round them */
  {const pul=[[[hx+.07,-.03,0],.085,DARK],[[hx+.06,.17,0],.06,ALU],[[hx+.07,.33,-.2],.042,ALU],[[hx+.07,-.0,.2],.052,ALU],[[hx+.07,.25,.11],.032,DARK],[[hx+.07,.15,-.17],.03,DARK]];
    Q(mb=>{for(const [c,r,m] of pul){hdCyl(mb,[c[0]-.03,c[1],c[2]],[c[0]+.012,c[1],c[2]],r,r,32,m);hdCyl(mb,[c[0]+.012,c[1],c[2]],[c[0]+.016,c[1],c[2]],r*.45,r*.45,20,BOLT);
        for(let q=0;q<5;q++){const a=q/5*TAU;hdCyl(mb,[c[0]+.012,c[1]+Math.cos(a)*r*.7,c[2]+Math.sin(a)*r*.7],[c[0]+.017,c[1]+Math.cos(a)*r*.7,c[2]+Math.sin(a)*r*.7],r*.06,r*.06,6,BOLT);}}
      /* the alternator's ribbed body, its terminal; the compressor and its lines' block */
      hdCyl(mb,[hx-.1,pul[2][0][1],pul[2][0][2]],[hx+.04,pul[2][0][1],pul[2][0][2]],.065,.065,24,ALU);for(let k=0;k<5;k++){const x=hx-.09+k*.028;hdCyl(mb,[x-.004,pul[2][0][1],pul[2][0][2]],[x+.004,pul[2][0][1],pul[2][0][2]],.068,.068,24,ALU);}
      hdRBox(mb,[hx-.05,pul[2][0][1]+.06,pul[2][0][2]-.03],[.012,.01,.01],.003,SMC('#b01e18',SM.PLASTIC),1);
      hdCyl(mb,[hx-.12,pul[3][0][1],pul[3][0][2]],[hx+.04,pul[3][0][1],pul[3][0][2]],.06,.06,24,ALU);hdRBox(mb,[hx-.06,pul[3][0][1]+.065,pul[3][0][2]+.02],[.025,.012,.02],.004,ALU,2);
      /* the belt: round the pulleys in order, a flat band */
      const ord=[0,3,1,4,2,5],pts=[];for(let k=0;k<=ord.length;k++){const [c,r]=pul[ord[k%ord.length]],[c2]=pul[ord[(k+1)%ord.length]],[c0]=pul[ord[(k+ord.length-1)%ord.length]];
        const mid=[(c0[1]+c2[1])/2-c[1],(c0[2]+c2[2])/2-c[2]],l=Math.hypot(mid[0],mid[1])||1;pts.push([hx+.075,c[1]-mid[0]/l*r*1.02,c[2]-mid[1]/l*r*1.02]);}
      hdSweep(mb,pts,[[-.003,-.011],[.003,-.011],[.003,.011],[-.003,.011]],HOSE,[1,0,0],true,false);
      /* the thermostat's housing on the front cover, its outlet for the top hose */
      hdRBox(mb,[hx+.02,.27,.05],[.025,.025,.03],.008,CASTA,2);hdCyl(mb,[hx+.02,.27,.05],[hx+.045,.27,.05],.02,.02,16,CASTA);for(const e of [-1,1])cpHex(mb,[hx+.045,.27+e*.02,.05+e*.02],[1,0,0],.005,.004);},30);}
  /* the heater hoses back to the firewall, the bell housing with its ribs and bolts, the oil filler, the dipstick */
  E(mb=>{for(const dz of [.05,.11])hdTube(mb,[Ew([-hx,.22,dz]),Ew([-hx-.06,.26,dz+.02]),Pt(uR-.01,.58,dz+.06)],.012,10,HOSE,false,true);
    for(const dz of [.11,.17])hdCyl(mb,Pt(uR-.012,.58,dz),Pt(uR+.0,.58,dz),.02,.02,16,BLKP);},35);
  Q(mb=>{hdCyl(mb,[-hx,.03,0],[-hx-.22,0,0],.17,.12,40,CASTA);for(let k=0;k<12;k++){const a=k/12*TAU;hdRBox(mb,[-hx-.1,.015+Math.sin(a)*.14,Math.cos(a)*.14],[.09,.004,.004],.002,CASTA,1);}
    for(let k=0;k<10;k++){const a=k/10*TAU;cpHex(mb,[-hx-.005,.03+Math.sin(a)*.172,Math.cos(a)*.172],[-1,0,0],.008,.006);}},30);
  Q(mb=>{hdCyl(mb,[-.1,.42,.15],[-.1,.45,.15],.022,.024,18,YEL);const lp=[];for(let k=0;k<=12;k++){const a=k/12*TAU;lp.push([hx-.12+Math.cos(a)*.016,.39+Math.sin(a)*.016,-.2]);}hdTube(mb,lp,.004,6,YEL,true,false);
    hdCyl(mb,[hx-.12,.374,-.2],[hx-.12,.1,-.22],.005,.005,6,ALU);},35);

  /* ================= under the bonnet: the insulation pad, the pressed inner frame ================= */
  {const FAB=SMC('#1c1c1e',MAT.FABRIC),nz=10;
    for(let u=H.u0+.06;u<H.u1-.04;u+=.06){const v=Math.min(u+.06,H.u1-.04);for(let k=0;k<nz;k++){const f=u=>hz(u)-.06,z0=-f(u)+2*f(u)*k/nz,z1=-f(u)+2*f(u)*(k+1)/nz,w0=-f(v)+2*f(v)*k/nz,w1=-f(v)+2*f(v)*(k+1)/nz;
      ln.quad([X(u),topY(u,z0)-.014,z0],[X(u),topY(u,z1)-.014,z1],[X(v),topY(v,w1)-.014,w1],[X(v),topY(v,w0)-.014,w0],FAB[0],0,FAB[2]);}}
    hdPart(ln,mb=>{const rib=(pts)=>hdSweep(mb,pts,[[-.012,-.016],[.012,-.016],[.018,-.004],[-.018,-.004]],PAINT,[0,1,0],false,true);
      for(const s of [1,-1]){const pts=[];for(let u=H.u0+.03;u<=H.u1-.02;u+=.05)pts.push([X(u),topY(u,hz(u)-.03),s*(hz(u)-.03)]);rib(pts);
        const d=[];for(let t=0;t<=1.001;t+=.1){const u=H.u0+.12+(H.u1-H.u0-.25)*t,z=s*(hz(u)-.08)*(1-t*.8);d.push([X(u),topY(u,Math.abs(z))-.004,z]);}rib(d);}
      for(const u of [H.u0+.04,H.u1-.04]){const pts=[];for(let k=0;k<=16;k++){const z=-(hz(u)-.03)+2*(hz(u)-.03)*k/16;pts.push([X(u),topY(u,Math.abs(z))-.004,z]);}rib(pts);}},30);
    /* the latch's striker at the bonnet's front, its rubber stops */
    hdPart(ln,mb=>{const x=X(H.u0+.06);hdTube(mb,[[x,topY(H.u0+.06,0)-.02,-.02],[x,topY(H.u0+.06,0)-.05,-.02],[x,topY(H.u0+.06,0)-.05,.02],[x,topY(H.u0+.06,0)-.02,.02]],.004,8,BOLT,false,true);
      for(const s of [1,-1])hdCyl(mb,[x,topY(H.u0+.06,.4)-.016,s*.4],[x,topY(H.u0+.06,.4)-.03,s*.4],.012,.01,12,SV([.02,.02,.021],MAT.RUBBER));},30);}
  return {bay:st,engine:en,liner:ln,pivot:[X(uc),yC,0],trans:false,tris:(st.p.length+en.p.length+ln.p.length)/9};
  function Pb2(s,t,oo){const a=PI/4,d=[0,Math.cos(a),s*Math.sin(a)],az=V3.norm([0,-d[2],d[1]]),out2=V3.mul(az,s);return V3.add(V3.add(V3.mul(d,t),V3.mul(out2,oo)),[-.2,0,0]);}
}
