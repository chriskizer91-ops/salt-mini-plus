/* =====================================================================================
   THE NIGHT RUNNER'S OWN PARTS, IN THREE DIMENSIONS (in place of the game's boxes and plates for them, 23_parts),
   at the game's places and sizes:
   - The bolts round the widebody's flares (the flares are the shared ones, 73_arch hdFlares): button heads standing
     off the flare, nine to an arch.
   - The splitter (FRONTS.race): a carbon plate lofted along the nose, its front edge rounded; an endplate at each
     end; two canards on each corner of the nose; the red tow strap's loop.
   - The bonnet's vents (HOODS.vents): each let into the bonnet, carbon slats over a dark pocket (behind the pop-ups,
     where they clear them); the bonnet pins in front of the pods.
   - The deck wing (spoiler 'gt', the game's own taken off): a smooth aerofoil, its Gurney flap, endplates with rounded
     corners, two swan necks curving up from the tail over its top and down onto it, their feet bolted to the tail.
   - The skirts (EXTRAS.skirts): a carbon blade along each sill, its lower edge kicked out, ending ahead of the side
     pipes.
   - The glow tubes (EXTRAS.underglow): a tube along each sill and one across the nose, glowing the build's cyan, in
     black clips, their ends capped and wired.
   ===================================================================================== */
function wnBolts(out,car){
  const K=HDK,D=K.D,X=K.X,F=D.look.flares;if(!F)return;const w=F.w,o=F.out,n=28,a0=F.a0||-.01,a1=F.a1||1.01;
  for(const ua of [D.uFa,D.uRa])for(const s of [1,-1])for(let k=2;k<n-1;k+=3){const ph=a0+(a1-a0)*k/n,end=sm01(Math.min(k,n-k)/(n*.1));
    /* (where the flare's surface is there, as 73_arch hdFlares lofts it) */
    const e=archPt(D,ua,ph*PI,.006),ye=Math.min(e[1],D.belt(e[0])-.02),zs=K.sideZ(e[0],ye),[u,y0]=archPt(D,ua,ph*PI,w*.45),y=Math.min(y0,D.belt(u)-.02),
      zb=Math.max(zs,K.sideZ(u,y)),p=[X(u),y,s*(zb+o*.914*(.35+.65*end))],cy=ua===D.uRa?D.archB.cy:D.arch.cy,
      rad=V3.norm([X(u)-X(ua),y-cy,0]),nrm=V3.norm(V3.add([0,0,s],V3.mul(rad,.35))),t1=V3.norm(V3.cross([0,1,0],nrm)),t2=V3.cross(nrm,t1);
    hdPart(out,mb=>{hdRev(mb,[[.0115,-.004],[.0115,.0015],[.0098,.0042],[.006,.0058],[0,.0062]],20,MM.CHROME,0,TAU,true);},40,null,M4.basis(p,t1,t2,nrm));}
}
/* a thin plate on a planar outline in 3-D (pts), th thick across it */
function wnPlate(mb,pts,th,m){const n=V3.norm(V3.cross(V3.sub(pts[1],pts[0]),V3.sub(pts[2],pts[0]))),A=pts.map(p=>V3.add(p,V3.mul(n,th/2))),B=pts.map(p=>V3.add(p,V3.mul(n,-th/2)));
  hdLoft(mb,[A,B],m,true);hdCap(mb,A,m,false);hdCap(mb,B,m,true);}
/* an outline (2-D) with its corners filleted, r metres round, n steps a corner */
function wnFillet(P,r,n=5){const o=[];for(let i=0;i<P.length;i++){const a=P[(i+P.length-1)%P.length],p=P[i],c=P[(i+1)%P.length],la=Math.hypot(a[0]-p[0],a[1]-p[1]),lc=Math.hypot(c[0]-p[0],c[1]-p[1]),
    k=Math.min(r,la*.45,lc*.45),A=[p[0]+(a[0]-p[0])*k/la,p[1]+(a[1]-p[1])*k/la],C=[p[0]+(c[0]-p[0])*k/lc,p[1]+(c[1]-p[1])*k/lc];
  for(let j=0;j<=n;j++){const t=j/n,q=(1-t)*(1-t),w=2*t*(1-t),e=t*t;o.push([A[0]*q+p[0]*w+C[0]*e,A[1]*q+p[1]*w+C[1]*e]);}}return o;}
