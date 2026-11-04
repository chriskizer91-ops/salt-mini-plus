/* =====================================================================================
   THE SUV ROCK & MUD'S STUDIO 2 (KIT.setAlt('2') picks HD_CARS.crawler2 for the build 'crawler'): its Studio car (80
   to 87 here) with the rest of it built again, on the SUV's Studio 2 kit (models/src/cars/suv-stock, 90 to 94):
   - the underside, whole, six inches up with the body: the frame on the lift, both ends on solid axles (the
     differentials' red covers, the axle tubes and their trusses, four links a side to the frame, the long-travel
     coilovers in the game's red springs, a bypass shock and a hydraulic bump stop at each wheel, limit straps, the
     front's track bar and the steering box's drag link with its hydraulic assist ram), skid plates under the front,
     the engine and gearbox, the transfer case and the tank; the race four-speed's deep pan, the transfer case and
     both driveshafts; the headers' pipes into one muffler and up over the rear axle to the game's turned-down tip;
   - its own engine bay: the 10.4 big-block (the game's bb104, in its colours: a black block, polished covers) under
     a Roots blower, its belt off the crank, two four-barrels under an air cleaner ducted to the snorkel, the
     distributor and its leads, stainless headers, two electric fans, the nitrous plate;
   - the road-car bits a trail truck keeps (the badges, markers, seals, jets: no parking sensors or tow eye cover in
     the steel bumpers, which carry their own shackles, and no mast aerial, the rack has its whip);
   - the cabin finished, the nitrous bottle on the cargo floor; deeper wheel houses.
   ===================================================================================== */
HD_CARS.crawler2={
  skip:HD_CARS.crawler.skip,keep:HD_CARS.crawler.keep,
  noGame:{under:1,exhaust:1},
  build(out){
    const b=out.b,lk=b.look,D=out.D;if(D.lookG)D.look=D.lookG;
    const W=cwWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    {const ar=new MB();hdArches(ar,out,{zi:[.5,.58]});cwFlareDrop(out);out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;}
    {const f=new MB();cwFace(f,out);cwBumperF(f,out);out.hd.face=f;}
    {const t=new MB();cwTail(t,out);cwBumperR(t,out);out.hd.tail=t;}
    {const h=new MB();suvHoodBits(h,out);out.hd.hood=h;}
    {const c=new MB();suvCabin2(c,out,{nos:1});out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdRails(t,out);hdWipers(t,out);hdFuel(t,out);cwRack(t,out);cwLip(t,out);
      cwSliders(t,out);cwSnorkel(t,out);cwDitch(t,out);cwFlaps(t,out);out.hd.trim=t;}
    {const x=new MB();suvExtras2(x,out,{noSensors:1,noTowEye:1,noAerial:1});out.hd.extras=x;}
    out.bay=suvBay2(out,{engine:{layout:'V8',carb:1,blower:1,polish:1,headers:1,efans:1,nos:1,block:'#1d1f24',head:'#1d1f24',cover:'#c9ccd1'}});
    out.under=suvUnder2(out,{susp:'solid',exhaust:'crawl',skids:1,spare:false,hitch:false,trans:'race4',nos:1,spring:'#c8301c'});
  },
  /* (the Rock & Mud's own three-quarters; the cabin from the driver's side, the snorkel and its mirror in the way on the
     other) */
  views:Object.assign({},HD_CARS.crawler.views,{cabin:D=>{const h=D.Hr/1.79;return {p:[.6,2.3*h,-2.3],t:[-.3,1.0*h,0]};}})
};
