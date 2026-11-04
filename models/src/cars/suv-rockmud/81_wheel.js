/* =====================================================================================
   THE ROCK & MUD'S WHEEL: its 37x12.5R17 mud-terrain on the 17-inch beadlock the game gives it (30_wheels 'bead'),
   in the build's bronze, modelled for a close look. Same axes and size as the game's wheel.
   - The tyre: a square-shouldered carcass turned in a couple of hundred steps, then the game's pattern built block
     by block: two big staggered lugs a pitch, one either side of the middle, a small block between them, the
     shoulders stepping down onto the sidewall in big lugs, long and short in turn, each block's top crowned.
   - The wheel: a flat face with eight round windows, each with a rolled edge; the black beadlock ring bolted over the
     outer bead with twenty-four bolts; the hub raised in the middle with six nuts, a black cap.
   - The brake (78_run hdBrake): a plain vented rotor and a single-piston caliper.
   ===================================================================================== */
function cwMudTyre(out,w){
  const R=w.R,W=w.W,hw=W/2,rimR=w.rim*.0254/2,dep=.026,base=R-dep,steps=240,TM=HC.TREAD;
  /* the carcass, bead to bead: (r, z) */
  const half=[[rimR+.004,hw*.8],[rimR+.014,hw*.86],[rimR+.03,hw*.95],[rimR+.07,hw*1.0],[R-.16,hw*1.03],[R-.1,hw*1.03],[R-.06,hw*1.0],[R-.04,hw*.97],[base,hw*.92]];
  hdPart(out,mb=>{hdRev(mb,half,steps,HC.WALL,0,TAU,true);hdRev(mb,half.map(([r,z])=>[r,-z]),steps,HC.WALL);
    hdRev(mb,[[base,-hw*.92],[base,hw*.92]],steps,TM);},28);
  /* a block: angles a0 to a1, from the groove floor r0 up to r1, across z0 to z1, its top crowned a little */
  const P3=(a,r,z)=>[Math.cos(a)*r,Math.sin(a)*r,z];
  const blk=(mb,a0,a1,r0,r1,z0,z1,na=4,nz=3)=>{const top=z=>r1-.004*Math.pow(Math.abs(z)/(hw*.95),4);
    for(let i=0;i<na;i++)for(let j=0;j<nz;j++){const A=a0+(a1-a0)*i/na,B=a0+(a1-a0)*(i+1)/na,Z=z0+(z1-z0)*j/nz,Z2=z0+(z1-z0)*(j+1)/nz;
      mb.quad(P3(A,top(Z),Z),P3(B,top(Z),Z),P3(B,top(Z2),Z2),P3(A,top(Z2),Z2),TM[0],0,TM[2]);}
    for(let i=0;i<na;i++){const A=a0+(a1-a0)*i/na,B=a0+(a1-a0)*(i+1)/na;
      mb.quad(P3(A,r0,z0),P3(B,r0,z0),P3(B,top(z0),z0),P3(A,top(z0),z0),TM[0],0,TM[2]);mb.quad(P3(B,r0,z1),P3(A,r0,z1),P3(A,top(z1),z1),P3(B,top(z1),z1),TM[0],0,TM[2]);}
    for(let j=0;j<nz;j++){const Z=z0+(z1-z0)*j/nz,Z2=z0+(z1-z0)*(j+1)/nz;
      mb.quad(P3(a0,r0,Z2),P3(a0,r0,Z),P3(a0,top(Z),Z),P3(a0,top(Z2),Z2),TM[0],0,TM[2]);mb.quad(P3(a1,r0,Z),P3(a1,r0,Z2),P3(a1,top(Z2),Z2),P3(a1,top(Z),Z),TM[0],0,TM[2]);}};
  const np=21,p=TAU/np;
  hdPart(out,mb=>{for(let i=0;i<np;i++){const a=i*p;
    /* the two big lugs, staggered half a pitch, and the small block between */
    blk(mb,a,a+p*.55,base-.002,R,hw*.06,hw*.92);blk(mb,a+p*.5,a+p*1.05,base-.002,R,-hw*.92,-hw*.06);
    blk(mb,a+p*.2,a+p*.38,base-.002,R-.004,-hw*.12,hw*.12,3,2);
    /* the shoulder lugs down each sidewall, long and short in turn */
    for(const s of [1,-1]){const a0=a+(s>0?0:p*.5),a1=a0+p*.42,r0=R-(i%2?.1:.13),z0=s*hw*.94,z1=s*hw*1.07;
      blk(mb,a0,a1,r0,R-.03,Math.min(z0,z1),Math.max(z0,z1),3,2);}}},20);
  return {rimR,hw};
}
function cwWheel(w){
  const spin=new MB(),fixed=new MB();cwMudTyre(spin,w);
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),face=zo-.014,BLK=SV([.025,.025,.027],SM.GLOSSBLK),rO=rimR-.012;
  hdRimParts(spin,w,{lugs:6,pcd:.1397,face:face+.028,lip:BLK,barrel:HC.CAST,lugR:.0115,lugH:.024,lugA:PI/6,valveA:PI/8});
  /* the face: flat, eight round windows, each with a rolled edge */
  const wins=[];for(let i=0;i<8;i++){const a=i/8*TAU+PI/8;wins.push([Math.cos(a)*rO*.6,Math.sin(a)*rO*.6,rO*.17]);}
  hdPart(spin,mb=>{const na=160,nr=26,r0=.08,r1=rO*.94;for(let i=0;i<na;i++)for(let j=0;j<nr;j++){const a=i/na*TAU,b=(i+1)/na*TAU,ra=r0+(r1-r0)*j/nr,rb=r0+(r1-r0)*(j+1)/nr,am=(a+b)/2,rm=(ra+rb)/2,cx=Math.cos(am)*rm,cy=Math.sin(am)*rm;
      if(wins.some(([x,y,r])=>Math.hypot(cx-x,cy-y)<r))continue;
      mb.quad([Math.cos(a)*ra,Math.sin(a)*ra,face],[Math.cos(b)*ra,Math.sin(b)*ra,face],[Math.cos(b)*rb,Math.sin(b)*rb,face],[Math.cos(a)*rb,Math.sin(a)*rb,face],RIMM[0],0,RIMM[2]);}},30);
  for(const [x,y,r] of wins)hdPart(spin,mb=>{const ring=[],back=[];for(let k=0;k<32;k++){const a=k/32*TAU;ring.push([x+Math.cos(a)*r,y+Math.sin(a)*r,face+.001]);back.push([x+Math.cos(a)*r*.97,y+Math.sin(a)*r*.97,face-.03]);}
    hdTube(mb,ring,.0035,8,RIMM,true,false);hdLoft(mb,[ring.map(v=>[v[0],v[1],face-.002]),back],RIMM,true,true);},40);
  /* the face's dished edge out to the ring, the raised hub, the black cap */
  hdPart(spin,mb=>{hdRev(mb,[[rO*.94,face],[rO*.97,face+.004],[rO,face+.012],[rimR-.004,zo-.004]],128,RIMM);},35);
  hdPart(spin,mb=>{hdRev(mb,[[.08,face],[.078,face+.02],[.07,face+.028],[.05,face+.028]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.05,face+.028],[.048,face+.045],[.04,face+.052],[.02,face+.056],[0,face+.057]],48,BLK,0,TAU,true);},40);
  /* the beadlock ring over the outer bead, its bolts */
  hdPart(spin,mb=>{hdRev(mb,[[rimR-.028,zo+.004],[rimR-.026,zo+.016],[rimR+.026,zo+.016],[rimR+.03,zo+.01],[rimR+.03,zo+.0]],128,BLK,0,TAU,true);},35);
  for(let k=0;k<24;k++){const a=k/24*TAU,r=rimR+.002,M=M4T(Math.cos(a)*r,Math.sin(a)*r,0);
    hdPart(spin,mb=>{const hx=[];for(let i=0;i<6;i++){const t=i/6*TAU+PI/6;hx.push([Math.cos(t)*.0075,Math.sin(t)*.0075]);}
      const rings=[hx.map(p=>[p[0],p[1],zo+.016]),hx.map(p=>[p[0],p[1],zo+.024]),hx.map(p=>[p[0]*.8,p[1]*.8,zo+.026])];hdLoft(mb,rings,SMC('#b9bcc2',SM.BOLT),true);hdCap(mb,rings[2],SMC('#b9bcc2',SM.BOLT),true);},20,null,M);}
  hdBrake(spin,fixed,w,{ro:.155,ri:.095,zc:-.03,pistons:1});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
