/* =====================================================================================
   THE TRAFFIC: the stock Coupe as traffic, the way Salt Mini Plus's traffic test settled it (models/coupe-traffic):
   the game's own Coupe cut down to 4,976 triangles with the Studio 2 surface baked on, its pictures at 512 x 768
   (6 MB, shared by every copy), the wheels not turning, the glass solid, the head and tail lamps lit.
   - The road is one loop: out along the right-hand lane (+x, 2.5 m right of the yellow line), round at the far end,
     back along the other lane, round at the start. One car every 600 m of it to begin with (the Drive tab's Traffic:
     every 600, 300 or 150 m, or none).
   - Each car's speed is the intelligent driver model's, as Road Not Found's traffic has it (60_traffic): it wants
     about 60 mph (a little over or under, by the driver), slows for the turns at the ends, keeps a time gap to the
     car ahead in its lane, and to you when you're in its lane ahead of it, and brakes no harder than a car can.
   - It is solid: near you each car is a box the physics' body can't go through (the ground world's colliders, as a
     wall). A car you hit, or that hits you, stops; once you're clear of it, it moves on.
   - All of it is drawn together: each part of the car (the body, each lamp, the glass, the underside, the wheel) one
     instanced mesh for every car, so the traffic is about a dozen draws however many cars there are. Each car in a
     paint of its own (the game's traffic paints), a soft shadow under it, and only the cars within 2.5 km drawn.
   ===================================================================================== */
