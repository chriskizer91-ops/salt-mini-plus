/* =====================================================================================
   THE TRAIL'S WHEEL: its 265/75R17 all-terrain on the 17-inch five-spoke the game gives it (30_wheels 'five'), in
   the build's dark grey, modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'at'): chunky staggered blocks with sipes and stone ejectors, lugs down the sidewall.
   - The wheel: five broad, flat spokes with deep pockets between them; a raised machined ring at the lip; the hub
     raised in the middle with six nuts on a 139.7 mm circle, the cap over the centre.
   - The brake (78_run hdBrake): a plain vented rotor and a single-piston caliper.
   ===================================================================================== */
function trWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'at'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),n=5,face=zo-.04;
  const fz=r=>face+.012+(zo-.006-face-.012)*Math.pow(clamp((r-.085)/(rimR-.085),0,1),1.3);
  hdRimParts(spin,w,{lugs:6,pcd:.1397,face:face+.01,lip:RIMM,barrel:HC.CAST,lugR:.0115,lugH:.024,lugA:PI/6,valveA:PI/n});
  /* the spokes and the pockets between them */
  hdPart(spin,mb=>{hdDiscWin(mb,{rIn:.088,rOut:rimR-.008,zAt:fz,m:RIMM,n,r0:.11,r1:.185,frac:.5,phase:.1,thick:.06,na:16,nr:20});},32);
  /* the machined ring at the lip */
  hdPart(spin,mb=>{hdRev(mb,[[rimR-.008,fz(rimR-.008)],[rimR-.004,fz(rimR-.008)+.006],[rimR+.004,zo+.006],[rimR+.012,zo+.004]],128,HC.BRUSH);},35);
  /* the raised hub, the nuts sit on it; the centre cap */
  hdPart(spin,mb=>{hdRev(mb,[[.088,fz(.088)],[.084,face+.012],[.06,face+.011],[.052,face+.011]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.052,face+.011],[.05,face+.03],[.045,face+.038],[.02,face+.042],[0,face+.043]],48,HC.GB,0,TAU,true);},40);
  hdBrake(spin,fixed,w,{ro:.155,ri:.095,zc:-.03,pistons:1});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
