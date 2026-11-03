/* =====================================================================================
   THE TRAIL'S CABIN (79_cabin hdCabinGen, the SUV Studio's way): a working off-roader's, in charcoal cloth and
   grained plastic. An upright dash with a hood over two big dials and two small, four vents, the radio and the
   climate knobs; a three-spoke wheel; the automatic's lever in a small console with the transfer case's short
   lever beside it; two cloth seats, a bench behind; door panels with window winders; a grab handle on the
   passenger's side of the dash; the flat floor behind the bench out to the door.
   ===================================================================================== */
function trCabin(out,car){
  const D=HDK.D,G=D.G,X=HDK.X,pil=G.pillars.map(p=>p[0]),yF=.58+D.dy,o={floorY:yF,uEnd:G.be-.1,headEnd:G.rr-.03,doors:2,armY:.3,dashDepth:.42,
    dashTop:D.belt(G.cowl+.42)-.05,hoodH:.06,dials:[[-.08,.05,0],[.08,.05,0],[-.17,.022,0],[.17,.022,0]],clusterW:.22,vents:[-.55,-.13,.13,.55],stackW:.16,
    wheelU:.16,wheelDrop:.1,wheelR:.19,rimT:.018,spokes:[0,PI,-PI/2],spokeT:.016,hub:[.07,.08,.035],
    shifter:'auto',console:'small',consoleBack:.12,winders:1,cloth:1,
    seatF:pil[0]-.32,seatY:.3,seatZ:.37,seatW:.5,bolster:1,rear:'bench',seatR:G.rr-.42,rearW:1.3,tunnel:.14,toe:.22,tunnelEnd:pil[0]+.3,rearRise:[G.rr-.2,.05],
    col:{dash:'#232425',dashTop:'#1d1e1f',vinyl:'#2d2e30',insert:'#45464a',head:'#6f6c66',carpet:'#2a2a2b',seat:'#3b3c3f',seatSide:'#303134'}};
  hdCabinGen(out,car,o);
  const uE=G.cowl+o.dashDepth,BLK=SV([.012,.012,.013],SM.DASH);
  /* the transfer case's lever, beside the console */
  {const p=[X(uE+.3),yF+.12,.075];hdPart(out,mb=>{hdCyl(mb,p,V3.add(p,[-.02,.16,0]),.008,.007,10,HC.SATIN);ball(mb,V3.add(p,[-.02,.17,0]),.018,14,BLK);hdRBox(mb,[p[0],yF+.11,p[2]],[.04,.012,.03],.008,BLK,2);},40);}
  /* the grab handle on the dash */
  hdPart(out,mb=>{const y=o.dashTop-.08,u=uE-.02,pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push([X(u)-.03*Math.sin(t*PI),y+.01*Math.sin(t*PI),.2+.3*t]);}hdTube(mb,pts,.012,10,BLK,false,true);},40);
}
