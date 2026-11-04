/* =====================================================================================
   THE PICKUP'S FACE AND FRONT BUMPER, IN THREE DIMENSIONS. The game paints its face on as decals (27_pickup
   FACES.pickup) and builds its bumper from boxes (FRONTS.pickup); here the body is cut open where each one sits and
   the real thing is built in the hole, on the decals' own outlines and sizes, so it is the same face.
   - The grille: the big opening, deep and dark; the thick body-colour surround standing out of it on a moulded
     section; a black inner frame; the honeycomb set back in it, big cells, deep walls.
   - The headlamps: square, in a cavity with chrome reflectors and satin walls; two projectors (chrome bezel,
     reflector bowl, barrel, the lens) on a black bezel panel; the LED brow across the bottom in its black channel;
     the amber corner behind a chrome divider with its bulb; one clear lens over it all, amber over the corner.
   - The bumper: one moulding in black textured plastic, lofted along its plan: the bar, the corners wrapping back to
     the flares, the valance under it with the intake and its slats; fog lamps in pockets (bezel, reflector, bulb,
     lens); the red tow hooks; the aluminium skid plate under it with its slots and bolts.
   ===================================================================================== */
function pkFace(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body,car.hood],X=K.X;
  /* ---------- the grille ---------- */
  const G0=RR2(-.69,.69,Y(.835),Y(1.315),.035);
  for(const c of cuts)hdCut(c,'F',G0);
  hdRecess(out,'F',G0,.1,.975,HC.GB,()=>HC.GB);
  /* the body-colour surround: a thick moulded frame, its outer edge clear of the opening's edge (the black gap), its
     inner side dropping into the opening */
  {const path=hdResample(RR2(-.627,.627,Y(.872),Y(1.278),.032),.008).map(p=>hdS('F',p[0],p[1],0));path.push(path[0]);
    const sec=[[-.041,-.03],[-.041,-.004],[-.038,.011],[-.031,.019],[-.02,.0225],[.024,.0225],[.033,.018],[.039,.008],[.041,-.012],[.041,-.045],[0,-.05]];
    hdPart(out,mb=>{hdSweep(mb,path,sec,MM.PAINT,[1,0,0],true,false);},40);}
  /* the black inner frame, and the honeycomb behind it */
  hdTrim(out,'F',hdResample(RR2(-.578,.578,Y(.893),Y(1.247),.02),.01),.014,.006,HC.GB,true,50,-.035);
  hdHoney(out,'F',RR2(-.57,.57,Y(.898),Y(1.243),.016),.048,.034,.0034,.024,HC.HONEY);
  /* ---------- the headlamps ---------- */
  for(const s of [1,-1]){
    const L=RR2(s*.70,s*.925,Y(.965),Y(1.255),.018);
    hdLampUnit(out,'F',L,cuts,{deep:.095,k:.9,wall:HC.SATIN,back:()=>HC.REFLC,bulge:.005,
      lens:(z,y)=>Math.abs(z)>.853?HC.AMBERL:HC.LENSH,
      inside:o=>{
        /* the black bezel panel the projectors sit in, the reflector above and below them */
        hdPart(o,mb=>{hdGrid(mb,'F',RR2(s*.708,s*.85,Y(1.06),Y(1.245),.014),()=>-.058,()=>HC.GB,.012);},30);
        for(const zp of [.745,.815]){const z=s*zp,y=Y(1.152),b=hdS('F',z,y,-.044),k=.56;
          hdRevAt(o,'F',b,[[.062,-.03],[.06,.004],[.056,.0105],[.05,.012],[.046,.008],[.044,0]].map(([r,h])=>[r*k,h*k]),MM.CHROME,56);
          hdRevAt(o,'F',b,[[.044,0],[.04,-.012],[.032,-.022],[.02,-.028],[0,-.03]].map(([r,h])=>[r*k,h*k]),HC.REFLC,56);
          hdRevAt(o,'F',b,[[.031,-.02],[.031,.012],[.029,.016]].map(([r,h])=>[r*k,h*k]),HC.SATIN,40);
          hdRevAt(o,'F',b,[[.029,.016],[.027,.026],[.02,.035],[.01,.039],[0,.04]].map(([r,h])=>[r*k,h*k]),HC.LAMPH,40,60);}
        /* the LED brow: a light guide in a black channel along the bottom */
        hdPart(o,mb=>{hdGrid(mb,'F',RR2(s*.712,s*.852,Y(.976),Y(1.04),.012),()=>-.034,()=>HC.GB,.01);},30);
        {const path=[];for(let z=.722;z<=.8441;z+=.01)path.push(hdS('F',s*z,Y(1.008),-.024));
          hdPart(o,mb=>{const sec=[];for(let i=0;i<16;i++){const a=i/16*TAU;sec.push([Math.cos(a)*.0105,Math.sin(a)*.0095]);}hdSweep(mb,path,sec,HC.LAMPH,[1,0,0],true,true);},40);}
        /* the amber corner: a chrome divider, a bulb in an amber-backed reflector */
        {const p=[];for(let y=.975;y<=1.2451;y+=.01)p.push([s*.853,Y(y)]);hdTrim(o,'F',p,.006,.075,MM.CHROME,false,50,-.08);}
        {const b=hdS('F',s*.886,Y(1.11),-.064);hdPart(o,mb=>{ball(mb,b,.0085,14,HC.BULB);},50);
          hdRevAt(o,'F',hdS('F',s*.886,Y(1.11),-.075),[[.03,-.006],[.024,-.012],[.012,-.016],[0,-.017]],HC.REFLC,36);}
      }});
  }
  pkBumperF(out,car);
}
/* the front bumper (in place of FRONTS.pickup's boxes): a moulding lofted along its plan, with holes where the fog
   lamps and the intake go */
