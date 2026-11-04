/* =====================================================================================
   THE SUV RACE'S STUDIO 2 (KIT.setAlt('2') picks HD_CARS.race2 for the build 'race'): its Studio car (80 to 87 here)
   with the rest of it built again, on the SUV's Studio 2 kit (models/src/cars/suv-stock, 90 to 94), and its own
   (95, 96):
   - the underside, whole, four inches down with the body: the frame, both ends independent at the race track, the
     AWD drivetrain behind a sequential six-speed (no pan, its pump, the shift barrel), each turbo's downpipe on its own
     straight pipe back along the right, through a flex section, out sideways to the game's two exits ahead of the
     rear wheel; the frame's rails stopping short of the diffuser, no spare, no hitch; the fuel cell's lines and the
     nitrous's feed forward; the aero's mounts: the carbon undertray, the splitter's rods, the diffuser's brackets;
   - its own engine bay: the 7.4 big-block (the game's bb74, in its colours: an orange block and heads, polished
     covers) with a turbo low by each bank, cone filters on their inlets, the charge pipes through the front-mounted
     intercooler to the throttle body, two electric fans, the nitrous plate; the hood's vents open over it, no pad
     under the hood;
   - what a race car wears in place of the road car's bits: the tow straps (82, 83), the hood pins, the number on
     each door (85), the master cut-off's pull outside at the windshield; no plates, badges, markers, sensors or
     aerial; the side glass's seals;
   - the cabin stripped and caged: two buckets and their harnesses, the wheel on its quick release, the digital dash,
     the switch panel, the sequential's lever, the handbrake, the extinguisher, the window net, the fuel cell in the
     cargo area behind the cage (95); the nitrous bottle in the back; deeper wheel houses.
   ===================================================================================== */
/* (the nitrous bottle behind the driver's seat, on the floor between the main hoop and the rear wheel house: the cargo
   floor carries the fuel cell) */
const RC_NOS=[3.3,3.8,-.3];
HD_CARS.race2={
  skip:HD_CARS.race.skip,keep:HD_CARS.race.keep,
  noGame:{under:1,exhaust:1},
  build(out){
    const b=out.b,lk=b.look,D=out.D;if(D.lookG)D.look=D.lookG;
    const W=rcWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    {const ar=new MB();hdArches(ar,out,{zi:[.48,.58]});rcFlareDrop(out);out.hd.arches=ar;const fl=new MB();hdFlares(fl);rcBolts(fl,out);out.hd.flares=fl;}
    {const f=new MB();rcFace(f,out);rcSplitter(f,out);out.hd.face=f;}
    {const t=new MB();rcTail(t,out);rcDiffuser(t,out);out.hd.tail=t;}
    {const h=new MB();rcVents2(h,out);out.hd.hood=h;}
    {const c=new MB(),C=suvCabin2(c,out,{race:1,nos:1,nosAt:RC_NOS});rcCabin2(c,out,C);out.hd.cabin=c;}
    {const t=new MB();hdMirrorsRace(t,out);hdWipers(t,out);rcWing(t,out);rcSkirts(t,out);rcKit(t,out);rcKill2(t,out);out.hd.trim=t;}
    {const x=new MB();suvExtras2(x,out,{noSensors:1,noTowEye:1,noAerial:1,noBadges:1,noMarkers:1});out.hd.extras=x;}
    out.bay=suvBay2(out,{engine:{layout:'V8',turbo:2,efans:1,nos:1,polish:1,block:'#b8401c',head:'#b8401c',cover:'#c9ccd1'},zr:.52,noPad:1});
    out.under=suvUnder2(out,{exhaust:'side',tank:'inside',spare:false,hitch:false,trans:'seq6',nos:1,nosAt:RC_NOS,tray:1,railEnd:D.L-.25-.2});
    rcUnder2(out.under,out);
  },
  views:HD_CARS.race.views
};
