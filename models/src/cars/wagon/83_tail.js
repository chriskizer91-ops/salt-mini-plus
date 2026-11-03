/* =====================================================================================
   THE WAGON'S TAIL, IN THREE DIMENSIONS (in place of 26_wagon TAILS.wagon's decals), in the body's own tail:
   - The lamps: tall ones up the D-pillars, each its own cavity under one lens: the red climbing the pillar, with
     fine horizontal optics, two bulbs in reflector bowls (the tail and the brake); low down, the white reversing
     block and the amber block, boxed in by black dividers, each with its bulb.
   - The tailgate: the plate in a pressed recess (its outline the game's shut line), two plate lamps in the
     recess's top, the chrome handle bar above it; the high stop lamp on the roof's trailing edge.
   (The black rub strip across the tail runs on round the car with the side strips: 84_trim. The rear wiper is the
   kit's, 79_bits hdWipers.)
   ===================================================================================== */
function wgTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body];
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){
    const Lp=[[.62,.66],[.84,.66],[.82,1.0],[.76,1.2],[.72,1.3],[.64,1.3],[.62,1.0]].map(([z,y])=>[s*z,Y(y)]);
    const rev=(z,y)=>Math.abs(z)>.645&&Math.abs(z)<.83&&y>Y(.69)&&y<Y(.745),amb=(z,y)=>Math.abs(z)>.645&&Math.abs(z)<.83&&y>Y(.755)&&y<Y(.79);
    /* (the lamp's width at a height: its inner and outer edge, from the outline) */
    const edge=(y,side)=>{const P=side>0?[[.84,.66],[.82,1.0],[.76,1.2],[.72,1.3]]:[[.62,.66],[.62,1.0],[.64,1.3]];
      for(let i=0;i<P.length-1;i++)if(y>=P[i][1]&&y<=P[i+1][1])return P[i][0]+(P[i+1][0]-P[i][0])*(y-P[i][1])/(P[i+1][1]-P[i][1]);return P[P.length-1][0];};
    hdLampUnit(out,'R',Lp,cuts,{deep:.07,k:.9,wall:HC.GB,back:()=>HC.REFLC,bulge:.004,cell:.005,
      lens:(z,y)=>rev(z,y)?HC.LENSR:amb(z,y)?HC.AMBERL:HC.REDL,
      inside:o=>{
        /* the black dividers round the reversing and amber blocks */
        for(const y of [.6875,.75,.7925]){const p=[],z1=edge(y,1)-.024;for(let z=.628;z<=z1+1e-6;z+=.008)p.push([s*z,Y(y)]);hdTrim(o,'R',p,.006,.06,HC.GB,false,50,-.062);}
        {const p=[];for(let y=.688;y<=.7921;y+=.008)p.push([s*.638,Y(y)]);hdTrim(o,'R',p,.006,.06,HC.GB,false,50,-.062);}
        /* the red's optics: fine horizontal rods across the reflector, up the pillar */
        hdPart(o,mb=>{for(let y=.81;y<1.285;y+=.016){const z0=edge(y,-1)+.012,z1=edge(y,1)-.012;if(z1-z0<.03)continue;
          hdCyl(mb,hdS('R',s*z0,Y(y),-.05),hdS('R',s*z1,Y(y),-.05),.0024,.0024,6,HC.REFLC,false);}},30);
        /* the bulbs, each in its own reflector bowl: the tail and brake up the pillar, the reversing and amber low */
        for(const [z,y,bm] of [[.72,.93,HC.BULB],[.7,1.12,HC.BULB],[.737,.7175,HC.BULB],[.737,.7713,HC.BULB]]){
          hdRevAt(o,'R',hdS('R',s*z,Y(y),-.064),[[.028,.012],[.024,.005],[.014,.001],[0,0]],HC.REFLC,28);
          hdPart(o,mb=>{ball(mb,hdS('R',s*z,Y(y),-.05),.0075,14,bm);},50);}}});
  }
  /* ---------- the plate in its pressed recess ---------- */
  {const R0=RR2(-.32,.32,Y(.64),Y(.86),.025);for(const c of cuts)hdCut(c,'R',R0);
    hdRecess(out,'R',R0,.022,.985,SV([1,1,1],MAT.PAINT),()=>SV([1,1,1],MAT.PAINT),5);
    const P=hdResample(RR2(-.26,.26,Y(.69),Y(.80),.008),.01);
    hdPart(out,mb=>{const F=P.map(([z,y])=>hdS('R',z,y,-.018)),B=P.map(([z,y])=>hdS('R',z,y,-.0215));hdCap(mb,F,SV([1,1,1],MAT.PLATE),false);hdLoft(mb,[F,B],SV([1,1,1],MAT.PLATE),true);},20);
    hdPart(out,mb=>{const r=hdResample(RR2(-.252,.252,Y(.697),Y(.793),.006),.01).map(([z,y])=>hdS('R',z,y,-.0175));r.push(r[0]);hdTube(mb,r,.0018,6,SV([.05,.07,.18],MAT.COL),false,false);},40);
    for(const z of [-.2,.2])hdPart(out,mb=>{const a=hdS('R',z,Y(.785),-.018);hdCyl(mb,a,V3.add(a,[.004,0,0]),.006,.0055,10,MM.CHROME);},40);
    /* the plate lamps, in the recess's top */
    for(const z of [-.14,.14])hdPart(out,mb=>{hdRBox(mb,hdS('R',z,Y(.851),-.016),[.006,.005,.028],.004,HC.LENS,2);},40);
    /* the handle bar above: chrome, over a dark pocket for the fingers */
    {const H0=RR2(-.11,.11,Y(.866),Y(.874),.003);for(const c of cuts)hdCut(c,'R',H0,.04);hdRecess(out,'R',H0,.018,.95,HC.GB,()=>HC.GB,3);
      const path=[];for(let z=-.12;z<=.1201;z+=.01)path.push(hdS('R',z,Y(.8835),.002));
      hdPart(out,mb=>{hdSweep(mb,path,[[-.0085,-.004],[-.0075,.003],[-.004,.006],[0,.0065],[.004,.006],[.0075,.003],[.0085,-.004]],MM.CHROME,[-1,0,0],true,true);},45);}}
  /* ---------- the high stop lamp ---------- */
  hdLampUnit(out,'R',RR2(-.13,.13,Y(1.385),Y(1.405),.006),cuts,{deep:.014,k:.9,wall:HC.GB,back:()=>HC.REFLC,bulge:.0015,cell:.004,lens:()=>HC.REDL,tol:.04,
    inside:o=>{hdPart(o,mb=>{for(let z=-.115;z<=.1151;z+=.023)ball(mb,hdS('R',z,Y(1.395),-.008),.003,8,HC.BULB);},50);}});
}
