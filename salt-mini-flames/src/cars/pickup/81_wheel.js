/* =====================================================================================
   THE PICKUP'S WHEEL: its 285/70R18 all-terrain on the factory 18-inch six-spoke, in the dark grey the game paints
   it (the build's rim colour), modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'at'): chunky staggered blocks either side of a zig-zag centre, a sipe or two in every
     block, stone ejectors, the stepped shoulder blocks and the lugs down the sidewall, long and short in turn.
   - The wheel: six broad spokes, each with a machined channel down its middle, drafted sides, dished out to a
     painted lip; a raised hub face, six chrome lug nuts on a 139.7 mm circle in dark seats, a big gloss black cap.
   - The brake (78_run hdBrake): a 340 mm vented rotor that turns with the wheel; a twin-piston caliper, its bracket
     and the dust shield on a piece of their own that only steers.
   ===================================================================================== */
function pkWheel(w){
  const spin=new MB(),fixed=new MB(),T=hdTyre(spin,w,{kind:'at'}),RIMC=SV([1,1,1],MAT.RIM),hw=w.W/2,face=hw*.77-.038;
  const P=hdRimParts(spin,w,{lugs:6,pcd:.1397,face,lip:RIMC,barrel:HC.CAST,lugR:.0118,lugH:.027,valveA:0});
  const rimR=P.rimR,zo=P.zo;
  /* six spokes: lofted out along the radius, dished from the hub to the lip, a channel down the middle of each */
  hdPart(spin,mb=>{const r0=.088,r1=rimR-.011,n=22;
    for(let k=0;k<6;k++){const a=k/6*TAU+PI/6,ca=Math.cos(a),sa=Math.sin(a),tx=-sa,ty=ca;const rings=[];
      for(let i=0;i<=n;i++){const t=i/n,r=r0+(r1-r0)*t,zf=face+(zo-.004-face)*Math.pow(t,1.5),wt=.07+.05*Math.pow(t,1.1)+.016*sm01((t-.84)/.16),d=.034,ch=.0035*sm01(t/.12)*sm01((1-t)/.12);
        const sec=[[-wt/2-.007,zf-d],[-wt/2-.002,zf-.006],[-wt/2+.002,zf-.0012],[-wt*.3,zf+.0014],[-wt*.17,zf+.0016],[-wt*.13,zf+.0016-ch],[wt*.13,zf+.0016-ch],[wt*.17,zf+.0016],[wt*.3,zf+.0014],[wt/2-.002,zf-.0012],[wt/2+.002,zf-.006],[wt/2+.007,zf-d]];
        rings.push(sec.map(([u,z])=>[ca*r+tx*u,sa*r+ty*u,z]));}
      hdLoft(mb,rings,RIMC,false);}
  },30,[0,0,-.2]);
  /* the hub face: raised, chamfered down into the spokes; the cap's ring */
  hdPart(spin,mb=>{hdRev(mb,[[0,face+.009],[.052,face+.009],[.056,face+.0075],[.086,face+.001],[.098,face-.004],[.102,face-.022]],96,RIMC,0,TAU,true);},30);
  hdPart(spin,mb=>{hdRev(mb,[[.05,face+.009],[.0495,face+.018],[.046,face+.025],[.034,face+.031],[.016,face+.0335],[0,face+.034]],64,HC.GB,0,TAU,true);},50);
  hdPart(spin,mb=>{hdRev(mb,[[.0515,face+.0088],[.0515,face+.012],[.0498,face+.0135]],64,MM.CHROME,0,TAU,true);},50);
  hdBrake(spin,fixed,w,{ro:.17,ri:.104,zc:-.03,pistons:2});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
