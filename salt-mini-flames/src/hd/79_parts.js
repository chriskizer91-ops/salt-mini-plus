/* =====================================================================================
   SALT MINI PLUS: PARTS SHARED BY THE NEWER CARS, first built for one car and kept here once a second needs them:
   - hdLip: a black splitter lofted along the nose at the game's height and reach (23_parts FRONTS.lip), its thin red
     line along the front edge unless the build says not (the EV's, the Coupe's).
   - hdDiffuser: a wide black diffuser (25_coupe REARS.coupeDiff): the valance with the reversing lamps set in it (o.rev
     false: none) and red reflectors at its ends, the floor sweeping up to it, five fins.
   - hdMirrorsRace: the race mirrors (the game's 'race'): a slim painted pod on a thin black blade.
   - hdFlush: a panel lying flush in the side's skin (flush handles, a charge flap).
   - hdCutTop, hdTS, hdVentTop: the top of the car seen from above, cut along an outline; a point on it; a vent
     let into it, slats across a dark pocket.
   ===================================================================================== */
/* the lip: lofted along the nose at the game's height and reach (23_parts FRONTS.lip) */
function hdLip(out,car){
  const K=HDK,D=K.D,X=K.X,F=D.B.fit,y=K.dy+.425+F.fdy,zw=F.lipZ||.84,uB=F.lipU||.35,n=48;
  const sec=[[0,.011],[.003,.018],[.012,.022],[.08,.022],[1,.022],[1,0],[.08,0],[.012,.0],[.003,.004]];
  const row=z=>{const uE=K.uFront(Math.abs(z)*.96,y+.04)-.045,back=Math.max(.06,uB-uE);return sec.map(([d,h])=>[X(uE+(d===1?back:d)),y+h,z]);};
  const rows=[];for(let k=0;k<=n;k++){const t=k/n,z=-zw+2*zw*(.5-.5*Math.cos(t*PI));rows.push(row(z));}
  hdPart(out,mb=>{hdLoft(mb,rows,HC.GB,true);hdCap(mb,rows[0],HC.GB,true);hdCap(mb,rows[n],HC.GB,false);},40);
  /* the red line along its front edge (unless the build says not: lipLine false) */
  if(D.look.lipLine!==false)hdPart(out,mb=>{const R=[];for(let k=0;k<=n;k++){const t=k/n,z=-zw*.995+2*zw*.995*(.5-.5*Math.cos(t*PI)),uE=K.uFront(Math.abs(z)*.96,y+.04)-.045;R.push([[X(uE)+.0006,y+.0085,z],[X(uE)+.0006,y+.0135,z]]);}
    for(let k=0;k<n;k++)mb.quad(R[k][0],R[k+1][0],R[k+1][1],R[k][1],[1,1,1],0,MAT.ACCENT);},40);
}
function hdDiffuser(out,car,o={}){
  const K=HDK,D=K.D,X=K.X,x=X(D.L),y0=D.sill(D.L),PL=HC.PLASTIC;
  /* the valance across the tail's foot, in gloss black, its corners rounded */
  hdPart(out,mb=>{hdRBox(mb,[x-.006,y0+.03,0],[.012,.06,.78],.01,HC.GB,3);},35);
  /* the floor under the tail, sweeping up to it */
  {const ax=V3.norm([1,-.18,0]),ay=V3.norm([.18,1,0]);hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.16,.006,.76],.004,PL,2);},30,null,M4.basis([x+.12,y0-.03,0],ax,ay,[0,0,1]));}
  /* five fins standing down from it */
  for(let k=-2;k<=2;k++)hdPart(out,mb=>{hdExtrude(mb,[[x+.22,y0-.05],[x+.15,y0-.06],[x-.012,y0-.02],[x-.012,y0+.06]],k*.16-.003,k*.16+.003,PL,.0015,2,true);},35);
  /* the reversing lamps set in the valance, the red reflectors at its ends */
  for(const s of [1,-1]){
    if(o.rev!==false){hdPart(out,mb=>{hdRBox(mb,[x-.0185,y0+.03,s*.26],[.003,.014,.06],.004,HC.LENSR,2);},40);
    hdPart(out,mb=>{for(let z=.21;z<=.311;z+=.02)ball(mb,[x-.016,y0+.03,s*z],.003,8,HC.BULB);},50);}
    hdPart(out,mb=>{hdRBox(mb,[x-.0195,y0+.05,s*.74],[.003,.012,.035],.003,HC.REFR,2);},40);}
}
/* a panel lying flush in the side's skin (u, y outline P, side s): the skin cut along it, a dark gap behind its edge,
   the panel itself in paint, its edge rolled (as the fuel flap's, 79_bits hdFuel) */
