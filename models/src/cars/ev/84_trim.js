/* =====================================================================================
   THE EV'S BOLT-ONS, each taken off the game's body and modelled again:
   - The race mirrors (the game's 'race'): a slim painted pod on a thin black blade from the window's corner, the
     glass in a black rim on its back.
   - The flush door handles: a painted paddle lying flush in the skin, a fine dark gap round it.
   - The charge flap on the left front fender: a painted door flush in the skin, its gap round it.
   ===================================================================================== */
/* a panel lying flush in the side's skin (u, y outline P, side s): the skin cut along it, a dark gap behind its edge,
   the panel itself in paint, its edge rolled (as the fuel flap's, 79_bits hdFuel) */
function evFlush(out,car,s,P,gap=.012){
  hdCutSide(car.body,s,P,.012);
  const Pr=hdResample(P,.006),c=hdCen(Pr),Pi=Pr.map(([u,y])=>[c[0]+(u-c[0])*.975,c[1]+(y-c[1])*.94]);
  hdPart(out,mb=>{const F=Pr.map(([u,y])=>hdSS(s,u,y,-.0005)),B=Pr.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*.985,c[1]+(y-c[1])*.97,-gap));hdLoft(mb,[F,B],HC.GB,true);hdCap(mb,B,HC.GB,s<0);},30);
  hdPart(out,mb=>{const R=[1,.8,.55,.3].map(k=>Pi.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*k,c[1]+(y-c[1])*k,-.0012)));const PA=SV([1,1,1],MAT.PAINT);
    for(let i=0;i<R.length-1;i++)hdLoft(mb,[R[i],R[i+1]],PA,true,s>0);hdCap(mb,R[R.length-1],PA,s>0);
    const E=Pi.map(([u,y])=>hdSS(s,u,y,-.006));hdLoft(mb,[E,R[0]],PA,true,s>0);},40);}
function evMirrors(out,car){
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
function evHandles(out,car){
  const K=HDK,D=K.D,G=D.G,lk=D.look;
  for(const u of D.B.handles||[G.pillars[0][0]-.2,G.pillars[1][0]-.17]){const y=D.belt(u)-.09;
    hdDrop(car.body,(c,m)=>{const uu=D.uC-c[0];return Math.abs(uu-(u-.015))<.1&&Math.abs(c[1]-y)<.03&&(m===MAT.COL||m===MAT.CHROME||m===MAT.SHUT)&&hdOff(c)>.002;});
    for(const s of [1,-1])evFlush(out,car,s,RR2(u-.09,u+.06,y-.014,y+.014,.012),.008);}
}
function evCharge(out,car){
  const K=HDK,D=K.D,u0=D.uFa+.5,u1=u0+.15,yc=D.belt((u0+u1)/2)-.12;
  /* the game's outline, painted high on the fender (34_ev FACES.ev), off; the flap on the left front fender */
  hdDrop(car.body,(c,m)=>{const u=D.uC-c[0];return m===MAT.SHUT&&u>u0-.02&&u<u0+.18&&c[1]>.88&&hdOff(c)>.002;});
  evFlush(out,car,-1,RR2(u0,u1,yc-.045,yc+.045,.022),.014);
}
