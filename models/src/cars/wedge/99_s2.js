/* =====================================================================================
   THE WEDGE'S STUDIO 2 (KIT.setAlt('2') picks HD_CARS.wedge2 for the build 'wedge'): its Studio car (80 to 87 here)
   with the rest of it built again on its Studio 2 kit (90 to 94):
   - the underside, whole: the flat floor, both ends' double wishbones and coilovers (two a side at the back), the
     steering rack, the drive shafts, the fuel tanks beside the engine, the engine's room open underneath (the V12's
     sump and the gearbox seen from below), the tailpipes from the silencer to the game's four tips;
   - the engine where the Studio has it, behind the cabin (the game's v12w, a red-covered quad-cam V12 on six
     carburettors), its room's floor left to the underside; the front trunk with the coilovers' top mounts;
   - the road-car bits a late-1980s supercar wears: the front plate, badges, the side markers, the aerial, the
     glass's seals, the washer jets; the cabin finished.
   wd2Build is the Night Runner's too (cars/wedge-nightrunner 99): o.wheel, o.front, o.hood, o.extra as wdBuild's,
   o.tt (its twin turbos), o.side (its side exits), o.nos, o.bits, o.spring, o.damper.
   ===================================================================================== */
HD_CARS.wedge2={
  skip:HD_CARS.wedge.skip,
  noGame:{under:1,exhaust:1},
  build(out){wd2Build(out,{});},
  views:HD_CARS.wedge.views
};
function wd2Build(out,o){
  const lk=out.b.look;
  const W=(o.wheel||wdWheel)(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
  const ar=new MB();hdArches(ar,out,{skin:1});out.hd.arches=ar;
  {const f=new MB();wdFace(f,out);if(o.front)o.front(f,out);else hdLip(f,out);out.hd.face=f;}
  {const t=new MB();wdTail(t,out);hdDiffuser(t,out,{rev:false});out.hd.tail=t;}
  {const h=new MB();wdPopups(h,out);if(o.hood)o.hood(h,out);wdLidBits(h,out);out.hd.hood=h;}
  {const s=new MB();wdIntakes(s,out);out.hd.flanks=s;}
  {const e=new MB();wdDeck(e,out);wdV12(e,out,{noFloor:1,tt:o.tt});out.hd.engine=e;}
  {const c=new MB();wdCabin2(c,out);out.hd.cabin=c;}
  {const t=new MB();hdMirrorsRace(t,out);hdHandles(t,out);hdWipers(t,out);out.hd.trim=t;}
  if(o.extra)o.extra(out);
  {const x=new MB();wdExtras2(x,out,o.bits||{});out.hd.extras=x;}
  out.bay=wdBay2(out,{nos:o.nos});
  out.under=wdUnder2(out,{side:o.side,spring:o.spring,damper:o.damper});
}
