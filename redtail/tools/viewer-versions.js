/* The Redtail, every version side by side in one viewer. The version chip (first in the row, or the V key, or 1/2
   on a keyboard) swaps the model in place: the camera, the view, the cowl and Move stay as they are, so the same
   spot can be looked at on each version in turn. Every version is kept exactly as it was made:
     redtail-1: built on the page from redtail-1-model.js (its 241k triangles, as first delivered)
     redtail-2: redtail-2.glb (baked from redtail-1 in Blender, the reference sheet's patina in its skin)
   A new version is one more entry in VERSIONS. Open the page with #redtail-1 (or #v1) to start on that one. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MBmod from './mb.js';
import V1 from '../versions/redtail-1/redtail-1-model.js';
const { MB } = MBmod;

/* the plane's measurements (the same in every version) */
const I = { gear: { x: 0.98, ground: -1.79 }, tailwheel: { hub: [-4.3, -1.06, 0], ground: -1.2 }, wing: { ztip: 5.3 } };
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

/* the airframe: it carries the attitude; each version's model sits inside it, one shown at a time */
const airframe = new THREE.Group(); scene.add(airframe);

/* ---------- redtail-1: built in code, drawn exactly as redtail-1's own viewer draws it ---------- */
const MAT1 = {
  109: { r: .78 }, 110: { r: .74 }, 111: { r: .48, m: .05 }, 112: { r: .45, m: .05 },
  2: { glass: true }, 76: { r: .93 }, 77: { r: .88 }, 78: { r: .32, m: 1 }, 79: { r: .1, m: 1 }, 93: { r: .55, m: .7 }, 80: { r: .38, m: .9 },
  88: { r: .32, m: .9 }, 84: { r: .5 }, 75: { r: .7 }, 86: { r: .12 }, 87: { r: .48, m: .3 }, 89: { r: .82 }, 16: { r: .45, m: .75 },
  74: { r: .95 }, 73: { r: .75 }, 0: { r: .5 }, 72: { r: .22 }, 83: { e: [1, .05, .03] }, 71: { e: [1, .95, .85] },
};
function buildV1() {
  const R = V1.redtailBuild(MB), RI = R.info, cache = {};
  const matFor = id => { if (cache[id]) return cache[id]; const d = MAT1[id] || { r: .6 }; let m;
    if (d.glass) m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .03, metalness: 0, transparent: true, opacity: .22, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false });
    else m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: d.r ?? .6, metalness: d.m || 0, side: THREE.DoubleSide, envMapIntensity: 1 });
    if (d.e) { m.emissive = new THREE.Color(...d.e); m.emissiveIntensity = .6; } return cache[id] = m; };
  /* redtail-1's weathering: the belly dusty, oil streaked back from the exhaust */
  const weather = (id, p, c) => { if (id < 109 || id > 112) return c; const [x, y, z] = p; let k = 1, tint = [1, 1, 1];
    if (y < -.45) k *= 1 - .12 * Math.min(1, (-.45 - y) / .35);
    if (y < -.55 && Math.abs(z) < .32 && x < 1.5 && x > -1.2) { const s = (1 - Math.abs(z) / .32) * Math.min(1, (1.5 - x) / .4) * (1 - Math.max(0, (.6 - x) / 1.8)); tint = [1 - .25 * s, 1 - .3 * s, 1 - .36 * s]; }
    return [c[0] * k * tint[0], c[1] * k * tint[1], c[2] * k * tint[2]]; };
  const root = new THREE.Group(), groups = {}; let tris = 0;
  for (const [name, mb] of Object.entries(R.pieces)) {
    const g = new THREE.Group(); g.name = name; groups[name] = g; const by = {}, nt = mb.m.length / 3; tris += nt;
    for (let t = 0; t < nt; t++) { const id = mb.m[t * 3]; (by[id] || (by[id] = [])).push(t); }
    for (const [id, list] of Object.entries(by)) {
      const pos = new Float32Array(list.length * 9), nrm = new Float32Array(list.length * 9), col = new Float32Array(list.length * 9);
      list.forEach((t, k) => { for (let j = 0; j < 9; j++) { pos[k * 9 + j] = mb.p[t * 9 + j]; nrm[k * 9 + j] = mb.n[t * 9 + j]; }
        for (let v = 0; v < 3; v++) { const c = weather(+id, [mb.p[t * 9 + v * 3], mb.p[t * 9 + v * 3 + 1], mb.p[t * 9 + v * 3 + 2]], [mb.c[t * 12 + v * 4], mb.c[t * 12 + v * 4 + 1], mb.c[t * 12 + v * 4 + 2]]); col[k * 9 + v * 3] = c[0]; col[k * 9 + v * 3 + 1] = c[1]; col[k * 9 + v * 3 + 2] = c[2]; } });
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const mesh = new THREE.Mesh(geo, matFor(+id)); mesh.castShadow = +id !== 2; mesh.receiveShadow = true; if (+id === 2) mesh.renderOrder = 2; g.add(mesh);
    }
    root.add(g);
  }
  const pivot = (name, at) => { const g = groups[name]; const p = new THREE.Group(); p.position.set(...at); root.add(p); root.remove(g); g.position.set(-at[0], -at[1], -at[2]); p.add(g); return p; };
  const PV = { prop: pivot('prop', RI.prop.hub), rudder: pivot('rudder', RI.rudder.hinge), elevR: pivot('elevR', RI.elev.hinge), elevL: pivot('elevL', RI.elev.hinge),
    wheelR: pivot('wheelR', RI.wheelR.hub), wheelL: pivot('wheelL', RI.wheelL.hub), tail: pivot('tailwheel', RI.tailwheel.hub) };
  for (const k of ['flapR', 'flapL', 'aileronR', 'aileronL']) { const z = (RI[k].z[0] + RI[k].z[1]) / 2; PV[k] = pivot(k, [RI[k].hinge[0], RI[k].yAt(z), 0]); }
  return { root, groups, PV, tris };
}
/* ---------- redtail-2: the baked GLB, its moving parts already on their hinges ---------- */
async function buildV2() {
  const bin = Uint8Array.from(atob(window.REDTAIL_GLB), c => c.charCodeAt(0)).buffer;
  const g = await new Promise((ok, no) => new GLTFLoader().parse(bin, '', ok, no));
  const root = new THREE.Group(), groups = {}; let tris = 0;
  g.scene.traverse(o => { if (!o.isMesh) return; o.castShadow = o.material.name !== 'glass'; o.receiveShadow = true; o.material.side = THREE.DoubleSide;
    tris += o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3;
    if (o.material.name === 'glass') { o.material.transparent = true; o.material.opacity = .22; o.material.depthWrite = false; o.renderOrder = 2; o.castShadow = false; } });
  for (const o of [...g.scene.children]) { root.add(o); groups[o.name] = o; }
  const PV = { ...groups, tail: groups.tailwheel }, mats = new Set();
  root.traverse(o => { if (o.isMesh && o.material.name === 'redtail') mats.add(o.material); });
  return { root, groups, PV, tris, mats: [...mats], map0: [...mats][0].map };
}
/* redtail-2's paint jobs: its own (the reference sheet's cream and red with the sheet's patina), and his two from
   ChatGPT, laid onto the same model (the same shape, the same baked surface detail; only the colour picture differs) */
