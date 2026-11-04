/* =====================================================================================
   THE RACE'S OWN PARTS FOR ITS STUDIO 2:
   - The hood vents open (in place of 84 rcVents' pockets): the same two outlines cut through the hood, a short wall
     down round each, the carbon louvres across, the bay showing through; the hood pins as 84 has them.
   - The aero's mounts, on the underside: the carbon undertray from the splitter's back edge to the front
     crossmember, its strakes and its fasteners; the splitter's two rods from its top up to the bumper, adjustable,
     on rod ends; two brackets from the diffuser's top up to the frame's last crossmember (its rails stop short of
     the diffuser, 99 railEnd).
   - The master cut-off's outside pull at the base of the windshield, its spark sticker.
   ===================================================================================== */
function rcVents2(out,car){
  const K=HDK,D=K.D,X=K.X,o=D.B.fit.ventU||0,CF=SV([1,1,1],MAT.CARBON);
  for(const s of [1,-1]){const P=[[.7+o,s*.22],[1.25+o,s*.24],[1.25+o,s*.58],[.7+o,s*.52]],R=hdResample(P,.006),c=hdCen(R);
    hdCutTop(car.hood,P,.03);
    /* the wall: from the skin down 3 cm, no floor */
    hdPart(out,mb=>{const F=R.map(([u,z])=>hdTS(u,z,.0005)),B=R.map(([u,z])=>hdTS(c[0]+(u-c[0])*.985,c[1]+(z-c[1])*.985,-.03));hdLoft(mb,[F,B],HC.GB,true);hdLoft(mb,[F,B],HC.GB,true,true);},30);
    /* the louvres (as 79_parts hdVentTop lays them) */
    let u0=1e9,u1=-1e9;for(const [u] of P){u0=Math.min(u0,u);u1=Math.max(u1,u);}
    const span=u=>{let a=1e9,b=-1e9;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];if((p[0]-u)*(q[0]-u)>0)continue;const t=Math.abs(q[0]-p[0])<1e-9?0:(u-p[0])/(q[0]-p[0]),z=p[1]+(q[1]-p[1])*t;a=Math.min(a,z);b=Math.max(b,z);}return [a,b];};
    hdPart(out,mb=>{for(let u=u0+.055*.6;u<u1-.055*.4;u+=.055){const [a,b]=span(u);if(b-a<.02)continue;const path=[];for(let z=a+.004;z<=b-.004+1e-6;z+=.02)path.push(hdTS(u,z,-.004));if(path.length<2)path.push(hdTS(u,b-.004,-.004));
      hdSweep(mb,path,[[-.002,-.012],[.002,-.012],[.003,.0],[-.001,.0]],CF,[.4,1,0],true,true);}},35);
    /* the hood pin (84's) */
    if(D.look.hoodPins!==false){const p=hdTS(.255,s*.6,0);
      hdPart(out,mb=>{hdCyl(mb,p,V3.add(p,[0,.02,0]),.006,.006,12,MM.CHROME);hdCyl(mb,V3.add(p,[-.012,.016,0]),V3.add(p,[.012,.016,0]),.0025,.0025,8,MM.CHROME);
        const r=[];for(let k=0;k<=20;k++){const a=k/20*TAU;r.push([p[0]+.018+Math.cos(a)*.008,p[1]+.004,p[2]+Math.sin(a)*.008]);}hdTube(mb,r,.0015,6,MM.CHROME,true,false);},45);
      hdPart(out,mb=>{hdRev(mb,[[.016,0],[.016,.002],[.012,.003]],24,MM.CHROME,0,TAU,true);},45,null,M4.basis(p,[1,0,0],[0,0,-1],[0,1,0]));}}
}
function rcUnder2(U,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,L=D.L,yb=y=>y+dy,Y=y=>y+dy+D.B.fit.fdy,CF=SV([1,1,1],MAT.CARBON),ALU=SMC('#b9bcc1',SM.BRUSH),STEEL=SMC('#2a2b2e',SM.ENGINE),
    P=(f,deg=35,M=null)=>hdPart(U,f,deg,null,M);
  /* ---------- the undertray: from the splitter's back edge (u .35, its underside) back to the front crossmember ---------- */
  {const ys=u=>yb(.3)+(Y(.4)-yb(.3))*sm01((.47-u)/.12),zt=.44;
    P(mb=>{const rows=[];for(let u=.35;u<=.82+1e-6;u+=.02){const row=[];for(let z=-zt;z<=zt+1e-6;z+=.022)row.push([X(u),ys(u),z]);rows.push(row);}hdLoft(mb,rows,CF,false,true);hdLoft(mb,rows,CF,false);},30);
    P(mb=>{for(const z of [-.3,-.15,0,.15,.3])hdRBox(mb,[X(.66),yb(.3)-.012,z],[.15,.012,.003],.002,CF,1);
      for(const [u,z] of [[.52,-.4],[.52,.4],[.8,-.4],[.8,.4],[.8,0],[.52,0]])cpHex(mb,[X(u),ys(u)-.001,z],[0,-1,0],.008,.004);},30);}
  /* ---------- the splitter's rods: from its top, ahead of the bumper, up to a bracket on the bumper ---------- */
  for(const s of [1,-1]){const z=s*.5,yt=Y(.4)+.018,a=[X(K.uFront(.5,yt+.05)-.07),yt,z],bTop=Y(.62),b=[X(K.uFront(.5,bTop))+.004,bTop,z],d=V3.norm(V3.sub(b,a));
    P(mb=>{hdCyl(mb,V3.add(a,V3.mul(d,.012)),V3.add(b,V3.mul(d,-.014)),.0055,.0055,10,ALU);for(const e of [a,b]){ball(mb,e,.009,12,ALU);hdRBox(mb,e,[.016,.004,.014],.003,STEEL,1);}
      const m=V3.lerp(a,b,.5);hdCyl(mb,V3.add(m,V3.mul(d,-.014)),V3.add(m,V3.mul(d,.014)),.0085,.0085,6,ALU);},40);}
  /* ---------- the diffuser's brackets: from its top up to the frame's last crossmember ---------- */
  {const x=X(L),Yd=y=>y+dy+D.B.fit.rdy,M=M4.basis([x+.25,Yd(.43),0],V3.norm([1,-.3,0]),V3.norm([.3,1,0]),[0,0,1]);
    for(const s of [1,-1]){const a=M4.xform(M,[.17,.01,s*.42]),b=[a[0],Math.max(a[1]+.02,yb(.455)-.032),s*.42];
      P(mb=>{hdRBox(mb,V3.lerp(a,b,.5),[.02,Math.abs(b[1]-a[1])/2+.006,.004],.003,ALU,2);for(const e of [a,b])cpHex(mb,V3.add(e,[0,0,s*.004]),[0,0,s],.006,.004);},30);}}
}
function rcKill2(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,u=G.cowl-.025,z=.66,y=K.topY(u,z),p=[X(u),y+.002,z];
  hdPart(out,mb=>{hdCyl(mb,p,V3.add(p,[0,.01,0]),.016,.016,18,HC.GB);hdCyl(mb,V3.add(p,[0,.01,0]),V3.add(p,[0,.03,0]),.004,.004,8,MM.CHROME);
    const ring=[];for(let k=0;k<=20;k++){const a=k/20*TAU;ring.push(V3.add(p,[Math.cos(a)*.014,.04+Math.sin(a)*.012,0]));}hdTube(mb,ring,.0035,8,SMC('#c41e1a',SM.PLASTIC),true,false);},40);
  hdPart(out,mb=>{hdExtrude(mb,[[-.02,-.016],[.02,-.016],[0,.02]],0,.0008,SMC('#1b5fd0',MAT.COL,.2),0,1,false);hdExtrude(mb,[[-.004,-.011],[.005,.0],[.0,.0],[.005,.012],[-.005,.001],[0,.001]],.0008,.0012,SMC('#e8e6df',MAT.COL,.3),0,1,false);},
    30,null,M4.basis([X(u+.005),K.topY(u+.005,z-.06)+.0015,z-.06],[0,0,1],[-1,0,0],[0,1,0]));
}
