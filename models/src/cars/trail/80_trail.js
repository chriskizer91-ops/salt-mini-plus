/* =====================================================================================
   THE TRAIL (THE 4X4) IN THE STUDIO: the game's own short two-door off-roader (21_suv BODIES.trail, 24_4x4, the
   Stock build in 32_builds: "Off-road from the factory"), built finer, with each part modelled again in this
   folder, one file a part: 81 the wheel, 82 the face and steel bumper, 83 the tail, the side-hinged door with its
   spare and the rear bumper, 84 the bolt-ons (the rock rails, the roof rack), 85 the cabin, 87 the engine bay.
   What the game paints on as decals or builds as plain boxes and this folder builds again is left off the game's
   body (skip). The flares are the SUV Studio's (73_arch hdFlares), in the cladding's black; the mirrors and handles
   the SUV Studio's in black plastic; the spare is the Studio wheel itself, as the game puts its own there.
   ===================================================================================== */
HD_CARS.trail={
  skip:{FACES:['trail'],TAILS:['trail'],FRONTS:['trail'],REARS:['trail'],EXTRAS:['spare','rails','flatRack']},
  /* (the spare's carrier is built again in 83, but the game's list of where its spares go is kept) */
  keep:{'EXTRAS.spare':K=>{const {D,X,dy,L}=K,lk=D.look,t=lk.tyre,sp=lk.spare||{},x0=X(L)-(sp.back||.06),y=(sp.y||1.1)+dy;(D.spares=D.spares||[]).push({p:[x0-.04-t.W/2,y,0],face:'back'});}},
  build(out){
    const b=out.b,lk=b.look;
    const W=trWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;
    if(typeof trFace==='function'){const f=new MB();trFace(f,out);out.hd.face=f;}
    if(typeof trTail==='function'){const t=new MB();trTail(t,out);out.hd.tail=t;}
    if(typeof trCabin==='function'){const c=new MB();trCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdWipers(t,out);if(typeof trRails==='function')trRails(t,out);if(typeof trRack==='function')trRack(t,out);out.hd.trim=t;}
    if(typeof trBay==='function')out.bay=trBay(out);
    out.under=hdUnder(out);
  },
  /* (the three-quarter views stand back further than the length alone would put them: the car is short, tall and
     carries a rack) */
  views:{front34:D=>({p:[5.0,1.75,4.1],t:[.1,.88,0]}),rear34:D=>({p:[-4.9,1.9,4.3],t:[-.1,.92,0]}),cabin:D=>{const G=D.G,u=G.pillars[0][0]-.35;return {p:[D.X(u),D.belt(u)+.55,1.55],t:[D.X(G.cowl+.4),D.belt(u)-.25,-.3]};}}
};
