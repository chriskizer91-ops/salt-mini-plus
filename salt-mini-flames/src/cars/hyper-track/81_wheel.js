/* =====================================================================================
   THE HYPERCAR TRACK'S WHEEL: a 330/680R20 slick on the 20-inch centre-lock race wheel the game gives it
   (30_wheels 'race'), modelled for a close look. Same axes and size as the game's wheel.
   - The slick (hkSlick): the carcass turned as the road tyres' is (78_run's profile), then no tread at all: a smooth,
     gently crowned crown rounding over broad shoulders onto the sidewall, three small wear-gauge holes across it
     at four places round it, a thin band in the build's second colour on the sidewall.
   - The wheel, in the build's dark grey: six spokes from a deep centre, each splitting into two slim spokes out to
     the lip, rounded across, falling concave to the hub; the machined lip.
   - The centre lock: the big hexagon nut in the build's orange over the drive pegs, the safety pin through it.
   - The brake (78_run hdBrake): the big ventilated rotor and a six-piston caliper in the build's orange.
   ===================================================================================== */
function hkSlick(out,w){
  const R=w.R,W=w.W,hw=W/2,rimR=w.rim*.0254/2,sh=R-rimR,steps=Math.round(192*Math.max(1,R/.378)),base=R-.012,fb=(base-rimR)/sh;
  /* the carcass, bead to shoulder (78_run hdTyre's profile, without its fine rings) */
  const P=[[.02,.765],[.08,.805],[.15,.865],[.22,.925],[.262,.968],[.29,.99],[.318,.986],[.345,.966],[.42,.976],[.5,1.0],[.58,1.0],[.66,.996],[.74,.986],[.8,.968],[.86,.94],[.92,.9],[fb,.87]];
  const half=P.map(([f,g])=>[rimR+f*sh,g*hw]),tz=P[P.length-1][1]*hw;
  hdPart(out,mb=>{hdRev(mb,half,steps,HC.WALL,0,TAU,true);hdRev(mb,half.map(([r,z])=>[r,-z]),steps,HC.WALL);},28);
  /* the crown: smooth, crowned a few millimetres, its shoulders rounded */
  const crown=[];for(let i=0;i<=24;i++){const t=-1+2*i/24,a=Math.abs(t),sh2=a>.86?Math.sqrt(Math.max(0,1-Math.pow((a-.86)/.14,2))):1;
    crown.push([base+(R-.003*t*t-base)*sh2,t*tz]);}
  hdPart(out,mb=>{hdRev(mb,crown,steps,HC.TREAD);},40);
  /* the wear gauges: three small holes across the crown at four places round it */
  hdPart(out,mb=>{for(let q=0;q<4;q++){const a0=q/4*TAU+.3;for(const zf of [-.45,0,.45]){const z=zf*tz,r=R-.003*zf*zf-.0002,n=8,ring=[],ringB=[];
      for(let k=0;k<n;k++){const t=k/n*TAU,da=Math.cos(t)*.003/r,dz=Math.sin(t)*.003;ring.push([Math.cos(a0+da)*r,Math.sin(a0+da)*r,z+dz]);ringB.push([Math.cos(a0+da)*(r-.003),Math.sin(a0+da)*(r-.003),z+dz*.8]);}
      hdLoft(mb,[ring,ringB],SV([.012,.012,.013],SM.TREAD),true,true);hdCap(mb,ringB,SV([.012,.012,.013],SM.TREAD),false);}}},0);
  /* the coloured band on the outer sidewall */
  hdPart(out,mb=>{const f0=.5,f1=.56,r0=rimR+f0*sh,r1=rimR+f1*sh;hdRev(mb,[[r1,hw*1.003],[r0,hw*1.003]],steps,SV([1,1,1],MAT.ACCENT));},30);
  return {R,W,hw,rimR,sh};
}
function hkWheel(w){
  const spin=new MB(),fixed=new MB();hkSlick(spin,w);
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),CUT=SMC('#6d7076',SM.BRUSH),CAL=SV([1,1,1],MAT.CALIPER),face=zo-.07,r0=.085,r1=rimR-.008;
  const fz=r=>face+.014+(zo-.002-face-.014)*Math.pow(clamp((r-r0)/(r1-r0),0,1),.7);
  hdRimParts(spin,w,{lugs:0,face:face+.01,lip:RIMM,barrel:HC.CAST,valveA:PI/6});
  /* the spokes: six, each splitting into two slim ones halfway out */
  for(let k=0;k<6;k++)for(const e of [-1,1]){const am=k/6*TAU,n=16,rings=[];
    for(let i=0;i<=n;i++){const t=i/n,r=r0+(r1-r0)*t,sp=Math.max(0,t-.38)/.62,a=am+e*(.012+.1*Math.pow(sp,1.1)),w2=(t<.38?.0145:.0145-.007*sp)-.001*t,d=.016,c=[Math.cos(a)*r,Math.sin(a)*r,fz(r)],
        sd=[-Math.sin(a),Math.cos(a),0],up=[0,0,1],ring=[];
      for(let j=0;j<14;j++){const q=j/14*TAU,cs=Math.cos(q),sn=Math.sin(q);ring.push(V3.add(c,V3.add(V3.mul(sd,cs*w2),V3.mul(up,sn>0?sn*.0045:sn*d))));}
      rings.push(ring);}
    hdPart(spin,mb=>{hdLoft(mb,rings,RIMM,true);hdCap(mb,rings[0],RIMM,true);hdCap(mb,rings[n],RIMM,false);},40);}
  /* the deep centre, its drive pegs, the hexagon nut and the safety pin */
  hdPart(spin,mb=>{hdRev(mb,[[r0+.012,fz(r0)+.002],[r0,face+.014],[.062,face+.012],[.056,face+.006]],72,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{for(let k=0;k<6;k++){const a=k/6*TAU+PI/6;hdCyl(mb,[Math.cos(a)*.066,Math.sin(a)*.066,face+.004],[Math.cos(a)*.066,Math.sin(a)*.066,face+.016],.006,.006,10,HC.BOLT);}},30);
  hdPart(spin,mb=>{const hx=(r,z)=>{const o=[];for(let i=0;i<6;i++){const t=i/6*TAU;o.push([Math.cos(t)*r,Math.sin(t)*r,z]);}return o;};
    const rings=[hx(.052,face+.006),hx(.056,face+.012),hx(.056,face+.038),hx(.05,face+.046)];hdLoft(mb,rings,CAL,true);hdCap(mb,rings[3],CAL,true);},20);
  hdPart(spin,mb=>{hdRev(mb,[[.034,face+.046],[.03,face+.054],[.018,face+.058],[0,face+.058]],32,CAL,0,TAU,true);},35);
  hdPart(spin,mb=>{hdCyl(mb,[-.05,0,face+.05],[.05,0,face+.05],.0035,.0035,10,MM.CHROME);ball(mb,[.052,0,face+.05],.008,12,MM.CHROME);},35);
  hdPart(spin,mb=>{hdRev(mb,[[r1-.006,fz(r1)-.004],[r1,fz(r1)+.002],[rimR+.004,zo+.006],[rimR+.012,zo+.004]],128,CUT);},35);
  hdBrake(spin,fixed,w,{ro:.2,ri:.12,zc:-.03,pistons:6});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
