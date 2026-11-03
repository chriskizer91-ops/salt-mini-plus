/* =====================================================================================
   THE TRAIL'S FACE AND STEEL BUMPER, IN THREE DIMENSIONS (in place of 24_4x4 FACES.trail's decals and FRONTS.trail's
   boxes), on the decals' own outlines:
   - The grille: a flat black panel standing on the nose, five slots through it with the dark radiator behind.
   - The lamps: two round sealed beams in chrome rings on the panel: a deep reflector, the bulb and its cap, a
     fluted glass over them; small amber lamps in the corners above.
   - The bumper: a black steel bar as wide as the tyres, its ends angled back, bolted on; a red D-ring shackle on
     a tab under each end; the skid plate behind, with its slots.
   (Swept sections here are [up, out]: up the face, then out of it.)
   ===================================================================================== */
function trFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood],PL=SMC('#151517',SM.PLASTIC);
  const G0=RR2(-.72,.72,Y(.84),Y(1.15),.02),slots=[0,1,2,3,4].map(k=>RR2(-.4,.4,Y(.885+k*.052),Y(.915+k*.052),.008)),lamps=[1,-1].map(s=>EL2(s*.565,Y(.99),.104,.104,48));
  /* ---------- the grille panel, its slots and the lamps' openings left through it ---------- */
  for(const c of cuts)hdCut(c,'F',G0);
  hdPart(out,mb=>{hdGrid(mb,'F',G0,(z,y)=>slots.some(S=>hdIn(S,z,y))||lamps.some(L=>hdIn(L,z,y))?-.09:.006,()=>PL,.008);},30);
  /* its edge, turned back to the body */
  hdPart(out,mb=>{const R=hdResample(G0,.008);hdLoft(mb,[R.map(([z,y])=>hdS('F',z,y,.006)),R.map(([z,y])=>hdS('F',z,y,-.004))],PL,true);},30);
  for(const S of slots){const R=hdResample(S,.006);
    hdPart(out,mb=>{hdLoft(mb,[R.map(([z,y])=>hdS('F',z,y,.006)),R.map(([z,y])=>hdS('F',z,y,-.05))],PL,true);},30);
    hdPart(out,mb=>{hdGrid(mb,'F',S,()=>-.05,()=>HC.GB,.01);},30);}
  /* the radiator's core behind the slots */
  hdPart(out,mb=>{for(let y=.875;y<1.12;y+=.01)hdRBox(mb,hdS('F',0,Y(y),-.07),[.002,.002,.39],.001,SMC('#2a2b2d',SM.ENGINE),1);},20);
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){const c0=[s*.565,Y(.99)],L=EL2(c0[0],c0[1],.086,.086,48);
    hdLampUnit(out,'F',L,[],{deep:.1,k:.75,wall:HC.REFLC,back:()=>HC.REFLC,bulge:.012,cell:.005,lens:()=>HC.LENSH,seal:false,
      inside:o=>{const b=hdS('F',c0[0],c0[1],-.06);hdPart(o,mb=>{ball(mb,b,.012,16,HC.LAMPH);hdCyl(mb,V3.add(b,[-.014,0,0]),V3.add(b,[-.04,0,0]),.01,.009,12,HC.SATIN);},50);
        hdRevAt(o,'F',V3.add(b,[.016,0,0]),[[.019,-.004],[.018,.003],[.012,.007],[0,.008]],MM.CHROME,24);}});
    /* the glass's flutes: fine vertical ribs */
    hdPart(out,mb=>{for(let z=-.075;z<=.0751;z+=.0125){const h=Math.sqrt(Math.max(0,.083*.083-z*z));if(h<.02)continue;const p=[];for(let y=-h;y<=h+1e-6;y+=.012)p.push(hdS('F',c0[0]+z,c0[1]+y,-.0006+.012*(1-(z*z+y*y)/(.086*.086))));
      hdSweep(mb,p,[[-.0025,0],[0,.0012],[.0025,0]],HC.LENSH,[1,0,0],false,true);}},40);
    /* the chrome ring, standing on the panel */
    hdRevAt(out,'F',hdS('F',c0[0],c0[1],.006),[[.106,-.002],[.105,.006],[.1,.011],[.092,.012],[.087,.008],[.086,0]],MM.CHROME,72);
    /* the amber corner lamp */
    hdLampUnit(out,'F',RR2(s*.745,s*.795,Y(1.085),Y(1.145),.008),cuts,{deep:.04,k:.85,wall:HC.GB,back:()=>HC.REFLC,bulge:.003,cell:.004,lens:()=>HC.AMBERL,
      inside:o=>{hdPart(o,mb=>{ball(mb,hdS('F',s*.77,Y(1.115),-.025),.007,12,HC.BULB);},50);}});}
  trBumperF(out,car);
}
/* a red D-ring shackle on its tab (24_4x4 shackle, turned in 3-D): c the tab's corner, z across, d +1 for the
   front (its bow forward), -1 for the back */
function trShackle(out,c,S,d=1){const [cx,cy,z]=c,RED=SMC('#c8241c',SM.PAINTED),r=.034;
  hdPart(out,mb=>{hdRBox(mb,[cx-d*.01,cy+.03,z],[.03,.035,.012],.006,S,3);hdCyl(mb,[cx+d*.005,cy+.012,z-.013],[cx+d*.005,cy+.012,z+.013],.008,.008,12,HC.BOLT);},35);
  hdPart(out,mb=>{const pts=[[cx,cy-.02-r,z]];for(let k=0;k<=12;k++){const t=-PI/2+PI*k/12;pts.push([cx+d*(.03+Math.cos(t)*r*.6),cy-.02+Math.sin(t)*r,z]);}pts.push([cx,cy-.02+r,z]);hdTube(mb,pts,.0095,12,RED,false,true);
    hdCyl(mb,[cx-d*.005,cy-.02-r-.015,z-.026],[cx-d*.005,cy-.02-r-.015,z+.026],.008,.008,12,RED);for(const e of [-1,1])hdCyl(mb,[cx-d*.005,cy-.02-r-.015,z+e*.026],[cx-d*.005,cy-.02-r-.015,z+e*.034],.012,.012,6,RED);},40);}
function trBumperF(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,S=SMC('#1c1d1f',SM.PAINTED),x0=X(0)+.03;
  /* the bar, its face bolted on */
  hdPart(out,mb=>{hdRBox(mb,[x0,Y(.735),0],[.05,.075,.84],.012,S,3);},35);
  hdPart(out,mb=>{for(let z=-.7;z<=.701;z+=.2)for(const y of [.69,.78])hdCyl(mb,[x0+.05,Y(y),z],[x0+.058,Y(y),z],.009,.009,6,HC.BOLT);},40);
  for(const s of [1,-1]){const a=V3.norm([1,0,-s*.9]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.035,.07,.05],.01,S,3);},35,null,M4.basis([x0-.04,Y(.735),s*.86],a,[0,1,0],V3.norm([s*.9,0,1])));
    trShackle(out,[x0+.03,Y(.62),s*.37],S);}
  /* the skid plate, its slots */
  {const ax=V3.norm([1,.3,0]),ay=V3.norm([-.3,1,0]),M=M4.basis([X(.3),Y(.5),0],ax,ay,[0,0,1]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.28,.008,.45],.006,S,2);},30,null,M);
    hdPart(out,mb=>{for(let k=-3;k<=3;k++)hdRBox(mb,[.18,.0085,k*.1],[.025,.0015,.02],.0015,HC.GB,1);},30,null,M);}
}
