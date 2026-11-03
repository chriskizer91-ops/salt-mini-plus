/* =====================================================================================
   THE EV'S TAIL AND DIFFUSER, IN THREE DIMENSIONS (in place of 34_ev TAILS.ev's decals and 25_coupe
   REARS.coupeDiff's boxes):
   - The light bar right across the tail under the ducktail: a black cavity under one red lens, a red light guide
     glowing along it, its ends wrapping round the corners (each end its own cavity, meeting the bar's).
   - The plate in a shallow recess.
   - The diffuser: the black valance across the bottom, the reversing lamps set in it, small red reflectors at its
     ends; the floor under the tail sweeping up to it, five fins standing down from it.
   ===================================================================================== */
function evTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body],X=K.X,GUIDE=SV([1,1,1],MAT.TAIL);
  /* ---------- the light bar ---------- */
  const bar=RR2(-.6,.6,Y(.835),Y(.872),.006);
  hdLampUnit(out,'R',bar,cuts,{deep:.032,k:.9,wall:HC.GB,back:()=>HC.GB,bulge:.0015,cell:.004,lens:()=>HC.REDL,seal:false,
    inside:o=>{const pts=[];for(let z=-.6;z<=.6001;z+=.04)pts.push(hdS('R',z,Y(.8535),-.012));hdPart(o,mb=>{hdTube(mb,pts,.0055,10,GUIDE,false,false);},50);}});
  for(const s of [1,-1]){const E=[[.6,.835],[.9,.84],[.92,.88],[.6,.872]].map(([z,y])=>[s*z,Y(y)]);
    hdLampUnit(out,'R',E,cuts,{deep:.032,k:.88,wall:HC.GB,back:()=>HC.GB,bulge:.0015,cell:.004,lens:()=>HC.REDL,seal:false,tol:.04,
      inside:o=>{const pts=[];for(let t=0;t<=1.0001;t+=.1)pts.push(hdS('R',s*(.6+.3*t),Y(.8535+.006*t*t),-.012));hdPart(o,mb=>{hdTube(mb,pts,.0055,10,GUIDE,false,false);},50);}});}
  {const all=[[-.92,.88],[-.9,.84],[-.6,.835],[.6,.835],[.9,.84],[.92,.88],[.6,.872],[-.6,.872]].map(([z,y])=>[z,Y(y)]);hdTrim(out,'R',hdResample(all,.006),.006,.0025,HC.SEAL,true,50);}
  /* ---------- the plate ---------- */
  {const R0=RR2(-.2,.2,Y(.585),Y(.735),.015);for(const c of cuts)hdCut(c,'R',R0);hdRecess(out,'R',R0,.016,.985,SV([1,1,1],MAT.PAINT),()=>SV([1,1,1],MAT.PAINT),4);
    const P=hdResample(RR2(-.18,.18,Y(.6),Y(.72),.008),.01);
    hdPart(out,mb=>{const F=P.map(([z,y])=>hdS('R',z,y,-.012)),B=P.map(([z,y])=>hdS('R',z,y,-.0155));hdCap(mb,F,SV([1,1,1],MAT.PLATE),false);hdLoft(mb,[F,B],SV([1,1,1],MAT.PLATE),true);},20);
    hdPart(out,mb=>{const r=hdResample(RR2(-.173,.173,Y(.607),Y(.713),.006),.01).map(([z,y])=>hdS('R',z,y,-.0115));r.push(r[0]);hdTube(mb,r,.0016,6,SV([.05,.07,.18],MAT.COL),false,false);},40);
    for(const z of [-.12,.12])hdPart(out,mb=>{hdRBox(mb,hdS('R',z,Y(.742),-.004),[.004,.004,.02],.003,HC.LENS,2);},40);}
  evDiffuser(out,car);
}
function evDiffuser(out,car){
  const K=HDK,D=K.D,X=K.X,x=X(D.L),y0=D.sill(D.L),PL=HC.PLASTIC;
  /* the valance across the tail's foot, in gloss black, its corners rounded */
  hdPart(out,mb=>{hdRBox(mb,[x-.006,y0+.03,0],[.012,.06,.78],.01,HC.GB,3);},35);
  /* the floor under the tail, sweeping up to it */
  {const ax=V3.norm([1,-.18,0]),ay=V3.norm([.18,1,0]);hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.16,.006,.76],.004,PL,2);},30,null,M4.basis([x+.12,y0-.03,0],ax,ay,[0,0,1]));}
  /* five fins standing down from it */
  for(let k=-2;k<=2;k++)hdPart(out,mb=>{hdExtrude(mb,[[x+.22,y0-.05],[x+.15,y0-.06],[x-.012,y0-.02],[x-.012,y0+.06]],k*.16-.003,k*.16+.003,PL,.0015,2,true);},35);
  /* the reversing lamps set in the valance, the red reflectors at its ends */
  for(const s of [1,-1]){
    hdPart(out,mb=>{hdRBox(mb,[x-.0185,y0+.03,s*.26],[.003,.014,.06],.004,HC.LENSR,2);},40);
    hdPart(out,mb=>{for(let z=.21;z<=.311;z+=.02)ball(mb,[x-.016,y0+.03,s*z],.003,8,HC.BULB);},50);
    hdPart(out,mb=>{hdRBox(mb,[x-.0195,y0+.05,s*.74],[.003,.012,.035],.003,HC.REFR,2);},40);}
}