const PAINTS = [{ id: 'original', name: 'Original' }, { id: 'yellow-black', name: 'Yellow & Black' }, { id: 'wilderness-olive', name: 'Wilderness Olive' }];
let paint = 0; const ptex = {};
function setPaint(i) { const v = VERSIONS.find(o => o.id === 'redtail-2'); if (!v || !v.m) return; paint = i; const P = PAINTS[i];
  let tx = v.m.map0;
  if (P.id !== 'original') { tx = ptex[P.id]; if (!tx) { tx = ptex[P.id] = new THREE.TextureLoader().load('data:image/webp;base64,' + window.RT_PAINTS[P.id]); tx.flipY = false; tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; } }
  for (const m of v.m.mats) { m.map = tx; m.needsUpdate = true; } label(); }
const VERSIONS = [
  { id: 'redtail-1', chip: 'v1', note: 'built in code', build: buildV1 },
  { id: 'redtail-2', chip: 'v2', note: 'baked', build: buildV2 },
];
let cur = null;                                   // the version on screen
async function ready(v) { if (!v.m) { v.m = await v.build(); v.m.root.visible = false; airframe.add(v.m.root); } return v.m; }

/* sitting on its wheels: the airframe pitched up onto the tailwheel, the mains' contact on the floor */
function setAttitude(level) { airframe.rotation.set(0, 0, 0); airframe.position.set(0, 0, 0);
  if (level) { airframe.position.y = -GROUND; return; }
  const c = new THREE.Vector3(I.gear.x, GROUND, 0); airframe.rotation.z = PITCH; const q = c.clone().applyEuler(airframe.rotation); airframe.position.set(-q.x, -q.y, 0); }
