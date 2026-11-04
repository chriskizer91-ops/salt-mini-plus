/* =====================================================================================
   THE ROCK & MUD'S EXPEDITION RACK AND ITS LIP, in place of 23_parts rack() and spoiler()'s 'lip', where the game
   puts them:
   - The rack: a frame of black square tube on six clamp feet on the roof rails, ten slats across it, a low rail of
     round tube round its edge on posts, a curved wind deflector across its front. On it: two hard cases at the back
     (lid seams, alloy latches, handles), a rolled olive duffel and a smaller roll on straps, the orange recovery
     boards on each side with their cleats, four square LED pods across the front, and a whip antenna on the back
     corner with its spring and red tip.
   - The lip: a short aerofoil over the rear glass carrying the roofline back, a third brake lamp under it.
   ===================================================================================== */
function cwRack(out,car){
  const K=HDK,D=K.D,X=K.X,topY=D.topY,[r0,r1,zr]=D.B.rails,ry=u=>topY(u,zr)+.058,B=SMC('#141416',SM.PAINTED),u0=2.66,u1=4.52,y=ry(3.6)+.07,w=.68,fr=.016;
  /* the feet down to the rails, clamped round them */
  for(const u of [u0+.1,3.6,u1-.1])for(const s of [1,-1])hdPart(out,mb=>{const yb=ry(u);hdRBox(mb,[X(u),(y+yb)/2,s*.6],[.03,Math.max(.012,(y-yb)/2),.016],.006,B,2);
    hdRBox(mb,[X(u),yb,s*.6],[.034,.024,.026],.008,B,3);hdCyl(mb,[X(u),yb,s*.6-.03],[X(u),yb,s*.6+.03],.006,.006,8,HC.BOLT);},40);
  /* the frame, the slats */
  hdPart(out,mb=>{for(const s of [1,-1])hdRBox(mb,[X((u0+u1)/2),y,s*w],[(u1-u0)/2+fr,fr,fr],.004,B,2);for(const u of [u0,u1])hdRBox(mb,[X(u),y,0],[fr,fr,w],.004,B,2);
    for(let k=1;k<11;k++)hdRBox(mb,[X(u0+(u1-u0)*k/11),y+.004,0],[.018,.007,w-.01],.003,B,2);},35);
  /* the low rail on its posts */
  hdPart(out,mb=>{for(const s of [1,-1]){for(let k=0;k<=6;k++){const u=u0+(u1-u0)*k/6;hdCyl(mb,[X(u),y+.012,s*w],[X(u),y+.1,s*w],.008,.008,10,B);}
      hdTube(mb,[[X(u0),y+.1,s*w],[X(u1),y+.1,s*w]],.01,12,B,false,true);}
    hdTube(mb,[[X(u1),y+.1,-w],[X(u1),y+.1,w]],.01,12,B,false,true);},40);
  /* the wind deflector: a curved plate leaning back */
  hdPart(out,mb=>{const rows=[];for(let k=0;k<=24;k++){const z=-w+2*w*k/24,row=[];for(let j=0;j<=6;j++){const t=j/6;row.push([X(u0)+.0-.07*t,y-.01+.085*t-.02*t*t,z]);}rows.push(row);}
    hdLoft(mb,rows[0].map((_,j)=>rows.map(r=>r[j])),B,false);
    const back=rows.map(r=>r.map(p=>[p[0]-.004,p[1]+.003,p[2]]));hdLoft(mb,back[0].map((_,j)=>back.map(r=>r[j])),B,false,true);},35);
  /* the hard cases, their lids, latches and handles */
  for(const s of [1,-1]){const c=[X(4.1),y+.13,s*.32],CS=SMC('#26282a',SM.PLASTIC),LD=SMC('#151617',SM.PLASTIC),ALU=SMC('#9a9ca0',SM.BRUSH);
    hdPart(out,mb=>{hdRBox(mb,c,[.28,.11,.27],.035,CS,4);hdRBox(mb,[c[0],c[1]+.012,c[2]],[.285,.008,.275],.006,LD,2);
      for(let k=-3;k<=3;k++)hdRBox(mb,[c[0]+k*.07,c[1]+.111,c[2]],[.012,.002,.24],.002,LD,1);},35);
    hdPart(out,mb=>{for(const dx of [-.14,.14]){hdRBox(mb,[c[0]+dx,c[1]+.04,c[2]+s*.274],[.03,.022,.005],.003,ALU,2);hdRBox(mb,[c[0]+dx,c[1]+.0,c[2]+s*.274],[.012,.012,.004],.002,ALU,1);}
      hdTube(mb,[[c[0]-.06,c[1]+.05,c[2]+s*.276],[c[0]-.05,c[1]+.075,c[2]+s*.29],[c[0]+.05,c[1]+.075,c[2]+s*.29],[c[0]+.06,c[1]+.05,c[2]+s*.276]],.007,8,LD,false,true);},40);}
  /* the duffel and the smaller roll, on their straps */
  {const OL=SMC('#55593a',MAT.FABRIC),ST=SMC('#1a1a1a',MAT.FABRIC),cap=(c,r,l,m)=>hdPart(out,mb=>{const P=[];for(let k=0;k<=8;k++){const a=k/8*PI/2;P.push([r*Math.cos(a)*(1-.15*Math.sin(a)),l+r*.35*Math.sin(a)]);}
      const prof=[...P.map(([rr,zz])=>[rr,-zz]).reverse(),...P];hdRev(mb,prof.map(([rr,zz])=>[Math.max(.0005,rr),zz]),32,m,0,TAU,true);},35,null,M4.basis(c,[1,0,0],[0,1,0],[0,0,1]));
    cap([X(3.42),y+.12,0],.11,.42,OL);cap([X(3.0),y+.075,0],.068,.25,SMC('#3c3f2c',MAT.FABRIC));
    for(const z of [-.3,.3])hdPart(out,mb=>{hdCyl(mb,[X(3.42),y+.12,z-.018],[X(3.42),y+.12,z+.018],.114,.114,32,ST,false);},35);}
  /* the recovery boards along each side, their cleats, the brackets */
  for(const s of [1,-1]){const c=[X(3.5),y+.075,s*(w+.03)],OR=SMC('#a8481c',SM.PLASTIC);
    hdPart(out,mb=>{hdRBox(mb,c,[.44,.068,.012],.01,OR,3);for(let k=-9;k<=9;k++)for(const dy2 of [-.035,0,.035])hdRBox(mb,[c[0]+k*.044,c[1]+dy2,c[2]+s*.012],[.008,.008,.004],.002,OR,1);},35);
    hdPart(out,mb=>{for(const u of [3.22,3.78])hdRBox(mb,[X(u),y+.075,s*(w+.044)],[.02,.06,.004],.003,B,2);},40);}
  /* the LED pods across the front */
  for(const z of [-.5,-.17,.17,.5]){hdPart(out,mb=>{hdRBox(mb,[X(u0-.01),y+.035,z],[.012,.03,.012],.004,B,2);hdRBox(mb,[X(u0-.04),y+.085,z],[.04,.055,.058],.014,B,3);},40);
    hdPart(out,mb=>{hdRBox(mb,[X(u0-.08),y+.085,z],[.003,.044,.047],.006,HC.LENSH,2);for(const dy2 of [-.022,0,.022])for(const dz of [-.024,0,.024])ball(mb,[X(u0-.075),y+.085+dy2,z+dz],.007,10,HC.LAMPH);},45);}
  /* the whip antenna, its spring base, the red tip */
  {const a=[X(u1),y,-.62],b=[X(u1+.06),y+.95,-.62],d=V3.norm(V3.sub(b,a));
    hdPart(out,mb=>{hdCyl(mb,V3.add(a,[0,-.01,0]),V3.add(a,V3.mul(d,.03)),.012,.01,12,B);const sp=[];for(let k=0;k<=60;k++){const t=k/60,p=V3.add(a,V3.mul(d,.03+.07*t)),q=t*TAU*8;sp.push([p[0]+Math.cos(q)*.009,p[1],p[2]+Math.sin(q)*.009]);}hdTube(mb,sp,.0022,6,HC.BOLT,false,true);
      hdCyl(mb,V3.add(a,V3.mul(d,.1)),b,.005,.003,8,B);ball(mb,b,.012,12,SV([1,1,1],MAT.TAIL));},40);}
}
function cwLip(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,topY=D.topY,u0=G.rr-.08,len=.13,w=D.B.lipW||.68,PA=SV([1,1,1],MAT.PAINT),n=10;
  const y0=topY(u0,0)+.004,top=t=>y0+.01*Math.sin(t*PI)-.03*t*t,thk=t=>.018*(1-t)+.008;
  const sec=[];for(let i=0;i<=n;i++){const t=i/n;sec.push([u0+len*t,top(t)]);}for(let i=n;i>=0;i--){const t=i/n;sec.push([u0+len*t,top(t)-thk(t)*(t<.06?t/.06:1)]);}
  const R=[];for(let k=0;k<=24;k++){const z=-w+2*w*k/24,e=1-Math.pow(Math.abs(z)/w,8)*.5;R.push(sec.map(([u,yy])=>[X(u),y0+(yy-y0)*e,z]));}
  hdPart(out,mb=>{hdLoft(mb,R,PA,true,true);hdCap(mb,R[0],PA,false);hdCap(mb,R[R.length-1],PA,true);},35);
  {const x=X(u0+len-.02),yy=top(1)-thk(1)-.006;hdPart(out,mb=>{hdRBox(mb,[x,yy,0],[.012,.007,.2],.005,HC.GB,2);hdRBox(mb,[x-.006,yy-.002,0],[.006,.005,.19],.004,HC.REDL,2);},40);
    hdPart(out,mb=>{for(let z=-.18;z<=.1801;z+=.03)ball(mb,[x-.002,yy-.002,z],.0028,8,SV([1,1,1],MAT.TAIL));},40);}
}
