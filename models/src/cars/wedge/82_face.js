/* =====================================================================================
   THE WEDGE'S FACE, IN THREE DIMENSIONS (in place of 35_wedge FACES.wedge's decals), on the decals' own outlines,
   across the knife-edge nose:
   - The slot across the bumper: an opening going well in, a black honeycomb at its back, three black slats across.
   - The amber blades above the slot's ends: slim indicators, each a cavity with a bulb under an amber lens.
   - The driving lamps beside the slot: small round lamps, a reflector and a bulb under a clear lens, chrome rings.
   (The lip is the shared one, 79_parts hdLip, as the game has it.)
   THE POP-UP LAMPS, up (in place of 35_wedge EXTRAS.popups' boxes), on the bonnet so they lift with it: each a
   body-colour pod with a flat top and rounded edges, standing out of the bonnet where the game puts it, its front a
   black panel holding two round lamps: a chrome ring, a reflector going back into the pod, a bulb, a domed clear
   lens.
   ===================================================================================== */
function wdFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood];
  /* ---------- the slot ---------- */
  {const S0=wdRR(-.62,.62,Y(.305),Y(.385),.012);for(const c of cuts)hdCut(c,'F',S0);
    hdRecess(out,'F',S0,.08,.96,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(S0,.95),.06,.014,.0016,.012,HC.HONEY);
    /* the three slats, following the nose's curve */
    for(let k=0;k<3;k++){const y=Y(.321+k*.024),pts=[];for(let z=-.6;z<=.6001;z+=.025)pts.push(hdS('F',z,y,-.011));
      hdPart(out,mb=>{hdSweep(mb,pts,[[-.001,-.0055],[.014,-.0055],[.014,.0055],[-.001,.0055],[-.0025,0]],HC.GB,[0,1,0],true,true);},35);}}
  for(const s of [1,-1]){
    /* ---------- the amber blade ---------- */
    hdLampUnit(out,'F',wdRR(s*.64,s*.84,Y(.395),Y(.418),.006),cuts,{deep:.03,k:.88,wall:HC.GB,back:()=>HC.REFLC,bulge:.0015,cell:.003,lens:()=>HC.AMBERL,tol:.04,
      inside:o=>{hdPart(o,mb=>{for(const z of [.69,.79])ball(mb,hdS('F',s*z,Y(.4065),-.018),.0055,10,HC.BULB);},50);}});
    /* ---------- the driving lamp ---------- */
    {const c0=[s*.73,Y(.345)];
      hdLampUnit(out,'F',EL2(c0[0],c0[1],.028,.028,28),cuts,{deep:.035,k:.72,wall:HC.REFLC,back:()=>HC.REFLC,bulge:.005,cell:.003,lens:()=>HC.LENSH,seal:false,tol:.04,
        inside:o=>{hdPart(o,mb=>{ball(mb,hdS('F',c0[0],c0[1],-.028),.007,12,HC.LAMPH);},50);}});
      hdRevAt(out,'F',hdS('F',c0[0],c0[1],-.002),[[.0335,.0004],[.033,.0035],[.0295,.0048],[.0278,.0035],[.0276,.001]],MM.CHROME,40);}
  }
}
function wdPopups(out,car){
  const K=HDK,D=K.D,X=K.X,u0=.34,u1=.66,zc=.62,hw=.17,PA=SV([1,1,1],MAT.PAINT),n=14;
  for(const s of [1,-1]){
    const yb=Math.max(K.topY(u0,zc-hw),K.topY(u0,zc+hw)),yt=yb+.13,lowest=u=>Math.min(K.topY(u,zc-hw),K.topY(u,zc+hw))-.025;
    /* the pod: rounded rings from its face back to where the bonnet swallows it; its front edge rolled */
    const rings=[],ring=(u,ins)=>{const yl=lowest(u),h=(yt-yl)/2-ins,cy=(yt+yl)/2;return hdRRect(hw-ins,h,.02,5).map(([zz,yy])=>[X(u),cy+yy,s*zc+zz]);};
    for(const [du,ins] of [[0,.009],[.0025,.004],[.008,.001],[.016,0]])rings.push(ring(u0+du,ins));
    for(let i=1;i<=n;i++)rings.push(ring(u0+.016+(u1-u0-.016)*i/n,0));
    hdPart(out,mb=>{hdLoft(mb,rings,PA,true,s<0);hdCap(mb,rings[rings.length-1],PA,s<0);},40);
    /* its face: a painted frame round the black panel, the panel open where the lamps are */
    const yc=yt-.065,xa=X(u0)+.0012,lamps=[-.075,.075].map(dz=>[s*zc+dz,yc]),holes=lamps.map(([z,y])=>EL2(z,y,.0405,.0405,28)),Pp=wdRR(s*zc-hw+.02,s*zc+hw-.02,yc-.05,yc+.05,.012);
    hdPart(out,mb=>{wdHoled(mb,hdHull(rings[0].map(p=>[p[2],p[1]])),[Pp],.01,(z,y)=>[X(u0),y,z],PA,[1,0,0]);},30);
    hdPart(out,mb=>{wdHoled(mb,Pp,holes,.01,(z,y)=>[xa,y,z],HC.GB,[1,0,0]);},30);
    /* (the panel's edge, back to the frame) */
    hdPart(out,mb=>{const R=hdResample(Pp,.006);hdLoft(mb,[R.map(([z,y])=>[xa,y,z]),R.map(([z,y])=>[X(u0)+.0002,y,z])],HC.GB,true);},30);
    for(const [z,y] of lamps){const p=[xa,y,z];
      /* the chrome ring, the reflector going back into the pod, the bulb, the lens */
      hdRevAt(out,'F',p,[[.0465,-.001],[.0465,.0035],[.0445,.0065],[.0412,.0068],[.0402,.004]],MM.CHROME,48);
      hdRevAt(out,'F',p,[[.0402,.004],[.0395,-.006],[.034,-.022],[.022,-.034],[.009,-.039],[.0085,-.039]],HC.REFLC,48);
      hdPart(out,mb=>{ball(mb,[xa-.024,y,z],.0085,14,HC.LAMPH);hdCyl(mb,[xa-.03,y,z],[xa-.04,y,z],.009,.009,14,HC.SATIN);},50);
      hdRevAt(out,'F',p,[[.0402,.0045],[.036,.0078],[.026,.0105],[.013,.0118],[0,.0121]],HC.LENSH,48);}
  }
}
