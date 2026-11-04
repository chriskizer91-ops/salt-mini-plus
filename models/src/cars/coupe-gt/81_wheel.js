/* =====================================================================================
   THE COUPE GT'S WHEEL: its slick on the 18-inch gold six-spoke centre-lock race wheel the game gives it (30_wheels
   'race', the slick profile), modelled for a close look. Same axes and size as the game's wheel.
   - The slick: a smooth crowned tread rounding hard into the shoulders, a tall sidewall with a moulded rim guard
     over the lip, and the wear holes a slick carries across its tread.
   - The wheel: six Y spokes in the build's gold, each a thick stem off the hub that splits in two out to the lip,
     rounded across and falling in a concave sweep from the lip to the hub; no lug nuts: the big centre-lock nut in
     the caliper's red, six-sided, with its drive pegs round it and a chrome tip, as the game has it.
   - The brake (78_run hdBrake): a big vented rotor and a six-piston caliper in the build's red.
   ===================================================================================== */
function cgSlick(out,w){
  const R=w.R,hw=w.W/2,rimR=w.rim*.0254/2,sh=R-rimR,steps=Math.round(192*Math.max(1,R/.378));
  /* the sidewall, bead to shoulder (f up the sidewall, g as a share of the half width), the rim guard near the bead */
  const P=[[.02,.78],[.08,.83],[.13,.9],[.17,.945],[.2,.955],[.235,.95],[.27,.965],[.4,.99],[.55,1.0],[.7,.993],[.8,.975],[.86,.955]];
  const half=P.map(([f,g])=>[rimR+f*sh,g*hw]);
  /* the tread: crowned, rounding into the shoulders */
  const sR=[[.86,.955],[.905,.935],[.94,.905],[.965,.865],[.985,.81],[.996,.74],[1,.6],[1,.3],[1,0]].map(([f,g])=>[rimR+f*sh,g*hw]);
  const T=sR.concat(sR.slice(0,-1).reverse().map(([r,z])=>[r,-z]));
  hdPart(out,mb=>{hdRev(mb,half,steps,HC.WALL,0,TAU,true);hdRev(mb,half.map(([r,z])=>[r,-z]),steps,HC.WALL);},28);
  hdPart(out,mb=>{hdRev(mb,T.slice().reverse(),steps,HC.TREAD);},28);
  /* the wear holes: small round dimples in three lines round the tread */
  hdPart(out,mb=>{for(let i=0;i<6;i++)for(const zf of [-.45,0,.45]){const a=(i+(zf?.5:0))/6*TAU,c=Math.cos(a),s=Math.sin(a),z=zf*hw;
    const ring=(r,d)=>{const o=[];for(let k=0;k<10;k++){const t=k/10*TAU,dz=Math.cos(t)*r,da=Math.sin(t)*r/R;o.push([Math.cos(a+da)*(R-d),Math.sin(a+da)*(R-d),z+dz]);}return o;};
    const A=ring(.005,-.0003),B=ring(.004,.003);hdLoft(mb,[A,B],HC.TREAD,true);hdCap(mb,B,SV([.012,.012,.013],SM.TREAD),true);}},40);
}
function cgWheel(w){
  const spin=new MB(),fixed=new MB();cgSlick(spin,w);
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),CAL=SV([1,1,1],MAT.CALIPER),face=zo-.052,r0=.07,r1=rimR-.008,rm=r0+(r1-r0)*.4;
  /* the concave fall from the lip to the hub */
  const fz=r=>face+.012+(zo-.002-face-.012)*Math.pow(clamp((r-r0)/(r1-r0),0,1),.8);
  hdRimParts(spin,w,{lugs:0,face:face+.01,lip:RIMM,barrel:HC.CAST,valveA:PI/6});
  /* a spoke: lofted along (r, angle) from rA to rB, wa to wb half wide, d deep behind its face */
  const spoke=(rA,rB,aA,aB,wa,wb,d)=>{const n=12,rings=[];
    for(let i=0;i<=n;i++){const t=i/n,r=rA+(rB-rA)*t,a=aA+(aB-aA)*t,w2=wa+(wb-wa)*t,c=[Math.cos(a)*r,Math.sin(a)*r,fz(r)],sd=[-Math.sin(a),Math.cos(a),0],up=[0,0,1],ring=[];
      for(let j=0;j<12;j++){const q=j/12*TAU,cs=Math.cos(q),sn=Math.sin(q);ring.push(V3.add(c,V3.add(V3.mul(sd,cs*w2),V3.mul(up,sn>0?sn*.0045:sn*d))));}
      rings.push(ring);}
    hdPart(spin,mb=>{hdLoft(mb,rings,RIMM,true);hdCap(mb,rings[0],RIMM,true);hdCap(mb,rings[n],RIMM,false);},40);};
  for(let k=0;k<6;k++){const am=k/6*TAU;
    spoke(r0-.004,rm+.012,am,am,.0165,.0135,.016);
    for(const e of [-1,1])spoke(rm-.004,r1,am+e*.035,am+e*.115,.0085,.0072,.013);}
  /* the hub's flat, the face of the lip */
  hdPart(spin,mb=>{hdRev(mb,[[r0+.01,fz(r0)+.002],[r0,face+.012],[.052,face+.01],[.03,face+.01]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[r1-.006,fz(r1)-.004],[r1,fz(r1)+.002],[rimR+.004,zo+.006],[rimR+.012,zo+.004]],128,RIMM);},35);
  /* the centre-lock: six drive pegs round the hub, the six-sided nut in red, the chrome tip */
  for(let k=0;k<6;k++){const a=k/6*TAU+PI/6,c=[Math.cos(a)*.044,Math.sin(a)*.044];hdPart(spin,mb=>{hdCyl(mb,[c[0],c[1],face+.008],[c[0],c[1],face+.022],.006,.0055,12,HC.BOLT);},40);}
  hdPart(spin,mb=>{const hx=(r,z)=>{const o=[];for(let i=0;i<6;i++){const t=i/6*TAU;o.push([Math.cos(t)*r,Math.sin(t)*r,z]);}return o;};
    const rings=[hx(.03,face+.01),hx(.036,face+.016),hx(.036,face+.044),hx(.031,face+.05)];hdLoft(mb,rings,CAL,true);hdCap(mb,rings[3],CAL,true);},20);
  hdPart(spin,mb=>{hdRev(mb,[[.019,face+.049],[.019,face+.06],[.016,face+.065],[.008,face+.067],[0,face+.067]],32,MM.CHROME,0,TAU,true);},45);
  hdBrake(spin,fixed,w,{ro:.165,ri:.1,zc:-.03,pistons:6});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
