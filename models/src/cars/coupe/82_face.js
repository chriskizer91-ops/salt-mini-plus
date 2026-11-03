/* =====================================================================================
   THE COUPE'S FACE, IN THREE DIMENSIONS (in place of 25_coupe FACES.coupe's decals), on the decals' own outlines.
   The nose curves back hard, so what sits at its corners lands well back on the fenders, swept:
   - The grille: a big six-sided opening, honeycomb set back in it, a gloss black frame round it.
   - The lamps: slim sweeps over the grille's corners, each a black cavity under a clear lens: two small projectors
     in chrome rings and an LED line along the lower edge.
   - The fogs: a round lamp low in each corner, in a black pod.
   - The gills: a slanted vent behind each front wheel, black slats in a dark pocket.
   (The lip is the EV's, 79_parts hdLip, without its red line, as the game has it.)
   ===================================================================================== */
function cpFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood];
  /* ---------- the grille ---------- */
  {const G0=[[-.57,.225],[.57,.225],[.62,.3],[.45,.505],[-.45,.505],[-.62,.3]].map(([z,y])=>[z,Y(y)]);for(const c of cuts)hdCut(c,'F',G0);
    hdRecess(out,'F',G0,.1,.95,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(G0,.94),.035,.016,.0018,.014,HC.HONEY);
    hdTrim(out,'F',hdResample(G0,.008),.014,.005,HC.GB,true,50);}
  for(const s of [1,-1]){
    /* ---------- the lamps ---------- */
    const Lp=[[.45,.525],[.86,.592],[.91,.64],[.86,.655],[.47,.567]].map(([z,y])=>[s*z,Y(y)]);
    hdLampUnit(out,'F',Lp,cuts,{deep:.045,k:.86,wall:HC.GB,back:()=>HC.GB,bulge:.002,cell:.004,lens:()=>HC.LENSH,
      inside:o=>{
        for(const [z,y,r] of [[.6,.565,.0185],[.72,.588,.017]]){const c=hdS('F',s*z,Y(y),-.016);
          hdRevAt(o,'F',c,[[r+.005,-.002],[r+.004,.003],[r+.001,.004],[r,.002]],MM.CHROME,32);
          hdPart(o,mb=>{ball(mb,V3.add(c,[.001,0,0]),r,16,HC.LAMPH);hdCyl(mb,V3.add(c,[-.004,0,0]),V3.add(c,[-.03,0,0]),r+.002,r,16,HC.SATIN);},50);}
        const pts=[[.48,.5365],[.62,.558],[.76,.58],[.845,.5975]].map(([z,y])=>hdS('F',s*z,Y(y),-.007));
        hdPart(o,mb=>{hdTube(mb,pts,.0028,10,SV([1,1,1],MAT.LED),false,true);},50);}});
    /* ---------- the fog lamp in its pod ---------- */
    {const pod=EL2(s*.73,Y(.3),.055,.042,32);for(const c of cuts)hdCut(c,'F',pod);hdRecess(out,'F',pod,.05,.9,HC.GB,()=>HC.GB);
      hdTrim(out,'F',hdResample(pod,.006),.008,.004,HC.GB,true,50);
      hdLampUnit(out,'F',EL2(s*.73,Y(.3),.022,.022,24),[],{deep:.03,k:.7,wall:HC.REFLC,back:()=>HC.REFLC,bulge:.004,cell:.003,lens:()=>HC.LENSH,seal:false,
        inside:o=>{hdPart(o,mb=>{ball(mb,hdS('F',s*.73,Y(.3),-.032),.007,12,HC.LAMPH);},50);}});
      hdRevAt(out,'F',hdS('F',s*.73,Y(.3),-.03),[[.026,.03],[.0235,.03],[.023,.026]],MM.CHROME,32);}
    /* ---------- the gill behind the front wheel ---------- */
    {const ug=D.uFa+D.arch.a+(D.look.flares?.2:.1),P=[[ug,Y(.40)],[ug+.06,Y(.40)],[ug+.16,Y(.64)],[ug+.1,Y(.64)]];
      hdCutSide(car.body,s,P,.015);const R=hdResample(P,.006),c=hdCen(R);
      hdPart(out,mb=>{const F=R.map(([u,y])=>hdSS(s,u,y,-.0005)),B=R.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*.9,c[1]+(y-c[1])*.95,-.04));hdLoft(mb,[F,B],HC.GB,true);hdCap(mb,B,HC.GB,s<0);},30);
      /* the slats, slanting with it */
      hdPart(out,mb=>{for(const t of [.25,.5,.75]){const a=[ug+.06*t+.004,Y(.41)],b=[ug+.1+.06*t-.004,Y(.63)];const path=[];for(let k=0;k<=8;k++){const f=k/8;path.push(hdSS(s,a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,-.008));}
        hdSweep(mb,path,[[-.006,-.012],[.006,-.012],[.004,.003],[-.004,.003]],HC.GB,[0,0,s],true,true);}},40);}
  }
  hdLip(out,car);
}
