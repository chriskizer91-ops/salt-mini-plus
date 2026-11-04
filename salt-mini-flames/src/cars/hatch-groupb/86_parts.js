/* =====================================================================================
   THE HATCH GROUP B'S BOLT-ONS, IN THREE DIMENSIONS, on the game's own sizes and places (23_parts spoiler 'rally',
   29_hatch EXTRAS.louvres and numberPanel, 23_parts EXTRAS.flaps):
   - The wing: a big flat black blade above and behind the roof, red endplates, on two tall black struts off the
     hatch, each strut on a foot bolted through the glass's frame.
   - The louvres: over each rear side window, seven black blades leaning out and down, in a black frame on a dark
     backing.
   - The number panels: a blank white panel of film on each door, a black line round it.
   - The mud flaps: red rubber behind each wheel, hung full length nearly to the ground from a black strip, bolted.
   ===================================================================================== */
function hbWing(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,BK=SMC('#0f0f11',SM.SATIN),EP=SV(lin('#c8241c'),MAT.METAL),uw=G.rr+.02,yw=K.topY(G.rr-.3,0)+.14,x=X(uw),hw=.8,c=.36,us=G.rr+.3;
  /* the game's wing, struts and endplates, taken off */
  hdDrop(car.body,(cc,m)=>{const u=D.uC-cc[0];return m===MAT.METAL&&u>G.rr-.12&&u<G.rr+.48&&cc[1]>K.topY(us+.1,.5)-.05;});
  const P=cgWingBlade(out,x,yw,hw,c,.03,.1,BK);
  for(const s of [1,-1]){
    cgPlate(out,[[x+.04,yw-.09],[x-c-.08,yw-.09],[x-c-.05,yw+.15],[x+.02,yw+.11]],s*(hw+.007),.012,EP,.02);
    /* the strut: from the hatch up to the blade's underside */
    const y0=K.topY(us,.5)-.01,y1=K.topY(us+.1,.5)-.01;
    cgPlate(out,[[X(us),y0],[X(us+.1),y1],[x-c*.45,yw-.012],[x-c+.03,yw-.012]],s*.5,.014,BK,.012);
    /* its foot on the glass's frame, two bolts through it */
    {const uf=us+.05,p=[X(uf),K.topY(uf,.5),s*.5];
      hdPart(out,mb=>{hdRBox(mb,[p[0],p[1]+.002,p[2]],[.075,.005,.026],.004,BK,2);},30);
      for(const du of [-.05,.05])hdPart(out,mb=>{cgBolt(mb,[X(uf+du),K.topY(uf+du,.5)+.007,s*.5],[0,1,0],.0055,HC.BOLT);},40);}
  }
}
function hbLouvres(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,u0=G.pillars[0][0]+.07,u1=G.cB-.06,k=secKeys(D,(u0+u1)/2),y0=k.yG+.03,y1=k.P[10][1]-.04,BK=SMC('#0d0d0f',SM.SATIN);
  for(const s of [1,-1]){const at=(u,y,o)=>hdSS(s,u,y,o);
    /* the dark backing over the glass, and the frame round it */
    hbFilm(out,RR2(u0,u1,y0,y1,.02),at,SV([.01,.01,.012],MAT.COL),.0015,s);
    hdPart(out,mb=>{const Q=hdResample(RR2(u0,u1,y0,y1,.02),.01).map(([u,y])=>at(u,y,.006));Q.push(Q[0]);hdTube(mb,Q,.0055,8,BK,false,false);},40);
    /* the seven blades: each leaning out and down, across the window from frame to frame */
    const sec=[[.002,.008],[.017,-.01],[.0185,-.0125],[.0035,.0055]];
    for(let i=0;i<7;i++){const yb=y0+.02+(y1-y0-.04)*i/6,n=10,rings=[];
      for(let j=0;j<=n;j++){const u=u0+.012+(u1-u0-.024)*j/n;rings.push(sec.map(([o,dy])=>at(u,yb+dy,o)));}
      hdPart(out,mb=>{hdLoft(mb,rings,BK,true,s<0);hdCap(mb,rings[0],BK,s>0);hdCap(mb,rings[n],BK,s<0);},30);}
  }
}
function hbPanels(out,car){
  const K=HDK,D=K.D,G=D.G,Y=y=>y+K.dy,u0=G.cowl+.18,u1=u0+.42;
  for(const s of [1,-1]){const at=(u,y,o)=>hdSS(s,u,y,o);
    hbFilm(out,RR2(u0,u1,Y(.38),Y(.74),.01),at,SV([.93,.93,.9],MAT.COL),.0012,s);
    /* the black line round it, just over the panel's edge */
    hdPart(out,mb=>{const R=hdResample(RR2(u0,u1,Y(.38),Y(.74),.01),.01),c=hdCen(R),A=R.map(([u,y])=>at(u,y,.0016)),B=R.map(([u,y])=>{const d=Math.hypot(u-c[0],y-c[1])||1;return at(u+(u-c[0])/d*.008,y+(y-c[1])/d*.008,.0016);});
      hdLoft(mb,[A,B],SV([.02,.02,.02],MAT.COL),true,s>0);},20);}
}
function hbFlaps(out,car){
  const K=HDK,D=K.D,X=K.X,RED=D.look.flapCol||SV(lin('#c8241c'),MAT.RUBBER),BK=SMC('#101012',SM.SATIN);
  for(const ua of [D.uFa,D.uRa])for(const s of [1,-1]){const u=ua+D.arch.a+.04,z=K.sideZ(u,D.arch.cy)*.9,t=D.arch.cy+.02,b=.07,zz=Math.max(z,D.look.track/2),xc=X(u+.02);
    /* the flap: a sheet in (z, y), its bottom corners rounded */
    const M=M4.basis([xc,0,0],[0,0,-1],[0,1,0],[1,0,0]),zo=s*zz,l0=-zo-.14,l1=-zo+.14;
    const P=[[l0,b+.03],[l0+.009,b+.009],[l0+.03,b],[l1-.03,b],[l1-.009,b+.009],[l1,b+.03],[l1,t],[l0,t]];
    hdPart(out,mb=>{cgSlab(mb,P,-.005,.005,RED,.0015);},30,null,M);
    /* the strip it hangs from, and its three bolts */
    hdPart(out,mb=>{hdRBox(mb,[xc-.009,t-.018,zo],[.004,.016,.146],.003,BK,2);},40);
    for(const dz of [-.1,0,.1])hdPart(out,mb=>{cgBolt(mb,[xc-.013,t-.018,zo+dz],[-1,0,0],.005,HC.BOLT);},40);}
}
