/* =====================================================================================
   THE HATCH GROUP B'S CABIN (Studio 2): the Hatch's finished Studio 2 cabin in its rally trim (cars/hatch 94
   htCabin2 with o.rally: the floor and the roof's inside painted, no rear seats or parcel shelf, the buckets low), the
   cage the Studio's has (cars/coupe-gt 85 cgCage), and what a Group B car carries:
   - a harness bar across the main hoop and a four-point harness in red on each bucket: the shoulder straps from the
     bar over the seat's back, the lap straps from the floor, the round buckle;
   - the co-driver's trip meter on the dash's right, its two counters, the map lamp on its gooseneck, the intercom's
     box under the dash;
   - the master cut-off's red knob on the dash's middle, the extinguisher on the floor between the seats;
   - the spare wheel strapped flat in the back, on the boot's floor.
   ===================================================================================== */
function hbCabin2(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=D.dy,pil=G.pillars.map(p=>p[0]),C=htCabin2(out,car,{rally:1}),{yF,cy}=C,uh=pil[0]+.08;
  cgCage(out,car,{uh,inset:.07,r:.02,floorY:.3+dy});
  const WEB=SMC('#c41e1a',SM.CLOTH),ALU=SMC('#b9bcc1',SM.BRUSH),BLK=C.BLK,CAGE=SMC('#2c2d30',SM.SATIN);
  /* ---------- the harness bar, the harnesses ---------- */
  const hb=yF+.66,zb=K.sideZ(uh,hb)-.07;hdPart(out,mb=>{hdTube(mb,[[X(uh),hb,-zb],[X(uh),hb,zb]],.018,14,CAGE,false,true);},40);
  const W=(pts,w=.022)=>hdPart(out,mb=>{hdSweep(mb,suvPath(pts,4,2),[[-w,-.0015],[w,-.0015],[w,.0015],[-w,.0015]],WEB,[0,0,1],true,true);},40);
  for(const s of [1,-1]){const c=[X(pil[0]-.3),yF+.12,s*.36],M=M4T(c[0],c[1],c[2]),Mb=M4.mul(M,M4RZ(.3)),at=p=>M4.xform(Mb,p),bk=M4.xform(M,[.2,.13,0]);
    for(const e of [-1,1]){W([[X(uh)+.02,hb+.018,c[2]+e*.07],at([-.11,.68,e*.06]),at([.02,.62,e*.06]),at([.03,.36,e*.055]),at([.04,.14,e*.045]),V3.add(bk,[-.03,0,e*.02])]);
      hdPart(out,mb=>{hdRBox(mb,at([.035,.42,e*.055]),[.004,.022,.028],.003,ALU,2);},30);
      const fl=[c[0]-.02,cy(pil[0]-.28,c[2]+e*.24)+.004,c[2]+e*.24];W([fl,M4.xform(M,[.0,.12,e*.2]),M4.xform(M,[.1,.13,e*.12]),V3.add(bk,[0,0,e*.03])]);
      hdPart(out,mb=>{hdRBox(mb,V3.add(fl,[0,.01,0]),[.02,.01,.018],.004,ALU,2);cpHex(mb,V3.add(fl,[0,.02,0]),[0,1,0],.007,.005);},30);}
    hdPart(out,mb=>{hdCyl(mb,V3.add(bk,[0,-.004,0]),V3.add(bk,[0,.012,0]),.04,.038,28,ALU);hdCyl(mb,V3.add(bk,[0,.012,0]),V3.add(bk,[0,.019,0]),.028,.025,24,SMC('#1a1a1c',SM.PLASTIC));},40);}
  /* ---------- the co-driver's trip meter, the map lamp, the intercom ---------- */
  {const u=G.cowl+.44,y=D.belt(u)-.02,z=.38,c=[X(u),y,z];
    hdPart(out,mb=>{hdRBox(mb,V3.add(c,[0,.035,0]),[.03,.035,.075],.008,BLK,3);for(const dz of [-.035,.035]){hdRBox(mb,V3.add(c,[-.031,.045,dz]),[.002,.014,.03],.002,SMC('#0d0d0e',SM.PLASTIC),1);
        for(let k=0;k<5;k++)hdRBox(mb,V3.add(c,[-.0325,.045,dz-.022+k*.011]),[.0006,.009,.004],.0004,SMC('#e8e6df',MAT.COL,.2),1);}
      for(const dz of [-.05,-.02,.02,.05])hdCyl(mb,V3.add(c,[-.031,.015,dz]),V3.add(c,[-.04,.015,dz]),.005,.005,10,ALU);},35);
    hdPart(out,mb=>{const a=V3.add(c,[.0,.07,.08]),pts=[a,V3.add(a,[-.02,.08,.02]),V3.add(a,[-.07,.12,-.02]),V3.add(a,[-.11,.1,-.04])];hdTube(mb,suvPath(pts,4,2),.004,8,BLK,false,true);
      const h=pts[3];hdCyl(mb,h,V3.add(h,[-.02,-.025,-.004]),.014,.018,14,BLK);hdCyl(mb,V3.add(h,[-.02,-.025,-.004]),V3.add(h,[-.021,-.027,-.004]),.017,.017,14,SMC('#fff3c0',MAT.COL,.6));},35);
    hdPart(out,mb=>{const b=[X(G.cowl+.3),yF+.28,.25];hdRBox(mb,b,[.05,.025,.06],.006,BLK,2);for(const dz of [-.03,.03])hdCyl(mb,V3.add(b,[-.05,0,dz]),V3.add(b,[-.06,0,dz]),.008,.008,12,ALU);},30);}
  /* ---------- the master cut-off on the dash's middle, the extinguisher between the seats ---------- */
  {const u=G.cowl+.46,x=X(u),y=D.belt(u)-.17;hdPart(out,mb=>{const p=[x,y,.03];hdRBox(mb,p,[.004,.025,.025],.004,SMC('#d6b21a',SM.PLASTIC),2);hdCyl(mb,V3.add(p,[-.004,0,0]),V3.add(p,[-.024,0,0]),.016,.014,18,SMC('#c41e1a',SM.PLASTIC));
      hdRBox(mb,V3.add(p,[-.03,0,0]),[.006,.004,.016],.003,SMC('#c41e1a',SM.PLASTIC),1);},35);}
  {const z=0,u0=pil[0]-.05,u1=pil[0]-.35,rr=.05,y=cy((u0+u1)/2,z)+rr+.012,A=[X(u0),y,z],B=[X(u1),y,z];
    hdPart(out,mb=>{cpRev(mb,A,B,[[0,0],[rr*.6,0],[rr,.03],[rr,.26],[rr*.7,.29],[.016,.3]],SMC('#c41e1a',SM.PAINTED),28,40);},40);
    hdPart(out,mb=>{hdCyl(mb,B,V3.add(B,[.03,0,0]),.016,.014,14,MM.CHROME);hdRBox(mb,V3.add(B,[.045,.02,0]),[.018,.007,.011],.004,BLK,2);
      for(const u of [u0-.07,u1+.08]){const ring=[];for(let k=0;k<=24;k++){const a=k/24*TAU;ring.push([X(u),y+Math.sin(a)*(rr+.004),z+Math.cos(a)*(rr+.004)]);}hdTube(mb,ring,.005,6,ALU,true,false);}},40);}
  /* ---------- the spare wheel strapped flat on the boot's floor ---------- */
  {const u=(G.rr+G.be)/2-.02,yB=cy(u,0),sw={R:.29,W:.19,rim:15},sp=new MB();hdTyre(sp,sw,{kind:'at'});const rr2=hdRimParts(sp,sw,{face:.03,lugs:4,barrel:SMC('#ece9e2',SM.PAINTED),lip:SMC('#ece9e2',SM.PAINTED)});
    hdPart(sp,mb=>{hdRev(mb,[[0,.026],[.06,.026],[.075,.03]],48,SMC('#ece9e2',SM.PAINTED),0,TAU,true);},30);
    xformMB(sp,M4.mul(M4T(X(u),yB+sw.W/2+.004,0),M4RX(-PI/2)));hdPut(out,sp);
    hdPart(out,mb=>{for(const dz of [-.12,.12]){const pts=[[X(u+.3),yB+.004,dz],[X(u+.28),yB+sw.W+.01,dz],[X(u-.28),yB+sw.W+.01,dz],[X(u-.3),yB+.004,dz]];hdSweep(mb,pts,[[-.0015,-.02],[.0015,-.02],[.0015,.02],[-.0015,.02]],SMC('#1a1a1c',SM.CLOTH),[0,0,1],true,true);
      hdRBox(mb,[X(u),yB+sw.W+.012,dz],[.025,.006,.024],.003,ALU,1);}},30);}
}
