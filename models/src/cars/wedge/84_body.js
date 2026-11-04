/* =====================================================================================
   THE WEDGE'S FLANK INTAKES AND ENGINE DECK, IN THREE DIMENSIONS (in place of 35_wedge FACES.wedge's decals for
   them), on the decals' own outlines:
   - The intakes ahead of the rear wheels: each a big mouth let into the hip, going well in, its back the radiator's
     black core; three body-colour fins across it, each a blade from the skin into the mouth, sloping with it.
   - The engine deck from the rear glass to the tail: a black louvred cover let into the body, a shut gap round it;
     twelve slots across it, each with its blade leaning back, the walls of the slots the cover's thickness, so the
     V12 (86_engine) shows between them.
   ===================================================================================== */
function wdIntakes(out,car){
  const K=HDK,D=K.D,G=D.G,dy=K.dy,Y=y=>y+dy,u0=G.cB+.1,u1=D.uRa-D.arch.a-.06,PA=SV([1,1,1],MAT.PAINT),DEEP=.13;
  const P=[[u0,Y(.47)],[u1,Y(.42)],[u1+.04,Y(.79)],[u0+.14,Y(.74)]];
  for(const s of [1,-1]){
    hdCutSide(car.body,s,P,.02);
    const R=hdResample(P,.006),c=hdCen(R),sh=(u,y,k)=>[c[0]+(u-c[0])*k,c[1]+(y-c[1])*k];
    /* the mouth's walls going in, the radiator's core at its back */
    hdPart(out,mb=>{const F=R.map(([u,y])=>hdSS(s,u,y,-.0005)),M=R.map(([u,y])=>{const q=sh(u,y,.975);return hdSS(s,q[0],q[1],-.025);}),B=R.map(([u,y])=>{const q=sh(u,y,.86);return hdSS(s,q[0],q[1],-DEEP);});
      hdLoft(mb,[F,M,B],HC.GB,true);hdCap(mb,B,HC.HONEY,s<0);},30);
    /* the core's fins, upright behind the mouth */
    hdPart(out,mb=>{let a=1e9,b=-1e9;for(const [u] of R){a=Math.min(a,u);b=Math.max(b,u);}const cu=c[0];
      for(let u=cu-(cu-a)*.8;u<cu+(b-cu)*.8;u+=.012){const ya=Y(.47)+(Y(.42)-Y(.47))*(u-u0)/(u1-u0),yb=Y(.74)+(Y(.79)-Y(.74))*(u-u0-.14)/(u1+.04-u0-.14),q0=sh(u,ya,.84),q1=sh(u,yb,.84);
        mb.quad(hdSS(s,q0[0],q0[1],-DEEP+.002),hdSS(s,q1[0],q1[1],-DEEP+.002),hdSS(s,q1[0],q1[1],-DEEP+.018),hdSS(s,q0[0],q0[1],-DEEP+.018),HC.CAST[0],0,HC.CAST[2]);}},20);
    /* the three fins */
    for(const y of [.53,.6,.67]){const a=[u0+.06,Y(y)],b=[u1+.01,Y(y-.02)],n=18,rings=[];
      for(let i=0;i<=n;i++){const f=.01+.98*i/n,uo=a[0]+(b[0]-a[0])*f,yo=a[1]+(b[1]-a[1])*f,ui=c[0]+(uo-c[0])*.9;
        rings.push([hdSS(s,uo,yo+.014,-.002),hdSS(s,uo,yo+.007,0),hdSS(s,uo,yo-.007,0),hdSS(s,uo,yo-.014,-.002),hdSS(s,ui,yo-.006,-.1),hdSS(s,ui,yo+.006,-.1)]);}
      hdPart(out,mb=>{hdLoft(mb,rings,PA,true,s<0);hdCap(mb,rings[0],PA,s>0);hdCap(mb,rings[n],PA,s<0);},35);}
  }
}
function wdDeck(out,car){
  const K=HDK,D=K.D,G=D.G,L=D.L,u0=G.be+.18,u1=L-.32,zw=.56,COVER=SMC('#141416',SM.SATIN),TH=.012;
  const Pd=wdRR(u0,u1,-zw,zw,.03);hdCutTop(car.body,Pd,.03);
  /* the shut gap: a black wall from the body's cut edge down */
  {const R=hdResample(Pd,.006);hdPart(out,mb=>{hdLoft(mb,[R.map(([u,z])=>hdTS(u,z,.0005)),R.map(([u,z])=>hdTS(u,z,-.04))],HC.GB,true);},30);}
  /* the cover, a little below the body's skin, its slots cut through it */
  const Pc=wdRR(u0+.005,u1-.005,-zw+.005,zw-.005,.026),slots=[];for(let u=G.be+.22;u<L-.36;u+=.085)slots.push([u,u+.045]);
  const SL=slots.map(([a,b])=>wdRR(a,b,-.53,.53,.006));
  hdPart(out,mb=>{wdHoled(mb,Pc,SL,.02,(u,z)=>hdTS(u,z,-.003),COVER,[0,1,0]);},30);
  /* its edge: the cover's thickness turned down */
  {const R=hdResample(Pc,.006);hdPart(out,mb=>{hdLoft(mb,[R.map(([u,z])=>hdTS(u,z,-.003)),R.map(([u,z])=>hdTS(u,z,-.003-TH))],COVER,true,true);},30);}
  /* each slot: its walls, the blade leaning back from the slot's rear edge, down and forward */
  for(let i=0;i<slots.length;i++){const [a,b]=slots[i],R=hdResample(SL[i],.006);
    hdPart(out,mb=>{hdLoft(mb,[R.map(([u,z])=>hdTS(u,z,-.003)),R.map(([u,z])=>hdTS(u,z,-.003-TH))],COVER,true);},30);
    hdPart(out,mb=>{const rows=[];for(let z=-.525;z<=.5251;z+=.035){const t=hdTS(b-.002,z,-.004),f=hdTS(a+.016,z,-.034);rows.push([t,f,V3.add(f,[0,-.004,0]),V3.add(t,[-.005,-.004,0])]);}
      hdLoft(mb,rows,COVER,true);hdCap(mb,rows[0],COVER,true);hdCap(mb,rows[rows.length-1],COVER,false);},30);}
}
