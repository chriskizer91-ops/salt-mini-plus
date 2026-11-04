/* =====================================================================================
   THE ROCK & MUD'S TAIL, IN THREE DIMENSIONS (in place of 22_faces TAILS.back's decals), on the decals' own
   outlines, and its rear steel bumper (REARS.steel, where the game hangs its own):
   - The lamps: tall ones on the quarters, a chrome reflector behind a red lens with optic ribs, the reversing lamp
     and the amber signal at their foot under their own windows, a bulb behind each part.
   - The plate in its recess, a lamp either side above it.
   - The bumper: a plated steel bar across the tail, the hitch receiver under its middle with its pin, a bronze
     shackle a side in its tab, a red reflector in each end.
   ===================================================================================== */
function cwTail(out,car){
  const K=HDK,dy=K.dy,Y=y=>y+dy,cuts=[car.body];
  for(const s of [1,-1]){
    const L=[[.67,.92],[.875,.915],[.885,1.16],[.67,1.165]].map(([z,y])=>[s*z,Y(y)]),RV=RR2(s*.69,s*.865,Y(.93),Y(.975),.006),AM=RR2(s*.69,s*.865,Y(.985),Y(1.02),.006);
    hdLampUnit(out,'R',L,cuts,{deep:.06,k:.92,wall:HC.GB,back:()=>HC.REFLC,bulge:.003,cell:.004,lens:(z,y)=>hdIn(RV,z,y)?HC.LENSR:hdIn(AM,z,y)?HC.AMBERL:HC.REDL,
      inside:o=>{
        /* bulbs behind each part, the red's ribs across the reflector */
        hdPart(o,mb=>{for(const [z,y] of [[.78,.952],[.78,1.002],[.73,1.08],[.83,1.08]])ball(mb,hdS('R',s*z,Y(y),-.045),.007,12,HC.BULB);},50);
        hdPart(o,mb=>{for(let y=1.04;y<1.15;y+=.014){const a=hdS('R',s*.685,Y(y),-.05),b=hdS('R',s*.865,Y(y),-.05);hdCyl(mb,a,b,.0025,.0025,6,HC.REFLC,false);}},30);}});
    for(const P of [RV,AM])hdTrim(out,'R',hdResample(P,.006),.004,.003,HC.SEAL,true,50,.002);}
  /* ---------- the plate ---------- */
  {const pr=RR2(-.23,.23,Y(.855),Y(1.04),.03);for(const c of cuts)hdCut(c,'R',pr);
    hdRecess(out,'R',pr,.025,.98,SV([1,1,1],MAT.PAINT),()=>SV([1,1,1],MAT.PAINT),5);
    const pl=RR2(-.16,.16,Y(.875),Y(.955),.008);
    hdPart(out,mb=>{hdGrid(mb,'R',pl,()=>-.021,()=>SV([1,1,1],MAT.PLATE),.02);const P=hdResample(pl,.01);hdLoft(mb,[P.map(p=>hdS('R',p[0],p[1],-.021)),P.map(p=>hdS('R',p[0],p[1],-.025))],SV([1,1,1],MAT.PLATE),true);},20);
    hdTrim(out,'R',hdResample(RR2(-.155,.155,Y(.88),Y(.95),.006),.01),.004,.0015,SV([.05,.07,.18],MAT.COL),true,50,-.021);
    for(const z of [-.08,.08])hdPart(out,mb=>{hdRBox(mb,hdS('R',z,Y(1.028),-.02),[.012,.004,.02],.003,HC.LENS,2);},40);}
}
function cwBumperR(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,S=SMC('#1c1d1f',SM.PAINTED),x=X(D.L)-.06,BR=SMC('#a8783c',SM.PAINTED),BOLT=HC.BOLT;
  hdPart(out,mb=>{hdRBox(mb,[x,Y(.56),0],[.08,.1,.86],.014,S,3);for(const z of [-.7,-.35,.35,.7])for(const y of [.5,.62])hdCyl(mb,[x-.08,Y(y),z],[x-.087,Y(y),z],.008,.007,6,BOLT);},35);
  /* the hitch receiver, its pin and clip */
  hdPart(out,mb=>{hdRBox(mb,[x-.12,Y(.52),0],[.06,.035,.035],.006,S,2);hdRBox(mb,[x-.181,Y(.52),0],[.002,.025,.025],.002,HC.GB,1);
    hdCyl(mb,[x-.14,Y(.52),-.05],[x-.14,Y(.52),.05],.007,.007,10,HC.BOLT);hdTube(mb,[[x-.14,Y(.52),.05],[x-.14,Y(.5),.058],[x-.14,Y(.49),.04]],.002,6,HC.BOLT,false,true);},40);
  for(const s of [1,-1]){
    /* the shackle in its tab */
    {const cx=x-.11,cy=Y(.47),z=s*.55,r=.03;hdPart(out,mb=>{hdExtrude(mb,[[x-.04,cy+.045],[x-.1,cy+.03],[x-.11,cy+.005],[x-.1,cy-.02],[x-.04,cy-.03]],z-.012,z+.012,S,.003,2,true);},40);
      hdPart(out,mb=>{const pts=[];for(let k=0;k<=12;k++){const t=PI/2+PI*k/12;pts.push([cx+Math.cos(t)*r-.02,cy+Math.sin(t)*r,z]);}hdTube(mb,[[cx+.02,cy+r,z],...pts,[cx+.02,cy-r,z]],.01,12,BR,false,true);
        hdCyl(mb,[cx+.02,cy-r-.02,z],[cx+.02,cy+r+.02,z],.008,.008,12,BR);ball(mb,[cx+.02,cy+r+.022,z],.012,12,BR);},45);}
    /* the red reflector in the end */
    hdPart(out,mb=>{hdRBox(mb,[x-.081,Y(.6),s*.75],[.003,.02,.06],.004,HC.REFR,2);},40);}
}
