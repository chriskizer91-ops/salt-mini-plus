/* =====================================================================================
   THE NIGHT RUNNER'S WHEEL: its 300/30R18 performance tyre on the 18-inch centre-lock race wheel the game gives it
   (30_wheels 'race'), in the build's bronze, modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'perf').
   - The wheel: six Y spokes, each a short stem off the hub splitting into two slim arms out to the lip, their faces
     falling in a deep concave sweep from the lip to the hub; the hub's flat; the big hexagonal centre-lock nut in
     the build's cyan, its chrome cap.
   - The brake (78_run hdBrake): the big vented rotor and a six-piston caliper in the build's cyan.
   ===================================================================================== */
function wnWheel(w){
  const spin=new MB(),fixed=new MB();hdTyre(spin,w,{kind:'perf'});
  const rimR=w.rim*.0254/2,hw=w.W/2,zo=hw*.77,RIMM=SV([1,1,1],MAT.RIM),CAL=SV([1,1,1],MAT.CALIPER),face=zo-.075,r0=.062,r1=rimR-.008;
  /* the deep concave fall from the lip to the hub */
  const fz=r=>face+.01+(zo-.003-face-.01)*Math.pow(clamp((r-r0)/(r1-r0),0,1),.75);
  hdRimParts(spin,w,{lugs:0,face:face+.01,lip:RIMM,barrel:RIMM,valveA:PI/6});
  /* a spoke lofted along r: its angle a(t) and half width w(t) at each step, rounded across, deep d behind its face */
  const spoke=(ra,rb,a,wd,d)=>{const n=14,rings=[];
    for(let i=0;i<=n;i++){const t=i/n,r=ra+(rb-ra)*t,an=a(t),w2=wd(t),c=[Math.cos(an)*r,Math.sin(an)*r,fz(r)],sd=[-Math.sin(an),Math.cos(an),0],ring=[];
      for(let j=0;j<12;j++){const q=j/12*TAU,cs=Math.cos(q),sn=Math.sin(q);ring.push(V3.add(c,V3.add(V3.mul(sd,cs*w2),[0,0,sn>0?sn*.004:sn*d])));}rings.push(ring);}
    hdPart(spin,mb=>{hdLoft(mb,rings,RIMM,true);hdCap(mb,rings[0],RIMM,true);hdCap(mb,rings[n],RIMM,false);},40);};
  for(let k=0;k<6;k++){const am=k/6*TAU;
    spoke(r0-.004,.122,()=>am,t=>.017-.003*t,.02);
    for(const e of [-1,1])spoke(.1,r1,t=>am+e*(.03+.12*Math.pow(t,.8)),t=>.0115-.004*t,.016);}
  /* the hub's flat, the nut, its cap */
  hdPart(spin,mb=>{hdRev(mb,[[r0+.008,fz(r0+.008)],[r0,face+.012],[.05,face+.012]],64,RIMM,0,TAU,true);},40);
  {const zt=zo+.002,nut=[],H=(k,r,z)=>[Math.cos(k/6*TAU+PI/6)*r,Math.sin(k/6*TAU+PI/6)*r,z];
    for(const [r,z] of [[.042,face+.012],[.046,face+.018],[.046,zt-.012],[.04,zt]])nut.push([0,1,2,3,4,5].map(k=>H(k,r,z)));
    hdPart(spin,mb=>{hdLoft(mb,nut,CAL,true);hdCap(mb,nut[3],CAL,true);},20);
    hdPart(spin,mb=>{hdRev(mb,[[.028,zt-.002],[.027,zt+.006],[.022,zt+.011],[.012,zt+.0135],[0,zt+.014]],40,MM.CHROME,0,TAU,true);},40);}
  hdBrake(spin,fixed,w,{ro:.165,ri:.1,zc:-.03,pistons:6});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
