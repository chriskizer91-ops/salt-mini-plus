/* =====================================================================================
   THE COUPE'S ROAD-CAR BITS (models/src/cars/coupe/86_bits): what a track car with plates still wears outside.
   - The rear plate in a recess in the lid, blank in a plain raised border, its two lamps and screws, the reversing
     camera between the lamps.
   - The high stop lamp under the ducktail's lip, a strip of LEDs behind a red lens.
   - The badge, front and back: an original one, a six-sided chrome rim echoing the grille round a black field
     with a red slash through it.
   - The side markers: amber on the nose's corners, red behind the rear wheels.
   - The parking sensors, four in each bumper, painted, in thin dark rings.
   - The tow eye's cover in the front bumper, its shut line and a little arrow.
   - The fuel flap on the right rear quarter, flush, with the push-release dimple.
   - The shark-fin aerial on the roof.
   - Rubber seals round the side glass.
   - (On the bonnet, so they lift with it: the washer jets at its back edge, cpBonnetBits.)
   ===================================================================================== */
/* a point on the body's front (F) or rear (R) face, or a side (SR, SL), and the outward normal there */
function cpOn(view,a,b,off=0){const K=HDK,S=(p,q,o)=>view==='F'||view==='R'?hdS(view,p,q,o):hdSS(view==='SR'?1:-1,p,q,o),e=.004;
  const p=S(a,b,off),pa=S(a+e,b,off),pb=S(a,b+e,off);let n=V3.norm(V3.cross(V3.sub(pa,p),V3.sub(pb,p)));
  const want=view==='F'?[1,0,0]:view==='R'?[-1,0,0]:view==='SR'?[0,0,1]:[0,0,-1];if(V3.dot(n,want)<0)n=V3.mul(n,-1);return {p,n};}
/* a frame on the surface: local z out along the normal, local y as near the world's up as it can be */
function cpFrame(p,n){const up=Math.abs(n[1])>.95?[1,0,0]:[0,1,0],x=V3.norm(V3.cross(up,n)),y=V3.cross(n,x);return M4.basis(p,x,y,n);}
function cpBadge(out,p,n,w=.05,h=.02){const M=cpFrame(p,n);
  const hex=[[-w,0],[-w+h*.8,-h],[w-h*.8,-h],[w,0],[w-h*.8,h],[-w+h*.8,h]],inner=hex.map(([x,y])=>[x*.84,y*.72]);
  /* the chrome rim, the black field set into it, the red slash */
  hdPart(out,mb=>{hdExtrude(mb,hex,-.001,.0035,MM.CHROME,.0012,2,false);},40,null,M);
  hdPart(out,mb=>{hdExtrude(mb,inner,.0034,.0042,HC.GB,0,1,false);},30,null,M);
  hdPart(out,mb=>{hdExtrude(mb,[[-w*.32,-h*.66],[-w*.06,-h*.66],[w*.32,h*.66],[w*.06,h*.66]],.0041,.0055,SV([1,1,1],MAT.ACCENT),.0006,1,false);
    hdExtrude(mb,[[-w*.62,-h*.66],[-w*.48,-h*.66],[-w*.18,h*.12],[-w*.32,h*.12]],.0041,.005,MM.CHROME,.0005,1,false);
    hdExtrude(mb,[[w*.48,h*.66],[w*.62,h*.66],[w*.32,-h*.12],[w*.18,-h*.12]],.0041,.005,MM.CHROME,.0005,1,false);},40,null,M);}
