/* =====================================================================================
   THE COUPE'S STUDIO 2 (models/src/cars/coupe, 80 to 88): the Studio coupe above with the rest of the car built
   again, chosen in the viewer as its own version (KIT.setAlt('2') picks HD_CARS.coupe2 for the build 'coupe'):
   - 88 the underside, whole, in place of the game's SUV frame and its four straight pipes (noGame): floor and
     tunnel, cradles and wishbones, the drivetrain, the exhaust to four tips in the valance, the tank, the lines, the
     diffuser (the tail's EV diffuser is left off: cpTail noDiff).
   - 87 the engine bay, the coupe's own (in place of 79_bay's shared one), drawn all the time as part of the body.
   - 86 the road-car bits: plate, high stop lamp, badges, markers, sensors, tow eye cover, fuel flap, aerial, seals,
     the bonnet's washer jets.
   - The wheel houses run deeper in for the wishbones (hdArches zi); the cabin's tunnel is taller and wider over the
     six-speed, the console sits on it and the seats a little higher and wider apart (cpCabin v2).
   ===================================================================================== */
HD_CARS.coupe2={
  skip:{FACES:['coupe'],TAILS:['coupe'],FRONTS:['lip'],REARS:['coupeDiff'],HOODS:['coupe']},
  /* (the game's underbody and its four straight pipes are left off: the underside below is built whole) */
  noGame:{under:1,exhaust:1},
  build(out){cp2Build(out,{});},
  views:HD_CARS.coupe.views
};
/* THE COUPE'S STUDIO 2 FOR DRIVING (KIT.setAlt('2d')): the same car, the cabin and the whole underside kept (it shows
   through the windows, and when the car rolls), its own engine bay left out: the game's own small one takes its
   place, part of the underside, so the space under the bonnet isn't empty seen from below or through the vents.
   Studio 2 itself is the car in the dyno bay, bonnet up. */
HD_CARS.coupe2d={skip:HD_CARS.coupe2.skip,noGame:HD_CARS.coupe2.noGame,build(out){cp2Build(out,{drive:1});},views:HD_CARS.coupe.views};
function cp2Build(out,o){
    const b=out.b,lk=b.look,gameBay=out.bay;
    const W=cpWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    /* (the wheel houses run deeper in, for the wishbones and coilovers inside them) */
    const ar=new MB();hdArches(ar,out,{zi:.5});out.hd.arches=ar;
    {const f=new MB();cpFace(f,out);out.hd.face=f;}
    {const t=new MB();cpTail(t,out,{noDiff:1});out.hd.tail=t;}
    {const h=new MB();cpVents(h,out);cpBonnetBits(h,out);out.hd.hood=h;}
    {const c=new MB();cpCabin(c,out,1);out.hd.cabin=c;}
    {const t=new MB();hdMirrorsRace(t,out);hdHandles(t,out);hdWipers(t,out);out.hd.trim=t;}
    {const x=new MB();cpExtras(x,out);out.hd.extras=x;}
    out.bay=cpBay2(out);
    out.under=cpUnder(out);
    /* (driving: Studio 2's bay is built as ever, so the rest comes out the same, then the game's own small bay is used
       in its place) */
    if(o.drive)out.bay={bay:gameBay.bay,engine:gameBay.engine,liner:new MB()};
    /* the bay is drawn all the time, as part of the body: with the bonnet shut it is what you see looking up past the
       cradle from underneath (only the pad under the bonnet still lifts with it) */
    hdPut(out.under,out.bay.bay);hdPut(out.under,out.bay.engine);out.bay.bay=new MB();out.bay.engine=new MB();
}
