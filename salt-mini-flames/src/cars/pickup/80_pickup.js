/* =====================================================================================
   THE PICKUP IN THE STUDIO: the game's own crew cab (21_suv BODIES.pickup, 27_pickup, the Stock build in 32_builds:
   "Off-road trim from the dealer"), built finer, with each part modelled again in this folder, one file a part:
   81 the wheel, 82 the face and front bumper, 83 the tail and step bumper, 84 the bed, 85 the cabin, 86 the bolt-ons
   (mirrors, handles, running boards, wipers), 87 the engine bay. What the game paints on as decals or builds as plain
   boxes and this folder builds again is left off the game's body (skip).
   ===================================================================================== */
HD_CARS.pickup={
  skip:{FACES:['pickup'],TAILS:['pickup'],FRONTS:['pickup'],REARS:['pickup'],EXTRAS:['steps']},
  build(out){
    const b=out.b,lk=b.look;
    /* the wheel: what turns, and the brake's caliper and shield, which only steer */
    const W=pkWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    /* the wheel houses and flares (73_arch, the SUV's), the underside apart */
    const ar=new MB();hdArches(ar,out);out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;
    if(typeof pkFace==='function'){const f=new MB();pkFace(f,out);out.hd.face=f;}
    if(typeof pkTail==='function'){const t=new MB();pkTail(t,out);out.hd.tail=t;}
    if(typeof pkBed==='function'){const t=new MB();pkBed(t,out);out.hd.bed=t;}
    if(typeof pkCabin==='function'){const c=new MB();pkCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdWipers(t,out);pkSteps(t,out);pkFuel(t,out);out.hd.trim=t;}
    if(typeof pkBay==='function')out.bay=pkBay(out);
    out.under=hdUnder(out);
  },
  /* the cabin seen in through the passenger's window, the dash and the wheel beyond; the bed from over the tailgate */
  views:{cabin:D=>{const G=D.G,u=G.pillars[0][0]-.05;return {p:[D.X(u),D.belt(u)+.55,1.75],t:[D.X(G.cowl+.4),D.belt(u)-.22,-.35]};},
    bed:D=>({p:[D.X(D.L)-1.6,2.7,1.2],t:[D.X(D.B.bed+.9),1.1,0]})}
};
