/* =====================================================================================
   THE RACE'S FACE, IN THREE DIMENSIONS (in place of 22_faces FACES.race's decals), on the decals' own outlines, and
   its splitter (FRONTS.race, where the game hangs its own):
   - The grille: a smoked surround, one big black mesh set back in it.
   - The lamps: a black cavity under a clear lens, two small projectors in black bezels, a wide LED blade along the
     top edge.
   - The lower intake, mesh behind a smoked frame, and a round brake duct a side, its mesh in a black ring, the duct
     running back from it.
   - The splitter: a carbon plate well out in front of the nose following its plan, its front edge thickened, an
     endplate a side; two carbon canards a side on the bumper's corners; the red tow strap on its loop.
   ===================================================================================== */
/* a patch over a convex outline, wrapped on the surface (as 72_face hdGrid), the cells whose middles fall inside any
   of the holes left out */
function rcPanel(mb,view,P,off,m,cl,holes){const w=hdCCW(P);let z0=1e9,z1=-1e9,y0=1e9,y1=-1e9;for(const q of P){z0=Math.min(z0,q[0]);z1=Math.max(z1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}
  const nz=Math.max(1,Math.ceil((z1-z0)/cl)),ny=Math.max(1,Math.ceil((y1-y0)/cl)),dz=(z1-z0)/nz,dyy=(y1-y0)/ny;
  for(let i=0;i<nz;i++)for(let j=0;j<ny;j++){const a=z0+i*dz,b=y0+j*dyy;if(holes.some(H=>hdIn(H,a+dz/2,b+dyy/2)))continue;
    let V=[[a,b],[a+dz,b],[a+dz,b+dyy],[a,b+dyy]].map(q=>({q,p:[0,0,0],n:[0,0,0],c:[0,0,0,0]}));
    for(let k=0;k<P.length&&V.length>=3;k++)V=hdClip(V,P[k],P[(k+1)%P.length],w);if(V.length<3)continue;
    const S=V.map(v=>hdS(view,v.q[0],v.q[1],off));
    for(let k=1;k<S.length-1;k++){if(view==='F'?w>0:w<0)mb.tri(S[0],S[k],S[k+1],m[0],m[1],m[2]);else mb.tri(S[0],S[k+1],S[k],m[0],m[1],m[2]);}}}
/* a flat plate on a planar outline of 3-D points, th thick about it, its walls round the edge */
function rcPlate3(mb,P,th,m){const c=P.reduce((a,p)=>V3.add(a,p),[0,0,0]).map(v=>v/P.length),n=V3.norm(V3.cross(V3.sub(P[1],P[0]),V3.sub(P[2],P[0]))),A=P.map(p=>V3.add(p,V3.mul(n,th/2))),B=P.map(p=>V3.add(p,V3.mul(n,-th/2)));
  hdLoft(mb,[A,B],m,true);hdCap(mb,A,m,false);hdCap(mb,B,m,true);}
function rcFace(out,car){
  const K=HDK,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood];
  /* ---------- the grille ---------- */
  {const S0=RR2(-.47,.47,Y(.793),Y(1.032),.03),M0=RR2(-.445,.445,Y(.808),Y(1.016),.025);for(const c of cuts)hdCut(c,'F',S0);
    hdPart(out,mb=>{rcPanel(mb,'F',S0,-.0015,HC.GB,.008,[M0]);},30);hdTrim(out,'F',hdResample(S0,.008),.012,.006,HC.GB,true,50,.001);
    hdRecess(out,'F',M0,.06,.97,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(M0,.985),.024,.016,.0016,.012,HC.HONEY);hdTrim(out,'F',hdResample(M0,.006),.008,.004,HC.GB,true,50,-.001);}
  for(const s of [1,-1]){
    /* ---------- the lamp ---------- */
    const L=[[.488,.808],[.86,.814],[.9,.878],[.885,1.008],[.488,1.022]].map(([z,y])=>[s*z,Y(y)]),LED=[[.5,.948],[.87,.943],[.88,.973],[.5,.98]].map(([z,y])=>[s*z,Y(y)]);
    hdLampUnit(out,'F',L,cuts,{deep:.065,k:.9,wall:HC.GB,back:()=>HC.GB,bulge:.003,cell:.005,lens:()=>HC.LENSH,
      inside:o=>{
        for(const zp of [.6,.72]){const b=hdS('F',s*zp,Y(.878),-.034);
          hdRevAt(o,'F',b,[[.046,-.02],[.045,.006],[.042,.011],[.037,.011]],HC.SATIN,56);hdRevAt(o,'F',b,[[.037,.011],[.034,.004]],HC.GB,56);
          hdRevAt(o,'F',b,[[.034,-.004],[.034,.006],[.03,.016],[.02,.023],[.009,.0265],[0,.027]],HC.LAMPH,48,60);}
        /* the LED blade: a light guide the length of the top edge, in a satin channel */
        hdPart(o,mb=>{hdGrid(mb,'F',hdShrink(LED,.96),()=>-.012,()=>SV([1,1,1],MAT.LED),.008);},40);
        hdPart(o,mb=>{const P=hdResample(LED,.008);hdLoft(mb,[P.map(p=>hdS('F',p[0],p[1],-.011)),P.map(p=>hdS('F',p[0],p[1],-.03))],HC.SATIN,true);},30);}});
    /* ---------- the brake duct ---------- */
    {const E0=EL2(s*.73,Y(.52),.07,.06,40),E1=EL2(s*.73,Y(.52),.058,.048,40);hdCut(car.body,'F',E0);
      hdPart(out,mb=>{rcPanel(mb,'F',E0,-.0015,HC.GB,.006,[E1]);},30);hdTrim(out,'F',hdResample(E0,.006),.01,.005,HC.GB,true,50,.001);
      hdRecess(out,'F',E1,.12,.8,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(E1,.97),.015,.012,.0014,.01,HC.HONEY);}
  }
  /* ---------- the lower intake ---------- */
  {const I0=RR2(-.64,.64,Y(.42),Y(.61),.04),I1=RR2(-.6,.6,Y(.432),Y(.598),.035);hdCut(car.body,'F',I0);
    hdPart(out,mb=>{rcPanel(mb,'F',I0,-.0015,HC.GB,.008,[I1]);},30);hdTrim(out,'F',hdResample(I0,.008),.01,.005,HC.GB,true,50,.001);
    hdRecess(out,'F',I1,.07,.97,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(I1,.985),.026,.016,.0016,.012,HC.HONEY);hdTrim(out,'F',hdResample(I1,.006),.007,.004,HC.GB,true,50,-.001);}
}
function rcSplitter(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy+D.B.fit.fdy,y=Y(.4),CF=SV([1,1,1],MAT.CARBON),n=48;
  /* the plate: its plan's front edge 14 cm out in front of the nose, back to the axle line's front; a rounded nose */
  const fe=z=>K.uFront(Math.abs(z)*.95,y+.05)-.14,sec=[[0,.006],[.004,.016],[.012,.019],[.04,.018],[1,.018],[1,0],[.04,0],[.01,0],[.003,.002]];
  const row=z=>sec.map(([d,h])=>[X(d===1?.35:fe(z)+d),y+h,z]),rows=[];for(let k=0;k<=n;k++){const t=k/n,z=-.9+1.8*(.5-.5*Math.cos(t*PI));rows.push(row(z));}
  hdPart(out,mb=>{hdLoft(mb,rows,CF,true);hdCap(mb,rows[0],CF,true);hdCap(mb,rows[n],CF,false);},40);
  const u0=fe(.9),ep=D.B.fit.epU==null?.08:u0+D.B.fit.epU;
  for(const s of [1,-1]){
    /* the endplate */
    hdPart(out,mb=>{rcPlate3(mb,[[X(u0),y,s*.9],[X(ep),y,s*.9],[X(ep+.02),y+.13,s*.9],[X(u0)+.02,y+.06,s*.9]],.008,CF);},40);
    /* the canards */
    for(const [yy,du] of [[.62,.05],[.53,.03]]){const ua=K.uFront(.8,Y(yy))+du;
      hdPart(out,mb=>{rcPlate3(mb,[[X(ua),Y(yy),s*.8],[X(ua+.02),Y(yy+.005),s*.93],[X(ua+.24),Y(yy+.03),s*.93]],.005,CF);},40);}}
  /* the tow strap on its loop */
  {const xr=X(K.uFront(.35,Y(.47))),RED=SMC('#d02020',MAT.FABRIC),a=[xr-.01,Y(.47),.35],b=[xr+.09,Y(.42),.35];
    hdPart(out,mb=>{const path=[a,V3.lerp(a,b,.5),b,[b[0]+.012,b[1]-.02,b[2]],[b[0]-.005,b[1]-.035,b[2]],V3.add(V3.lerp(a,b,.5),[0,-.03,0]),[a[0],a[1]-.025,a[2]]];
      hdSweep(mb,rcSpline(path,6),[[-.003,-.014],[.003,-.014],[.003,.014],[-.003,.014]],RED,[0,0,1],true,true);},40);}
}
/* (a smooth path through a few points: Catmull-Rom, k steps a span) */
function rcSpline(P,k=8){const o=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let j=0;j<k;j++){const t=j/k,t2=t*t,t3=t2*t;o.push([0,1,2].map(a=>.5*(2*p1[a]+(-p0[a]+p2[a])*t+(2*p0[a]-5*p1[a]+4*p2[a]-p3[a])*t2+(-p0[a]+3*p1[a]-3*p2[a]+p3[a])*t3)));}}
  o.push(P[P.length-1]);return o;}
