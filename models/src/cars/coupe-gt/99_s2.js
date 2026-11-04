/* =====================================================================================
   THE COUPE GT'S STUDIO 2 (KIT.setAlt('2') picks HD_CARS.coupeGT2 for the build 'coupeGT'): its Studio car (80 to 86
   here) with the rest of it built from the Coupe's Studio 2 (cars/coupe 90 to 93), as the game gives both cars the same
   chassis and engine:
   - the underside and the engine bay are the Coupe's, built for the Coupe's height and then set down with the GT's
     body (cg2Low: the body's heights seen as the Coupe's while they are built, the whole moved down after), the
     suspension's outer ends carried out to the GT's wider track and up to its wheels' centres (cg2Track); its own
     side pipes off the right bank, along inside the sill to the game's two exits ahead of the rear wheel, beside the
     Coupe's quads; the diffuser and the valance are the underside's (the tail's own diffuser left off);
   - the cabin caged, harnessed, its cut-off, extinguisher and window net (95); outside the cut-off's pull, the tow
     straps, the glass's seals (no plates, badges, markers, sensors or aerial: a race car's).
   ===================================================================================== */
/* (build f with the body's heights seen DY higher, the Coupe's: for the bay the hood's surface (read short of its edge,
   where the GT's flared fender rises past it) and the arches; for the underside the sections and the skin (taken off
   the body as the body is, then seen as the Coupe's). Returns what f built and the skin's own MB, so the caller can
   set the rest down by DY. The two are kept apart: the hood's surface is read through the sections, and remembers
   what it reads.) */
function cg2Low(DY,f,under){const D=HDK.D,tY=D.topY,aY=archY,sK=secKeys,hU=hdUnder,hz=D.hood.hz;let skin=null;
  if(!under){D.topY=(u,z)=>tY(u,Math.min(Math.abs(z),hz(clamp(u,D.hood.u0,D.hood.u1))-.05))-DY;archY=(D2,u)=>{const y=aY(D2,u);return y<0?y:y-DY;};}
  else{secKeys=(D2,u)=>{const r=sK(D2,u);return Object.assign({},r,{P:r.P.map(([z,y])=>[z,y-DY])});};
    hdUnder=c=>{const w=secKeys;secKeys=sK;let s;try{s=hU(c);}finally{secKeys=w;}xformMB(s,M4T(0,-DY,0));skin=s;return s;};}
  try{return {r:f(),skin};}finally{D.topY=tY;archY=aY;secKeys=sK;hdUnder=hU;}}
/* (the suspension's outer ends out to the GT's track and up to its wheels: every point near an axle, past the cradle's
   pivots and below the towers, moved out by DT and up by DR, eased in between; from the vertex 'from' on) */
function cg2Track(mb,from,DT,DR){const D=HDK.D,p=mb.p;
  for(let i=from;i<p.length;i+=3){const u=D.uC-p[i],y=p[i+1],z=p[i+2],az=Math.abs(z);let fu=0;
    for(const ua of [D.uFa,D.uRa]){const du=u-ua;fu=Math.max(fu,sm01((du+.22)/.06)*sm01((.26-du)/.06));}
    const w=fu*sm01((az-.45)/.21)*(1-sm01((y-.56)/.1));if(w<=0)continue;p[i+1]=y+DR*w;p[i+2]=z+Math.sign(z)*DT*w;}}
