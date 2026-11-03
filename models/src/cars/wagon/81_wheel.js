/* =====================================================================================
   THE WAGON'S WHEEL: its 205/60R16 touring tyre on a 16-inch steel wheel under a plastic wheel cover, as the game
   gives it (30_wheels 'cap'), modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'hwy'): the SUV's all-season ribs and sipes, sized to the Wagon.
   - The wheel cover, painted plastic in the build's silver: its edge turned into the rim's lip, a raised outer ring, a band of ten
     slots with the ribs between them standing a little proud, a plain domed centre with a ring pressed round it;
     a notch for the valve.
   - The steel wheel behind it: black, its face pressed in a step, with ten windows lined up behind the cover's
     slots, five lug nuts on a 108 mm circle; the barrel and lip (78_run hdRimParts).
   - The brake (78_run hdBrake), seen through the slots: the turbo car's bigger vented rotor and a twin-piston
     caliper, the one thing the game says gives the car away.
   ===================================================================================== */
function wgWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'hwy'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,STEEL=SMC('#1c1d1f',SM.PAINTED),COV=SMC('#c3c6cb',SM.PAINTED),n=10,ph=.5/n;
  /* ---------- the steel wheel: a stepped pressed face, ten windows, the nuts ---------- */
  const sf=zo-.03,sz=r=>r<.075?sf+.012:r<.095?sf+.012-(r-.075)/.02*.012:r<rimR-.03?sf:sf-(r-(rimR-.03))/.018*.02;
  hdPart(spin,mb=>{hdDiscWin(mb,{rIn:.03,rOut:rimR-.012,zAt:sz,m:STEEL,n,r0:.112,r1:.158,frac:.42,phase:ph,thick:.004,na:14,nr:14});},35);
  hdRimParts(spin,w,{lugs:5,pcd:.108,face:sf+.012,lip:STEEL,barrel:STEEL,lugR:.0105,lugH:.024,lugA:PI/10,valveA:0});
  /* ---------- the wheel cover ---------- */
  const cz=[[rimR+.014,zo+.004],[rimR+.008,zo+.016],[.19,zo+.025],[.18,zo+.026],[.17,zo+.022],[.163,zo+.026],[.115,zo+.036],[.072,zo+.040],[.068,zo+.037],[.064,zo+.037],[.06,zo+.041],[.03,zo+.0435],[0,zo+.044]];
  const czAt=r=>{if(r>=cz[0][0])return cz[0][1];for(let i=0;i<cz.length-1;i++){const [ra,za]=cz[i],[rb,zb]=cz[i+1];if(r<=ra&&r>=rb)return za+(zb-za)*(ra-r)/Math.max(1e-9,ra-rb);}return cz[cz.length-1][1];};
  /* (the ribs between the slots stand a millimetre and a half proud: the band is drawn at its own height) */
  hdPart(spin,mb=>{hdDiscWin(mb,{rIn:.075,rOut:rimR+.014,zAt:r=>czAt(r)+(r>.112&&r<.166?.0015*Math.sin(PI*(r-.112)/.054):0),m:COV,n,r0:.118,r1:.16,frac:.5,phase:ph,thick:.008,na:16,nr:24});},30);
  hdPart(spin,mb=>{hdRev(mb,cz.filter(([r])=>r<=.075).concat([[0,zo+.044]]).filter((v,i,a)=>i===0||v[0]!==a[i-1][0]),64,COV,0,TAU,true);},30);
  /* the cover's back: its rolled edge, so it shows no gap against the lip */
  hdPart(spin,mb=>{hdRev(mb,[[rimR+.014,zo+.004],[rimR+.006,zo-.002],[rimR-.004,zo+.002]],96,COV);},30);
  hdBrake(spin,fixed,w,{ro:.15,ri:.09,zc:-.024,pistons:2});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
