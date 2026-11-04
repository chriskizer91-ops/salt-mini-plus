/* =====================================================================================
   THE HYPERCAR'S BOLT-ONS AND THE ENGINE COVER, each taken off the game's body and modelled again:
   - The race mirrors (the game's 'race'): 79_parts hdMirrorsRace, the Coupe's and the EV's.
   - The flush door handles: a painted paddle lying flush in the skin, a fine dark gap round it.
   - The engine cover between the hips (36_hyper's mesh panel): the deck opened on the decal's outline, its edge
     turned down into a black lining, black louvres across it every few centimetres, each blade leaning forward so
     the V10 under it (86) shows between them, a spine down the middle holding them.
   ===================================================================================== */
function hpHandles(out,car){
  const K=HDK,D=K.D,G=D.G;
  for(const u of D.B.handles||[G.pillars[0][0]-.2]){const y=D.belt(u)-.09;
    hdDrop(car.body,(c,m)=>{const uu=D.uC-c[0];return Math.abs(uu-(u-.015))<.1&&Math.abs(c[1]-y)<.03&&(m===MAT.COL||m===MAT.CHROME||m===MAT.SHUT)&&hdOff(c)>.002;});
    for(const s of [1,-1])hdFlush(out,car,s,RR2(u-.09,u+.06,y-.014,y+.014,.012),.008);}
}
/* the cover's outline (u, z), the decal's own */
function hpCoverP(){const D=HDK.D,G=D.G;return RR2(G.be+.12,D.L-.35,-.42,.42,.04);}
function hpCover(out,car){
  const K=HDK,D=K.D,P=hpCoverP(),R=hdResample(P,.008);
  hdCutTop(car.body,P,.03);
  /* the edge turned down into a black lining, and a fine black trim round the top of it */
  hdPart(out,mb=>{const F=R.map(([u,z])=>hdTS(u,z,.0006)),B=R.map(([u,z])=>hdTS(u,z,-.035));hdLoft(mb,[F,B],HC.GB,true);},30);
  hdPart(out,mb=>{const E=R.map(([u,z])=>hdTS(u,z,-.001));E.push(E[0]);hdTube(mb,E,.004,6,HC.GB,false,false);},40);
  /* the louvres across it */
  let u0=1e9,u1=-1e9;for(const [u] of P){u0=Math.min(u0,u);u1=Math.max(u1,u);}
  const span=u=>{const T=hpClip(P,[u,0],[0,1]);return T||[0,0];};
  hdPart(out,mb=>{for(let u=u0+.026;u<u1-.016;u+=.032){const [a,b]=span(u);if(b-a<.05)continue;const path=[];for(let z=a+.006;z<=b-.006+1e-6;z+=.04)path.push(hdTS(u,z,-.007));path.push(hdTS(u,b-.006,-.007));
    hdSweep(mb,path,[[-.0022,-.024],[.0022,-.024],[.003,0],[-.0012,0]],HC.GB,[.6,1,0],true,true);}},35);
  /* the spine down the middle and two rails along the sides under the blades */
  hdPart(out,mb=>{for(const z of [0,-.3,.3]){const path=[];for(let u=u0+.02;u<=u1-.02+1e-6;u+=.04)path.push(hdTS(u,z,z?-.03:-.012));
    hdSweep(mb,path,[[-.008,-.03],[.008,-.03],[.008,0],[-.008,0]],HC.GB,[0,1,0],true,true);}},35);
}