function cpExtras(out,car){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,L=D.L,PA=SV([1,1,1],MAT.PAINT);
  /* ---------- the rear plate in its recess ---------- */
  {const pr=RR2(-.172,.172,Y(.558),Y(.708),.018);hdCut(car.body,'R',pr);
    hdRecess(out,'R',pr,.02,.985,PA,()=>PA,5);
    const pl=RR2(-.152,.152,Y(.575),Y(.69),.008);
    hdPart(out,mb=>{const P=hdResample(pl,.01),M=P.map(p=>hdS('R',p[0],p[1],-.016));hdGrid(mb,'R',pl,()=>-.016,()=>SV([1,1,1],MAT.PLATE),.02);
      hdLoft(mb,[M,P.map(p=>hdS('R',p[0],p[1],-.019))],SV([1,1,1],MAT.PLATE),true);},20);
    hdTrim(out,'R',hdResample(RR2(-.146,.146,Y(.58),Y(.685),.006),.01),.004,.0015,SV([.05,.07,.18],MAT.COL),true,50,-.016);
    for(const z of [-.12,.12])hdPart(out,mb=>{const c=hdS('R',z,Y(.676),-.016);hdCyl(mb,c,V3.add(c,[-.003,0,0]),.0055,.005,12,HC.BOLT);hdRBox(mb,V3.add(c,[-.0031,0,0]),[.0004,.0035,.0008],.0003,HC.GB,1);},40);
    /* the plate lamps in the recess's top, the camera between them */
    for(const z of [-.075,.075])hdPart(out,mb=>{const c=hdS('R',z,Y(.704),-.01);hdRBox(mb,c,[.008,.0025,.02],.002,HC.LENSH,2);hdRBox(mb,V3.add(c,[0,.002,0]),[.009,.002,.022],.002,HC.GB,1);},40);
    hdPart(out,mb=>{const c=hdS('R',0,Y(.7),-.008);hdRBox(mb,c,[.01,.009,.016],.004,HC.GB,2);hdCyl(mb,V3.add(c,[-.005,-.001,0]),V3.add(c,[-.0115,-.001,0]),.0065,.0055,18,HC.GB);
      hdCyl(mb,V3.add(c,[-.0112,-.001,0]),V3.add(c,[-.0118,-.001,0]),.0045,.0045,18,SV([1,1,1],SM.MIRROR));},40);}
  /* ---------- the high stop lamp under the ducktail ---------- */
  {const P=RR2(-.17,.17,Y(.815),Y(.829),.006);
    hdLampUnit(out,'R',P,[car.body],{deep:.012,k:.9,wall:HC.GB,back:()=>HC.GB,bulge:.0012,cell:.004,lens:()=>HC.REDL,tol:.04,seal:false,
      inside:o=>{hdPart(o,mb=>{for(let z=-.16;z<=.161;z+=.02)hdRBox(mb,hdS('R',z,Y(.822),-.006),[.002,.003,.006],.0015,SV([1,1,1],MAT.TAIL),1);},40);}});}
  /* ---------- the badges ---------- */
  {const f=cpOn('F',0,Y(.565),.0005);cpBadge(out,f.p,f.n,.052,.021);const r=cpOn('R',0,Y(.752),.0005);cpBadge(out,r.p,r.n,.046,.019);}
  /* ---------- the side markers ---------- */
  for(const s of [1,-1]){const vw=s>0?'SR':'SL';
    for(const [u0,u1,y0,y1,m] of [[.17,.27,.405,.425,HC.AMBERL],[4.24,4.33,.52,.538,HC.REDL]]){const P=hdResample(RR2(u0,u1,Y(y0),Y(y1),.008),.006),c=hdCen(P);
      /* (set on the skin rather than into it: a dark bezel, the reflector, the lens over it) */
      hdPart(out,mb=>{const F=P.map(([u,y])=>hdSS(s,u,y,.0003)),B=P.map(([u,y])=>hdSS(s,u,y,.0016));hdLoft(mb,[F,B],HC.GB,true);
        hdCap(mb,P.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*.92,c[1]+(y-c[1])*.82,.0014)),HC.REFLC,s<0);},30);
      hdPart(out,mb=>{const R=[.94,.85,.5].map((k,i)=>P.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*k,c[1]+(y-c[1])*k*.9,.0018+[0,.001,.0016][i])));hdLoft(mb,R,m,true,s>0);hdCap(mb,R[2],m,s>0);},40);}}
  /* ---------- the parking sensors ---------- */
  {const sensor=(view,a,b)=>{const {p,n}=cpOn(view,a,b,0),M=cpFrame(p,n);
      hdPart(out,mb=>{hdRev(mb,[[.0125,-.004],[.0125,.0002],[.0108,.0004],[.0108,-.002]],24,HC.GB);},40,null,M);
      hdPart(out,mb=>{hdRev(mb,[[0,.0016],[.007,.0015],[.0098,.001],[.0104,0],[.0104,-.004]],24,PA);},40,null,M);};
    for(const s of [1,-1]){sensor('F',s*.53,Y(.47));sensor('F',s*.7,Y(.455));sensor('R',s*.2,Y(.475));sensor('R',s*.5,Y(.47));}}
  /* ---------- the tow eye's cover ---------- */
  {const {p,n}=cpOn('F',.66,Y(.39),0),M=cpFrame(p,n),R=hdRRect(.028,.018,.008,5);
    hdPart(out,mb=>{const a=R.map(([x,y])=>[x,y,.0004]),b=R.map(([x,y])=>[x*1.06,y*1.1,.0004]);const ring=[...a,a[0]],ring2=[...b,b[0]];hdLoft(mb,[ring,ring2],HC.GB,false);},30,null,M);
    hdPart(out,mb=>{hdExtrude(mb,[[-.012,-.004],[.004,-.004],[.004,-.008],[.013,0],[.004,.008],[.004,.004],[-.012,.004]],0,.0008,HC.GB,0,1,false);},30,null,M);}
  /* ---------- the fuel flap on the right rear quarter ---------- */
  {const P=RR2(3.12,3.235,Y(.655),Y(.77),.022);hdFlush(out,car,1,P,.014);
    const c=hdSS(1,3.215,Y(.712),.0002);hdPart(out,mb=>{hdCyl(mb,c,V3.add(c,[0,0,-.003]),.009,.007,18,PA);},40);}
  /* ---------- the shark-fin aerial ---------- */
  {const u0=2.8,u1=2.96,rings=[];for(let k=0;k<=14;k++){const t=k/14,u=u0+(u1-u0)*t,base=K.topY(u,0),h=.058*Math.sin(Math.min(1,t*1.15)*PI*.5)**1.2*(1-Math.max(0,t-.85)/.15*.9),w=.022*Math.sin(Math.min(1,t*1.4+.08)*PI*.5)*(1-t*.5);
      const ring=[];for(let j=0;j<=10;j++){const a=j/10*PI;ring.push([X(u),base+Math.max(.001,h)*Math.sin(a)-.002,Math.cos(a)*Math.max(.003,w)]);}rings.push(ring);}
    hdPart(out,mb=>{hdLoft(mb,rings,HC.GB,false);hdCap(mb,rings[0],HC.GB,true);hdCap(mb,rings[14],HC.GB,false);},45);
    hdPart(out,mb=>{const ring=[];for(let k=0;k<=24;k++){const t=k/24*TAU;ring.push([X((u0+u1)/2)+Math.cos(t)*(u1-u0)*.52,K.topY((u0+u1)/2,0)-.0005,Math.sin(t)*.026]);}hdTube(mb,ring,.0016,6,HC.SEAL,true,false);},40);}
  /* ---------- the seals round the side glass ---------- */
  for(const P0 of hdSideGlass())for(const s of [1,-1]){const P=hdResample(P0,.012);if(P.length<4)continue;const pts=P.map(([u,y])=>hdSS(s,u,y,.0045));pts.push(pts[0]);
    hdPart(out,mb=>{hdSweep(mb,pts,[[-.0045,-.002],[.0045,-.002],[.0035,.0012],[-.0035,.0012]],HC.SEAL,[0,0,s],true,false);},50);}
}
/* the washer jets on the bonnet's back edge (built on the bonnet, so they lift with it) */
function cpBonnetBits(out,car){const K=HDK,D=K.D,X=K.X;
  for(const s of [1,-1]){const u=D.hood.u1-.09,z=s*.27,y=K.topY(u,Math.abs(z)),c=[X(u),y,z];
    hdPart(out,mb=>{hdRBox(mb,V3.add(c,[0,.002,0]),[.012,.005,.008],.004,HC.GB,3);hdCyl(mb,V3.add(c,[.006,.004,0]),V3.add(c,[.012,.006,0]),.0025,.002,10,HC.GB);},40);}}
