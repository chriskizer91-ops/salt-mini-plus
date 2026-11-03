/* =====================================================================================
   THE RUNNING GEAR FOR THE OTHER CARS, built the way the SUV Studio's wheel is (71_wheel), sized to each car's tyre:
   - hdTyre: the carcass turned in a couple of hundred steps (bead, rim protector, the sidewall's bulge and fine rings,
     the shoulder), then real tread blocks on it, block by block: the all-terrain's chunky staggered blocks with sipes,
     stone ejectors and lugs running down the sidewall; the performance tyre's directional blocks either side of a
     centre rib; the all-season's ribs (the SUV's).
   - hdRimParts: what every wheel has: the barrel (bead seats, drop centre, the lip), the hub, the lug nuts in their
     seats, the valve stem. Each car draws its own face (its spokes or its windows) in its own folder.
   - hdBrake: the SUV's brake, sized to the wheel: the vented rotor (two plates, the vanes, the hat) turns with the
     wheel; the caliper (body, piston housing, bridge ribs, slide-pin boots, bracket, bleeder) and the dust shield do
     not, so they are a piece of their own that only steers.
   Same axes as the game's wheel: the axle along z with the outer face at +z, spin about z, +x forward.
   ===================================================================================== */
/* a smooth profile [[f, g]] (f up the sidewall from the bead, 0 to 1; g across, as a share of the half width):
   the point at f, and the way out of the surface there */
function hdCarc(prof,rimR,sh,hw){
  const at=f=>{f=clamp(f,prof[0][0],prof[prof.length-1][0]);let i=0;while(i<prof.length-2&&prof[i+1][0]<f)i++;const a=prof[i],b=prof[i+1],t=(f-a[0])/Math.max(1e-9,b[0]-a[0]);
    return [rimR+(a[0]+(b[0]-a[0])*t)*sh,(a[1]+(b[1]-a[1])*t)*hw];};
  return {at,out:f=>{const a=at(f-.01),b=at(f+.01),dr=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dr,dz)||1;return [dz/l,-dr/l];}};}
