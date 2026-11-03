/* =====================================================================================
   THE WAGON'S FACE, IN THREE DIMENSIONS (in place of 26_wagon FACES.wagon's decals), on the decals' own outlines, in
   the body's own nose (the Wagon's bumper is the body):
   - The lamps: one cavity each side under a clear lens wrapping round the corner, a chrome reflector all through
     it; two round reflector bowls in chrome rings, each with its bulb and the bulb's shield, on a dark bezel; the
     amber end behind a satin divider, with its own reflector and bulb, under amber.
   - The grille: a black opening with a black frame round it, four black slats across it, a chrome bar along its top.
   - The intake low down: a wide black opening, a black mesh set back in it, two slats across.
   (The black rub strips across the nose's corners run on round the car with the side strips: 84_trim.)
   ===================================================================================== */
function wgFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood];
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){const Lp=[[s*.45,Y(.545)],[s*.84,Y(.555)],[s*.86,Y(.70)],[s*.47,Y(.715)]],amb=z=>Math.abs(z)>.772;
    hdLampUnit(out,'F',Lp,cuts,{deep:.09,k:.9,wall:HC.SATIN,back:()=>HC.REFLC,bulge:.004,cell:.005,
      lens:(z,y)=>amb(z)?HC.AMBERL:HC.LENSH,
      inside:o=>{
        /* the dark bezel the two bowls sit in, the bowls' openings left through it */
        const bowls=[.56,.69].map(z=>EL2(s*z,Y(.628),.046,.046,40));
        hdPart(o,mb=>{hdGrid(mb,'F',[[s*.46,Y(.552)],[s*.765,Y(.559)],[s*.77,Y(.703)],[s*.475,Y(.708)]],(z,y)=>bowls.some(B=>hdIn(B,z,y))?-.085:-.014,()=>SMC('#2a2b2e',SM.SATIN),.006);},30);
        for(const [i,B] of bowls.entries()){const c=hdCen(B),zc=s*[.56,.69][i];
          /* the bowl: the round opening lofted back to a deep round bottom, chrome all through */
          hdPart(o,mb=>{const rings=[0,.2,.45,.7,.9,1].map(t=>B.map(([z,y])=>{const k=1-t*.7;return hdS('F',c[0]+(z-c[0])*k,c[1]+(y-c[1])*k,-.015-.055*Math.sin(t*PI/2));}));
            hdLoft(mb,rings,HC.REFLC,true);hdCap(mb,rings[5],HC.REFLC,s<0);},35);
          /* its chrome ring, standing on the bezel */
          hdRevAt(o,'F',hdS('F',zc,Y(.628),-.014),[[.0585,-.001],[.0575,.004],[.054,.0062],[.049,.005],[.0462,.001]],MM.CHROME,56);
          /* the bulb and its shield */
          const b=hdS('F',zc,Y(.628),-.052);hdPart(o,mb=>{ball(mb,b,.0085,16,HC.LAMPH);hdCyl(mb,V3.add(b,[-.012,0,0]),V3.add(b,[-.03,0,0]),.008,.007,12,HC.SATIN);},50);
          hdRevAt(o,'F',V3.add(b,[.011,0,0]),[[.0125,-.003],[.0115,.002],[.0075,.005],[0,.0055]],MM.CHROME,24);}
        /* the amber end: a satin divider, its reflector and bulb */
        {const p=[];for(let y=.556;y<=.7021;y+=.01)p.push([s*(.772+.006*(y-.556)/.146),Y(y)]);hdTrim(o,'F',p,.006,.075,HC.SATIN,false,50,-.08);}
        hdRevAt(o,'F',hdS('F',s*.815,Y(.628),-.07),[[.036,-.004],[.03,-.012],[.016,-.018],[0,-.02]],HC.REFLC,32);
        hdPart(o,mb=>{ball(mb,hdS('F',s*.815,Y(.628),-.06),.0075,14,HC.BULB);},50);}});
  }
  /* ---------- the grille ---------- */
  {const G0=RR2(-.42,.42,Y(.525),Y(.68),.02);for(const c of cuts)hdCut(c,'F',G0);
    hdRecess(out,'F',G0,.08,.97,HC.PLASTIC,()=>HC.GB);
    hdTrim(out,'F',hdResample(G0,.008),.022,.006,HC.PLASTIC,true,50);
    for(let k=0;k<4;k++){const y0=.54+k*.028,yc=Y(y0+.008),h=.008,path=[];for(let z=-.39;z<=.3901;z+=.02)path.push(hdS('F',z,yc,-.012));
      hdPart(out,mb=>{hdSweep(mb,path,[[-h,-.016],[-h*.85,.003],[0,.006],[h*.85,.003],[h,-.002],[h*.7,-.016]],HC.PLASTIC,[1,0,0],true,true);},40);}
    /* the chrome bar along the top */
    {const path=[];for(let z=-.43;z<=.4301;z+=.02)path.push(hdS('F',z,Y(.6665),.002));
      hdPart(out,mb=>{hdSweep(mb,path,[[-.0115,-.006],[-.0105,.003],[-.006,.007],[0,.008],[.006,.007],[.0105,.003],[.0115,-.006]],MM.CHROME,[1,0,0],true,true);},45);}}
  /* ---------- the intake low down ---------- */
  {const I0=RR2(-.7,.7,Y(.235),Y(.325),.03);for(const c of cuts)hdCut(c,'F',I0);
    hdRecess(out,'F',I0,.07,.97,HC.PLASTIC,()=>HC.GB);
    hdTrim(out,'F',hdResample(I0,.008),.018,.005,HC.PLASTIC,true,50);
    hdHoney(out,'F',hdShrink(I0,.97),.04,.014,.0018,.012,HC.HONEY);
    for(const y of [.261,.299]){const path=[];for(let z=-.66;z<=.6601;z+=.02)path.push(hdS('F',z,Y(y),-.008));
      hdPart(out,mb=>{hdSweep(mb,path,[[-.011,-.02],[-.009,.004],[0,.006],[.009,.004],[.011,-.006],[.008,-.02]],HC.PLASTIC,[1,0,0],true,true);},40);}}
}
