/* =====================================================================================
   THE HATCH'S CABIN (79_cabin hdCabinGen, the SUV Studio's way): a mid-1980s rally special, charcoal with red. A
   low dash with a hood over four dials (the tachometer and speedometer, a boost gauge, the temperature), three-spoke
   sports wheel; the five-speed's short lever in a gaiter, the handbrake beside it, a small console; two cloth sport
   buckets with deep bolsters and a red stripe, two rear seats; door cards with pockets and window winders; the parcel
   shelf under the hatch's glass.
   ===================================================================================== */
function htCabin(out,car){
  const D=HDK.D,G=D.G,pil=G.pillars.map(p=>p[0]);
  hdCabinGen(out,car,{floorY:.3+D.dy,uEnd:G.be-.06,headEnd:G.rr+.06,doors:2,armY:.3,dashDepth:.46,dashTop:D.belt(G.cowl+.46)-.045,hoodH:.055,
    dials:[[-.07,.05,0],[.07,.05,0],[-.16,.026,.0],[.16,.026,.0]],clusterW:.2,vents:[-.58,-.1,.1,.58],stackW:.16,needle:'#ff8a1a',
    wheelU:.16,wheelDrop:.09,wheelR:.18,rimT:.017,spokes:[0,PI,-PI/2],spokeT:.014,spokeM:SMC('#3a3b3e',SM.SATIN),hub:[.05,.05,.03],
    shifter:'manual',knob:SMC('#151517',SM.DASH),console:'small',consoleBack:.1,winders:1,cloth:1,seatStripe:1,
    seatF:pil[0]-.3,seatY:.3,seatZ:.36,seatW:.5,bolster:2,rear:'two',seatR:G.rr-.12,back:'parcel',parcel:[G.rr+.1,G.be-.06,D.belt(G.rr+.2)+.02],
    tunnel:.12,toe:.2,tunnelEnd:pil[0]+.2,rearRise:[G.rr+.08,.1],
    col:{dash:'#1f1f21',dashTop:'#18181a',vinyl:'#27272a',insert:'#38383b',head:'#5c5a57',carpet:'#212123',seat:'#2f2f32',seatSide:'#262629',accent:'#a8221c'}});
}
