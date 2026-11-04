/* =====================================================================================
   THE RACE'S AERO, where the game puts it:
   - The roof lip and the GT wing (the game's 'wing', 23_parts spoiler): the carbon lip carrying the roofline back over
     the rear glass with its fins and its third brake lamp; above it the wing, a smooth cambered aerofoil lofted
     across, its Gurney flap along the trailing edge, carbon endplates, on two swan necks curling up from the roof's
     back over its top and down onto it.
   - The hood vents (HOODS.vents): two louvred vents let into the hood, carbon louvres over a dark pocket, and the
     hood pins either side of the nose. Built on the hood, so they lift with it.
   - The side skirts (EXTRAS.skirts): a carbon blade along each sill, its lower edge kicked out.
   - The flares' bolts: the bolted widebody's bolts round each flare's outer edge.
   ===================================================================================== */
function rcWing(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,topY=D.topY,CF=SV([1,1,1],MAT.CARBON);
  /* ---------- the lip ---------- */
  {const u0=G.rr-.08,len=.26,w=D.B.lipW||.68,n=14,y0=topY(u0,0)+.004,top=t=>y0+.01*Math.sin(t*PI)-.05*t*t,thk=t=>.025*(1-t)+.008;
    const sec=[];for(let i=0;i<=n;i++){const t=i/n;sec.push([u0+len*t,top(t)]);}for(let i=n;i>=0;i--){const t=i/n;sec.push([u0+len*t,top(t)-thk(t)*(t<.04?t/.04:1)]);}
    const R=[];for(let k=0;k<=24;k++){const z=-w+2*w*k/24;R.push(sec.map(([u,y])=>[X(u),y,z]));}
    hdPart(out,mb=>{hdLoft(mb,R,CF,true,true);hdCap(mb,R[0],CF,false);hdCap(mb,R[R.length-1],CF,true);},35);
    for(const s of [1,-1]){const z=s*(w-.006),P=[[X(u0+.02),topY(u0,.6)],[X(u0+len),top(1)],[X(u0+len-.02),top(1)-.12],[X(u0+.04),topY(u0+.04,.6)-.05]];hdPart(out,mb=>{hdExtrude(mb,P,z-.006,z+.006,CF,.003,2,true);},40);}
    const x=X(u0+len-.02),y=top(1)-thk(1)-.006;hdPart(out,mb=>{hdRBox(mb,[x,y,0],[.012,.007,.2],.005,HC.GB,2);hdRBox(mb,[x-.006,y-.002,0],[.006,.005,.19],.004,HC.REDL,2);},40);
    hdPart(out,mb=>{for(let z=-.18;z<=.1801;z+=.03)ball(mb,[x-.002,y-.002,z],.0028,8,SV([1,1,1],MAT.TAIL));},40);}
  /* ---------- the wing ---------- */
  const uw=G.rr+.02,yw=topY(G.rr-.25,0)+.3,hw=.82,c=.36,th=.03,aoa=.2,x=X(uw)+.06;
  /* (the game's section, smoothed: a closed loop round the chord, its points in chord and thickness shares) */
  const af0=[[0,0],[.04,-.45],[.15,-.85],[.35,-1],[.6,-.8],[.85,-.4],[1,0],[.8,.22],[.5,.4],[.2,.42],[.05,.25]],af=[];
  for(let i=0;i<af0.length;i++){const p0=af0[(i+af0.length-1)%af0.length],p1=af0[i],p2=af0[(i+1)%af0.length],p3=af0[(i+2)%af0.length];
    for(let j=0;j<4;j++){const t=j/4,t2=t*t,t3=t2*t;af.push([0,1].map(a=>.5*(2*p1[a]+(-p0[a]+p2[a])*t+(2*p0[a]-5*p1[a]+4*p2[a]-p3[a])*t2+(-p0[a]+3*p1[a]-3*p2[a]+p3[a])*t3)));}}
  const P=(q,z)=>[x-q[0]*c,yw+q[1]*th+q[0]*c*Math.sin(aoa)*1.1,z];
  hdPart(out,mb=>{const R=[];for(let k=0;k<=32;k++){const z=-hw+2*hw*k/32;R.push(af.map(q=>P(q,z)));}hdLoft(mb,R,CF,true);hdCap(mb,R[0],CF,true);hdCap(mb,R[32],CF,false);},35);
  /* the Gurney flap along the trailing edge */
  {const te=P([1,0],0);hdPart(out,mb=>{hdRBox(mb,[te[0]+.002,te[1]+.016,0],[.0025,.018,hw],.002,CF,1);},35);}
  for(const s of [1,-1]){
    /* the endplate */
    hdPart(out,mb=>{hdExtrude(mb,[[x+.12,yw-.1],[x-.4,yw-.1],[x-.42,yw+.06],[x-.38,yw+.14],[x+.1,yw+.12]],s*(hw+.006)-.005,s*(hw+.006)+.005,CF,.002,2,true);},40);
    /* the swan neck: up from the roof's back, over the wing's top and down onto it, with its foot on the roof */
    const z=s*.42,yb=topY(G.rr-.3,.42),path=rcSpline([[X(G.rr-.3),yb,z],[X(G.rr-.24),yw-.08,z],[x-.06,yw+.07,z],[x-.16,yw+.045,z]],10);
    hdPart(out,mb=>{hdSweep(mb,path,hdRRect(.006,.02,.005,3).map(([a,b])=>[a,b]),HC.GB,[0,0,1],true,true);},40);
    hdPart(out,mb=>{hdRBox(mb,[X(G.rr-.3),yb+.004,z],[.05,.006,.03],.004,HC.GB,2);for(const dx of [-.03,.03])hdCyl(mb,[X(G.rr-.3)+dx,yb+.01,z],[X(G.rr-.3)+dx,yb+.016,z],.006,.005,6,HC.BOLT);},40);}
}
function rcVents(out,car){
  const K=HDK,D=K.D,X=K.X,o=D.B.fit.ventU||0,CF=SV([1,1,1],MAT.CARBON);
  for(const s of [1,-1]){hdVentTop(out,[car.hood],[[.7+o,s*.22],[1.25+o,s*.24],[1.25+o,s*.58],[.7+o,s*.52]],{deep:.04,pitch:.055,slat:CF});
    /* the hood pin: its post, the pin through it, the lanyard's ring */
    if(D.look.hoodPins!==false){const p=hdTS(.255,s*.6,0);
      hdPart(out,mb=>{hdCyl(mb,p,V3.add(p,[0,.02,0]),.006,.006,12,MM.CHROME);hdCyl(mb,V3.add(p,[-.012,.016,0]),V3.add(p,[.012,.016,0]),.0025,.0025,8,MM.CHROME);
        const r=[];for(let k=0;k<=20;k++){const a=k/20*TAU;r.push([p[0]+.018+Math.cos(a)*.008,p[1]+.004,p[2]+Math.sin(a)*.008]);}hdTube(mb,r,.0015,6,MM.CHROME,true,false);
},45);
      hdPart(out,mb=>{hdRev(mb,[[.016,0],[.016,.002],[.012,.003]],24,MM.CHROME,0,TAU,true);},45,null,M4.basis(p,[1,0,0],[0,0,-1],[0,1,0]));}}
}
function rcSkirts(out,car){
  const K=HDK,D=K.D,X=K.X,Y=y=>y+K.dy+D.B.chY,u0=D.uFa+D.arch.a+.1,u1=D.uRa-D.arch.a-.1,z=D.B.fit.sideZ?D.B.fit.sideZ-.04:.95,CF=SV([1,1,1],MAT.CARBON);
  for(const s of [1,-1]){const sec=[[-.035,.035],[.0,.035],[.012,.03],[.03,-.02],[.045,-.035],[.042,-.04],[-.035,-.035]],n=30,R=[];
    for(let i=0;i<=n;i++){const t=i/n,u=u0+(u1-u0)*t,e=Math.min(1,Math.min(t,1-t)*12);R.push(sec.map(([q,yy])=>[X(u),Y(.34)+yy*(.6+.4*e),s*(z+q*(.5+.5*e))]));}
    hdPart(out,mb=>{hdLoft(mb,R,CF,true,s<0);hdCap(mb,R[0],CF,s>0);hdCap(mb,R[n],CF,s<0);},40);}
}
function rcBolts(out,car){
  const K=HDK,D=K.D,X=K.X,F=D.look.flares;if(!F||!F.bolts)return;const w=F.w,o=F.out,N=14;
  for(const ua of [D.uFa,D.uRa])for(const s of [1,-1])for(let k=1;k<N;k++){const ph=(F.a0||-.01)+((F.a1||1.01)-(F.a0||-.01))*k/N,end=sm01(Math.min(k,N-k)/(N*.1));
    const e=archPt(D,ua,ph*PI,.006),ye=Math.min(e[1],D.belt(e[0])-.02),zs=K.sideZ(e[0],ye),[u,y0]=archPt(D,ua,ph*PI,w*.82),y=Math.min(y0,D.belt(u)-.02),zb=Math.max(zs,K.sideZ(u,y)),dz=o*.47*(.35+.65*end);
    const p=[X(u),y,s*(zb+dz)],d=V3.norm([0,0,s]);
    hdPart(out,mb=>{hdCyl(mb,V3.add(p,V3.mul(d,-.002)),V3.add(p,V3.mul(d,.003)),.011,.011,14,HC.BOLT);ball(mb,V3.add(p,V3.mul(d,.003)),.008,12,HC.BOLT);},45);}
}
/* the rest of the game's flare, which 73_arch hdArches leaves on (it takes off what stands up to 6 cm out of the side,
   and these flares stand out further): every triangle round an arch standing between 5.5 cm and the flare's own
   reach out of the side, its bolts with it */
function rcFlareDrop(car){
  const K=HDK,D=K.D,F=D.look.flares;if(!F)return;
  for(const src of [car.body,car.hide])if(src&&src.p)hdDrop(src,(c,m,cl,V)=>{if(m===MAT.GLASS||m===MAT.GLASSL||c[1]<D.arch.cy-.06)return false;const u=D.uC-c[0];
    for(const ua of [D.uFa,D.uRa]){const Ar=ua===D.uRa?D.archB:D.arch;if(Math.abs(u-ua)>Ar.a+F.w+.05||Math.hypot(u-ua,c[1]-Ar.cy)>Math.max(Ar.a,Ar.b)+F.w+.08)continue;
      const off=Math.max(...V.map(hdOff));if(off>.055&&off<F.out+.04)return true;}return false;});
}
