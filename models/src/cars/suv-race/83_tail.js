/* =====================================================================================
   THE RACE'S TAIL, IN THREE DIMENSIONS (in place of 22_faces TAILS.race's decals), on the decals' own outlines, and
   its diffuser (REARS.race, where the game hangs its own):
   - The lamps: slim slots on the quarters, a black cavity under a red lens, an LED bar glowing along each.
   - The light line across the liftgate between them: a red light guide in a narrow channel.
   - The diffuser: a carbon floor sweeping up under the tail, seven fins standing down from it; the rain lamp in the
     middle (a black housing, a red lens, its LEDs); the red tow strap on its loop.
   (No plate: the race car runs without.)
   ===================================================================================== */
function rcTail(out,car){
  const K=HDK,dy=K.dy,Y=y=>y+dy,cuts=[car.body],TL=SV([1,1,1],MAT.TAIL);
  for(const s of [1,-1]){const L=[[.64,1.05],[.875,1.045],[.885,1.1],[.64,1.105]].map(([z,y])=>[s*z,Y(y)]),I=[[.66,1.062],[.865,1.058],[.87,1.075],[.66,1.079]].map(([z,y])=>[s*z,Y(y)]);
    hdLampUnit(out,'R',L,cuts,{deep:.04,k:.9,wall:HC.GB,back:()=>HC.GB,bulge:.002,cell:.004,lens:()=>HC.REDL,
      inside:o=>{hdPart(o,mb=>{hdGrid(mb,'R',I,()=>-.012,()=>TL,.006);},40);hdPart(o,mb=>{const P=hdResample(I,.006);hdLoft(mb,[P.map(p=>hdS('R',p[0],p[1],-.011)),P.map(p=>hdS('R',p[0],p[1],-.025))],HC.SATIN,true);},30);}});}
  /* the light line across the liftgate */
  {const C0=RR2(-.62,.62,Y(1.057),Y(1.075),.008);
    hdLampUnit(out,'R',C0,cuts,{deep:.02,k:.9,wall:HC.GB,back:()=>HC.GB,bulge:.001,cell:.005,lens:()=>HC.REDL,
      inside:o=>{const pts=[];for(let z=-.6;z<=.6001;z+=.04)pts.push(hdS('R',z,Y(1.066),-.008));hdPart(o,mb=>{hdTube(mb,pts,.0035,8,TL,false,true);},50);}});}
}
function rcDiffuser(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy+D.B.fit.rdy,x=X(D.L),CF=SV([1,1,1],MAT.CARBON);
  hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.28,.008,.66],.006,CF,2);},30,null,M4.basis([x+.25,Y(.43),0],V3.norm([1,-.3,0]),V3.norm([.3,1,0]),[0,0,1]));
  for(let k=-3;k<=3;k++)hdPart(out,mb=>{hdExtrude(mb,[[x+.45,Y(.37)],[x+.25,Y(.36)],[x-.06,Y(.43)],[x-.06,Y(.56)]],k*.2-.004,k*.2+.004,CF,.002,2,true);},35);
  /* the rain lamp */
  hdPart(out,mb=>{hdRBox(mb,[x-.02,Y(.62),0],[.014,.037,.047],.006,HC.GB,3);hdRBox(mb,[x-.033,Y(.62),0],[.002,.03,.04],.004,HC.REDL,2);
    for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)ball(mb,[x-.029,Y(.62)+i*.018,j*.024],.005,8,SV([1,1,1],MAT.TAIL));},40);
  /* the tow strap */
  {const RED=SMC('#d02020',MAT.FABRIC),a=[x+.01,Y(.5),-.42],b=[x-.08,Y(.48),-.42];
    hdPart(out,mb=>{const path=[a,V3.lerp(a,b,.5),b,[b[0]-.012,b[1]-.02,b[2]],[b[0]+.005,b[1]-.035,b[2]],V3.add(V3.lerp(a,b,.5),[0,-.03,0]),[a[0],a[1]-.025,a[2]]];
      hdSweep(mb,rcSpline(path,6),[[-.003,-.014],[.003,-.014],[.003,.014],[-.003,.014]],RED,[0,0,1],true,true);},40);}
}
