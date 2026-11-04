/* =====================================================================================
   THE COUPE GT'S STUDIO 2 CABIN AND ITS OWN BITS:
   - The cabin: the Coupe's Studio 2 cabin (cars/coupe 85 cpCabin v2: the taller tunnel, the console on it, the buckets)
     with the cage the Studio's has (85 cgCage), and what a GT racer carries: a harness bar across the main hoop and a
     red four-point harness on each bucket, the master cut-off's red knob on the dash's middle, the extinguisher on the
     floor between the seats, a net in the driver's window.
   - Outside: the cut-off's pull at the windscreen's foot, a red tow strap front and back.
   ===================================================================================== */
function cg2Cabin(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=D.dy,pil=G.pillars.map(p=>p[0]),uh=pil[0]+.02,yF=.22+dy;
  cpCabin(out,car,1);cgCage(out,car,{uh,inset:.075,r:.019});
  const WEB=SMC('#c41e1a',SM.CLOTH),ALU=SMC('#b9bcc1',SM.BRUSH),BLK=SV([.012,.012,.013],SM.DASH),CAGE=SMC('#2c2d30',SM.SATIN),cy=(u,z)=>cpFloorY(u,z)+dy+.035;
  /* ---------- the harness bar, the harnesses ---------- */
  const hb=yF+.6,zb=K.sideZ(uh,hb)-.085;hdPart(out,mb=>{hdTube(mb,[[X(uh),hb,-zb],[X(uh),hb,zb]],.017,14,CAGE,false,true);},40);
  const W=(pts,w=.022)=>hdPart(out,mb=>{hdSweep(mb,suvPath(pts,4,2),[[-w,-.0015],[w,-.0015],[w,.0015],[-w,.0015]],WEB,[0,0,1],true,true);},40);
  for(const s of [1,-1]){const c=[X(pil[0]-.36),yF+.18,s*.4],M=M4T(c[0],c[1],c[2]),Mb=M4.mul(M,M4RZ(.3)),at=p=>M4.xform(Mb,p),bk=M4.xform(M,[.2,.13,0]);
    for(const e of [-1,1]){W([[X(uh)+.02,hb+.017,c[2]+e*.07],at([-.11,.68,e*.06]),at([.02,.62,e*.06]),at([.03,.36,e*.055]),at([.04,.14,e*.045]),V3.add(bk,[-.03,0,e*.02])]);
      hdPart(out,mb=>{hdRBox(mb,at([.035,.42,e*.055]),[.004,.022,.028],.003,ALU,2);},30);
      const fl=[c[0]-.02,cy(pil[0]-.34,c[2]+e*.24)+.004,c[2]+e*.24];W([fl,M4.xform(M,[.0,.12,e*.2]),M4.xform(M,[.1,.13,e*.12]),V3.add(bk,[0,0,e*.03])]);
      hdPart(out,mb=>{hdRBox(mb,V3.add(fl,[0,.01,0]),[.02,.01,.018],.004,ALU,2);cpHex(mb,V3.add(fl,[0,.02,0]),[0,1,0],.007,.005);},30);}
    hdPart(out,mb=>{hdCyl(mb,V3.add(bk,[0,-.004,0]),V3.add(bk,[0,.012,0]),.04,.038,28,ALU);hdCyl(mb,V3.add(bk,[0,.012,0]),V3.add(bk,[0,.019,0]),.028,.025,24,SMC('#1a1a1c',SM.PLASTIC));},40);}
  /* ---------- the master cut-off on the dash's middle ---------- */
  {const u=G.cowl+.44,x=X(u),y=D.belt(u)-.17;hdPart(out,mb=>{const p=[x,y,.03];hdRBox(mb,p,[.004,.025,.025],.004,SMC('#d6b21a',SM.PLASTIC),2);hdCyl(mb,V3.add(p,[-.004,0,0]),V3.add(p,[-.024,0,0]),.016,.014,18,SMC('#c41e1a',SM.PLASTIC));
      hdRBox(mb,V3.add(p,[-.03,0,0]),[.006,.004,.016],.003,SMC('#c41e1a',SM.PLASTIC),1);},35);}
  /* ---------- the extinguisher on the passenger's side of the tunnel ---------- */
  {const z=.2,u0=pil[0]-.3,u1=pil[0]-.6,rr=.048,y=Math.max(cy(u0,z),cy(u1,z))+rr+.012,A=[X(u0),y,z],B=[X(u1),y,z];
    hdPart(out,mb=>{cpRev(mb,A,B,[[0,0],[rr*.6,0],[rr,.03],[rr,.26],[rr*.7,.29],[.016,.3]],SMC('#c41e1a',SM.PAINTED),28,40);},40);
    hdPart(out,mb=>{hdCyl(mb,B,V3.add(B,[.03,0,0]),.016,.014,14,MM.CHROME);hdRBox(mb,V3.add(B,[.045,.02,0]),[.018,.007,.011],.004,BLK,2);
      for(const u of [u0-.07,u1+.08]){const ring=[];for(let k=0;k<=24;k++){const a=k/24*TAU;ring.push([X(u),y+Math.sin(a)*(rr+.004),z+Math.cos(a)*(rr+.004)]);}hdTube(mb,ring,.005,6,ALU,true,false);}},40);}
  /* ---------- the net in the driver's window ---------- */
  {const u0=G.cowl+.45,u1=pil[0]-.12,y0=D.belt(u0)+.03,y1=D.belt(u0)+.28,p=(u,y)=>[X(u),y,-(K.sideZ(u,Math.min(y,D.belt(u)+.2))-.11)];
    hdPart(out,mb=>{for(let k=0;k<=8;k++){const u=u0+(u1-u0)*k/8,pts=[];for(let j=0;j<=5;j++)pts.push(p(u,y0+(y1-y0)*j/5));hdTube(mb,pts,.0035,6,BLK,false,false);}
      for(let j=0;j<=5;j++){const y=y0+(y1-y0)*j/5,pts=[];for(let k=0;k<=8;k++)pts.push(p(u0+(u1-u0)*k/8,y));hdTube(mb,pts,.0035,6,BLK,false,false);}},30);}
}
function cg2Bits(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=K.dy,L=D.L,RED=SMC('#d02020',MAT.FABRIC);
  /* the tow straps, on their loops under the splitter's middle and the diffuser's */
  for(const [u,z,dir,y] of [[-.04,.32,1,.3+dy],[L+.02,-.3,-1,.36+dy]]){const x=X(u),a=[x-dir*.01,y,z],b=[x+dir*.08,y-.04,z];
    hdPart(out,mb=>{const path=[a,V3.lerp(a,b,.5),b,[b[0]+dir*.012,b[1]-.02,z],[b[0]-dir*.005,b[1]-.035,z],V3.add(V3.lerp(a,b,.5),[0,-.03,0]),[a[0],a[1]-.025,z]];
      hdSweep(mb,suvPath(path,3,1),[[-.003,-.014],[.003,-.014],[.003,.014],[-.003,.014]],RED,[0,0,1],true,true);},40);}
  /* the cut-off's pull at the windscreen's foot, its spark sticker */
  {const u=G.cowl-.02,z=.62,y=K.topY(u,z),p=[X(u),y+.002,z];
    hdPart(out,mb=>{hdCyl(mb,p,V3.add(p,[0,.01,0]),.015,.015,18,HC.GB);hdCyl(mb,V3.add(p,[0,.01,0]),V3.add(p,[0,.028,0]),.004,.004,8,MM.CHROME);
      const ring=[];for(let k=0;k<=20;k++){const a=k/20*TAU;ring.push(V3.add(p,[Math.cos(a)*.013,.038+Math.sin(a)*.011,0]));}hdTube(mb,ring,.0032,8,SMC('#c41e1a',SM.PLASTIC),true,false);},40);
    hdPart(out,mb=>{hdExtrude(mb,[[-.02,-.016],[.02,-.016],[0,.02]],0,.0008,SMC('#1b5fd0',MAT.COL,.2),0,1,false);hdExtrude(mb,[[-.004,-.011],[.005,.0],[.0,.0],[.005,.012],[-.005,.001],[0,.001]],.0008,.0012,SMC('#e8e6df',MAT.COL,.3),0,1,false);},
      30,null,M4.basis([X(u+.005),K.topY(u+.005,z-.06)+.0015,z-.06],[0,0,1],[-1,0,0],[0,1,0]));}
  /* rubber seals round the side glass */
  for(const P0 of hdSideGlass())for(const s of [1,-1]){const P=hdResample(P0,.012);if(P.length<4)continue;const pts=P.map(([u,y])=>hdSS(s,u,y,.0045));pts.push(pts[0]);
    hdPart(out,mb=>{hdSweep(mb,pts,[[-.0045,-.002],[.0045,-.002],[.0035,.0012],[-.0035,.0012]],HC.SEAL,[0,0,s],true,false);},50);}
}
