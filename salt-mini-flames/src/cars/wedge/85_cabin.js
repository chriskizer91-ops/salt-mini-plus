/* =====================================================================================
   THE WEDGE'S CABIN (79_cabin hdCabinGen, the SUV Studio's way): a late-1980s supercar's, two seats low on the floor
   under the low roof, a black dash with tan leather. A long hooded binnacle over five dials (a big tachometer and
   speedometer, three small ones); a small three-spoke wheel; the five-speed's lever in an open chrome gate on the
   tall tunnel between the seats; two reclined buckets with deep bolsters and stitched centres; the bulkhead behind
   them, the engine on its other side.
   ===================================================================================== */
function wdCabin(out,car){
  const D=HDK.D,G=D.G,X=HDK.X,pil=G.pillars.map(p=>p[0]),yF=.2+D.dy,o={floorY:yF,uEnd:pil[0]+.02,headEnd:G.rr-.02,doors:2,armY:.24,dashDepth:.42,
    dashTop:D.belt(G.cowl+.42)-.04,hoodH:.055,dials:[[-.07,.052,0],[.07,.052,0],[-.17,.026,-.012],[.17,.026,-.012],[0,.02,-.04]],clusterW:.26,vents:[-.62,-.14,.14,.62],stackW:.15,needle:'#f3a21b',
    wheelU:.16,wheelDrop:.08,wheelR:.17,rimT:.018,spokes:[0,PI,-PI/2],spokeT:.012,spokeM:SMC('#1c1c1e',SM.SATIN),hub:[.05,.06,.03],
    shifter:'none',console:'small',consoleBack:.05,
    seatF:pil[0]-.42,seatY:.02,seatZ:.36,seatW:.5,bolster:2,seatStripe:1,rear:'none',back:'cab',
    tunnel:.2,toe:.16,tunnelEnd:pil[0]+.1,
    col:{dash:'#181819',dashTop:'#121213',vinyl:'#1e1e1f',insert:'#a88d68',head:'#2a2826',carpet:'#2a241f',seat:'#b0946f',seatSide:'#97795a',accent:'#7f6448'}};
  hdCabinGen(out,car,o);
  /* (the cabin's front corners reach into the front wheel houses, ahead of the door: what stands in them is taken out,
     the arch's liner closing them) */
  hdDrop(out,(c,m)=>{const u=D.uC-c[0];return u<D.uFa+D.arch.a+.035&&Math.abs(c[2])>D.plan(u)*.66&&c[1]<D.arch.cy+D.arch.b+.07;});
  /* the five-speed's open gate on the console: a chrome plate with its slots, the bare lever, a polished ball */
  {const uE=G.cowl+o.dashDepth,a=uE-.02,uc=a+.22,yp=yF+.222,CH=MM.CHROME,GATE=[[-.04,-.03],[-.04,.0],[-.04,.03],[.04,-.03],[.04,.0],[.04,.03]];
    const holes=[...[-.03,0,.03].map(z=>wdRR(-.04,.04,z-.0055,z+.0055,.005)),wdRR(-.0055,.0055,-.03,.03,.004),wdRR(.035,.046,-.042,-.03,.004)];
    hdPart(out,mb=>{wdHoled(mb,wdRR(-.07,.07,-.055,.055,.012),holes,.008,(du,z)=>[X(uc+du),yp,z],CH,[0,1,0]);},30);
    hdPart(out,mb=>{hdRBox(mb,[X(uc),yp-.004,0],[.074,.004,.059],.003,CH,2);hdRBox(mb,[X(uc),yp-.02,0],[.06,.014,.05],.004,HC.GB,2);},30);
    /* the lever, in third */
    const g=GATE[1],b=[X(uc+g[0]),yp-.015,g[1]],t=[X(uc+g[0])+.02,yp+.15,g[1]];
    hdPart(out,mb=>{hdCyl(mb,b,t,.0065,.0055,14,CH);ball(mb,V3.add(t,[.002,.018,0]),.022,20,MM.CHROME);hdCyl(mb,b,V3.add(b,[0,.022,0]),.014,.012,14,HC.GB);},40);}
}
