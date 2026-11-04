/* =====================================================================================
   THE MUSCLE'S TAIL AND REAR BUMPER, IN THREE DIMENSIONS (in place of 28_muscle TAILS.muscle's decals and
   REARS.chrome's boxes), on the decals' own outlines:
   - The black panel right across the tail; in it two wide lamps in chrome bezels, each a red lens over a reflector
     with two chrome bars across it, its bulbs behind.
   - The deck lid's shut lines across the deck and down its sides (the game's outlines).
   - The plate below the bumper, on its black bracket, with its lamp.
   - The bumper: the thin chrome blade, wrapping forward round the corners.
   ===================================================================================== */
function muTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,X=K.X,cuts=[car.body];
  /* ---------- the panel and its lamps ---------- */
  {const P0=RR2(-.9,.9,Y(.485),Y(.655),.02);for(const c of cuts)hdCut(c,'R',P0,.04);hdRecess(out,'R',P0,.014,.995,HC.GB,()=>SV([.012,.012,.014],SM.PLASTIC),4);}
  for(const s of [1,-1]){const Lp=RR2(Math.min(s*.212,s*.853),Math.max(s*.212,s*.853),Y(.512),Y(.628),.025);
    hdLampUnit(out,'R',Lp,[],{deep:.06,k:.92,wall:HC.GB,back:()=>HC.REFLC,bulge:.003,cell:.005,lens:()=>HC.REDL,seal:false,tol:.04,
      inside:o=>{hdPart(o,mb=>{for(let y=.522;y<.62;y+=.012)hdCyl(mb,hdS('R',s*.23,Y(y),-.045),hdS('R',s*.835,Y(y),-.045),.0022,.0022,6,HC.REFLC,false);},30);
        for(const z of [.36,.53,.7]){hdRevAt(o,'R',hdS('R',s*z,Y(.57),-.058),[[.032,.014],[.027,.006],[.015,.001],[0,0]],HC.REFLC,28);hdPart(o,mb=>{ball(mb,hdS('R',s*z,Y(.57),-.044),.0075,14,HC.BULB);},50);}}});
    /* the chrome bezel round it, the two bars across it */
    hdTrim(out,'R',hdResample(RR2(Math.min(s*.2,s*.865),Math.max(s*.2,s*.865),Y(.5),Y(.64),.03),.008),.014,.006,MM.CHROME,true,50,-.012);
    for(const y of [.556,.59]){const p=[];for(let z=.215;z<=.8501;z+=.02)p.push([s*z,Y(y)]);hdTrim(out,'R',p,.006,.004,MM.CHROME,false,50,.003);}}
  /* ---------- the deck lid's shut lines ---------- */
  {const deck=(pts)=>hdPart(out,mb=>{hdSweep(mb,pts,[[-.0025,-.001],[.0025,-.001],[.0025,.0006],[-.0025,.0006]],HC.GB,[0,1,0],true,true);},50);
    {const p=[];for(let z=-.62;z<=.6201;z+=.02)p.push(hdTS(4.28,z,.0002));deck(p);}
    for(const s of [1,-1]){const p=[];for(let t=0;t<=1.0001;t+=.05){const u=4.28+(D.L-.08-4.28)*t;p.push(hdTS(u,s*(.62+.08*t),.0002));}deck(p);}}
  /* ---------- the plate below the bumper ---------- */
  {const x=X(D.L)+.03,y=Y(.3375),BR=SMC('#1a1a1c',SM.PAINTED);
    hdPart(out,mb=>{hdRBox(mb,[x+.012,y+.01,0],[.008,.06,.17],.006,BR,2);},35);
    hdPart(out,mb=>{hdRBox(mb,[x,y,0],[.003,.0375,.155],.004,SV([1,1,1],MAT.PLATE),2);},30);
    hdPart(out,mb=>{const r=hdResample(RR2(-.15,.15,y-.033,y+.033,.006),.01).map(([z,yy])=>[x-.0032,yy,z]);r.push(r[0]);hdTube(mb,r,.0015,6,SV([.05,.07,.18],MAT.COL),false,false);},40);
    hdPart(out,mb=>{hdRBox(mb,[x-.004,y+.05,0],[.006,.008,.03],.004,HC.LENS,2);},40);}
  muBumperR(out,car);
}
function muBumperR(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,x=X(D.L)+.005,y=Y(.45),plan=[];
  for(let k=0;k<=28;k++){const t=k/28,z=-.98+1.96*t,az=Math.abs(z),fwd=az<.8?0:Math.pow((az-.8)/.18,1.6)*.27;plan.push([x+fwd,z]);}
  muBlade(out,plan,y);
  for(const s of [1,-1])hdPart(out,mb=>{hdRBox(mb,[x+.08,y,s*.55],[.06,.02,.025],.006,SMC('#1a1a1c',SM.PAINTED),2);},35);
}
