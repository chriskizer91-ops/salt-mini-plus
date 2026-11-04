/* =====================================================================================
   THE COUPE'S WHEEL: its 275/35R20 performance tyre on the 20-inch split five-spoke the game gives it (30_wheels
   'split'), in the build's bright silver, modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'perf').
   - The wheel: five pairs of slim spokes, each spoke lofted from the hub out to the lip, rounded across, its face
     falling in a concave sweep from the lip to the hub; the hub's flat with five nuts, a plain cap; the barrel deep
     behind the spokes.
   - The brake (78_run hdBrake): the big vented rotor and a six-piston caliper in the build's red.
   ===================================================================================== */
function cpWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'perf'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),face=zo-.058,r0=.07,r1=rimR-.008;
  /* the concave fall from the lip to the hub */
  const fz=r=>face+.012+(zo-.002-face-.012)*Math.pow(clamp((r-r0)/(r1-r0),0,1),.8);
  hdRimParts(spin,w,{lugs:5,pcd:.112,face:face+.01,lip:RIMM,barrel:HC.CAST,lugR:.0105,lugH:.022,lugA:0,valveA:PI/5});
  /* the spokes: five pairs either side of each pair's middle */
  for(let k=0;k<5;k++)for(const e of [-1,1]){const am=k/5*TAU,n=14,rings=[];
    for(let i=0;i<=n;i++){const t=i/n,r=r0+(r1-r0)*t,a=am+e*(.07+.045*t),w2=.0105-.003*t,d=.013,c=[Math.cos(a)*r,Math.sin(a)*r,fz(r)],
        sd=[-Math.sin(a),Math.cos(a),0],up=[0,0,1],ring=[];
      for(let j=0;j<12;j++){const q=j/12*TAU,cs=Math.cos(q),sn=Math.sin(q);ring.push(V3.add(c,V3.add(V3.mul(sd,cs*w2),V3.mul(up,sn>0?sn*.004:sn*d))));}
      rings.push(ring);}
    hdPart(spin,mb=>{hdLoft(mb,rings,RIMM,true);hdCap(mb,rings[0],RIMM,true);hdCap(mb,rings[n],RIMM,false);},40);}
  /* the hub's flat, the cap, the face of the lip */
  hdPart(spin,mb=>{hdRev(mb,[[r0+.01,fz(r0)+.002],[r0,face+.012],[.05,face+.01],[.042,face+.01]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.042,face+.01],[.04,face+.024],[.034,face+.03],[0,face+.031]],48,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[r1-.006,fz(r1)-.004],[r1,fz(r1)+.002],[rimR+.004,zo+.006],[rimR+.012,zo+.004]],128,RIMM);},35);
  hdBrake(spin,fixed,w,{ro:.19,ri:.115,zc:-.03,pistons:6});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
