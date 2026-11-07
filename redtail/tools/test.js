const { MB } = require('./mb.js'), { redtailBuild } = require('./redtail-model.js');
const t0 = Date.now(), R = redtailBuild(MB), ms = Date.now() - t0;
let bad = 0; const bb = [[1e9, 1e9, 1e9], [-1e9, -1e9, -1e9]];
for (const [k, mb] of Object.entries(R.pieces)) { for (let i = 0; i < mb.p.length; i++) { const v = mb.p[i]; if (!Number.isFinite(v)) bad++; else { const a = i % 3; if (v < bb[0][a]) bb[0][a] = v; if (v > bb[1][a]) bb[1][a] = v; } } for (const v of mb.n) if (!Number.isFinite(v)) bad++; }
console.log('ms', ms, 'total tris', R.info.total, 'bad numbers', bad);
console.log(JSON.stringify(R.info.tris));
console.log('box min', bb[0].map(v => v.toFixed(2)), 'max', bb[1].map(v => v.toFixed(2)));
console.log('length', (bb[1][0] - bb[0][0]).toFixed(2), 'span', (bb[1][2] - bb[0][2]).toFixed(2), 'height', (bb[1][1] - bb[0][1]).toFixed(2));
