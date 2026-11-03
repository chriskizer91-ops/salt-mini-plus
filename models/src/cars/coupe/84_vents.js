/* =====================================================================================
   THE COUPE'S BONNET VENTS (in place of 25_coupe HOODS.coupe's decals), on the decals' own outlines near the
   bonnet's front corners: each let into the bonnet, a dark pocket under black slats leaning forward. Built on the
   bonnet, so they lift with it.
   ===================================================================================== */
function cpVents(out,car){
  for(const s of [1,-1])hdVentTop(out,[car.hood],[[.5,s*.36],[.82,s*.4],[.82,s*.56],[.5,s*.5]],{deep:.045,pitch:.024});
}
