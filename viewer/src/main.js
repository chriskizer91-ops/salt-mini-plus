/* =====================================================================================
   SALT MINI PLUS · THE MODELS. Any of the traffic cars three ways, on a plain studio backdrop:
   - Game: the car exactly as Road Not Found builds it (the game's builders at the game's resolution).
   - Studio: the same car with the Studio detail (models/src/hd and models/src/cars/<car>), the body four times finer.
   - Baked: the game's own mesh again, wearing the Studio car's detail as three pictures (models/<car>/*_baked_data.js).
   The Studio and Game cars are built here, from the code, when first shown; the baked ones are unpacked.
   Drag to turn, pinch or scroll to come closer, double-tap a part to swing round it. Hood, paint (the traffic's
   colours), lights.
   ===================================================================================== */
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {makeMats} from './mats.js';

const K=window.KIT,MAT=K.MAT,SM=K.SM,Q=new URLSearchParams(location.search),$=id=>document.getElementById(id);
const SHOTS=!!Q.get('shots');
/* the traffic's cars, in the order Salt Mini Plus has them; a car shows here once its Studio detail is made */
const ALL=[['stock','SUV'],['pickup','Pickup'],['hatch','Hatch'],['wagon','Wagon'],['ev','EV'],['trail','Trail'],['coupe','Coupe'],['muscle','Muscle']];
const READY=ALL.filter(([id])=>id==='stock'||K.HD_CARS[id]);
/* the traffic's paints (cargames rlcwo2rnf-traffic/src/60_traffic.js TRF_PAINT) */
const TRF_PAINT=['#e9e9e6','#1c1d20','#a2a6aa','#5d6268','#1f3658','#7b1c21','#b42020','#cbb68c','#2e4a3a','#d8d4c6','#3c6fa9','#c46a1c','#f2f2ef','#2b2d31','#8a8f94','#16213a'];

const cv=$('cv'),PHONE=matchMedia('(hover: none)').matches;
const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:SHOTS,powerPreference:'high-performance'});
renderer.setPixelRatio(SHOTS?1:Math.min(devicePixelRatio,PHONE?1.5:2));
renderer.toneMapping=THREE.NeutralToneMapping;renderer.toneMappingExposure=1;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.background=new THREE.Color('#e6e5e2');
const camera=new THREE.PerspectiveCamera(28,1,.05,200);
const controls=new OrbitControls(camera,cv);controls.enableDamping=true;controls.dampingFactor=.08;controls.target.set(0,.8,0);
controls.minDistance=.3;controls.maxDistance=34;controls.minPolarAngle=0;controls.maxPolarAngle=Math.PI;
controls.enablePan=true;controls.screenSpacePanning=true;controls.zoomToCursor=true;controls.zoomSpeed=1.1;controls.rotateSpeed=.85;

/* ---------- the studio: SUV Studio's soft boxes for the reflections, one key light, a floor that only shows the shadow ---------- */
const pmrem=new THREE.PMREMGenerator(renderer);
function studioEnvScene(){const s=new THREE.Scene(),g=new THREE.SphereGeometry(40,64,32),c=[];
  const P=g.attributes.position;for(let i=0;i<P.count;i++){const y=P.getY(i)/40,v=y>0?.12+.06*y:.12+(.22-.12)*Math.min(1,-y*4);c.push(v,v,v*.98);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));s.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
  const box=(w,h,pos,look,k,tint=[1,1,1])=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
    m.material.color.setRGB(k*tint[0],k*tint[1],k*tint[2]);m.position.set(...pos);m.lookAt(...look);s.add(m);};
  box(14,4.5,[0,12,0],[0,0,0],9);for(const z of [-11,11])box(1.6,9,[1.5,5,z],[0,1,0],6);
  box(7,5,[13,5,3],[0,1,0],3.2,[1,.97,.93]);box(7,4,[-13,5,-2],[0,1,0],2.2,[.92,.96,1]);box(30,.5,[0,.25,-16],[0,0,0],1.2);return s;}
scene.environment=pmrem.fromScene(studioEnvScene(),.02).texture;
const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.ShadowMaterial({opacity:.32}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const pool=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),gr=g.createRadialGradient(128,128,10,128,128,128);
  gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(.55,'rgba(0,0,0,.28)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,256,256);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));
  m.rotation.x=-Math.PI/2;m.position.y=.002;m.renderOrder=-1;return m;})();scene.add(pool);
