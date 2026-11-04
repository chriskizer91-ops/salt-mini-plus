/* =====================================================================================
   THE RACE'S CABIN (Studio 2), in the SUV's finished shell (suv-stock/94_s2_cabin with o.race: the floor, the roof's
   inside, the pillars and the cargo area painted and bare), from what that returns (the floor's height, the walls):
   - The cage: the main hoop behind the front seats, its diagonal and the harness bar across it; the front hoop up each
     A pillar and across under the windshield's header; the roof bars back to the main hoop; two door bars a side in an
     X; the rear stays down to the floor behind the rear wheel houses and a bar across their feet; a plate where each
     leg meets the floor; foam on the driver's side, where a helmet could meet it.
   - Two race buckets, carbon shells on aluminium side mounts, their pads, the slots for the harness; each with a
     six-point harness in the build's red: the shoulder straps from the harness bar through the slots, the lap straps
     and the crotch straps from the floor, all into the round cam-lock buckle on the cushion.
   - A small suede wheel, flat at the bottom, on a quick release; a digital dash with a row of shift lights in the
     gauge hood's place; the switch panel on the stack: toggles in two rows, two under red guards, the ignition and
     starter buttons, and the master cut-off's red knob with its spark sticker; the fire system's pull handle.
   - The sequential's lever on the tunnel, the hydraulic handbrake beside it.
   - The extinguisher on the passenger's floor in its clamps; a net in the driver's window; a pull strap on each front
     door.
   - The fuel cell in the cargo area behind the rear stays: an aluminium box on the floor in two straps, its filler
     hose up to the quick-release cap on the right quarter (85), the breather, the braided lines down through the floor.
   ===================================================================================== */
