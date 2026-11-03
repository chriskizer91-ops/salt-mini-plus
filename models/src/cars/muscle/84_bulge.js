/* =====================================================================================
   THE MUSCLE'S POWER BULGE (in place of 28_muscle HOODS.bulge, the same shape drawn finer: forty steps along it
   instead of ten, twenty-four across instead of six): a raised panel up the middle of the bonnet, rising quickly
   behind its front lip and falling away toward the windshield, its sides rounding down into the bonnet. Built on
   the bonnet, so it lifts with it.
   ===================================================================================== */
function muBulge(out,car){
  const K=HDK,D=K.D,X=K.X,topY=D.topY,u0=.42,u1=1.25,n=40,m=24,w=.2,PA=SV([1,1,1],MAT.PAINT);
  /* (the game's height: up to five centimetres, full a tenth of the way back, easing off toward the back) */
  const h=u=>{const t=(u-u0)/(u1-u0);return .05*Math.min(1,t*8+.15)*(1-.3*t);};
  const rows=[];for(let i=0;i<=n;i++){const u=u0+(u1-u0)*i/n,row=[];
    for(let k=0;k<=m;k++){const q=-1+2*k/m,z=q*(w+.02),edge=Math.abs(q)>w/(w+.02)?(Math.abs(q)-w/(w+.02))/(1-w/(w+.02)):0,
        c=Math.pow(Math.cos(Math.min(1,Math.abs(q)*(w+.02)/w)*PI/2),.35),lift=h(u)*(edge>0?0:c)+.0015;
      row.push([X(u),topY(u,Math.abs(z))+lift,z]);}
    rows.push(row);}
  hdPart(out,mb=>{for(let i=0;i<n;i++)for(let k=0;k<m;k++)mb.quad(rows[i][k],rows[i+1][k],rows[i+1][k+1],rows[i][k+1],PA[0],0,PA[2]);},40);
  /* its front lip: the face from the bonnet up to the bulge's leading edge */
  hdPart(out,mb=>{const f=rows[0];for(let k=0;k<m;k++){const a=f[k],b=f[k+1];mb.quad([a[0]+.0005,topY(u0,Math.abs(a[2]))-.002,a[2]],[b[0]+.0005,topY(u0,Math.abs(b[2]))-.002,b[2]],b,a,PA[0],0,PA[2]);}},30);
}