const key=new THREE.DirectionalLight(0xffffff,1.8);key.position.set(3.2,7.5,2.4);key.castShadow=true;
const SMAP=PHONE?2048:4096;key.shadow.mapSize.set(SMAP,SMAP);Object.assign(key.shadow.camera,{left:-4.5,right:4.5,top:4.5,bottom:-4.5,near:1,far:22});
key.shadow.radius=6;key.shadow.blurSamples=16;key.shadow.bias=-.0004;key.shadow.normalBias=.02;scene.add(key,key.target);
const rim=new THREE.DirectionalLight(0xdfe8ff,.7);rim.position.set(-6,3,-4);scene.add(rim);
const {meshes,setLights:matLights,mergedMeshes}=makeMats(THREE,K);

/* ---------- the baked car: its meshes unpacked (positions 16-bit in a box, normals 8-bit, the atlas 16-bit, a material
   a vertex: 32 baked, 33-36 baked lamps, 2 and 3 the game's glass, 16 the dark underside), its three pictures read
   straight (not premultiplied: the colour's alpha is the paint mask, the other's the clear coat) ---------- */
const b64=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer;};
function unpackBaked(p){const n=p.v,bx=p.box,qp=new Uint16Array(b64(p.P)),qn=new Int8Array(b64(p.N)),qu=new Uint16Array(b64(p.U)),qm=new Uint8Array(b64(p.M));
  const I=p.i32?new Uint32Array(b64(p.I)):new Uint16Array(b64(p.I)),P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2);
  for(let i=0;i<n;i++){for(let k=0;k<3;k++){P[i*3+k]=bx[k]+qp[i*3+k]/65535*bx[3+k];N[i*3+k]=qn[i*3+k]/127;}U[i*2]=qu[i*2]/65535;U[i*2+1]=qu[i*2+1]/65535;}
  /* one geometry a material (a triangle's material is its first corner's) */
  const by=new Map();for(let t=0;t<I.length/3;t++){const m=qm[I[t*3]];let a=by.get(m);if(!a)by.set(m,a=[]);a.push(I[t*3],I[t*3+1],I[t*3+2]);}
  const out=[];for(const [m,ix] of by){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));
    g.setAttribute('uv',new THREE.BufferAttribute(U,2));g.setIndex(new THREE.BufferAttribute(n>65535?new Uint32Array(ix):new Uint16Array(ix),1));out.push([m,g]);}
  return out;}
const BKTEX={};
async function bakedTextures(id){if(BKTEX[id])return BKTEX[id];const A=window.BAKED_CARS[id].atlas;
  const one=async(src,srgb)=>{const bm=await createImageBitmap(new Blob([b64(src.slice(src.indexOf(',')+1))],{type:'image/webp'}),{premultiplyAlpha:'none',colorSpaceConversion:'none'});
    const t=new THREE.Texture(bm);t.flipY=false;t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=8;t.premultiplyAlpha=false;t.needsUpdate=true;return t;};
  const [c,n,o]=await Promise.all([one(A.col,true),one(A.nrm,false),one(A.orm,false)]);return BKTEX[id]={c,n,o,w:A.w,h:A.h};}
/* the baked material: the colour where the mask says no paint, the paint where it says paint; the object-space normals;
   occlusion, roughness and metal; the clear coat from the fourth channel. Lamps (33-36) get their own copy, to light */
const PAINT_U={value:new THREE.Color('#ffffff')};
function bakedMat(tx,lamp){const m=new THREE.MeshPhysicalMaterial({map:tx.c,normalMap:tx.n,normalMapType:THREE.ObjectSpaceNormalMap,aoMap:tx.o,aoMapIntensity:.8,
    roughnessMap:tx.o,metalnessMap:tx.o,roughness:1,metalness:1,clearcoat:1,clearcoatMap:tx.o,clearcoatRoughness:.03,side:THREE.DoubleSide});
  m.onBeforeCompile=sh=>{sh.uniforms.uPaint=PAINT_U;
    sh.fragmentShader='uniform vec3 uPaint;\n'+sh.fragmentShader.replace('#include <map_fragment>',
      `#ifdef USE_MAP
        vec4 sampledDiffuseColor=texture2D(map,vMapUv);diffuseColor.rgb*=mix(sampledDiffuseColor.rgb,uPaint,sampledDiffuseColor.a);
      #endif`).replace(/texture2D\( clearcoatMap, vClearcoatMapUv \)\.x/g,'texture2D( clearcoatMap, vClearcoatMapUv ).w');};
  m.customProgramCacheKey=()=>'baked'+(lamp||'');m.userData.lamp=lamp||0;return m;}
