/* =====================================================================================
   THE RACE KIT (in place of 23_parts EXTRAS.raceKit), where the game puts it:
   - The roof scoop: a raised shell at the front of the roof, open to the front behind a mesh, falling away to the
     back.
   - The windshield banner: a black film across the top of the windshield.
   - The fuel filler: a polished quick-release cap on the right rear quarter, its flip lid and hinge.
   - The number on each front door: a white roundel, a hair proud of the paint, the game's dot-matrix '06' on it.
   ===================================================================================== */
/* a triangle on a side of the car, turned to face out of that side */
function rcSideTri(mb,a,b,c,s,m){const n=V3.cross(V3.sub(b,a),V3.sub(c,a));if(n[2]*s<0)mb.tri(a,c,b,m[0],m[1],m[2]);else mb.tri(a,b,c,m[0],m[1],m[2]);}
function rcKit(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,topY=D.topY,PA=SV([1,1,1],MAT.PAINT);
  /* ---------- the roof scoop ---------- */
  {const u0=G.rf+.12,u1=u0+.45,w=.2,h=.07,n=20,m=12,hgt=(u,f)=>h*(1-(u-u0)/(u1-u0))*Math.pow(Math.max(0,Math.cos(f*PI/2)),.3),rows=[];
    for(let i=0;i<=n;i++){const u=u0+(u1-u0)*i/n,row=[];for(let k=0;k<=m;k++){const f=-1+2*k/m,z=f*w;row.push([X(u),topY(u,Math.abs(z))+hgt(u,f)+.0015,z]);}rows.push(row);}
    hdPart(out,mb=>{const R=rows[0].map((_,k)=>rows.map(r=>r[k]));hdLoft(mb,R,PA,false,true);
      for(const k of [0,m]){const e=rows.map(r=>r[k]),f=e.map(p=>[p[0],topY(D.uC-p[0],Math.abs(p[2]))-.004,p[2]]);hdLoft(mb,[e,f],PA,false,k===0);}},40);
    const mouth=rows[0],base=mouth.map(p=>[p[0],topY(u0,Math.abs(p[2]))+.002,p[2]]);
    hdPart(out,mb=>{const back=mouth.map((p,k)=>[p[0]-.05,(p[1]+base[k][1])/2,p[2]*.92]);hdLoft(mb,[mouth,back],HC.GB,false,true);hdLoft(mb,[back,base.map(p=>[p[0]-.05,p[1],p[2]*.92])],HC.GB,false,true);},30);
    hdPart(out,mb=>{for(let k=0;k<=m;k++){const a=mouth[k],d=base[k];hdCyl(mb,[a[0]-.01,a[1]-.002,a[2]],[d[0]-.01,d[1]+.001,d[2]],.0011,.0011,4,HC.HONEY,false);}
      for(let j=1;j<5;j++){const t=j/5;for(let k=0;k<m;k++){const p=V3.lerp(mouth[k],base[k],t),q=V3.lerp(mouth[k+1],base[k+1],t);hdCyl(mb,[p[0]-.01,p[1],p[2]],[q[0]-.01,q[1],q[2]],.0011,.0011,4,HC.HONEY,false);}}},20);
    hdPart(out,mb=>{hdTube(mb,mouth.map(p=>[p[0]-.002,p[1]-.002,p[2]]),.004,8,PA,false,true);},45);}
  /* ---------- the windshield banner ---------- */
  {const BN=SMC('#0f0f10',SM.VINYL),ua=G.rf-.2,ub=G.rf-.02,nz=33,nu=6;
    hdPart(out,mb=>{for(let i=0;i<nu;i++)for(let k=0;k<nz;k++){const u=ua+(ub-ua)*i/nu,v=ua+(ub-ua)*(i+1)/nu,z=-.66+1.32*k/nz,z2=-.66+1.32*(k+1)/nz,P=(uu,zz)=>[X(uu),topY(uu,Math.abs(zz))+.0018,zz];
      mb.quad(P(u,z),P(u,z2),P(v,z2),P(v,z),BN[0],0,BN[2]);}},30);}
  /* ---------- the fuel filler ---------- */
  {const fl=D.B.fit.filler||[D.L-.52,secKeys(D,D.L-.52).yG+.22],c=hdSS(1,fl[0],fl[1],0),M=M4.basis(c,[1,0,0],[0,1,0],[0,0,1]);
    hdPart(out,mb=>{hdRev(mb,[[.052,-.002],[.052,.002],[.049,.005],[.045,.005]],48,MM.CHROME,0,TAU,true);hdRev(mb,[[.045,.005],[.044,.009],[.04,.012],[.02,.013],[0,.0135]],48,MM.CHROME,0,TAU,true);
      hdRBox(mb,[.046,0,.008],[.008,.014,.004],.003,MM.CHROME,2);hdCyl(mb,[.05,-.012,.008],[.05,.012,.008],.003,.003,8,HC.BOLT);hdRBox(mb,[-.04,0,.014],[.01,.006,.002],.002,HC.GB,1);},45,null,M);}
  /* ---------- the number on each front door ---------- */
  {const uc=(G.cowl+G.pillars[0][0])/2+.08,yc=D.belt(uc)-.3,R0=.24,WH=SV([.85,.85,.82],SM.WHITE),BK=SV([.012,.012,.013],SM.GLOSSBLK),cell=.026,txt=D.look.raceNum??'06',wd=txt.length*6-1;
    for(const s of [1,-1]){
      hdPart(out,mb=>{const na=72,nr=8,P=(r,a)=>hdSS(s,uc+Math.cos(a)*r,yc+Math.sin(a)*r,.0008);
        for(let j=0;j<nr;j++)for(let i=0;i<na;i++){const ra=R0*j/nr,rb=R0*(j+1)/nr,a=i/na*TAU,b=(i+1)/na*TAU;
          if(j===0)rcSideTri(mb,P(0,0),P(rb,a),P(rb,b),s,WH);else{rcSideTri(mb,P(ra,a),P(rb,a),P(rb,b),s,WH);rcSideTri(mb,P(ra,a),P(rb,b),P(ra,b),s,WH);}}},30);
      if(!txt)continue;
      hdPart(out,mb=>{for(let ci=0;ci<txt.length;ci++){const g=G5[txt[ci]];if(!g)continue;for(let r=0;r<7;r++)for(let cc=0;cc<5;cc++)if((g[r]>>(4-cc))&1){
        const col=ci*6+cc,du=(col-(wd-1)/2)*cell*(s>0?-1:1),y=yc+(3-r)*cell*1.15,h=cell*.46,hv=cell*.54,Q=(uu,yy)=>hdSS(s,uc+du+uu,y+yy,.0016);
        rcSideTri(mb,Q(-h,-hv),Q(-h,hv),Q(h,hv),s,BK);rcSideTri(mb,Q(-h,-hv),Q(h,hv),Q(h,-hv),s,BK);}}},20);}}
}