function rcCabin2(out,car,C){
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=D.dy,{yF,zw,cy,uHF,uE}=C;
  const CAGE=SMC('#4c4f54',SM.PAINTED),FOAM=SMC('#141416',SM.VINYL),CF=SV([1,1,1],MAT.CARBON),PAD=SV(lin('#252528'),SM.SEAT),PADR=SV(lin('#8a1814'),SM.SEAT),
    WEB=SMC('#c41e1a',SM.CLOTH),ALU=SMC('#b9bcc1',SM.BRUSH),BLK=C.BLK,SUEDE=SV(lin('#1c1c1e'),SM.SEAT),SAT=C.SAT,r=.021;
  const tube=(pts,rr=r,m=CAGE,n=4)=>hdPart(out,mb=>{hdTube(mb,suvPath(pts,n,2),rr,14,m,false,true);},40);
  const inZ=(u,y,off)=>K.sideZ(u,Math.min(y,D.belt(u)+.3))-off,rail=u=>secKeys(D,u).P[10];
  /* ---------- the cage ---------- */
  const uM=G.pillars[0][0]+.58,uA=G.cowl+.33,uH=G.rf+.07,hb=yF+.82;
  /* (the main hoop's line up one side: its foot, the wall below the belt, the glass above it, the roof's corner) */
  const hoop=(u,s,f0)=>{const b=D.belt(u),c=rail(u);return [[X(u),cy(u,s*f0)+.004,s*f0],[X(u),b-.24,s*(zw(u)-.07)],[X(u),b+.06,s*inZ(u,b+.06,.085)],[X(u),c[1]-.075,s*(c[0]-.08)],[X(u),K.topY(u,.36)-.075,s*.36]];};
  const corner=(u,s)=>{const c=rail(u);return [X(u),c[1]-.075,s*(c[0]-.08)];};
  {const L=hoop(uM,-1,.74),R=hoop(uM,1,.74).reverse();tube([...L,[X(uM),K.topY(uM,0)-.075,0],...R],r,CAGE,5);}
  /* the diagonal across it, the harness bar */
  {const a=corner(uM,-1),b=hoop(uM,1,.74)[1];tube([a,b]);}
  {const z=inZ(uM,hb,.09)-.01;tube([[X(uM),hb,-z],[X(uM),hb,z]],r*.9);}
  /* the front hoop: up the A pillars, along their inside, across under the header */
  /* (the A pillar's line: the front side glass's leading edge, up to its top) */
  const GL=hdSideGlass()[0],top=GL.reduce((m,p,i)=>p[1]>GL[m][1]?i:m,0),edge=GL.slice(0,top+1),edgeY=u=>{for(let i=0;i<edge.length-1;i++)if(u>=edge[i][0]&&u<=edge[i+1][0])return lerp(edge[i][1],edge[i+1][1],(u-edge[i][0])/Math.max(1e-6,edge[i+1][0]-edge[i][0]));return edge[edge.length-1][1];};
  const aLeg=s=>{const b=D.belt(uA),u0=edge[0][0],u1=edge[edge.length-1][0],gl=[.35,.65].map(t=>{const u=u0+(u1-u0)*t+.03;return [u,edgeY(u-.03)-.035];});
    return [[X(uA),cy(uA,s*.74)+.004,s*.74],[X(uA+.01),b-.24,s*(zw(uA+.01)-.07)],[X(uA+.04),b+.04,s*inZ(uA+.04,b+.04,.085)],
      ...gl.map(([u,y])=>[X(u),y,s*inZ(u,y,.085)]),corner(uH,s)];};
  {const L=aLeg(-1),R=aLeg(1).reverse();tube([...L,[X(uH),K.topY(uH,.36)-.075,-.36],[X(uH),K.topY(uH,0)-.075,0],[X(uH),K.topY(uH,.36)-.075,.36],...R],r,CAGE,5);}
  /* the roof bars, back along the roof's corners to the main hoop */
  for(const s of [1,-1])tube([corner(uH,s),corner((uH+uM)/2,s),corner(uM,s)]);
  /* the door bars, an X a side */
  const legAt=(P,y)=>{for(let i=0;i<P.length-1;i++)if((P[i][1]-y)*(P[i+1][1]-y)<=0){const t=(y-P[i][1])/(P[i+1][1]-P[i][1]);return V3.lerp(P[i],P[i+1],t);}return P[0];};
  const doorY=[yF+.2,D.belt(uM)-.06];
  for(const s of [1,-1]){const A=aLeg(s),M=hoop(uM,s,.74),a0=legAt(A,doorY[0]),a1=legAt(A,doorY[1]-.02),m0=legAt(M,doorY[0]),m1=legAt(M,doorY[1]);
    const zin=p=>[p[0],p[1],p[2]-s*.012];tube([zin(a0),V3.add(V3.lerp(a0,m1,.5),[0,0,s*.025]),zin(m1)]);tube([zin(a1),V3.add(V3.lerp(a1,m0,.5),[0,0,s*.025]),zin(m0)]);
    /* (the driver's side: foam on the door bars' middles and up the A pillar, where the helmet is) */
    if(s<0){for(const [p,q] of [[a0,m1],[a1,m0]])hdPart(out,mb=>{hdTube(mb,[V3.lerp(p,q,.3),V3.add(V3.lerp(p,q,.5),[0,0,s*.022]),V3.lerp(p,q,.7)],.033,14,FOAM,false,true);},40);
      hdPart(out,mb=>{const P=suvPath(A,4,2);hdTube(mb,P.slice(Math.round(P.length*.45),Math.round(P.length*.85)),.033,14,FOAM,false,true);},40);
      hdPart(out,mb=>{hdTube(mb,[corner(uH+.15,s),corner((uH+uM)/2,s),corner(uM-.15,s)],.033,14,FOAM,false,true);},40);}}
  /* the rear stays, down to the floor behind the rear wheel houses, and the bar across their feet */
  const uS=D.uRa+D.archB.a+.08;
  for(const s of [1,-1])tube([corner(uM,s),V3.lerp(corner(uM,s),[X(uS),cy(uS,s*.6)+.004,s*.6],.5),[X(uS),cy(uS,s*.6)+.004,s*.6]]);
  tube([[X(uS),cy(uS,.6)+.06,-.6],[X(uS),cy(uS,0)+.06,0],[X(uS),cy(uS,.6)+.06,.6]],r*.9);
  /* the plates at the feet */
  for(const s of [1,-1])for(const [u,z] of [[uM,.74],[uA,.74],[uS,.6]])hdPart(out,mb=>{const y=cy(u,s*z);hdRBox(mb,[X(u),y+.003,s*z],[.05,.004,.045],.003,CAGE,2);
    for(const [a,b] of [[-.035,-.03],[.035,-.03],[-.035,.03],[.035,.03]])cpHex(mb,[X(u)+a,y+.007,s*z+b],[0,1,0],.006,.004);},30);

  /* ---------- the race buckets and their harnesses ---------- */
  const recl=.2,bucket=(c,s)=>{const M=M4T(c[0],c[1],c[2]),Mb=M4.mul(M,M4RZ(recl)),P=(f,Mx=M)=>hdPart(out,f,40,null,Mx);
    /* the shell's pan and thigh bolsters, the cushion */
    P(mb=>{hdRBox(mb,[.2,.01,0],[.25,.045,.25],.04,CF,4);for(const e of [-1,1])hdRBox(mb,[.2,.085,e*.2],[.2,.055,.05],.04,CF,4);});
    P(mb=>{hdRBox(mb,[.2,.075,0],[.2,.03,.16],.025,PAD,4);for(const e of [-1,1])hdRBox(mb,[.2,.1,e*.165],[.18,.035,.02],.015,PAD,3);});
    /* the back: the shell, its side and shoulder wings, the head wings, the pads, a red insert; the harness slots */
    P(mb=>{hdRBox(mb,[-.08,.42,0],[.035,.4,.25],.04,CF,4);for(const e of [-1,1]){hdRBox(mb,[-.0,.33,e*.22],[.09,.27,.04],.04,CF,4);hdRBox(mb,[-.01,.64,e*.19],[.07,.07,.04],.03,CF,3);hdRBox(mb,[-.02,.8,e*.135],[.08,.1,.03],.03,CF,3);}},Mb);
    P(mb=>{hdRBox(mb,[-.035,.36,0],[.025,.3,.17],.022,PAD,4);hdRBox(mb,[-.035,.78,0],[.025,.08,.1],.02,PAD,3);hdRBox(mb,[-.009,.36,0],[.003,.24,.045],.003,PADR,2);
      for(const e of [-1,1])hdRBox(mb,[-.05,.665,e*.06],[.04,.014,.032],.005,BLK,2);},Mb);
    /* the side mounts down to the floor's rails */
    for(const e of [-1,1])hdPart(out,mb=>{const z=c[2]+e*.262,y0=cy(uHF,z);hdRBox(mb,[c[0]+.17,(c[1]+.03+y0+.03)/2,z],[.17,(c[1]-y0)/2,.005],.004,ALU,2);
      hdRBox(mb,[c[0]+.17,y0+.012,z],[.26,.012,.018],.004,SMC('#2a2b2d',SM.ENGINE),2);for(const du of [-.06,.05,.36])cpHex(mb,[c[0]+du,c[1]-.02,z+e*.006],[0,0,e],.007,.004);},30);
    /* the harness: shoulder straps from the bar through the slots, down the back and the cushion to the buckle */
    const W=(pts,w=.024)=>hdPart(out,mb=>{hdSweep(mb,suvPath(pts,4,2),[[-w,-.0015],[w,-.0015],[w,.0015],[-w,.0015]],WEB,[0,0,1],true,true);},40);
    const at=(p,Mx=Mb)=>M4.xform(Mx,p),bk=M4.xform(M,[.2,.12,0]);
    for(const e of [-1,1]){const slot=at([-.055,.665,e*.06]);W([[X(uM)+.025,hb+.02,c[2]+e*.07],[slot[0]-.02,slot[1]+.006,slot[2]],at([.0,.6,e*.055]),at([.0,.3,e*.05]),at([.01,.14,e*.04]),M4.xform(M,[.14,.115,e*.035]),V3.add(bk,[-.03,0,e*.02])]);
      /* the shoulder strap's adjuster on the chest */
      hdPart(out,mb=>{hdRBox(mb,at([.006,.45,e*.052]),[.004,.022,.03],.003,ALU,2);},30);
      /* the lap strap from the floor beside the cushion, its anchor */
      const fl=[c[0]-.02,cy(uHF+.02,c[2]+e*.2)+.004,c[2]+e*.2];W([fl,M4.xform(M,[-.0,.1,e*.17]),M4.xform(M,[.1,.12,e*.11]),V3.add(bk,[0,0,e*.03])]);
      hdPart(out,mb=>{hdRBox(mb,V3.add(fl,[0,.01,0]),[.022,.01,.02],.004,ALU,2);cpHex(mb,V3.add(fl,[0,.02,0]),[0,1,0],.008,.006);},30);
      /* the crotch straps up through the cushion's front */
      const fc=[c[0]+.48,cy(uHF-.48,c[2]+e*.04)+.004,c[2]+e*.04];W([fc,M4.xform(M,[.44,.08,e*.04]),M4.xform(M,[.32,.115,e*.035]),V3.add(bk,[.02,0,e*.015])],.02);}
    /* the buckle */
    hdPart(out,mb=>{const n=[0,1,0];hdCyl(mb,V3.add(bk,[0,-.004,0]),V3.add(bk,[0,.012,0]),.042,.04,28,ALU);hdCyl(mb,V3.add(bk,[0,.012,0]),V3.add(bk,[0,.02,0]),.03,.026,24,SMC('#1a1a1c',SM.PLASTIC));
      hdRBox(mb,V3.add(bk,[0,.024,0]),[.008,.004,.026],.003,ALU,1);},40);};
  for(const s of [1,-1])bucket([X(uHF),yF+.18,s*.38],s);

  /* ---------- the wheel on its quick release, the column ---------- */
  {const c=[X(uE+.2),1.0+dy,-.38],n=V3.norm([-.9,.44,0]),f=V3.norm([.44,.9,0]),M=M4.basis(c,f,[0,0,-1],n),R=.165;
    hdPart(out,mb=>{const path=[];for(let k=0;k<=72;k++){const a=k/72*TAU;path.push([Math.max(Math.cos(a)*R,-.13),Math.sin(a)*R*(Math.cos(a)*R<-.13?.98:1),0]);}hdTube(mb,suvPath(path,1,2),.017,14,SUEDE,true,false);},45,null,M);
    hdPart(out,mb=>{for(const a of [PI/2,-PI/2,PI]){const d=[Math.cos(a),Math.sin(a),0];hdRBox(mb,V3.mul(d,.09),[Math.abs(d[0])*.06+.022,Math.abs(d[1])*.06+.022,.006],.005,ALU,2);}
      hdRBox(mb,[0,0,.01],[.05,.07,.012],.01,CF,3);
      for(const [x,y,col] of [[.025,.04,'#d6b21a'],[.025,-.04,'#1f9a3a'],[-.02,.045,'#c41e1a'],[-.02,-.045,'#1b5fd0'],[0,0,'#e8e6df']])hdCyl(mb,[x,y,.022],[x,y,.03],.009,.009,14,SMC(col,SM.PLASTIC));},40,null,M);
    hdPart(out,mb=>{hdCyl(mb,V3.add(c,V3.mul(n,-.0)),V3.add(c,V3.mul(n,-.05)),.03,.03,20,ALU);hdCyl(mb,V3.add(c,V3.mul(n,-.05)),V3.add(c,V3.mul(n,-.065)),.034,.034,20,SMC('#1b5fd0',SM.PAINTED));
      hdCyl(mb,V3.add(c,V3.mul(n,-.065)),V3.add(c,V3.mul(n,-.3)),.028,.034,18,BLK);},40);}
  /* ---------- the digital dash and its shift lights, in the gauge hood ---------- */
  {const u=uE-.09,y=1.035+dy,z0=-.38;
    hdPart(out,mb=>{hdRBox(mb,[X(u-.02),y,z0],[.02,.052,.115],.01,BLK,3);hdRBox(mb,[X(u-.02)-.021,y-.006,z0],[.002,.04,.1],.003,SV(lin('#123048'),MAT.COL,.35),1);},40);
    hdPart(out,mb=>{for(let k=0;k<10;k++){const z=z0-.081+k*.018,col=k<4?'#2ed14a':k<8?'#f2c21a':'#ff2a1a';hdRBox(mb,[X(u-.02)-.021,y+.042,z],[.002,.005,.006],.002,SMC(col,MAT.COL,.6),1);}
      for(const [dz,w,col] of [[-.06,.03,'#e8e6df'],[0,.02,'#ff8a1a'],[.055,.03,'#e8e6df']])hdRBox(mb,[X(u-.02)-.0235,y-.01,z0+dz],[.0006,.012,w],.0004,SMC(col,MAT.COL,.5),1);},30);}
  /* ---------- the switch panel on the stack, the master cut-off, the fire system's pull (facing back, to the seats) ---------- */
  {const u=uE-.03,x=X(u)-.002,y0=.9+dy,F=x-.008;
    hdPart(out,mb=>{hdRBox(mb,[x,y0,0],[.008,.09,.15],.006,CF,2);},40);
    hdPart(out,mb=>{for(let row=0;row<2;row++)for(let k=0;k<5;k++){const z=-.1+k*.05,y=y0+.045-row*.05,p=[F,y,z];hdCyl(mb,p,V3.add(p,[-.006,0,0]),.008,.008,12,SAT);
        hdCyl(mb,V3.add(p,[-.006,0,0]),V3.add(p,[-.026,.008,0]),.0028,.0022,8,MM.CHROME);hdRBox(mb,V3.add(p,[-.0008,-.019,0]),[.0008,.004,.016],.0006,SMC('#e8e6df',MAT.COL,.2),1);
        if(row===0&&k>=3)hdRBox(mb,V3.add(p,[-.016,.006,0]),[.012,.016,.013],.004,SMC('#c41e1a',SM.PLASTIC),2);}
      /* the ignition and starter buttons */
      hdCyl(mb,[F,y0+.045,.12],[F-.012,y0+.045,.12],.012,.012,16,SMC('#d6b21a',SM.PLASTIC));hdCyl(mb,[F,y0-.005,.12],[F-.012,y0-.005,.12],.012,.012,16,SMC('#1f9a3a',SM.PLASTIC));},35);
    /* the cut-off: a red knob on its yellow plate, the spark sticker beside it */
    hdPart(out,mb=>{const p=[F-.002,y0-.06,0];hdRBox(mb,p,[.002,.025,.025],.004,SMC('#d6b21a',SM.PLASTIC),2);hdCyl(mb,V3.add(p,[-.002,0,0]),V3.add(p,[-.02,0,0]),.016,.014,18,SMC('#c41e1a',SM.PLASTIC));
      hdRBox(mb,V3.add(p,[-.026,0,0]),[.006,.004,.016],.003,SMC('#c41e1a',SM.PLASTIC),1);},35);
    hdPart(out,mb=>{hdExtrude(mb,[[-.015,-.012],[.015,-.012],[0,.015]],0,.0008,SMC('#1b5fd0',MAT.COL,.2),0,1,false);hdExtrude(mb,[[-.003,-.008],[.004,.0],[.0,.0],[.004,.009],[-.004,.001],[0,.001]],.0008,.0012,SMC('#e8e6df',MAT.COL,.3),0,1,false);},
      30,null,M4.basis([F-.0002,y0-.06,.055],[0,0,1],[0,1,0],[-1,0,0]));
    /* the fire system's pull: a red T handle under the panel, its sticker */
    hdPart(out,mb=>{const p=[F,y0-.11,-.06];hdCyl(mb,p,V3.add(p,[-.012,0,0]),.02,.02,20,SMC('#e8e6df',SM.PLASTIC));hdCyl(mb,V3.add(p,[-.012,0,0]),V3.add(p,[-.035,0,0]),.004,.004,8,MM.CHROME);
      hdCyl(mb,V3.add(p,[-.035,0,-.025]),V3.add(p,[-.035,0,.025]),.007,.007,10,SMC('#c41e1a',SM.PLASTIC));},35);}
  /* ---------- the sequential's lever on the tunnel, the hydraulic handbrake beside it ---------- */
  {const u=uHF-.36,z=-.13,ty=cy(u,z)+.004;
    hdPart(out,mb=>{hdRBox(mb,[X(u),ty+.03,z],[.06,.03,.035],.008,ALU,3);hdRev(mb,[[.03,0],[.026,.02],[.016,.045],[.011,.06]],20,SV([.02,.02,.021],MAT.RUBBER));},40,null,M4T(X(u),ty+.06,z));
    hdPart(out,mb=>{const a=[X(u),ty+.06,z],b=[X(u-.06),ty+.3,z];hdCyl(mb,a,b,.009,.008,12,MM.CHROME);ball(mb,V3.add(b,[-.006,.022,0]),.024,18,BLK);hdRBox(mb,V3.add(b,[-.006,.022,0]),[.02,.004,.025],.004,ALU,1);},40);
    const h=uHF-.16,hz=-.04,hy=cy(h,hz)+.004;
    hdPart(out,mb=>{hdRBox(mb,[X(h),hy+.025,hz],[.05,.025,.03],.006,ALU,2);hdCyl(mb,[X(h)+.05,hy+.035,hz],[X(h)+.12,hy+.035,hz],.014,.014,16,ALU);
      hdCyl(mb,[X(h)+.12,hy+.035,hz],[X(h)+.12,hy+.075,hz],.012,.012,14,SMC('#1a1a1c',SM.PLASTIC));
      const a=[X(h),hy+.04,hz],b=[X(h+.04),hy+.36,hz];hdCyl(mb,a,b,.011,.01,12,ALU);hdCyl(mb,V3.lerp(a,b,.72),b,.017,.016,14,SMC('#c41e1a',SM.VINYL));ball(mb,b,.017,12,SMC('#c41e1a',SM.VINYL));},40);}
  /* ---------- the extinguisher on the passenger's floor ---------- */
  {const z=.3,u0=uHF-.52,u1=uHF-.82,rr=.05,y=cy((u0+u1)/2,z)+rr+.014,A=[X(u0),y,z],B=[X(u1),y,z];
    hdPart(out,mb=>{cpRev(mb,A,B,[[0,0],[rr*.6,0],[rr,.03],[rr,.26],[rr*.7,.295],[.018,.31]],SMC('#c41e1a',SM.PAINTED),28,40);},40);
    hdPart(out,mb=>{hdCyl(mb,B,V3.add(B,[.03,0,0]),.018,.016,14,MM.CHROME);hdRBox(mb,V3.add(B,[.045,.02,0]),[.02,.008,.012],.004,BLK,2);hdTube(mb,[V3.add(B,[.04,-.01,0]),V3.add(B,[.07,-.03,.02]),V3.add(B,[.05,-.045,.05])],.005,8,BLK,false,true);
      hdRBox(mb,[X((u0+u1)/2),cy((u0+u1)/2,z)+.004,z],[.17,.004,.06],.003,ALU,2);
      for(const u of [u0-.07,u1+.08]){const ring=[];for(let k=0;k<=24;k++){const a=k/24*TAU;ring.push([X(u),y+Math.sin(a)*(rr+.004),z+Math.cos(a)*(rr+.004)]);}hdTube(mb,ring,.005,6,ALU,true,false);
        hdRBox(mb,[X(u),y+rr+.01,z],[.012,.008,.014],.003,ALU,1);}},40);}
  /* ---------- the net in the driver's window ---------- */
  {const u0=G.cowl+.5,u1=G.pillars[0][0]-.1,y0=D.belt(u0)+.04,y1=D.belt(u0)+.36,s=-1,p=(u,y)=>[X(u),y,s*inZ(u,y,.115)];
    hdPart(out,mb=>{for(let k=0;k<=8;k++){const u=u0+(u1-u0)*k/8,pts=[];for(let j=0;j<=6;j++)pts.push(p(u,y0+(y1-y0)*j/6));hdTube(mb,pts,.0035,6,BLK,false,false);}
      for(let j=0;j<=6;j++){const y=y0+(y1-y0)*j/6,pts=[];for(let k=0;k<=8;k++)pts.push(p(u0+(u1-u0)*k/8,y));hdTube(mb,pts,.0035,6,BLK,false,false);}
      for(const P of [[p(u0,y0),p(u0,y1)],[p(u1,y0),p(u1,y1)],[p(u0,y1),p(u1,y1)]])hdTube(mb,P,.007,8,BLK,false,true);},30);}
  /* ---------- the fuel cell in the cargo area ---------- */
  {const u0=D.uRa+D.archB.a+.14,u1=G.be-.08,zc=.28,y0=cy((u0+u1)/2,0)+.004,h=.24,C0=[X((u0+u1)/2),y0+h/2,0],AL=SMC('#c3c5c8',SM.BRUSH);
    hdPart(out,mb=>{hdRBox(mb,C0,[(u1-u0)/2,h/2,zc],.014,AL,3);for(let k=-3;k<=3;k++)hdRBox(mb,V3.add(C0,[k*(u1-u0)/7,0,zc+.001]),[.004,h/2-.02,.002],.002,AL,1);},35);
    hdPart(out,mb=>{for(const f of [-.3,.3]){const x=C0[0]+f*(u1-u0);hdRBox(mb,[x,y0+h+.002,0],[.018,.003,zc+.01],.002,SMC('#1a1a1c',SM.CLOTH),1);for(const e of [-1,1]){hdRBox(mb,[x,y0+h/2,e*(zc+.004)],[.018,h/2,.002],.002,SMC('#1a1a1c',SM.CLOTH),1);
        hdRBox(mb,[x,y0+.006,e*(zc+.03)],[.022,.006,.02],.003,ALU,1);cpHex(mb,[x,y0+.012,e*(zc+.03)],[0,1,0],.007,.004);}}},30);
    /* the filler: a neck on its top, the hose up to the cap on the right quarter; the breather beside it */
    const fl=D.B.fit.filler||[D.L-.52,secKeys(D,D.L-.52).yG+.22],cap=hdSS(1,fl[0],fl[1],0),top=[X(u0+.06),y0+h,.18];
    hdPart(out,mb=>{hdCyl(mb,top,V3.add(top,[0,.03,0]),.04,.04,20,AL);hdCyl(mb,V3.add(top,[0,.03,0]),V3.add(top,[0,.04,0]),.045,.045,20,SMC('#1b3a8a',SM.PAINTED));
      hdTube(mb,suvPath([V3.add(top,[0,.04,0]),V3.add(top,[0,.12,.06]),[cap[0],cap[1]-.12,cap[2]-.16],[cap[0],cap[1],cap[2]-.07],[cap[0],cap[1],cap[2]-.02]],5,2),.032,16,SMC('#141415',SM.HOSE),false,true);
      const b0=[X(u0+.16),y0+h,.2];hdCyl(mb,b0,V3.add(b0,[0,.02,0]),.012,.012,12,SMC('#1b3a8a',SM.PAINTED));hdTube(mb,suvPath([V3.add(b0,[0,.02,0]),V3.add(b0,[-.02,.18,.15]),[cap[0]-.06,cap[1]+.1,cap[2]-.06]],4,2),.006,8,SMC('#7d7f83',SM.SATIN),false,true);},40);
    /* the pump's lines from its front, down through the floor */
    hdPart(out,mb=>{for(const dz of [0,.016]){const a=[X(u0),y0+.05,.2+dz];hdTube(mb,suvPath([a,[X(u0-.02),y0+.05,.2+dz],[X(4.46),y0+.02,.2+dz],[X(4.46),y0-.04,.2+dz]],3,1),.005,8,SMC('#7d7f83',SM.SATIN),false,true);}},35);}
  /* ---------- a pull strap on each front door ---------- */
  for(const s of [1,-1])hdPart(out,mb=>{const u=G.cowl+.62,y=.9+dy,z=s*(K.sideZ(u,y)-.085);hdRBox(mb,[X(u),y,z],[.08,.014,.004],.004,WEB,2);for(const du of [-.07,.07])cpHex(mb,[X(u+du),y,z-s*.004],[0,0,-s],.006,.004);},35);
}
