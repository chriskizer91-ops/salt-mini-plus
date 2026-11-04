/* =====================================================================================
   THE HATCH GROUP B IN THE STUDIO: the game's own rally monster on the Hatch's body (32_builds hatchB: riveted box
   flares a hand wider each side, a deep front spoiler and a stone guard, four spot lamps on the bonnet, a roof scoop,
   louvred rear windows, a big wing on struts, gravel tyres on white wheels, red mud flaps), built finer, with each
   part modelled again in this folder, one file a part: 81 the wheel, 82 the front (the spoiler, the guard, the spot
   lamps), 84 the bonnet's plate, 85 the cabin and its cage, 86 the wing, the louvres, the number panels and the flaps.
   The face, the tail, the bumpers and the engine bay are the Hatch's (cars/hatch), as the game gives both cars the
   same; the roof scoop, the cage, the flare bolts and the leftover flare's removal are the Coupe GT's
   (cars/coupe-gt), as the game gives both the same parts. What the game paints on as decals or builds as plain boxes
   and this folder builds again is left off the game's body (skip, and the wing, which the game always builds, taken
   off by hand); the exhaust is the game's.
   ===================================================================================== */
HD_CARS.hatchB={
  skip:{FACES:['hatch'],TAILS:['hatch'],FRONTS:['rallyB'],REARS:['hatch'],EXTRAS:['lampPod','roofScoop','louvres','flaps','numberPanel']},
  build(out){
    const b=out.b,lk=b.look,G=out.D.G;
    const W=hbWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);cgDropFlare(out);out.hd.arches=ar;
    {const fl=new MB();hdFlares(fl);cgFlareBolts(fl,out);out.hd.flares=fl;}
    {const f=new MB();htFace(f,out);hbFront(f,out);out.hd.face=f;}
    {const t=new MB();htTail(t,out);out.hd.tail=t;}
    {const h=new MB();hbHoodPlate(h,out);out.hd.hood=h;}
    {const c=new MB();hbCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdWipers(t,out,{rear:1,blades:[[-.56,.04,-.44],[.0,.56,.08]]});
      hbSpots(t,out);cgRoofScoop(t,G.rf+.08,G.rf+.5,.17,.075);hbWing(t,out);hbLouvres(t,out);hbPanels(t,out);hbFlaps(t,out);out.hd.trim=t;}
    out.bay=htBay(out);
    out.under=hdUnder(out);
  },
  /* (the three-quarter views stand back 15% further than the length alone would put them: the wing, the flares and
     the spot lamps make the car bigger than its length says) */
  views:{front34:D=>{const s=D.L/4.92,h=D.Hr/1.79,k=1.15;return {p:[.15*s+5.45*s*k,.8*h+.75*h*k,4.6*s*k],t:[.15*s,.8*h,0]};},
    rear34:D=>{const s=D.L/4.92,h=D.Hr/1.79,k=1.15;return {p:[-.1*s-5.3*s*k,.85*h+.85*h*k,4.8*s*k],t:[-.1*s,.85*h,0]};},
    cabin:D=>{const G=D.G,u=G.pillars[0][0]-.15;return {p:[D.X(u),D.belt(u)+.5,1.6],t:[D.X(G.cowl+.4),D.belt(u)-.2,-.3]};}}
};