function hdFlush(out,car,s,P,gap=.012){
  hdCutSide(car.body,s,P,.012);
  const Pr=hdResample(P,.006),c=hdCen(Pr),Pi=Pr.map(([u,y])=>[c[0]+(u-c[0])*.975,c[1]+(y-c[1])*.94]);
  hdPart(out,mb=>{const F=Pr.map(([u,y])=>hdSS(s,u,y,-.0005)),B=Pr.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*.985,c[1]+(y-c[1])*.97,-gap));hdLoft(mb,[F,B],HC.GB,true);hdCap(mb,B,HC.GB,s<0);},30);
  hdPart(out,mb=>{const R=[1,.8,.55,.3].map(k=>Pi.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*k,c[1]+(y-c[1])*k,-.0012)));const PA=SV([1,1,1],MAT.PAINT);
    for(let i=0;i<R.length-1;i++)hdLoft(mb,[R[i],R[i+1]],PA,true,s>0);hdCap(mb,R[R.length-1],PA,s>0);
    const E=Pi.map(([u,y])=>hdSS(s,u,y,-.006));hdLoft(mb,[E,R[0]],PA,true,s>0);},40);}
function hdMirrorsRace(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,PA=SV([1,1,1],MAT.PAINT);let u0=G.cowl;while(u0<G.cB){const k=secKeys(D,u0);if(k.P[10][1]-k.yG>.07)break;u0+=.01;}
  const k=secKeys(D,u0+.1),ub=u0+.1,yb=k.yG,zb=k.P[8][0];
  /* the game's mirror: everything standing off the side round where it sits (as 76_trim hdMirrors) */
  hdDrop(car.body,(c,m,cl,V)=>{const u=D.uC-c[0];if(u<ub-.16||u>ub+.14||c[1]<yb-.03||c[1]>yb+.24||Math.abs(c[2])<zb-.04)return false;return Math.max(...V.map(hdOff))>.009;});
  for(const s of [1,-1]){
    /* the blade: a thin airfoil from a small foot on the door out and up to the pod */
    const a=[X(ub-.01),yb+.035,s*(zb+.004)],b=[X(ub+.025),yb+.1,s*(zb+.135)],path=[];for(let i=0;i<=12;i++){const t=i/12;path.push(V3.add(V3.lerp(a,b,t),[0,-.02*Math.sin(t*PI),0]));}
    hdPart(out,mb=>{const foil=[];for(let i=0;i<16;i++){const q=i/16*TAU,c=Math.cos(q);foil.push([c>0?c*.022:c*.03,Math.sin(q)*.0045]);}hdSweep(mb,path,foil,HC.GB,[1,0,0],true,true);},45);
    hdPart(out,mb=>{hdRBox(mb,[X(ub-.01),yb+.035,s*(zb+.004)],[.04,.016,.008],.006,HC.GB,3);},40);
    /* the pod: rounded in front, drawn in to a flat back that holds the glass */
    const c=[X(ub+.035),yb+.11,s*(zb+.155)],rings=[];
    for(let i=0;i<=10;i++){const t=i/10,x=c[0]+.055-.105*t,f=t<.62?Math.sqrt(1-Math.pow(1-t/.62,2))*.92+.08:1-.05*((t-.62)/.38)**2;
      rings.push(hdRRect(.078*f,.034*f,.02*f,4).map(([zz,yy])=>[x,c[1]+yy,c[2]+zz]));}
    hdPart(out,mb=>{hdLoft(mb,rings,PA,true,s<0);hdCap(mb,rings[0],PA,s>0);},45);
    hdPart(out,mb=>{const r=rings[10],xg=c[0]-.0505,G2=hdRRect(.068,.026,.014,4).map(([zz,yy])=>[xg,c[1]+yy,c[2]+zz]);hdLoft(mb,[r,G2.map(p=>[p[0]+.004,p[1],p[2]])],HC.GB,true,s<0);hdCap(mb,G2.map(p=>[p[0]+.004,p[1],p[2]]),HC.MIRROR,s<0);},40);}
}
/* the top seen from above: the point at (u, z), off metres up */
function hdTS(u,z,off=0){const K=HDK;return [K.X(u),K.topY(u,Math.abs(z))+off,z];}
/* cut a panel open along a convex outline (u, z) seen from above: each triangle on the top surface loses exactly the
   part inside (as 75_cabin hdCutSide does the sides) */
