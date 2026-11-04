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
  build(out){
    const b=out.b,lk=b.look;
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
    /* the bay is drawn all the time, as part of the body: with the bonnet shut it is what you see looking up past the
       cradle from underneath (only the pad under the bonnet still lifts with it) */
    hdPut(out.under,out.bay.bay);hdPut(out.under,out.bay.engine);out.bay.bay=new MB();out.bay.engine=new MB();
  },
  views:HD_CARS.coupe.views
};
