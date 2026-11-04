/* =====================================================================================
   THE WEDGE NIGHT RUNNER'S STUDIO 2 (KIT.setAlt('2') picks HD_CARS.wedgeNR2 for the build 'wedgeNR'): its Studio car
   (80 to 82 here, on the Wedge's) with the rest of it built again on the Wedge's Studio 2 kit (cars/wedge 90 to 94,
   wd2Build):
   - the underside the Wedge's, 4 cm lower at the wider track (the game's lift and track), its springs in the build's
     cyan, its two side exits off the right turbo along inside the sill to the game's, beside the four tips;
   - the V12 with its twin turbos (86 o.tt: a turbo on each bank's pipe ahead of the silencer, the charge pipes forward
     to intercoolers behind the flank intakes and back to a hat over the carburettors, blown through, its blow-off
     valve), the nitrous bottle strapped in the front trunk;
   - the road-car bits a street car keeps (the plate, badges, markers, the aerial, seals, jets); the cabin finished.
   ===================================================================================== */
HD_CARS.wedgeNR2={
  skip:HD_CARS.wedgeNR.skip,
  noGame:{under:1,exhaust:1},
  build(out){wd2Build(out,{wheel:wnWheel,front:wnSplitter,hood:wnVents,extra:wnExtras,tt:1,side:1,nos:1,spring:'#18c8e0',damper:'#1a1a1c'});},
  views:HD_CARS.wedgeNR.views
};
