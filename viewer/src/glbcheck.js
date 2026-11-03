/* (bundled by models/tools/glb_check.js) a .glb read the way any game engine would read it (three.js's own glTF loader), drawn
   on the viewer's studio backdrop, with its pieces moved as a driven car moves them */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
window.CHECK=async(b64,W,H,pose)=>{
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;document.body.appendChild(cv);
  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});r.setSize(W,H,false);r.toneMapping=THREE.NeutralToneMapping;r.shadowMap.enabled=true;
  const sc=new THREE.Scene();sc.background=new THREE.Color('#e6e5e2');
  const pm=new THREE.PMREMGenerator(r),es=new THREE.Scene();{const g=new THREE.Mesh(new THREE.SphereGeometry(40,32,16),new THREE.MeshBasicMaterial({color:0x2a2a2a,side:THREE.BackSide}));es.add(g);
    for(const [w,h,p,k] of [[14,4.5,[0,12,0],9],[7,5,[13,5,3],3.2],[7,4,[-13,5,-2],2.2],[1.6,9,[1.5,5,11],6],[1.6,9,[1.5,5,-11],6]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));m.material.color.setScalar(k);m.position.set(...p);m.lookAt(0,1,0);es.add(m);}}
  sc.environment=pm.fromScene(es,.02).texture;
  const key=new THREE.DirectionalLight(0xffffff,1.8);key.position.set(3.2,7.5,2.4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4});sc.add(key);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.3}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;sc.add(fl);
  const buf=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer;
  const g=await new Promise((res,rej)=>new GLTFLoader().parse(buf,'',res,rej));sc.add(g.scene);
  let tris=0,draws=0;const names=[];g.scene.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;tris+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;draws++;}if(o.name)names.push(o.name);});
  /* the pose: the hood open, the front wheels steered, the wheels turned, the lamps lit */
  const by=n=>g.scene.getObjectByName(n);
  if(pose.hood&&by('hood'))by('hood').rotation.z=pose.hood;
  for(const t of ['fl','fr'])if(by('steer_'+t))by('steer_'+t).rotation.y=pose.steer||0;
  for(const t of ['fl','fr','rl','rr'])if(by('wheel_'+t))by('wheel_'+t).rotation.z=pose.spin||0;
  if(pose.lamps)g.scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.userData&&o.material.userData.lamp){o.material=o.material.clone();o.material.emissive=new THREE.Color(o.material.userData.glow);o.material.emissiveIntensity=2.5;}});
  const cam=new THREE.PerspectiveCamera(28,W/H,.05,100);cam.position.set(...pose.cam[0]);cam.lookAt(...pose.cam[1]);
  r.render(sc,cam);return {png:cv.toDataURL('image/png'),tris,draws,names};};
