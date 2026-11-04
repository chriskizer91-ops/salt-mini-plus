/* =====================================================================================
   THE HYPERCAR'S WHEEL: its 305/30R20 performance tyre on the 20-inch forged wheel the game gives it (30_wheels
   'split', in the build's dark grey), with the game's race brake behind it, modelled for a close look. Same axes
   and size as the game's wheel.
   - The tyre (78_run hdTyre 'perf').
   - The wheel: five forged Y spokes, each one spoke at the hub splitting into two as it runs out to the lip, rounded
     across, its face falling in a deep concave sweep from the lip to the hub; a machined edge along each spoke's
     face; the hub's flat with five nuts, a plain cap; the barrel deep behind the spokes; the lip's face machined.
   - The brake (78_run hdBrake): the big ventilated rotor and a six-piston caliper in the build's yellow.
   ===================================================================================== */
function hpWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'perf'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),CUT=SMC('#6d7076',SM.BRUSH),face=zo-.064,r0=.072,r1=rimR-.008;
  /* the concave fall from the lip to the hub */
  const fz=r=>face+.012+(zo-.002-face-.012)*Math.pow(clamp((r-r0)/(r1-r0),0,1),.75);
  hdRimParts(spin,w,{lugs:5,pcd:.112,face:face+.01,lip:RIMM,barrel:HC.CAST,lugR:.0105,lugH:.022,lugA:PI/5,valveA:0});
  /* the spokes: five, each splitting into two from a third of the way out */
  for(let k=0;k<5;k++)for(const e of [-1,1]){const am=k/5*TAU,n=16,rings=[],edge=[];
    for(let i=0;i<=n;i++){const t=i/n,r=r0+(r1-r0)*t,sp=Math.max(0,t-.22)/.78,a=am+e*(.018+.15*Math.pow(sp,1.15)),w2=.0128-.0045*t,d=.014,c=[Math.cos(a)*r,Math.sin(a)*r,fz(r)],
        sd=[-Math.sin(a),Math.cos(a),0],up=[0,0,1],ring=[];
      for(let j=0;j<14;j++){const q=j/14*TAU,cs=Math.cos(q),sn=Math.sin(q);ring.push(V3.add(c,V3.add(V3.mul(sd,cs*w2),V3.mul(up,sn>0?sn*.0045:sn*d))));}
      rings.push(ring);edge.push(V3.add(c,V3.add(V3.mul(sd,e*w2*.55),[0,0,.0043])));}
    hdPart(spin,mb=>{hdLoft(mb,rings,RIMM,true);hdCap(mb,rings[0],RIMM,true);hdCap(mb,rings[n],RIMM,false);},40);
    /* the machined edge down the spoke's outer side */
    hdPart(spin,mb=>{hdTube(mb,edge.slice(4),.0011,5,CUT,false,true);},40);}
  /* the hub's flat, the cap, the face of the lip (machined) */
  hdPart(spin,mb=>{hdRev(mb,[[r0+.012,fz(r0)+.002],[r0,face+.012],[.05,face+.01],[.042,face+.01]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.042,face+.01],[.04,face+.024],[.034,face+.03],[0,face+.031]],48,HC.GB,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[r1-.006,fz(r1)-.004],[r1,fz(r1)+.002],[rimR+.004,zo+.006],[rimR+.012,zo+.004]],128,CUT);},35);
  hdBrake(spin,fixed,w,{ro:.2,ri:.12,zc:-.03,pistons:6});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