/* the tyre. w: the game's tyre {R, W, rim}; o: {kind 'at' | 'perf' | 'hwy', steps, np (pitches round), depth} */
function hdTyre(out,w,o={}){
  const R=w.R,W=w.W,hw=W/2,rimR=w.rim*.0254/2,sh=R-rimR,kind=o.kind||'hwy',depth=o.depth||(kind==='at'?.016:kind==='perf'?.008:.009),base=R-depth;
  const steps=o.steps||Math.round(192*Math.max(1,R/.378)),fb=(base-rimR)/sh;
  /* the carcass profile, bead to shoulder: (f up the sidewall, g as a share of the half width) */
  const P=[[.02,.765],[.08,.805],[.15,.865],[.22,.925],[.262,.968],[.29,.99],[.318,.986],[.345,.966],[.42,.976],[.5,1.0],[.58,.998],
    [.62,.995],[.623,1.004],[.636,1.004],[.639,.994],[.66,.992],[.663,1.0],[.676,1.0],[.679,.99],[.74,.982],[.8,.962],[.86,.93],[.92,.885],[fb,kind==='perf'?.86:.84]];
  const C=hdCarc(P,rimR,sh,hw),tz=P[P.length-1][1]*hw;
  hdPart(out,mb=>{const half=P.map(([f,g])=>[rimR+f*sh,g*hw]);
    hdRev(mb,half,steps,HC.WALL,0,TAU,true);hdRev(mb,half.map(([r,z])=>[r,-z]),steps,HC.WALL);
    hdRev(mb,[[base,-tz],[base,tz]],steps,kind==='at'?HC.TREADAT:HC.TREAD);},28);
  const TM=kind==='at'?HC.TREADAT:HC.TREAD;
  /* the tread blocks: each a four-cornered outline in (s, z) (s round the tread in metres), from the groove floor to
     the top, the top crowned toward the shoulders */
  const crown=kind==='at'?.35:.55,rTop=z=>{const a=Math.abs(z)/tz;return R-Math.max(0,a-.72)*crown*.02-Math.max(0,a-.88)*.012;};
  const P3=(s,z,r)=>{const a=s/R;return [Math.cos(a)*r,Math.sin(a)*r,z];};
  const blk=(mb,q,dep=depth,ns=3,nz=2)=>{
    const L=(t,u)=>{const a=[q[0][0]+(q[1][0]-q[0][0])*t,q[0][1]+(q[1][1]-q[0][1])*t],b=[q[3][0]+(q[2][0]-q[3][0])*t,q[3][1]+(q[2][1]-q[3][1])*t];return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];};
    for(let i=0;i<ns;i++)for(let j=0;j<nz;j++){const p=[L(i/ns,j/nz),L((i+1)/ns,j/nz),L((i+1)/ns,(j+1)/nz),L(i/ns,(j+1)/nz)];mb.quad(...p.map(v=>P3(v[0],v[1],rTop(v[1]))),TM[0],0,TM[2]);}
    for(let k=0;k<4;k++){const a=q[k],c=q[(k+1)%4],n=k%2===0?ns:nz;
      for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,u=[a[0]+(c[0]-a[0])*t0,a[1]+(c[1]-a[1])*t0],v=[a[0]+(c[0]-a[0])*t1,a[1]+(c[1]-a[1])*t1];
        mb.quad(P3(u[0],u[1],rTop(u[1])-dep-.001),P3(v[0],v[1],rTop(v[1])-dep-.001),P3(v[0],v[1],rTop(v[1])),P3(u[0],u[1],rTop(u[1])),TM[0],0,TM[2]);}}};
  /* a block cut across by a sipe at t (0 to 1 along its length): two blocks a sipe apart */
  const sipe=.0016,blk2=(mb,q,t=.5,dep)=>{const m=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],ta=t-sipe/2/Math.max(.01,Math.hypot(q[1][0]-q[0][0],q[1][1]-q[0][1])),tb=t+(t-ta);
    blk(mb,[q[0],m(q[0],q[1],ta),m(q[3],q[2],ta),q[3]],dep);blk(mb,[m(q[0],q[1],tb),q[1],q[2],m(q[3],q[2],tb)],dep);};
  /* a lug standing out of the sidewall between f0 and f1 and two angles: its face h proud of the carcass */
  const lug=(mb,a0,a1,f0,f1,h,side,nf=4,na=3)=>{const pt=(a,f,d)=>{const [r,z]=C.at(f),[nr,nz]=C.out(f);return [Math.cos(a)*(r+nr*d),Math.sin(a)*(r+nr*d),side*(z+nz*d)];};
    const fl=side>0;
    for(let i=0;i<na;i++)for(let j=0;j<nf;j++){const A=a0+(a1-a0)*i/na,B=a0+(a1-a0)*(i+1)/na,F=f0+(f1-f0)*j/nf,G=f0+(f1-f0)*(j+1)/nf;
      const q=[pt(A,F,h),pt(B,F,h),pt(B,G,h),pt(A,G,h)];if(fl)mb.quad(q[0],q[1],q[2],q[3],TM[0],0,TM[2]);else mb.quad(q[0],q[3],q[2],q[1],TM[0],0,TM[2]);}
    const wall=(pa,pb)=>{if(fl)mb.quad(pa(0),pb(0),pb(h),pa(h),TM[0],0,TM[2]);else mb.quad(pa(0),pa(h),pb(h),pb(0),TM[0],0,TM[2]);};
    for(let j=0;j<nf;j++){const F=f0+(f1-f0)*j/nf,G=f0+(f1-f0)*(j+1)/nf;wall(d=>pt(a0,G,d),d=>pt(a0,F,d));wall(d=>pt(a1,F,d),d=>pt(a1,G,d));}
    for(let i=0;i<na;i++){const A=a0+(a1-a0)*i/na,B=a0+(a1-a0)*(i+1)/na;wall(d=>pt(A,f0,d),d=>pt(B,f0,d));wall(d=>pt(B,f1,d),d=>pt(A,f1,d));}};
  hdPart(out,mb=>{
    if(kind==='at'){
      /* all-terrain: a zig-zag centre groove, two staggered rows of chunky blocks a side, big shoulder blocks with a notch,
         a sipe or two in every block, stone ejectors in the grooves, and lugs down the sidewall, long and short in turn */
      const NP=o.np||Math.round(TAU*R/.064),pl=TAU*R/NP,g=.016,gl=.27*pl;
      for(const side of [1,-1]){const ph=side>0?0:.5;
        for(let i=0;i<NP;i++){const s0=(i+ph)*pl,Z=f=>side*f*tz,sl=f=>f*.1*pl*side;
          /* inner row: slanted blocks either side of the centre's zig-zag */
          const zi0=(i%2?.05:.1),zi1=.38;blk2(mb,[[s0+sl(zi0),Z(zi0)],[s0+pl-gl+sl(zi0),Z(zi0)],[s0+pl-gl+sl(zi1),Z(zi1)],[s0+sl(zi1),Z(zi1)]],.45);
          /* the middle row, half a pitch on */
          const m0=.38+g/tz,m1=.7,o2=s0+pl*.5;blk2(mb,[[o2+sl(m0),Z(m0)],[o2+pl-gl+sl(m0),Z(m0)],[o2+pl-gl+sl(m1),Z(m1)],[o2+sl(m1),Z(m1)]],.55);
          /* the shoulder block, stepped: a long outer part and a notched inner end */
          const h0=.7+g/tz,h1=1.0,nt=i%2?.0:.05;blk2(mb,[[s0+nt*pl,Z(h0+.06)],[s0+pl-gl,Z(h0)],[s0+pl-gl,Z(h1)],[s0,Z(h1)]],.5);
          /* the shoulder's drop onto the sidewall, and the sidewall lug below it, long and short in turn */
          {const a0=s0/R,a1=(s0+pl-gl)/R,zz=side*tz;mb.quad(...(side>0?[P3(s0,zz,rTop(zz)),P3(s0+pl-gl,zz,rTop(zz)),P3(s0+pl-gl,side*C.at(.93)[1],C.at(.93)[0]),P3(s0,side*C.at(.93)[1],C.at(.93)[0])]:
              [P3(s0,zz,rTop(zz)),P3(s0,side*C.at(.93)[1],C.at(.93)[0]),P3(s0+pl-gl,side*C.at(.93)[1],C.at(.93)[0]),P3(s0+pl-gl,zz,rTop(zz))]),TM[0],0,TM[2]);
            lug(mb,a0+.004,a1-.004,i%2?.8:.7,.93,.0065,side);}
          /* a stone ejector on the groove floor between the rows */
          {const s=s0+pl*.3,z=Z(.38+g/tz/2);mb.quad(P3(s-.004,z-.002,base+.003),P3(s+.004,z-.002,base+.003),P3(s+.004,z+.002,base+.003),P3(s-.004,z+.002,base+.003),TM[0],0,TM[2]);}}}}
    else if(kind==='perf'){
      /* performance: a continuous centre rib notched every pitch, V blocks running out to the shoulders (pointing the way
         the tyre turns), a sipe in each, the shoulder blocks square and closed */
      const NP=o.np||Math.round(TAU*R/.034),pl=TAU*R/NP;
      {const z0=.1*tz,n=NP*2;for(let i=0;i<n;i++){const s0=i*pl/2,s1=s0+pl/2-.0018;blk(mb,[[s0,-z0],[s1,-z0],[s1,z0],[s0,z0]],depth*.9);}}
      for(const side of [1,-1])for(let i=0;i<NP;i++){const s0=i*pl,Z=f=>side*f*tz,sk=f=>(f-.16)*.55*pl;
        blk2(mb,[[s0+sk(.16),Z(.16)],[s0+pl*.62+sk(.16),Z(.16)],[s0+pl*.62+sk(.56),Z(.56)],[s0+sk(.56),Z(.56)]],.5);
        blk2(mb,[[s0+sk(.62),Z(.62)],[s0+pl*.66+sk(.62),Z(.62)],[s0+pl*.7+sk(1),Z(1)],[s0+sk(1),Z(1)]],.55);
        {const zz=side*tz,a=s0+sk(1),b=a+pl*.7;mb.quad(...(side>0?[P3(a,zz,rTop(zz)),P3(b,zz,rTop(zz)),P3(b+.002,side*C.at(.94)[1],C.at(.94)[0]),P3(a+.002,side*C.at(.94)[1],C.at(.94)[0])]:
            [P3(a,zz,rTop(zz)),P3(a+.002,side*C.at(.94)[1],C.at(.94)[0]),P3(b+.002,side*C.at(.94)[1],C.at(.94)[0]),P3(b,zz,rTop(zz))]),TM[0],0,TM[2]);}}}
    else{
      /* all-season (the SUV's): four ribs, slanted lateral grooves, a sipe in every block, shoulder blocks */
      const NP=o.np||Math.round(TAU*R/.0396),pl=TAU*R/NP;
      for(const side of [1,-1]){const ph=side>0?0:.27;for(let i=0;i<NP;i++){const s0=(i+ph)*pl,g=.21*pl,mid=s0+(pl-g)*.48,Z=f=>side*f*tz;
        blk(mb,[[s0,Z(.57)],[mid-sipe/2,Z(.57)],[mid-sipe/2+.002,Z(1)],[s0+.002,Z(1)]]);blk(mb,[[mid+sipe/2,Z(.57)],[s0+pl-g,Z(.57)],[s0+pl-g+.002,Z(1)],[mid+sipe/2+.002,Z(1)]]);
        const o2=s0+pl*.5,k=.32,gi=.17*pl,cut=o2+(pl-gi)*.5,sl=f=>(f*tz-.008)*k*side;
        blk(mb,[[o2+sl(.08),Z(.08)],[cut-sipe/2+sl(.08),Z(.08)],[cut-sipe/2+sl(.47),Z(.47)],[o2+sl(.47),Z(.47)]]);
        blk(mb,[[cut+sipe/2+sl(.08),Z(.08)],[o2+pl-gi+sl(.08),Z(.08)],[o2+pl-gi+sl(.47),Z(.47)],[cut+sipe/2+sl(.47),Z(.47)]]);}}}
  },20);
  return {R,W,hw,rimR,sh,C};
}
/* what every wheel has: the barrel from the outer flange to the inner one (its outside is under the tyre), the hub,
   lug nuts in dark seats, a cap, the valve stem. o: {lugs, pcd (the lugs' circle, metres), face (the hub's face, z),
   lip (the barrel's outer lip material), cap (null: none), capR, lugM} */
