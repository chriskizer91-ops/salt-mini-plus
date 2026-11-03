/* =====================================================================================
   THE EV'S WHEEL: its 265/35R21 performance tyre on the 21-inch five-spoke aero wheel the game gives it (30_wheels
   'five'), modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'perf'): directional blocks either side of a notched centre rib, sized to the EV.
   - The wheel, in the build's silver: five broad spokes widening to the rim, their faces dished down to the hub;
     five deep windows between them; a flat aero ring round the outside in gloss black, standing a little proud,
     a turned groove where it meets the spokes; a plain flush centre cap; five nuts on a 120 mm circle.
   - The brake (78_run hdBrake): a big vented rotor and a four-piston caliper, in the build's dark grey.
   ===================================================================================== */
function evWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'perf'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),n=5,face=zo-.034;
  /* the face's height across it: a dish from the hub out to the lip */
  const fz=r=>face+.006+(zo-.004-face-.006)*Math.pow(clamp((r-.07)/(rimR-.07),0,1),1.6);
  hdRimParts(spin,w,{lugs:5,pcd:.12,face:face+.004,lip:RIMM,barrel:HC.CAST,lugR:.011,lugH:.022,lugA:PI/5,valveA:PI/5+PI/n*.5});
  /* the spokes and the windows between them */
  hdPart(spin,mb=>{hdDiscWin(mb,{rIn:.062,rOut:rimR-.006,zAt:fz,m:RIMM,n,r0:.095,r1:.215,frac:.56,phase:0,thick:.05,na:18,nr:22});},32);
  /* the aero ring over the spokes' outer ends: a flat band in gloss black, its edges rolled */
  hdPart(spin,mb=>{hdRev(mb,[[rimR-.004,fz(rimR-.004)+.002],[rimR-.012,fz(rimR-.012)+.007],[.232,fz(.232)+.008],[.222,fz(.222)+.0075],[.219,fz(.219)+.003]],120,HC.GB);},35);
  hdPart(spin,mb=>{hdRev(mb,[[.219,fz(.219)+.003],[.216,fz(.216)-.002],[.2135,fz(.2135)-.004]],120,HC.CAST);},35);
  /* the hub's flat and the flush centre cap */
  hdPart(spin,mb=>{hdRev(mb,[[.062,fz(.062)],[.058,face+.008],[.05,face+.009],[.044,face+.016],[.038,face+.018],[.02,face+.019],[0,face+.019]],48,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.036,face+.0185],[.034,face+.021],[0,face+.0215]],48,HC.GB,0,TAU,true);},40);
  hdBrake(spin,fixed,w,{ro:.19,ri:.115,zc:-.028,pistons:4});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