function hdCutTop(src,P0,tol=.02){if(!src||!src.p)return 0;const P=hdHull(P0),w=hdCCW(P),p=src.p,N=src.n,C=src.c,M=src.m,o={p:[],n:[],c:[],m:[]},D=HDK.D;let n=0;
  const emit=(V,t)=>{for(let k=1;k<V.length-1;k++)for(const v of [V[0],V[k],V[k+1]]){o.p.push(v.p[0],v.p[1],v.p[2]);const l=Math.hypot(v.n[0],v.n[1],v.n[2])||1;o.n.push(v.n[0]/l,v.n[1]/l,v.n[2]/l);o.c.push(v.c[0],v.c[1],v.c[2],v.c[3]);o.m.push(M[t*3]);}};
  let u0=1e9,u1=-1e9,z0=1e9,z1=-1e9;for(const q of P){u0=Math.min(u0,q[0]);u1=Math.max(u1,q[0]);z0=Math.min(z0,q[1]);z1=Math.max(z1,q[1]);}
  for(let t=0;t<p.length/9;t++){const b=t*9;
    const V=[0,1,2].map(k=>({q:[D.uC-p[b+k*3],p[b+k*3+2]],p:[p[b+k*3],p[b+k*3+1],p[b+k*3+2]],n:[N[b+k*3],N[b+k*3+1],N[b+k*3+2]],c:[C[t*12+k*4],C[t*12+k*4+1],C[t*12+k*4+2],C[t*12+k*4+3]]}));
    let a0=1e9,a1=-1e9,b0=1e9,b1=-1e9;for(const v of V){a0=Math.min(a0,v.q[0]);a1=Math.max(a1,v.q[0]);b0=Math.min(b0,v.q[1]);b1=Math.max(b1,v.q[1]);}
    let on=a1>=u0&&a0<=u1&&b1>=z0&&b0<=z1&&M[t*3]!==MAT.GLASS&&M[t*3]!==MAT.GLASSL;
    if(on){const cu=(V[0].q[0]+V[1].q[0]+V[2].q[0])/3,cz=(V[0].q[1]+V[1].q[1]+V[2].q[1])/3,cy=(V[0].p[1]+V[1].p[1]+V[2].p[1])/3;on=Math.abs(cy-HDK.topY(cu,Math.abs(cz)))<tol;}
    if(!on){emit(V,t);continue;}
    let rest=V;for(let e=0;e<P.length&&rest.length>=3;e++){const a=P[e],c=P[(e+1)%P.length],outp=hdClip(rest,a,c,-w);if(outp.length>=3)emit(outp,t);rest=hdClip(rest,a,c,w);}
    if(rest.length>=3)n++;}
  src.p=o.p;src.n=o.n;src.c=o.c;src.m=o.m;return n;}
/* a vent let into the top along a convex outline P (u, z): the panels in cuts opened, a dark pocket deep metres down
   (its walls in wall), slats across it every pitch metres, each a blade leaning forward */
function hdVentTop(out,cuts,P,o={}){const deep=o.deep||.04,pitch=o.pitch||.022,wall=o.wall||HC.GB,SL=o.slat||HC.GB,R=hdResample(P,.006),c=hdCen(R);
  for(const s of cuts)hdCutTop(s,P,o.tol||.03);
  hdPart(out,mb=>{const F=R.map(([u,z])=>hdTS(u,z,.0005)),B=R.map(([u,z])=>hdTS(c[0]+(u-c[0])*.96,c[1]+(z-c[1])*.96,-deep));hdLoft(mb,[F,B],wall,true);hdCap(mb,B,HC.GB,true);},30);
  let u0=1e9,u1=-1e9;for(const [u] of P){u0=Math.min(u0,u);u1=Math.max(u1,u);}
  /* (where a line across, at u, meets the outline) */
  const span=u=>{let a=1e9,b=-1e9;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];if((p[0]-u)*(q[0]-u)>0)continue;const t=Math.abs(q[0]-p[0])<1e-9?0:(u-p[0])/(q[0]-p[0]),z=p[1]+(q[1]-p[1])*t;a=Math.min(a,z);b=Math.max(b,z);}return [a,b];};
  hdPart(out,mb=>{for(let u=u0+pitch*.6;u<u1-pitch*.4;u+=pitch){const [a,b]=span(u);if(b-a<.02)continue;const path=[];for(let z=a+.004;z<=b-.004+1e-6;z+=.02)path.push(hdTS(u,z,-.004));if(path.length<2)path.push(hdTS(u,b-.004,-.004));
    hdSweep(mb,path,[[-.002,-.012],[.002,-.012],[.003,.0],[-.001,.0]].map(([x,y])=>[x,y]),SL,[.4,1,0],true,true);}},35);}
