/* =====================================================================================
   THE EV'S CABIN (79_cabin hdCabinGen, the SUV Studio's way, with its screens added here): a low, bare, modern dash
   in black with a slim display in front of the driver in place of dials and a big screen standing on the middle;
   a two-spoke wheel; no lever (the drive is picked on a stalk), a long floating console between two bolstered seats
   in stone-white, a bench behind; four door panels with power-window switches; the parcel shelf under the
   fastback's glass.
   ===================================================================================== */
function evCabin(out,car){
  const D=HDK.D,G=D.G,X=HDK.X,pil=G.pillars.map(p=>p[0]),seatR=pil[0]+.2,o={floorY:.3+D.dy,uEnd:G.rr+.5,headEnd:G.rr+.12,doors:4,armY:.3,dashDepth:.42,
    dashTop:D.belt(G.cowl+.42)-.07,hoodH:.025,dials:[],clusterW:.17,vents:[-.62,-.15,.15,.62],stackW:.12,
    wheelU:.15,wheelDrop:.08,wheelR:.18,rimT:.019,spokes:[0,PI],spokeT:.018,hub:[.07,.07,.035],
    shifter:'none',console:'big',consoleBack:.42,seatF:pil[0]-.22,seatY:.29,seatZ:.38,seatW:.5,bolster:2,rear:'bench',seatR,seatYR:.2,rearW:1.36,
    back:'parcel',parcel:[seatR+.18,G.rr+.5,D.belt(G.rr+.3)+.02],tunnel:.06,toe:.18,tunnelEnd:pil[0]+.2,
    col:{dash:'#1b1b1c',dashTop:'#151516',vinyl:'#262628',insert:'#cbc6bd',head:'#2a2a2c',carpet:'#1c1c1d',seat:'#d4cfc6',seatSide:'#c4bfb5'}};
  hdCabinGen(out,car,o);
  const uE=G.cowl+o.dashDepth,yt=o.dashTop,dz=-.38,SCR=SV(lin('#0b1620'),SM.GLOSSBLK),UI=SV(lin('#dfe8f0'),MAT.COL,.8),BEZ=HC.GB;
  /* the driver's display, in the box the dials would have filled: a dark glass, the speed and a bar of range */
  {const u=uE-.09,y=yt-.045,x=X(u)-.0095;
    hdPart(out,mb=>{hdRBox(mb,[x,y,dz],[.0015,.046,o.clusterW-.016],.004,SCR,1);},20);
    hdPart(out,mb=>{for(const [dy2,dz2,h,w] of [[.008,0,.014,.03],[-.022,0,.003,.12],[-.022,-.09,.003,.025],[.03,.11,.004,.02],[.03,-.11,.004,.02]])hdRBox(mb,[x-.0017,y+dy2,dz+dz2],[.0006,h,w],.0005,UI,1);},20);}
  /* the screen on the middle: a portrait glass in a thin black bezel, leaning back, on a short stem */
  {const c=[X(uE-.03)-.035,yt-.1,0],n=V3.norm([-1,.28,0]),up=V3.norm([.28,1,0]),M=M4.basis(c,V3.mul(n,-1),up,[0,0,1]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.008,.15,.11],.012,BEZ,3);},30,null,M);
    hdPart(out,mb=>{hdRBox(mb,[-.0085,0,0],[.0015,.142,.102],.006,SCR,1);},20,null,M);
    hdPart(out,mb=>{hdRBox(mb,[-.0102,.128,0],[.0005,.0015,.09],.0005,UI,1);for(let k=0;k<4;k++)hdRBox(mb,[-.0102,.1-k*.022,-.045],[.0005,.004,.045],.0005,SV(lin('#4d5660'),SM.GLOSSBLK),1);hdRBox(mb,[-.0102,-.07,0],[.0005,.05,.085],.0005,SV(lin('#1d3a52'),SM.GLOSSBLK),1);},20,null,M);
    hdPart(out,mb=>{hdCyl(mb,V3.add(c,[.02,-.12,0]),V3.add(c,[.05,-.2,0]),.02,.024,16,BEZ);},30);}
  /* the stalk the drive is picked on, behind the wheel's right spoke */
  {const c=[X(uE+o.wheelU),yt-o.wheelDrop,dz],n=V3.norm([-.9,.44,0]),a=V3.add(c,V3.add(V3.mul(n,-.1),[0,.0,.035])),b=V3.add(a,[.03,-.01,.12]);
    hdPart(out,mb=>{hdTube(mb,[a,V3.lerp(a,b,.5),b],.006,10,BEZ,false,true);hdCyl(mb,b,V3.add(b,[.005,0,.03]),.009,.009,12,HC.SATIN);},40);}
}