function hdRimParts(out,w,o){
  const rimR=w.rim*.0254/2,hw=w.W/2,face=o.face,zo=hw*.77,zi=-hw*.79;
  hdPart(out,mb=>{hdRev(mb,[[rimR+.004,zo-.008],[rimR+.014,zo],[rimR+.019,zo+.004],[rimR+.0195,zo+.0075],[rimR+.016,zo+.01]],128,o.lip||HC.BRUSH);
    hdRev(mb,[[rimR+.016,zo+.01],[rimR+.004,zo+.0105],[rimR-.006,zo+.0085],[rimR-.012,zo+.004]],128,o.lip||HC.BRUSH);
    hdRev(mb,[[rimR-.012,zo+.004],[rimR-.012,zo-.016],[rimR-.009,zo-.032],[rimR-.032,zo*.42],[rimR-.034,zi*.38],[rimR-.012,zi*.66],[rimR-.009,zi*.98],[rimR+.004,zi*1.1],[rimR+.016,zi*1.15]],128,o.barrel||HC.CAST);},40);
  if(o.lugs){const pr=o.pcd/2;for(let k=0;k<o.lugs;k++){const a=k/o.lugs*TAU+(o.lugA||PI/o.lugs),cx=Math.cos(a)*pr,cy=Math.sin(a)*pr,M=M4T(cx,cy,0),lr=o.lugR||.0115;
    hdPart(out,mb=>{hdRev(mb,[[lr*1.5,face+.0064],[lr*1.08,face+.0088],[lr*1.0,face+.0091]],24,HC.CAST);},30,null,M);
    hdPart(out,mb=>{const n=6,top=face+(o.lugH||.026);const hx=[];for(let i=0;i<n;i++){const t=i/n*TAU+PI/6;hx.push([Math.cos(t)*lr,Math.sin(t)*lr]);}
      const rings=[hx.map(p=>[p[0]*.86,p[1]*.86,face+.009]),hx.map(p=>[p[0],p[1],face+.012]),hx.map(p=>[p[0],p[1],top-.004]),hx.map(p=>[p[0]*.82,p[1]*.82,top])];
      hdLoft(mb,rings,o.lugM||HC.LUG,true);hdCap(mb,rings[3],o.lugM||HC.LUG,true);},20,null,M);}}
  /* the valve stem, near the lip between two spokes */
  {const a=o.valveA||0,r=rimR-.016,p0=[Math.cos(a)*r,Math.sin(a)*r,zo-.004],p1=[Math.cos(a)*(r-.006),Math.sin(a)*(r-.006),zo+.019];
    hdPart(out,mb=>{hdCyl(mb,p0,p1,.0048,.0042,12,SV([.02,.02,.022],MAT.RUBBER));},40);
    hdPart(out,mb=>{hdCyl(mb,p1,V3.add(p1,V3.mul(V3.norm(V3.sub(p1,p0)),.011)),.0036,.0034,12,MM.CHROME);},40);}
  return {rimR,zo,zi};
}
/* the brake behind the wheel, the SUV's sized to it. spin (the rotor, which turns) and fixed (the caliper and the
   dust shield, which only steer) go into two part lists. o: {ro, ri, zc, cal (the caliper's material), pistons} */
