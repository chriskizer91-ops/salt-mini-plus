/* =====================================================================================
   THE HYPERCAR'S CABIN (79_cabin hdCabinGen, the SUV Studio's way, with its screens and controls added here): a
   modern two-seat cockpit in black with the build's accent colour. A low, bare dash; a slim display standing on
   the column in place of dials and a landscape screen on the middle of the dash; a three-spoke wheel with a
   coloured mark at the top and two shift paddles behind it; no lever (the seven-speed is picked by buttons on the
   console's bridge, beside a starter under a flip cover); two deep carbon-backed buckets with a coloured stripe;
   behind them the bulkhead, trimmed to the sill, and the glass over it that shows the engine (86).
   (The seats sit as low as the floor allows, well forward under the canopy's crown, so the headrests clear the
   glass: the backrest's top stands about 0.8 m above its pivot.)
   ===================================================================================== */
function hpCabin(out,car){
  const D=HDK.D,G=D.G,X=HDK.X,uEnd=2.86,ACC=car.b.cal||'#e8b21b',
    o={floorY:.175+D.dy,uEnd,headEnd:G.rr-.04,doors:2,armY:.24,dashDepth:.42,
    dashTop:D.belt(G.cowl+.42)-.03,hoodH:.025,dials:[],clusterW:.17,vents:[-.62,-.12,.12,.62],stackW:.12,
    wheelU:.1,wheelDrop:.09,wheelR:.17,rimT:.02,spokes:[0,PI,-PI/2],spokeT:.014,spokeM:SMC('#1c1c1e',SM.SATIN),hub:[.065,.065,.03],
    shifter:'none',console:'small',consoleBack:-.1,seatF:2.3,seatY:.08,seatZ:.38,seatW:.5,bolster:2,seatStripe:1,rear:'none',back:'cab',
    tunnel:.13,toe:.16,tunnelEnd:uEnd,
    col:{dash:'#18181a',dashTop:'#121213',vinyl:'#1f1f21',insert:'#2a2a2d',head:'#222224',carpet:'#19191a',seat:'#202022',seatSide:'#18181a',accent:ACC}};
  hdCabinGen(out,car,o);
  /* (the door panels' top roll, made for an upright side, stands a few millimetres out through the skin under this
     canopy's tumblehome: every point of the cabin along the sill is tucked back inside the skin) */
  {const p=out.p,K=HDK;for(let i=0;i<p.length;i+=3){const u=D.uC-p[i],y=p[i+1];if(u<G.cowl||u>uEnd+.05)continue;const b=D.belt(u);if(y<b-.05||y>b+.03)continue;
    const zs=K.sideZ(u,y)-.006;if(Math.abs(p[i+2])>zs)p[i+2]=Math.sign(p[i+2])*zs;}}
  /* (the game's black trim along the side glass's foot, which the cabin's cut leaves in a sawtooth where the
     window's outline crosses it, off; a clean rubber seal along the foot of the glass in its place) */
  {const K=HDK,uA=G.cowl+.02,uZ=G.cB+.08;
    hdDrop(car.body,(c,m,cl)=>{if(m!==MAT.COL||Math.abs(cl-.010)>1e-4)return false;const u=D.uC-c[0];if(u<uA||u>uZ)return false;const b=D.belt(u);
      return c[1]>b+.004&&c[1]<b+.04&&Math.abs(Math.abs(c[2])-K.sideZ(u,c[1]))<.03;});
    for(const s of [1,-1])hdPart(out,mb=>{const path=[];for(let u=G.cowl+.06;u<=G.cB-.025+1e-6;u+=.02){const y=D.belt(u)+.0195;path.push([X(u),y,s*(K.sideZ(u,y)-.004)]);}
      hdTube(mb,path,.0095,8,HC.SEAL,false,true);},40);}
  const uE=G.cowl+o.dashDepth,yt=o.dashTop,dz=-.38,SCR=SV(lin('#0b1620'),SM.GLOSSBLK),UI=SV(lin('#dfe8f0'),MAT.COL,.8),BEZ=HC.GB,AC=SMC(ACC,SM.VINYL),
    CARB=SV([1,1,1],MAT.CARBON);
  /* the driver's display, standing on the column above the wheel's hub: a dark glass in a thin bezel, leaning back */
  {const c=[X(uE-.02),yt+.035,dz],n=V3.norm([-1,.35,0]),up=V3.norm([.35,1,0]),M=M4.basis(c,V3.mul(n,-1),up,[0,0,1]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.008,.042,.12],.01,BEZ,3);},30,null,M);
    hdPart(out,mb=>{hdRBox(mb,[-.0085,0,0],[.0015,.035,.112],.006,SCR,1);},20,null,M);
    hdPart(out,mb=>{for(const [y2,z2,h,w] of [[.006,0,.012,.028],[-.02,0,.003,.09],[.018,.08,.004,.02],[.018,-.08,.004,.02],[-.004,-.07,.012,.003],[-.004,.07,.012,.003]])hdRBox(mb,[-.0102,y2,z2],[.0005,h,w],.0005,UI,1);},20,null,M);
    hdPart(out,mb=>{hdRBox(mb,[.03,-.04,0],[.03,.012,.05],.008,BEZ,2);},30,null,M);}
  /* the screen on the middle of the dash: a landscape glass in a black bezel, leaning back */
  {const c=[X(uE-.06),yt-.075,0],n=V3.norm([-1,.3,0]),up=V3.norm([.3,1,0]),M=M4.basis(c,V3.mul(n,-1),up,[0,0,1]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.008,.07,.11],.01,BEZ,3);},30,null,M);
    hdPart(out,mb=>{hdRBox(mb,[-.0085,0,0],[.0015,.063,.102],.006,SCR,1);},20,null,M);
    hdPart(out,mb=>{hdRBox(mb,[-.0102,.05,0],[.0005,.0015,.09],.0005,UI,1);for(let k=0;k<3;k++)hdRBox(mb,[-.0102,.02-k*.025,-.05],[.0005,.006,.04],.0005,SV(lin('#4d5660'),SM.GLOSSBLK),1);
      hdRBox(mb,[-.0102,-.01,.05],[.0005,.045,.045],.0005,SV(lin('#1d3a52'),SM.GLOSSBLK),1);},20,null,M);}
  /* the console's bridge: a carbon plate over the front of the console, the gear buttons in a row, the starter
     under a flip cover in the accent colour */
  {const u=uE+.16,y=o.floorY+.235,ax=V3.norm([1,-.35,0]),ay=V3.norm([.35,1,0]),M=M4.basis([X(u),y,0],ax,ay,[0,0,1]);
    hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.12,.008,.085],.012,CARB,3);},30,null,M);
    hdPart(out,mb=>{for(const z of [-.05,-.017,.017])hdRBox(mb,[-.03,.01,z],[.018,.004,.013],.004,BEZ,2);for(const z of [-.05,-.017,.017])hdRBox(mb,[-.03,.0145,z],[.008,.0005,.004],.0004,UI,1);},30,null,M);
    hdPart(out,mb=>{hdCyl(mb,[-.03,.008,.055],[-.03,.016,.055],.014,.014,20,SMC('#b51d18',SM.VINYL));hdRBox(mb,[-.045,.028,.055],[.002,.018,.018],.003,AC,2);},30,null,M);
    /* the rotary drive-mode knob behind them */
    hdPart(out,mb=>{hdCyl(mb,[.06,.008,0],[.06,.03,0],.022,.02,24,HC.SATIN);hdCyl(mb,[.06,.03,0],[.06,.032,0],.018,.018,24,BEZ);},30,null,M);}
  /* the wheel's mark at the top, and the paddles behind it */
  {const c=[X(uE+o.wheelU),yt-o.wheelDrop,dz],n=V3.norm([-.9,.44,0]),f=V3.norm([.44,.9,0]),M=M4.basis(c,f,[0,0,-1],n);
    hdPart(out,mb=>{const path=[];for(let k=-3;k<=3;k++){const a=k/72*TAU;path.push([Math.cos(a)*o.wheelR,Math.sin(a)*o.wheelR,0]);}hdTube(mb,path,o.rimT+.0008,14,AC,false,false);},45,null,M);
    hdPart(out,mb=>{for(const e of [1,-1]){const p=[[.02,e*.06,-.04],[.04,e*.12,-.045],[.1,e*.17,-.05],[.12,e*.19,-.05]];hdSweep(mb,p,[[-.012,-.003],[.012,-.003],[.012,.003],[-.012,.003]],CARB,[0,0,1],true,true);}},40,null,M);}
  /* the glass over the bulkhead, from its trimmed wall up to the canopy, and the wall's back (86 builds the bay) */
  {const u=uEnd+.015,x=X(u),yb=D.belt(u)-.01,rows=[];
    for(let k=0;k<=24;k++){const z=-1+2*k/24,row=[];for(let j=0;j<=6;j++){const y=yb+(HDK.topY(u,Math.min(.95,Math.abs(z)))-.012-yb)*j/6,zz=Math.min(Math.abs(z),HDK.sideZ(u,y)-.04)*Math.sign(z);row.push([x,y,zz]);}rows.push(row);}
    hdPart(out,mb=>{hdLoft(mb,rows,SV([1,1,1],MAT.GLASS),false);},30);
    hdPart(out,mb=>{const r=rows.map(rw=>rw[0]);hdTube(mb,r,.008,6,HC.SEAL,false,false);},30);}
}
