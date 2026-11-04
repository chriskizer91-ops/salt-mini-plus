/* =====================================================================================
   THE SUV SLEEPER'S STUDIO 2 (KIT.setAlt('2') picks HD_CARS.sleeper2 for the build 'sleeper'): its Studio car (80 to
   87 here) with the rest of it built again, on the SUV's Studio 2 kit (models/src/cars/suv-stock, 90 to 94):
   - the underside, whole: the frame and the floor two inches lower with the body, both ends' suspension on it, the
     AWD drivetrain behind a race automatic (its deep finned pan, the trans-brake's lead), the twin turbos'
     downpipes into an X, a round muffler in each pipe, over the rear axle either side to the game's two tips; a
     fuel cell in the spare's place under the cargo floor (no spare, no hitch); the nitrous's feed line forward;
   - its own engine bay: the built 3.8 twin-turbo V6 (the game's tt38, in its colours: a grey block, red crinkle
     covers), stainless headers into a turbo low by each bank, the charge pipes forward to a front-mounted
     intercooler and back to the throttle body, the blow-off valve, a ram-air box under the hood's scoop feeding the
     turbos, two electric fans, the nitrous plate and its solenoids;
   - the road-car bits a sleeper keeps (badges, markers, sensors, the tow eye's cover, the aerial, seals, jets);
   - the cabin finished, the nitrous bottle on the cargo floor; deeper wheel houses.
   ===================================================================================== */
HD_CARS.sleeper2={
  skip:HD_CARS.sleeper.skip,keep:HD_CARS.sleeper.keep,
  noGame:{under:1,exhaust:1},
  build(out){
    const b=out.b,lk=b.look,D=out.D;if(D.lookG)D.look=D.lookG;
    const W=slWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    {const ar=new MB();hdArches(ar,out,{zi:[.48,.58]});out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;}
    {const f=new MB();slFace(f,out);out.hd.face=f;}
    {const t=new MB();slTail(t,out);out.hd.tail=t;}
    {const h=new MB();slScoop(h,out);suvHoodBits(h,out);out.hd.hood=h;}
    {const c=new MB();suvCabin2(c,out,{nos:1});out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdRails(t,out);hdWipers(t,out);hdFuel(t,out);slSpoiler(t,out);slPinstripe(t,out);out.hd.trim=t;}
    {const x=new MB();suvExtras2(x,out,{});out.hd.extras=x;}
    out.bay=suvBay2(out,{engine:{layout:'V6',turbo:2,ram:1,efans:1,nos:1,block:'#5d6066',head:'#74777c',cover:'#a3201c',coverPaint:1},zr:.52});
    out.under=suvUnder2(out,{exhaust:'dual',tank:'cell',spare:false,hitch:false,trans:'race4',nos:1});
  }
};
