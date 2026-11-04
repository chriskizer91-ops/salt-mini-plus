/* =====================================================================================
   THE SUV ROCK & MUD IN THE STUDIO: the game's SUV in its Rock & Mud build (32_builds 'crawler': "Built for the bog
   and the ledges"), built finer, each of its own parts modelled again in this folder, one file a part: 81 the wheel
   and its mud-terrain, 82 the Backcountry face and the steel winch bumper, 83 the tail and the rear steel bumper, 84
   the bolt-ons (the rock sliders, the snorkel, the ditch lights, the mud flaps), 85 the expedition rack and the
   lip over the rear glass, 87 the engine bay. What the game paints on as decals or builds as plain boxes and this
   folder builds again is left off the game's body (skip; the rack and the lip, which the game builds outside its
   part lists, by a copy of the look without them, made when the face is skipped). The arches, flares, cabin,
   mirrors, handles, rails and wipers are the SUV Studio's own (73 to 76, 79_bits); the tailpipe is the game's.
   ===================================================================================== */
HD_CARS.crawler={
  skip:{FACES:['back'],TAILS:['back'],FRONTS:['steel'],REARS:['steel'],EXTRAS:['sliders','snorkel','ditch','flaps']},
  /* (the game's rack and lip are built in 23_parts roof() and spoiler() from the look: the body gets a copy of the look
     without them, made here, before the parts are built; the Studio's own go on in 85) */
  keep:{'FACES.back':K=>{const D=K.D;D.lookG=D.look;D.look=Object.assign({},D.look,{roof:null,spoiler:null});}},
  build(out){
    const b=out.b,lk=b.look,D=out.D;if(D.lookG)D.look=D.lookG;
    const W=cwWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);cwFlareDrop(out);out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;
    {const f=new MB();cwFace(f,out);cwBumperF(f,out);out.hd.face=f;}
    {const t=new MB();cwTail(t,out);cwBumperR(t,out);out.hd.tail=t;}
    {const c=new MB();hdCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdRails(t,out);hdWipers(t,out);hdFuel(t,out);cwRack(t,out);cwLip(t,out);
      cwSliders(t,out);cwSnorkel(t,out);cwDitch(t,out);cwFlaps(t,out);out.hd.trim=t;}
    out.bay=cwBay(out);
    out.under=hdUnder(out);
  },
  /* (the three-quarter views stand back further than the length alone would put them: the car is lifted and carries
     a loaded rack) */
  views:{front34:D=>({p:[5.6,2.3,4.6],t:[.1,1.2,0]}),rear34:D=>({p:[-5.5,2.5,4.7],t:[-.1,1.25,0]})}
};