const BAKED_LAMP={33:'tail',34:'head',35:'amber',36:'rev'};
function bakedGroup(parts,tx){const g=new THREE.Group();
  for(const [m,geo] of unpackBaked(parts)){let mat;
    if(m===2||m===3)mat=new THREE.MeshPhysicalMaterial({color:m===2?0x05070a:0x0a0e12,roughness:.02,metalness:0,transparent:true,opacity:m===2?.86:.8,depthWrite:false,envMapIntensity:1.4,side:THREE.DoubleSide});
    else if(m===16)mat=new THREE.MeshStandardMaterial({color:0x111112,roughness:.7,metalness:.3,side:THREE.DoubleSide});
    else mat=bakedMat(tx,BAKED_LAMP[m]);
    const o=new THREE.Mesh(geo,mat);o.castShadow=!(m===2||m===3);o.receiveShadow=true;o.userData.mat=m;g.add(o);}
  return g;}

/* ---------- a car, built once a version and kept ---------- */
const car=new THREE.Group();scene.add(car);
const CACHE={};let cur=null,carId=Q.get('car')||(READY[1]||READY[0])[0],ver=Q.get('v')||'studio',paint=null,lights=0;
function countTris(o){let n=0,d=0;o.traverse(m=>{if(m.isMesh&&m.visible&&isShown(m)){n+=m.geometry.index?m.geometry.index.count/3:m.geometry.attributes.position.count/3;d++;}});return {n,d};}
function isShown(o){for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;}
/* the wheels where the car sits: the right ones as built (face out at +z), the left mirrored */
function placeWheels(g,D,b,wheelF,wheelR,brakeF,brakeR){const fx=D.X(D.uFa),wb=D.uRa-D.uFa;g.userData.wheels=[];
  for(const front of [1,0])for(const s of [1,-1]){const x=front?fx:fx-wb*Math.cos(D.pitch),tw=(front?b.look.track:b.look.trackR||b.look.track)/2;
    const steer=new THREE.Group();steer.position.set(x,front?b.look.tyre.R:D.Rr,s*tw);steer.scale.set(1,1,s);
    const spin=(front?wheelF:wheelR).clone();steer.add(spin);const br=front?brakeF:brakeR;if(br)steer.add(br.clone());
    steer.userData={front,s,spin};g.add(steer);g.userData.wheels.push(steer);}}
async function build(id,v){const k=id+'/'+v;if(CACHE[k])return CACHE[k];
  const t0=performance.now(),root=new THREE.Group();let T,D,b;
  if(v==='baked'){
    const B=window.BAKED_CARS&&window.BAKED_CARS[id];if(!B)return null;
    const tx=await bakedTextures(id);K.setHD(false);T=K.studioBuild(id,1);D=T.D;b=T.b;
    root.userData.body=bakedGroup(B.parts.body,tx);root.userData.hood=bakedGroup(B.parts.hood,tx);root.userData.hide=bakedGroup(B.parts.hide,tx);
    const w=bakedGroup(B.parts.wheel,tx);placeWheels(root,D,b,w,w,null,null);
    for(const sp of D.spares||[]){const c=w.clone();c.position.set(sp.p[0],sp.p[1],sp.p[2]);if(sp.face==='back')c.rotation.y=-Math.PI/2;else if(sp.p[2]<0)c.scale.z=-1;root.add(c);}
  }else{
    K.setHD(v==='studio');T=K.studioBuild(id,v==='studio'?.25:1);D=T.D;b=T.b;
    /* everything fixed to the body, merged a material: the shell, and the Studio's parts (src/hd, src/cars) */
    const fixed=[T.body];for(const [nm,src] of Object.entries(T.hd||{}))if(src&&src.p&&nm!=='hood')fixed.push(src);if(T.under)fixed.push(T.under);
    root.userData.body=mergedMeshes(fixed,'body',b);
    root.userData.hood=mergedMeshes([T.hood,T.hd&&T.hd.hood].filter(Boolean),'hood',b);root.userData.hide=mergedMeshes([T.hide],'hide',b);
    const wF=mergedMeshes([T.wheel],'wheel',b),wR=T.wheelR===T.wheel?wF:mergedMeshes([T.wheelR],'wheel',b);
    const bF=T.brake?mergedMeshes([T.brake],'brake',b):null,bR=T.brakeR?(T.brakeR===T.brake?bF:mergedMeshes([T.brakeR],'brake',b)):bF;
    placeWheels(root,D,b,wF,wR,bF,bR);
    for(const sp of D.spares||[]){const w=(sp.rear?wR:wF).clone();w.position.set(sp.p[0],sp.p[1],sp.p[2]);if(sp.face==='back')w.rotation.y=-Math.PI/2;else if(sp.p[2]<0)w.scale.z=-1;root.add(w);}
  }
  /* the engine bay, shown with the hood up (the baked car's is the game's own, as in Baked SUV Test's shed) */
  const bay=T.bay;root.userData.bay=mergedMeshes([bay.bay,bay.engine].filter(Boolean),'bay',b);root.userData.bay.visible=false;
  const ln=mergedMeshes([bay.liner].filter(Boolean),'liner',b);
  const hood=new THREE.Group();hood.add(root.userData.hood,ln);hood.matrixAutoUpdate=false;root.userData.hoodG=hood;
  root.add(root.userData.body,hood,root.userData.hide,root.userData.bay);
  root.traverse(m=>{if(m.isMesh&&m.castShadow!==false)m.castShadow=!(m.material&&m.material.transparent);});
  const out={root,T,D,b,v,ms:performance.now()-t0,buildMs:T.ms};CACHE[k]=out;return out;}

