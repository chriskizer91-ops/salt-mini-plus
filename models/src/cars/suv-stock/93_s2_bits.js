/* =====================================================================================
   THE SUV'S ROAD-CAR BITS (Studio 2): what a factory truck wears outside, beyond what its Studio face and tail have
   (the rear plate in its recess, its lamps and the chrome strip are the SUV Studio's, 72_face).
   - The badges, front and back: an original one, an oval chrome rim round a dark field with a raised chrome chevron.
   - The side markers in three dimensions over the game's painted ones: amber on the front bumper's corners, red on
     the rear's, each a dark bezel, a reflector and a lens.
   - The high stop lamp under the roof spoiler's lip: a black housing, a red lens, a row of LEDs behind it.
   - The parking sensors, four in the rear bumper, in thin dark rings.
   - The tow eye's cover in the front bumper's right, its shut line and a little arrow.
   - The mast aerial on the right front fender, its base and its whip leaning back.
   - Rubber seals round the side glass.
   - (On the hood, so they lift with it: the washer jets at its back edge, suvHoodBits.)
   o.noSensors, o.noAerial, o.noMarkers, o.noTowEye: a build that doesn't wear them.
   ===================================================================================== */
/* an oval badge on a surface (p, n): the chrome rim, the dark field, the raised chevron */
function suvBadge(out,p,n,w=.07,h=.03){const M=cpFrame(p,n),ov=[];for(let k=0;k<40;k++){const a=k/40*TAU;ov.push([Math.cos(a)*w,Math.sin(a)*h]);}
  hdPart(out,mb=>{hdExtrude(mb,ov,-.001,.004,MM.CHROME,.0014,2,false);},40,null,M);
  hdPart(out,mb=>{hdExtrude(mb,ov.map(([x,y])=>[x*.86,y*.74]),.0039,.0046,HC.GB,0,1,false);},30,null,M);
  hdPart(out,mb=>{hdExtrude(mb,[[-w*.55,-h*.42],[-w*.36,-h*.42],[0,h*.28],[w*.36,-h*.42],[w*.55,-h*.42],[0,h*.55]],.0045,.0062,MM.CHROME,.0006,1,false);},40,null,M);}
