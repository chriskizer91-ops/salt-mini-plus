/* =====================================================================================
   THE HATCH IN THE STUDIO: the game's own mid-1980s three-door homologation special (21_suv BODIES.hatch, 29_hatch,
   the Stock build in 32_builds: "Built so it could race"), built finer, with each part modelled again in this
   folder, one file a part: 81 the wheel, 82 the face and front bumper, 83 the tail and rear bumper, 85 the cabin,
   86 the bolt-ons, 87 the engine bay. What the game paints on as decals or builds as plain boxes and this folder
   builds again is left off the game's body (skip). The box flares, the stripe and the roof spoiler are the game's.
   ===================================================================================== */
HD_CARS.hatch={
  skip:{FACES:['hatch'],TAILS:['hatch'],FRONTS:['hatch'],REARS:['hatch']},
  build(out){
    const b=out.b,lk=b.look;
    const W=htWheel(lk.tyre);out.wheel=out.wheelR=W.spin;out.brake=out.brakeR=W.fixed;
    const ar=new MB();hdArches(ar,out);out.hd.arches=ar;const fl=new MB();hdFlares(fl);out.hd.flares=fl;
    if(typeof htFace==='function'){const f=new MB();htFace(f,out);out.hd.face=f;}
    if(typeof htTail==='function'){const t=new MB();htTail(t,out);out.hd.tail=t;}
    if(typeof htCabin==='function'){const c=new MB();htCabin(c,out);out.hd.cabin=c;}
    {const t=new MB();hdMirrors(t,out);hdHandles(t,out);hdWipers(t,out,{rear:1,blades:[[-.56,.04,-.44],[.0,.56,.08]]});out.hd.trim=t;}
    if(typeof htBay==='function')out.bay=htBay(out);
    out.under=hdUnder(out);
  },
  views:{cabin:D=>{const G=D.G,u=G.pillars[0][0]-.15;return {p:[D.X(u),D.belt(u)+.5,1.6],t:[D.X(G.cowl+.4),D.belt(u)-.2,-.3]};}}
};
