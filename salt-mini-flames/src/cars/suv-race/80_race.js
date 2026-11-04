/* =====================================================================================
   THE SUV RACE IN THE STUDIO: the game's SUV in its Race build (32_builds 'race': "Everything for the stopwatch"),
   built finer, each of its own parts modelled again in this folder, one file a part: 81 the wheel and its slick, 82
   the race face and the carbon splitter with its canards, 83 the tail and the carbon diffuser, 84 the aero (the
   roof lip and the GT wing on its swan necks, the louvred hood vents and pins, the side skirts), 85 the race kit
   (the roof scoop, the windshield banner, the fuel filler, the number on each front door), 87 the engine bay. What
   the game paints on as decals or builds as plain boxes and this folder builds again is left off the game's body
   (skip; the lip and the wing, which the game builds outside its part lists, by a copy of the look without them,
   made when the face is skipped). The arches and flares, the cabin, the race mirrors and the wipers are the Studio
   kit's own (73 to 76, 79_bits, 79_parts), as the game gives the Race the same; the side pipes are the game's.
   ===================================================================================== */
HD_CARS.race={
  skip:{FACES:['race'],TAILS:['race'],FRONTS:['race'],REARS:['race'],HOODS:['vents'],EXTRAS:['skirts','raceKit']},
  /* (the game's lip and wing are built in 23_parts spoiler() from the look: the body gets a copy of the look without
     them, made here, before the parts are built; the Studio's own go on in 84) */
  keep:{'FACES.race':K=>{const D=K.D;D.lookG=D.look;D.look=Object.assign({},D.look,{spoiler:null});}},
  build(out){
    const b=out.b,lk=b.look,D=out.D;if(D.lookG)D.look=D.lookG;
    const W=rcWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);rcFlareDrop(out);out.hd.arches=ar;const fl=new MB();hdFlares(fl);rcBolts(fl,out);out.hd.flares=fl;
    {const f=new MB();rcFace(f,out);rcSplitter(f,out);out.hd.face=f;}
    {const t=new MB();rcTail(t,out);rcDiffuser(t,out);out.hd.tail=t;}
    {const h=new MB();rcVents(h,out);out.hd.hood=h;}
    {const c=new MB();hdCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrorsRace(t,out);hdWipers(t,out);rcWing(t,out);rcSkirts(t,out);rcKit(t,out);out.hd.trim=t;}
    out.bay=rcBay(out);
    out.under=hdUnder(out);
  },
  /* (the rear three-quarter view stands back a little further: the wing stands well over the roof) */
  views:{rear34:D=>({p:[-5.2,2.3,4.4],t:[-.1,1.05,0]})}
};
