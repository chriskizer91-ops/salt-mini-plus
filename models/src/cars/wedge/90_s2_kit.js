/* =====================================================================================
   THE WEDGE'S STUDIO 2 KIT (the Stock and the Night Runner share the body, its underside and its front trunk; 91 to
   94 here):
   - wdLay: the layout for a build: the body's height over the Stock's (the game's dy), the wheels (the game's: the
     Night Runner's wider and lower), how far out the drive shafts and the uprights reach.
   - The engine stays where the Studio puts it, behind the cabin (86 wdV12, its room's floor left out, o.noFloor):
     its crank at yC, the gearbox behind it over the rear axle, the silencer across the tail.
   ===================================================================================== */
function wdLay(car,o={}){const K=HDK,D=K.D,lk=D.look,dy=D.dy;
  return {D,dy,R:lk.tyre.R,tw:lk.track/2,W:lk.tyre.W,uFa:D.uFa,uRa:D.uRa,yb:y=>y+dy,hubZ:lk.track/2-.11,yC:.42+dy,uA:2.72,uB:3.42,zW:.6};}