setAttitude(false);

/* the cameras: perspective to look round it, orthographic for the sheet's views */
const persp = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, .05, 200);
function home() { const asp = innerWidth / innerHeight, k = Math.max(1, 1.0 / asp); persp.position.set(-.6 + 9.6 * k, 1.3 + 1.9 * k, -11.7 * k); }
home();
const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 200);
let cam = persp; const ctl = new OrbitControls(persp, renderer.domElement); ctl.target.set(-.6, 1.3, 0); ctl.enableDamping = true; ctl.maxPolarAngle = Math.PI * .495; ctl.update();
const VIEWS = {
  '3/4': null,
  Side: { pos: [0, 0, -30], up: [0, 1, 0], w: 7.6 }, Front: { pos: [30, 0, 0], up: [0, 1, 0], w: 11.2 }, Top: { pos: [0, 30, 0], up: [1, 0, 0], w: 11.2 },
  Under: { pos: [0, -30, 0], up: [1, 0, 0], w: 11.2 }, Rear: { pos: [-30, 0, 0], up: [0, 1, 0], w: 11.2 },
};
function centre() { const b = new THREE.Box3().setFromObject(cur ? cur.m.root : airframe); return b.getCenter(new THREE.Vector3()); }
function setView(name, aspect = innerWidth / innerHeight) {
  const v = VIEWS[name];
  if (!v) { cam = persp; setAttitude(false); floor.visible = true; home(); ctl.target.set(-.6, 1.3, 0); ctl.update(); return; }
  setAttitude(true); airframe.updateMatrixWorld(true); const c = centre(); let w = v.w; if (name === 'Top' || name === 'Under') w = Math.max(w, 7.6 * aspect); const h = w / aspect;
  Object.assign(ortho, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 }); ortho.updateProjectionMatrix();
  ortho.position.set(c.x + v.pos[0], c.y + v.pos[1], c.z + v.pos[2]); ortho.up.set(...v.up); ortho.lookAt(c); cam = ortho;
  floor.visible = false;
}
/* the chips: the version first, then the sheet's views, the cowl, Move */
const ui = document.getElementById('ui'), mk = (t, f) => { const b = document.createElement('button'); b.textContent = t; b.onclick = () => f(b); ui.appendChild(b); return b; };
const verChip = mk('', () => cycle()); verChip.className = 'ver'; verChip.title = 'Swap to the other version (V)';
const paintChip = mk('Paint', () => setPaint((paint + 1) % PAINTS.length)); paintChip.title = 'Next paint job (P)';
const vb = {}; for (const n of Object.keys(VIEWS)) vb[n] = mk(n, () => { setView(n); for (const k in vb) vb[k].classList.toggle('on', k === n); });
vb['3/4'].classList.add('on');
let cowlOn = true, moving = false;
mk('Cowl', b => { cowlOn = !cowlOn; for (const v of VERSIONS) if (v.m) v.m.groups.cowl.visible = cowlOn; b.classList.toggle('on', !cowlOn); }).title = 'Take the cowl off to see the engine';
mk('Move', b => { moving = !moving; b.classList.toggle('on', moving); });
const info = document.getElementById('info');
function label() { const v = cur; verChip.textContent = v.chip + ' ⇄'; const pv = v.id === 'redtail-2'; paintChip.hidden = !pv;
  paintChip.textContent = PAINTS[paint].name.split(' ')[0]; paintChip.classList.toggle('on', pv && paint > 0);
  info.innerHTML = `Redtail · <b>${v.id}</b> (${v.note})${pv && paint ? ' · ' + PAINTS[paint].name : ''} · ${(v.m.tris / 1000).toFixed(0)}k triangles · span ${(I.wing.ztip * 2).toFixed(1)} m · length 7.0 m`;
  document.title = `Redtail · ${v.id} · versions`; }
