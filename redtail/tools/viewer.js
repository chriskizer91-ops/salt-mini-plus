/* The Redtail's viewer: the model built on the page (redtail-model.js, the same code the game will run), drawn
   with three.js in a light studio like the reference sheets. Drag to turn round it, pinch or scroll to come closer.
   The chips: the sheet's views, the cowl on or off, the controls moving. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
const { MB } = require('./mb.js');
const { redtailBuild } = require('./redtail-model.js');

const R = redtailBuild(MB), I = R.info;
const GROUND = I.gear.ground;                       // y of the main tires' contact, the airframe level
const PITCH = Math.atan2(I.tailwheel.ground - GROUND, I.gear.x - I.tailwheel.hub[0]);   // sitting on its three wheels

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

/* the materials, by the game's material id */
const MAT = {
  109: { r: .78 }, 110: { r: .74 }, 111: { r: .48, m: .05 }, 112: { r: .45, m: .05 },
  2: { glass: true }, 76: { r: .93 }, 77: { r: .88 }, 78: { r: .32, m: 1 }, 79: { r: .1, m: 1 }, 93: { r: .55, m: .7 }, 80: { r: .38, m: .9 },
  88: { r: .32, m: .9 }, 84: { r: .5 }, 75: { r: .7 }, 86: { r: .12 }, 87: { r: .48, m: .3 }, 89: { r: .82 }, 16: { r: .45, m: .75 },
  74: { r: .95 }, 73: { r: .75 }, 0: { r: .5 }, 72: { r: .22 }, 83: { e: [1, .05, .03] }, 71: { e: [1, .95, .85] },
};
const cache = {};
function matFor(id) {
  if (cache[id]) return cache[id]; const d = MAT[id] || { r: .6 };
  let m;
  if (d.glass) m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .03, metalness: 0, transparent: true, opacity: .22, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false });
  else m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: d.r ?? .6, metalness: d.m || 0, side: THREE.DoubleSide, envMapIntensity: 1 });
  if (d.e) { m.emissive = new THREE.Color(...d.e); m.emissiveIntensity = .6; }
  return cache[id] = m;
}
/* weathering on the paint, as the sheets have it: the belly dusty, oil streaked back from the exhaust */
function weather(id, p, c) {
  if (id < 109 || id > 112) return c; const [x, y, z] = p; let k = 1, tint = [1, 1, 1];
  if (y < -.45) k *= 1 - .12 * Math.min(1, (-.45 - y) / .35);
  if (y < -.55 && Math.abs(z) < .32 && x < 1.5 && x > -1.2) { const s = (1 - Math.abs(z) / .32) * Math.min(1, (1.5 - x) / .4) * (1 - Math.max(0, (.6 - x) / 1.8)); tint = [1 - .25 * s, 1 - .3 * s, 1 - .36 * s]; }
  return [c[0] * k * tint[0], c[1] * k * tint[1], c[2] * k * tint[2]];
}
/* each piece: one mesh per material, the piece in a group so it can move on its own */
const airframe = new THREE.Group(); scene.add(airframe);
const groups = {};
let tris = 0;
for (const [name, mb] of Object.entries(R.pieces)) {
  const g = new THREE.Group(); g.name = name; groups[name] = g; const by = {};
  const nt = mb.m.length / 3; tris += nt;
  for (let t = 0; t < nt; t++) { const id = mb.m[t * 3]; (by[id] || (by[id] = [])).push(t); }
  for (const [id, list] of Object.entries(by)) {
    const pos = new Float32Array(list.length * 9), nrm = new Float32Array(list.length * 9), col = new Float32Array(list.length * 9);
    list.forEach((t, k) => { for (let j = 0; j < 9; j++) { pos[k * 9 + j] = mb.p[t * 9 + j]; nrm[k * 9 + j] = mb.n[t * 9 + j]; }
      for (let v = 0; v < 3; v++) { const c = weather(+id, [mb.p[t * 9 + v * 3], mb.p[t * 9 + v * 3 + 1], mb.p[t * 9 + v * 3 + 2]], [mb.c[t * 12 + v * 4], mb.c[t * 12 + v * 4 + 1], mb.c[t * 12 + v * 4 + 2]]); col[k * 9 + v * 3] = c[0]; col[k * 9 + v * 3 + 1] = c[1]; col[k * 9 + v * 3 + 2] = c[2]; } });
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mesh = new THREE.Mesh(geo, matFor(+id)); mesh.castShadow = +id !== 2; mesh.receiveShadow = true; if (+id === 2) mesh.renderOrder = 2; g.add(mesh);
  }
  airframe.add(g);
}
/* the moving parts round their hinges: a pivot group at the hinge, the part offset back into place */
function pivot(name, at) { const g = groups[name]; if (!g) return null; const p = new THREE.Group(); p.position.set(...at); airframe.add(p); airframe.remove(g); g.position.set(-at[0], -at[1], -at[2]); p.add(g); return p; }
const PV = {
  prop: pivot('prop', I.prop.hub), rudder: pivot('rudder', I.rudder.hinge), elevR: pivot('elevR', I.elev.hinge), elevL: pivot('elevL', I.elev.hinge),
  wheelR: pivot('wheelR', I.wheelR.hub), wheelL: pivot('wheelL', I.wheelL.hub), tail: pivot('tailwheel', I.tailwheel.hub),
};
for (const k of ['flapR', 'flapL', 'aileronR', 'aileronL']) { const z = (I[k].z[0] + I[k].z[1]) / 2; PV[k] = pivot(k, [I[k].hinge[0], I[k].yAt(z), 0]); }

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
document.getElementById('info').textContent = `${I.name} · ${I.version} · ${(tris / 1000).toFixed(0)}k triangles · span ${(I.wing.ztip * 2).toFixed(1)} m · length 7.0 m`;
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); persp.aspect = innerWidth / innerHeight; persp.updateProjectionMatrix(); const on = Object.keys(vb).find(k => vb[k].classList.contains('on')); setView(on); });
/* the moving parts: the prop turning, the surfaces working, the wheels rolling a little */
let t0 = performance.now();
function frame(now) {
  const t = (now - t0) / 1000;
  if (moving) { PV.prop.rotation.x = t * 14; const s = Math.sin(t * 1.6), c = Math.sin(t * 1.1);
    PV.rudder.rotation.y = .35 * s; PV.elevR.rotation.z = PV.elevL.rotation.z = .3 * c;
    PV.aileronR.rotation.z = .3 * s; PV.aileronL.rotation.z = -.3 * s; PV.flapR.rotation.z = PV.flapL.rotation.z = -.35 * (.5 + .5 * Math.sin(t * .5)); }
  else { PV.prop.rotation.x = .0; for (const k of ['rudder', 'elevR', 'elevL', 'aileronR', 'aileronL', 'flapR', 'flapL']) PV[k].rotation.set(0, 0, 0); }
  ctl.update(); renderer.render(scene, cam); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__rt = { look: (p, t) => { cam = persp; setAttitude(false); floor.visible = true; airframe.updateMatrixWorld(true); const a = airframe.localToWorld(new THREE.Vector3(...p)), b = airframe.localToWorld(new THREE.Vector3(...t)); persp.position.copy(a); ctl.target.copy(b); ctl.update(); }, setView, R, groups, PV, renderer, scene, setAttitude, get cam() { return cam; }, setMoving: v => { moving = v; }, cowl: v => { groups.cowl.visible = v; } };