function hdBrake(spin,fixed,w,o={}){
  const rimR=w.rim*.0254/2,ro=o.ro||rimR*.74,ri=o.ri||ro*.61,zc=o.zc!=null?o.zc:-.022,cal=o.cal||SV([1,1,1],MAT.CALIPER),k=ro/.16;
  /* the rotor: two plates, the vanes between them, the hat out to the hub's mounting face */
  hdPart(spin,mb=>{for(const [z0,z1] of [[zc+.006*k,zc+.014*k],[zc-.014*k,zc-.006*k]])hdRev(mb,[[ri,z1],[ro-.0015,z1],[ro,z1-.0015],[ro,z0+.0015],[ro-.0015,z0],[ri,z0],[ri,z1]],128,HC.ROTORF);},35);
  hdPart(spin,mb=>{const nv=Math.round(40*k);for(let q=0;q<nv;q++){const a=(q+.5)/nv*TAU,c=Math.cos(a),s=Math.sin(a),tx=-s*.0022,ty=c*.0022,r0=ri+.004,r1=ro-.002;
    hdExtrude(mb,[[c*r0+tx,s*r0+ty],[c*r1+tx,s*r1+ty],[c*r1-tx,s*r1-ty],[c*r0-tx,s*r0-ty]],zc-.006*k,zc+.006*k,HC.CAST);}},20);
  hdPart(spin,mb=>{hdRev(mb,[[ri+.002,zc+.014*k],[ri*.9,zc+.016*k],[ri*.87,.004],[.04,.004],[.04,-.002]],96,HC.ROTORF,0,TAU,true);},30);
  /* the dust shield */
  hdPart(fixed,mb=>{hdRev(mb,[[ri*.6,zc-.05*k],[ro*1.06,zc-.044*k],[ro*1.14,zc-.03*k],[ro*1.15,zc-.022*k]],96,HC.CAST);},35);
  /* the caliper: a floating body over the top-rear of the rotor, its piston housings inboard, ribs over the bridge */
  const ca0=PI*.56,ca1=PI*.84,cr=ro*.95,np=o.pistons||1;
  hdPart(fixed,mb=>{const path=[],n=14;for(let i=0;i<=n;i++){const a=ca0+(ca1-ca0)*i/n;path.push([Math.cos(a)*cr,Math.sin(a)*cr,zc-.004]);}
    const sec=hdRRect(.03*k,.034*k,.011*k,5).map(([x,y])=>[y,x]);hdSweep(mb,path,sec,cal,[0,0,1],true,true);},40);
  {for(let q=0;q<np;q++){const am=ca0+(ca1-ca0)*(np===1?.5:(q+.5)/np),c=Math.cos(am),s=Math.sin(am);
      hdPart(fixed,mb=>{hdCyl(mb,[c*ro*.94,s*ro*.94,zc-.03*k],[c*ro*.94,s*ro*.94,zc-.062*k],.03*k/Math.sqrt(np),.027*k/Math.sqrt(np),28,cal);},40);}
    for(const t of [.2,.5,.8]){const a=ca0+(ca1-ca0)*t;hdPart(fixed,mb=>{hdRBox(mb,[Math.cos(a)*ro*1.15,Math.sin(a)*ro*1.15,zc-.004],[.006,.006,.03*k],.004,cal,2);},40);}
    for(const a of [ca0-.06,ca1+.06]){const c2=Math.cos(a),s2=Math.sin(a);
      hdPart(fixed,mb=>{hdCyl(mb,[c2*ro*.91,s2*ro*.91,zc-.03*k],[c2*ro*.91,s2*ro*.91,zc-.052*k],.009,.007,14,SV([.02,.02,.022],MAT.RUBBER));},40);
      hdPart(fixed,mb=>{hdRBox(mb,[c2*ro*.91,s2*ro*.91,zc-.012],[.016,.016,.018*k],.005,HC.CAST,2);},40);}
    const am=(ca0+ca1)/2,c=Math.cos(am),s=Math.sin(am);hdPart(fixed,mb=>{hdCyl(mb,[c*ro*1.12,s*ro*1.12,zc-.05*k],[c*ro*1.22,s*ro*1.22,zc-.055*k],.004,.004,10,HC.BOLT);},40);}
}
/* (Salt Mini Plus: first the Wagon's, cars/wagon/81_wheel) a wheel's dished face with windows: from rIn to rOut at height zAt(r), n windows between r0 and r1, each frac of its
   sector wide (centred on phase + k/n turns), walls thick deep round each window; na steps a sector, nr across */