/* a smooth path (2-D or 3-D) through points, Catmull-Rom, n steps between each */
function wnSpline(P,n=8,closed=false){const o=[],N=P.length,g=i=>closed?P[(i+N)%N]:P[clamp(i,0,N-1)];
  for(let i=0;i<(closed?N:N-1);i++)for(let k=0;k<n;k++){const t=k/n,p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
    o.push(p1.map((_,j)=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t*t+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t*t*t)));}
  if(!closed)o.push(P[N-1].slice());return o;}
function wnSplitter(out,car){
  const K=HDK,D=K.D,X=K.X,F=D.B.fit,Y=y=>y+K.dy+F.fdy,y=Y(.4),CB=MM.CARBON,n=48,zw=.9,edge=z=>K.uFront(Math.abs(z)*.95,y+.05)-.14;
  /* the plate: from its rounded front edge back to under the nose */
  const sec=[[0,.007],[.002,.0135],[.01,.018],[.06,.018],[1,.018],[1,0],[.06,0],[.01,0],[.002,.0025]];
  const row=z=>{const uE=edge(z),back=Math.max(.06,.35-uE);return sec.map(([d,h])=>[X(uE+(d===1?back:d)),y+h,z]);};
  const rows=[];for(let k=0;k<=n;k++){const t=k/n,z=-zw+2*zw*(.5-.5*Math.cos(t*PI));rows.push(row(z));}
  hdPart(out,mb=>{hdLoft(mb,rows,CB,true);hdCap(mb,rows[0],CB,true);hdCap(mb,rows[n],CB,false);},40);
  const u0=edge(zw),ep=F.epU==null?u0+.08:u0+F.epU;
  for(const s of [1,-1]){
    /* the endplate */
    hdPart(out,mb=>{hdExtrude(mb,wnFillet([[X(u0),y-.002],[X(ep),y-.002],[X(ep+.02),y+.13],[X(u0)+.02,y+.06]],.012),s*zw-.004,s*zw+.004,CB,.0015,2);},40);
    /* the canards */
    for(const [yy,du] of [[.62,.05],[.53,.03]]){const ua=K.uFront(.8,Y(yy))+du;
      hdPart(out,mb=>{wnPlate(mb,[[X(ua),Y(yy),s*.79],[X(ua+.24),Y(yy+.03),s*.93],[X(ua+.02),Y(yy+.005),s*.93]],.004,CB);},30);}}
  /* the tow strap's loop, out of the nose and back */
  {const xr=X(K.uFront(.35,Y(.47))),c=[xr+.045,Y(.44)],dr=V3.norm([.09,-.05,0]),pr=[-dr[1],dr[0]],P=[];
    for(let k=0;k<=40;k++){const a=k/40*TAU,ca=Math.cos(a),sa=Math.sin(a);P.push([c[0]+dr[0]*ca*.06+pr[0]*sa*.016,c[1]+dr[1]*ca*.06+pr[1]*sa*.016,.35]);}
    hdPart(out,mb=>{hdSweep(mb,P,[[-.0016,-.0125],[.0016,-.0125],[.0016,.0125],[-.0016,.0125]],SMC('#d02020',SM.CLOTH),[0,0,1],true,false);},40);}
}
function wnVents(out,car){
  const K=HDK,D=K.D,X=K.X;
  for(const s of [1,-1]){hdVentTop(out,[car.hood],[[.69,s*.2],[1.02,s*.22],[1.02,s*.5],[.69,s*.46]],{deep:.045,pitch:.026,slat:MM.CARBON});
    /* the bonnet pin: a chrome base on the bonnet, the pin through it, its clip */
    const p=hdTS(.255,s*.6,0),up=[0,1,0];
    hdPart(out,mb=>{hdRev(mb,[[.017,-.001],[.017,.0015],[.014,.003],[.006,.0035]],28,MM.CHROME,0,TAU,true);hdCyl(mb,[0,0,0],[0,0,.024],.0035,.0035,12,MM.CHROME);},40,null,M4.basis(p,[1,0,0],[0,0,-1],up));
    hdPart(out,mb=>{const q=V3.add(p,[0,.018,0]),path=[];for(let k=0;k<=16;k++){const a=k/16*PI*1.6;path.push(V3.add(q,[Math.cos(a)*.012-.006,Math.sin(a)*.006,s*.0]))}
      hdTube(mb,path,.0014,6,MM.CHROME,false,true);hdTube(mb,[V3.add(q,[-.018,-.004,0]),V3.add(q,[-.05,-.016,0]),V3.add(p,[-.07,.001,0])],.0008,5,HC.GB,false,true);},40);}
}
function wnWing(out,car){
  const K=HDK,D=K.D,X=K.X,L=D.L,CB=MM.CARBON,hw=.86,c=.34,yd=K.topY(L-.28,.42),yw=yd+.29,x=X(L-.44),th=.032,aoa=.2;
  /* the game's wing, its plates and its swan necks: off */
  hdDrop(car.body,(cc,m)=>m===MAT.CARBON&&D.uC-cc[0]>3.6&&cc[1]>yd-.1);
  /* the aerofoil, the game's section smoothed */
  const af=wnSpline([[0,0],[.04,-.45],[.15,-.85],[.35,-1],[.6,-.8],[.85,-.4],[1,0],[.8,.22],[.5,.4],[.2,.42],[.05,.25]],5,true);
  const Pw=(q,z)=>[x-q[0]*c,yw+q[1]*th+q[0]*c*Math.sin(aoa)*1.1,z];
  hdPart(out,mb=>{const A=af.map(q=>Pw(q,-hw)),B=af.map(q=>Pw(q,hw));hdLoft(mb,[A,B],CB,true);hdCap(mb,A,CB,true);hdCap(mb,B,CB,false);},55);
  /* the Gurney flap along its trailing edge */
  {const te=Pw([1,0],0);hdPart(out,mb=>{hdRBox(mb,[te[0]-.0015,te[1]+.012,0],[.0022,.0135,hw-.003],.0015,CB,2);},30);}
  for(const s of [1,-1]){
    /* the endplate */
    hdPart(out,mb=>{hdExtrude(mb,wnFillet([[x+.05,yw-.09],[x+.03,yw+.1],[x-c-.03,yw+.13],[x-c-.06,yw-.09]],.03),s*(hw+.006)-.005,s*(hw+.006)+.005,CB,.002,2);},40);
    /* the swan neck: up from the tail behind the wing, over its top and down onto it */
    const C=wnSpline([[L-.085,yd-.035],[L-.075,yw+.05],[L-.095,yw+.13],[L-.2,yw+.14],[L-.29,yw+.08],[L-.32,yw+.042]],8),wd=t=>.03-.01*t,
      left=[],right=[];
    for(let i=0;i<C.length;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(C.length-1,i+1)],t=[b[0]-a[0],b[1]-a[1]],l=Math.hypot(t[0],t[1])||1,nn=[-t[1]/l,t[0]/l],ww=wd(i/(C.length-1));
      left.push([X(C[i][0]+nn[0]*ww),C[i][1]+nn[1]*ww]);right.push([X(C[i][0]-nn[0]*ww),C[i][1]-nn[1]*ww]);}
    hdPart(out,mb=>{hdExtrude(mb,[...left,...right.reverse()],s*.42-.006,s*.42+.006,CB,.002,2);},40);
    /* its foot, bolted to the tail */
    {const u=L-.085,yf=K.topY(u,.42);hdPart(out,mb=>{hdRBox(mb,[X(u),yf+.003,s*.42],[.05,.004,.028],.003,CB,2);for(const du of [-.035,.035])for(const dz of [-.016,.016])ball(mb,[X(u+du),yf+.008,s*.42+dz],.004,8,HC.BOLT);},40);}
  }
}
function wnSkirts(out,car){
  const K=HDK,D=K.D,X=K.X,Y=y=>y+K.dy+D.B.chY,u0=D.uFa+D.arch.a+.1,u1=D.uRa-D.arch.a-.33,yc=Y(.34),CB=MM.CARBON,n=30;
  for(const s of [1,-1]){const rows=[];
    for(let i=0;i<=n;i++){const u=u0+(u1-u0)*i/n,e=sm01(Math.min(i,n-i)/3),zi=K.sideZ(u,yc+.03)-.012,zo=zi+.012+.048*e;
      rows.push([[zi,yc+.035],[zi+.03*e+.006,yc+.035],[zo,yc-.012],[zo,yc-.03],[zo-.006,yc-.035],[zi,yc-.035]].map(([z,y])=>[X(u),y,s*z]));}
    hdPart(out,mb=>{hdLoft(mb,rows,CB,true,s<0);hdCap(mb,rows[0],CB,s>0);hdCap(mb,rows[n],CB,s<0);},40);}
}
function wnGlow(out,car){
  const K=HDK,D=K.D,X=K.X,u0=D.uFa+D.arch.a+.08,u1=D.uRa-D.arch.a-.08,GL=SV(lin(car.b.paint2||'#18e0ff'),MAT.UNDERGLOW),RUB=SV([.02,.02,.022],MAT.RUBBER),r=.011;
  const tube=(a,b,yFloor)=>{const d=V3.norm(V3.sub(b,a)),L0=V3.len?V3.len(V3.sub(b,a)):Math.hypot(...V3.sub(b,a));
    hdPart(out,mb=>{hdCyl(mb,a,b,r,r,16,GL);},40);
    hdPart(out,mb=>{for(const [p,q] of [[a,V3.add(a,V3.mul(d,-.018))],[b,V3.add(b,V3.mul(d,.018))]])hdCyl(mb,V3.add(p,V3.mul(d,V3.dot(V3.sub(q,p),d)>0?-.002:.002)),q,r+.002,r+.002,16,RUB);},40);
    /* the clips, up to the floor, every 30 cm or so */
    const nc=Math.max(2,Math.round(L0/.3));
    hdPart(out,mb=>{for(let k=0;k<=nc;k++){const p=V3.lerp(a,b,.04+.92*k/nc);hdRBox(mb,[p[0],p[1]+.004,p[2]],[Math.abs(d[0])>.5?.006:r+.003,r+.003,Math.abs(d[0])>.5?r+.003:.006],.003,RUB,2);
      hdRBox(mb,[p[0],(p[1]+yFloor)/2+.006,p[2]],[Math.abs(d[0])>.5?.006:.003,(yFloor-p[1])/2,Math.abs(d[0])>.5?.003:.006],.001,HC.GB,1);}},35);
    /* the wire, from the far end's cap up into the floor */
    hdPart(out,mb=>{const q=V3.add(b,V3.mul(d,.018));hdTube(mb,[q,V3.add(q,V3.mul(d,.02)),[q[0]+d[0]*.03,yFloor+.01,q[2]+d[2]*.03]],.0025,6,HC.GB,false,true);},40);};
  const y=D.sill(2)-.025,z=D.plan(2)*.8;
  for(const s of [1,-1])tube([X(u0),y,s*z],[X(u1),y,s*z],D.sill(2));
  tube([X(.25),D.sill(.25)-.02,-.4],[X(.25),D.sill(.25)-.02,.4],D.sill(.25));
}
