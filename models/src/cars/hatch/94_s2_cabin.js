/* =====================================================================================
   THE HATCH'S CABIN, FINISHED (Studio 2): its Studio cabin (85 htCabin, 79_cabin hdCabinGen) laid again on the
   Studio 2 floor (the carpet up over the step under the rear seat, where the tank is, 90 HT_FLOOR), with what it
   leaves out:
   - the front seats' rails and their feet, the levers;
   - the seat belts finished: the adjuster and the D-ring on each B pillar, the latch plate, the buckles on their stalks
     beside the seats; the rear's from the quarters, their buckles in the cushion's back;
   - the boot: the wheel houses' carpeted humps, the struts' towers in their carpeted covers, the tie-down hooks, the
     lamp;
   - a pull strap on each door's card.
   o.rally (the Group B's): no rear seats, belts or carpet: the floor painted, a cage, two buckets in harnesses (95 of
   its own folder builds them in their place, from what this returns).
   ===================================================================================== */
function htCabin2(out,car,o={}){
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=D.dy,pil=G.pillars.map(p=>p[0]),RC=!!o.rally;
  const col={dash:'#1f1f21',dashTop:'#18181a',vinyl:'#27272a',insert:'#38383b',head:'#5c5a57',carpet:'#212123',seat:'#2f2f32',seatSide:'#262629',accent:'#a8221c'};
  if(RC)Object.assign(col,{carpet:'#c9c8c2',head:'#c9c8c2'});
  hdCabinGen(out,car,{floorY:.3+dy,uEnd:G.be-.06,headEnd:G.rr+.06,doors:2,armY:.3,dashDepth:.46,dashTop:D.belt(G.cowl+.46)-.045,hoodH:.055,
    dials:[[-.07,.05,0],[.07,.05,0],[-.16,.026,.0],[.16,.026,.0]],clusterW:.2,vents:[-.58,-.1,.1,.58],stackW:.16,needle:'#ff8a1a',
    wheelU:.16,wheelDrop:.09,wheelR:.18,rimT:.017,spokes:[0,PI,-PI/2],spokeT:.014,spokeM:SMC('#3a3b3e',SM.SATIN),hub:[.05,.05,.03],
    shifter:'manual',knob:SMC('#151517',SM.DASH),console:'small',consoleBack:.1,winders:1,cloth:1,seatStripe:1,
    seatF:pil[0]-.3,seatY:RC?.12:.3,seatZ:.36,seatW:.5,bolster:2,rear:RC?'none':'two',seatR:G.rr-.12,back:RC?'none':'parcel',parcel:[G.rr+.1,G.be-.06,D.belt(G.rr+.2)+.02],
    tunnel:HT_FLOOR.tunnel,tunnelW:HT_FLOOR.tunnelW,toe:HT_FLOOR.toe,tunnelEnd:pil[0]+.2,rearRise:HT_FLOOR.rise,noBelts:RC?1:0,col});
  const yF=.3+dy,cy=(u,z)=>htCarpet(u,z,dy),zw=u=>K.sideZ(u,Math.min(D.belt(u)-.1,yF+.42))-.05,uHF=pil[0]-.3,uHR=G.rr-.12,
    CHAR=SV(lin(col.dash),SM.DASH),CHARV=SV(lin(col.vinyl),SM.VINYL),CARP=SV(lin(col.carpet),SM.CARPET),SAT=HC.SATIN,BLK=SV([.012,.012,.013],SM.DASH),
    WEB=SMC('#1e1e1f',SM.CLOTH),PNT=SMC('#c9c8c2',SM.PAINTED);
  /* ---------- the front seats' rails, their feet and the levers ---------- */
  if(!RC)for(const s of [1,-1]){const zc=s*.36;
    for(const e of [-1,1]){const z=zc+e*.18;hdPart(out,mb=>{hdRBox(mb,[X(uHF-.2),yF+.13,z],[.24,.011,.015],.004,SMC('#2a2b2d',SM.ENGINE),2);hdRBox(mb,[X(uHF-.2),yF+.15,z],[.22,.009,.011],.003,SMC('#3a3b3e',SM.ENGINE),2);
      for(const du of [-.42,-.02]){const fy=cy(uHF+du,z);hdRBox(mb,[X(uHF+du),(fy+yF+.13)/2,z],[.02,Math.max(.006,(yF+.13-fy)/2),.017],.004,SMC('#2a2b2d',SM.ENGINE),2);cpHex(mb,[X(uHF+du),fy+.002,z],[0,1,0],.008,.006);}},30);}
    hdPart(out,mb=>{hdTube(mb,[[X(uHF-.46),yF+.17,zc-.11],[X(uHF-.5),yF+.16,zc-.05],[X(uHF-.5),yF+.16,zc+.05],[X(uHF-.46),yF+.17,zc+.11]],.006,8,BLK,false,true);
      const zo=s*(.36+.25);hdRBox(mb,[X(uHF-.2),yF+.3,zo],[.14,.035,.011],.009,CHAR,3);hdRBox(mb,[X(uHF-.08),yF+.32,zo+s*.013],[.028,.011,.006],.004,BLK,2);},35);}
  /* ---------- the belts finished ---------- */
  if(!RC){for(const s of [1,-1]){const u=pil[0],zt=secKeys(D,u).P[10][0]-.05,yt=K.topY(u,zt)-.12,top=[X(u)+.02,yt,s*(zt-.02)];
      /* the adjuster's track, the D-ring; the latch plate on the webbing; the buckle on its stalk by the tunnel */
      hdPart(out,mb=>{hdRBox(mb,V3.add(top,[0,.05,s*.004]),[.011,.06,.004],.003,CHAR,2);hdCyl(mb,V3.add(top,[0,0,-s*.004]),V3.add(top,[0,0,-s*.013]),.008,.008,12,SAT);
        const lp=[X(u)+.07,yF+.48,s*(zt-.11)];hdRBox(mb,lp,[.02,.028,.004],.003,SAT,2);hdRBox(mb,V3.add(lp,[0,.032,0]),[.016,.012,.005],.004,BLK,2);
        const b=[X(uHF-.08),yF+.33,s*.12],f=cy(uHF-.08,s*.12);hdTube(mb,[[b[0],f,b[2]],[b[0],(f+b[1])/2,b[2]-s*.004],b],.007,8,BLK,false,true);hdRBox(mb,V3.add(b,[0,.032,0]),[.016,.036,.011],.005,BLK,2);
        hdRBox(mb,V3.add(b,[0,.064,0]),[.011,.004,.008],.002,SMC('#b01e18',SM.PLASTIC),1);},35);}
    /* the rear belts: webbing down the quarter from its reel to the anchor; the buckles in the cushion's back */
    for(const s of [1,-1]){const u=G.rr-.02,zt=K.sideZ(u,D.belt(u)+.05)-.06,top=[X(u),D.belt(u)+.12,s*zt],bot=[X(uHR+.12),yF+.28,s*(zw(uHR)-.02)];
      hdPart(out,mb=>{hdRBox(mb,top,[.03,.012,.01],.005,BLK,2);hdSweep(mb,suvPath([V3.add(top,[0,-.01,-s*.01]),V3.lerp(top,bot,.5),bot],3,1),[[-.022,-.0012],[.022,-.0012],[.022,.0012],[-.022,.0012]],WEB,[0,0,s],true,true);
        for(const z of [.12,.2])hdRBox(mb,[X(uHR+.02),yF+.28,s*z],[.014,.025,.01],.005,BLK,2);},35);}}
  /* ---------- the boot ---------- */
  for(const s of [1,-1]){const zi=.5;
    /* the wheel house's hump over the rear wheel, carpeted, from the floor's edge out to the side */
    hdPart(out,mb=>{const rows=[],n=24;for(let k=0;k<=n;k++){const ph=-.03+(PI+.06)*k/n,[u,y]=archPt(D,D.uRa,ph,.05),zo=zw(u)-.005,row=[];
        for(let j=0;j<=6;j++){const t=j/6,z=zi+(zo-zi)*t;row.push([X(u),Math.max(cy(u,s*z),y+.01*Math.sin(t*PI)),s*z]);}rows.push(row);}
      hdLoft(mb,rows,CARP,false,s>0);const ib=rows.map(r=>r[0]),fl=ib.map(v=>[v[0],cy(D.uC-v[0],s*zi)-.004,v[2]]);hdLoft(mb,[ib,fl],CARP,false,s>0);},40);
    /* the strut's tower over it, in a carpeted cover, the damper's nut under its cap */
    {const u=D.uRa+.02,t=archY(D,u)+.03,c=[X(u),t,s*.55];hdPart(out,mb=>{hdCyl(mb,[c[0],archY(D,u)-.05,c[2]],V3.add(c,[0,.035,0]),.085,.07,28,CARP);hdCyl(mb,V3.add(c,[0,.035,0]),V3.add(c,[0,.05,0]),.028,.022,18,BLK);},35);}
    /* the tie-down hooks */
    for(const u of [D.uRa+D.archB.a+.06,G.be-.1])hdPart(out,mb=>{const z=s*(zw(u)-.03),y=cy(u,z)+.03,p=[X(u),y,z];hdRBox(mb,V3.add(p,[0,0,s*.006]),[.018,.018,.004],.004,SAT,2);
      const lp=[];for(let k=0;k<=10;k++){const a=k/10*PI;lp.push(V3.add(p,[Math.cos(a)*.014,-Math.sin(a)*.014+.004,-s*.008]));}hdTube(mb,lp,.0028,6,MM.CHROME,false,true);},40);}
  hdPart(out,mb=>{const u=G.be-.2,z=-(zw(u)-.012),y=D.belt(u)-.1;hdRBox(mb,[X(u),y,z],[.035,.013,.005],.004,SMC('#e8e6df',SM.PLASTIC),2);},35);
  /* ---------- a pull strap on each door's card ---------- */
  for(const s of [1,-1])hdPart(out,mb=>{const u=G.cowl+.62,y=D.belt(u)-.11,z=s*(K.sideZ(u,y)-.075);hdRBox(mb,[X(u),y,z],[.07,.012,.004],.004,RC?SMC('#c41e1a',SM.CLOTH):CHARV,2);for(const du of [-.06,.06])cpHex(mb,[X(u+du),y,z-s*.004],[0,0,-s],.005,.004);},35);
  return {yF,cy,zw,uHF,uHR,CHAR,BLK,SAT,PNT};
}
