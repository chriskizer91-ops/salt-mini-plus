/* =====================================================================================
   THE SLEEPER'S WHEEL: its 285/45R20 performance tyre on the 20-inch ten-spoke the game gives it (30_wheels 'ten'),
   in the build's dark red, modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'perf').
   - The wheel: ten slim spokes, each lofted from the hub out to the lip, rounded on top and deeper underneath, a
     little swept toward the lip, the face falling in a concave sweep from the lip to the hub; a machined ring at the
     lip; the hub's flat with five nuts on a 114.3 mm circle between the spokes, a cap over the centre.
   - The brake (78_run hdBrake): the big vented rotor and a six-piston caliper in the build's red.
   ===================================================================================== */
function slWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'perf'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),face=zo-.06,r0=.074,r1=rimR-.008;
  /* the concave fall from the lip to the hub */
  const fz=r=>face+.012+(zo-.002-face-.012)*Math.pow(clamp((r-r0)/(r1-r0),0,1),.85);
  hdRimParts(spin,w,{lugs:5,pcd:.1143,face:face+.01,lip:RIMM,barrel:HC.CAST,lugR:.0105,lugH:.022,lugA:PI/10,valveA:3*PI/10});
  /* the spokes */
  for(let k=0;k<10;k++){const am=k/10*TAU,n=16,rings=[];
    for(let i=0;i<=n;i++){const t=i/n,r=r0+(r1-r0)*t,a=am+.05*t*t,w2=.0115+.0075*t,d=.016-.005*t,c=[Math.cos(a)*r,Math.sin(a)*r,fz(r)],
        sd=[-Math.sin(a),Math.cos(a),0],up=[0,0,1],ring=[];
      for(let j=0;j<14;j++){const q=j/14*TAU,cs=Math.cos(q),sn=Math.sin(q);ring.push(V3.add(c,V3.add(V3.mul(sd,cs*w2),V3.mul(up,sn>0?sn*.0045:sn*d))));}
      rings.push(ring);}
    hdPart(spin,mb=>{hdLoft(mb,rings,RIMM,true);hdCap(mb,rings[0],RIMM,true);hdCap(mb,rings[n],RIMM,false);},40);}
  /* the hub's flat, the cap with a dark centre, the machined face of the lip */
  hdPart(spin,mb=>{hdRev(mb,[[r0+.01,fz(r0)+.002],[r0,face+.012],[.05,face+.01],[.042,face+.01]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.042,face+.01],[.04,face+.024],[.034,face+.03],[.022,face+.031]],48,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.022,face+.031],[.018,face+.0325],[0,face+.033]],32,HC.GB,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[r1-.006,fz(r1)-.004],[r1,fz(r1)+.002],[rimR+.004,zo+.006],[rimR+.012,zo+.004]],128,HC.BRUSH);},35);
  hdBrake(spin,fixed,w,{ro:.19,ri:.115,zc:-.03,pistons:6});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
