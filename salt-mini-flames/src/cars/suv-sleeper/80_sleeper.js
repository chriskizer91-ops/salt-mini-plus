/* =====================================================================================
   THE SUV SLEEPER IN THE STUDIO: the game's SUV in its Sleeper build (32_builds 'sleeper': "Looks like church, runs
   sevens"), built finer, each of its own parts modelled again in this folder, one file a part: 81 the wheel, 82 the
   split-mesh face and the lip, 83 the LED tail and the diffuser, 84 the hood scoop, the roof spoiler and the
   pinstripe, 87 the engine bay. What the game paints on as decals or builds as plain boxes and this folder builds
   again is left off the game's body (skip; the roof spoiler, which the game builds outside its part lists, by a
   copy of the look without it, made when the face is skipped). The arches, flares, cabin, mirrors, handles, rails
   and wipers are the SUV Studio's own (73 to 76, 79_bits), as the game gives the Sleeper the SUV's own; the two
   tailpipes are the game's.
   ===================================================================================== */
HD_CARS.sleeper={
  skip:{FACES:['street'],TAILS:['led'],FRONTS:['lip'],REARS:['diffuser'],HOODS:['scoop'],EXTRAS:['pinstripe']},
  /* (the game's roof spoiler is built in 23_parts spoiler() from the look: the body gets a copy of the look without it,
     made here, before the parts are built; the Studio's own goes on in 84) */
  keep:{'FACES.street':K=>{const D=K.D;D.lookG=D.look;D.look=Object.assign({},D.look,{spoiler:null});}},
  build(out){
    const b=out.b,lk=b.look,D=out.D;if(D.lookG)D.look=D.lookG;
    const W=slWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;
    {const f=new MB();slFace(f,out);out.hd.face=f;}
    {const t=new MB();slTail(t,out);out.hd.tail=t;}
    {const h=new MB();slScoop(h,out);out.hd.hood=h;}
    {const c=new MB();hdCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdRails(t,out);hdWipers(t,out);hdFuel(t,out);slSpoiler(t,out);slPinstripe(t,out);out.hd.trim=t;}
    out.bay=slBay(out);
    out.under=hdUnder(out);
  }
};
