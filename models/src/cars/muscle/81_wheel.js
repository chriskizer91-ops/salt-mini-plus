/* =====================================================================================
   THE MUSCLE'S WHEEL: its 235/60R15 tyre on the 15-inch chrome five-spoke the game gives it (30_wheels 'mag'),
   modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'hwy').
   - The wheel, in chrome: five slim spokes with tall windows between them, a polished lip, five chrome nuts round a
     small chrome cap.
   - The brake (78_run hdBrake): a small plain rotor and a single-piston caliper, as a 1970 car had.
   ===================================================================================== */
function muWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'hwy'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),n=5,face=zo-.03;
  const fz=r=>face+.01+(zo-.004-face-.01)*Math.pow(clamp((r-.07)/(rimR-.07),0,1),1.4);
  hdRimParts(spin,w,{lugs:5,pcd:.1143,face:face+.008,lip:HC.BRUSH,barrel:HC.CAST,lugR:.01,lugH:.022,lugA:PI/5,lugM:MM.CHROME,valveA:PI/n});
  hdPart(spin,mb=>{hdDiscWin(mb,{rIn:.07,rOut:rimR-.006,zAt:fz,m:RIMM,n,r0:.088,r1:.158,frac:.62,phase:.1,thick:.035,na:16,nr:18});},32);
  hdPart(spin,mb=>{hdRev(mb,[[rimR-.006,fz(rimR-.006)],[rimR,zo+.004],[rimR+.006,zo+.008],[rimR+.013,zo+.005]],128,HC.BRUSH);},35);
  /* the hub's flat, the nuts on it, the small chrome cap */
  hdPart(spin,mb=>{hdRev(mb,[[.07,fz(.07)],[.066,face+.008],[.044,face+.008]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.044,face+.008],[.042,face+.026],[.033,face+.034],[.015,face+.037],[0,face+.0375]],48,MM.CHROME,0,TAU,true);},40);
  hdBrake(spin,fixed,w,{ro:.13,ri:.08,zc:-.022,pistons:1});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
