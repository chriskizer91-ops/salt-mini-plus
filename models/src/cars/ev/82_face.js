/* =====================================================================================
   THE EV'S FACE AND FRONT LIP, IN THREE DIMENSIONS (in place of 34_ev FACES.ev's decals and 23_parts FRONTS.lip's
   boxes), on the decals' own outlines, in the body-colour nose (there is no grille):
   - The lamps: thin sweeps up into the fenders, each a shallow black cavity under one clear lens: the white LED
     light guide along its top edge, two small projectors in chrome rings below it. (The sweep bends, so it is cut
     as two straight-sided pieces meeting at the bend, under one lens seal.)
   - The intakes: big black triangles at the corners, pointing up and out, a fine black mesh set back in each.
   - The slot across the bottom: a black opening, the same mesh in it.
   - The lip: a black splitter following the nose, its front edge rounded, a thin red line along it.
   (The lip is 79_parts hdLip, shared with the Coupe. Swept sections here are [up, out]: up the face, then out of it.)
   ===================================================================================== */
function evFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood],X=K.X;
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){
    const P=[[.46,.575],[.78,.606],[.9,.648],[.86,.664],[.74,.632],[.47,.598]].map(([z,y])=>[s*z,Y(y)]),[A,B,C,Dd,E,F]=P;
    const pieces=[[A,B,E,F],[B,C,Dd,E]];
    for(const [i,Q] of pieces.entries())hdLampUnit(out,'F',Q,cuts,{deep:.045,k:.86,wall:HC.GB,back:()=>HC.GB,bulge:.0015,cell:.004,lens:()=>HC.LENSH,seal:false,
      inside:i>0?null:o=>{
        /* the light guide: a white tube along the top edge, in a satin channel */
        const pts=[[.5,.5945],[.62,.6065],[.76,.6215],[.81,.633],[.85,.6475]].map(([z,y])=>hdS('F',s*z,Y(y),-.007));
        hdPart(o,mb=>{hdTube(mb,pts,.0032,10,SV([1,1,1],MAT.LED),false,true);},50);
        hdPart(o,mb=>{hdTube(mb,pts.map(p=>V3.add(p,[-.004,.002,0])),.0052,10,HC.SATIN,false,true);},40);
        /* the two projectors: a chrome ring, the lens, the barrel behind it */
        for(const [z,y,r] of [[.66,.6055,.0095],[.735,.6155,.0088]]){const c=hdS('F',s*z,Y(y),-.016);
          hdRevAt(o,'F',c,[[r+.004,-.002],[r+.003,.003],[r+.0005,.004],[r,.002]],MM.CHROME,32);
          hdPart(o,mb=>{ball(mb,V3.add(c,[.001,0,0]),r,16,HC.LAMPH);hdCyl(mb,V3.add(c,[-.004,0,0]),V3.add(c,[-.026,0,0]),r+.002,r,16,HC.SATIN);},50);}}});
    hdTrim(out,'F',hdResample(P,.006),.006,.0025,HC.SEAL,true,50);
  }
  /* ---------- the intakes ---------- */
  for(const s of [1,-1]){const T=[[.53,.22],[.9,.24],[.86,.52]].map(([z,y])=>[s*z,Y(y)]);
    for(const c of cuts)hdCut(c,'F',T);hdRecess(out,'F',T,.1,.9,HC.GB,()=>HC.GB);
    hdHoney(out,'F',hdShrink(T,.88),.04,.013,.0016,.012,HC.HONEY);
    hdTrim(out,'F',hdResample(T,.008),.012,.004,HC.GB,true,50);}
  /* ---------- the slot across the bottom ---------- */
  {const S=[[-.5,Y(.205)],[.5,Y(.205)],[.44,Y(.33)],[-.44,Y(.33)]];for(const c of cuts)hdCut(c,'F',S);
    hdRecess(out,'F',S,.09,.96,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(S,.94),.035,.013,.0016,.012,HC.HONEY);
    hdTrim(out,'F',hdResample(S,.008),.012,.004,HC.GB,true,50);}
  hdLip(out,car);
}
