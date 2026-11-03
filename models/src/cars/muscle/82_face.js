/* =====================================================================================
   THE MUSCLE'S FACE AND FRONT BUMPER, IN THREE DIMENSIONS (in place of 28_muscle FACES.muscle's decals and
   FRONTS.chrome's boxes), on the decals' own outlines:
   - The grille right across the nose: a black opening in a chrome frame, eight black bars across it.
   - The lamps set into its ends: round sealed beams in chrome rings, each a deep reflector, the bulb under its
     chrome cap, a fluted glass.
   - The amber parking lamps low down.
   - The bumper: a thin chrome blade along the nose, wrapping back round the corners, on its black brackets.
   (Swept sections here are [up, out] or [out, up], as each says.)
   ===================================================================================== */
function muFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood];
  /* ---------- the grille ---------- */
  {const G0=RR2(-.875,.875,Y(.445),Y(.675),.03);for(const c of cuts)hdCut(c,'F',G0);
    hdRecess(out,'F',G0,.08,.98,HC.GB,()=>HC.GB);
    hdTrim(out,'F',hdResample(G0,.008),.018,.007,MM.CHROME,true,50);
    for(let k=0;k<8;k++){const yc=Y(.476+k*.024),h=.006,path=[];for(let z=-.63;z<=.6301;z+=.02)path.push(hdS('F',z,yc,-.02));
      hdPart(out,mb=>{hdSweep(mb,path,[[-h,-.014],[-h*.8,.003],[0,.005],[h*.8,.003],[h,-.014]],HC.PLASTIC,[1,0,0],true,true);},40);}}
  /* ---------- the lamps in the grille's ends ---------- */
  for(const s of [1,-1]){const c0=[s*.755,Y(.56)];
    hdLampUnit(out,'F',EL2(c0[0],c0[1],.072,.072,48),[],{deep:.09,k:.72,wall:HC.REFLC,back:()=>HC.REFLC,bulge:.01,cell:.005,lens:()=>HC.LENSH,seal:false,
      inside:o=>{const b=hdS('F',c0[0],c0[1],-.055);hdPart(o,mb=>{ball(mb,b,.011,16,HC.LAMPH);},50);
        hdRevAt(o,'F',V3.add(b,[.014,0,0]),[[.022,-.004],[.021,.003],[.014,.007],[0,.008]],MM.CHROME,24);}});
    hdPart(out,mb=>{for(let z=-.063;z<=.0631;z+=.0105){const h=Math.sqrt(Math.max(0,.069*.069-z*z));if(h<.018)continue;const p=[];for(let y=-h;y<=h+1e-6;y+=.01)p.push(hdS('F',c0[0]+z,c0[1]+y,-.0006+.01*(1-(z*z+y*y)/(.072*.072))));
      hdSweep(mb,p,[[-.0022,0],[0,.001],[.0022,0]],HC.LENSH,[1,0,0],false,true);}},40);
    hdRevAt(out,'F',hdS('F',c0[0],c0[1],.004),[[.088,-.002],[.087,.005],[.082,.009],[.075,.01],[.0725,.006],[.072,0]],MM.CHROME,72);
    /* ---------- the amber parking lamp ---------- */
    hdLampUnit(out,'F',RR2(s*.66,s*.78,Y(.272),Y(.31),.008),[car.body],{deep:.035,k:.88,wall:HC.GB,back:()=>HC.REFLC,bulge:.003,cell:.004,lens:()=>HC.AMBERL,tol:.05,
      inside:o=>{hdPart(o,mb=>{ball(mb,hdS('F',s*.72,Y(.291),-.02),.007,12,HC.BULB);},50);}});}
  muBumperF(out,car);
}
/* a chrome blade bumper along a plan [x, z] (from one end to the other) at height y: its section [out, up] */
function muBlade(out,plan,y,o={}){const sec=hdRRect(o.d||.035,o.h||.034,o.r||.016,5).map(([a,b])=>[a,b]);
  const path=plan.map(([x,z])=>[x,y,z]);hdPart(out,mb=>{hdSweep(mb,path,sec,MM.CHROME,[0,1,0],true,true);},40);}
function muBumperF(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,x0=X(0)-.005,y=Y(.4),plan=[];
  /* the plan: straight across, then round the corners and back along the fenders, as the game's bar and its ends */
  for(let k=0;k<=28;k++){const t=k/28,z=-.97+1.94*t,az=Math.abs(z),back=az<.8?0:Math.pow((az-.8)/.17,1.6)*.26;plan.push([x0-back,z]);}
  muBlade(out,plan,y);
  /* its brackets behind, to the frame */
  for(const s of [1,-1])hdPart(out,mb=>{hdRBox(mb,[x0-.08,y,s*.55],[.06,.02,.025],.006,SMC('#1a1a1c',SM.PAINTED),2);},35);
}
