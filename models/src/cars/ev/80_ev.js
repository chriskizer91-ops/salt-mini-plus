/* =====================================================================================
   THE EV IN THE STUDIO: the game's own four-door electric fastback (34_ev BODIES.ev, the Stock build in
   37_newbuilds: "Silent, then gone"), built finer, with each part modelled again in this folder, one file a part:
   81 the wheel, 82 the face and the front lip, 83 the tail and the diffuser, 84 the bolt-ons (the race mirrors,
   flush handles, the charge flap), 85 the cabin, 87 the front trunk (79_bay's electric layout: no engine to show).
   What the game paints on as decals or builds as plain boxes and this folder builds again is left off the game's
   body (skip).
   ===================================================================================== */
HD_CARS.ev={
  skip:{FACES:['ev'],TAILS:['ev'],FRONTS:['lip'],REARS:['coupeDiff']},
  build(out){
    const b=out.b,lk=b.look;
    const W=evWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);out.hd.arches=ar;
    if(typeof evFace==='function'){const f=new MB();evFace(f,out);out.hd.face=f;}
    if(typeof evTail==='function'){const t=new MB();evTail(t,out);out.hd.tail=t;}
    if(typeof evCabin==='function'){const c=new MB();evCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();if(typeof evMirrors==='function')evMirrors(t,out);if(typeof evHandles==='function')evHandles(t,out);hdWipers(t,out);if(typeof evCharge==='function')evCharge(t,out);out.hd.trim=t;}
    if(typeof evBay==='function')out.bay=evBay(out);
    out.under=hdUnder(out);
  },
  views:{cabin:D=>{const G=D.G,u=G.pillars[0][0]-.2;return {p:[D.X(u),D.belt(u)+.48,1.7],t:[D.X(G.cowl+.45),D.belt(u)-.2,-.3]};}}
};
