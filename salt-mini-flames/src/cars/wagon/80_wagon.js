/* =====================================================================================
   THE WAGON IN THE STUDIO: the game's own mid-2000s family estate (21_suv BODIES.wagon, 26_wagon, the Stock build in
   32_builds: "Nobody looks twice"), built finer, with each part modelled again in this folder, one file a part:
   81 the wheel, 82 the face, 83 the tail, 84 the bolt-ons (the rub strips round the car), 85 the cabin, 87 the
   engine bay. Its bumpers are the body's own, so there is no bumper to build again: the face and the tail sit in the
   body's nose and tail, as the game paints them there. What the game paints on as decals and this folder builds
   again is left off the game's body (skip). The roof rails are the SUV Studio's (76_trim hdRails), in the Wagon's
   silver; the exhaust's two small tips are the game's.
   ===================================================================================== */
HD_CARS.wagon={
  skip:{FACES:['wagon'],TAILS:['wagon'],EXTRAS:['rubstrip']},
  build(out){
    const b=out.b,lk=b.look;
    const W=wgWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);out.hd.arches=ar;
    if(typeof wgFace==='function'){const f=new MB();wgFace(f,out);out.hd.face=f;}
    if(typeof wgTail==='function'){const t=new MB();wgTail(t,out);out.hd.tail=t;}
    if(typeof wgCabin==='function'){const c=new MB();wgCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdRails(t,out);hdWipers(t,out,{rear:1});hdFuel(t,out);if(typeof wgRub==='function')wgRub(t,out);out.hd.trim=t;}
    if(typeof wgBay==='function')out.bay=wgBay(out);
    out.under=hdUnder(out);
  },
  views:{cabin:D=>{const G=D.G,u=G.pillars[0][0]-.1;return {p:[D.X(u),D.belt(u)+.5,1.65],t:[D.X(G.cowl+.4),D.belt(u)-.22,-.3]};}}
};
