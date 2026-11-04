/* =====================================================================================
   THE WEDGE'S ROAD-CAR BITS (Studio 2), beyond the Studio's (the rear plate in its recess is 83's, the pop-ups 82's):
   - The front plate low on the nose under the lid's tip, on its bracket.
   - The badges: a small chrome lozenge on the lid's tip and on the tail's panel.
   - The side markers: amber on the nose's corners, red at the tail's.
   - The mast aerial at the right A pillar's foot.
   - Rubber seals round the side glass.
   - (On the front lid, so they lift with it: the washer jets at its back edge, wdLidBits.)
   ===================================================================================== */
function wdExtras2(out,car,o={}){
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=K.dy,Y=y=>y+dy,L=D.L;
  /* ---------- the front plate ---------- */
  if(!o.noPlate){const {p,n}=cpOn('F',0,Y(.33),.004),M=cpFrame(p,n);
    hdPart(out,mb=>{hdRBox(mb,[0,0,-.002],[.27,.06,.002],.004,HC.GB,1);},30,null,M);
    hdPart(out,mb=>{hdRBox(mb,[0,0,.0015],[.26,.055,.0015],.006,SMC('#e6e4dc',SM.PLASTIC),2);hdRBox(mb,[-.235,0,.0032],[.018,.05,.0004],.002,SMC('#1d3f9a',MAT.COL,.1),1);
      for(let k=0;k<6;k++)hdRBox(mb,[-.15+k*.06,0,.0034],[.018,.03,.0005],.002,SMC('#141414',MAT.COL),1);
      for(const [a,c] of [[-.22,.04],[.22,.04],[-.22,-.04],[.22,-.04]])cpHex(mb,[a,c,.003],[0,0,1],.005,.002);},30,null,M);}
  /* ---------- the badges ---------- */
  if(!o.noBadges){const f=cpOn('F',0,Y(.45),.001);cpBadge(out,f.p,f.n,.035,.014);const r=cpOn('R',0,Y(.86),.001);cpBadge(out,r.p,r.n,.035,.014);}
  /* ---------- the side markers ---------- */
  for(const s of [1,-1])for(const [u,y,m] of [[.2,Y(.33),HC.AMBERL],[L-.18,Y(.42),HC.REDL]]){const {p,n}=cpOn(s>0?'SR':'SL',u,y,.001),M=cpFrame(p,n),Rr=hdRRect(.035,.01,.008,4);
    hdPart(out,mb=>{hdExtrude(mb,Rr.map(([a,b])=>[a*1.1,b*1.3]),0,.002,HC.GB,0,1,false);},30,null,M);hdPart(out,mb=>{hdExtrude(mb,Rr,.002,.005,m,.0015,2,false);},40,null,M);}
  /* ---------- the mast aerial ---------- */
  if(!o.noAerial){const u=G.cowl+.03,y=D.belt(u)-.003,z=K.sideZ(u,y-.01)-.012,c=[X(u),y,z];
    hdPart(out,mb=>{hdCyl(mb,V3.add(c,[0,-.004,0]),V3.add(c,[0,.012,0]),.013,.009,18,HC.GB);hdCyl(mb,V3.add(c,[0,.012,0]),V3.add(c,[0,.024,0]),.005,.004,12,MM.CHROME);},40);
    hdPart(out,mb=>{const d=V3.norm([-.4,1,.03]),t=V3.add(V3.add(c,[0,.024,0]),V3.mul(d,.7));hdCyl(mb,V3.add(c,[0,.024,0]),t,.0024,.0012,8,MM.CHROME);ball(mb,t,.0026,8,MM.CHROME);},40);}
  /* ---------- the seals round the side glass ---------- */
  for(const P0 of hdSideGlass())for(const s of [1,-1]){const P=hdResample(P0,.012);if(P.length<4)continue;const pts=P.map(([u,y])=>hdSS(s,u,y,.0045));pts.push(pts[0]);
    hdPart(out,mb=>{hdSweep(mb,pts,[[-.0045,-.002],[.0045,-.002],[.0035,.0012],[-.0035,.0012]],HC.SEAL,[0,0,s],true,false);},50);}
}
/* the washer jets on the front lid's back edge (built on the lid, so they lift with it) */
function wdLidBits(out,car){const K=HDK,D=K.D,X=K.X;
  for(const s of [1,-1]){const u=D.hood.u1-.06,z=s*.3,y=K.topY(u,Math.abs(z)),c=[X(u),y,z];
    hdPart(out,mb=>{hdRBox(mb,V3.add(c,[0,.003,0]),[.011,.004,.008],.003,HC.GB,3);hdCyl(mb,V3.add(c,[.005,.004,0]),V3.add(c,[.011,.006,0]),.0022,.0018,10,HC.GB);},40);}}
