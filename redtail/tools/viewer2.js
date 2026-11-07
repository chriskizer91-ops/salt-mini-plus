/* The Redtail's viewer: the model built on the page (redtail-model.js, the same code the game will run), drawn
   with three.js in a light studio like the reference sheets. Drag to turn round it, pinch or scroll to come closer.
   The chips: the sheet's views, the cowl on or off, the controls moving. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const I = {"gear": {"x": 0.98, "y": -1.33, "track": 2.5, "R": 0.46, "W": 0.4, "ground": -1.79}, "tailwheel": {"hub": [-4.3, -1.06, 0], "R": 0.14, "ground": -1.2000000000000002}, "wing": {"ztip": 5.3}};
const GROUND = I.gear.ground;
const PITCH = Math.atan2(I.tailwheel.ground - GROUND, I.gear.x - I.tailwheel.hub[0]);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xe4e6ea);
const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = .9;
const sun = new THREE.DirectionalLight(0xffffff, 1.9); sun.position.set(6, 12, 5); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
scene.add(sun); scene.add(new THREE.HemisphereLight(0xffffff, 0xb8b4aa, .35));
/* the floor: the sheet's grey with its faint grid, catching the shadow */
const gc = document.createElement('canvas'); gc.width = gc.height = 512; { const g = gc.getContext('2d'); g.fillStyle = '#e4e6ea'; g.fillRect(0, 0, 512, 512); g.strokeStyle = 'rgba(120,130,150,.18)'; g.lineWidth = 1;
  for (let i = 0; i <= 512; i += 16) { g.beginPath(); g.moveTo(i + .5, 0); g.lineTo(i + .5, 512); g.stroke(); g.beginPath(); g.moveTo(0, i + .5); g.lineTo(512, i + .5); g.stroke(); }
  g.strokeStyle = 'rgba(120,130,150,.35)'; g.beginPath(); g.moveTo(.5, 0); g.lineTo(.5, 512); g.moveTo(0, .5); g.lineTo(512, .5); g.stroke(); }
const gt = new THREE.CanvasTexture(gc); gt.wrapS = gt.wrapT = THREE.RepeatWrapping; gt.repeat.set(30, 30); gt.colorSpace = THREE.SRGBColorSpace; gt.anisotropy = 8;
const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ map: gt, roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

const airframe = new THREE.Group(); scene.add(airframe); const groups = {}, PV = {}; let tris = 0;
const bin = Uint8Array.from(atob(window.REDTAIL_GLB), c => c.charCodeAt(0)).buffer;
await new Promise((ok, no) => new GLTFLoader().parse(bin, '', g => {
  g.scene.traverse(o => { if (o.isMesh) { o.castShadow = o.material.name !== 'glass'; o.receiveShadow = true; o.material.side = THREE.DoubleSide; tris += o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3;
    if (o.material.name === 'glass') { o.material.transparent = true; o.material.opacity = .22; o.material.depthWrite = false; o.renderOrder = 2; o.castShadow = false; } } });
  for (const o of [...g.scene.children]) { airframe.add(o); groups[o.name] = o; PV[o.name] = o; } ok(); }, no));
PV.tail = PV.tailwheel;
/* sitting on its wheels: the airframe pitched up onto the tailwheel, the mains' contact on the floor */
function setAttitude(level) { airframe.rotation.set(0, 0, 0); airframe.position.set(0, 0, 0);
  if (level) { airframe.position.y = -GROUND; return; }
  const c = new THREE.Vector3(I.gear.x, GROUND, 0); airframe.rotation.z = PITCH; const q = c.clone().applyEuler(airframe.rotation); airframe.position.set(-q.x + c.x * 0, -q.y, 0); }
setAttitude(false);

