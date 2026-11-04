/* =====================================================================================
   THE HATCH GROUP B'S FRONT (in place of 29_hatch FRONTS.rallyB's boxes and EXTRAS.lampPod's), on the game's own
   sizes and places, under and over the Hatch's own face and bumper (cars/hatch 82_face):
   - The deep front spoiler under the bumper, in the black cladding, its edges rounded, four slots across its face
     with black bars in them.
   - The stone guard: an aluminium plate under the nose, tilted up at the front, bolted on along its middle.
   - The spot lamps: four round lamps on a bar across the front of the bonnet, each a deep black can on a stalk with
     a chrome bezel, a reflector bowl and its bulb behind a clear fluted lens, the chrome cap in its middle. They
     light with the headlamps.
   ===================================================================================== */
function hbFront(out,car){
  const K=HDK,D=K.D,X=K.X,Y=y=>y+K.dy,x0=X(0)+.03,CL=SV([1,1,1],MAT.CLAD);
  /* ---------- the spoiler ---------- */
  hdPart(out,mb=>{hdRBox(mb,[x0-.02,Y(.17),0],[.06,.05,.86],.016,CL,4);},40);
  for(let k=0;k<4;k++){const z=-.45+k*.3;
    hdPart(out,mb=>{hdRBox(mb,[x0+.0405,Y(.17),z],[.0016,.026,.1],.006,HC.GB,2);},30);
    hdPart(out,mb=>{for(const dy of [-.012,0,.012])hdRBox(mb,[x0+.0425,Y(.17)+dy,z],[.0022,.0026,.096],.0012,CL,1);},30);}
  /* ---------- the stone guard ---------- */
  {const ax=V3.norm([1,.12,0]),ay=V3.norm([-.12,1,0]),c=[X(.35),Y(.15),0],M=M4.basis(c,ax,ay,[0,0,1]),AL=SMC('#a3a6ab',SM.BRUSH);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.35,.008,.6],.005,AL,2);},30,null,M);
    /* its bolts, along its middle, heads down */
    for(let k=-3;k<=3;k++){const p=V3.add(V3.add(c,V3.mul(ax,(X(.3)-c[0])/ax[0])),[0,0,k*.16]),q=V3.add(p,V3.mul(ay,-.008));
      hdPart(out,mb=>{cgBolt(mb,q,V3.mul(ay,-1),.0065,HC.BOLT);},40);}}
}
function hbSpots(out,car){
  const K=HDK,D=K.D,X=K.X,u=D.B.hood0+.1,y=K.topY(u,0)+.1,x=X(u),CAN=SMC('#101012',SM.SATIN);
  /* the bar across, and each lamp's stalk down to it */
  hdPart(out,mb=>{hdRBox(mb,[x,y-.07,0],[.02,.012,.56],.008,CAN,3);},40);
  for(const z of [-.405,-.135,.135,.405]){
    hdPart(out,mb=>{hdRBox(mb,[x-.01,y-.045,z],[.014,.028,.014],.006,CAN,2);},40);
    /* the lamp, facing forward: its local z along the car's +x */
    const M=M4.basis([x+.0,y,z],[0,0,-1],[0,1,0],[1,0,0]);
    hdPart(out,mb=>{hdRev(mb,[[0,-.062],[.04,-.064],[.075,-.055],[.095,-.035],[.1,-.01],[.1,.03],[.101,.038]],48,CAN,0,TAU,true);},40,null,M);
    hdPart(out,mb=>{hdRev(mb,[[.101,.038],[.1,.044],[.096,.049],[.09,.05],[.088,.047]],48,MM.CHROME,0,TAU,true);},40,null,M);
    hdPart(out,mb=>{hdRev(mb,[[.089,.045],[.075,.026],[.05,.008],[.025,0],[.012,-.002]],48,HC.REFLC);},40,null,M);
    hdPart(out,mb=>{ball(mb,[0,0,.012],.011,14,HC.LAMPH);hdCyl(mb,[0,0,.0],[0,0,-.01],.006,.006,10,HC.SATIN);},50,null,M);
    hdPart(out,mb=>{const pr=[];for(let k=0;k<=8;k++){const r=.09*(1-k/8);pr.push([r,.048+.008*(1-Math.pow(r/.09,2))]);}hdRev(mb,pr,48,HC.LENSH,0,TAU,true);},40,null,M);
    /* the lens's flutes, a ring of fine ribs, and the chrome cap in its middle */
    hdPart(out,mb=>{for(let k=0;k<4;k++){const r=.03+k*.015;hdRev(mb,[[r-.002,.0495+.008*(1-Math.pow(r/.09,2))],[r,.0505+.008*(1-Math.pow(r/.09,2))],[r+.002,.0495+.008*(1-Math.pow(r/.09,2))]],48,HC.LENSH);}},40,null,M);
    hdPart(out,mb=>{hdRev(mb,[[.02,.054],[.02,.058],[.016,.061],[0,.062]],24,MM.CHROME,0,TAU,true);},40,null,M);}
}
