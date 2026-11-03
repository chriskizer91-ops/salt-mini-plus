/* =====================================================================================
   THE TRAIL'S TAIL, IN THREE DIMENSIONS (in place of 24_4x4 TAILS.trail's decals, REARS.trail's boxes and
   EXTRAS.spare's carrier):
   - The lamps low in the corners: one cavity each, the red over the white reversing lens behind a black divider,
     their bulbs in reflector bowls.
   - The side-hinged door: its shut line round it (the game's outline), two hinges down its right edge, the black
     handle on its left; the spare's carrier on it: a cast hub on a three-bolt plate, the spare (the Studio wheel
     itself, where the game puts its own) bolted to it.
   - The bumper: the black steel bar, its ends angled forward, red shackles under it.
   ===================================================================================== */
function trTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,X=K.X,cuts=[car.body],S=SMC('#1c1d1f',SM.PAINTED);
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){const Lp=RR2(s*.64,s*.79,Y(.86),Y(1.04),.012),rev=(z,y)=>y<Y(.93);
    hdLampUnit(out,'R',Lp,cuts,{deep:.055,k:.88,wall:HC.GB,back:()=>HC.REFLC,bulge:.004,cell:.005,lens:(z,y)=>rev(z,y)?HC.LENSR:HC.REDL,
      inside:o=>{{const p=[];for(let z=.646;z<=.7841;z+=.008)p.push([s*z,Y(.93)]);hdTrim(o,'R',p,.006,.05,HC.GB,false,50,-.052);}
        hdPart(o,mb=>{for(let y=.945;y<1.03;y+=.014)hdCyl(mb,hdS('R',s*.65,Y(y),-.04),hdS('R',s*.78,Y(y),-.04),.0022,.0022,6,HC.REFLC,false);},30);
        for(const [z,y] of [[.715,.99],[.715,.9]]){hdRevAt(o,'R',hdS('R',s*z,Y(y),-.05),[[.03,.012],[.026,.005],[.015,.001],[0,0]],HC.REFLC,28);hdPart(o,mb=>{ball(mb,hdS('R',s*z,Y(y),-.038),.0075,14,HC.BULB);},50);}}});}
  /* ---------- the door: its shut line, hinges and handle ---------- */
  {const P=hdResample(RR2(-.6,.6,Y(.78),Y(1.25),.03),.008);hdTrim(out,'R',P,.006,.0012,HC.GB,true,50,.0012);}
  for(const y of [.86,1.17])hdPart(out,mb=>{const a=hdS('R',.6,Y(y),.0);hdRBox(mb,[a[0]-.006,a[1],.6],[.008,.03,.03],.006,S,2);hdCyl(mb,[a[0]-.016,a[1]-.04,.625],[a[0]-.016,a[1]+.04,.625],.013,.013,16,S);
    for(const k of [-1,1])hdCyl(mb,[a[0]-.016,a[1]+k*.04,.625],[a[0]-.016,a[1]+k*.046,.625],.009,.009,12,HC.BOLT);},40);
  {const H0=RR2(-.565,-.435,Y(1.098),Y(1.137),.01);for(const c of cuts)hdCut(c,'R',H0,.03);hdRecess(out,'R',H0,.02,.92,HC.GB,()=>HC.GB,3);
    hdPart(out,mb=>{hdRBox(mb,hdS('R',-.5,Y(1.124),.006),[.008,.009,.055],.006,HC.PLASTIC,3);},40);}
  /* ---------- the spare's carrier ---------- */
  {const lk=D.look,sp=lk.spare||{},y=Y(sp.y||1.1),xs=X(D.L)-.004,x1=X(D.L)-(sp.back||.06)-.04;
    hdPart(out,mb=>{const tri=[[0,.13],[-.11,-.07],[.11,-.07]];hdExtrude(mb,tri.map(([a,b])=>[a,b]),0,.012,S,.004,2,true);},35,null,M4.mul(M4T(xs,y,0),M4RY(-PI/2)));
    hdPart(out,mb=>{for(const [a,b] of [[0,.11],[-.09,-.055],[.09,-.055]])hdCyl(mb,[xs-.012,y+b,a],[xs-.022,y+b,a],.01,.01,6,HC.BOLT);},40);
    hdPart(out,mb=>{hdCyl(mb,[xs-.01,y,0],[x1,y,0],.062,.058,32,SMC('#2a2b2e',SM.CAST));hdCyl(mb,[x1,y,0],[x1+.004,y,0],.07,.07,32,SMC('#2a2b2e',SM.CAST));},35);}
  trBumperR(out,car);
}
function trBumperR(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,S=SMC('#1c1d1f',SM.PAINTED),x=X(D.L)-.03;
  hdPart(out,mb=>{hdRBox(mb,[x,Y(.64),0],[.05,.08,.84],.012,S,3);},35);
  hdPart(out,mb=>{for(let z=-.7;z<=.701;z+=.2)for(const y of [.59,.69])hdCyl(mb,[x-.05,Y(y),z],[x-.058,Y(y),z],.009,.009,6,HC.BOLT);},40);
  for(const s of [1,-1]){const a=V3.norm([1,0,s*.9]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.035,.075,.05],.01,S,3);},35,null,M4.basis([x+.05,Y(.64),s*.86],a,[0,1,0],V3.norm([-s*.9,0,1])));
    trShackle(out,[x-.03,Y(.53),s*.55],S,-1);}
}
