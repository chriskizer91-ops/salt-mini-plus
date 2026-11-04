/* =====================================================================================
   THE HYPERCAR'S FACE, IN THREE DIMENSIONS (in place of 36_hyper FACES.hyper's decals and 23_parts FRONTS.lip's
   boxes), on the decals' own outlines, in the body-colour nose:
   - The lamps: slim angular slits high on the corners, each a black cavity under one clear lens: the white LED
     light guide along its lower edge in a satin channel, two small projectors in chrome rings above it.
   - The big intakes under them: black pockets set deep into the corners, a fine honeycomb at the back, a gloss
     black blade across each.
   - The slot across the bottom of the nose: a black opening, the same honeycomb in it.
   - The flank intakes behind the doors: deep scoops into the hips, a black pocket with a woven mesh across it and
     two strakes standing in it.
   - The lip (79_parts hdLip, the Coupe's and the EV's), unless the build carries the Track's splitter.
   - The bonnet's vents (hpHoodVents, on the bonnet so they lift with it): each let into the bonnet, a dark
     pocket under black slats.
   (Swept sections are [up, out]: up the face, then out of it.)
   ===================================================================================== */
function hpFace(out,car,opt={}){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood],X=K.X;
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){
    const P=[[.47,.49],[.84,.545],[.906,.588],[.914,.6],[.86,.6],[.5,.53]].map(([z,y])=>[s*z,Y(y)]);
    hdLampUnit(out,'F',P,cuts,{deep:.05,k:.86,wall:HC.GB,back:()=>HC.GB,bulge:.0015,cell:.004,lens:()=>HC.LENSH,seal:false,tol:.05,
      inside:o=>{
        /* the light guide along the lower edge, in its satin channel */
        const pts=[[.5,.5045],[.6,.519],[.7,.5335],[.8,.548],[.85,.5595],[.885,.5805]].map(([z,y])=>hdS('F',s*z,Y(y),-.008));
        hdPart(o,mb=>{hdTube(mb,pts,.0032,10,SV([1,1,1],MAT.LED),false,true);},50);
        hdPart(o,mb=>{hdTube(mb,pts.map(p=>V3.add(p,[-.004,-.002,0])),.0055,10,HC.SATIN,false,true);},40);
        /* the two projectors above it: a chrome ring, the lens, the barrel behind it */
        for(const [z,y,r] of [[.64,.5415,.0088],[.74,.5555,.0088]]){const c=hdS('F',s*z,Y(y),-.017);
          hdRevAt(o,'F',c,[[r+.004,-.002],[r+.003,.003],[r+.0005,.004],[r,.002]],MM.CHROME,32);
          hdPart(o,mb=>{ball(mb,V3.add(c,[.001,0,0]),r,16,HC.LAMPH);hdCyl(mb,V3.add(c,[-.004,0,0]),V3.add(c,[-.026,0,0]),r+.002,r,16,HC.SATIN);},50);}}});
    hdTrim(out,'F',hdResample(P,.006),.006,.0025,HC.SEAL,true,50);
  }
  /* ---------- the big intakes ---------- */
  for(const s of [1,-1]){const T=[[.4,.16],[.9,.18],[.9,.44],[.62,.4],[.42,.3]].map(([z,y])=>[s*z,Y(y)]);
    for(const c of cuts)hdCut(c,'F',T);hdRecess(out,'F',T,.13,.9,HC.GB,()=>HC.GB);
    hdHoney(out,'F',hdShrink(T,.86),.05,.013,.0016,.012,HC.HONEY);
    hdTrim(out,'F',hdResample(T,.008),.012,.004,HC.GB,true,50);
    /* the blade across it: a thin gloss black airfoil from the inner edge out to the corner, set a little in */
    hdPart(out,mb=>{const path=[];for(let k=0;k<=10;k++){const z=.46+.42*k/10,y=Y(.255+.12*(k/10)*(k/10)*.6+.03*k/10);path.push(hdS('F',s*z,y,-.03));}
      hdSweep(mb,path,[[-.004,-.006],[.003,-.004],[.004,.03],[-.002,.028]],HC.GB,[1,0,0],true,true);},40);}
  /* ---------- the slot across the bottom ---------- */
  {const S=RR2(-.36,.36,Y(.19),Y(.29),.02);for(const c of cuts)hdCut(c,'F',S);
    hdRecess(out,'F',S,.1,.95,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(S,.94),.04,.013,.0016,.012,HC.HONEY);
    hdTrim(out,'F',hdResample(S,.008),.012,.004,HC.GB,true,50);}
  /* ---------- the flank intakes behind the doors ---------- */
  {const u0=D.G.cB-.05,u1=D.uRa-D.arch.a-.04-(opt.short||0);
    for(const s of [1,-1]){const P=[[u0,Y(.36)],[u1,Y(.34)],[u1+.02,Y(.74)],[u0+.12,Y(.62)]];
      hdCutSide(car.body,s,P,.015);const R=hdResample(P,.006),c=hdCen(R),Bk=R.map(([u,y])=>[c[0]+(u-c[0])*.86,c[1]+(y-c[1])*.9]);
      hdPart(out,mb=>{const F=R.map(([u,y])=>hdSS(s,u,y,-.0005)),B=Bk.map(([u,y])=>hdSS(s,u,y,-.16));hdLoft(mb,[F,B],HC.GB,true);hdCap(mb,B,HC.GB,s<0);},30);
      /* the mesh across it, a little in */
      hdPart(out,mb=>{hpMesh(mb,R.map(([u,y])=>[c[0]+(u-c[0])*.93,c[1]+(y-c[1])*.95]),.016,.0014,HC.HONEY,([u,y],l)=>hdSS(s,u,y,-.05-l));},0);
      /* two strakes standing in it, leaning with its front edge */
      hdPart(out,mb=>{for(const t of [.36,.68]){const a=[u0+(u1-u0)*t+.01,Y(.355)],b=[u0+.12+(u1+.02-u0-.12)*t,Y(.62+.12*t)];const path=[];
          for(let k=0;k<=8;k++){const f=.04+.92*k/8;path.push(hdSS(s,a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,-.004));}
          hdSweep(mb,path,[[-.004,-.05],[.004,-.05],[.003,.0],[-.003,.0]],HC.GB,[0,0,s],true,true);}},40);
      /* its edge rolled in, in paint */
      hdPart(out,mb=>{const E=R.map(([u,y])=>hdSS(s,u,y,-.003));E.push(E[0]);hdTube(mb,E,.0035,6,SV([1,1,1],MAT.PAINT),false,false);},40);}
  }
  if(!opt.track)hdLip(out,car);
}
/* the bonnet's vents, on the decals' own outlines either side of the bonnet's middle */
function hpHoodVents(out,car){
  for(const s of [1,-1])hdVentTop(out,[car.hood],[[.35,s*.18],[.75,s*.3],[.75,s*.5],[.35,s*.4]],{deep:.05,pitch:.026});
}