/* the cameras: perspective to look round it, orthographic for the sheet's views */
const persp = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, .05, 200);
/* the 3/4 view from the front left, far enough back that the whole span fits however the phone is held */
function home() { const asp = innerWidth / innerHeight, k = Math.max(1, 1.0 / asp); persp.position.set(-.6 + 9.6 * k, 1.3 + 1.9 * k, -11.7 * k); }
home();
const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 200);
let cam = persp; const ctl = new OrbitControls(persp, renderer.domElement); ctl.target.set(-.6, 1.3, 0); ctl.enableDamping = true; ctl.maxPolarAngle = Math.PI * .495; ctl.update();
const VIEWS = {
  '3/4': null,
  Side: { pos: [0, 0, -30], up: [0, 1, 0], w: 7.6 }, Front: { pos: [30, 0, 0], up: [0, 1, 0], w: 11.2 }, Top: { pos: [0, 30, 0], up: [1, 0, 0], w: 11.2 },
  Under: { pos: [0, -30, 0], up: [1, 0, 0], w: 11.2 }, Rear: { pos: [-30, 0, 0], up: [0, 1, 0], w: 11.2 },
};
function centre() { const b = new THREE.Box3().setFromObject(airframe); return b.getCenter(new THREE.Vector3()); }
function setView(name, aspect = innerWidth / innerHeight) {
  const v = VIEWS[name]; floor.visible = !v || name === 'Side' || name === 'Front' || name === 'Rear';
  if (!v) { cam = persp; setAttitude(false); floor.visible = true; home(); ctl.target.set(-.6, 1.3, 0); ctl.update(); return; }
  setAttitude(true); const c = centre(); let w = v.w; if (name === 'Top' || name === 'Under') w = Math.max(w, 7.6 * aspect); const h = w / aspect;
  Object.assign(ortho, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 }); ortho.updateProjectionMatrix();
  ortho.position.set(c.x + v.pos[0], c.y + v.pos[1], c.z + v.pos[2]); ortho.up.set(...v.up); ortho.lookAt(c); cam = ortho;
  floor.visible = false; scene.background = new THREE.Color(0xe4e6ea);
}
/* the chips */
const ui = document.getElementById('ui'), mk = (t, f) => { const b = document.createElement('button'); b.textContent = t; b.onclick = () => f(b); ui.appendChild(b); return b; };
const vb = {}; for (const n of Object.keys(VIEWS)) vb[n] = mk(n, () => { setView(n); for (const k in vb) vb[k].classList.toggle('on', k === n); });
vb['3/4'].classList.add('on');
let cowlOn = true, moving = false;
mk('Cowl', b => { cowlOn = !cowlOn; groups.cowl.visible = cowlOn; b.classList.toggle('on', !cowlOn); }).title = 'Take the cowl off to see the engine';
mk('Move', b => { moving = !moving; b.classList.toggle('on', moving); });
document.getElementById('info').textContent = `Redtail · redtail-2 (baked) · ${(tris / 1000).toFixed(0)}k triangles · span ${(I.wing.ztip * 2).toFixed(1)} m · length 7.0 m`;
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); persp.aspect = innerWidth / innerHeight; persp.updateProjectionMatrix(); const on = Object.keys(vb).find(k => vb[k].classList.contains('on')); setView(on); });
/* the moving parts: the prop turning, the surfaces working, the wheels rolling a little */
let t0 = performance.now();
function frame(now) {
  const t = (now - t0) / 1000;
  if (moving) { PV.prop.rotation.x = t * 14; PV.wheelR.rotation.z = PV.wheelL.rotation.z = -t * 2; PV.tailwheel.rotation.z = -t * 6.5; const s = Math.sin(t * 1.6), c = Math.sin(t * 1.1);
    PV.rudder.rotation.y = .35 * s; PV.elevR.rotation.z = PV.elevL.rotation.z = .3 * c;
    PV.aileronR.rotation.z = .3 * s; PV.aileronL.rotation.z = -.3 * s; PV.flapR.rotation.z = PV.flapL.rotation.z = -.35 * (.5 + .5 * Math.sin(t * .5)); }
  else { PV.prop.rotation.x = .0; for (const k of ['rudder', 'elevR', 'elevL', 'aileronR', 'aileronL', 'flapR', 'flapL']) PV[k].rotation.set(0, 0, 0); }
  ctl.update(); renderer.render(scene, cam); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__rt = { groups, PV, look: (p, t) => { cam = persp; setAttitude(false); floor.visible = true; airframe.updateMatrixWorld(true); const a = airframe.localToWorld(new THREE.Vector3(...p)), b = airframe.localToWorld(new THREE.Vector3(...t)); persp.position.copy(a); ctl.target.copy(b); ctl.update(); }, setView, renderer, scene, setAttitude, get cam() { return cam; }, setMoving: v => { moving = v; }, cowl: v => { groups.cowl.visible = v; } };
