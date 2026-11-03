/* =====================================================================================
   SMALL SHARED PIECES FOR THE OTHER CARS:
   - hdUnder: the underside (the frame, the drivetrain, the tank, the suspension, the skin's floor: what nobody sees
     from the road) taken out of the body into a piece of its own, so the traffic can leave it out.
   - hdWipers: the game's wipers (strokes painted on the glass) taken off and modelled: a pivot cap, an arm on a
     spring, a beam blade with its rubber, lying along the bottom of the windshield; the rear one on a hatch.
   - hdLampUnit: a lamp in a hole cut in the body (the SUV Studio's way, 72_face): a cavity with dark walls and a
     reflector, things inside it, a lens over the opening following the body's curve, a seal round it.
   ===================================================================================== */
function hdUnder(car){
  const K=HDK,D=K.D,src=car.body,p=src.p,lk=D.look,spring=lk.springCol?lk.springCol[0][0]:-1,keep=[],under=new MB();
  const isU=(m,c)=>m===MAT.METAL&&(Math.abs(c-.028)<1e-4||Math.abs(c-.03)<1e-4||Math.abs(c-spring)<1e-4||Math.abs(c-.35)<1e-4);
  const floor=new Map(),fl=u=>{const k=Math.round(u*20);let y=floor.get(k);if(y===undefined){y=secKeys(D,clamp(k/20,0,D.L)).P[0][1];floor.set(k,y);}return y;};
  for(let t=0;t<p.length/9;t++){const o=t*9,m=src.m[t*3],x=(p[o]+p[o+3]+p[o+6])/3,y=(p[o+1]+p[o+4]+p[o+7])/3,u=D.uC-x;
    if(isU(m,src.c[t*12])&&y<fl(u)+.025){for(let k=0;k<9;k++){under.p.push(p[o+k]);under.n.push(src.n[o+k]);}for(let k=0;k<12;k++)under.c.push(src.c[t*12+k]);for(let k=0;k<3;k++)under.m.push(m);}
    else keep.push(t);}
  const q={p:[],n:[],c:[],m:[]};for(const t of keep){for(let k=0;k<9;k++){q.p.push(p[t*9+k]);q.n.push(src.n[t*9+k]);}for(let k=0;k<12;k++)q.c.push(src.c[t*12+k]);for(let k=0;k<3;k++)q.m.push(src.m[t*3+k]);}
  Object.assign(src,q);return under;}

function hdWipers(out,car,o={}){
  const K=HDK,D=K.D,G=D.G,X=K.X,topY=K.topY,u=G.cowl+.07;
  /* the game's wipers: black strokes lying on the glass at the windshield's foot (and on a hatch's rear glass) */
  hdDrop(car.body,(c,m,cl)=>{if(m!==MAT.COL||Math.abs(cl-.010)>1e-4)return false;const uu=D.uC-c[0];
    if(Math.abs(uu-(u+.01))<.05&&c[1]>topY(uu,Math.min(Math.abs(c[2]),.9))+.005)return true;
    if(D.B.wiperR&&uu>D.B.wiperR-.25&&c[1]>D.belt(D.B.wiperR)+.05&&c[1]<D.belt(D.B.wiperR)+.3&&Math.abs(c[2])<.5)return true;return false;});
  const BLK=HC.GB,RUB=SV([.015,.015,.016],MAT.RUBBER),on=(uu,z,lift)=>[X(uu),topY(uu,Math.abs(z))+lift,z];
  for(const [z0,z1,pz] of o.blades||[[-.62,.06,-.5],[.02,.66,.12]]){
    /* the blade: a rubber lip under a flat beam with a spoiler, lying along the glass */
    const n=24,path=[];for(let i=0;i<=n;i++){const t=i/n,z=z0+(z1-z0)*t,uu=u+.02*t;path.push(on(uu,z,.012));}
    hdPart(out,mb=>{const sec=[[-.004,-.008],[.004,-.008],[.0015,-.002],[-.0015,-.002]];hdSweep(mb,path,sec,RUB,[0,1,0],true,true);},40);
    hdPart(out,mb=>{const sec=[[-.009,-.002],[.009,-.002],[.007,.004],[-.002,.009],[-.009,.003]];hdSweep(mb,path,sec,BLK,[0,1,0],true,true);},40);
    /* the arm, from its pivot at the cowl to the blade's middle, and the pivot's cap */
    const piv=on(G.cowl-.03,pz,.03),mid=path[Math.round(n*.55)],a=[];for(let i=0;i<=10;i++){const t=i/10;a.push(V3.add(V3.lerp(piv,V3.add(mid,[0,.008,0]),t),[0,.018*Math.sin(t*PI),0]));}
    hdPart(out,mb=>{hdSweep(mb,a,hdRRect(.005,.009,.003,2),BLK,[0,1,0],true,true);},40);
    hdPart(out,mb=>{hdCyl(mb,V3.add(piv,[0,-.03,0]),V3.add(piv,[0,.012,0]),.022,.02,20,BLK);ball(mb,V3.add(piv,[0,.012,0]),.02,16,BLK);},40);}
  /* a rear wiper on the hatch's glass */
  if(o.rear&&D.B.wiperR){const wr=D.B.wiperR,y0=D.belt(wr)+.1,piv=K.uRear(.04,y0),P0=[X(piv)-.012,y0,.04],n=16,path=[];
    for(let i=0;i<=n;i++){const t=i/n,z=.04+.38*t,y=y0+.12*t;path.push([X(K.uRear(z,y))-.012,y,z]);}
    hdPart(out,mb=>{hdSweep(mb,path,[[-.004,-.006],[.004,-.006],[.0015,-.002],[-.0015,-.002]].map(([a,b])=>[a,-b]),RUB,[1,0,0],true,true);},40);
    hdPart(out,mb=>{hdSweep(mb,path,[[-.008,.002],[.008,.002],[.006,.008],[-.006,.008]],BLK,[1,0,0],true,true);},40);
    hdPart(out,mb=>{hdCyl(mb,[P0[0]+.02,P0[1],P0[2]],[P0[0]-.02,P0[1],P0[2]],.02,.018,18,BLK);},40);}
}

