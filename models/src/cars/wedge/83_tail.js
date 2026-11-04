/* =====================================================================================
   THE WEDGE'S TAIL, IN THREE DIMENSIONS (in place of 35_wedge TAILS.wedge's decals), on the decals' own outlines,
   across the cut-off tail:
   - The black panel from side to side, the paint cut away behind it, a thin raised edge round it.
   - Two square lamps each side set in it: each a deep cavity with a reflector and bulbs under its lens, the inner
     one's foot an amber indicator, a black divider between; the narrow reversing lamp inboard of them.
   - The five mesh vents across the middle: slots with a black honeycomb set back in them.
   - The plate below the panel, in a shallow recess, two small lamps over it.
   (The diffuser is the shared one, 79_parts hdDiffuser, without the reversing lamps the game puts in the panel.)
   ===================================================================================== */
function wdTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body],PANEL=SMC('#0d0d0e',SM.GLOSSBLK);
  const Pn=wdRR(-.92,.92,Y(.56),Y(.84),.012);for(const c of cuts)hdCut(c,'R',Pn,.03);
  const lamps=[],vents=[];
  for(const s of [1,-1]){lamps.push({P:wdRR(s*.36,s*.6,Y(.6),Y(.8),.01),s,inner:1},{P:wdRR(s*.64,s*.88,Y(.6),Y(.8),.01),s,inner:0},{P:wdRR(s*.3,s*.34,Y(.6),Y(.8),.004),s,rev:1});}
  for(let k=0;k<5;k++)vents.push(wdRR(-.3,.3,Y(.585+k*.05),Y(.605+k*.05),.003));
  /* ---------- the panel, open where the lamps and vents are ---------- */
  hdPart(out,mb=>{wdHoled(mb,Pn,[...lamps.map(l=>l.P),...vents],.012,(z,y)=>hdS('R',z,y,-.0006),PANEL,[-1,0,0]);},30);
  {const E=hdResample(Pn,.012);hdTrim(out,'R',E,.006,.0028,HC.GB,true,50,.0004);
    /* (the paint's cut edge: a short wall from the skin back to the panel) */
    hdPart(out,mb=>{hdLoft(mb,[E.map(([z,y])=>hdS('R',z,y,.0004)),E.map(([z,y])=>hdS('R',z,y,-.002))],HC.GB,true);},30);}
  /* ---------- the lamps ---------- */
  for(const l of lamps){const s=l.s,[z0,z1]=[Math.min(...l.P.map(p=>p[0])),Math.max(...l.P.map(p=>p[0]))];
    if(l.rev){hdLampUnit(out,'R',l.P,[],{deep:.03,k:.8,wall:HC.GB,back:()=>HC.REFLC,bulge:.0012,cell:.003,lens:()=>HC.LENSR,seal:false,tol:.04,
      inside:o=>{hdPart(o,mb=>{for(const y of [.65,.75])ball(mb,hdS('R',s*.32,Y(y),-.02),.005,10,HC.BULB);},50);}});continue;}
    hdLampUnit(out,'R',l.P,[],{deep:.05,k:.9,wall:HC.GB,back:()=>HC.REFLC,bulge:.002,cell:.006,lens:(z,y)=>l.inner&&y<Y(.642)?HC.AMBERL:HC.REDL,seal:false,tol:.04,
      inside:o=>{const zm=(z0+z1)/2;
        hdPart(o,mb=>{for(const dz of [-.06,0,.06])ball(mb,hdS('R',zm+dz,Y(.72),-.032),.007,12,HC.BULB);if(l.inner)for(const dz of [-.05,.05])ball(mb,hdS('R',zm+dz,Y(.62),-.03),.006,10,HC.BULB);},50);
        /* (the inner lamp's divider over the amber) */
        if(l.inner){const pts=[];for(let z=z0+.006;z<=z1-.006+1e-6;z+=.02)pts.push(hdS('R',z,Y(.643),-.004));hdPart(o,mb=>{hdSweep(mb,pts,[[-.004,-.0025],[.03,-.0025],[.03,.0025],[-.004,.0025]],HC.GB,[0,1,0],true,true);},30);}
        /* the lens's ribs, fine lines across it */
        hdPart(o,mb=>{for(let y=.62;y<.795;y+=.025){if(l.inner&&Math.abs(y-.643)<.01)continue;const pts=[];for(let z=z0+.008;z<=z1-.008+1e-6;z+=.03)pts.push(hdS('R',z,Y(y),-.0006));
          hdSweep(mb,pts,[[-.0012,-.0012],[.0012,-.0012],[.0012,.0012],[-.0012,.0012]],l.inner&&y<.642?HC.AMBERL:HC.REDL,[0,1,0],true,true);}},30);}});}
  /* ---------- the vents ---------- */
  for(const V0 of vents){hdRecess(out,'R',V0,.035,.97,HC.GB,()=>HC.GB);hdHoney(out,"R",hdShrink(V0,.985),.012,.011,.0012,.008,HC.HONEY);}
  /* ---------- the plate ---------- */
  {const R0=wdRR(-.205,.205,Y(.415),Y(.525),.012);for(const c of cuts)hdCut(c,'R',R0);hdRecess(out,'R',R0,.016,.985,SV([1,1,1],MAT.PAINT),()=>SV([1,1,1],MAT.PAINT),4);
    const P=hdResample(wdRR(-.19,.19,Y(.425),Y(.515),.008),.01);
    hdPart(out,mb=>{const F=P.map(([z,y])=>hdS('R',z,y,-.012)),B=P.map(([z,y])=>hdS('R',z,y,-.0155));hdCap(mb,F,SV([1,1,1],MAT.PLATE),false);hdLoft(mb,[F,B],SV([1,1,1],MAT.PLATE),true);},20);
    for(const z of [-.12,.12])hdPart(out,mb=>{hdRBox(mb,hdS('R',z,Y(.537),-.002),[.004,.004,.022],.003,HC.LENS,2);},40);}
}
