/* =====================================================================================
   THE ROCK & MUD'S FACE, IN THREE DIMENSIONS (in place of 22_faces FACES.back's decals), on the decals' own
   outlines, and its steel bumper (FRONTS.steel, where the game hangs its own):
   - The grille: a black plastic surround, the grille itself in the body's colour standing in it, three slots cut
     across it, a black mesh set back behind each.
   - The lamps: a black panel a side, two round sealed-beam lamps in it, each a chrome reflector behind a domed clear
     lens in a chrome bezel, its bulb shield in the middle; the amber signal under them, a bulb behind its own lens.
   - The bumper: a plated steel bar across the nose, its ends angled back, plates on top; the winch in the middle
     (drum, rope, motor, gearbox, the alloy fairlead, a red hook); a bronze shackle a side in its tab; a square LED
     pod a side on top; the skid plate under the nose. Bolts where things are bolted.
   ===================================================================================== */
/* a patch over a convex outline, wrapped on the surface (as 72_face hdGrid), the cells whose middles fall inside any
   of the holes left out */
function cwPanel(mb,view,P,off,m,cl,holes){const w=hdCCW(P);let z0=1e9,z1=-1e9,y0=1e9,y1=-1e9;for(const q of P){z0=Math.min(z0,q[0]);z1=Math.max(z1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}
  const nz=Math.max(1,Math.ceil((z1-z0)/cl)),ny=Math.max(1,Math.ceil((y1-y0)/cl)),dz=(z1-z0)/nz,dyy=(y1-y0)/ny;
  for(let i=0;i<nz;i++)for(let j=0;j<ny;j++){const a=z0+i*dz,b=y0+j*dyy;if(holes.some(H=>hdIn(H,a+dz/2,b+dyy/2)))continue;
    let V=[[a,b],[a+dz,b],[a+dz,b+dyy],[a,b+dyy]].map(q=>({q,p:[0,0,0],n:[0,0,0],c:[0,0,0,0]}));
    for(let k=0;k<P.length&&V.length>=3;k++)V=hdClip(V,P[k],P[(k+1)%P.length],w);if(V.length<3)continue;
    const S=V.map(v=>hdS(view,v.q[0],v.q[1],off));
    for(let k=1;k<S.length-1;k++){if(view==='F'?w>0:w<0)mb.tri(S[0],S[k],S[k+1],m[0],m[1],m[2]);else mb.tri(S[0],S[k+1],S[k],m[0],m[1],m[2]);}}}
function cwFace(out,car){
  const K=HDK,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood],PA=SV([1,1,1],MAT.PAINT),PL=HC.PLASTIC;
  /* ---------- the grille ---------- */
  {const S0=RR2(-.452,.452,Y(.798),Y(1.03),.03),G0=RR2(-.432,.432,Y(.813),Y(1.016),.025),SL=[[.81,.845],[.87,.905],[.93,.965]].map(([a,b])=>RR2(-.4,.4,Y(a),Y(b),.012));
    for(const c of cuts)hdCut(c,'F',S0);
    hdPart(out,mb=>{cwPanel(mb,'F',S0,-.004,PL,.008,[G0]);cwPanel(mb,'F',G0,-.001,PA,.006,SL);},30);
    hdTrim(out,'F',hdResample(S0,.008),.012,.006,PL,true,50,.0005);hdTrim(out,'F',hdResample(G0,.008),.008,.005,PA,true,50,-.0005);
    for(const s of SL){hdRecess(out,'F',s,.045,.96,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(s,.97),.022,.012,.0015,.01,HC.HONEY);
      hdTrim(out,'F',hdResample(s,.006),.006,.004,PA,true,50,-.0005);}}
  for(const s of [1,-1]){
    /* ---------- the lamp panel, its two round lamps and the signal ---------- */
    const L=[[.47,.793],[.865,.798],[.9,.858],[.885,1.018],[.47,1.03]].map(([z,y])=>[s*z,Y(y)]),A=RR2(s*.5,s*.84,Y(.813),Y(.848),.008),
      lamps=[.565,.715].map(z=>EL2(s*z,Y(.943),.05,.05,40));
    for(const c of cuts)hdCut(c,'F',L);
    hdPart(out,mb=>{cwPanel(mb,'F',L,-.003,PL,.006,[...lamps,A]);},30);hdTrim(out,'F',hdResample(L,.008),.009,.005,PL,true,50,.0005);
    for(const zp of [.565,.715]){const z=s*zp,y=Y(.943),E0=EL2(z,y,.05,.05,40);
      hdLampUnit(out,'F',E0,[],{deep:.06,k:.8,wall:HC.REFLC,back:()=>HC.REFLC,bulge:.014,cell:.004,lens:()=>HC.LENSH,seal:false,
        inside:o=>{const b=hdS('F',z,y,-.045);hdPart(o,mb=>{ball(mb,b,.009,14,HC.LAMPH);},50);hdRevAt(o,'F',V3.add(b,[.016,0,0]),[[.015,0],[.014,.006],[.008,.009],[0,.01]],MM.CHROME,32);}});
      hdRevAt(out,'F',hdS('F',z,y,0),[[.049,-.004],[.05,.004],[.056,.01],[.062,.008],[.064,0],[.063,-.006]],MM.CHROME,64);}
    hdLampUnit(out,'F',A,[],{deep:.03,k:.94,wall:HC.GB,back:()=>HC.REFLC,bulge:.002,cell:.004,lens:()=>HC.AMBERL,
      inside:o=>{hdPart(o,mb=>{ball(mb,hdS('F',s*.67,Y(.83),-.02),.007,12,HC.BULB);},50);}});}
}
function cwBumperF(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,S=SMC('#1c1d1f',SM.PAINTED),x0=X(0)+.07,BR=SMC('#a8783c',SM.PAINTED),BOLT=HC.BOLT;
  /* the bar, its angled ends, the plates on top */
  hdPart(out,mb=>{hdRBox(mb,[x0,Y(.56),0],[.09,.115,.62],.014,S,3);},35);
  for(const s of [1,-1]){const a=V3.norm([-.55,0,s]),Mw=M4.basis([x0-.12,Y(.6),s*.76],a,[0,1,0],V3.cross(a,[0,1,0]));
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.2,.085,.06],.014,S,3);},35,null,Mw);
    hdPart(out,mb=>{hdRBox(mb,[x0-.06,Y(.68),s*.55],[.07,.012,.12],.005,S,2);for(const [dx,dz] of [[-.04,-.07],[.04,-.07],[-.04,.07],[.04,.07]])hdCyl(mb,[x0-.06+dx,Y(.692),s*.55+dz],[x0-.06+dx,Y(.698),s*.55+dz],.007,.006,6,BOLT);},40);
    /* the shackle: its tab out of the bar, the bronze bow through it, the pin */
    {const cx=x0+.13,cy=Y(.5),z=s*.42,r=.036;hdPart(out,mb=>{hdExtrude(mb,[[x0+.07,cy-.035],[x0+.13,cy-.025],[x0+.14,cy],[x0+.13,cy+.025],[x0+.07,cy+.035]],z-.012,z+.012,S,.003,2,true);},40);
      hdPart(out,mb=>{const pts=[];for(let k=0;k<=12;k++){const t=-PI/2+PI*k/12;pts.push([cx+Math.cos(t)*r+.02,cy+Math.sin(t)*r,z]);}hdTube(mb,[[cx-.03,cy-r,z],...pts,[cx-.03,cy+r,z]],.011,12,BR,false,true);
        hdCyl(mb,[cx-.03,cy-r-.022,z],[cx-.03,cy+r+.022,z],.009,.009,12,BR);ball(mb,[cx-.03,cy+r+.024,z],.013,12,BR);},45);}
    /* the LED pod on top: a black housing, its lens, the emitters behind it */
    {const c=[x0+.03,Y(.7),s*.6];hdPart(out,mb=>{hdRBox(mb,c,[.04,.05,.05],.012,S,3);hdRBox(mb,[c[0]-.03,c[1]-.06,c[2]],[.02,.012,.02],.004,S,2);},40);
      hdPart(out,mb=>{hdRBox(mb,[c[0]+.04,c[1],c[2]],[.003,.04,.04],.006,HC.LENSH,2);for(const dy2 of [-.02,0,.02])for(const dz of [-.02,0,.02])ball(mb,[c[0]+.034,c[1]+dy2,c[2]+dz],.006,10,HC.LAMPH);},45);}}
  /* the winch: drum and rope, the motor and the gearbox at its ends, the alloy fairlead, the red hook on its strap */
  {const c=[x0+.04,Y(.66),0];
    hdPart(out,mb=>{hdCyl(mb,[c[0],c[1],-.16],[c[0],c[1],.16],.06,.06,32,S);for(let k=-7;k<=7;k++)hdCyl(mb,[c[0],c[1],k*.02-.009],[c[0],c[1],k*.02+.009],.072,.072,32,SMC('#202020',MAT.RUBBER),true);},35);
    hdPart(out,mb=>{hdCyl(mb,[c[0],c[1],-.26],[c[0],c[1],-.16],.07,.07,32,S);hdCyl(mb,[c[0],c[1],-.28],[c[0],c[1],-.26],.06,.055,32,S);hdRBox(mb,[c[0],c[1],.21],[.075,.075,.05],.015,S,3);
      for(const z of [-.16,.16])hdCyl(mb,[c[0],c[1],z-.006],[c[0],c[1],z+.006],.085,.085,32,S);},35);
    hdPart(out,mb=>{hdRBox(mb,[x0+.1,Y(.6),0],[.012,.035,.11],.008,SMC('#9a9ca0',SM.BRUSH),3);hdRBox(mb,[x0+.113,Y(.6),0],[.002,.012,.05],.008,HC.GB,2);
      for(const z of [-.085,.085])hdCyl(mb,[x0+.112,Y(.6),z],[x0+.118,Y(.6),z],.008,.007,6,BOLT);},40);
    hdPart(out,mb=>{hdTube(mb,[[c[0]+.05,c[1]-.05,0],[x0+.1,Y(.6),0],[x0+.14,Y(.585),0]],.006,8,SMC('#202020',MAT.RUBBER),false,true);
      const h=[x0+.15,Y(.57),0];hdTube(mb,[[h[0]-.01,h[1]+.01,0],[h[0]+.01,h[1],0],[h[0]+.012,h[1]-.025,0],[h[0]-.005,h[1]-.035,0],[h[0]-.012,h[1]-.022,0]],.006,10,SMC('#c83020',SM.PAINTED),false,true);},45);}
  /* bolts across the bar's face */
  hdPart(out,mb=>{for(const z of [-.55,-.3,.3,.55])for(const y of [.49,.63])hdCyl(mb,[x0+.09,Y(y),z],[x0+.097,Y(y),z],.008,.007,6,BOLT);},40);
  /* the skid plate under the nose */
  hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.3,.008,.5],.005,S,2);for(const dx of [-.22,0,.22])for(const dz of [-.4,.4])hdCyl(mb,[dx,.008,dz],[dx,.013,dz],.009,.008,6,BOLT);},35,null,M4.basis([X(.32),Y(.38),0],V3.norm([1,.35,0]),V3.norm([-.35,1,0]),[0,0,1]));
}
