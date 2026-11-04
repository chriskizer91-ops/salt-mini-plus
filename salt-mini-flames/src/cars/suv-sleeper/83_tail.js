/* =====================================================================================
   THE SLEEPER'S TAIL, IN THREE DIMENSIONS (in place of 22_faces TAILS.led's decals), on the decals' own outlines:
   - The light bar across the liftgate: a black cavity under a clear smoked lens, a red light guide along its foot.
   - The corner lamps: a black cavity under a red lens, a square LED ring glowing in it, the reversing lamp in its
     middle under a clear window.
   - The plate in its recess, a lamp either side above it.
   - The diffuser (REARS.diffuser, where the game hangs its own): a gloss-black plate leaning up under the bumper,
     five fins standing down from it, the red line along its top edge.
   ===================================================================================== */
function slTail(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,cuts=[car.body],TL=SV([1,1,1],MAT.TAIL);
  /* ---------- the light bar ---------- */
  {const B0=RR2(-.63,.63,Y(.96),Y(1.12),.02);
    hdLampUnit(out,'R',B0,cuts,{deep:.04,k:.95,wall:HC.GB,back:()=>HC.GB,bulge:.002,cell:.006,lens:()=>HC.LENS,
      inside:o=>{const pts=[];for(let z=-.6;z<=.6001;z+=.04)pts.push(hdS('R',z,Y(.97),-.01));hdPart(o,mb=>{hdTube(mb,pts,.0048,10,TL,false,true);},50);
        /* (the guide's reflector behind it, a satin strip) */
        hdPart(o,mb=>{const a=hdS('R',-.6,Y(.97),-.02),b=hdS('R',.6,Y(.97),-.02);hdRBox(mb,[(a[0]+b[0])/2,a[1],0],[.004,.009,.605],.004,HC.SATIN,2);},40);}});}
  for(const s of [1,-1]){
    /* ---------- the corner lamp ---------- */
    const L=[[.64,.93],[.875,.925],[.885,1.14],[.64,1.145]].map(([z,y])=>[s*z,Y(y)]),zc=.762,yc=Y(1.035),hw=.095,hh=.075,RV=RR2(s*(zc-.05),s*(zc+.05),yc-.014,yc+.014,.006);
    hdLampUnit(out,'R',L,cuts,{deep:.05,k:.92,wall:HC.GB,back:()=>HC.GB,bulge:.003,cell:.005,lens:(z,y)=>hdIn(RV,z,y)?HC.LENSR:HC.REDL,
      inside:o=>{
        /* the LED ring: a square light guide round the middle */
        hdPart(o,mb=>{const sq=hdResample(RR2(s*(zc-hw),s*(zc+hw),yc-hh,yc+hh,.012),.008).map(([z,y])=>hdS('R',z,y,-.014));hdTube(mb,sq,.0055,10,TL,true,false);},50);
        /* the reversing lamp: a satin reflector, its bulb */
        hdPart(o,mb=>{const c=hdS('R',s*zc,yc,-.03);hdRBox(mb,c,[.006,.016,.05],.006,HC.REFLC,3);ball(mb,V3.add(c,[-.008,0,0]),.007,12,HC.BULB);},50);}});
    hdTrim(out,'R',hdResample(RV,.006),.004,.003,HC.SEAL,true,50,.002);}
  /* ---------- the plate ---------- */
  {const pr=RR2(-.2,.2,Y(.85),Y(.955),.02);for(const c of cuts)hdCut(c,'R',pr);
    hdRecess(out,'R',pr,.022,.98,HC.GB,()=>HC.GB,5);
    const pl=RR2(-.16,.16,Y(.865),Y(.945),.008);
    hdPart(out,mb=>{hdGrid(mb,'R',pl,()=>-.018,()=>SV([1,1,1],MAT.PLATE),.02);const P=hdResample(pl,.01);hdLoft(mb,[P.map(p=>hdS('R',p[0],p[1],-.018)),P.map(p=>hdS('R',p[0],p[1],-.022))],SV([1,1,1],MAT.PLATE),true);},20);
    hdTrim(out,'R',hdResample(RR2(-.155,.155,Y(.87),Y(.94),.006),.01),.004,.0015,SV([.05,.07,.18],MAT.COL),true,50,-.018);
    for(const z of [-.1,.1])hdPart(out,mb=>{hdRBox(mb,hdS('R',z,Y(.951),-.018),[.003,.004,.02],.003,HC.LENS,2);},40);}
  /* ---------- the diffuser ---------- */
  {const x=X(D.L),y=Y(.47),ax=V3.norm([1,-.25,0]),ay=V3.norm([.25,1,0]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.18,.007,.5],.005,HC.GB,2);},30,null,M4.basis([x+.15,y,0],ax,ay,[0,0,1]));
    for(let k=-2;k<=2;k++)hdPart(out,mb=>{hdExtrude(mb,[[x+.3,Y(.44)],[x+.2,Y(.43)],[x-.008,Y(.47)],[x-.008,Y(.518)]],k*.18-.004,k*.18+.004,HC.GB,.0015,2,true);},35);
    hdPart(out,mb=>{hdRBox(mb,[x-.011,Y(.53),0],[.0035,.0045,.48],.003,SV([1,1,1],MAT.ACCENT),2);},40);}
}
