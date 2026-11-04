/* =====================================================================================
   THE COUPE IN THE STUDIO: the game's own front-engine V8 fastback (21_suv BODIES.coupe, 25_coupe, the Stock build in
   32_builds: "A track car with plates"), built finer, with each part modelled again in this folder, one file a
   part: 81 the wheel, 82 the face, 83 the tail, 84 the bonnet's vents, 85 the cabin, 87 the engine bay. The lip,
   the diffuser and the race mirrors are the EV's (79_parts), as the game gives both cars the same ones. What the
   game paints on as decals or builds as plain boxes and this folder builds again is left off the game's body
   (skip); the four tailpipes are the game's.
   ===================================================================================== */
HD_CARS.coupe={
  skip:{FACES:['coupe'],TAILS:['coupe'],FRONTS:['lip'],REARS:['coupeDiff'],HOODS:['coupe']},
  build(out){
    const b=out.b,lk=b.look;
    const W=cpWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);out.hd.arches=ar;
    if(typeof cpFace==='function'){const f=new MB();cpFace(f,out);out.hd.face=f;}
    if(typeof cpTail==='function'){const t=new MB();cpTail(t,out);out.hd.tail=t;}
    if(typeof cpVents==='function'){const h=new MB();cpVents(h,out);out.hd.hood=h;}
    if(typeof cpCabin==='function'){const c=new MB();cpCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrorsRace(t,out);hdHandles(t,out);hdWipers(t,out);out.hd.trim=t;}
    if(typeof cpBay==='function')out.bay=cpBay(out);
    out.under=hdUnder(out);
  },
  views:{cabin:D=>{const G=D.G,u=G.pillars[0][0]-.3;return {p:[D.X(u),D.belt(u)+.45,1.55],t:[D.X(G.cowl+.45),D.belt(u)-.2,-.3]};}}
};
