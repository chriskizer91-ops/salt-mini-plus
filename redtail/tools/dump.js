const fs = require('fs'), { MB } = require('./mb.js'), { redtailBuild } = require('./redtail-model.js');
const R = redtailBuild(MB), I = R.info, out = 'redtail/work/bake/hi/', meta = { pieces: {} };
for (const [k, mb] of Object.entries(R.pieces)) { const nt = mb.m.length / 3, P = new Float32Array(mb.p), N = new Float32Array(mb.n), C = new Float32Array(nt * 9), M = new Uint8Array(nt);
  for (let t = 0; t < nt; t++) { M[t] = mb.m[t * 3]; for (let v = 0; v < 3; v++) for (let j = 0; j < 3; j++) C[t * 9 + v * 3 + j] = mb.c[t * 12 + v * 4 + j]; }
  fs.writeFileSync(out + k + '.pos', Buffer.from(P.buffer)); fs.writeFileSync(out + k + '.nrm', Buffer.from(N.buffer)); fs.writeFileSync(out + k + '.col', Buffer.from(C.buffer)); fs.writeFileSync(out + k + '.mat', Buffer.from(M.buffer)); meta.pieces[k] = nt; }
const J = JSON.parse(JSON.stringify(I, (k, v) => typeof v === 'function' ? undefined : v));
for (const k of ['flapR', 'flapL', 'aileronR', 'aileronL']) J[k].hingeY = I[k].yAt((I[k].z[0] + I[k].z[1]) / 2);
meta.info = J; fs.writeFileSync(out + 'meta.json', JSON.stringify(meta)); console.log(Object.keys(meta.pieces).length, 'pieces', I.total, 'tris');
