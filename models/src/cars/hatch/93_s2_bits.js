/* =====================================================================================
   THE HATCH'S ROAD-CAR BITS (Studio 2), beyond what its Studio face and tail have (the rear plate in the bumper and
   its lamp are 83's):
   - The front plate on the bumper's bar, on its bracket, its four screws.
   - The badges: a small chrome lozenge on the grille's middle, the same on the tailgate.
   - The indicators' side repeaters: a small amber lens on each front fender behind the arch.
   - The fuel filler's flap on the right rear quarter: a round door a hair proud of the paint, its shut line.
   - The mast aerial at the right A pillar's foot, leaning back.
   - Rubber seals round the side glass.
   - (On the hood, so they lift with it: the washer jets at its back edge, htHoodBits.)
   o.noPlate, o.noBadges, o.noAerial, o.noRepeaters, o.noFlap: a build that doesn't wear them; o.rally: a Group B's (a
   red tow strap front and back, the master cut-off's pull at the windshield's foot).
   ===================================================================================== */
function htExtras2(out,car,o={}){
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=K.dy,Y=y=>y+dy,L=D.L;
  /* ---------- the front plate ---------- */
  if(!o.noPlate){const x=X(0)+.02+.06+.002,y=Y(.44),M=M4.basis([x,y,0],[0,0,-1],[0,1,0],[1,0,0]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,-.002],[.27,.06,.002],.004,HC.GB,1);},30,null,M);
    hdPart(out,mb=>{hdRBox(mb,[0,0,.0015],[.26,.055,.0015],.006,SMC('#e6e4dc',SM.PLASTIC),2);hdRBox(mb,[-.235,0,.0032],[.018,.05,.0004],.002,SMC('#1d3f9a',MAT.COL,.1),1);
      for(let k=0;k<6;k++)hdRBox(mb,[-.15+k*.06,0,.0034],[.018,.03,.0005],.002,SMC('#141414',MAT.COL),1);
      for(const [a,c] of [[-.22,.04],[.22,.04],[-.22,-.04],[.22,-.04]])cpHex(mb,[a,c,.003],[0,0,1],.005,.002);},30,null,M);}
  /* ---------- the badges ---------- */
  if(!o.noBadges){const f=cpOn('F',0,Y(.7),.012);cpBadge(out,f.p,f.n,.04,.016);const r=cpOn('R',0,Y(.86),.001);cpBadge(out,r.p,r.n,.035,.014);}
  /* ---------- the side repeaters ---------- */
  if(!o.noRepeaters)for(const s of [1,-1]){const u=D.uFa+D.arch.a+.1,y=D.belt(u)-.16,{p,n}=cpOn(s>0?'SR':'SL',u,y,.001),M=cpFrame(p,n),R=hdRRect(.022,.009,.007,4);
    hdPart(out,mb=>{hdExtrude(mb,R.map(([a,b])=>[a*1.15,b*1.3]),0,.002,HC.GB,0,1,false);},30,null,M);hdPart(out,mb=>{hdExtrude(mb,R,.002,.005,HC.AMBERL,.0015,2,false);},40,null,M);}
  /* ---------- the fuel flap ---------- */
  if(!o.noFlap){const u=D.uRa+D.archB.a+.11,y=(archY(D,D.uRa+D.archB.a-.02)+D.belt(u))/2+.01,{p,n}=cpOn('SR',u,y,.0006),M=cpFrame(p,n),C=[];for(let k=0;k<40;k++){const a=k/40*TAU;C.push([Math.cos(a)*.048,Math.sin(a)*.048]);}
    hdPart(out,mb=>{hdExtrude(mb,C,0,.0012,SV([1,1,1],MAT.PAINT),.0008,1,false);},40,null,M);
    hdPart(out,mb=>{const ring=C.map(([a,b])=>[a*1.04,b*1.04,-.0002]);ring.push(ring[0]);hdTube(mb,ring,.0012,5,HC.GB,false,false);},30,null,M);}
  /* ---------- the mast aerial ---------- */
  if(!o.noAerial){const u=G.cowl+.04,y=D.belt(u)-.003,z=K.sideZ(u,y-.01)-.012,c=[X(u),y,z];
    hdPart(out,mb=>{hdCyl(mb,V3.add(c,[0,-.004,0]),V3.add(c,[0,.012,0]),.014,.01,18,HC.GB);hdCyl(mb,V3.add(c,[0,.012,0]),V3.add(c,[0,.026,0]),.005,.004,12,MM.CHROME);},40);
    hdPart(out,mb=>{const d=V3.norm([-.35,1,.04]),t=V3.add(V3.add(c,[0,.026,0]),V3.mul(d,.85));hdCyl(mb,V3.add(c,[0,.026,0]),t,.0025,.0012,8,MM.CHROME);ball(mb,t,.0028,8,MM.CHROME);},40);}
  /* ---------- the seals round the side glass ---------- */
  for(const P0 of hdSideGlass())for(const s of [1,-1]){const P=hdResample(P0,.012);if(P.length<4)continue;const pts=P.map(([u,y])=>hdSS(s,u,y,.0045));pts.push(pts[0]);
    hdPart(out,mb=>{hdSweep(mb,pts,[[-.0045,-.002],[.0045,-.002],[.0035,.0012],[-.0035,.0012]],HC.SEAL,[0,0,s],true,false);},50);}
  /* ---------- a rally car's: the tow straps, the cut-off's pull ---------- */
  if(o.rally){const RED=SMC('#d02020',MAT.FABRIC);
    for(const [u,z,dir] of [[-.05,.42,1],[L+.05,-.4,-1]]){const x=X(u),y=Y(u<1?.3:.31),a=[x-dir*.01,y,z],b=[x+dir*.08,y-.04,z];
      hdPart(out,mb=>{const path=[a,V3.lerp(a,b,.5),b,[b[0]+dir*.012,b[1]-.02,z],[b[0]-dir*.005,b[1]-.035,z],V3.add(V3.lerp(a,b,.5),[0,-.03,0]),[a[0],a[1]-.025,z]];
        hdSweep(mb,suvPath(path,3,1),[[-.003,-.014],[.003,-.014],[.003,.014],[-.003,.014]],RED,[0,0,1],true,true);},40);}
    const u=G.cowl-.02,z=.6,y=K.topY(u,z),p=[X(u),y+.002,z];
    hdPart(out,mb=>{hdCyl(mb,p,V3.add(p,[0,.01,0]),.015,.015,18,HC.GB);hdCyl(mb,V3.add(p,[0,.01,0]),V3.add(p,[0,.028,0]),.004,.004,8,MM.CHROME);
      const ring=[];for(let k=0;k<=20;k++){const a=k/20*TAU;ring.push(V3.add(p,[Math.cos(a)*.013,.038+Math.sin(a)*.011,0]));}hdTube(mb,ring,.0032,8,SMC('#c41e1a',SM.PLASTIC),true,false);},40);}
}
/* the washer jets on the hood's back edge (built on the hood, so they lift with it) */
function htHoodBits(out,car){const K=HDK,D=K.D,X=K.X;
  for(const s of [1,-1]){const u=D.hood.u1-.06,z=s*.28,y=K.topY(u,Math.abs(z)),c=[X(u),y,z];
    hdPart(out,mb=>{hdRBox(mb,V3.add(c,[0,.003,0]),[.011,.005,.008],.003,HC.GB,3);hdCyl(mb,V3.add(c,[.005,.005,0]),V3.add(c,[.011,.007,0]),.0022,.0018,10,HC.GB);},40);}}
