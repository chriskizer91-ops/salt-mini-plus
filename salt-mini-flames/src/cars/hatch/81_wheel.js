/* =====================================================================================
   THE HATCH'S WHEEL: its 195/60R15 performance tyre on the white 15-inch flat-face rally wheel the game gives it,
   modelled for a close look. Same axes and size as the game's wheel.
   - The tyre (78_run hdTyre 'perf'): a notched centre rib, directional blocks running out to the shoulders, a sipe
     in each, square shoulder blocks.
   - The wheel: a flat white face, gently dished, with eight round windows cut right through it (the brake shows
     through them), their edges rolled; the lip; the hub with four chrome lug nuts on a 100 mm circle; a plain cap.
   - The brake (78_run hdBrake): a small vented rotor that turns with the wheel; the caliper and the shield apart.
   ===================================================================================== */
function htWheel(w){
  const spin=new MB(),fixed=new MB(),T=hdTyre(spin,w,{kind:'perf'}),WH=SMC('#ece9e2',SM.WHITE),hw=w.W/2,face=hw*.77-.016;
  const P=hdRimParts(spin,w,{lugs:4,pcd:.1,face:face+.002,lip:WH,barrel:HC.CAST,lugR:.0105,lugH:.022,lugA:PI/4,valveA:PI/8});
  const rimR=P.rimR,zo=P.zo,r0=.062,r1=rimR-.012,nw=8,rw=.034,rc=(r0+r1)/2+.006;
  /* the face: eight sectors, each lofted from its edges in to its window's rim (a gentle dish out to the lip) */
  const zAt=r=>face+(zo-.003-face)*Math.pow(clamp((r-r0)/(r1-r0),0,1),2.2);
  hdPart(spin,mb=>{for(let k=0;k<nw;k++){const a0=(k-.5)/nw*TAU,a1=(k+.5)/nw*TAU,ac=k/nw*TAU,cx=Math.cos(ac)*rc,cy=Math.sin(ac)*rc;
      /* the sector's outline, walked round: the outer arc, a radial edge, the inner arc, the other edge */
      const B=[];const na=10,nr=8;for(let i=0;i<=na;i++){const a=a0+(a1-a0)*i/na;B.push([Math.cos(a)*r1,Math.sin(a)*r1]);}
      for(let i=1;i<nr;i++){const r=r1+(r0-r1)*i/nr;B.push([Math.cos(a1)*r,Math.sin(a1)*r]);}
      for(let i=0;i<=na;i++){const a=a1+(a0-a1)*i/na;B.push([Math.cos(a)*r0,Math.sin(a)*r0]);}
      for(let i=1;i<nr;i++){const r=r0+(r1-r0)*i/nr;B.push([Math.cos(a0)*r,Math.sin(a0)*r]);}
      /* the window: a circle round the sector's middle, as many points as the outline, matched by angle */
      const W=B.map(([x,y])=>{const t=Math.atan2(y-cy,x-cx);return [cx+Math.cos(t)*rw,cy+Math.sin(t)*rw];});
      for(let i=0;i<B.length;i++){const j=(i+1)%B.length,m0=[(B[i][0]+W[i][0])/2,(B[i][1]+W[i][1])/2],m1=[(B[j][0]+W[j][0])/2,(B[j][1]+W[j][1])/2],Z=p=>[p[0],p[1],zAt(Math.hypot(p[0],p[1]))];
        mb.quad(Z(B[i]),Z(B[j]),Z(m1),Z(m0),WH[0],0,WH[2]);mb.quad(Z(m0),Z(m1),Z(W[j]),Z(W[i]),WH[0],0,WH[2]);}
      /* the window's rolled edge, through the face */
      const ring=(d,k2)=>{const o=[];for(let i=0;i<32;i++){const t=i/32*TAU,x=cx+Math.cos(t)*rw*k2,y=cy+Math.sin(t)*rw*k2;o.push([x,y,zAt(Math.hypot(x,y))-d]);}return o;};
      hdLoft(mb,[ring(0,1),ring(.004,.99),ring(.012,.98)],WH,true);}
    /* the face's backing behind the windows' rims, the lip's ring, the hub's flat */
    hdRev(mb,[[r1,zAt(r1)],[r1+.006,zo-.002],[rimR+.004,zo-.006]],96,WH,0,TAU,true);
    hdRev(mb,[[r0,zAt(r0)],[r0-.004,face+.004],[.05,face+.006],[0,face+.006]],64,WH,0,TAU,true);},40);
  /* the plain cap over the hub */
  hdPart(spin,mb=>{hdRev(mb,[[.036,face+.006],[.035,face+.014],[.03,face+.02],[.015,face+.023],[0,face+.024]],48,WH,0,TAU,true);},50);
  hdBrake(spin,fixed,w,{ro:.128,ri:.078,zc:-.022,pistons:1});
  return {spin,fixed,tris:(spin.p.length+fixed.p.length)/9};
}
