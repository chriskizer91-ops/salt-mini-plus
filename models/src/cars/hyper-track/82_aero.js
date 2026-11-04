/* =====================================================================================
   THE HYPERCAR TRACK'S AERO, IN THREE DIMENSIONS (in place of 23_parts FRONTS.race's and EXTRAS.skirts' boxes,
   36_hyper EXTRAS.fin's plate, 29_hatch EXTRAS.roofScoop's box and 23_parts deckWing's, which nothing skips and
   is taken off the game's body here), all in carbon unless said:
   - The splitter: a plate following the nose well ahead of it, its front edge rolled up into a lip, three strakes a
     side under it, two stays up to the nose, a fence at each end; two canards a side on the nose's corners; a red
     tow strap looped under the slot.
   - The side skirts: a blade along each sill between the arches, standing out and turned down at its edge.
   - The roof scoop on the canopy, in the paint: a rounded hood rising from the glass to its mouth, the mouth black
     inside with a mesh across it.
   - The shark fin down the spine from the roof to the wing, thin, its top edge rounded.
   - The swan-neck wing: a cambered main plane right across the tail on the game's span and chord, a Gurney strip
     along its trailing edge; the endplates; two swan necks rising from the deck behind it, over its top and down
     onto it, on feet bolted to the deck.
   ===================================================================================== */
