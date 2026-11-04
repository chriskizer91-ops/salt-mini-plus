/* =====================================================================================
   THE COUPE GT'S BONNET (in place of 23_parts HOODS.vents's decals), on the decals' own outlines:
   - The two louvred vents: each let into the bonnet, a dark pocket under nine carbon louvres leaning back, in a thin
     black frame.
   - The bonnet pins: a chrome pin through a round plate near each front corner, its clip lying across it on a lanyard.
   Built on the bonnet, so they lift with it.
   ===================================================================================== */
function cgHood(out,car){
  const K=HDK,D=K.D,o=D.B.fit.ventU||0,CF=SV([1,1,1],MAT.CARBON);
  for(const s of [1,-1]){
    const P=[[.7+o,s*.22],[1.25+o,s*.24],[1.25+o,s*.58],[.7+o,s*.52]];cgLouvreTop(out,[car.hood],s>0?P:P.slice().reverse(),{deep:.05,n:9,u0:.75+o,pitch:.055,slat:CF});
    /* the pin */
    {const u=.255,z=s*.6,p=hdTS(u,z,0),q=hdTS(u+.01,z,0),r=hdTS(u,z+.01,0),nn=V3.norm(V3.cross(V3.sub(r,p),V3.sub(q,p))),n=nn[1]<0?V3.mul(nn,-1):nn;
      hdPart(out,mb=>{hdCyl(mb,V3.add(p,V3.mul(n,-.002)),V3.add(p,V3.mul(n,.0025)),.017,.016,24,MM.CHROME,true);},40);
      hdPart(out,mb=>{hdCyl(mb,V3.add(p,V3.mul(n,.002)),V3.add(p,V3.mul(n,.026)),.0042,.0042,12,MM.CHROME,true);},40);
      /* the clip: a wire loop through the pin's top, lying back along the bonnet */
      {const t=V3.add(p,V3.mul(n,.02)),f=[-1,0,0],pts=[];for(let k=0;k<=12;k++){const a=k/12*TAU;pts.push(V3.add(t,V3.add(V3.mul(f,.012+Math.cos(a)*.012),[0,Math.sin(a)*.0035,Math.sin(a)*.006*s])));}
        hdPart(out,mb=>{hdTube(mb,pts,.0013,6,MM.CHROME,true,false);},40);}}
  }
}
/* a louvred vent let into a top surface: P its outline (u, z), the n louvres across the car from u0 every pitch */
function cgLouvreTop(out,cuts,P,o){const deep=o.deep||.04,R=hdResample(P,.006),c=hdCen(R);
  for(const s of cuts)hdCutTop(s,P,.03);
  hdPart(out,mb=>{const F=R.map(([u,z])=>hdTS(u,z,.0005)),B=R.map(([u,z])=>hdTS(c[0]+(u-c[0])*.95,c[1]+(z-c[1])*.95,-deep));hdLoft(mb,[F,B],HC.GB,true);hdCap(mb,B,HC.GB,true);},30);
  /* a thin black frame round the mouth */
  hdPart(out,mb=>{const Q=R.map(([u,z])=>hdTS(u,z,.0012));Q.push(Q[0]);hdTube(mb,Q,.0022,6,HC.GB,false,false);},40);
  const span=u=>{let a=1e9,b=-1e9;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];if((p[0]-u)*(q[0]-u)>0)continue;const t=Math.abs(q[0]-p[0])<1e-9?0:(u-p[0])/(q[0]-p[0]),z=p[1]+(q[1]-p[1])*t;a=Math.min(a,z);b=Math.max(b,z);}return [a,b];};
  hdPart(out,mb=>{for(let k=0;k<o.n;k++){const u=o.u0+k*o.pitch+.01;const [a,b]=span(u);if(b-a<.02)continue;const path=[];
    for(let i=0;i<=12;i++){const z=a+.004+(b-a-.008)*i/12;path.push(hdTS(u,z,-.003));}
    /* each louvre: a blade 2 cm long in u, its front edge up at the surface, leaning back and down */
    hdSweep(mb,path,[[-.011,-.0012],[.011,-.014],[.011,-.0105],[-.011,.0018]],o.slat,[0,1,0],true,true);}},30);
}