function hdDiscWin(mb,o){
  const {rIn,rOut,zAt,m,n,r0,r1,frac,phase=0,thick=.004,na=12,nr=10}=o,A=n*na,R=[];
  for(let j=0;j<=nr;j++)R.push(rIn+(rOut-rIn)*j/nr);
  /* (the window's edges on the radial grid: the rings at r0 and r1 are added, so the walls meet the face) */
  for(const r of [r0,r1])if(!R.some(v=>Math.abs(v-r)<1e-5))R.push(r);R.sort((a,b)=>a-b);
  const win=(a,r)=>{if(r<r0-1e-6||r>r1+1e-6)return false;let f=((a/TAU-phase)*n)%1;if(f<0)f+=1;return f>(.5-frac/2)+1e-6&&f<(.5+frac/2)-1e-6;};
  const P=(a,r,dz=0)=>[Math.cos(a)*r,Math.sin(a)*r,zAt(r)-dz];
  /* angles: each sector split so the windows' sides fall on grid lines */
  const ang=[];for(let k=0;k<n;k++){const s0=(phase+k/n)*TAU,w0=(.5-frac/2)/n*TAU,w1=(.5+frac/2)/n*TAU;
    const cuts=[0,w0,w1,TAU/n];for(let q=0;q<3;q++){const a=cuts[q],b=cuts[q+1],m2=Math.max(2,Math.round(na*(b-a)/(TAU/n)));for(let i=0;i<m2;i++)ang.push(s0+a+(b-a)*i/m2);}}
  ang.push(ang[0]+TAU);
  for(let i=0;i<ang.length-1;i++)for(let j=0;j<R.length-1;j++){const a=ang[i],b=ang[i+1],ra=R[j],rb=R[j+1];
    if(win((a+b)/2,(ra+rb)/2))continue;mb.quad(P(a,ra),P(b,ra),P(b,rb),P(a,rb),m[0],m[1],m[2]);}
  /* each window's wall: its outline on the same grid lines as the face (so the edges meet), taken back by thick */
  const Rw=R.filter(r=>r>=r0-1e-6&&r<=r1+1e-6);
  for(let k=0;k<n;k++){const a0=(phase+k/n+(.5-frac/2)/n)*TAU,a1=(phase+k/n+(.5+frac/2)/n)*TAU,Aw=ang.filter(a=>a>=a0-1e-6&&a<=a1+1e-6),line=[];
    for(const a of Aw)line.push([a,r0]);for(const r of Rw.slice(1))line.push([a1,r]);for(const a of Aw.slice(0,-1).reverse())line.push([a,r1]);for(const r of Rw.slice(1,-1).reverse())line.push([a0,r]);
    hdLoft(mb,[line.map(([a,r])=>P(a,r)),line.map(([a,r])=>P(a,r,thick))],m,true);}}