/* the hood swings up about its hinge at the cowl */
let hoodA=0,hoodT=0;
function hoodStep(){if(!cur)return;const d=hoodT-hoodA;hoodA=Math.abs(d)<1e-3?hoodT:hoodA+d*.12;const [hx,hy]=cur.D.hood.hinge,a=(hoodA*hoodA*(3-2*hoodA))*(cur.D.hoodOpen||1.0);
  cur.root.userData.hoodG.matrix.makeTranslation(hx,hy,0).multiply(new THREE.Matrix4().makeRotationZ(a)).multiply(new THREE.Matrix4().makeTranslation(-hx,-hy,0));
  cur.root.userData.bay.visible=hoodA>.001;cur.root.userData.hide.visible=hoodA<=.001;}

/* ---------- the views, from the car's own measures (SUV Studio's, scaled to the car) ---------- */
function views(){const D=cur.D,b=cur.b,L=D.L,s=L/4.92,h=D.Hr/1.79,fx=D.X(D.uFa),rx=fx-(D.uRa-D.uFa),tw=b.look.track/2,R=b.look.tyre.R,nose=D.X(0),tail=D.X(L);
  const C=K.HD_CARS[cur.b.id]&&K.HD_CARS[cur.b.id].views||{};
  const V={front34:{p:[5.6*s,1.55*h,4.6*s],t:[.15*s,.8*h,0]},rear34:{p:[-5.4*s,1.7*h,4.8*s],t:[-.1*s,.85*h,0]},side:{p:[0,1.0*h,8.2*s],t:[0,.85*h,0]},
    front:{p:[8.2*s,1.0*h,0],t:[0,.8*h,0]},rear:{p:[-8.2*s,1.1*h,0],t:[0,.85*h,0]},top:{p:[.01,9.5*s,0],t:[0,.6,0]},
    wheel:{p:[fx+1.1,R+.2,tw+1.6],t:[fx-.12,R+.02,tw]},face:{p:[nose+3.0*s,D.Hr*.52+.25,1.25*s],t:[nose,D.Hr*.48,0]},tail:{p:[tail-3.0*s,D.Hr*.6+.25,1.25*s],t:[tail,D.Hr*.56,0]},
    low:{p:[4.4*s,.25,3.4*s],t:[0,.55*h,0]},under:{p:[2.6*s,-1.9,2.4*s],t:[0,.4,0]},cabin:{p:[1.6*s,1.75*h,2.2*s],t:[-.2*s,1.05*h,0]},bay:{p:[3.9*s,2.4*h,1.6*s],t:[1.45*s,.95*h,0]}};
  for(const k in C)V[k]=typeof C[k]==='function'?C[k](D,b):C[k];return V;}
let VIEWS={};
function setView(v){const V=VIEWS[v]||VIEWS.front34,a=camera.aspect;camera.fov=a<1?42:28;camera.updateProjectionMatrix();
  const hf=Math.tan(camera.fov*Math.PI/360)*a,ref=Math.tan(14*Math.PI/180)*1.6,k=v==='side'||v==='front34'||v==='rear34'||v==='front'||v==='rear'?Math.max(1,ref/hf):Math.max(1,ref/hf)*.9+.1;
  const t=new THREE.Vector3(...V.t),p=new THREE.Vector3(...V.p).sub(t).multiplyScalar(k).add(t);camera.position.copy(p);controls.target.copy(t);controls.update();}

