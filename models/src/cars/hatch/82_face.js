/* =====================================================================================
   THE HATCH'S FACE AND FRONT BUMPER, IN THREE DIMENSIONS (in place of 29_hatch FACES.hatch's decals and
   FRONTS.hatch's boxes), on the decals' own outlines:
   - The grille: the black opening between the lamps, five black louvres across it, the dark radiator behind.
   - The lamps: plain rectangles, each a cavity with a chrome reflector bowl round an H4 bulb and its shield, a black
     frame round the bowl, the amber corner wrapping the fender behind a chrome divider with its own bulb and
     reflector; one fluted lens over it, amber over the corner.
   - The bumper: a black moulding standing proud of the body: the bar, the recessed lower part with the intake and
     its two slats, the amber indicators in it, the corners wrapping back to the flares.
   ===================================================================================== */
function htFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood];
  /* ---------- the grille ---------- */
  {const G0=RR2(-.406,.406,Y(.591),Y(.739),.008);for(const c of cuts)hdCut(c,'F',G0);hdRecess(out,'F',G0,.075,.97,HC.GB,()=>HC.GB);
    for(const [y0,y1] of [[.592,.61],[.624,.64],[.654,.67],[.684,.70],[.714,.738]]){const yc=Y((y0+y1)/2),h=(y1-y0)/2,path=[];for(let z=-.4;z<=.4001;z+=.02)path.push(hdS('F',z,yc,-.006));
      hdPart(out,mb=>{hdSweep(mb,path,[[-.004,-h],[.004,-h*.8],[.006,0],[.004,h*.85],[-.004,h],[-.012,h*.7],[-.012,-h*.7]],HC.PLASTIC,[1,0,0],true,true);},40);}}
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){const Lp=RR2(s*.418,s*.787,Y(.585),Y(.75),.008),amb=z=>Math.abs(z)>.692;
    hdLampUnit(out,'F',Lp,cuts,{deep:.085,k:.9,wall:HC.SATIN,back:()=>HC.REFLC,bulge:.003,cell:.005,
      lens:(z,y)=>amb(z)?HC.AMBERL:HC.LENSH,
      inside:o=>{
        /* the black frame round the bowl, the bowl itself: a rounded rectangle lofted back to a deep round bottom */
        const bowl=RR2(s*.455,s*.655,Y(.61),Y(.725),.02),c=hdCen(bowl);
        hdPart(o,mb=>{hdGrid(mb,'F',RR2(s*.424,s*.688,Y(.59),Y(.745),.006),(z,y)=>hdIn(bowl,z,y)?-.08:-.012,(z,y)=>HC.GB,.01);},30);
        hdPart(o,mb=>{const R0=hdResample(bowl,.006),rings=[0,.25,.5,.75,1].map(t=>R0.map(([z,y])=>{const k=1-t*.62;return hdS('F',c[0]+(z-c[0])*k,c[1]+(y-c[1])*k,-.013-.05*Math.sin(t*PI/2));}));
          hdLoft(mb,rings,HC.REFLC,true);hdCap(mb,rings[4],HC.REFLC,s<0);},30);
        const b=hdS('F',c[0],c[1],-.05);hdPart(o,mb=>{ball(mb,b,.009,16,HC.LAMPH);hdCyl(mb,V3.add(b,[-.012,0,0]),V3.add(b,[-.03,0,0]),.008,.007,12,HC.SATIN);},50);
        hdRevAt(o,'F',V3.add(b,[.011,0,0]),[[.013,-.003],[.012,.002],[.008,.005],[0,.0055]],MM.CHROME,24);
        /* the amber corner: a chrome divider, its bulb in a small reflector */
        {const p=[];for(let y=.588;y<=.7471;y+=.01)p.push([s*.692,Y(y)]);hdTrim(o,'F',p,.005,.07,MM.CHROME,false,50,-.075);}
        hdRevAt(o,'F',hdS('F',s*.74,Y(.668),-.06),[[.032,-.006],[.026,-.014],[.014,-.019],[0,-.02]],HC.REFLC,32);
        hdPart(o,mb=>{ball(mb,hdS('F',s*.74,Y(.668),-.05),.0075,14,HC.BULB);},50);}});
    /* the lens's flutes: thin vertical ribs across the clear part */
    hdPart(out,mb=>{for(let z=.43;z<.685;z+=.0125){const p=[];for(let y=.592;y<=.7431;y+=.015)p.push(hdS('F',s*z,Y(y),.0042));hdSweep(mb,p,[[-.0025,0],[0,.0012],[.0025,0]],HC.LENSH,[1,0,0],false,true);}},40);}
  htBumperF(out,car);
}
function htBumperF(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,X=K.X,xf=X(0)+.08,CL=SV([1,1,1],MAT.CLAD);
  const half=[];for(let z=0;z<=.74;z+=.02)half.push([xf-.008*(z/.74)**2,z]);const rc=.1,cx=xf-.008-rc;for(let k=1;k<=14;k++){const a=k/14*PI/2;half.push([cx+Math.cos(a)*rc,.74+Math.sin(a)*rc]);}
  for(let x=cx-.03;x>=X(.27);x-=.03)half.push([x,.84]);
  const sec=[[.11,Y(.532)],[.04,Y(.535)],[.012,Y(.529)],[.002,Y(.516)],[0,Y(.48)],[0,Y(.44)],[.001,Y(.4)],[.004,Y(.37)],[.012,Y(.356)],[.03,Y(.35)],
    [.04,Y(.345)],[.041,Y(.33)],[.04,Y(.318)],[.04,Y(.3)],[.04,Y(.28)],[.04,Y(.253)],[.042,Y(.245)],[.05,Y(.234)],[.07,Y(.23)],[.14,Y(.228)]];
  const inY=[Y(.253),Y(.318)],ind=[.6,.72];
  const bar=hdBumperLoft(out,{half,sec,in:[xf-1.2,0],m:CL,hole:(z,y)=>Math.abs(z)<.42&&y>inY[0]&&y<inY[1]||Math.abs(z)>ind[0]&&Math.abs(z)<ind[1]&&y>Y(.28)&&y<inY[1]});
  /* the intake: a dark pocket and two slats across it */
  hdBumperPocket(out,bar,hdResample(RR2(-.42,.42,inY[0],inY[1],.006),.01),.045,HC.GB,HC.GB,.99);
  for(const y of [.2745,.2965]){const path=[];for(let z=-.415;z<=.4151;z+=.02)path.push(bar.onBar(z,Y(y),.008));
    hdPart(out,mb=>{hdSweep(mb,path,[[-.006,-.004],[.006,-.004],[.007,.004],[-.004,.005]].map(([a,b])=>[a,b]),CL,[0,1,0],true,true);},40);}
  /* the indicators: an amber lens in a pocket, a bulb behind it */
  for(const s of [1,-1]){const rim=hdResample(RR2(Math.min(s*ind[0],s*ind[1]),Math.max(s*ind[0],s*ind[1]),Y(.28),inY[1],.006),.006);
    hdBumperPocket(out,bar,rim,.03,HC.GB,HC.REFLC,.9);const c=bar.onBar(s*(ind[0]+ind[1])/2,Y(.299),.02);
    hdPart(out,mb=>{ball(mb,c,.0065,12,HC.BULB);},50);
    hdPart(out,mb=>{const R=rim.map(([z,y])=>bar.onBar(z,y,.003)),C=bar.onBar(s*(ind[0]+ind[1])/2,Y(.299),.0015);for(let i=0;i<R.length;i++)mb.tri(C,R[i],R[(i+1)%R.length],HC.AMBERL[0],0,HC.AMBERL[2]);},40);}
}
