/* =====================================================================================
   THE COUPE'S UNDERSIDE (models/src/cars/coupe/88_under), in place of the game's, which hangs the SUV's ladder frame,
   a box for a tank and stick suspension under every body. What a front-engined unibody track car with plates has
   under it, nose to tail:
   - The front undertray: a moulded tray from the lip back to the cradle, ribbed, louvres in it for the radiator's
     air, a scoop each side feeding a hose to the brake, screwed on round its edge.
   - The front cradle: cast aluminium rails and crossmembers; double wishbones (forged lower arms on bushes, the
     upper arms on the wheelhouse wall, cast uprights), red coilovers up into the towers, the steering rack in its
     boots and the tie rods, the anti-roll bar in its clamps and its drop links.
   - The floor: the pan pressed with beads, the tunnel down the middle, the floor rails and the seat crossmembers,
     the sills' pinch welds and four jacking pads, drain plugs, the seats' studs coming through; aluminium braces
     bolted across the tunnel and a heat shield in it over the pipes.
   - The drivetrain: the starter and the clutch's slave cylinder on the bell housing, the six-speed's ribbed case on
     its mount, a two-piece carbon driveshaft (a flex disc, the centre bearing, a CV joint), the differential in its
     finned cover on the rear cradle, the half-shafts in their boots.
   - The exhaust: from the headers' collectors two catalysts under their shields with their oxygen sensors, pipes
     down the tunnel to an X crossover, two resonators, out round the tank and under the rear cradle to a
     transverse silencer on rubber hangers, and four tips.
   - The rear: the heel kick and the seat pan, the fuel tank in its straps under it, the rear cradle, double
     wishbones with a toe link, red coilovers, the anti-roll bar behind the axle; the boot floor over the silencer.
   - The lines: two brake lines and the fuel feed and return clipped along the floor, the handbrake's cables from
     their equaliser to the rear calipers.
   The skin's own floor is kept at the nose and along the rockers, in the same coating; between the wheels it gives
   way to the pan built here.
   ===================================================================================== */
