/* =====================================================================================
   THE HATCH'S STUDIO 2 KIT (the Stock and the Group B share the body, its underside and its bay; 91 to 94 here):
   - htLay: the layout for a build: the body's height over the Stock's (the game's dy), the wheels (the game's), the
     engine across the nose (its crank, how far over to the right, the gearbox on its left end), the transaxle's
     differential behind it with the transfer box beside it, the propshaft's line down the tunnel to the rear
     differential on the rear axle.
   - htCarpet, htPanY: the cabin's carpet as the Studio 2 cabin lays it (94: the toe board up to the firewall, the
     tunnel, the floor raised under the rear seat and the boot) and the floor's pan 3.5 cm under it, which the
     underside builds (91).
   ===================================================================================== */
function htLay(car,o={}){const K=HDK,D=K.D,lk=D.look,dy=D.dy,R=lk.tyre.R;
  const L={D,dy,R,tw:lk.track/2,W:lk.tyre.W,uFa:D.uFa,uRa:D.uRa,yb:y=>y+dy,
    /* the engine: its crank across the car at u, its timing end on the right; the transaxle on its left end */
    uc:.55,yC:.37+dy,zc:.06,hx:.24,
    /* the front differential (in the transaxle, behind the crank) and the transfer box's output to the propshaft */
    diff:[.76,R+.0,-.05],ptu:[.87,R+.012,.03],
    /* the rear differential on the rear axle, its pinion ahead */
    rdiff:[D.uRa,D.Rr-.01,0],uPin:D.uRa-.17,
    /* the hubs: how far out the drive shafts reach */
    hubZ:lk.track/2-.11};
  return L;}
/* the carpet (94 lays it so): flat at the floor's height, the toe board rising to the firewall, the tunnel's hump down
   the middle to the rear seat, the step up under the rear seat to the boot's floor */
const HT_FLOOR={toe:.2,tunnel:.12,tunnelW:.13,rise:[2.4,.1]};
function htCarpet(u,z,dy){const D=HDK.D,G=D.G,yF=.3+dy,toe=sm01((G.cowl+.34-u)/.28),rise=sm01((u-HT_FLOOR.rise[0])/.06)*HT_FLOOR.rise[1],
  tun=u<G.pillars[0][0]+.2?HT_FLOOR.tunnel*Math.exp(-Math.pow(z/HT_FLOOR.tunnelW,2)):0;return yF+toe*HT_FLOOR.toe+rise+tun;}
function htPanY(u,z,dy){return htCarpet(u,z,dy)-.035;}
