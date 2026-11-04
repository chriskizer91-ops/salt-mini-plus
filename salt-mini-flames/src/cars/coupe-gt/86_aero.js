/* =====================================================================================
   THE COUPE GT'S RACE PARTS, IN THREE DIMENSIONS, on the game's own sizes and places (23_parts deckWing, EXTRAS.skirts
   and raceKit, flares' bolts):
   - The GT wing: a cambered carbon blade on two swan necks off the deck lid, a Gurney flap along its trailing edge,
     big rounded endplates, the necks bolted to the deck on feet.
   - The skirts: a carbon blade along each sill between the wheels, flat on top, a lip along its foot, ending ahead
     of the side pipes on the right.
   - The roof scoop: a low wedge on the front of the roof, open to the front, its mouth dark.
   - The sun strip: a dark band of film across the top of the windscreen.
   - The fuel filler: a chrome quick-fill cap on the right rear quarter.
   - The door roundels: a white disc on each door, a black ring round it, blank (the build has no number).
   - The flare bolts: a button-head bolt on a washer every few centimetres round each flare, where the game has them.
   ===================================================================================== */
function cgFlareBolts(out,car){
  const K=HDK,D=K.D,X=K.X,F=D.look.flares;if(!F||!F.bolts)return;const a0=F.a0||-.01,a1=F.a1||1.01,n=28,w=F.w,o=F.out,C=[];
  for(const ua of [D.uFa,D.uRa])for(const s of [1,-1])for(let k=2;k<n-1;k+=3){const t=k/n,ph=a0+(a1-a0)*t,[u,y]=archPt(D,ua,ph*PI,w*.45);
    C.push([X(u),y,s*(K.sideZ(u,y)+o*.95)]);
    /* the Studio's flare surface there (73_arch hdFlares, its 96 steps): the side's z plus the section's bulge */
    const end=sm01(Math.min(t,1-t)/.1),e=archPt(D,ua,ph*PI,.006),zs=K.sideZ(e[0],Math.min(e[1],D.belt(e[0])-.02)),yy=Math.min(y,D.belt(u)-.02),
      zb=Math.max(zs,K.sideZ(u,yy)),zf=zb+o*.914*(.35+.65*end),p=[X(u),yy,s*zf];
    hdPart(out,mb=>{cgBolt(mb,p,[0,0,s],.0075,HC.BOLT);hdCyl(mb,V3.add(p,[0,0,-s*.001]),V3.add(p,[0,0,s*.0012]),.012,.012,16,HC.SATIN,false);},40);}
  /* the game's round chrome bolt heads, taken off */
  hdDrop(car.body,(c,m)=>m===MAT.CHROME&&C.some(q=>Math.hypot(c[0]-q[0],c[1]-q[1],c[2]-q[2])<.016));
}
function cgWing(out,car){
  const K=HDK,D=K.D,X=K.X,L=D.L,CF=SV([1,1,1],MAT.CARBON),hw=.86,c=.34,th=.032,aoa=.2,yd=K.topY(L-.28,.42),yw=yd+.29,x=X(L-.44);
  /* the game's wing, off the deck */
  hdDrop(car.body,(cc,m)=>m===MAT.CARBON&&D.uC-cc[0]>L-.62&&cc[1]>yd-.06);
  /* ---------- the blade ---------- */
  const P=cgWingBlade(out,x,yw,hw,c,th,aoa,CF);
  /* the Gurney flap: a thin strip standing up off the trailing edge */
  {const te=P([1,0],0);hdPart(out,mb=>{hdRBox(mb,[te[0]+.0015,te[1]+.009,0],[.0015,.013,hw-.002],.001,CF,1);},30);}
  /* ---------- the endplates ---------- */
  for(const s of [1,-1])cgPlate(out,[[x+.05,yw-.09],[x-c-.06,yw-.09],[x-c-.03,yw+.13],[x+.03,yw+.1]],s*(hw+.006),.01,CF,.025);
  /* ---------- the swan necks: up behind the blade from the deck, over its top, down onto it ---------- */
  for(const s of [1,-1]){const U=(u,y)=>[X(u),y];
    cgPlate(out,[U(L-.13,yd-.03),U(L-.03,yd-.05),U(L-.035,yw+.1),U(L-.055,yw+.145),U(L-.1,yw+.158),U(L-.34,yw+.085),U(L-.33,yw+.03),U(L-.29,yw+.03),U(L-.11,yw+.1),U(L-.105,yw+.05)],s*.42,.012,CF,.02);
    /* its foot on the deck, two bolts through it */
    {const uf=L-.08,p=[X(uf),K.topY(uf,.42),s*.42];hdPart(out,mb=>{hdRBox(mb,[p[0],p[1]+.003,p[2]],[.07,.005,.028],.004,CF,2);},30);
      for(const du of [-.045,.045])hdPart(out,mb=>{cgBolt(mb,[X(uf+du),K.topY(uf+du,.42)+.008,s*.42],[0,1,0],.006,HC.BOLT);},40);}
    /* the bolts through the neck into the blade's top */
    for(const du of [-.31,-.33])hdPart(out,mb=>{cgBolt(mb,[X(L+du)+.0,yw+.06,s*(.42+.0065)],[0,0,s],.005,HC.BOLT);},40);
  }
}
function cgSkirts(out,car){
  const K=HDK,D=K.D,X=K.X,F=D.B.fit,Y=y=>y+K.dy+D.B.chY,CF=SV([1,1,1],MAT.CARBON),yc=Y(.34),zo=F.sideZ?F.sideZ-.04:.95;
  const u0=D.uFa+D.arch.a+.1,u1=D.uRa-D.arch.a-.1,uEx=D.uRa-D.arch.a-.18-.09-.07;
  /* the section: (z out from the skirt's middle, y), inner top to the lip at the foot */
  const sec=[[-.035,.035],[.025,.035],[.034,.03],[.036,.02],[.035,-.025],[.046,-.032],[.047,-.037],[-.035,-.037]];
  for(const s of [1,-1]){const ue=s>0&&D.look.exhaust&&[].concat(D.look.exhaust).includes('side')?Math.min(u1,uEx):u1,n=24,rings=[];
    for(let i=0;i<=n;i++){const u=u0+(ue-u0)*i/n,t=Math.min(i,n-i)/n,k=Math.min(1,t*14+.25);
      rings.push(sec.map(([dz,dy])=>[X(u),yc+dy*(.6+.4*k),s*(zo+dz*k-(1-k)*.02)]));}
    hdPart(out,mb=>{hdLoft(mb,rings,CF,true,s<0);hdCap(mb,rings[0],CF,s>0);hdCap(mb,rings[n],CF,s<0);},35);}
}
function cgRaceKit(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,PA=SV([1,1,1],MAT.PAINT);
  /* ---------- the roof scoop ---------- */
  cgRoofScoop(out,G.rf+.12,G.rf+.57,.2,.07);
  /* ---------- the sun strip across the top of the windscreen ---------- */
  {const ua=G.rf-.2,ub=G.rf-.02,zw=.66,FILM=SMC('#0d0d0f',SM.VINYL),nu=8,nz=24,g=[];
    for(let i=0;i<=nu;i++){const u=ua+(ub-ua)*i/nu,row=[];for(let j=0;j<=nz;j++){const z=-zw+2*zw*j/nz;row.push(hdTS(u,z,.0022));}g.push(row);}
    hdPart(out,mb=>{for(let i=0;i<nu;i++)for(let j=0;j<nz;j++)mb.quad(g[i][j],g[i][j+1],g[i+1][j+1],g[i+1][j],FILM[0],FILM[1],FILM[2]);
      const rim=[];for(let j=0;j<=nz;j++)rim.push(g[0][j]);for(let i=1;i<=nu;i++)rim.push(g[i][nz]);for(let j=nz-1;j>=0;j--)rim.push(g[nu][j]);for(let i=nu-1;i>0;i--)rim.push(g[i][0]);
      for(let k=0;k<rim.length;k++){const a=rim[k],b=rim[(k+1)%rim.length];mb.quad(a,b,[b[0],b[1]-.0018,b[2]],[a[0],a[1]-.0018,a[2]],FILM[0],FILM[1],FILM[2]);}},20);}
  /* ---------- the fuel filler on the right rear quarter ---------- */
  {const fl=D.B.fit.filler||[D.L-.52,secKeys(D,D.L-.52).yG+.22],p=hdSS(1,fl[0],fl[1],0),pu=hdSS(1,fl[0]-.01,fl[1],0),py=hdSS(1,fl[0],fl[1]+.01,0);
    let n=V3.norm(V3.cross(V3.sub(pu,p),V3.sub(py,p)));if(n[2]<0)n=V3.mul(n,-1);const a=V3.norm(V3.sub(pu,p)),b=V3.cross(n,a),M=M4.basis(p,a,b,n);
    hdPart(out,mb=>{hdRev(mb,[[.034,.003],[.036,.005],[.044,.0045],[.047,.002],[.047,-.002]],48,MM.CHROME);},40,null,M);
    hdPart(out,mb=>{hdRev(mb,[[0,.0095],[.012,.0094],[.026,.009],[.03,.0065],[.031,.002]],48,MM.CHROME);},40,null,M);
    hdPart(out,mb=>{hdRBox(mb,[.0,.026,.008],[.012,.006,.003],.002,HC.BOLT,2);},40,null,M);}
  /* ---------- the door roundels: blank, a black ring round each ---------- */
  {const uc=(G.cowl+G.pillars[0][0])/2+.08,yc=D.belt(uc)-.3,WH=SV([.92,.92,.9],MAT.COL),BK=SV([.02,.02,.02],MAT.COL),na=64;
    const disc=(s,r0,r1,off,m)=>hdPart(out,mb=>{const nr=r0>0?2:6,R=[];for(let j=0;j<=nr;j++){const r=r0+(r1-r0)*j/nr,ring=[];for(let i=0;i<na;i++){const a=i/na*TAU;ring.push(hdSS(s,uc+Math.cos(a)*r,yc+Math.sin(a)*r,off));}R.push(ring);}
      hdLoft(mb,R,m,true,s<0);const e=R[nr],e0=e.map(p=>[p[0],p[1],p[2]-s*off*.8]);hdLoft(mb,[e0,e],m,true,s>0);
      if(r0>0){const f=R[0],f0=f.map(p=>[p[0],p[1],p[2]-s*off*.8]);hdLoft(mb,[f,f0],m,true,s>0);}},20);
    for(const s of [1,-1]){disc(s,.0001,.24,.0012,WH);disc(s,.24,.25,.0014,BK);}}
}
/* a low wedge scoop on the roof from u0 to u1, w half wide and h tall at its mouth: open to the front, its mouth dark */
function cgRoofScoop(out,u0,u1,w,h){
  const K=HDK,X=K.X,PA=SV([1,1,1],MAT.PAINT),rc=.018,n=18,rows=[];
    const sec=(u,hh,ww)=>{const o=[],b=-.006,top=Math.max(.004,hh);
      o.push([-ww,b]);for(let k=0;k<=4;k++){const a=PI-k/4*PI/2;o.push([-ww+rc+Math.cos(a)*rc,top-rc+Math.sin(a)*rc]);}
      for(let k=0;k<=4;k++){const a=PI/2-k/4*PI/2;o.push([ww-rc+Math.cos(a)*rc,top-rc+Math.sin(a)*rc]);}o.push([ww,b]);
      return o.map(([z,y])=>[X(u),K.topY(u,Math.abs(z))+Math.max(b,Math.min(y,top)),z]);};
    for(let i=0;i<=n;i++){const t=i/n,u=u0+(u1-u0)*t;rows.push(sec(u,h*(1-t),w*(1-.08*t)));}
    hdPart(out,mb=>{hdLoft(mb,rows,PA,true);},35);
    /* the mouth: a rounded lip, then the dark duct going in */
    {const F=rows[0],cz=0,cy=K.topY(u0,0)+h*.45,ins=F.map(p=>[p[0],cy+(p[1]-cy)*.8,cz+(p[2]-cz)*.9]),deep=ins.map(p=>[p[0]-.05,p[1]-.01,p[2]*.95]);
      hdPart(out,mb=>{hdLoft(mb,[F,ins],PA,true);hdLoft(mb,[ins,deep],HC.GB,true);hdCap(mb,deep,HC.HONEY,true);},35);}
}
/* a wing's blade: the game's inverted section (14_loft wing), smoothed through its points, spanning ±hw, its leading
   edge at x, trailing edge raised by aoa; returns the section's mapping (q, z) to a point */
function cgWingBlade(out,x,yw,hw,c,th,aoa,m){
  const af=[[0,0],[.04,-.45],[.15,-.85],[.35,-1],[.6,-.8],[.85,-.4],[1,0],[.8,.22],[.5,.4],[.2,.42],[.05,.25]],S=[];
  for(let i=0;i<af.length;i++){const p0=af[(i+af.length-1)%af.length],p1=af[i],p2=af[(i+1)%af.length],p3=af[(i+2)%af.length];
    for(let k=0;k<4;k++){const t=k/4,t2=t*t,t3=t2*t;S.push([0,1].map(j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}
  const P=(q,z)=>[x-q[0]*c,yw+q[1]*th+q[0]*c*Math.sin(aoa)*1.1,z];
  hdPart(out,mb=>{const rings=[];for(let j=0;j<=8;j++){const z=-hw+2*hw*j/8;rings.push(S.map(q=>P(q,z)));}hdLoft(mb,rings,m,true);
    hdCap(mb,rings[0],m,true);hdCap(mb,rings[8],m,false);},30);
  return P;
}
