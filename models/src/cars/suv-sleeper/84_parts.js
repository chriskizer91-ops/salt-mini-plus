/* =====================================================================================
   THE SLEEPER'S BOLT-ONS, where the game puts them:
   - The hood scoop (HOODS.scoop): a raised shell at the front of the hood, rising from nothing at the back to an
     open mouth at the front, the mouth a dark pocket behind a fine mesh, its lip rolled. Built on the hood, so it lifts
     with it.
   - The roof spoiler (the game's 'roof', 23_parts spoiler): an aerofoil carrying the roofline back over the rear
     glass and tipping down, two fins down its sides, a third brake lamp under its trailing edge.
   - The pinstripe (EXTRAS.pinstripe): a copper line along the skirts, a hair proud of the paint.
   ===================================================================================== */
function slScoop(out,car){
  const K=HDK,D=K.D,X=K.X,topY=D.topY,u0=.5,u1=1.15,w=.24,n=28,m=16,PA=SV([1,1,1],MAT.PAINT);
  /* (its height over the hood at u, across at f (-1 to 1)) */
  const hgt=(u,f)=>{const t=(u-u0)/(u1-u0);return .065*(1-t)*Math.min(1,t*12+.4)*Math.pow(Math.max(0,Math.cos(f*PI/2)),.45);};
  const zz=(u,f)=>f*w*(1-.12*(u-u0)/(u1-u0));
  const rows=[];for(let i=0;i<=n;i++){const u=u0+(u1-u0)*Math.pow(i/n,1.2),row=[];for(let k=0;k<=m;k++){const f=-1+2*k/m,z=zz(u,f);row.push([X(u),topY(u,Math.abs(z))+hgt(u,f)+.0015,z]);}rows.push(row);}
  /* the shell: its skin, and down its sides to the hood */
  hdPart(out,mb=>{const R=rows[0].map((_,k)=>rows.map(r=>r[k]));hdLoft(mb,R,PA,false,true);
    for(const k of [0,m]){const e=rows.map(r=>r[k]),f=e.map(p=>[p[0],topY(D.uC-p[0],Math.abs(p[2]))-.004,p[2]]);hdLoft(mb,[e,f],PA,false,k===0);}},40);
  /* the mouth: a dark pocket back from its opening, the mesh across it, the rolled lip round its edge */
  const mouth=rows[0],base=mouth.map(p=>[p[0],topY(u0,Math.abs(p[2]))+.002,p[2]]);
  hdPart(out,mb=>{const back=mouth.map((p,k)=>[p[0]-.06,(p[1]+base[k][1])/2-.004,p[2]*.94]);hdLoft(mb,[mouth,back],HC.GB,false,true);hdLoft(mb,[back,base.map(p=>[p[0]-.06,p[1],p[2]*.94])],HC.GB,false,true);},30);
  hdPart(out,mb=>{for(let k=0;k<m;k++){const a=mouth[k],b=mouth[k+1],c=base[k+1],d=base[k];const sh=v=>[v[0]-.012,v[1],v[2]];
      /* (the mesh: strands across and up, a few millimetres in from the lip) */
      for(let j=1;j<6;j++){const t=j/6,p=V3.lerp(sh(a),sh(d),t),q=V3.lerp(sh(b),sh(c),t);hdCyl(mb,p,q,.0011,.0011,4,HC.HONEY,false);}
      hdCyl(mb,sh(a),sh(d),.0011,.0011,4,HC.HONEY,false);}},20);
  hdPart(out,mb=>{const lip=mouth.map(p=>[p[0]-.002,p[1]-.002,p[2]]);hdTube(mb,lip,.004,8,PA,false,true);},45);
}
function slSpoiler(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,topY=D.topY,u0=G.rr-.08,len=.26,w=D.B.lipW||.68,PA=SV([1,1,1],MAT.PAINT),n=14;
  const y0=topY(u0,0)+.004,top=t=>y0+.01*Math.sin(t*PI)-.05*t*t,thk=t=>.025*(1-t)+.008;
  /* the aerofoil: a section (top from the roof's edge back, the underside under it) lofted across, its ends closed */
  const sec=[];for(let i=0;i<=n;i++){const t=i/n;sec.push([u0+len*t,top(t)]);}
  for(let i=n;i>=0;i--){const t=i/n;sec.push([u0+len*t,top(t)-thk(t)*(t<.04?t/.04:1)]);}
  const ring=z=>sec.map(([u,y])=>[X(u),y,z]),zs=[];for(let k=0;k<=24;k++)zs.push(-w+2*w*k/24);
  hdPart(out,mb=>{const R=zs.map(ring);hdLoft(mb,R,PA,true,true);hdCap(mb,R[0],PA,false);hdCap(mb,R[R.length-1],PA,true);},35);
  /* the fins down its sides */
  for(const s of [1,-1]){const z=s*(w-.006),P=[[X(u0+.02),topY(u0,.6)],[X(u0+len),top(1)],[X(u0+len-.02),top(1)-.12],[X(u0+.04),topY(u0+.04,.6)-.05]];
    hdPart(out,mb=>{hdExtrude(mb,P,z-.006,z+.006,PA,.003,2,true);},40);}
  /* the third brake lamp under the trailing edge */
  {const x=X(u0+len-.02),y=top(1)-thk(1)-.006;hdPart(out,mb=>{hdRBox(mb,[x,y,0],[.012,.007,.2],.005,HC.GB,2);hdRBox(mb,[x-.006,y-.002,0],[.006,.005,.19],.004,HC.REDL,2);},40);
    hdPart(out,mb=>{for(let z=-.18;z<=.1801;z+=.03)ball(mb,[x-.002,y-.002,z],.0028,8,SV([1,1,1],MAT.TAIL));},40);}
}
function slPinstripe(out,car){
  const K=HDK,D=K.D,X=K.X,u0=D.uFa+D.arch.a+.08,u1=D.uRa-D.arch.a-.08,y=D.sill(2)+.025,CU=SMC('#b0703c',SM.PAINTED);
  for(const s of [1,-1]){const path=[];for(let i=0;i<=40;i++){const u=u0+(u1-u0)*i/40;path.push(hdSS(s,u,y,.0006));}
    hdPart(out,mb=>{hdSweep(mb,path,hdRRect(.0012,.006,.0008,2),CU,[0,1,0],true,true);},40);}
}