function cpUnder(car){
  const K=HDK,D=K.D,X=K.X,lk=D.look,L=D.L,uFa=D.uFa,uRa=D.uRa,U=new MB();
  const Pt=(u,y,z)=>[X(u),y,z];
  const COAT=SMC('#8e9196',SM.BEDLINER),COATD=SMC('#6c6f74',SM.BEDLINER),SEAM=SMC('#7a7d82',SM.ENGINE),TSH=SMC('#cfcfca',SM.CAST),
    ALU=SMC('#a7aaaf',SM.CAST),FORGE=SMC('#b9bcc0',SM.ENGINE),BLK=SMC('#1c1d1f',SM.PAINTED),STEEL=SMC('#2a2b2e',SM.ENGINE),
    EXH=SMC('#a29e96',SM.SATIN),EXHB=SMC('#8a7863',SM.SATIN),SHIELD=SMC('#c9c9c5',SM.BRUSH),
    TRAY=SMC('#36373a',SM.PLASTIC),TANK=SMC('#222325',SM.PLASTIC),CARB=SV([1,1,1],MAT.CARBON),RB=SV([.02,.02,.021],MAT.RUBBER),
    LINE=SMC('#c0c2c5',SM.BOLT),FUEL=SMC('#121213',SM.HOSE),CABLE=SMC('#1a1a1b',SM.HOSE),CLIP=SMC('#121214',SM.PLASTIC),BOLT=HC.BOLT;
  const part=(f,deg=35,o=null,M=null)=>hdPart(U,f,deg,o,M);

  /* ---------- the skin's underside: the nose's floor and the rockers kept, in the coating; the rest of the floor and
     the floor the game keeps under the bonnet (shown only while it is shut) give way to what is built here ---------- */
  {const sk=hdUnder(car);
    hdDrop(sk,c=>{const u=D.uC-c[0];return u>.5&&Math.abs(c[2])<D.plan(clamp(u,0,L))*.72;});
    for(let t=0;t<sk.m.length/3;t++)for(let k=0;k<3;k++){const i=t*12+k*4;sk.c[i]=COAT[0][0];sk.c[i+1]=COAT[0][1];sk.c[i+2]=COAT[0][2];sk.m[t*3+k]=COAT[2];}
    hdPut(U,sk);Object.assign(car.hide,{p:[],n:[],c:[],m:[]});}

  /* ================= the floor ================= */
  const fy=.205,u0=1.34,u1=3.31,floorY=cpFloorY;
  {const zs=[];for(let z=-.78;z<-.4;z+=.06)zs.push(z);for(let z=-.4;z<.4-1e-6;z+=.02)zs.push(z);for(let z=.4;z<.78;z+=.06)zs.push(z);zs.push(.78);
    part(mb=>{const rows=[],nr=Math.round((u1-u0)/.03);for(let i=0;i<=nr;i++){const u=u0+(u1-u0)*i/nr,ze=Math.min(.78,secKeys(D,u).P[0][0]);rows.push(zs.map(z=>{const zz=clamp(z,-ze,ze);return Pt(u,floorY(u,zz),zz);}));}
      hdLoft(mb,rows,COAT,false,true);},40);}
  /* the pressed beads across the pan, either side of the tunnel */
  for(const s of [1,-1])part(mb=>{for(const u of [1.72,1.9,2.4,2.58,2.98,3.14])hdRBox(mb,Pt(u,fy-.003,s*.53),[.014,.004,.19],.004,COAT,2);
    for(const u of [2.15,2.82])hdRBox(mb,Pt(u,fy-.003,s*.6),[.05,.004,.1],.004,COAT,2);},30);
  /* the floor rails, and the two seat crossmembers between them and the sills */
  for(const s of [1,-1]){
    cpBar(U,[Pt(u0-.02,fy-.012,s*.45),Pt(2.2,fy-.017,s*.45),Pt(u1+.02,fy-.017,s*.45)],.032,.016,.008,COATD,[0,1,0],40);
    for(const u of [2.1,2.78])cpBar(U,[Pt(u,fy-.01,s*.24),Pt(u,fy-.012,s*.6),Pt(u,fy-.01,s*.79)],.028,.012,.006,COATD,[0,1,0],40);}
  /* the sills: the pinch weld along the bottom, four jacking pads on it */
  for(const s of [1,-1]){part(mb=>{const pts=[];for(let u=u0+.05;u<=u1-.02;u+=.05){const P1=secKeys(D,u).P[1];pts.push(Pt(u,P1[1]+.004,s*(P1[0]-.012)));}
      hdSweep(mb,pts,[[-.002,-.016],[.002,-.016],[.002,.006],[-.002,.006]],SEAM,[0,1,0],true,true);},30);
    for(const u of [1.56,3.12]){const P1=secKeys(D,u).P[1],c=Pt(u,P1[1]-.012,s*(P1[0]-.012));
      part(mb=>{hdRBox(mb,V3.add(c,[0,.006,-s*.008]),[.06,.004,.03],.004,STEEL,2);hdCyl(mb,V3.add(c,[0,.004,-s*.01]),V3.add(c,[0,-.01,-s*.01]),.034,.032,24,RB);
        for(let q=0;q<4;q++){const a=q/4*TAU;hdRBox(mb,V3.add(c,[Math.cos(a)*.022,-.0105,-s*.01+Math.sin(a)*.022]),[.006,.0012,.006],.001,RB,1);}},30);}}
  /* the drain plugs, and the studs of the seats' rails coming through */
  part(mb=>{for(const [u,z] of [[1.82,.62],[2.36,.33],[2.96,.6],[1.68,.4],[3.22,.34]])for(const s of [1,-1]){const c=Pt(u,fy-.001,s*z);hdCyl(mb,c,V3.add(c,[0,-.005,0]),.022,.02,20,RB);hdCyl(mb,V3.add(c,[0,-.005,0]),V3.add(c,[0,-.0065,0]),.012,.01,16,RB);}},30);
  part(mb=>{for(const u of [2.14,2.5])for(const s of [1,-1])for(const z of [.19,.55]){const c=Pt(u,floorY(u,s*z)-.001,s*z);cpHex(mb,c,[0,-1,0],.0085,.007);}},25);
  /* braces bolted across the tunnel, and the heat shield up in it over the pipes */
  for(const u of [2.1,2.48,2.86])part(mb=>{hdRBox(mb,Pt(u,.193,0),[.03,.004,.25],.006,ALU,2);for(const z of [-.235,-.2,.2,.235])cpHex(mb,Pt(u+(z>0?.012:-.012)*Math.sign(z),.189,z),[0,-1,0],.007,.005);
    for(const s of [1,-1])hdRBox(mb,Pt(u,.2,s*.22),[.028,.006,.012],.003,ALU,1);},30);
  part(mb=>{const rows=[];for(let u=1.62;u<=u1-.04;u+=.04){const row=[];for(let k=0;k<=24;k++){const z=-.24+.48*k/24;row.push(Pt(u,floorY(u,z)-.01-.002*Math.sin(u*90+k),z));}rows.push(row);}hdLoft(mb,rows,TSH,false,true);
    for(const z of [-.24,.24]){const e=[];for(let u=1.62;u<=u1-.04;u+=.04)e.push(Pt(u,floorY(u,z)-.011,z));hdTube(mb,e,.003,6,TSH,false,true);}},30);

  /* ================= the front undertray ================= */
  const tu0=.33,tu1=.72,ty=u=>.2+.006*sm01((.5-u)/.17),tz=.6;
  {const LV={u0:.53,u1:.67,z:.3};
    part(mb=>{const rows=[];for(let u=tu0;u<=tu1+1e-6;u+=.01){const row=[];for(let z=-tz;z<=tz+1e-6;z+=.02)row.push(Pt(u,ty(u),z));rows.push(row);}
      /* (the louvres' opening left out of the grid: whole cells inside it) */
      for(let i=0;i<rows.length-1;i++)for(let j=0;j<rows[i].length-1;j++){const u=tu0+i*.01+.005,z=-tz+j*.02+.01;if(u>LV.u0&&u<LV.u1&&Math.abs(z)<LV.z)continue;
        mb.quad(rows[i][j],rows[i][j+1],rows[i+1][j+1],rows[i+1][j],TRAY[0],0,TRAY[2]);}},30);
    /* the rolled edge all round, and the lip turned down along its front */
    part(mb=>{const R=[[tu0,-tz],[tu0,tz],[tu1,tz],[tu1,-tz]],pts=[];for(let k=0;k<4;k++){const a=R[k],b=R[(k+1)%4],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.04);for(let i=0;i<n;i++){const t=i/n,u=a[0]+(b[0]-a[0])*t;pts.push(Pt(u,ty(u)-.002,a[1]+(b[1]-a[1])*t));}}
      hdTube(mb,pts,.005,8,TRAY,true,false);
      const f=[];for(let z=-tz;z<=tz+1e-6;z+=.03)f.push(Pt(tu0,ty(tu0)-.004,z));hdSweep(mb,f,[[-.003,-.018],[.004,-.018],[.004,.002],[-.003,.002]],TRAY,[1,0,0],true,true);},30);
    /* the louvres: slats leaning back over the opening, and its frame */
    part(mb=>{for(let u=LV.u0+.012;u<LV.u1-.005;u+=.018){const a=Pt(u,ty(u)+.004,0);hdRBox(mb,V3.add(a,[0,-.004,0]),[.006,.0015,LV.z],.001,TRAY,1);
        obox(mb,V3.add(a,[-.006,.006,0]),V3.norm([.6,.8,0]),V3.norm([-.8,.6,0]),[0,0,1],[.012,.0015,LV.z],TRAY);}
      for(const s of [1,-1])hdRBox(mb,Pt((LV.u0+LV.u1)/2,ty(.6)-.003,s*(LV.z+.004)),[(LV.u1-LV.u0)/2+.004,.004,.004],.002,TRAY,1);
      for(const u of [LV.u0-.004,LV.u1+.004])hdRBox(mb,Pt(u,ty(u)-.003,0),[.004,.004,LV.z+.008],.002,TRAY,1);
      /* behind them, the radiator's dark duct */
      hdRBox(mb,Pt((LV.u0+LV.u1)/2,ty(.6)+.06,0),[(LV.u1-LV.u0)/2,.002,LV.z],.002,HC.GB,1);},30);
    /* strakes under the front half, and the screws round the edge */
    part(mb=>{for(const z of [-.48,-.16,.16,.48]){const a=Pt(tu0+.02,ty(tu0+.02)-.002,z),b=Pt(.5,ty(.5)-.002,z);hdSweep(mb,[a,V3.lerp(a,b,.5),b],[[-.003,.001],[.003,.001],[.0015,-.014],[-.0015,-.014]],TRAY,[0,1,0],true,true);}},30);
    part(mb=>{const S=[];for(let z=-.56;z<=.561;z+=.14)S.push([tu0+.012,z],[tu1-.012,z]);for(let u=tu0+.1;u<tu1-.05;u+=.12)S.push([u,-.585],[u,.585]);
      for(const [u,z] of S){const c=Pt(u,ty(u)-.001,z);hdCyl(mb,c,V3.add(c,[0,-.0035,0]),.0075,.0065,12,STEEL);hdRBox(mb,V3.add(c,[0,-.0037,0]),[.0045,.0006,.001],.0005,HC.GB,1);}},25);
    /* the brake scoops: a duct moulded under the tray each side, opening forward, a hose from it to the upright */
    for(const s of [1,-1]){const zc=s*.42,u2=.48,u3=.62;
      part(mb=>{const rings=[];for(let k=0;k<=8;k++){const t=k/8,u=u2+(u3-u2)*t,w=.055-.03*t,h=.02*(1-t*.5),sh=hdRRect(w,h,Math.min(w,h)*.9,4);rings.push(sh.map(([a,b])=>Pt(u,ty(u)-.001-h+b,zc+a)));}
        hdLoft(mb,rings,TRAY,true);hdCap(mb,rings[8],TRAY,false);hdCap(mb,rings[2],HC.GB,true);const rim=rings[0].slice();rim.push(rim[0]);hdTube(mb,rim,.003,6,TRAY,false,false);},35);
      part(mb=>{const pts=[Pt(u3,ty(u3)-.008,zc),Pt(u3+.08,.24,s*.47),Pt(.8,.3,s*.56),Pt(.87,.36,s*.64),Pt(.9,.38,s*.675)];
        const path=[];for(let i=0;i<pts.length-1;i++)for(let k=0;k<6;k++)path.push(V3.lerp(pts[i],pts[i+1],k/6));path.push(pts[pts.length-1]);
        hdTube(mb,path,t=>.026+.003*Math.cos(t*path.length*TAU/2.2),12,SMC('#18181a',SM.HOSE),false,true);},40);}}

  /* ================= the front cradle and suspension ================= */
  /* (the lower arm's pivots on the cradle rail, its ball joint in the upright; the upper arm on the wheelhouse wall) */
  const FR={F:[.745,.215,.42],R:[1.06,.215,.42],B:[.9,.19,.705],UF:[.77,.535,.515],UR:[1.03,.535,.515],UB:[.9,.53,.69],SA:[.79,.285,.695]};
  for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*z);
    /* the cradle's rail, cast, along under the bay to the floor rail */
    cpBar(U,[Q([.64,.27,.42]),Q([.8,.255,.42]),Q([1.0,.25,.42]),Q([1.2,.25,.43]),Q([1.36,.21,.45])],.03,.028,.012,ALU,[0,1,0],38);
    part(mb=>{for(const u of [.68,1.33])for(const dz of [-.014,.014])cpHex(mb,Q([u,.234,(u>1?.45:.42)+dz]),[0,-1,0],.009,.008);},25);
    /* the lower arm: two forged legs, a brace across them carrying the coilover's clevis, the ball joint */
    const B=Q(FR.B);
    for(const P of [FR.F,FR.R])cpBar(U,[Q(P),V3.lerp(Q(P),B,.5),B],.017,.012,.006,FORGE,[0,1,0],40);
    cpBar(U,[V3.lerp(Q(FR.F),B,.7),V3.lerp(Q(FR.R),B,.7)],.012,.01,.005,FORGE,[0,1,0],40);
    for(const P of [FR.F,FR.R])cpBush(U,Q(P),[1,0,0],.03,.06);
    part(mb=>{hdCyl(mb,V3.add(B,[0,-.022,0]),V3.add(B,[0,.012,0]),.027,.025,20,FORGE);hdCyl(mb,V3.add(B,[0,-.026,0]),V3.add(B,[0,-.022,0]),.012,.012,12,BOLT);},35);
    cpRev(U,V3.add(B,[0,.012,0]),V3.add(B,[0,.05,0]),[[.024,0],[.026,.008],[.02,.025],[.012,.038]],RB,16,50);
    /* the upright: cast, from the lower ball joint to the upper, the hub's boss, the steering arm forward */
    const UB=Q(FR.UB),HB=Q([.9,.35,.715]);
    cpBar(U,[V3.add(B,[0,.04,0]),Q([.905,.27,.705]),HB,Q([.905,.45,.7]),V3.add(UB,[0,-.03,0])],.024,.016,.008,ALU,[0,0,1],40);
    cpRev(U,Q([.9,.35,.68]),Q([.9,.35,.745]),[[.0,0],[.05,0],[.058,.012],[.058,.06],[.05,.065],[0,.065]].map(([r,z])=>[r,z]),ALU,28,35);
    cpBar(U,[Q([.89,.3,.7]),Q([.84,.29,.698]),Q(FR.SA)],.012,.01,.005,ALU,[0,1,0],40);
    /* the upper arm, its bushes on brackets on the wheelhouse wall */
    for(const P of [FR.UF,FR.UR]){cpBar(U,[Q(P),V3.lerp(Q(P),UB,.5),UB],.011,.009,.005,FORGE,[0,1,0],40);cpBush(U,Q(P),[1,0,0],.022,.045);
      part(mb=>{hdRBox(mb,Q([P[0],P[1],.5]),[.035,.03,.006],.004,STEEL,2);},30);}
    part(mb=>{hdCyl(mb,V3.add(UB,[0,-.012,0]),V3.add(UB,[0,.018,0]),.02,.018,16,FORGE);},35);
    /* the coilover, from the lower arm's brace up into the tower */
    cpCoilover(U,Q([.905,.245,.6]),Q([.905,.775,.625]),{bodyL:.24,s0:.08,s1:.27,rs:.046,turns:4.5});
    /* the brake's hose: from the chassis down a loop to the caliper's banjo, and the line on the wheelhouse wall */
    part(mb=>{const p=[Q([.98,.6,.5]),Q([.99,.55,.56]),Q([.96,.5,.64]),Q([.93,.46,.69])];hdTube(mb,p,.006,8,SMC('#111',SM.HOSE),false,true);hdRBox(mb,p[0],[.012,.012,.004],.003,STEEL,1);
      hdTube(mb,[Q([1.3,.62,.5]),Q([1.1,.61,.5]),p[0]],.0025,6,LINE,false,true);},40);}
  /* the crossmembers: a tube in front, a cast beam behind; the engine's mounts */
  part(mb=>{hdCyl(mb,Pt(.66,.268,-.43),Pt(.66,.268,.43),.026,.026,16,ALU,true);for(const s of [1,-1])hdRBox(mb,Pt(.66,.268,s*.42),[.032,.034,.02],.008,ALU,2);},35);
  part(mb=>{hdRBox(mb,Pt(1.25,.18,0),[.035,.012,.4],.008,ALU,3);for(let k=-3;k<=3;k++)hdRBox(mb,Pt(1.25,.167,k*.1),[.03,.002,.004],.002,ALU,1);
    for(const s of [1,-1]){const a=Pt(1.25,.18,s*.4),b=Pt(1.24,.245,s*.43);hdRBox(mb,V3.lerp(a,b,.5),[.035,.04,.012],.008,ALU,2);for(const dz of [-.015,.015])cpHex(mb,Pt(1.25+dz,.167,s*.37),[0,-1,0],.008,.006);}},30);
  for(const s of [1,-1])part(mb=>{const a=Pt(.94,.265,s*.42),b=Pt(.94,.31,s*.24);hdRBox(mb,V3.add(a,[0,.008,0]),[.035,.008,.035],.006,ALU,2);hdCyl(mb,V3.add(a,[0,.016,0]),V3.add(a,[0,.046,0]),.028,.028,20,RB);
    hdRBox(mb,V3.lerp(V3.add(a,[0,.05,0]),b,.5),[.03,.01,.09],.006,ALU,2);hdRBox(mb,b,[.03,.035,.012],.006,ALU,2);},30);
  /* the steering rack: its housing and the pinion's valve body, the boots, the tie rods out to the steering arms */
  {const y=.27,u=.76;
    part(mb=>{hdCyl(mb,Pt(u,y,-.33),Pt(u,y,.33),.022,.022,20,ALU,true);hdRBox(mb,Pt(u+.005,y+.01,-.2),[.035,.04,.045],.012,ALU,3);hdCyl(mb,Pt(u+.005,y+.05,-.2),Pt(u+.06,y+.14,-.22),.016,.016,14,ALU);
      for(const z of [-.12,.12])hdRBox(mb,Pt(u-.025,y,z),[.02,.02,.03],.006,ALU,2);for(const z of [-.12,.12])cpHex(mb,Pt(u-.025,y-.02,z),[0,-1,0],.008,.006);},35);
    for(const s of [1,-1]){cpBoot(U,Pt(u,y,s*.33),Pt(u,y,s*.43),.024,.03,5);
      part(mb=>{const a=Pt(u,y,s*.43),b=Pt(FR.SA[0],FR.SA[1],s*FR.SA[2]);hdCyl(mb,a,V3.lerp(a,b,.85),.0095,.0095,12,STEEL);hdCyl(mb,V3.lerp(a,b,.8),b,.013,.013,12,STEEL);ball(mb,b,.016,12,STEEL);
        hdCyl(mb,V3.lerp(a,b,.72),V3.lerp(a,b,.78),.012,.012,6,BOLT);},35);}}
  /* the anti-roll bar: in two clamps on the cradle, its ends back to drop links on the dampers */
  {const y=.245,u=.71;
    part(mb=>{const pts=[];for(const s of [-1,1]){const e=[Pt(.84,y,s*.565),Pt(.78,y,s*.56),Pt(u,y,s*.5)];if(s<0)pts.push(...e);else pts.push(...e.reverse());}
      const p2=[pts[0],pts[1],pts[2],Pt(u,y,-.2),Pt(u,y,.2),pts[3],pts[4],pts[5]];hdTube(mb,p2,.0135,12,BLK,false,true);},38);
    for(const s of [1,-1]){part(mb=>{hdRBox(mb,Pt(u,y,s*.3),[.022,.022,.02],.008,RB,2);hdRBox(mb,Pt(u,y+.006,s*.3),[.026,.02,.012],.005,STEEL,2);
        for(const du of [-.032,.032])hdCyl(mb,Pt(u+du,y+.02,s*.3),Pt(u+du,y-.006,s*.3),.006,.006,6,BOLT);},30);
      part(mb=>{const a=Pt(.84,.248,s*.565),b=Pt(.885,.37,s*.585);hdCyl(mb,a,b,.006,.006,8,STEEL);ball(mb,a,.012,10,BOLT);ball(mb,b,.012,10,BOLT);},35);}}

  /* ================= the drivetrain ================= */
  /* the starter on the bell housing's right, the clutch's slave cylinder on its left, its line */
  part(mb=>{hdCyl(mb,Pt(1.44,.3,.15),Pt(1.6,.3,.15),.042,.042,20,BLK);hdCyl(mb,Pt(1.6,.3,.15),Pt(1.63,.3,.15),.03,.03,16,ALU);hdCyl(mb,Pt(1.48,.345,.15),Pt(1.58,.345,.15),.022,.022,14,BLK);
    hdCyl(mb,Pt(1.56,.31,-.17),Pt(1.66,.31,-.17),.017,.017,14,ALU);hdTube(mb,[Pt(1.56,.31,-.17),Pt(1.5,.36,-.2),Pt(1.5,.5,-.3)],.0035,6,LINE,false,true);},35);
  /* the gearbox: a ribbed case narrowing back to its tail, on a mount on a crossmember under the tunnel */
  {const sec=(u,w,h,r,yc)=>hdRRect(w,h,r,5).map(([z,y])=>Pt(u,yc+y,z));
    const ST=[[1.64,.1,.1,.045,.335],[1.66,.096,.096,.042,.335],[1.8,.088,.088,.038,.332],[2.0,.08,.08,.034,.328],[2.18,.072,.072,.03,.325],[2.2,.05,.05,.04,.322]];
    part(mb=>{const R=ST.map(a=>sec(...a));hdLoft(mb,R,ALU,true);hdCap(mb,R[R.length-1],ALU,false);},30);
    part(mb=>{for(const [u,w,h,r,yc] of [[1.75,.093,.093,.04,.333],[1.88,.086,.086,.037,.331],[2.02,.081,.081,.034,.328],[2.12,.077,.077,.032,.326]]){const a=sec(u-.005,w,h,r,yc),b=sec(u+.005,w,h,r,yc);hdLoft(mb,[a,b],ALU,true);}
      for(let k=0;k<10;k++){const a=k/10*TAU;cpHex(mb,Pt(1.665,.335+Math.sin(a)*.098,Math.cos(a)*.098),[-1,0,0],.007,.006);}
      cpHex(mb,Pt(1.9,.246,0),[0,-1,0],.011,.006);cpHex(mb,Pt(2.05,.31,-.081),[0,0,-1],.011,.006);
      hdRBox(mb,Pt(1.97,.36,.082),[.012,.01,.008],.004,SMC('#151517',SM.PLASTIC),2);},30);
    cpRev(U,Pt(2.2,.322,0),Pt(2.42,.32,0),[[.0,0],[.05,0],[.046,.06],[.042,.2],[.036,.215],[.0,.22]],ALU,28,35);
    part(mb=>{hdRBox(mb,Pt(2.3,.257,0),[.032,.005,.11],.004,ALU,2);for(const s of [1,-1])obox(mb,Pt(2.3,.285,s*.135),[1,0,0],V3.norm([0,1,-s*.9]),V3.norm([0,s*.9,1]),[.032,.04,.005],ALU);
      hdRBox(mb,Pt(2.3,.268,0),[.026,.007,.035],.005,RB,2);hdRBox(mb,Pt(2.3,.273,0),[.03,.003,.045],.002,STEEL,1);
      for(const s of [1,-1])for(const du of [-.015,.015])cpHex(mb,Pt(2.3+du,.252,s*.08),[0,-1,0],.007,.005);},30);}
  /* the driveshaft: a flex disc, the front tube, the centre bearing on its strap, the rear tube, a CV joint into the
     differential (carbon tubes on aluminium ends) */
  {const y0=.32,y1=.335,Y=u=>y0+(y1-y0)*(u-2.42)/(3.64-2.42);
    part(mb=>{const c=Pt(2.44,Y(2.44),0);const hx=[];for(let k=0;k<6;k++){const a=k/6*TAU;hx.push([Math.cos(a)*.062,Math.sin(a)*.062]);}
      const M=cpAx(Pt(2.425,Y(2.44),0),Pt(2.455,Y(2.44),0));for(const [a,b] of [[0,.03]]){const ring=z=>hx.map(([x,yy])=>M4.xform(M,[x,yy,z]));hdLoft(mb,[ring(a),ring(b)],RB,true);hdCap(mb,ring(a),RB,true);hdCap(mb,ring(b),RB,false);}
      for(let k=0;k<6;k++){const a=k/6*TAU+PI/6;cpHex(mb,M4.xform(M,[Math.cos(a)*.045,Math.sin(a)*.045,.03]),[-1,0,0],.007,.008);}},30);
    for(const [a,b] of [[2.46,3.02],[3.08,3.6]]){cpRev(U,Pt(a,Y(a),0),Pt(b,Y(b),0),[[0,0],[.045,0],[.045,.012],[.036,.03],[.036,b-a-.03],[.045,b-a-.012],[.045,b-a],[0,b-a]],CARB,24,30);
      for(const e of [a+.012,b-.03])cpRev(U,Pt(e,Y(e),0),Pt(e+.018,Y(e),0),[[.037,0],[.04,.003],[.04,.015],[.037,.018]],ALU,24,30);}
    part(mb=>{const c=Pt(3.05,Y(3.05),0);cpRev(mb,V3.add(c,[.02,0,0]),V3.add(c,[-.02,0,0]),[[.03,0],[.058,0],[.06,.006],[.06,.034],[.058,.04],[.03,.04]],RB,28,30);
      hdRBox(mb,V3.add(c,[0,-.062,0]),[.022,.006,.075],.004,STEEL,2);for(const s of [1,-1]){hdRBox(mb,V3.add(c,[0,-.03,s*.078]),[.022,.035,.005],.004,STEEL,2);hdRBox(mb,V3.add(c,[0,.012,s*.105]),[.022,.006,.03],.004,STEEL,2);cpHex(mb,V3.add(c,[0,.006,s*.115]),[0,-1,0],.007,.005);}},30);
    cpRev(U,Pt(3.6,Y(3.6),0),Pt(3.67,Y(3.67),0),[[0,0],[.048,0],[.052,.012],[.052,.05],[.046,.06],[.055,.062],[.055,.07],[0,.07]],ALU,28,35);}
  /* the differential: a cast case on the rear cradle, its nose forward to the driveshaft, a finned cover behind, the
     outputs either side */
  const DC=Pt(3.78,.345,0);
  {part(mb=>{const rings=[];for(let k=0;k<=14;k++){const t=k/14,u=3.67+.24*t,e=Math.sin(Math.max(.08,Math.min(1,t*1.05))*PI)**.5,w=.135*e,h=.12*e,r=Math.min(w,h)*.55;
        rings.push(hdRRect(Math.max(.02,w),Math.max(.02,h),Math.max(.01,r),5).map(([z,y])=>Pt(u,.345+y,z)));}hdLoft(mb,rings,ALU,true);hdCap(mb,rings[0],ALU,true);hdCap(mb,rings[14],ALU,false);},35);
    part(mb=>{for(let k=-3;k<=3;k++)hdRBox(mb,Pt(3.885,.345,k*.032),[.018,.085-Math.abs(k)*.012,.004],.003,ALU,1);
      for(let k=0;k<10;k++){const a=k/10*TAU;cpHex(mb,Pt(3.872,.345+Math.sin(a)*.1,Math.cos(a)*.115),[-1,0,0],.007,.006);}
      cpHex(mb,Pt(3.8,.226,0),[0,-1,0],.012,.007);cpHex(mb,Pt(3.83,.36,.135),[0,0,1],.012,.007);},30);
    for(const s of [1,-1])cpRev(U,Pt(3.78,.345,s*.11),Pt(3.78,.345,s*.18),[[0,0],[.065,0],[.065,.03],[.055,.035],[.055,.06],[.068,.062],[.068,.07],[0,.07]],ALU,28,35);
    /* its mounts: two ears up to the cradle's front beam, one bush behind to the rear beam */
    for(const s of [1,-1])part(mb=>{hdRBox(mb,Pt(3.675,.43,s*.07),[.035,.02,.016],.006,ALU,2);},30);
    cpBush(U,Pt(4.0,.42,0),[0,0,1],.03,.07);part(mb=>{hdRBox(mb,Pt(3.95,.43,0),[.06,.012,.02],.006,ALU,2);},30);}

  /* ================= the rear ================= */
  /* the body above it: the heel kick, the seat pan, the bulkhead over the axle, the boot floor, the side walls */
  const rz=.495;
  part(mb=>{const rows=[];const prof=[[u1,fy],[3.33,fy+.04],[3.36,.4],[3.385,.5],[3.62,.5],[3.64,.62],[4.0,.62],[4.02,.44],[4.43,.44]];
    for(const [u,y] of prof){const zz=u<3.37?Math.min(.78,secKeys(D,u).P[0][0]):u<4.19?rz:Math.min(.7,secKeys(D,u).P[0][0]-.02);const row=[];for(let k=0;k<=24;k++){const z=-zz+2*zz*k/24;row.push(Pt(u,Math.max(y,floorY(u1,z)),z));}rows.push(row);}
    hdLoft(mb,rows,COAT,false,true);},20);
  for(const s of [1,-1])part(mb=>{const A=[],B=[];for(let u=4.19;u<=4.43+1e-6;u+=.03){const P0=secKeys(D,u).P[0];A.push(Pt(u,.44,s*Math.min(.7,P0[0]-.02)));B.push(Pt(u,P0[1],s*(P0[0]-.005)));}hdLoft(mb,[A,B],COAT,false);},20);
  /* the boot floor's spare well pressed into it, and its drain */
  part(mb=>{hdRBox(mb,Pt(4.24,.44,0),[.15,.004,.32],.03,COATD,3);cpHex(mb,Pt(4.24,.435,0),[0,-1,0],.018,.004,RB);},30);
  /* the fuel tank under the seat pan: two halves astride the driveshaft, the bridge over it, two straps */
  {const TC=3.505;
    for(const s of [1,-1])part(mb=>{hdRBox(mb,Pt(TC,.39,s*.27),[.1,.105,.18],.035,TANK,4);},35);
    part(mb=>{hdRBox(mb,Pt(TC,.455,0),[.095,.04,.12],.025,TANK,3);for(let k=-2;k<=2;k++)hdRBox(mb,Pt(TC+k*.035,.287,.27),[.004,.003,.15],.002,TANK,1);for(let k=-2;k<=2;k++)hdRBox(mb,Pt(TC+k*.035,.287,-.27),[.004,.003,.15],.002,TANK,1);},30);
    for(const du of [-.055,.055])for(const s of [1,-1])part(mb=>{const pts=[Pt(TC+du,.5,s*.46),Pt(TC+du,.32,s*.455),Pt(TC+du,.283,s*.42),Pt(TC+du,.281,s*.12),Pt(TC+du,.33,s*.095),Pt(TC+du,.42,s*.09),Pt(TC+du,.43,s*.07)];
      hdSweep(mb,pts,[[-.016,-.0015],[.016,-.0015],[.016,.0015],[-.016,.0015]],STEEL,[1,0,0],true,true);cpHex(mb,Pt(TC+du,.497,s*.462),[0,-1,0],.008,.006);},30);
    /* the filler hose up to the flap, the vent line, the pump's feed out of the top */
    part(mb=>{hdTube(mb,[Pt(TC+.04,.43,.44),Pt(TC-.02,.5,.56),Pt(3.35,.62,.74),Pt(3.22,.71,.84),Pt(3.18,.712,.88)],.025,12,SMC('#151516',SM.HOSE),false,true);},35);
    /* a heat shield under it over the pipes */
    for(const s of [1,-1])part(mb=>{hdRBox(mb,Pt(TC,.278,s*.3),[.1,.002,.075],.004,SHIELD,2);for(let k=-2;k<=2;k++)hdRBox(mb,Pt(TC,.275,s*(.3+k*.028)),[.098,.0015,.003],.0015,SHIELD,1);},25);}
  /* the rear cradle: side members, a beam in front and one behind, bushed up to the body */
  for(const s of [1,-1]){cpBar(U,[Pt(3.62,.45,s*.4),Pt(3.72,.42,s*.4),Pt(3.95,.405,s*.4),Pt(4.1,.42,s*.4)],.028,.03,.01,ALU,[0,1,0],38);
    for(const u of [3.66,4.07]){cpBush(U,Pt(u,.5,s*.4),[0,1,0],.035,.05);part(mb=>{hdRBox(mb,Pt(u,.57,s*.4),[.03,.045,.03],.008,COATD,2);},30);}}
  part(mb=>{hdRBox(mb,Pt(3.645,.455,0),[.026,.026,.4],.01,ALU,3);hdRBox(mb,Pt(4.06,.405,0),[.032,.026,.4],.01,ALU,3);},35);
  /* the rear suspension: lower arms on drop brackets, the upper arms on the wheelhouse wall, a toe link behind,
     the upright with the hub, the coilover behind the axle; the anti-roll bar behind on the rear beam */
  const RR={F:[3.64,.215,.4],R:[3.98,.215,.4],B:[3.78,.19,.705],UF:[3.64,.545,.505],UR:[3.92,.545,.505],UB:[3.78,.535,.69],TI:[4.02,.285,.4],TO:[3.93,.285,.69]};
  for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*z),B=Q(RR.B),UB=Q(RR.UB);
    for(const P of [RR.F,RR.R]){cpBar(U,[Q(P),V3.lerp(Q(P),B,.5),B],.016,.012,.006,FORGE,[0,1,0],40);cpBush(U,Q(P),[1,0,0],.028,.055);
      part(mb=>{for(const dz of [-.035,.035])hdRBox(mb,Q([P[0]+dz,.31,P[2]]),[.004,.1,.03],.004,ALU,2);},30);}
    cpBar(U,[V3.lerp(Q(RR.F),B,.68),V3.lerp(Q(RR.R),B,.68)],.012,.01,.005,FORGE,[0,1,0],40);
    part(mb=>{hdCyl(mb,V3.add(B,[0,-.02,0]),V3.add(B,[0,.012,0]),.026,.024,20,FORGE);},35);
    cpBar(U,[V3.add(B,[0,.035,0]),Q([3.785,.27,.705]),Q([3.78,.35,.712]),Q([3.785,.45,.7]),V3.add(UB,[0,-.03,0])],.024,.016,.008,ALU,[0,0,1],40);
    cpBar(U,[Q([3.8,.3,.7]),Q([3.88,.29,.7]),Q(RR.TO)],.014,.012,.006,ALU,[0,1,0],40);
    cpRev(U,Q([3.78,.35,.67]),Q([3.78,.35,.745]),[[0,0],[.05,0],[.058,.012],[.058,.07],[.05,.075],[0,.075]],ALU,28,35);
    for(const P of [RR.UF,RR.UR]){cpBar(U,[Q(P),V3.lerp(Q(P),UB,.5),UB],.011,.009,.005,FORGE,[0,1,0],40);cpBush(U,Q(P),[1,0,0],.022,.045);part(mb=>{hdRBox(mb,Q([P[0],P[1],.497]),[.035,.03,.006],.004,STEEL,2);},30);}
    part(mb=>{hdCyl(mb,V3.add(UB,[0,-.012,0]),V3.add(UB,[0,.018,0]),.02,.018,16,FORGE);},35);
    /* the toe link: a rod with a rose joint each end and its lock nut */
    part(mb=>{const a=Q(RR.TI),b=Q(RR.TO);hdCyl(mb,V3.lerp(a,b,.08),V3.lerp(a,b,.92),.009,.009,12,STEEL);ball(mb,a,.016,12,BOLT);ball(mb,b,.016,12,BOLT);hdCyl(mb,V3.lerp(a,b,.2),V3.lerp(a,b,.26),.012,.012,6,BOLT);
      for(const dz of [-.03,.03])hdRBox(mb,V3.add(a,[0,.055,dz]),[.025,.065,.004],.004,ALU,2);},35);
    cpCoilover(U,Q([3.885,.245,.6]),Q([3.9,.735,.62]),{bodyL:.24,s0:.08,s1:.27,rs:.044,turns:4.5});
    /* the half-shaft: the inner joint, its boot, the bar, the outer boot into the upright */
    {const a=Q([3.78,.345,.18]),b=Q([3.78,.35,.68]);cpRev(U,a,V3.lerp(a,b,.12),[[0,0],[.05,0],[.052,.01],[.052,.05],[.04,.06],[0,.06]],ALU,24,35);
      cpBoot(U,V3.lerp(a,b,.12),V3.lerp(a,b,.3),.042,.017,5);cpRev(U,V3.lerp(a,b,.3),V3.lerp(a,b,.78),[[.0165,0],[.0165,V3.len(V3.sub(b,a))*.48]],STEEL,14,40);
      cpBoot(U,V3.lerp(a,b,.78),V3.lerp(a,b,.94),.017,.045,5);cpRev(U,V3.lerp(a,b,.94),b,[[0,0],[.048,0],[.05,.02],[0,.03]],ALU,24,35);}
    /* the brake's hose and the handbrake's cable at the caliper */
    part(mb=>{const p=[Q([3.66,.5,.48]),Q([3.67,.47,.56]),Q([3.7,.44,.66]),Q([3.72,.43,.69])];hdTube(mb,p,.006,8,SMC('#111',SM.HOSE),false,true);hdRBox(mb,p[0],[.012,.012,.004],.003,STEEL,1);},40);}
  /* the anti-roll bar behind the axle: clamps on drop brackets from the rear beam, its ends forward to links on the
     lower arms */
  {const y=.33,u=3.99;
    part(mb=>{const p=[Pt(3.915,.224,-.5),Pt(3.915,.31,-.5),Pt(3.95,y,-.47),Pt(u,y,-.38),Pt(u,y,.38),Pt(3.95,y,.47),Pt(3.915,.31,.5),Pt(3.915,.235,.5)];
      hdTube(mb,p.slice(1,7),.012,12,BLK,false,true);for(const s of [1,-1]){hdCyl(mb,Pt(3.915,.224,s*.5),Pt(3.915,.31,s*.5),.0055,.0055,8,STEEL);ball(mb,Pt(3.915,.224,s*.5),.011,10,BOLT);ball(mb,Pt(3.915,.312,s*.5),.011,10,BOLT);}},38);
    for(const s of [1,-1])part(mb=>{hdRBox(mb,Pt(u,y,s*.27),[.02,.02,.018],.008,RB,2);hdRBox(mb,Pt(u,y+.004,s*.27),[.024,.018,.011],.005,STEEL,2);hdRBox(mb,Pt(4.04,.36,s*.27),[.04,.006,.016],.004,STEEL,2);hdRBox(mb,Pt(4.06,.39,s*.27),[.006,.03,.016],.004,STEEL,2);},30);}

  /* ================= the exhaust ================= */
  {const r=.027,TUBE=(pts,rr=r,m=EXH)=>part(mb=>{const path=[];for(let i=0;i<pts.length-1;i++)for(let k=0;k<5;k++)path.push(V3.lerp(pts[i],pts[i+1],k/5));path.push(pts[pts.length-1]);
      /* (a smoothed path: each corner rounded by averaging) */
      const sm=path.map((p,i)=>i===0||i===path.length-1?p:V3.mul(V3.add(V3.add(path[i-1],path[i+1]),V3.mul(p,2)),.25));hdTube(mb,sm,rr,14,m,false,true);},40);
    for(const s of [1,-1]){const Q=([u,y,z])=>Pt(u,y,s*z);
      /* the flanges at the headers' collectors, the catalyst under its shield, the oxygen sensors */
      part(mb=>{for(const u of [1.55,1.565]){const c=Q([u,.205,.25]);obox(mb,c,[1,0,0],[0,1,0],[0,0,1],[.004,.035,.05],EXHB);}for(const dz of [-.038,.038])cpHex(mb,Q([1.57,.205,.25+dz]),[-1,0,0],.008,.008);},30);
      part(mb=>{const rings=[];for(const [u,w,h] of [[1.57,.03,.03],[1.61,.035,.032],[1.64,.06,.045],[1.86,.06,.045],[1.89,.035,.032],[1.92,.03,.03]])rings.push(hdRRect(w,h,Math.min(w,h)*.95,6).map(([z,y])=>Q([u,.2+y,.245+z])));
        hdLoft(mb,rings,EXH,true);},35);
      part(mb=>{const rows=[];for(let u=1.63;u<=1.871;u+=.02){const row=[];for(let k=0;k<=12;k++){const a=PI*(.05+.9*k/12);row.push(Q([u,.2+Math.sin(a)*.053+.002*Math.sin(u*300),.245+Math.cos(a)*.068]));}rows.push(row);}hdLoft(mb,rows,SHIELD,false);
        for(let u=1.65;u<1.86;u+=.04){const row=[];for(let k=0;k<=12;k++){const a=PI*(.05+.9*k/12);row.push(Q([u,.2+Math.sin(a)*.056,.245+Math.cos(a)*.071]));}hdTube(mb,row,.002,5,SHIELD,false,true);}},30);
      for(const u of [1.59,1.905])part(mb=>{const c=Q([u,.232,.245]);cpHex(mb,c,[0,1,0],.011,.008);hdCyl(mb,V3.add(c,[0,.011,0]),V3.add(c,[0,.04,0]),.008,.007,12,STEEL);hdTube(mb,[V3.add(c,[0,.04,0]),V3.add(c,[-.03,.06,s*-.02]),V3.add(c,[-.1,.07,s*-.06])],.003,6,CABLE,false,true);},35);
      /* down the tunnel to the X, the resonator, out round the tank and on under the rear cradle to the silencer */
      TUBE([Q([1.92,.2,.245]),Q([2.02,.215,.2]),Q([2.15,.225,.145]),Q([2.6,.225,.145])]);
      TUBE([Q([2.9,.227,.145]),Q([2.94,.23,.15])]);
      cpRev(U,Q([2.94,.232,.15]),Q([3.24,.232,.15]),[[.0,0],[.03,0],[.05,.03],[.052,.06],[.052,.24],[.05,.27],[.03,.3],[0,.3]],EXH,28,35);
      TUBE([Q([3.24,.232,.15]),Q([3.32,.236,.2]),Q([3.4,.24,.3]),Q([3.7,.245,.3]),Q([3.98,.255,.3]),Q([4.04,.29,.3])]);
      /* the hangers: a rod off the pipe into a rubber isolator on a bracket */
      for(const u of [2.5,3.6])part(mb=>{const c=Q([u,.225+(u>3?.02:0),u>3?.3:.145]),t=V3.add(c,[0,.045,s*.02]);hdCyl(mb,c,t,.005,.005,8,STEEL);hdCyl(mb,V3.add(t,[-.015,0,0]),V3.add(t,[.015,0,0]),.018,.018,14,RB);hdRBox(mb,V3.add(t,[0,.022,0]),[.02,.004,.02],.003,STEEL,1);},30);}
    /* the X: the two pipes crossing, merged in a cast-looking centre */
    for(const s of [1,-1])TUBE([Pt(2.6,.225,s*.145),Pt(2.75,.225,0),Pt(2.9,.227,-s*.145)]);
    part(mb=>{ball(mb,Pt(2.75,.225,0),.04,18,EXH);},40);
    /* the silencer: a wide box across the car behind the axle, its seams, rubber hangers up to the boot floor */
    const MC=Pt(4.15,.33,0);
    part(mb=>{hdRBox(mb,MC,[.11,.072,.44],.05,EXH,6);},40);
    part(mb=>{for(const z of [-.3,0,.3])hdRBox(mb,V3.add(MC,[0,0,z]),[.112,.074,.004],.03,EXHB,4);for(const z of [-.44,.44])hdRBox(mb,V3.add(MC,[0,0,z]),[.106,.068,.006],.046,EXHB,5);
      hdRBox(mb,V3.add(MC,[0,-.0735,0]),[.08,.002,.38],.002,SHIELD,1);},35);
    for(const z of [-.36,.36,0])part(mb=>{const c=V3.add(MC,[z?0:.07,.072,z]),t=V3.add(c,[0,.03,0]);hdCyl(mb,c,t,.005,.005,8,STEEL);hdCyl(mb,V3.add(t,[-.015,0,0]),V3.add(t,[.015,0,0]),.018,.018,14,RB);hdCyl(mb,V3.add(t,[0,.012,0]),Pt(4.15+(z?0:.07),.44,z),.005,.005,8,STEEL);},30);
    /* the tailpipes out of its back to the tips */
    D.tips=[];
    for(const s of [1,-1])for(const [z0,z1] of [[.3,.52],[.4,.64]]){const a=Pt(4.25,.31,s*z0),b=Pt(4.33,.305,s*z1),c=Pt(4.38,.305,s*z1);TUBE([a,V3.lerp(a,b,.5),b,c],.025);D.tips.push({p:Pt(4.475,.305,s*z1),d:[-1,0,0],r:.042});}}

  /* ================= the lines ================= */
  /* two brake lines and the fuel feed and return, clipped along the floor beside the tunnel (the right side), the
     handbrake's cable down the middle to its equaliser and the two cables out to the rear calipers */
  {const run=(z,rr,m)=>part(mb=>{const p=[Pt(1.5,.5,z),Pt(1.56,.36,z)];for(let u=1.62;u<=3.3+1e-6;u+=.06)p.push(Pt(u,floorY(u,z)-.008,z));
      p.push(Pt(3.36,.3,z-.01),Pt(3.39,.36,z-.04));hdTube(mb,p,rr,6,m,false,true);},40);
    run(-.19,.0028,LINE);run(-.2,.0028,LINE);run(-.212,.0045,FUEL);run(-.227,.0045,FUEL);
    part(mb=>{for(let u=1.75;u<3.3;u+=.25){const y=floorY(u,-.21)-.008;hdRBox(mb,Pt(u,y,-.21),[.007,.009,.026],.003,CLIP,2);}},30);
    /* the fuel lines into the tank's front, the brake lines on round it to the rear cradle and the hoses */
    part(mb=>{for(const z of [-.212,-.227])hdTube(mb,[Pt(3.39,.36,z-.04),Pt(3.4,.43,z-.06),Pt(3.43,.47,-.3)],.0045,6,FUEL,false,true);},40);
    for(const s of [1,-1])part(mb=>{const z0=s>0?-.23:-.24;hdTube(mb,[Pt(3.39,.36,z0),Pt(3.39,.5,s*.3),Pt(3.5,.51,s*.44),Pt(3.62,.52,s*.47),Pt(3.66,.5,s*.48)],.0028,6,LINE,false,true);},40);}

  /* ================= the rear diffuser and the valance ================= */
  {const du0=4.04,dy=u=>.195+.055*Math.pow(clamp((u-du0)/(L-du0),0,1),1.4),dz=.72;
    part(mb=>{const rows=[];for(let u=du0;u<=L+1e-6;u+=.015){const row=[];for(let z=-dz;z<=dz+1e-6;z+=.03)row.push(Pt(u,dy(u),z));rows.push(row);}hdLoft(mb,rows,TRAY,false,true);},40);
    /* its leading edge rolled, the strakes standing down from it, the side fences */
    part(mb=>{const p=[];for(let z=-dz;z<=dz+1e-6;z+=.03)p.push(Pt(du0,dy(du0)-.003,z));hdTube(mb,p,.006,10,TRAY,false,true);},40);
    for(const z of [0,.18,-.18,.4,-.4,.6,-.6])part(mb=>{const P=[];for(let u=4.12;u<=L+1e-6;u+=.03)P.push([u,dy(u)]);const out=[...P.map(([u,y])=>[u,y+.002]),...P.slice().reverse().map(([u,y])=>[u,y-.05*(u-4.12)/(L-4.12)-.001])];
      const pl=out.map(([u,y])=>[X(u),y]);hdExtrude(mb,pl,z-.003,z+.003,TRAY,.0015,2,true);},35);
    for(const s of [1,-1])part(mb=>{const pl=[[X(4.2),dy(4.2)],[X(L),dy(L)+.01],[X(L),.2],[X(4.3),.19]];hdExtrude(mb,pl,s*dz-.004,s*dz+.004,TRAY,.002,2,true);},35);
    /* the valance across the tail's foot in gloss black, open round each pair of tips; a red fog lamp and the
       reversing lamp in it, a reflector at each end, the tow eye's cover */
    const x=X(L),yv0=.25,yv1=.37,holes=[[-.69,-.47],[.47,.69]],hy0=.258,hy1=.352;
    part(mb=>{const pane=(z0,z1,y0,y1)=>hdRBox(mb,[x-.006,(y0+y1)/2,(z0+z1)/2],[.012,(y1-y0)/2,(z1-z0)/2],.004,HC.GB,2);
      pane(-.78,-.69,yv0,yv1);pane(-.47,.47,yv0,yv1);pane(.69,.78,yv0,yv1);for(const [a,b] of holes){pane(a,b,yv0,hy0);pane(a,b,hy1,yv1);}},35);
    for(const [a,b] of holes){const c=(a+b)/2,w=(b-a)/2;
      part(mb=>{const R0=hdRRect(w,(hy1-hy0)/2,.035,6).map(([z,y])=>[x-.006,(hy0+hy1)/2+y,c+z]);const R1=R0.map(p=>[p[0]+.07,p[1]+(p[1]-(hy0+hy1)/2)*-.05,c+(p[2]-c)*.96]);
        hdLoft(mb,[R0,R1],HC.GB,true,true);hdCap(mb,R1,HC.GB,true);
        const T=hdRRect(w+.004,(hy1-hy0)/2+.004,.039,6).map(([z,y])=>[x-.019,(hy0+hy1)/2+y,c+z]);T.push(T[0]);hdTube(mb,T,.0035,8,MM.CHROME,false,false);},35);}
    /* the four tips: rolled outer shells, a perforated inner core, set in the openings */
    for(const t of D.tips){const c=t.p,a=V3.add(c,[.11,0,0]);
      cpRev(U,a,c,[[.036,0],[.04,.004],[.041,.09],[.042,.104],[.043,.108],[.041,.112],[.037,.11],[.0355,.1]],SMC('#d5d6d8',SM.BRUSH),36,35);
      cpRev(U,V3.add(c,[.012,0,0]),V3.add(c,[-.002,0,0]),[[.0,0],[.031,0],[.031,.014]],SMC('#151515',SM.CAST),24,40);
      part(mb=>{for(let k=0;k<16;k++){const q=k/16*TAU;ball(mb,V3.add(c,[.004,Math.sin(q)*.025,Math.cos(q)*.025]),.0028,6,HC.GB);}},40);}
    part(mb=>{for(const [z,m] of [[-.24,HC.REDL],[.24,HC.LENSR]]){hdRBox(mb,[x-.019,.31,z],[.003,.016,.05],.006,m,2);}
      for(const s of [1,-1])hdRBox(mb,[x-.0195,.32,s*.745],[.003,.012,.025],.003,HC.REFR,2);},40);
    part(mb=>{for(let z=-.27;z<=-.209;z+=.012)ball(mb,[x-.016,.31,z],.003,8,HC.BULB);for(let z=.21;z<=.271;z+=.012)ball(mb,[x-.016,.31,z],.003,8,HC.BULB);},50);
    part(mb=>{hdCyl(mb,[x-.016,.312,0],[x-.02,.312,0],.021,.02,24,HC.GB);hdRBox(mb,[x-.0205,.312,0],[.0005,.0025,.012],.0005,SMC('#3a3a3c',SM.PLASTIC),1);},40);}

  return U;
}
