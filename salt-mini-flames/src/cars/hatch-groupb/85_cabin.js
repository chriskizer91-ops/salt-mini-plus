/* =====================================================================================
   THE HATCH GROUP B'S CABIN: the Hatch's own (cars/hatch 85_cabin htCabin: the low dash under its hood with four
   dials, the three-spoke wheel, the cloth buckets, the door cards), stripped as a rally car is: the rear seats out,
   and the roll cage in (the Coupe GT's, cars/coupe-gt 85_cabin cgCage): the main hoop behind the buckets with its
   diagonal, the front hoop up the windscreen pillars, the door bars, the stays back to the tail.
   ===================================================================================== */
function hbCabin(out,car){
  const D=HDK.D,g=hdCabinGen;
  hdCabinGen=(o2,c2,op)=>g(o2,c2,Object.assign({},op,{rear:'none'}));
  try{htCabin(out,car);}finally{hdCabinGen=g;}
  cgCage(out,car,{uh:D.G.pillars[0][0]+.08,inset:.07,r:.02,floorY:.3+D.dy});
}
