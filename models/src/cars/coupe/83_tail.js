/* =====================================================================================
   THE COUPE'S TAIL, IN THREE DIMENSIONS (in place of 25_coupe TAILS.coupe's decals):
   - The blade lamps sweeping out and up under the ducktail: a black cavity under a red lens, a red light guide
     glowing along the lower edge, its brake lamp, out round the corner.
   - The lid's shut lines, down the tail and across the deck (the game's outlines).
   - The honeycomb across the tail above the diffuser.
   (The diffuser is the EV's, 79_parts hdDiffuser, without the reversing lamps the game doesn't give the Coupe.)
   ===================================================================================== */
function cpTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body],GUIDE=SV([1,1,1],MAT.TAIL);
  for(const s of [1,-1]){const Lp=[[.22,.70],[.62,.706],[.8,.728],[.87,.762],[.8,.768],[.22,.726]].map(([z,y])=>[s*z,Y(y)]);
    hdLampUnit(out,'R',Lp,cuts,{deep:.035,k:.88,wall:HC.GB,back:()=>HC.GB,bulge:.0015,cell:.004,lens:()=>HC.REDL,tol:.04,
      inside:o=>{const pts=[[.24,.7135],[.5,.7215],[.7,.733],[.79,.7395],[.835,.753]].map(([z,y])=>hdS('R',s*z,Y(y),-.01));hdPart(o,mb=>{hdTube(mb,pts,.0048,10,GUIDE,false,true);},50);
        hdPart(o,mb=>{for(let z=.3;z<=.6;z+=.05)ball(mb,hdS('R',s*z,Y(.719),-.016),.003,8,HC.BULB);},50);}});}
  /* ---------- the lid's shut lines ---------- */
  {const P=[[-.62,.8],[-.6,.55],[.6,.55],[.62,.8]].map(([z,y])=>[z,Y(y)]);const Q=[];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.008));for(let k=0;k<n;k++)Q.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}Q.push(P[P.length-1]);
    hdTrim(out,'R',Q,.005,.0012,HC.GB,false,50,.0012);}
  {const deck=(pts)=>hdPart(out,mb=>{hdSweep(mb,pts,[[-.0025,-.001],[.0025,-.001],[.0025,.0006],[-.0025,.0006]],HC.GB,[0,1,0],true,true);},50);
    {const p=[];for(let z=-.6;z<=.6001;z+=.02)p.push(hdTS(3.98,z,.0002));deck(p);}
    for(const s of [1,-1]){const p=[];for(let t=0;t<=1.0001;t+=.05){const u=3.98+(D.L-.06-3.98)*t;p.push(hdTS(u,s*(.6+.06*t),.0002));}deck(p);}}
  /* ---------- the honeycomb above the diffuser ---------- */
  {const H0=RR2(-.46,.46,Y(.37),Y(.43),.02);for(const c of cuts)hdCut(c,'R',H0);hdRecess(out,'R',H0,.05,.96,HC.GB,()=>HC.GB);
    hdHoney(out,'R',hdShrink(H0,.95),.025,.014,.0016,.012,HC.HONEY);}
  hdDiffuser(out,car,{rev:false});
}