/* ---------- switching ---------- */
async function show(id,v,keepView){
  $('loading').hidden=false;$('loading').firstElementChild.textContent=`Building the ${ALL.find(c=>c[0]===id)[1]}${v==='studio'?' (Studio)':v==='baked'?' (baked)':''}…`;
  await new Promise(r=>setTimeout(r,30));let c;try{c=await build(id,v);}catch(e){console.error(e);$('loading').firstElementChild.textContent='Could not build it: '+e.message;return;}
  if(!c){v='studio';c=await build(id,v);}
  const same=cur&&cur.b.id===id;car.clear();cur=c;carId=id;ver=v;car.add(c.root);
  pool.scale.set(c.D.L*1.08,1,c.b.look.track*1.42);VIEWS=views();
  hoodA=hoodT=hoodT;hoodStep();applyPaint();applyLights();
  if(!keepView||!same)setView(Q.get('view')||'front34');
  for(const b of document.querySelectorAll('#vers button'))b.classList.toggle('on',b.dataset.v===ver);$('carb').textContent=ALL.find(x=>x[0]===id)[1];
  for(const b of document.querySelectorAll('#vers button'))b.disabled=b.dataset.v==='baked'&&!(window.BAKED_CARS&&window.BAKED_CARS[id]);
  hud();$('loading').hidden=true;}
function applyPaint(){if(!cur)return;const h=paint||cur.b.paint;PAINT_U.value.set(h);
  cur.root.traverse(m=>{if(m.isMesh&&m.userData.mat===MAT.PAINT&&m.material.color)m.material.color.set(h);});
  for(const s of document.querySelectorAll('#paints .sw'))s.classList.toggle('on',s.dataset.h===h);}
/* the lamps: 0 off, 1 head and tail lamps on, 2 the brake lamps too, 3 the indicators and reversing lamps */
function applyLights(){if(!cur)return;const L=lights;cur.root.traverse(m=>{if(!m.isMesh)return;const k=m.userData.lamp||lampOf(m.userData.mat);if(!k)return;
  const on=k==='head'?L>=1:k==='tail'?L>=1:k==='amber'?L>=3:k==='rev'?L>=3:false,lvl=k==='tail'?(L>=2?4:L>=1?1.2:0):on?(k==='head'?3:3):0;matLights(m.material,k,lvl);});
  $('lights').classList.toggle('on',L>0);$('lights').textContent=['Lights','Lamps on','Brakes on','All lamps'][L];}
function lampOf(id){return ({[MAT.HEAD]:'head',[MAT.LED]:'head',[MAT.HALO]:'head',[MAT.TAIL]:'tail',[MAT.AMBER]:'amber',[MAT.REV]:'rev',
  [SM.LAMPH]:'head',[SM.LENSH]:'head',[SM.REDL]:'tail',[SM.AMBERL]:'amber',[SM.LENSR]:'rev'})[id]||0;}
function hud(){if(!cur)return;const t=countTris(cur.root);
  $('stats').innerHTML=`<b>${ALL.find(c=>c[0]===carId)[1]} · ${({game:'Game',studio:'Studio',baked:'Baked'})[ver]}</b> · ${Math.round(t.n).toLocaleString('en-US')} triangles · ${t.d} draws`;}

/* ---------- the loop (held by the picture tool) ---------- */
let held=false;
function keepNear(){if(!cur)return;const t=controls.target,L=cur.D.L;t.x=Math.max(-L*.75,Math.min(L*.75,t.x));t.y=Math.max(-.4,Math.min(2.8,t.y));t.z=Math.max(-2.4,Math.min(2.4,t.z));
  const under=camera.position.y<.01;floor.visible=!under;pool.visible=!under;}
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();let fly=null;
function focusAt(cx,cy){const r=cv.getBoundingClientRect();ndc.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);
  const hit=ray.intersectObject(car,true).find(h=>isShown(h.object)&&!(h.object.material&&h.object.material.transparent));if(!hit)return false;
  const p=hit.point,d=camera.position.distanceTo(controls.target),nd=Math.max(.6,Math.min(d*.55,3)),dir=camera.position.clone().sub(controls.target).normalize();
  fly={t0:performance.now(),a:controls.target.clone(),b:p.clone(),ca:camera.position.clone(),cb:p.clone().add(dir.multiplyScalar(nd))};return true;}
