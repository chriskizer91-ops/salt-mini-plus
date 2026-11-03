/* =====================================================================================
   THE TRAIL'S BOLT-ONS, in place of 24_4x4's boxes, where the game puts them:
   - The rock rails (EXTRAS.rails): a black steel box section under each door, its ends turned up and closed, hung
     from the sill on three brackets.
   - The roof rack (EXTRAS.flatRack): a flat frame of black square tube on four clamp feet, four slats across it, a
     fairing across its front.
   ===================================================================================== */
function trRails(out,car){
  const K=HDK,D=K.D,X=K.X,S=SMC('#1c1d1f',SM.PAINTED),u0=D.uFa+D.arch.a+.04,u1=D.uRa-D.arch.a-.04,um=(u0+u1)/2,y=D.sill(um)+.01,z=D.plan(um)+.005;
  for(const s of [1,-1]){
    hdPart(out,mb=>{hdRBox(mb,[X(um),y,s*z],[(u1-u0)/2-.03,.045,.04],.012,S,3);},35);
    /* the ends, turned up toward the arches and closed */
    for(const e of [-1,1]){const ue=um+e*((u1-u0)/2-.03),d=V3.norm([-e,1,0]),up=[-d[1],d[0],0],c=V3.add([X(ue),y,s*z],V3.mul(d,.035));
      hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.05,.04,.04],.012,S,3);},35,null,M4.basis(c,d,up,[0,0,1]));}
    /* the brackets up to the sill */
    for(const t of [.15,.5,.85]){const u=u0+(u1-u0)*t;hdPart(out,mb=>{hdRBox(mb,[X(u),y+.045,s*(z-.045)],[.03,.03,.012],.004,S,2);for(const k of [-1,1])hdCyl(mb,[X(u)+k*.015,y+.06,s*(z-.03)],[X(u)+k*.015,y+.06,s*(z-.06)],.006,.006,6,HC.BOLT);},40);}}
}
function trRack(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,B=SMC('#141416',SM.PAINTED),u0=G.rf+.16,u1=G.rr-.08,z=.68,y=D.topY((u0+u1)/2,0)+.075;
  /* the frame: side rails and the front and back bars, square tube */
  for(const s of [1,-1])hdPart(out,mb=>{hdRBox(mb,[X((u0+u1)/2),y,s*z],[(u1-u0)/2,.018,.02],.006,B,2);},35);
  for(const u of [u0,u1])hdPart(out,mb=>{hdRBox(mb,[X(u),y,0],[.02,.018,z+.02],.006,B,2);},35);
  /* the slats across */
  for(let k=0;k<4;k++){const u=u0+.1+(u1-u0-.2)*k/3;hdPart(out,mb=>{hdRBox(mb,[X(u),y+.004,0],[.022,.012,z-.01],.004,B,2);},35);}
  /* the clamp feet on the roof's edge */
  for(const u of [u0+.08,u1-.08])for(const s of [1,-1]){const y0=D.topY(u,z);
    hdPart(out,mb=>{hdRBox(mb,[X(u),(y0+y)/2,s*z],[.04,(y-y0)/2+.008,.025],.008,B,3);hdRBox(mb,[X(u),y0+.006,s*(z+.01)],[.05,.008,.04],.006,SV([.02,.02,.022],MAT.RUBBER),2);
      for(const k of [-1,1])hdCyl(mb,[X(u)+k*.022,y+.019,s*z],[X(u)+k*.022,y+.026,s*z],.006,.006,6,HC.BOLT);},40);}
  /* the fairing across the front: a curved black plate leaning back */
  hdPart(out,mb=>{const rows=[];for(let k=0;k<=20;k++){const zz=-z+2*z*k/20,row=[];for(let j=0;j<=4;j++){const t=j/4;row.push([X(u0)+.02-.06*t,y-.01+.07*t-.02*t*t,zz]);}rows.push(row);}const R=rows[0].map((_,j)=>rows.map(r=>r[j]));hdLoft(mb,R,B,false);},35);
}
