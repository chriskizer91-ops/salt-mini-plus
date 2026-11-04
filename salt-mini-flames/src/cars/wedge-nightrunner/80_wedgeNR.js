/* =====================================================================================
   THE WEDGE NIGHT RUNNER IN THE STUDIO: the game's Wedge built for the late, empty roads (37_newbuilds wedgeNR: a
   bolted widebody, a deck wing, a splitter, twin turbos, the glow underneath), built finer: the Wedge's own parts
   (cars/wedge: the face, the pop-ups, the tail, the intakes, the louvred deck and the V12 under it, the cabin, the
   front trunk) with this car's on top, from this folder: 81 its wheel, 82 its aero and the rest: the flares and their
   bolts, the splitter, the bonnet's vents and pins, the deck wing, the skirts, the glow tubes.
   What the game builds as plain boxes and this folder builds again is left off the game's body (skip; the game's
   wing, which the build list can't leave off, is taken off by hand); the tailpipes, four out of the back and two out
   of the sides, are the game's. (The neon slash down each side is the game's paint, its livery, not a part.)
   ===================================================================================== */
HD_CARS.wedgeNR={
  skip:{FACES:['wedge'],TAILS:['wedge'],FRONTS:['race'],REARS:['coupeDiff'],HOODS:['vents'],EXTRAS:['popups','skirts','underglow']},
  build(out){wdBuild(out,{wheel:wnWheel,front:wnSplitter,hood:wnVents,extra:wnExtras});},
  views:{cabin:D=>{const G=D.G;return {p:[D.X(G.pillars[0][0]-.1),D.belt(2.3)+.27,1.42],t:[D.X(G.cowl+.5),D.belt(2.3)-.3,-.28]};}}
};
function wnExtras(out){
  {const f=new MB();hdFlares(f);wnBolts(f,out);out.hd.flares=f;}
  {const w=new MB();wnWing(w,out);out.hd.wing=w;}
  {const a=new MB();wnSkirts(a,out);wnGlow(a,out);out.hd.aero=a;}
}
