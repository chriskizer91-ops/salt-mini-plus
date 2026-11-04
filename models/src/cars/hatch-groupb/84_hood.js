/* =====================================================================================
   THE HATCH GROUP B'S BONNET PLATE (in place of 29_hatch EXTRAS.numberPanel's bonnet decal), on its own outline: a
   blank white plate of film lying on the bonnet's front, its corners rounded. Built on the bonnet, so it lifts with it.
   ===================================================================================== */
function hbHoodPlate(out,car){hbFilm(out,RR2(.36,.6,-.18,.18,.02),(u,z,o)=>hdTS(u,z,o),SV([.93,.93,.9],MAT.COL),.0014,1);}
/* a sheet of film on a surface: P its outline in the surface's own two coordinates, at(a, b, off) the surface point
   off out, its edge th thick; s the side it faces (1 or -1, for the winding) */
function hbFilm(out,P,at,m,th,s){const R=hdResample(P,.012),c=hdCen(R),n=5,rings=[];
  for(let j=0;j<=n;j++){const k=j/n;rings.push(R.map(([a,b])=>at(c[0]+(a-c[0])*k,c[1]+(b-c[1])*k,th)));}
  hdPart(out,mb=>{hdLoft(mb,rings.slice().reverse(),m,true,s<0);const e=rings[n],e0=R.map(([a,b])=>at(a,b,th*.15));hdLoft(mb,[e0,e],m,true,s<0);},20);}
