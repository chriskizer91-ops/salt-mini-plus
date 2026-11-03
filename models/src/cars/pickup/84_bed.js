/* =====================================================================================
   THE PICKUP'S BED. The game's bed is its body's own section (21_suv secKeys, a bed): the rail's inner edge, a
   straight inner wall and a flat lined floor at 1.0 m. Its shape is kept; on it:
   - the floor's corrugations, ten raised ribs from the front wall to the tailgate, in black bed-liner;
   - black caps on the rail tops, rounded over the outer edge, with the stake pockets in them;
   - four tie-down hooks in cups in the inner walls;
   - the tailgate's inner face pressed into ribs, its latch strikers and support cables;
   - two cargo hooks on the front wall.
   ===================================================================================== */
function pkBed(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,X=K.X,L=D.L,u0=D.B.bed+.03,u1=L-.012,BL=HC.BEDLINER;
  const k=u=>secKeys(D,u),floorY=u=>k(u).yT,wallZ=u=>k(u).P[10][0],railZ=u=>k(u).P[8][0];
  /* ---------- the floor's ribs ---------- */
  {const zf=k((u0+u1)/2).P[11][0]-.03,n=10;
    for(let i=0;i<n;i++){const z=-zf+2*zf*(i+.5)/n,path=[];for(let u=u0+.04;u<=u1-.02+1e-6;u+=.1)path.push([X(u),floorY(u)-.002,z]);path.push([X(u1-.02),floorY(u1-.02)-.002,z]);
      hdPart(out,mb=>{const sec=[[-.028,0],[-.024,.006],[-.016,.011],[.016,.011],[.024,.006],[.028,0]].map(([a,b])=>[a,b]);hdSweep(mb,path,sec,BL,[0,1,0],false,true);},40);}}
  /* ---------- the rail caps, the stake pockets ---------- */
  for(const s of [1,-1]){const path=[];for(let u=D.B.bed-.02;u<=L-.005+1e-6;u+=.05)path.push(u);path.push(L-.005);
    hdPart(out,mb=>{const rings=path.map(u=>{const kk=k(u),zi=kk.P[8][0]-.006,zo=kk.P[7][0]+.012,yt=kk.P[8][1]+.012,yb=kk.P[7][1]-.014;
        return [[zi,kk.P[8][1]-.012],[zi-.002,yt-.004],[zi+.004,yt],[zo-.012,yt],[zo-.003,yt-.005],[zo+.001,yt-.016],[zo,yb]].map(([z,y])=>[X(u),y,s*z]);});
      hdLoft(mb,rings,HC.PLASTIC,false,s<0);for(const i of [0,rings.length-1]){const r=rings[i];for(let j=1;j<r.length-1;j++)mb.tri(r[0],r[j],r[j+1],HC.PLASTIC[0],0,HC.PLASTIC[2]);}},40);
    for(const u of [D.B.bed+.25,L-.35]){const kk=k(u),zc=(kk.P[8][0]+kk.P[7][0])/2,yt=kk.P[8][1]+.0125;
      hdPart(out,mb=>{hdRBox(mb,[X(u),yt+.0005,s*zc],[.03,.0012,.016],.002,HC.GB,1);},30);}}
  /* ---------- the tie-down hooks ---------- */
  for(const s of [1,-1])for(const u of [D.B.bed+.12,L-.2]){const z=wallZ(u),y=Y(1.2);
    hdPart(out,mb=>{hdRBox(mb,[X(u),y,s*(z-.004)],[.035,.035,.006],.008,HC.GB,3);},40);
    hdPart(out,mb=>{const ring=[];for(let i=0;i<=20;i++){const a=PI*.15+i/20*PI*1.7;ring.push([X(u)+Math.cos(a)*.02,y-.008+Math.sin(a)*-.02,s*(z-.014)]);}hdTube(mb,ring,.004,8,MM.CHROME,false,true);
      hdCyl(mb,[X(u)-.024,y+.012,s*(z-.008)],[X(u)-.024,y+.012,s*(z-.02)],.006,.006,8,MM.CHROME);hdCyl(mb,[X(u)+.024,y+.012,s*(z-.008)],[X(u)+.024,y+.012,s*(z-.02)],.006,.006,8,MM.CHROME);},40);}
  /* ---------- the tailgate's inner face: three pressed ribs, the latch strikers, the cables ---------- */
  {const x=X(L)+.002,zw=wallZ(L-.05)-.06;
    for(const y of [1.12,1.22,1.32])hdPart(out,mb=>{const path=[];for(let z=-zw;z<=zw+1e-6;z+=.05)path.push([x,Y(y),z]);hdSweep(mb,path,[[0,-.018],[-.004,-.012],[-.006,0],[-.004,.012],[0,.018]],SV([1,1,1],MAT.PAINT),[0,1,0],false,true);},40);
    for(const s of [1,-1]){const z=s*(wallZ(L-.03)-.004),y=Y(1.36);
      hdPart(out,mb=>{const U=[];for(let i=0;i<=10;i++){const a=i/10*PI;U.push([X(L-.02)+Math.cos(a)*.012,y,z-s*Math.sin(a)*.012]);}hdTube(mb,U,.0045,8,MM.CHROME,false,true);},40);
      hdPart(out,mb=>{hdTube(mb,[[X(L-.06),Y(1.33),z-s*.004],[X(L-.03),Y(1.2),z-s*.006],[X(L-.01),Y(1.08),z-s*.008]],.004,8,HC.GB,false,true);},40);}}
  /* ---------- the cargo hooks on the front wall ---------- */
  for(const s of [1,-1]){const u=D.B.bed+.008,y=Y(1.3),z=s*.55;
    hdPart(out,mb=>{hdRBox(mb,[X(u)-.006,y,z],[.006,.03,.04],.008,HC.GB,2);const h=[];for(let i=0;i<=12;i++){const a=i/12*PI;h.push([X(u)-.012-Math.sin(a)*.025,y+Math.cos(a)*.022,z]);}hdTube(mb,h,.004,8,MM.CHROME,false,true);},40);}
}
