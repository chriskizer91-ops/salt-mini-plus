/* =====================================================================================
   THE HATCH GROUP B'S STUDIO 2 (KIT.setAlt('2') picks HD_CARS.hatchB2 for the build 'hatchB'): its Studio car (80 to
   86 here) with the rest of it built again on the Hatch's Studio 2 kit (cars/hatch 90 to 94) and its own (95):
   - the underside, whole, raised with the body for gravel: the Hatch's, with its struts in red springs and gold
     dampers out at the wider track, aluminium guards under the sump, the gearbox and the subframe (behind the stone
     guard, 82) and under the tank, a straight pipe in place of the centre box;
   - its own engine bay: the four on a big turbo with anti-lag (its air valve and plumbing), its air from a duct at
     the cowl in place of the airbox, a strut brace across the towers, no pad under the bonnet;
   - a rally car's bits in place of the road car's: the red tow straps front and back, the master cut-off's pull at
     the windscreen's foot, the side repeaters, the fuel flap, the aerial, the glass's seals, the washer jets; no plate
     (its number panels are 86's);
   - the cabin in rally trim, caged, the buckets in red harnesses, the co-driver's trip meter and map lamp, the
     extinguisher, the spare in the back (95); the spot lamps on the bonnet, lifting with it; deeper wheel houses.
   ===================================================================================== */
HD_CARS.hatchB2={
  skip:HD_CARS.hatchB.skip,
  noGame:{under:1,exhaust:1},
  build(out){
    const b=out.b,lk=b.look,G=out.D.G;
    const W=hbWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    {const ar=new MB();hdArches(ar,out,{zi:[.5,.5]});cgDropFlare(out);out.hd.arches=ar;}
    {const fl=new MB();hdFlares(fl);cgFlareBolts(fl,out);out.hd.flares=fl;}
    {const f=new MB();htFace(f,out);hbFront(f,out);out.hd.face=f;}
    {const t=new MB();htTail(t,out);out.hd.tail=t;}
    /* (the spot lamps on the bonnet, so they lift with it) */
    {const h=new MB();hbHoodPlate(h,out);htHoodBits(h,out);hbSpots(h,out);out.hd.hood=h;}
    {const c=new MB();hbCabin2(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdWipers(t,out,{rear:1,blades:[[-.56,.04,-.44],[.0,.56,.08]]});
      cgRoofScoop(t,G.rf+.08,G.rf+.5,.17,.075);hbWing(t,out);hbLouvres(t,out);hbPanels(t,out);hbFlaps(t,out);out.hd.trim=t;}
    {const x=new MB();htExtras2(x,out,{noPlate:1,noBadges:1,rally:1});out.hd.extras=x;}
    out.bay=htBay2(out,{engine:{block:'#85888d',head:'#9a9da2',cover:'#b0201c',leads:'#b0201c',turbo:'big',antilag:1,ram:1},brace:1,noPad:1});
    out.under=htUnder2(out,{skids:1,skidU0:.66,exhaust:'straight',spring:'#c8241c',damper:'#d6a51a'});
  },
  views:HD_CARS.hatchB.views
};
