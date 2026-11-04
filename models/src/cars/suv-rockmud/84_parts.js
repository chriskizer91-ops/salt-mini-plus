/* =====================================================================================
   THE ROCK & MUD'S BOLT-ONS, in place of 23_parts' EXTRAS, where the game puts them:
   - The rock sliders (sliders): a black tube along each rocker, its ends kicked up and in toward the arches in smooth
     bends, three legs back to the frame, each on a bolted plate.
   - The snorkel (snorkel): a black tube up the right A-pillar from the fender, bent round the windshield's edge,
     clamped to the pillar on two brackets, the ram head on top facing forward behind a mesh.
   - The ditch lights (ditch): a round lamp on a short post on each cowl corner, its housing, bezel and clear lens.
   - The mud flaps (flaps): a rubber flap behind each wheel on a bolted bar.
   ===================================================================================== */
/* (a smooth path through a few points: Catmull-Rom, k steps a span) */
function cwSpline(P,k=8){const o=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let j=0;j<k;j++){const t=j/k,t2=t*t,t3=t2*t;o.push([0,1,2].map(a=>.5*(2*p1[a]+(-p0[a]+p2[a])*t+(2*p0[a]-5*p1[a]+4*p2[a]-p3[a])*t2+(-p0[a]+3*p1[a]-3*p2[a]+p3[a])*t3)));}}
  o.push(P[P.length-1]);return o;}
