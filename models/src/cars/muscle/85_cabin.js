/* =====================================================================================
   THE MUSCLE'S CABIN (79_cabin hdCabinGen, the SUV Studio's way): a 1970 big-block coupe's, in black vinyl. A long
   flat dash with a hood over two big dials (the speed and the tachometer) and two small; a thin three-spoke wheel
   with chrome spokes; the four-speed's chrome stick in the console, a white ball on it; two low buckets, a bench
   behind without headrests (the fastback's roof comes down over it); door panels with window winders.
   ===================================================================================== */
function muCabin(out,car){
  const D=HDK.D,G=D.G,pil=G.pillars.map(p=>p[0]);
  hdCabinGen(out,car,{floorY:.27+D.dy,uEnd:pil[0]+.6,headEnd:G.rr+.1,doors:2,armY:.27,dashDepth:.46,dashTop:D.belt(G.cowl+.46)-.04,hoodH:.04,
    dials:[[-.075,.055,0],[.075,.055,0],[-.18,.028,0],[.18,.028,0]],clusterW:.24,vents:[-.62,-.2,.2,.62],stackW:.16,needle:'#f2efe6',
    wheelU:.18,wheelDrop:.1,wheelR:.2,rimT:.013,spokes:[0,PI,-PI/2],spokeT:.008,spokeM:MM.CHROME,hub:[.05,.055,.03],
    shifter:'manual',knob:SMC('#ecebe6',SM.WHITE),console:'small',consoleBack:.25,winders:1,
    seatF:pil[0]-.4,seatY:.15,seatZ:.38,seatW:.52,bolster:1,rear:'bench',seatR:pil[0]+.2,seatYR:.17,rearHead:0,rearW:1.3,back:'parcel',parcel:[pil[0]+.48,G.rr+.62,D.belt(pil[0]+.6)+.02],
    tunnel:.13,toe:.2,tunnelEnd:pil[0]+.2,
    col:{dash:'#1b1b1d',dashTop:'#151516',vinyl:'#1f1f21',insert:'#2a2a2d',head:'#2b2b2d',carpet:'#1c1c1e',seat:'#1e1e20',seatSide:'#19191b'}});
}
