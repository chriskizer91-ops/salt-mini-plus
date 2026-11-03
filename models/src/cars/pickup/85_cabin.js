/* =====================================================================================
   THE PICKUP'S CABIN (79_cabin hdCabinGen, the SUV Studio's way): a full-size crew cab in its dealer's off-road trim,
   all in dark grey. A tall truck dash with a deep hood over six dials (the speedometer and tachometer, four small
   ones), four vents, the radio and the climate knobs, the four-wheel-drive knob by the light switch; a four-spoke
   wheel with a big hub, the automatic's lever on the column; two buckets with a big console between them (lid, cup
   holders); a three-seat bench behind; four door panels with power-window switches, map pockets and speakers; the
   cab's back wall in vinyl under the rear window.
   ===================================================================================== */
function pkCabin(out,car){
  const D=HDK.D,G=D.G,pil=G.pillars.map(p=>p[0]);
  hdCabinGen(out,car,{floorY:.64+D.dy,uEnd:G.rr-.06,headEnd:G.rr-.03,doors:4,armY:.3,dashDepth:.5,dashTop:D.belt(G.cowl+.5)-.055,hoodH:.065,
    dials:[[-.085,.052,0],[.085,.052,0],[-.185,.024,.022],[-.185,.024,-.032],[.185,.024,.022],[.185,.024,-.032]],clusterW:.235,vents:[-.62,-.14,.14,.62],
    wheelU:.15,wheelDrop:.1,wheelR:.2,spokes:[PI*.06,PI*.94,-PI*.36,-PI*.64],hub:[.085,.1,.034],shifter:'column',fourKnob:1,console:'big',consoleBack:.32,
    seatF:pil[0]+.1,seatY:.3,seatZ:.4,seatW:.53,bolster:1,rear:'bench',seatR:G.rr-.24,rearW:1.5,back:'cab',tunnel:.08,toe:.22,tunnelEnd:pil[0]+.3,
    col:{dash:'#262628',dashTop:'#1c1c1d',vinyl:'#2c2c2e',insert:'#3e3e41',head:'#706d68',carpet:'#252526',seat:'#414144',seatSide:'#333336'}});
}
