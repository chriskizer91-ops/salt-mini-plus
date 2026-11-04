/* =====================================================================================
   THE WEDGE'S WHEEL: its 245/40R16 performance tyre on the 16-inch five-spoke the game gives it (30_wheels 'five'),
   in the build's light silver, modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'perf').
   - The wheel: a dished disc with five big windows (78_run hdDiscWin), so the five spokes widen out to a flat ring
     inside the lip, their faces falling in a shallow sweep from the ring to the hub; the hub's flat with five nuts
     between the spokes, a plain domed cap.
   - The brake (78_run hdBrake): a vented rotor and a twin-piston caliper in the build's dark grey.
   ===================================================================================== */
function wdWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'perf'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),face=zo-.05,rI=.075,rO=rimR-.03;
  /* the spokes' sweep: low at the hub, up to the flat ring */
  const fz=r=>face+.012+(zo-.008-face-.012)*Math.pow(clamp((r-rI)/(rO-rI),0,1),1.25);
  hdRimParts(spin,w,{lugs:5,pcd:.108,face:face+.01,lip:RIMM,barrel:HC.CAST,lugR:.0105,lugH:.022,valveA:PI/5});
  hdPart(spin,mb=>{hdDiscWin(mb,{rIn:rI,rOut:rO,zAt:fz,m:RIMM,n:5,r0:.098,r1:rO-.016,frac:.56,phase:0,thick:.04,na:16,nr:16});},32);
  /* the flat ring inside the lip, a small step up from the spokes */
  hdPart(spin,mb=>{hdRev(mb,[[rO,fz(rO)],[rO+.002,zo-.003],[rimR-.006,zo-.003],[rimR,zo+.004],[rimR+.006,zo+.008],[rimR+.013,zo+.005]],128,RIMM);},35);
  /* the hub's flat, the nuts on it, the cap */
  hdPart(spin,mb=>{hdRev(mb,[[rI,fz(rI)],[rI-.004,face+.01],[.044,face+.01]],64,RIMM,0,TAU,true);},40);
  hdPart(spin,mb=>{hdRev(mb,[[.044,face+.01],[.042,face+.024],[.034,face+.031],[.016,face+.034],[0,face+.0345]],48,RIMM,0,TAU,true);},40);
  hdBrake(spin,fixed,w,{ro:.135,ri:.083,zc:-.022,pistons:2});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
