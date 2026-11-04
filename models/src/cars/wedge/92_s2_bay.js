/* =====================================================================================
   THE WEDGE'S FRONT TRUNK (Studio 2): the Studio's (87 wdBay: 79_bay hdBayGen's mid-engined front, its trunk tub,
   the radiator and its two fans, the booster, the battery, the bottles) with its floor between the wheel houses only,
   so the wishbones under it have their room (91), and on each tub the coilover's top mount: a plate, three studs and
   their nuts, the damper's nut under its cap; all of it kept under the lid, drawn all the time in Studio 2. (o.nos: the Night Runner's nitrous bottle, strapped across the trunk's
   back wall, its valve and feed.)
   The engine is behind the cabin, in its room (86 wdV12, its floor left out: the underside's below).
   ===================================================================================== */
function wdBay2(car,o={}){
  const B=hdBayGen(car,{engine:{layout:'MID',efans:1},tubeR:.04}),K=HDK,D=K.D,X=K.X,H=D.hood,uF=H.u0+.09,uR=H.u1-.02,y=D.sill((uF+uR)/2)+.012;
  hdPart(B.bay,mb=>{const rows=[];for(let u=uF-.04;u<=uR+.02+1e-6;u+=.04){const zz=Math.min(H.hz(u),D.plan(u)*.72,.32)-.01,row=[];for(let j=0;j<=10;j++)row.push([X(u),y,-zz+2*zz*j/10]);rows.push(row);}hdLoft(mb,rows,HC.LINER,false,true);},30);
  for(const s of [1,-1]){const u=D.uFa,z=s*.63,c=[X(u),archY(D,u)+.04,z];
    hdPart(B.bay,mb=>{hdCyl(mb,c,V3.add(c,[0,.004,0]),.05,.048,28,SMC('#2a2b2e',SM.ENGINE));for(let q=0;q<3;q++){const a=q/3*TAU+.3,p=V3.add(c,[Math.cos(a)*.036,.004,Math.sin(a)*.036]);hdCyl(mb,p,V3.add(p,[0,.014,0]),.005,.005,6,HC.BOLT);cpHex(mb,p,[0,1,0],.008,.007);}
      hdCyl(mb,V3.add(c,[0,.004,0]),V3.add(c,[0,.024,0]),.018,.015,18,SV([.02,.02,.021],MAT.RUBBER));},30);}
  if(o.nos){const u=uR-.06,yb=archY(D,uR)>0?archY(D,uR)+.12:y+.25,A=[X(u),yb,-.3],Bb=[X(u),yb,.2],r=.075;
    hdPart(B.bay,mb=>{cpRev(mb,A,Bb,[[0,0],[r*.5,0],[r*.92,.03],[r,.06],[r,.44],[r*.85,.47],[.03,.5],[.02,.5]],SMC('#1d4fb8',SM.PAINTED),32,40);},40);
    hdPart(B.bay,mb=>{hdCyl(mb,Bb,V3.add(Bb,[0,0,.03]),.018,.018,16,SMC('#c9a24a',SM.BRUSH));hdRBox(mb,V3.add(Bb,[0,0,.045]),[.014,.018,.015],.004,SMC('#c9a24a',SM.BRUSH),2);
      for(const dz of [-.22,.1]){const ring=[];for(let k=0;k<=24;k++){const a=k/24*TAU;ring.push([X(u)+Math.cos(a)*(r+.004),yb+Math.sin(a)*(r+.004),dz]);}hdTube(mb,ring,.005,6,SMC('#2a2b2e',SM.ENGINE),true,false);}
      hdTube(mb,suvPath([V3.add(Bb,[0,0,.06]),[X(u-.04),yb-.06,.32],[X(uR+.02),y+.04,.3]],3,1),.005,8,SMC('#7d7f83',SM.SATIN),false,true);},40);}
  /* (drawn all the time in Studio 2, lid shut or not: what of the Studio's trunk stands up into the lid, so low at the
     nose, kept just under it) */
  for(const mb of [B.bay,B.engine])if(mb&&mb.p){const p=mb.p;for(let i=0;i<p.length;i+=3){const u=D.uC-p[i];if(u<H.u0||u>H.u1)continue;const z=Math.min(Math.abs(p[i+2]),H.hz(u)),t=D.topY(u,z)-.012;if(p[i+1]>t)p[i+1]=t;}}
  return B;}