let busy = false;
async function show(v) {
  if (busy || v === cur) return; busy = true;
  if (!v.m) { verChip.textContent = v.chip + ' …'; await new Promise(r => setTimeout(r, 30)); }
  const m = await ready(v); m.groups.cowl.visible = cowlOn;
  for (const o of VERSIONS) if (o.m) o.m.root.visible = o === v;
  cur = v; label(); busy = false;
  const on = Object.keys(vb).find(k => vb[k].classList.contains('on')); if (on !== '3/4') setView(on);   // the ortho views re-centre on this version
}
function cycle() { show(VERSIONS[(VERSIONS.indexOf(cur) + 1) % VERSIONS.length]); }
addEventListener('keydown', e => { if (e.key === 'p' || e.key === 'P') setPaint((paint + 1) % PAINTS.length); if (e.key === 'v' || e.key === 'V') cycle(); const n = +e.key; if (n >= 1 && n <= VERSIONS.length) show(VERSIONS[n - 1]); });
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); persp.aspect = innerWidth / innerHeight; persp.updateProjectionMatrix(); const on = Object.keys(vb).find(k => vb[k].classList.contains('on')); setView(on); });

/* the moving parts: the prop turning, the surfaces working, the wheels rolling (the same motion on every version) */
let t0 = performance.now();
function frame(now) {
  const t = (now - t0) / 1000;
  for (const v of VERSIONS) { if (!v.m) continue; const PV = v.m.PV;
    if (moving) { PV.prop.rotation.x = t * 14; PV.wheelR.rotation.z = PV.wheelL.rotation.z = -t * 2; PV.tail.rotation.z = -t * 6.5; const s = Math.sin(t * 1.6), c = Math.sin(t * 1.1);
      PV.rudder.rotation.y = .35 * s; PV.elevR.rotation.z = PV.elevL.rotation.z = .3 * c;
      PV.aileronR.rotation.z = .3 * s; PV.aileronL.rotation.z = -.3 * s; PV.flapR.rotation.z = PV.flapL.rotation.z = -.35 * (.5 + .5 * Math.sin(t * .5)); }
    else for (const k of ['prop', 'rudder', 'elevR', 'elevL', 'aileronR', 'aileronL', 'flapR', 'flapL']) PV[k].rotation.set(0, 0, 0); }
  ctl.update(); renderer.render(scene, cam); requestAnimationFrame(frame);
}
/* start on the version named in the address (#redtail-1 or #v1), otherwise the newest; the others are made
   in the background a moment later so the swap is instant */
const want = location.hash.slice(1).toLowerCase();
const first = VERSIONS.find(v => v.id === want || v.chip === want) || VERSIONS[VERSIONS.length - 1];
await show(first);
requestAnimationFrame(frame);
setTimeout(async () => { for (const v of VERSIONS) await ready(v); }, 400);
window.__rt = { setPaint, get paint() { return PAINTS[paint].id; }, show: id => show(VERSIONS.find(v => v.id === id)), get version() { return cur && cur.id; }, get built() { return VERSIONS.filter(v => v.m).map(v => v.id); }, VERSIONS,
  look: (p, t) => { cam = persp; setAttitude(false); floor.visible = true; airframe.updateMatrixWorld(true); const a = airframe.localToWorld(new THREE.Vector3(...p)), b = airframe.localToWorld(new THREE.Vector3(...t)); persp.position.copy(a); ctl.target.copy(b); ctl.update(); },
  setView, renderer, scene, setAttitude, get cam() { return cam; }, setMoving: v => { moving = v; }, cowl: v => { cowlOn = v; for (const o of VERSIONS) if (o.m) o.m.groups.cowl.visible = v; } };
