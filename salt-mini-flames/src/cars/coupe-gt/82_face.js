/* =====================================================================================
   THE COUPE GT'S FACE: the Coupe's own (cars/coupe 82_face cpFace: the grille, the lamps, the fogs, the gills), with
   the GT's race front in place of the Coupe's lip (in place of 23_parts FRONTS.race's boxes), on the game's own
   outlines:
   - The splitter: a carbon blade well out ahead of the nose, its leading edge rounded, from corner to corner.
   - Its endplates: a tall carbon fin at each end, rounded.
   - The canards: two carbon blades on each corner of the bumper, the upper one longer.
   - The tow strap: a red loop of webbing out of the bumper.
   - The slots ahead of the rear wheels the flares bring (in place of 25_coupe's two smoked decals a side): two
     slanted vents a side, each a dark pocket let into the body.
   ===================================================================================== */
function cgFace(out,car){
  /* the Coupe's face without its lip (the GT has the splitter instead) */
  const lip=hdLip;hdLip=()=>{};try{cpFace(out,car);}finally{hdLip=lip;}
  cgSplitter(out,car);cgRearSlots(out,car);
}
function cgSplitter(out,car){
  const K=HDK,D=K.D,X=K.X,F=D.B.fit,Y=y=>y+K.dy+F.fdy,y=Y(.4),CF=SV([1,1,1],MAT.CARBON),n=56,zw=.9;
  /* ---------- the blade: the game's outline (14 cm ahead of the nose) back to u .35, its front rounded ---------- */
  const uE=z=>K.uFront(Math.abs(z)*.95,y+.05)-.14;
  const sec=[[0,.007],[.002,.0125],[.008,.017],[.03,.018],[1,.018],[1,0],[.03,0],[.008,.0008],[.002,.003]];
  const row=z=>{const e=uE(z),back=Math.max(.1,.35-e);return sec.map(([d,h])=>[X(e+(d===1?back:d)),y+h,z]);};
  const rows=[];for(let k=0;k<=n;k++){const t=k/n,z=-zw+2*zw*(.5-.5*Math.cos(t*PI));rows.push(row(z));}
  hdPart(out,mb=>{hdLoft(mb,rows,CF,true);hdCap(mb,rows[0],CF,true);hdCap(mb,rows[n],CF,false);},40);
  /* ---------- the endplates: from the blade's corner back to the game's epU, rising ---------- */
  const u0=uE(zw),ep=F.epU==null?.08:u0+F.epU;
  for(const s of [1,-1]){
    cgPlate(out,[[X(u0),y-.002],[X(ep),y-.002],[X(ep+.02),y+.13],[X(u0)-.02,y+.06]],s*(zw+.004),.008,CF,.014);
    /* ---------- the canards: two blades on the bumper's corner ---------- */
    for(const [yy,du,len] of [[.62,.05,.24],[.53,.03,.2]]){const ua=K.uFront(.8,Y(yy))+du,yb=Y(yy);
      const T=[[X(ua),yb,s*.79],[X(ua+len),yb+.03,s*.935],[X(ua+.02),yb+.005,s*.935]],nn=V3.norm(V3.cross(V3.sub(T[1],T[0]),V3.sub(T[2],T[0]))),h=.002;
      hdPart(out,mb=>{const A=T.map(p=>V3.add(p,V3.mul(nn,h))),B=T.map(p=>V3.add(p,V3.mul(nn,-h)));
        mb.tri(A[0],A[1],A[2],CF[0],CF[1],CF[2]);mb.tri(B[2],B[1],B[0],CF[0],CF[1],CF[2]);
        for(let i=0;i<3;i++){const j=(i+1)%3;mb.quad(A[i],B[i],B[j],A[j],CF[0],CF[1],CF[2]);}},20);}
  }
  /* ---------- the tow strap: a loop of red webbing out of the bumper on the right ---------- */
  {const zs=.35,ub=K.uFront(zs,Y(.47)),xr=X(ub),y0=Y(.47),RED=SV(lin('#d02020'),MAT.FABRIC);
    const path=cgEase([[xr-.02,y0+.004,zs],[xr+.03,y0-.006,zs],[xr+.08,y0-.03,zs],[xr+.1,y0-.055,zs],[xr+.085,y0-.075,zs],[xr+.06,y0-.07,zs],[xr+.035,y0-.045,zs],[xr+.01,y0-.03,zs],[xr-.02,y0-.024,zs]],2);
    hdPart(out,mb=>{hdSweep(mb,path,[[-.0018,-.016],[.0018,-.016],[.0018,.016],[-.0018,.016]],RED,[0,0,1],true,true);},35);
    /* the bolt plate it hangs from, flush on the bumper */
    hdPart(out,mb=>{hdRBox(mb,[xr-.004,y0-.012,zs],[.006,.03,.026],.004,HC.SATIN,2);},40);}
}
/* the two slanted slots a side ahead of the rear wheel (the game's smoked decals, on their outlines) */
function cgRearSlots(out,car){
  const K=HDK,D=K.D,Y=y=>y+K.dy;if(!D.look.flares)return;const ur=D.uRa-D.arch.a-.32;
  for(const s of [1,-1])for(const o of [0,.07]){const P=[[ur+o,Y(.44)],[ur+o+.03,Y(.44)],[ur+o+.1,Y(.62)],[ur+o+.07,Y(.62)]];
    hdCutSide(car.body,s,P,.015);const R=hdResample(P,.005),c=hdCen(R);
    hdPart(out,mb=>{const Fr=R.map(([u,y])=>hdSS(s,u,y,-.0005)),B=R.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*.85,c[1]+(y-c[1])*.94,-.035));hdLoft(mb,[Fr,B],HC.GB,true);hdCap(mb,B,HC.GB,s<0);},30);
    /* a thin black frame round the slot's mouth */
    hdPart(out,mb=>{const Q=R.map(([u,y])=>hdSS(s,u,y,.0008));Q.push(Q[0]);hdTube(mb,Q,.0016,6,HC.GB,false,false);},40);}
}
