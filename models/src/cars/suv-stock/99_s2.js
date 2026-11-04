/* =====================================================================================
   THE SUV STOCK'S STUDIO 2 (models/src/cars/suv-stock, 90 to 99): the Studio truck (the SUV Studio's own, 70 to 76 in
   models/src/hd, as hdBuild builds it) with the rest of it built again, chosen in the viewer as its own version
   (KIT.setAlt('2') picks HD_CARS.stock2 for the build 'stock'):
   - 91 the underside, whole, in place of the game's frame, its boxes and its straight pipe (noGame): the frame, the
     floor, both ends' suspension, the drivetrain, the exhaust to the game's own tip, the tank, the spare, the lines.
   - 92 the engine bay, the truck's own 4.6 V8 (in place of the game's small one), drawn all the time: with the hood
     shut it is what you see looking up past the front crossmember. A piece of its own (bay), as the underside is
     (under), so the game can leave either out.
   - 93 the road-car bits: badges, side markers, the high stop lamp, parking sensors, the tow eye's cover, the fuel
     flap, the aerial, the glass's seals, the washer jets.
   - 94 the cabin, finished: the tunnel over the gearbox, the console on it, seat belts, pedals, the seats' rails,
     the cargo area's trims and tie-downs.
   - The wheel houses run deeper in, for the arms inside them (hdArches zi); the wheel is the Studio's, in two pieces
     as the Coupe's: what turns (the tyre, the wheel, the disc), and what only steers (the caliper, the dust shield).
   ===================================================================================== */
HD_CARS.stock2={
  /* (the game's underbody and its straight pipe are left off: the underside is built whole) */
  noGame:{under:1,exhaust:1},
  build(out){
    const b=out.b,lk=b.look;
    /* the wheel, the SUV Studio's own, what only steers apart */
    {const fx=new MB();out.wheel=hdWheel(lk.tyre,b,fx);out.wheelR=out.wheel;out.brake=out.brakeR=fx;}
    /* the face and tail in three dimensions (72_face), as the Studio's */
    {const f=new MB();hdFaceClassic(f,out);hdTailClassic(f,out);out.hd.face=f;}
    /* the wheel houses, deeper: the front's inner wall 48 cm out, the rear's 58 (the frame's rails pass inside it) */
    {const ar=new MB();hdArches(ar,out,{zi:[.48,.58]});out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;}
    {const c=new MB();suvCabin2(c,out,{});out.hd.cabin=c;}
    /* the mirrors, handles and rails (the Studio's), the wipers modelled (79_bits), the fuel flap in three dimensions */
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdRails(t,out);hdWipers(t,out);hdFuel(t,out);out.hd.trim=t;}
    {const x=new MB();suvExtras2(x,out,{});out.hd.extras=x;}
    {const h=new MB();suvHoodBits(h,out);out.hd.hood=h;}
    out.bay=suvBay2(out,{});
    out.under=suvUnder2(out,{});
  }
};
