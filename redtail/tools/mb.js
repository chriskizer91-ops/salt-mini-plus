/* a copy of the kit's MB, as much of it as the Redtail asks for: triangles, quads, and the smoothing (faces turned
   outward from o first when it's given; then each corner's normal the average of the faces round it within the
   crease angle) */
class MB {
  constructor() { this.p = []; this.n = []; this.c = []; this.m = []; }
  tri(a, b, c, col, em = 0, mat = 0) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz); if (l < 1e-14) return; nx /= l; ny /= l; nz /= l;
    this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); this.n.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
    this.c.push(col[0], col[1], col[2], em, col[0], col[1], col[2], em, col[0], col[1], col[2], em); this.m.push(mat, mat, mat);
  }
  quad(a, b, c, d, col, em, mat) { this.tri(a, b, c, col, em, mat); this.tri(a, c, d, col, em, mat); }
  smooth(deg, o) {
    const P = this.p, N = this.n, nt = P.length / 9, cs = Math.cos(deg * Math.PI / 180);
    const fn = new Float32Array(nt * 3);
    for (let t = 0; t < nt; t++) { const i = t * 9; fn[t * 3] = N[i]; fn[t * 3 + 1] = N[i + 1]; fn[t * 3 + 2] = N[i + 2];
      if (o) { const cx = (P[i] + P[i + 3] + P[i + 6]) / 3, cy = (P[i + 1] + P[i + 4] + P[i + 7]) / 3, cz = (P[i + 2] + P[i + 5] + P[i + 8]) / 3, r = typeof o === 'function' ? o([cx, cy, cz]) : o;
        if ((cx - r[0]) * fn[t * 3] + (cy - r[1]) * fn[t * 3 + 1] + (cz - r[2]) * fn[t * 3 + 2] < 0) {
          for (let k = 0; k < 3; k++) { const a = P[i + 3 + k]; P[i + 3 + k] = P[i + 6 + k]; P[i + 6 + k] = a; }
          fn[t * 3] *= -1; fn[t * 3 + 1] *= -1; fn[t * 3 + 2] *= -1; } } }
    const key = (x, y, z) => Math.round(x * 1e4) + ',' + Math.round(y * 1e4) + ',' + Math.round(z * 1e4), G = new Map();
    for (let v = 0; v < nt * 3; v++) { const k = key(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]); let g = G.get(k); if (!g) G.set(k, g = []); g.push(v); }
    for (const g of G.values()) for (const v of g) { const t = (v / 3) | 0, ax = fn[t * 3], ay = fn[t * 3 + 1], az = fn[t * 3 + 2]; let sx = 0, sy = 0, sz = 0;
      for (const w of g) { const u = (w / 3) | 0, bx = fn[u * 3], by = fn[u * 3 + 1], bz = fn[u * 3 + 2]; if (ax * bx + ay * by + az * bz >= cs) { sx += bx; sy += by; sz += bz; } }
      const l = Math.hypot(sx, sy, sz) || 1; N[v * 3] = sx / l; N[v * 3 + 1] = sy / l; N[v * 3 + 2] = sz / l; }
  }
}
if (typeof module !== 'undefined') module.exports = { MB };
