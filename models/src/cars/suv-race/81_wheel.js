/* =====================================================================================
   THE RACE'S WHEEL: its 310/680R18 slick on the 18-inch centre-lock the game gives it (30_wheels 'race'), in the
   build's gold, modelled for a close look. Same axes and size as the game's wheel.
   - The slick: a smooth crown, its shoulders well rounded, the sidewall's fine rings, the bead and the rim guard.
   - The wheel: six spokes, each splitting into a Y halfway out, both arms running on to the lip with a little
     sweep, lofted and rounded on top; the face falling concave from the lip to the hub; the centre-lock nut (six
     flats, in the calipers' gold) and its polished nose; no lug nuts.
   - The brake (78_run hdBrake): the big vented rotor and a six-piston caliper in the build's gold.
   ===================================================================================== */
function rcSlick(out,w){
  const R=w.R,W=w.W,hw=W/2,rimR=w.rim*.0254/2,sh=R-rimR,steps=220;
  /* the carcass, bead to crown: (r, z), then the crown across */
  const half=[[rimR+.004,hw*.8],[rimR+.012,hw*.86],[rimR+.022,hw*.93],[rimR+.035,hw*.975],[rimR+sh*.35,hw*1.0],[rimR+sh*.36,hw*1.004],[rimR+sh*.375,hw*1.004],[rimR+sh*.385,hw*1.0],
    [rimR+sh*.6,hw*.995],[R-.045,hw*.975],[R-.022,hw*.94],[R-.008,hw*.88],[R-.002,hw*.8]];
  hdPart(out,mb=>{hdRev(mb,half,steps,HC.WALL,0,TAU,true);hdRev(mb,half.map(([r,z])=>[r,-z]),steps,HC.WALL);},28);
  hdPart(out,mb=>{const cr=[];for(let k=0;k<=12;k++){const z=-hw*.8+hw*1.6*k/12;cr.push([R-.002+.002*(1-Math.pow(z/(hw*.8),2)),z]);}hdRev(mb,cr,steps,HC.TREAD);},20);
}
function rcWheel(w){
  const spin=new MB(),fixed=new MB();rcSlick(spin,w);
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),face=zo-.065,r0=.075,r1=rimR-.008;
  const fz=r=>face+.014+(zo-.002-face-.014)*Math.pow(clamp((r-r0)/(r1-r0),0,1),.8);
  hdRimParts(spin,w,{lugs:0,face:face+.01,lip:RIMM,barrel:HC.CAST,valveA:PI/6});
  /* a spoke: lofted from ra to rb along the angle a(t), half wide w(t), deeper underneath than on top */
  const spoke=(ra,rb,ang,wid,dp)=>{const n=12,rings=[];for(let i=0;i<=n;i++){const t=i/n,r=ra+(rb-ra)*t,a=ang(t),w2=wid(t),c=[Math.cos(a)*r,Math.sin(a)*r,fz(r)],sd=[-Math.sin(a),Math.cos(a),0],ring=[];
      for(let j=0;j<14;j++){const q=j/14*TAU,cs=Math.cos(q),sn=Math.sin(q);ring.push(V3.add(c,V3.add(V3.mul(sd,cs*w2),[0,0,sn>0?sn*.005:sn*dp])));}rings.push(ring);}
    hdPart(spin,mb=>{hdLoft(mb,rings,RIMM,true);hdCap(mb,rings[0],RIMM,true);hdCap(mb,rings[n],RIMM,false);},40);};
  const rm=r1*.52;
  for(let k=0;k<6;k++){const a=k/6*TAU;
    spoke(r0,rm,()=>a,t=>.02-.004*t,.03);
    for(const e of [-1,1])spoke(rm*.9,r1,t=>a+e*(.03+.11*t)+e*.05*t*t,t=>.011-.002*t,.018);}
  /* the hub's face, the machined lip */
  hdPart(spin,mb=>{hdRev(mb,[[r0+.012,fz(r0)+.002],[r0,face+.014],[.056,face+.012],[.05,face+.012]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[r1-.006,fz(r1)-.004],[r1,fz(r1)+.002],[rimR+.004,zo+.006],[rimR+.012,zo+.004]],128,HC.BRUSH);},35);
  /* the centre-lock nut: six flats in the calipers' gold, its polished nose, the safety pin */
  {const CAL=SV([1,1,1],MAT.CALIPER),hx=[];for(let i=0;i<6;i++){const t=i/6*TAU;hx.push([Math.cos(t)*.05,Math.sin(t)*.05]);}
    hdPart(spin,mb=>{const rings=[hx.map(p=>[p[0]*.9,p[1]*.9,face+.012]),hx.map(p=>[p[0],p[1],face+.016]),hx.map(p=>[p[0],p[1],face+.05]),hx.map(p=>[p[0]*.88,p[1]*.88,face+.056])];hdLoft(mb,rings,CAL,true);hdCap(mb,rings[3],CAL,true);},20);
    hdPart(spin,mb=>{hdRev(mb,[[.03,face+.056],[.03,face+.066],[.026,face+.072],[.012,face+.075],[0,face+.0755]],40,MM.CHROME,0,TAU,true);},40);
    hdPart(spin,mb=>{const pts=[];for(let k=0;k<=16;k++){const a=k/16*PI;pts.push([Math.cos(a)*.02,.036+Math.sin(a)*.014,face+.06]);}hdTube(mb,pts,.0018,6,MM.CHROME,false,true);},40);}
  hdBrake(spin,fixed,w,{ro:.18,ri:.11,zc:-.03,pistons:6});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
