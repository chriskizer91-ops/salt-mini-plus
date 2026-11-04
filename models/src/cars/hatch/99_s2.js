/* =====================================================================================
   THE HATCH'S STUDIO 2 (KIT.setAlt('2') picks HD_CARS.hatch2 for the build 'hatch'): its Studio car (80 to 87 here)
   with the rest of it built again, on its own Studio 2 kit (90 to 94):
   - the underside, whole: the pan and its legs, the front subframe with its L-arms and struts, the drive shafts out
     of the transaxle, the propshaft through a viscous coupling to the rear differential on its subframe, struts and
     transverse links at the back, the exhaust from the turbo's downpipe through the catalyst and two boxes to the
     game's tip, the saddle tank under the rear seat, the spare's well, the lines;
   - its own engine bay: the homologation 1.8 turbo four across the nose (the game's i18t, in its colours: a grey
     block, a red cam cover, red leads), the turbo behind it, the intercooler low ahead of the radiator, the transaxle
     on its left end with the transfer box, two electric fans, the battery over the gearbox;
   - the road-car bits a mid-1980s hatch wears: the front plate, badges, the side repeaters, the fuel flap, the mast
     aerial, the glass's seals, the washer jets;
   - the cabin finished (seat rails, the belts' hardware, the boot's humps, towers and hooks, door straps); deeper
     wheel houses.
   ===================================================================================== */
HD_CARS.hatch2={
  skip:HD_CARS.hatch.skip,
  noGame:{under:1,exhaust:1},
  build(out){
    const b=out.b,lk=b.look;
    const W=htWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    {const ar=new MB();hdArches(ar,out,{zi:[.5,.5]});out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;}
    {const f=new MB();htFace(f,out);out.hd.face=f;}
    {const t=new MB();htTail(t,out);out.hd.tail=t;}
    {const h=new MB();htHoodBits(h,out);out.hd.hood=h;}
    {const c=new MB();htCabin2(c,out,{});out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdWipers(t,out,{rear:1,blades:[[-.56,.04,-.44],[.0,.56,.08]]});out.hd.trim=t;}
    {const x=new MB();htExtras2(x,out,{});out.hd.extras=x;}
    out.bay=htBay2(out,{engine:{block:'#85888d',head:'#9a9da2',cover:'#b0201c',leads:'#b0201c'}});
    out.under=htUnder2(out,{});
  },
  views:HD_CARS.hatch.views
};