function flyStep(){if(!fly)return;const k=Math.min(1,(performance.now()-fly.t0)/650),e=k*k*(3-2*k);controls.target.lerpVectors(fly.a,fly.b,e);camera.position.lerpVectors(fly.ca,fly.cb,e);if(k>=1)fly=null;}
let lastTap={t:0,x:0,y:0},downAt=null,lastHud=0;
cv.addEventListener('pointerdown',e=>{downAt={x:e.clientX,y:e.clientY};hideHint();closePops();});
cv.addEventListener('pointerup',e=>{if(!downAt||Math.hypot(e.clientX-downAt.x,e.clientY-downAt.y)>8)return;const now=performance.now();
  if(now-lastTap.t<320&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<30){focusAt(e.clientX,e.clientY);lastTap.t=0;}else lastTap={t:now,x:e.clientX,y:e.clientY};});
cv.addEventListener('wheel',hideHint,{passive:true});
function hideHint(){$('hint').classList.add('gone');}
function frame(){hoodStep();flyStep();controls.update();keepNear();renderer.render(scene,camera);const n=performance.now();if(n-lastHud>500){lastHud=n;hud();}}
function loop(){if(!held)frame();requestAnimationFrame(loop);}
function resize(){const w=cv.clientWidth,h=cv.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
addEventListener('resize',resize);

/* ---------- the buttons: the car, the version, the hood, the paint; on a wide screen the lights and the reset too (on a
   phone they are in More) ---------- */
function closePops(except){for(const id of ['cars','paints','more'])if(id!==except)$(id).hidden=true;for(const b of ['carb','paintb','moreb'])$(b).classList.remove('on');}
function pop(id,btn){const open=$(id).hidden;closePops(id);$(id).hidden=!open;$(btn).classList.toggle('on',open);}
for(const [id,name] of READY){const b=document.createElement('button');b.textContent=name;b.onclick=()=>{closePops();show(id,ver==='baked'&&!(window.BAKED_CARS&&window.BAKED_CARS[id])?'studio':ver);};$('cars').appendChild(b);}
$('carb').onclick=()=>pop('cars','carb');$('paintb').onclick=()=>pop('paints','paintb');$('moreb').onclick=()=>pop('more','moreb');
document.querySelectorAll('#vers button').forEach(b=>b.onclick=()=>{closePops();show(carId,b.dataset.v,true);});
$('hood').onclick=()=>{hoodT=hoodT<.5?1:0;$('hood').classList.toggle('on',hoodT>.5);};
const nextLights=()=>{lights=(lights+1)%4;applyLights();};$('lights').onclick=nextLights;
const resetView=()=>{fly=null;setView('front34');};$('reset').onclick=resetView;
{const sw=$('paints');const add=(h,t)=>{const b=document.createElement('button');b.className='sw';b.style.background=h;b.title=t;b.dataset.h=h;b.onclick=()=>{paint=h;applyPaint();};sw.appendChild(b);};
  add('','Factory');sw.firstChild.style.background='conic-gradient(#7a1418 0 25%,#ece9e2 0 50%,#6a625b 0 75%,#b9a98a 0)';sw.firstChild.onclick=()=>{paint=null;applyPaint();};
  for(const h of TRF_PAINT)add(h,h);}
{const m=$('more');const add=(t,f)=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{f();};m.appendChild(b);return b;};
  for(const [v,t] of [['front34','Front ¾'],['rear34','Rear ¾'],['side','Side'],['wheel','Wheel'],['face','Face'],['tail','Tail'],['cabin','Cabin']])add(t,()=>{closePops();setView(v);});
  add('Paint',()=>{pop('paints','moreb');});add('Lights',()=>{nextLights();});add('Reset',()=>{closePops();resetView();});}

resize();show(carId,ver).then(()=>{$('loading').hidden=true;});loop();
window.VIEWER={THREE,scene,camera,controls,renderer,car,show,setView,focusAt,build,
  hold(h){held=h;},snap(){frame();return cv.toDataURL('image/png');},settle(){hoodA=hoodT;hoodStep();},
  setHood(o){hoodT=o?1:0;hoodA=hoodT;hoodStep();},setPaint(h){paint=h;applyPaint();},setLights(l){lights=l;applyLights();},
  stats(){return cur?{car:carId,v:ver,...countTris(cur.root),ms:cur.ms,buildMs:cur.buildMs}:null;},get cur(){return cur;},get VIEWS(){return VIEWS;}};