function suvExtras2(out,car,o={}){
  const K=HDK,D=K.D,X=K.X,dy=K.dy,Y=y=>y+dy,L=D.L,G=D.G,PA=SV([1,1,1],MAT.PAINT),lk=D.look;
  /* ---------- the badges ---------- */
  {const f=cpOn('F',0,Y(.908),.018);suvBadge(out,f.p,f.n,.075,.03);const r=cpOn('R',0,Y(1.105),.0008);suvBadge(out,r.p,r.n,.064,.026);}
  /* ---------- the side markers, over the game's painted ones ---------- */
  if(!o.noMarkers&&!lk.noMarkers)for(const s of [1,-1]){const vw=s>0?'SR':'SL',yc=D.cladY(.25);
    for(const [u0,u1,y0,y1,m] of [[.195,.335,yc+.045,yc+.09,HC.AMBERL],[L-.305,L-.165,D.cladY(L)-.125,D.cladY(L)-.08,HC.REDL]]){const P=hdResample(RR2(u0,u1,y0,y1,.01),.006),c=hdCen(P);
      hdPart(out,mb=>{const F=P.map(([u,y])=>hdSS(s,u,y,.0012)),B=P.map(([u,y])=>hdSS(s,u,y,.003));hdLoft(mb,[F,B],HC.GB,true);
        hdCap(mb,P.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*.92,c[1]+(y-c[1])*.82,.0028)),HC.REFLC,s<0);},30);
      hdPart(out,mb=>{const R=[.95,.86,.5].map((k,i)=>P.map(([u,y])=>hdSS(s,c[0]+(u-c[0])*k,c[1]+(y-c[1])*k*.9,.0032+[0,.0012,.002][i])));hdLoft(mb,R,m,true,s>0);hdCap(mb,R[2],m,s>0);},40);}}
  /* ---------- the high stop lamp under the roof spoiler's lip (where the game paints its red strip) ---------- */
  if(lk.spoiler==='lip'){const u0=G.rr-.08,u=u0+.13-.02,y=K.topY(u0,0)+.004-.03-.018*0-.014,x=X(u);
    hdPart(out,mb=>{hdRBox(mb,[x,y-.004,0],[.018,.012,.215],.006,HC.GB,3);},40);
    hdPart(out,mb=>{hdRBox(mb,[x-.004,y-.006,0],[.012,.0075,.205],.004,HC.REDL,2);},40);
    hdPart(out,mb=>{for(let z=-.19;z<=.191;z+=.019)hdRBox(mb,[x+.003,y-.006,z],[.004,.004,.005],.002,SV([1,1,1],MAT.TAIL),1);},40);}
  /* ---------- the parking sensors, four in the rear bumper ---------- */
  if(!o.noSensors){const sensor=(view,a,b)=>{const {p,n}=cpOn(view,a,b,0),M=cpFrame(p,n);
      hdPart(out,mb=>{hdRev(mb,[[.0125,-.004],[.0125,.0002],[.0108,.0004],[.0108,-.002]],24,HC.GB);},40,null,M);
      hdPart(out,mb=>{hdRev(mb,[[0,.0016],[.007,.0015],[.0098,.001],[.0104,0],[.0104,-.004]],24,SV([1,1,1],MAT.CLAD));},40,null,M);};
    for(const s of [1,-1]){sensor('R',s*.22,Y(.6));sensor('R',s*.55,Y(.6));}}
  /* ---------- the tow eye's cover in the front bumper ---------- */
  if(!o.noTowEye){const {p,n}=cpOn('F',.55,Y(.47),0),M=cpFrame(p,n),R=hdRRect(.026,.017,.008,5);
    hdPart(out,mb=>{const a=R.map(([x,y])=>[x,y,.0004]),b=R.map(([x,y])=>[x*1.06,y*1.1,.0004]);hdLoft(mb,[[...a,a[0]],[...b,b[0]]],HC.GB,false);},30,null,M);
    hdPart(out,mb=>{hdExtrude(mb,[[-.011,-.0035],[.004,-.0035],[.004,-.007],[.012,0],[.004,.007],[.004,.0035],[-.011,.0035]],0,.0008,HC.GB,0,1,false);},30,null,M);}
  /* ---------- the mast aerial on the right front fender ---------- */
  if(!o.noAerial){const u=1.28,y=D.belt(u)-.004,z=K.sideZ(u,y-.01)-.01,c=[X(u),y,z];
    hdPart(out,mb=>{hdCyl(mb,V3.add(c,[0,-.004,0]),V3.add(c,[0,.012,0]),.016,.011,20,HC.GB);hdCyl(mb,V3.add(c,[0,.012,0]),V3.add(c,[0,.03,0]),.006,.005,14,HC.GB);},40);
    hdPart(out,mb=>{const d=V3.norm([-.18,1,-.02]);hdCyl(mb,V3.add(c,[0,.03,0]),V3.add(V3.add(c,[0,.03,0]),V3.mul(d,.72)),.0022,.0014,8,MM.CHROME);ball(mb,V3.add(V3.add(c,[0,.03,0]),V3.mul(d,.72)),.003,8,HC.GB);},40);}
  /* ---------- the seals round the side glass ---------- */
  for(const P0 of hdSideGlass())for(const s of [1,-1]){const P=hdResample(P0,.012);if(P.length<4)continue;const pts=P.map(([u,y])=>hdSS(s,u,y,.0045));pts.push(pts[0]);
    hdPart(out,mb=>{hdSweep(mb,pts,[[-.0045,-.002],[.0045,-.002],[.0035,.0012],[-.0035,.0012]],HC.SEAL,[0,0,s],true,false);},50);}
}
/* the washer jets on the hood's back edge (built on the hood, so they lift with it) */
function suvHoodBits(out,car){const K=HDK,D=K.D,X=K.X;
  for(const s of [1,-1]){const u=D.hood.u1-.07,z=s*.3,y=K.topY(u,Math.abs(z)),c=[X(u),y,z];
    hdPart(out,mb=>{hdRBox(mb,V3.add(c,[0,.003,0]),[.013,.006,.009],.004,HC.GB,3);hdCyl(mb,V3.add(c,[.006,.006,0]),V3.add(c,[.013,.008,0]),.0026,.002,10,HC.GB);},40);}}
