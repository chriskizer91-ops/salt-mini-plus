/* =====================================================================================
   THE COUPE'S CABIN (79_cabin hdCabinGen, the SUV Studio's way): a two-seat track car's, low, in black with red. A
   low dash with a hood over a big tachometer in the middle and the speed and the temperature either side; a
   three-spoke wheel with a red mark at the top; the six-speed's short lever in a gaiter, the handbrake by it; two
   deep-bolstered buckets with red stripes; the shelf behind them under the fastback's glass.
   ===================================================================================== */
function cpCabin(out,car,v2){
  const D=HDK.D,G=D.G,X=HDK.X,pil=G.pillars.map(p=>p[0]),o={floorY:.22+D.dy,uEnd:pil[0]+.25,headEnd:G.rr,doors:2,armY:.26,dashDepth:.44,
    dashTop:D.belt(G.cowl+.44)-.045,hoodH:.05,dials:[[0,.06,.006],[-.12,.036,-.01],[.12,.036,-.01]],clusterW:.2,vents:[-.6,-.1,.1,.6],stackW:.14,needle:'#ff3b1a',
    wheelU:.14,wheelDrop:.08,wheelR:.175,rimT:.019,spokes:[0,PI,-PI/2],spokeT:.014,spokeM:SMC('#2a2a2d',SM.SATIN),hub:[.06,.065,.03],
    shifter:'manual',knob:SMC('#111113',SM.DASH),console:'small',consoleBack:.1,
    seatF:pil[0]-.36,seatY:.14,seatZ:.37,seatW:.5,bolster:2,seatStripe:1,rear:'none',back:'parcel',parcel:[pil[0]-.08,G.rr+.25,D.belt(pil[0]+.2)+.02],
    tunnel:.14,toe:.18,tunnelEnd:pil[0]+.1,
    col:{dash:'#1a1a1b',dashTop:'#141415',vinyl:'#222224',insert:'#2e2e31',head:'#2a2a2c',carpet:'#1b1b1c',seat:'#232325',seatSide:'#1c1c1e',accent:'#b8221c'}};
  /* (Studio 2: a taller, wider tunnel over the six-speed, the console sitting on it, the seats a little higher and apart) */
  if(v2)Object.assign(o,{tunnel:.2,tunnelW:.17,tunnelEnd:pil[0]+.3,console:'tunnel',seatY:.18,seatZ:.4});
  hdCabinGen(out,car,o);
  /* the red mark at the top of the wheel's rim */
  {const uE=G.cowl+o.dashDepth,c=[X(uE+o.wheelU),o.dashTop-o.wheelDrop,-.38],n=V3.norm([-.9,.44,0]),f=V3.norm([.44,.9,0]),M=M4.basis(c,f,[0,0,-1],n);
    hdPart(out,mb=>{const path=[];for(let k=-3;k<=3;k++){const a=k/72*TAU;path.push([Math.cos(a)*o.wheelR,Math.sin(a)*o.wheelR,0]);}hdTube(mb,path,o.rimT+.0008,14,SMC('#c2241c',SM.VINYL),false,false);},45,null,M);}
}
