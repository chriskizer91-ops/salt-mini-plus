/* =====================================================================================
   THE MUSCLE IN THE STUDIO: the game's own 1970-style V8 fastback (21_suv BODIES.muscle, 28_muscle, the Stock build in
   32_builds: "Big block, four-speed"), built finer, with each part modelled again in this folder, one file a part:
   81 the wheel, 82 the face and front bumper, 83 the tail and rear bumper, 84 the power bulge, 85 the cabin, 87 the
   engine bay. What the game paints on as decals or builds as plain boxes and this folder builds again is left off
   the game's body (skip). The race mirrors are the EV's (79_parts), as the game gives it the same; the handles the
   SUV Studio's in chrome; the side markers and the exhaust are the game's.
   ===================================================================================== */
HD_CARS.muscle={
  skip:{FACES:['muscle'],TAILS:['muscle'],FRONTS:['chrome'],REARS:['chrome'],HOODS:['bulge']},
  build(out){
    const b=out.b,lk=b.look;
    const W=muWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);out.hd.arches=ar;
    if(typeof muFace==='function'){const f=new MB();muFace(f,out);out.hd.face=f;}
    if(typeof muTail==='function'){const t=new MB();muTail(t,out);out.hd.tail=t;}
    if(typeof muBulge==='function'){const h=new MB();muBulge(h,out);out.hd.hood=h;}
    if(typeof muCabin==='function'){const c=new MB();muCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrorsRace(t,out);hdHandles(t,out);hdWipers(t,out);out.hd.trim=t;}
    if(typeof muBay==='function')out.bay=muBay(out);
    out.under=hdUnder(out);
  },
  views:{cabin:D=>{const G=D.G,u=G.pillars[0][0]-.35;return {p:[D.X(u),D.belt(u)+.45,1.6],t:[D.X(G.cowl+.45),D.belt(u)-.2,-.3]};}}
};
