/* =====================================================================================
   THE SLEEPER'S FACE, IN THREE DIMENSIONS (in place of 22_faces FACES.street's decals), on the decals' own outlines:
   - The grille: a gloss-black surround split down the middle, each half a fine black mesh set back in a pocket.
   - The smoked lamps: a black cavity under a clear lens; two projectors in black bezels, each ringed by a halo, an
     LED line along the lower edge, the amber signal in the outer corner under its own lens.
   - The lower intake: a wide smoked frame, the mesh set back in it; a slim LED fog lamp low in each corner.
   - The lip (FRONTS.lip): the EV's (79_parts hdLip), red line and all, as the game gives the Sleeper the same one.
   ===================================================================================== */
/* a patch over a convex outline, wrapped on the surface (as 72_face hdGrid), the cells whose middles fall inside any
   of the holes left out */
function slPanel(mb,view,P,off,m,cl,holes){const w=hdCCW(P);let z0=1e9,z1=-1e9,y0=1e9,y1=-1e9;for(const q of P){z0=Math.min(z0,q[0]);z1=Math.max(z1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}
  const nz=Math.max(1,Math.ceil((z1-z0)/cl)),ny=Math.max(1,Math.ceil((y1-y0)/cl)),dz=(z1-z0)/nz,dyy=(y1-y0)/ny;
  for(let i=0;i<nz;i++)for(let j=0;j<ny;j++){const a=z0+i*dz,b=y0+j*dyy;if(holes.some(H=>hdIn(H,a+dz/2,b+dyy/2)))continue;
    let V=[[a,b],[a+dz,b],[a+dz,b+dyy],[a,b+dyy]].map(q=>({q,p:[0,0,0],n:[0,0,0],c:[0,0,0,0]}));
    for(let k=0;k<P.length&&V.length>=3;k++)V=hdClip(V,P[k],P[(k+1)%P.length],w);if(V.length<3)continue;
    const S=V.map(v=>hdS(view,v.q[0],v.q[1],off));
    for(let k=1;k<S.length-1;k++){if(view==='F'?w>0:w<0)mb.tri(S[0],S[k],S[k+1],m[0],m[1],m[2]);else mb.tri(S[0],S[k+1],S[k],m[0],m[1],m[2]);}}}
function slFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood];
  /* ---------- the grille ---------- */
  {const S0=RR2(-.465,.465,Y(.793),Y(1.032),.03),Mh=[1,-1].map(s=>RR2(s*.045,s*.43,Y(.813),Y(1.012),.035));
    for(const c of cuts)hdCut(c,'F',S0);
    hdPart(out,mb=>{slPanel(mb,'F',S0,-.0015,HC.GB,.008,Mh);},30);
    hdTrim(out,'F',hdResample(S0,.008),.012,.006,HC.GB,true,50,.001);
    for(const M of Mh){hdRecess(out,'F',M,.05,.97,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(M,.985),.02,.014,.0016,.01,HC.HONEY);
      hdTrim(out,'F',hdResample(M,.006),.008,.004,HC.GB,true,50,-.001);}}
  for(const s of [1,-1]){
    /* ---------- the smoked lamp ---------- */
    const L=[[.488,.808],[.86,.814],[.9,.878],[.885,1.008],[.488,1.022]].map(([z,y])=>[s*z,Y(y)]),A=[[.8,.858],[.87,.861],[.885,.898],[.8,.898]].map(([z,y])=>[s*z,Y(y)]);
    hdLampUnit(out,'F',L,cuts,{deep:.075,k:.9,wall:HC.GB,back:()=>HC.GB,bulge:.003,cell:.005,lens:(z,y)=>hdIn(A,z,y)?HC.AMBERL:HC.LENSH,
      inside:o=>{
        for(const zp of [.575,.70]){const z=s*zp,b=hdS('F',z,Y(.923),-.04);
          /* the bezel, the halo ring in it, the projector's lens in its barrel */
          hdRevAt(o,'F',b,[[.06,-.02],[.059,.006],[.055,.012],[.05,.012]],HC.SATIN,64);
          hdRevAt(o,'F',b,[[.05,.012],[.04,.004],[.032,-.004],[.03,-.004]],HC.GB,64);
          hdPart(o,mb=>{const ring=[];for(let k=0;k<64;k++){const a=k/64*TAU;ring.push([b[0]+.012,b[1]+Math.sin(a)*.0475,b[2]+Math.cos(a)*.0475]);}hdTube(mb,ring,.0035,10,SV([1,1,1],MAT.HALO),true,false);},50);
          hdRevAt(o,'F',b,[[.029,-.004],[.029,.008]],HC.SATIN,48);
          hdRevAt(o,'F',b,[[.029,.008],[.026,.018],[.018,.025],[.008,.0285],[0,.029]],HC.LAMPH,48,60);}
        /* the LED line along the lower edge */
        hdPart(o,mb=>{const pts=[[.52,.836],[.68,.8385],[.84,.841],[.856,.849]].map(([z,y])=>hdS('F',s*z,Y(y),-.012));hdTube(mb,pts,.0042,10,SV([1,1,1],MAT.LED),false,true);},50);
        /* the signal's bulb in the outer corner, behind the amber */
        hdPart(o,mb=>{ball(mb,hdS('F',s*.845,Y(.88),-.035),.008,14,HC.BULB);},50);}});
    /* the divider between the clear lens and the amber */
    hdTrim(out,'F',[[s*.8,Y(.862)],[s*.8,Y(.895)]],.005,.004,HC.GB,false,50,.0005);
    /* ---------- the slim fog lamp, low in the corner ---------- */
    {const F0=RR2(s*.64,s*.8,Y(.47),Y(.53),.02),H0=RR2(s*.655,s*.785,Y(.483),Y(.517),.012);
      hdLampUnit(out,'F',F0,[car.body],{deep:.045,k:.92,wall:HC.GB,back:()=>HC.GB,bulge:.002,cell:.004,lens:(z,y)=>HC.LENSH,
        inside:o=>{hdPart(o,mb=>{const c=hdCen(H0),b=hdS('F',c[0],c[1],-.018);hdRBox(mb,b,[.008,.014,.06],.006,HC.LAMPH,3);
          hdRBox(mb,V3.add(b,[-.01,0,0]),[.006,.019,.068],.006,HC.SATIN,3);},50);}});}
  }
  /* ---------- the lower intake: a smoked frame, the mesh set back in it ---------- */
  {const I0=RR2(-.54,.54,Y(.432),Y(.592),.04),I1=RR2(-.52,.52,Y(.445),Y(.578),.035);for(const c of [car.body])hdCut(c,'F',I0);
    hdPart(out,mb=>{slPanel(mb,'F',I0,-.0015,HC.GB,.008,[I1]);},30);
    hdRecess(out,'F',I1,.055,.97,HC.GB,()=>HC.GB);hdHoney(out,'F',hdShrink(I1,.985),.022,.013,.0016,.012,HC.HONEY);
    hdTrim(out,'F',hdResample(I0,.008),.01,.005,HC.GB,true,50,.001);hdTrim(out,'F',hdResample(I1,.006),.007,.004,HC.GB,true,50,-.001);}
  hdLip(out,car);
}