export function makeTraffic(THREE,scene,o){
  const {K,road,key='coupe_t5000_s2',id='coupe',pic=.25}=o;
  const LANE=2.5,TURN_V=4,A=1.4,B=2.2,S0=5,TG=1.5,DRAW=2500,MAX=160,PAINTS=['#e9e9e6','#1c1d20','#a2a6aa','#5d6268','#1f3658','#7b1c21','#b42020','#cbb68c','#2e4a3a','#d8d4c6','#3c6fa9','#c46a1c','#f2f2ef','#2b2d31','#8a8f94','#16213a'];
  const XA=road.x0+40,XB=road.x1-60,L1=XB-XA,LS=2*L1+2*Math.PI*LANE;
  let seed=1906;const rnd=()=>(seed^=seed<<13,seed^=seed>>>17,seed^=seed<<5,(seed>>>0)/4294967296);
  /* the car's measures: the game's own build */
  K.setHD(false);if(K.setAlt)K.setAlt('');const G=K.studioBuild(id,1);K.setHD(true);const D=G.D,b=G.b,LEN=D.L,HL=D.L/2+.05,HW=b.look.track/2+.25;
  /* ---------- where a car is on the loop, and which way it faces ---------- */
  const at=(s,out)=>{s=((s%LS)+LS)%LS;
    if(s<L1){out.x=XA+s;out.z=LANE;out.a=0;out.seg=0;out.toTurn=L1-s;}
    else if(s<L1+Math.PI*LANE){const t=(s-L1)/LANE;out.x=XB+LANE*Math.sin(t);out.z=LANE*Math.cos(t);out.a=Math.atan2(LANE*Math.sin(t),LANE*Math.cos(t));out.seg=1;out.toTurn=0;}
    else if(s<2*L1+Math.PI*LANE){const u=s-L1-Math.PI*LANE;out.x=XB-u;out.z=-LANE;out.a=Math.PI;out.seg=2;out.toTurn=L1-u;}
    else{const t=(s-2*L1-Math.PI*LANE)/LANE;out.x=XA-LANE*Math.sin(t);out.z=-LANE*Math.cos(t);out.a=Math.atan2(-LANE*Math.sin(t),-LANE*Math.cos(t));out.seg=3;out.toTurn=0;}
    return out;};
  /* ---------- the cars ---------- */
  const C={n:0,s:new Float64Array(MAX),v:new Float32Array(MAX),v0:new Float32Array(MAX),hit:new Float32Array(MAX),paint:new Uint8Array(MAX),
    x:new Float32Array(MAX),z:new Float32Array(MAX),a:new Float32Array(MAX),seg:new Uint8Array(MAX),order:new Int32Array(MAX)};
  const P={};
  function fill(spacing,player){seed=1906;C.n=spacing?Math.min(MAX,Math.floor(LS/spacing)):0;
    /* (none closer than 80 m to where you are in your lane, so a car never lands on you) */
    const ps=player?player.x-XA:0;
    for(let i=0;i<C.n;i++){let s=(i+.5*rnd())*LS/C.n;if(Math.abs(s-ps)<80)s+=160;C.s[i]=s;C.v0[i]=26.8*(.9+.2*rnd());C.v[i]=C.v0[i]*.9;C.hit[i]=0;C.paint[i]=(rnd()*PAINTS.length)|0;}
    for(let i=0;i<C.n;i++){at(C.s[i],P);C.x[i]=P.x;C.z[i]=P.z;C.a[i]=P.a;C.seg[i]=P.seg;}
    for(let i=0;i<C.n;i++)T.paints[i].set(PAINTS[C.paint[i]]);paintDirty=true;}
  /* ---------- the boxes the physics can't drive through: the cars near you ---------- */
  const BOX=[];for(let i=0;i<24;i++)BOX.push({x0:0,x1:0,z0:0,z1:0,top:1.25,i:-1});let nBox=0;const NEAR=[];
  function boxes(px,pz){nBox=0;for(let i=0;i<C.n&&nBox<BOX.length;i++){const dx=C.x[i]-px,dz=C.z[i]-pz;if(dx*dx+dz*dz>40*40)continue;
      const c=Math.abs(Math.cos(C.a[i])),s=Math.abs(Math.sin(C.a[i])),ex=HL*c+HW*s,ez=HL*s+HW*c,bx=BOX[nBox++];
      bx.x0=C.x[i]-ex;bx.x1=C.x[i]+ex;bx.z0=C.z[i]-ez;bx.z1=C.z[i]+ez;bx.i=i;}}
  const near=(x,z)=>{NEAR.length=0;for(let k=0;k<nBox;k++){const bx=BOX[k];if(x>bx.x0-6&&x<bx.x1+6&&z>bx.z0-6&&z<bx.z1+6)NEAR.push(bx);}return NEAR;};
  /* ---------- a step: each car's speed from the one ahead (and you), then along the loop ---------- */
  function step(dt,pl){if(!C.n)return;
    for(let i=0;i<C.n;i++)C.order[i]=i;const ord=Array.from(C.order.subarray(0,C.n)).sort((p,q)=>C.s[p]-C.s[q]);
    for(let k=0;k<C.n;k++){const i=ord[k],j=ord[(k+1)%C.n];let gap=(C.s[j]-C.s[i]+LS)%LS-LEN,vl=C.v[j];if(C.n===1)gap=1e9;
      /* you, in its lane ahead of it */
      if(pl&&(C.seg[i]===0||C.seg[i]===2)){const dir=C.seg[i]===0?1:-1,dx=(pl.x-C.x[i])*dir,lane=C.seg[i]===0?LANE:-LANE;
        if(dx>0&&dx<300&&Math.abs(pl.z-lane)<2.4){const g=dx-LEN;if(g<gap){gap=g;vl=pl.vx*dir;}}}
      /* the turn at the end: slow enough to make it */
      at(C.s[i],P);const vmax=P.seg===1||P.seg===3?TURN_V:Math.sqrt(TURN_V*TURN_V+2*B*.8*P.toTurn);
      const v0=Math.min(C.v0[i],vmax),v=C.v[i];let acc;
      if(C.hit[i]>0){C.hit[i]-=dt;acc=-9;if(C.hit[i]<=0&&pl&&Math.hypot(pl.x-C.x[i],pl.z-C.z[i])<8)C.hit[i]=.5;}
      else{const ss=S0+Math.max(0,v*TG+v*(v-vl)/(2*Math.sqrt(A*B)));acc=A*(1-Math.pow(v/Math.max(v0,.1),4)-Math.pow(ss/Math.max(gap,.5),2));if(acc<-9)acc=-9;}
      C.v[i]=Math.max(0,v+acc*dt);}
    for(let i=0;i<C.n;i++){C.s[i]=(C.s[i]+C.v[i]*dt)%LS;at(C.s[i],P);C.x[i]=P.x;C.z[i]=P.z;C.a[i]=P.a;C.seg[i]=P.seg;}
    if(pl){boxes(pl.x,pl.z);
      /* touching you: it stops (and stays stopped until you're clear of it) */
      for(let k=0;k<nBox;k++){const bx=BOX[k];if(pl.x>bx.x0-.25&&pl.x<bx.x1+.25&&pl.z>bx.z0-1.2&&pl.z<bx.z1+1.2&&Math.hypot(pl.x-C.x[bx.i],pl.z-C.z[bx.i])<LEN*.62)C.hit[bx.i]=Math.max(C.hit[bx.i],4);}}}
  /* ---------- the drawing: one instanced mesh a part ---------- */
  const T={meshes:[],wheels:[],shadow:null,ready:false,tris:0,draws:0,drawn:0,paints:Array.from({length:MAX},()=>new THREE.Color())};let paintDirty=true;
  const b64=s=>{const bs=atob(s),u=new Uint8Array(bs.length);for(let i=0;i<bs.length;i++)u[i]=bs.charCodeAt(i);return u.buffer;};
  function unpack(p){if(!p||!p.v)return [];const n=p.v,bx=p.box,qp=new Uint16Array(b64(p.P)),qn=new Int8Array(b64(p.N)),qu=new Uint16Array(b64(p.U)),qm=new Uint8Array(b64(p.M));
    const I=p.i32?new Uint32Array(b64(p.I)):new Uint16Array(b64(p.I)),Ps=new Float32Array(n*3),Ns=new Float32Array(n*3),U=new Float32Array(n*2);
    for(let i=0;i<n;i++){for(let k=0;k<3;k++){Ps[i*3+k]=bx[k]+qp[i*3+k]/65535*bx[3+k];Ns[i*3+k]=qn[i*3+k]/127;}U[i*2]=qu[i*2]/65535;U[i*2+1]=qu[i*2+1]/65535;}
    const by=new Map();for(let t=0;t<I.length/3;t++){const m=qm[I[t*3]];let a=by.get(m);if(!a)by.set(m,a=[]);a.push(I[t*3],I[t*3+1],I[t*3+2]);}
    const out=[];for(const [m,ix] of by){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(Ps,3));g.setAttribute('normal',new THREE.BufferAttribute(Ns,3));
      g.setAttribute('uv',new THREE.BufferAttribute(U,2));g.setIndex(new THREE.BufferAttribute(n>65535?new Uint32Array(ix):new Uint16Array(ix),1));out.push([m,g]);}
    return out;}
  const GLOW={value:1.8};
  /* the baked material: each car's own paint where the colour picture's mask says paint (its instance colour), the
     lamps glowing where the normals' alpha says lamp: white at the nose, red at the back */
  function bakedMat(tx,lamp){const m=new THREE.MeshPhysicalMaterial({map:tx.c,normalMap:tx.n,normalMapType:THREE.ObjectSpaceNormalMap,aoMap:tx.o,aoMapIntensity:.8,
      roughnessMap:tx.o,metalnessMap:tx.o,roughness:1,metalness:1,clearcoat:1,clearcoatMap:tx.o,clearcoatRoughness:.03,side:THREE.DoubleSide});
    if(lamp){m.emissive.set(lamp==='head'?'#fff3df':'#ff1a0a');m.emissiveIntensity=lamp==='head'?1.4:.9;}
    m.onBeforeCompile=sh=>{sh.uniforms.uGlow=GLOW;
      sh.vertexShader='varying float vCarX;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n vCarX=position.x;');
      sh.fragmentShader='uniform float uGlow;\nvarying float vCarX;\n'+sh.fragmentShader.replace('#include <color_fragment>','').replace('#include <map_fragment>',
        `vec4 sdc=texture2D(map,vMapUv);
        #ifdef USE_COLOR
          diffuseColor.rgb*=mix(sdc.rgb,vColor.rgb,sdc.a);
        #else
          diffuseColor.rgb*=sdc.rgb;
        #endif`).replace(/texture2D\( clearcoatMap, vClearcoatMapUv \)\.x/g,'texture2D( clearcoatMap, vClearcoatMapUv ).w')
        .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n totalEmissiveRadiance+=texture2D(normalMap,vNormalMapUv).a*(vCarX>0.0?vec3(1.0,.95,.87):vec3(1.0,.06,.03)*.9)*uGlow;');};
    m.customProgramCacheKey=()=>'trf'+(lamp||'');return m;}
  const glassM=new THREE.MeshPhysicalMaterial({color:0x0b0f14,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.02,envMapIntensity:1.3});
  const underM=new THREE.MeshStandardMaterial({color:0x111112,roughness:.7,metalness:.3,side:THREE.DoubleSide});
  const LAMP={33:'tail',34:'head'};
  async function textures(A){const w=Math.round(A.w*pic),h=Math.round(A.h*pic);
    const one=async(src,srgb)=>{const bm=await createImageBitmap(new Blob([b64(src.slice(src.indexOf(',')+1))],{type:'image/webp'}),
        {premultiplyAlpha:'none',colorSpaceConversion:'none',resizeWidth:w,resizeHeight:h,resizeQuality:'high'});
      const t=new THREE.Texture(bm);t.flipY=false;t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=8;t.premultiplyAlpha=false;t.needsUpdate=true;return t;};
    const [c,n,oo]=await Promise.all([one(A.col,true),one(A.nrm,false),one(A.orm,false)]);return {c,n,o:oo,mb:w*h*4*3*4/3/1048576,w,h};}
  /* the wheels' places on a car: the right ones as built (face out at +z), the left mirrored */
  const WL=[];{const fx=D.X(D.uFa),wb=D.uRa-D.uFa;for(const front of [1,0])for(const s of [1,-1]){const x=front?fx:fx-wb*Math.cos(D.pitch),tw=(front?b.look.track:b.look.trackR||b.look.track)/2;
    WL.push(new THREE.Matrix4().makeTranslation(x,front?b.look.tyre.R:D.Rr,s*tw).multiply(new THREE.Matrix4().makeScale(1,1,s)));}}
  async function init(){const B=window.BAKED_CARS&&window.BAKED_CARS[key];if(!B)throw new Error('no traffic car data: '+key);
    const tx=await textures(B.atlas);T.mb=tx.mb;T.pic=[tx.w,tx.h];
    for(const [part,list] of [['body',T.meshes],['wheel',T.wheels]])for(const [m,geo] of unpack(B.parts[part])){
      const mat=m===2||m===3?glassM:m===16?underM:bakedMat(tx,LAMP[m]),N=part==='wheel'?MAX*4:MAX,im=new THREE.InstancedMesh(geo,mat,N);
      im.castShadow=m!==16;im.receiveShadow=true;im.count=0;im.frustumCulled=false;im.userData.mat=m;
      if(mat!==glassM&&mat!==underM&&part==='body')for(let i=0;i<N;i++)im.setColorAt(i,T.paints[0]);
      scene.add(im);list.push(im);T.tris+=geo.index.count/3*(part==='wheel'?4:1);T.draws++;}
    /* the soft shadow under each car */
    const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,6,64,64,64);
    gr.addColorStop(0,'rgba(0,0,0,.5)');gr.addColorStop(.6,'rgba(0,0,0,.22)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);
    const sg=new THREE.PlaneGeometry(1,1);sg.rotateX(-Math.PI/2);
    T.shadow=new THREE.InstancedMesh(sg,new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,fog:true}),MAX);T.shadow.count=0;T.shadow.frustumCulled=false;T.shadow.renderOrder=1;scene.add(T.shadow);T.draws++;
    T.ready=true;}
  const MM=new THREE.Matrix4(),MW=new THREE.Matrix4(),RY=new THREE.Matrix4(),SH=new THREE.Matrix4();
  /* each frame: the cars within reach of the camera, packed first, and their wheels and shadows with them */
  function draw(cx,cz){if(!T.ready)return;let n=0;
    for(let i=0;i<C.n;i++){const dx=C.x[i]-cx,dz=C.z[i]-cz;if(dx*dx+dz*dz>DRAW*DRAW)continue;
      MM.makeRotationY(C.a[i]).setPosition(C.x[i],0,C.z[i]);
      for(const im of T.meshes){im.setMatrixAt(n,MM);if(im.instanceColor)im.setColorAt(n,T.paints[i]);}
      for(const im of T.wheels)for(let k=0;k<4;k++){MW.multiplyMatrices(MM,WL[k]);im.setMatrixAt(n*4+k,MW);}
      SH.makeRotationY(C.a[i]).scale(new THREE.Vector3(LEN*1.1,1,b.look.track*1.45)).setPosition(C.x[i],.02,C.z[i]);T.shadow.setMatrixAt(n,SH);n++;}
    for(const im of T.meshes){im.count=n;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;}
    for(const im of T.wheels){im.count=n*4;im.instanceMatrix.needsUpdate=true;}
    T.shadow.count=n;T.shadow.instanceMatrix.needsUpdate=true;T.drawn=n;}
  return {init,fill,step,draw,near,get n(){return C.n;},get drawn(){return T.drawn;},get tris(){return T.tris;},get draws(){return T.draws;},get mb(){return T.mb;},get pic(){return T.pic;},
    C,LS,at,glow:GLOW,get ready(){return T.ready;}};
}