/* a lamp: P (a convex outline in front F or rear R view, (z, y)) cut out of the cuts, a cavity deep metres deep with
   walls of material wall and a back of back(z, y), then inside(out) adds what is in it, the lens lens(z, y) over the
   opening (proud by bulge in the middle), a seal round it */
function hdLampUnit(out,view,P,cuts,o){
  for(const c of cuts)hdCut(c,view,P,o.tol||.03);
  hdRecess(out,view,P,o.deep||.07,o.k||.9,o.wall||HC.SATIN,o.back||(()=>HC.REFLC),7);
  if(o.inside)o.inside(out);
  const c=hdCen(P),rad=Math.max(...P.map(p=>Math.hypot(p[0]-c[0],p[1]-c[1]))),bulge=o.bulge==null?.004:o.bulge;
  hdPart(out,mb=>{hdGrid(mb,view,P,(z,y)=>.0012+bulge*(1-Math.min(1,Math.hypot(z-c[0],y-c[1])/rad)**2),o.lens||(()=>HC.LENS),o.cell||.006);},40);
  if(o.seal!==false)hdTrim(out,view,hdResample(P,.006),.007,.003,HC.SEAL,true,50);
}

/* a bumper moulding lofted along its plan, as the pickup's (cars/pickup/82_face): o.half the plan's right half as
   [x, z] from the middle out (mirrored for the left), o.sec its section [q (how far in from the plan), y], o.in a point
   inside the car (the plan's inward side faces it), o.hole(z, y) where it is left open (for lamps, intakes, a
   plate), o.m its material. Hands back onBar(z, y, d): the face's point there, pushed in by d */
function hdBumperLoft(out,o){
  const plan=[...o.half.slice(1).reverse().map(([x,z])=>[x,-z]),...o.half],sec=o.sec,m=o.m;
  const st=plan.map((p,i)=>{const a=plan[Math.max(0,i-1)],b=plan[Math.min(plan.length-1,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],l=Math.hypot(tx,tz)||1;let n=[-tz/l,tx/l];
    if(n[0]*(o.in[0]-p[0])+n[1]*(o.in[1]-p[1])<0)n=[-n[0],-n[1]];return {p,n};});
  const P=(i,j)=>{const s=st[i],[q,y]=sec[j];return [s.p[0]+s.n[0]*q,y,s.p[1]+s.n[1]*q];};
  hdPart(out,mb=>{for(let i=0;i<st.length-1;i++)for(let j=0;j<sec.length-1;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);if(o.hole&&o.hole((a[2]+c[2])/2,(a[1]+c[1])/2))continue;mb.quad(a,b,c,d,m[0],m[1],m[2]);}
    for(const i of [0,st.length-1])for(let j=1;j<sec.length-1;j++)mb.tri(P(i,0),P(i,j),P(i,j+1),m[0],m[1],m[2]);},o.deg||38);
  /* (the face's point: on the plan at z, down the section to y, then in by d) */
  const onBar=(z,y,d=0)=>{let i=0;while(i<st.length-2&&st[i+1].p[1]<z)i++;const t=clamp((z-st[i].p[1])/Math.max(1e-6,st[i+1].p[1]-st[i].p[1]),0,1),
      px=st[i].p[0]+(st[i+1].p[0]-st[i].p[0])*t,pz=st[i].p[1]+(st[i+1].p[1]-st[i].p[1])*t,nx=st[i].n[0]+(st[i+1].n[0]-st[i].n[0])*t,nz=st[i].n[1]+(st[i+1].n[1]-st[i].n[1])*t;
    let j=0;while(j<sec.length-2&&!(sec[j][1]>=y&&sec[j+1][1]<=y))j++;const u=clamp((sec[j][1]-y)/Math.max(1e-6,sec[j][1]-sec[j+1][1]),0,1),q=sec[j][0]+(sec[j+1][0]-sec[j][0])*u+d;return [px+nx*q,y,pz+nz*q];};
  return {onBar,st};}
/* a pocket in a bumper made by hdBumperLoft: the hole's rim (a convex outline (z, y)) walled back by deep, its back
   of material back */
function hdBumperPocket(out,bar,rim,deep,wall,back,k=.9){const c=hdCen(rim);
  hdPart(out,mb=>{const F=rim.map(([z,y])=>bar.onBar(z,y,-.001)),B=rim.map(([z,y])=>bar.onBar(c[0]+(z-c[0])*k,c[1]+(y-c[1])*k,deep));hdLoft(mb,[F,B],wall,true);hdCap(mb,B,back,F[0][0]<0);},30);}