function hkKit(out){
  const a=new MB();hkSplitter(a,out);hkSkirts(a,out);hkScoop(a,out);hkFin(a,out);hkWing(a,out);out.hd.aero=a;
}
const hkCARB=()=>SV([1,1,1],MAT.CARBON);
function hkSplitter(out,car){
  const K=HDK,D=K.D,X=K.X,F=D.B.fit,y=K.dy+F.fdy+.4,C=hkCARB(),n=36,zw=.9;
  /* the plate: the game's outline, the front edge rolled up */
  const fr=z=>K.uFront(Math.abs(z)*.95,y+.05)-.14,uB=.35;
  const sec=(z)=>{const u0=fr(z),u1=Math.max(u0+.12,uB);return [[u0+.012,0],[u0+.002,.004],[u0,.012],[u0+.004,.019],[u0+.014,.021],[u0+.03,.012],[u1,.012],[u1,0]].map(([u,h])=>[X(u),y+h,z]);};
  const rows=[];for(let k=0;k<=n;k++){const t=k/n,z=-zw+2*zw*(.5-.5*Math.cos(t*PI));rows.push(sec(z));}
  hdPart(out,mb=>{hdLoft(mb,rows,C,true);hdCap(mb,rows[0],C,true);hdCap(mb,rows[n],C,false);},40);
  /* the strakes under it, the stays up to the nose, the fences at its ends */
  for(const s of [1,-1]){
    for(const z of [.28,.5,.7])hdPart(out,mb=>{const u0=fr(s*z)+.05;hdExtrude(mb,[[X(u0),y],[X(u0+.02),y-.03],[X(uB-.02),y-.03],[X(uB),y]],s*z-.003,s*z+.003,C,.001,1,true);},30);
    hdPart(out,mb=>{const z=s*.35,u=fr(z)+.1;hdCyl(mb,[X(u),y+.012,z],[X(u+.08),y+.14,z],.006,.006,10,HC.BOLT);ball(mb,[X(u+.08),y+.14,z],.009,10,HC.GB);},35);
    {const u0=fr(s*zw),ep=u0+(F.epU==null?.08:F.epU);
      hdPart(out,mb=>{hdExtrude(mb,[[X(u0),y],[X(ep),y],[X(ep+.02),y+.13],[X(u0)-.02,y+.06]],s*zw-.004,s*zw+.004,C,.0015,2,true);},35);}
    /* the canards */
    for(const [yy,du] of [[.62,.05],[.53,.03]]){const Y=yy+K.dy+F.fdy,u0=K.uFront(.8,Y)+du,ax=[1,0,0],ay=[0,0,s],az=[0,-s,0];
      hdPart(out,mb=>{hdExtrude(mb,[[0,.78],[-.24,.94],[-.2,.95],[-.02,.95],[.0,.92]].map(([x,z])=>[x,z]),-.0025,.0025,C,.001,1,true);},35,null,M4.basis([X(u0),Y,0],ax,ay,az));}}
  /* the tow strap, looped under the slot */
  {const z=-.26,u=K.uFront(.26,y+.1)+.02,RED=SMC('#c41d16',MAT.FABRIC),path=[];for(let k=0;k<=12;k++){const t=k/12*PI;path.push([X(u)+Math.sin(t)*.045,y+.05-.025*Math.sin(t)-Math.cos(t)*.03,z]);}
    hdPart(out,mb=>{hdSweep(mb,path,[[-.0015,-.012],[.0015,-.012],[.0015,.012],[-.0015,.012]],RED,[0,0,1],true,true);},40);}
}
function hkSkirts(out,car){
  const K=HDK,D=K.D,X=K.X,C=hkCARB(),y=K.dy+D.B.chY+.34,u0=D.uFa+D.arch.a+.1,u1=D.uRa-D.arch.a-.1;
  for(const s of [1,-1]){const rows=[];
    for(let k=0;k<=30;k++){const t=k/30,u=u0+(u1-u0)*t,e=sm01(Math.min(t,1-t)/.08),zb=K.sideZ(u,y+.05)-.01,o=.075*e+.01;
      const sec=[[0,.03],[o*.6,.012],[o,.0],[o+.004,-.012],[o-.004,-.02],[0,-.02]];rows.push(sec.map(([dz,dy2])=>[X(u),y+dy2,s*(zb+dz)]));}
    hdPart(out,mb=>{hdLoft(mb,rows,C,true,s<0);hdCap(mb,rows[0],C,s>0);hdCap(mb,rows[30],C,s<0);},40);}
}
function hkScoop(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,PA=SV([1,1,1],MAT.PAINT),u0=G.rf+.08,u1=u0+.42,w=.17,h=.075,n=20,m=16;
  const hh=u=>h*Math.pow(clamp(1-(u-u0)/(u1-u0),0,1),.8),prof=(z,u)=>K.topY(u,Math.abs(z))+hh(u)*Math.pow(Math.max(0,1-Math.pow(Math.abs(z)/w,4)),.5)-.002;
  /* the hood: rows across from side to side, from the mouth back to where it meets the glass */
  const rows=[];for(let i=0;i<=n;i++){const u=u0+(u1-u0)*i/n,row=[];for(let j=0;j<=m;j++){const z=-w*1.06+2*w*1.06*j/m;row.push([X(u),Math.abs(z)>w?K.topY(u,Math.abs(z))-.002:prof(z,u),z]);}rows.push(row);}
  hdPart(out,mb=>{hdLoft(mb,rows,PA,false,true);},45);
  /* the mouth: its lip, a black throat back into the hood, the mesh across it */
  const mouth=[];for(let j=0;j<=m;j++){const z=-w+2*w*j/m;mouth.push([z,prof(z,u0)]);}
  const lipIn=mouth.map(([z,yy])=>[z*.9,K.topY(u0,Math.abs(z))+(yy-K.topY(u0,Math.abs(z)))*.82]);
  hdPart(out,mb=>{const A=mouth.map(([z,yy])=>[X(u0),yy,z]),B=lipIn.map(([z,yy])=>[X(u0)-.004,yy,z]);hdLoft(mb,[A,B],PA,false,true);
    const T=lipIn.map(([z,yy])=>[X(u0+.12),K.topY(u0+.12,Math.abs(z))+(yy-K.topY(u0,Math.abs(z)))*.5,z]);hdLoft(mb,[B,T],HC.GB,false,true);
    const base=[[X(u0)-.004,K.topY(u0,w*.9),-w*.9],[X(u0+.12),K.topY(u0+.12,w*.9),-w*.9],[X(u0+.12),K.topY(u0+.12,w*.9),w*.9],[X(u0)-.004,K.topY(u0,w*.9),w*.9]];
    mb.quad(base[0],base[1],base[2],base[3],HC.GB[0],0,HC.GB[2]);hdCap(mb,T,HC.GB,false);},30);
  {const P=lipIn.map(([z,yy])=>[z,yy]).concat([[w*.9,K.topY(u0,w*.9)],[-w*.9,K.topY(u0,w*.9)]]);
    hdPart(out,mb=>{hpMesh(mb,hdHull(P),.012,.0012,HC.HONEY,([z,yy],l)=>[X(u0+.012+l),yy,z]);},0);}
}
function hkFin(out,car){
  const K=HDK,D=K.D,G=D.G,X=K.X,C=hkCARB(),u0=G.rr-.15,u1=D.L-.4,n=24,base=[],top=[],tR=K.topY(G.rr,0)+.03,t1=K.topY(u1,0);
  for(let i=0;i<=n;i++){const t=i/n,u=u0+(u1-u0)*t;base.push([X(u),K.topY(u,0)-.01]);top.push([X(u),tR-(tR-t1)*.25*Math.pow(t,1.4)]);}
  /* the fin's outline: up the base, back down the top, its leading corner rounded off */
  const poly=base.concat(top.slice().reverse());
  hdPart(out,mb=>{hdExtrude(mb,poly,-.0055,.0055,C,.0025,3,true);},35);
}
function hkWing(out,car){
  const K=HDK,D=K.D,X=K.X,L=D.L,C=hkCARB(),hw=.86,c=.34,yd=K.topY(L-.28,.42),yw=yd+.29,xl=X(L-.44),aoa=.2;
  /* the game's wing off its body (its main plane, Gurney, necks and endplates, all carbon over the tail) */
  hdDrop(car.body,(cc,m)=>m===MAT.CARBON&&D.uC-cc[0]>3.9&&cc[1]>.75);
  /* the main plane: a cambered section, lifted at the back by its angle */
  const sec=[];{const N=18;for(let i=0;i<=N;i++){const t=.5-.5*Math.cos(i/N*PI),th=.11*c*(2.97*Math.sqrt(t)-1.26*t-3.52*t*t+2.84*t*t*t-1.0*t*t*t*t)*.5,cam=-.045*c*4*t*(1-t);sec.push([t,cam+th]);}
    for(let i=N-1;i>=1;i--){const t=.5-.5*Math.cos(i/N*PI),th=.11*c*(2.97*Math.sqrt(t)-1.26*t-3.52*t*t+2.84*t*t*t-1.0*t*t*t*t)*.5,cam=-.045*c*4*t*(1-t);sec.push([t,cam-th]);}}
  const at=(t,v,z)=>{const xx=t*c,ca=Math.cos(aoa),sa=Math.sin(aoa);return [xl-(xx*ca+v*sa*0),yw+xx*sa+v*ca,z];};
  const rings=[];for(let k=0;k<=8;k++){const z=-hw+2*hw*k/8;rings.push(sec.map(([t,v])=>at(t,v,z)));}
  hdPart(out,mb=>{hdLoft(mb,rings,C,true);hdCap(mb,rings[0],C,true);hdCap(mb,rings[8],C,false);},40);
  /* the Gurney strip along the trailing edge */
  {const p=at(1,0,0);hdPart(out,mb=>{hdRBox(mb,[p[0]+.002,p[1]+.012,0],[.002,.014,hw-.005],.0015,C,1);},30);}
  for(const s of [1,-1]){
    /* the endplate */
    hdPart(out,mb=>{hdExtrude(mb,[[xl+.05,yw-.09],[xl+.03,yw+.1],[xl-c-.03,yw+.13],[xl-c-.06,yw-.09]].reverse(),s*hw+(s>0?0:-.008),s*hw+(s>0?.008:0),C,.002,2,true);},35);
    /* the swan neck: up from its foot on the deck behind the wing, over the top and down onto the plane */
    const z=s*.42,top=at(.38,.0,z),yf=K.topY(L-.07,.42),path=[[X(L-.07),yf-.005,z],[X(L-.065),yd+.08,z],[X(L-.07),yw+.08,z],[X(L-.11),yw+.13,z],[X(L-.2),yw+.145,z],[top[0]-.01,top[1]+.06,z],[top[0],top[1]+.012,z]];
    hdPart(out,mb=>{hdSweep(mb,path,[[-.026,-.006],[.026,-.006],[.026,.006],[-.026,.006]],C,[0,0,1],true,true);},35);
    hdPart(out,mb=>{hdRBox(mb,[X(L-.07),yf+.004,z],[.05,.01,.022],.005,C,2);for(const du of [-.03,.03])hdCyl(mb,[X(L-.07+du),yf+.012,z],[X(L-.07+du),yf+.022,z],.006,.006,8,HC.BOLT);},35);
    hdPart(out,mb=>{hdRBox(mb,[top[0],top[1]+.012,z],[.05,.006,.02],.004,C,2);},35);}
}