function cwSliders(out,car){
  const K=HDK,D=K.D,X=K.X,Y=y=>y+K.dy+D.B.chY,u0=D.uFa+D.arch.a+.06,u1=D.uRa-D.arch.a-.06,z=D.B.fit.sideZ||.99,B=SMC('#141416',SM.PAINTED);
  for(const s of [1,-1]){
    hdPart(out,mb=>{const P=cwSpline([[X(u0-.06),Y(.5),s*.86],[X(u0-.01),Y(.44),s*(z-.02)],[X(u0+.06),Y(.43),s*z],[X((u0+u1)/2),Y(.43),s*z],[X(u1-.06),Y(.43),s*z],[X(u1+.01),Y(.44),s*(z-.02)],[X(u1+.06),Y(.5),s*.86]],10);
      hdTube(mb,P,.032,18,B,false,true);},40);
    for(const u of [u0+.05,(u0+u1)/2,u1-.05])hdPart(out,mb=>{hdTube(mb,[[X(u),Y(.43),s*(z-.02)],[X(u),Y(.415),s*.75],[X(u),Y(.4),s*.58]],.024,14,B,false,true);
      hdRBox(mb,[X(u),Y(.4),s*.57],[.05,.04,.008],.006,B,2);for(const dx of [-.03,.03])hdCyl(mb,[X(u)+dx,Y(.4),s*.56],[X(u)+dx,Y(.4),s*.552],.008,.007,6,HC.BOLT);},40);}
}
function cwSnorkel(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,z0=.97,B=SMC('#141416',SM.PLASTIC);
  const k1=secKeys(D,1.35),k2=secKeys(D,G.cowl+.05),ua=G.cowl+.08,P=[[X(1.35),k1.yB-.08,z0],[X(1.62),k2.yB+.02,z0-.005]];
  for(let t=0;t<=1.001;t+=.25){const u=ua+(G.rf-.05-ua)*t,k=secKeys(D,u);P.push([X(u),k.P[10][1]+.01,k.P[10][0]+.08]);}
  const top=P[P.length-1];P.push([top[0],top[1]+.12,top[2]-.01]);
  const path=cwSpline(P,8);
  hdPart(out,mb=>{hdTube(mb,path,.05,20,B,false,true);},40);
  /* where it leaves the fender, a flange */
  hdPart(out,mb=>{const a=path[0],b=path[1],d=V3.norm(V3.sub(b,a));hdCyl(mb,V3.add(a,V3.mul(d,-.004)),V3.add(a,V3.mul(d,.012)),.064,.06,24,B);},40);
  /* the brackets to the pillar */
  for(const t of [.45,.75]){const i=Math.round(t*(path.length-1)),p=path[i],u=D.uC-p[0],k=secKeys(D,u),q=[p[0],k.P[10][1],k.P[10][0]];
    hdPart(out,mb=>{hdTube(mb,[p,V3.lerp(p,q,.5),q],.008,8,B,false,true);hdTube(mb,(()=>{const r=[];const d=V3.norm(V3.sub(path[Math.min(path.length-1,i+1)],path[Math.max(0,i-1)])),up=V3.norm(V3.cross(d,[0,0,1])),sd=V3.cross(d,up);
      for(let j=0;j<=24;j++){const a=j/24*TAU;r.push(V3.add(p,V3.add(V3.mul(up,Math.cos(a)*.054),V3.mul(sd,Math.sin(a)*.054))));}return r;})(),.005,6,HC.BOLT,true,false);},40);}
  /* the ram head: a rounded box facing forward, its mouth behind a mesh, a lip over it against the rain */
  {const c=[top[0]+.03,top[1]+.17,top[2]-.01];
    hdPart(out,mb=>{hdRBox(mb,c,[.1,.06,.06],.03,B,5);hdCyl(mb,[c[0]-.04,c[1]-.08,c[2]],[c[0]-.04,c[1]-.02,c[2]],.05,.05,20,B,false);},40);
    hdPart(out,mb=>{hdRBox(mb,[c[0]+.1,c[1]-.005,c[2]],[.006,.04,.045],.012,HC.GB,3);for(let k=-4;k<=4;k++)hdCyl(mb,[c[0]+.107,c[1]-.045,c[2]+k*.009],[c[0]+.107,c[1]+.035,c[2]+k*.009],.0012,.0012,4,HC.HONEY,false);
      for(let k=-4;k<=3;k++)hdCyl(mb,[c[0]+.107,c[1]-.005+k*.01,c[2]-.042],[c[0]+.107,c[1]-.005+k*.01,c[2]+.042],.0012,.0012,4,HC.HONEY,false);
      hdRBox(mb,[c[0]+.1,c[1]+.052,c[2]],[.025,.006,.058],.004,B,2);},40);}
}
function cwDitch(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,k=secKeys(D,G.cowl-.02),B=SMC('#141416',SM.PAINTED);
  for(const s of [1,-1]){const c=[X(G.cowl-.04),k.yB+.08,s*(k.hs-.05)];
    hdPart(out,mb=>{hdCyl(mb,[c[0],c[1]-.08,c[2]],[c[0],c[1]-.02,c[2]],.012,.012,12,B);hdRBox(mb,[c[0],c[1]-.082,c[2]],[.03,.004,.02],.003,B,2);
      hdRBox(mb,[c[0],c[1]-.015,c[2]],[.012,.01,.03],.004,B,2);for(const e of [-1,1])hdCyl(mb,[c[0],c[1]+.02,c[2]+e*.052],[c[0],c[1]+.02,c[2]+e*.058],.008,.008,10,HC.BOLT);},40);
    /* the housing: a short drum, rounded at the back, the bezel and the lens at the front */
    const h=[c[0],c[1]+.02,c[2]];
    hdPart(out,mb=>{hdRev(mb,[[0,-.035],[.03,-.034],[.045,-.025],[.05,-.01],[.05,.04],[.054,.046],[.054,.05],[.046,.052]],32,B,0,TAU,true);},40,null,M4.basis(h,[0,1,0],[0,0,1],[1,0,0]));
    hdPart(out,mb=>{hdRev(mb,[[.046,.04],[.04,.03],[.02,.022],[0,.02]],32,HC.REFLC,0,TAU,true);ball(mb,[0,0,.03],.008,12,HC.LAMPH);},45,null,M4.basis(h,[0,1,0],[0,0,1],[1,0,0]));
    hdPart(out,mb=>{hdRev(mb,[[.047,.05],[.035,.054],[.018,.056],[0,.057]],32,HC.LENSH,0,TAU,true);},45,null,M4.basis(h,[0,1,0],[0,0,1],[1,0,0]));}
}
function cwFlaps(out,car){
  const K=HDK,D=K.D,X=K.X,RUB=SMC('#141414',MAT.RUBBER),B=SMC('#141416',SM.PAINTED);
  for(const ua of [D.uFa,D.uRa])for(const s of [1,-1]){const u=ua+D.arch.a+.04,z=K.sideZ(u,D.arch.cy)*.9,c=[X(u),D.arch.cy-.14,s*z];
    hdPart(out,mb=>{hdRBox(mb,c,[.006,.16,.13],.004,RUB,2);for(let k=-3;k<=3;k++)hdRBox(mb,[c[0]-.006,c[1]-.06,c[2]+k*.03],[.002,.08,.006],.002,RUB,1);},35);
    hdPart(out,mb=>{hdRBox(mb,[c[0]+.004,c[1]+.15,c[2]],[.008,.012,.135],.003,B,2);for(const dz of [-.09,0,.09])hdCyl(mb,[c[0]-.002,c[1]+.15,c[2]+dz],[c[0]-.008,c[1]+.15,c[2]+dz],.007,.006,6,HC.BOLT);},40);}
}
/* the rest of the game's flare, which 73_arch hdArches leaves on (it takes off what stands up to 6 cm out of the side,
   and these flares stand out further): every triangle round an arch standing between 5.5 cm and the flare's own
   reach out of the side, its bolts with it */
function cwFlareDrop(car){
  const K=HDK,D=K.D,F=D.look.flares;if(!F)return;
  for(const src of [car.body,car.hide])if(src&&src.p)hdDrop(src,(c,m,cl,V)=>{if(m===MAT.GLASS||m===MAT.GLASSL||c[1]<D.arch.cy-.06)return false;const u=D.uC-c[0];
    for(const ua of [D.uFa,D.uRa]){const Ar=ua===D.uRa?D.archB:D.arch;if(Math.abs(u-ua)>Ar.a+F.w+.05||Math.hypot(u-ua,c[1]-Ar.cy)>Math.max(Ar.a,Ar.b)+F.w+.08)continue;
      const off=Math.max(...V.map(hdOff));if(off>.055&&off<F.out+.04)return true;}return false;});
}
