/* =====================================================================================
   THE HYPERCAR TRACK IN THE STUDIO: the game's track edition of the Hypercar (37_newbuilds hyperTrack: "Downforce
   you can feel at walking pace"), built on the Stock's Studio parts (../hyper, hpBuild: the face, tail, tips,
   cabin, engine cover, the V10 and the front trunk), with the Track's own built again in this folder: 81 the
   slick on its centre-lock wheel, 82 the aero (the splitter and its canards, the tow strap, the side skirts, the
   roof scoop, the shark fin and the swan-neck wing). The widebody's flares are the SUV Studio's (73_arch
   hdFlares), in the paint; the flank intakes are cut a little shorter, clear of them. The stripes are the game's.
   ===================================================================================== */
HD_CARS.hyperTrack={
  skip:{FACES:['hyper'],TAILS:['hyper'],FRONTS:['race'],REARS:['coupeDiff'],EXTRAS:['skirts','fin','roofScoop']},
  build(out){hpBuild(out,{wheel:hkWheel,track:hkKit,short:.1});},
  views:{cabin:D=>{const G=D.G,u=G.rr-.05;return {p:[D.X(u),D.belt(u)+.36,1.75],t:[D.X(G.cowl+.5),D.belt(u)-.25,-.25]};}}
};