HD_CARS.coupeGT2={
  skip:Object.assign({},HD_CARS.coupeGT.skip,{REARS:['coupeDiff']}),
  noGame:{under:1,exhaust:1},
  build(out){
    const b=out.b,lk=b.look,D=out.D,DY=D.dy,G=D.G;
    const W=cgWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    {const ar=new MB(),sk=cgSkinSnap(out);hdArches(ar,out);cgSkinBack(out,sk);cgDropFlare(out);out.hd.arches=ar;}
    {const fl=new MB();hdFlares(fl);cgFlareBolts(fl,out);out.hd.flares=fl;}
    {const f=new MB();cgFace(f,out);out.hd.face=f;}
    {const t=new MB();cpTail(t,out,{noDiff:1});out.hd.tail=t;}
    {const h=new MB();cgHood(h,out);cpBonnetBits(h,out);out.hd.hood=h;}
    {const c=new MB();cg2Cabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrorsRace(t,out);hdWipers(t,out);cgWing(t,out);cgSkirts(t,out);cgRaceKit(t,out);out.hd.trim=t;}
    {const x=new MB();cg2Bits(x,out);out.hd.extras=x;}
    /* the bay and the underside, the Coupe's, set down with the body */
    const bay=cg2Low(DY,()=>cpBay2(out)).r;for(const m of [bay.bay,bay.engine,bay.liner])if(m&&m.p)xformMB(m,M4T(0,DY,0));
    /* (the pad and the frame under the bonnet kept under its skin, where the GT's louvres and fender edges dip) */
    /* (and down under the louvres' pockets, 84 cgHood's outlines, so the frame doesn't show through them) */
    {const H=D.hood,p=bay.liner.p,vo=D.B.fit.ventU||0;for(let i=0;i<p.length;i+=3){const u=D.uC-p[i];if(u<H.u0||u>H.u1)continue;const az=Math.abs(p[i+2]),z=Math.min(az,H.hz(u));
      const inV=u>.68+vo&&u<1.27+vo&&az>.2&&az<.6;p[i+1]=Math.min(p[i+1],D.topY(u,z)-(inV?.062:az>.5?.04:.006));}}
    const U0=cg2Low(DY,()=>cpUnder(out),1),U=U0.r,ns=U0.skin?U0.skin.p.length:0;
    cg2Track(U,ns,lk.track/2-.82,(lk.tyre.R-.35)-DY);xformMB(U,M4T(0,DY,0));for(const t of D.tips)t.p=V3.add(t.p,[0,DY,0]);
    out.bay=bay;out.under=U;cg2SidePipes(U,out);
    hdPut(out.under,out.bay.bay);out.bay.bay=new MB();if(!HD_KEEP_ENGINE){hdPut(out.under,out.bay.engine);out.bay.engine=new MB();}
  },
  views:HD_CARS.coupeGT.views
};
/* the side pipes: a branch off the right bank's pipe after its catalyst, out under the floor to inside the right sill,
   back along it and split in two out through the sill to the game's exits, ahead of the rear wheel; the tips first in
   D.tips, as the game lists them, the quads after */
function cg2SidePipes(U,car){
  const K=HDK,D=K.D,X=K.X,dy=D.dy,F=D.B.fit,Pt=(u,y,z)=>[X(u),y,z],EXH=SMC('#a29e96',SM.SATIN),STEEL=SMC('#2a2b2e',SM.ENGINE),RB=SV([.02,.02,.021],MAT.RUBBER);
  const TUBE=(pts,rr)=>hdPart(U,mb=>{hdTube(mb,suvPath(pts,5,2),rr,14,EXH,false,true);},40);
  const yl=.17+dy,uo=k=>D.uRa-D.arch.a-.18+k,yo=u=>F.sideExY!=null?D.sill(u)+F.sideExY:.36+dy+F.rdy,zo=F.sideEx||.86,side=[];
  TUBE([Pt(1.95,.205+dy,.26),Pt(2.05,yl,.36),Pt(2.25,yl,.6),Pt(2.8,yl,.64)],.027);
  for(const k of [-.09,.09]){const ua=uo(k),ya=yo(ua),c=Pt(ua,ya,zo),d0=[0,-.15,1],bw=V3.add(c,V3.mul(d0,.1)),d=V3.norm(d0);
    TUBE([Pt(2.8,yl,.64),Pt(ua-.14,yl,.66),Pt(ua-.03,(yl+ya)/2,.68),Pt(ua,ya,.74),c],.025);
    cpRev(U,V3.add(c,V3.mul(d,-.03)),bw,[[.03,0],[.042,.012],[.046,.02],[.046,.124],[.042,.13],[.038,.126],[.038,.03]],MM.CHROME,32,40);
    cpRev(U,V3.add(bw,V3.mul(d,-.06)),V3.add(bw,V3.mul(d,-.004)),[[0,0],[.036,0],[.036,.056]],SMC('#151515',SM.CAST),20,40);side.push({p:bw,d,r:.046});}
  /* the hangers off the floor */
  for(const u of [2.3,2.75])hdPart(U,mb=>{const c=Pt(u,yl+.025,.62),t=V3.add(c,[0,.02,0]);hdCyl(mb,c,t,.005,.005,8,STEEL);hdCyl(mb,V3.add(t,[-.014,0,0]),V3.add(t,[.014,0,0]),.016,.016,14,RB);},30);
  D.tips=[...side,...D.tips];
}
