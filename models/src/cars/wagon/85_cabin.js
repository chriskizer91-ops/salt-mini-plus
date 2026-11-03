/* =====================================================================================
   THE WAGON'S CABIN (79_cabin hdCabinGen, the SUV Studio's way): a mid-2000s family estate in grey and stone, as
   plain inside as out. A soft dash with a hood over two big dials and two small (the fuel and the temperature), four
   vents, the radio and the climate knobs in the stack; a three-spoke wheel round an airbag; the automatic's lever in
   the console, an armrest box behind it; two cloth front seats, a three-seat bench behind; four door panels with
   power-window switches, map pockets and speakers; the long load floor behind the bench under its load cover, drawn
   across at the windows' foot.
   ===================================================================================== */
function wgCabin(out,car){
  const D=HDK.D,G=D.G,pil=G.pillars.map(p=>p[0]),seatR=pil[1]-.02;
  hdCabinGen(out,car,{floorY:.3+D.dy,uEnd:G.be-.1,headEnd:G.rr+.04,doors:4,armY:.3,dashDepth:.48,dashTop:D.belt(G.cowl+.48)-.05,hoodH:.055,
    dials:[[-.08,.05,0],[.08,.05,0],[-.175,.022,0],[.175,.022,0]],clusterW:.22,vents:[-.6,-.12,.12,.6],stackW:.18,needle:'#ff5a1f',
    wheelU:.15,wheelDrop:.09,wheelR:.19,rimT:.018,spokes:[PI*.08,PI*.92,-PI/2],spokeT:.02,hub:[.075,.085,.04],
    shifter:'auto',console:'big',consoleBack:.28,cloth:1,
    seatF:pil[0]-.14,seatY:.3,seatZ:.38,seatW:.5,bolster:1,rear:'bench',seatR,rearW:1.44,
    back:'parcel',parcel:[seatR+.2,G.be-.14,D.belt(G.rr)+.01],
    tunnel:.1,toe:.2,tunnelEnd:pil[0]+.4,rearRise:[seatR+.22,.07],
    col:{dash:'#2a2927',dashTop:'#21201f',vinyl:'#57534c',insert:'#7a7368',head:'#a39d92',carpet:'#34312d',seat:'#6c665c',seatSide:'#5a554d'}});
}