function pkBumperF(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,X=K.X,xf=X(0)+.085,CL=SV([1,1,1],MAT.CLAD);
  /* the plan, right half: the bar straight across, a corner radius, then back along the side to the flare */
  const half=[];for(let z=0;z<=.86;z+=.02)half.push([xf-.012*(z/.86)**2,z]);
  const rc=.12,cx=xf-.012-rc;for(let k=1;k<=16;k++){const a=k/16*PI/2;half.push([cx+Math.cos(a)*rc,.86+Math.sin(a)*rc]);}
  for(let x=cx-.03;x>=X(.26);x-=.03)half.push([x,.98-.004*(cx-x)]);
  const plan=[...half.slice(1).reverse().map(([x,z])=>[x,-z]),...half];
  /* the section, from the top's back edge over the bar, down its face, under it, and the valance below (q: how far
     back from the plan, y) */
  const sec=[[.13,Y(.834)],[.06,Y(.836)],[.026,Y(.833)],[.009,Y(.826)],[.0015,Y(.81)],[.0002,Y(.777)],[0,Y(.745)],[.0004,Y(.713)],[.002,Y(.69)],[.006,Y(.66)],[.012,Y(.637)],[.022,Y(.626)],[.034,Y(.62)],
    [.036,Y(.611)],[.034,Y(.604)],[.0345,Y(.566)],[.037,Y(.528)],[.041,Y(.52)],[.052,Y(.514)],[.072,Y(.507)],[.15,Y(.503)]];
  /* every station: the point on the plan and the way back (into the car) there */
  const st=plan.map((p,i)=>{const a=plan[Math.max(0,i-1)],b=plan[Math.min(plan.length-1,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],l=Math.hypot(tx,tz)||1;return {p,n:[-tz/l,tx/l]};});
  /* (the way back is the plan's inward side: on the bar, -x) */
  for(const s of st){const cx2=xf-1.2;if(s.n[0]*(cx2-s.p[0])+s.n[1]*(0-s.p[1])<0){s.n[0]=-s.n[0];s.n[1]=-s.n[1];}}
  const P=(i,j)=>{const s=st[i],[q,y]=sec[j];return [s.p[0]+s.n[0]*q,y,s.p[1]+s.n[1]*q];};
  const fogZ=[.745,.855],fogY=[Y(.713),Y(.777)],inZ=.5,inY=[Y(.528),Y(.604)];
  const hole=(z,y)=>{const a=Math.abs(z);return a>fogZ[0]&&a<fogZ[1]&&y>fogY[0]&&y<fogY[1]||a<inZ&&y>inY[0]&&y<inY[1];};
  hdPart(out,mb=>{for(let i=0;i<st.length-1;i++)for(let j=0;j<sec.length-1;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1),zm=(a[2]+c[2])/2,ym=(a[1]+c[1])/2;
      if(hole(zm,ym))continue;mb.quad(a,b,c,d,CL[0],CL[1],CL[2]);}
    /* the ends, closed */
    for(const i of [0,st.length-1])for(let j=1;j<sec.length-1;j++)mb.tri(P(i,0),P(i,j),P(i,j+1),CL[0],CL[1],CL[2]);},38);
  /* the face's point at (z, y) on the bar (its plan and section), pushed back by d */
  const onBar=(z,y,d=0)=>{let i=0;while(i<st.length-1&&st[i+1].p[1]<z)i++;const t=clamp((z-st[i].p[1])/Math.max(1e-6,st[i+1].p[1]-st[i].p[1]),0,1),x0=st[i].p[0]+(st[i+1].p[0]-st[i].p[0])*t;
    let j=0;while(j<sec.length-1&&!(sec[j][1]>=y&&sec[j+1][1]<=y))j++;const u=clamp((sec[j][1]-y)/Math.max(1e-6,sec[j][1]-sec[j+1][1]),0,1),q=sec[j][0]+(sec[j+1][0]-sec[j][0])*u;return [x0-q-d,y,z];};
  /* ---------- the fog lamps: a pocket in the bar, a black bezel, a reflector, the bulb, the lens ---------- */
  for(const s of [1,-1]){const z0=s*fogZ[0],z1=s*fogZ[1],y0=fogY[0],y1=fogY[1],zc=(z0+z1)/2,yc=(y0+y1)/2;
    const rim=[];for(const [z,y] of hdResample(RR2(Math.min(z0,z1),Math.max(z0,z1),y0,y1,.012),.006))rim.push([z,y]);
    hdPart(out,mb=>{const F=rim.map(([z,y])=>onBar(z,y,-.001)),B=rim.map(([z,y])=>onBar(zc+(z-zc)*.86,yc+(y-yc)*.8,.05));hdLoft(mb,[F,B],HC.GB,true);
      const c=onBar(zc,yc,.05);hdCap(mb,B,HC.REFLC,s<0);},30);
    const c=onBar(zc,yc,.03);
    hdPart(out,mb=>{const sh=hdResample(RR2(-.05,.05,-.026,.026,.01),.006),ring=(d,k)=>sh.map(([a,b])=>[c[0]+d,c[1]+b*k,c[2]+a*k]);
      hdLoft(mb,[ring(.026,1.04),ring(.03,1.0),ring(.022,.94)],MM.CHROME,true);},40);
    hdPart(out,mb=>{ball(mb,[c[0]-.006,c[1],c[2]],.009,14,HC.LAMPH);},50);
    hdPart(out,mb=>{const sh=hdResample(RR2(-.047,.047,-.024,.024,.009),.006);const cen=[c[0]+.026,c[1],c[2]];
      for(let i=0;i<sh.length;i++){const a=sh[i],b=sh[(i+1)%sh.length];mb.tri(cen,[cen[0],c[1]+a[1],c[2]+a[0]],[cen[0],c[1]+b[1],c[2]+b[0]],HC.LENSH[0],0,HC.LENSH[2]);}},40);}
  /* ---------- the intake: a dark recess, a lip round it, five slats ---------- */
  {const rim=hdResample(RR2(-inZ,inZ,inY[0],inY[1],.01),.01);
    hdPart(out,mb=>{const F=rim.map(([z,y])=>onBar(z,y,-.001)),B=rim.map(([z,y])=>onBar(z*.99,y,.05));hdLoft(mb,[F,B],HC.GB,true);hdCap(mb,B,HC.GB,false);},30);
    for(let k=0;k<5;k++){const y=inY[0]+(inY[1]-inY[0])*(k+.5)/5,path=[];for(let z=-inZ+.005;z<=inZ-.0049;z+=.02)path.push(onBar(z,y,.012));
      hdPart(out,mb=>{hdSweep(mb,path,[[-.004,-.007],[.004,-.007],[.006,.004],[-.002,.008]].map(([a,b])=>[b,a]),CL,[0,1,0],true,true);},40);}}
  /* ---------- the tow hooks: red J-hooks out of the bar's underside, bolted to a black plate ---------- */
  for(const s of [1,-1]){const z=s*.45,RED=SV(lin('#c8241c'),SM.PAINTED);
    const P0=[xf-.1,Y(.632),z],pts=[P0,[xf-.02,Y(.63),z],[xf+.012,Y(.627),z]];for(let k=1;k<=12;k++){const a=k/12*PI*1.12;pts.push([xf+.012+Math.sin(a)*.03,Y(.597)+Math.cos(a)*.03,z]);}
    hdPart(out,mb=>{hdTube(mb,pts,.0105,14,RED,false,true);},40);
    hdPart(out,mb=>{hdRBox(mb,[xf-.08,Y(.632),z],[.04,.008,.035],.004,HC.GB,2);for(const dz of [-.02,.02])hdCyl(mb,[xf-.095,Y(.6405),z+dz],[xf-.095,Y(.646),z+dz],.007,.007,6,HC.BOLT);},40);}
  /* ---------- the skid plate: brushed aluminium, its front edge turned up, five slots, bolts along the back ---------- */
  {const c=[X(.18),Y(.48),0],ax=V3.norm([1,.4,0]),ay=V3.norm([-.4,1,0]),az=[0,0,1],hl=.2,hw=.46,th=.006,BR=HC.BRUSH;
    const at=(a,w,h)=>V3.add(c,V3.add(V3.mul(ax,a),V3.add(V3.mul(az,w),V3.mul(ay,h))));
    /* (in strips: behind the slots and in front of them plain; across the slots a tile round each, its surface lofted
       from the tile's edge in to the slot's) */
    const as=hl-.07,a0=as-.045,a1=as+.045,face=(mb,q)=>{for(const h of [th/2,-th/2]){const v=q.map(([a,w])=>at(a,w,h));if(h>0)mb.quad(v[0],v[1],v[2],v[3],BR[0],0,BR[2]);else mb.quad(v[0],v[3],v[2],v[1],BR[0],0,BR[2]);}};
    hdPart(out,mb=>{const strip=(aa,ab,n)=>{for(let j=0;j<n;j++){const w0=-hw+2*hw*j/n,w1=-hw+2*hw*(j+1)/n;face(mb,[[aa,w0],[ab,w0],[ab,w1],[aa,w1]]);}};
      strip(-hl,a0,24);strip(a1,hl,24);for(const [w0,w1] of [[-hw,-.4],[.4,hw]])face(mb,[[a0,w0],[a1,w0],[a1,w1],[a0,w1]]);
      for(let k=-2;k<=2;k++){const wc=k*.16,N=40,edge=[],ell=[];
        for(let i=0;i<N;i++){const t=i/N*TAU,cx=Math.cos(t),sx=Math.sin(t),ka=Math.abs(sx)>1e-9?.045/Math.abs(sx):1e9,kw=Math.abs(cx)>1e-9?.08/Math.abs(cx):1e9,kk=Math.min(ka,kw);
          edge.push([as+sx*kk,wc+cx*kk]);ell.push([as+sx*.02,wc+cx*.05]);}
        for(let i=0;i<N;i++){const i1=(i+1)%N;face(mb,[edge[i],edge[i1],ell[i1],ell[i]]);}
        const top=ell.map(([a,w])=>at(a,w,th/2)),bot=ell.map(([a,w])=>at(a,w,-th/2));hdLoft(mb,[top,bot],BR,true);}
      /* the edges, and the front turned up */
      const E=[[-hl,-hw],[hl,-hw],[hl,hw],[-hl,hw]];for(let e=0;e<4;e++){const [p0,w0]=E[e],[p1,w1]=E[(e+1)%4];mb.quad(at(p0,w0,th/2),at(p1,w1,th/2),at(p1,w1,-th/2),at(p0,w0,-th/2),BR[0],0,BR[2]);}
      const lip=(h)=>[at(hl,-hw,h),at(hl,hw,h),at(hl+.04,hw,h+.03),at(hl+.04,-hw,h+.03)];const A=lip(th/2),B=lip(-th/2);mb.quad(A[0],A[1],A[2],A[3],BR[0],0,BR[2]);mb.quad(B[0],B[3],B[2],B[1],BR[0],0,BR[2]);},30);
    hdPart(out,mb=>{for(let k=-4;k<=4;k++){const p=at(-hl+.03,k*.1,th/2);hdCyl(mb,p,V3.add(p,V3.mul(ay,.006)),.008,.0075,6,HC.BOLT);}},40);}
}
