/* =====================================================================================
   THE REDTAIL: Redline County's bush plane, modelled from Christopher's reference sheets (Nov 2026).
   A two-seat tandem high-wing taildragger: fabric over a steel-tube frame, cream with a dark red stripe and a red
   tail, drooped red wing tips, vortex generators, slotted flaps and ailerons hung under the trailing edge, V lift
   struts with jury struts, big tundra tires on tube gear with shock struts, a leaf-spring tailwheel, a flat-four
   under a round cowl, a two-blade metal prop with black tips.
   Axes as the game's cars: x forward, y up, z to the right (the door is on the left, -z). Metres. y = 0 is the
   thrust line; the airframe is drawn level (the tail wheel sits 0.59 m higher than the mains' contact, so on the
   ground it rests about 6.4 degrees nose up).
   What comes back: pieces in the kit's MB form (p, n, c, m: positions, normals, colour + glow, material, per
   vertex), each of them a part that moves on its own (or not at all), and the numbers to place them.
   Only MB (tri, quad, smooth) is asked of the outside: the kit's own MB in the game, a copy of it in the viewer.
   ===================================================================================== */
function redtailBuild(MBc, opts) {
  opts = opts || {};
  const TAU = Math.PI * 2, PI = Math.PI;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t;
  const sst = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const V = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    len: a => Math.hypot(a[0], a[1], a[2]), norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
    lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
  };
  const lin = h => { const n = parseInt(h.slice(1), 16), f = v => Math.pow(v / 255, 2.2); return [f(n >> 16 & 255), f(n >> 8 & 255), f(n & 255)]; };
  /* ---------- the materials: [colour, glow, the game's material id] ----------
     109/110: doped fabric in the paint and the second paint (the stripe, the tail); 111/112: painted metal in the
     same two; the rest are the Studio kit's own (SM 70-108) and the game's (MAT 0-29) */
  const MT = (hex, id, em = 0) => [lin(hex), em, id];
  const M = {
    LINING: MT('#a39b8b', 85), FAB: MT('#d9cfb8', 109), TAPE: MT('#c9bd9f', 109), TAPE2: MT('#6a1512', 110), FAB2: MT('#7d1a17', 110), MET: MT('#d6ccb5', 111), MET2: MT('#7a1916', 112),
    GLASS: MT('#ffffff', 2), TREAD: MT('#3a3936', 76), WALL: MT('#403e3a', 77), ALU: MT('#a9abae', 78), POL: MT('#d3d5d8', 79),
    CAST: MT('#8c8b87', 93), ROTOR: MT('#7d7c7a', 80), BOLT: MT('#8a8c90', 88), SEAT: MT('#8a5532', 84), DASH: MT('#262524', 75),
    GAUGE: MT('#0d0e10', 86), BLK: MT('#1c1c1d', 87), RUB: MT('#121213', 89), STEEL: MT('#5c5d60', 16), EXH: MT('#6e5a45', 16),
    FLOOR: MT('#2a2826', 74), BELT: MT('#2f2f31', 73), WHITE: MT('#e9e6dd', 0), REDBOOT: MT('#8e2b22', 0), TIPBLK: MT('#151516', 72),
    CABLE: MT('#55575b', 87), NAVR: MT('#ffffff', 83), NAVG: MT('#2fd36b', 0, 2.5), NAVW: MT('#ffffff', 71), HEADL: MT('#bdbcb6', 0),
  };
  /* ---------- the pieces ---------- */
  const P = {}; const piece = n => P[n] || (P[n] = new MBc());
  const flipAll = (mb, o) => mb; // (winding is handled by smooth's outward test)
  /* every part is built into its own MB, smoothed there, then poured into its piece */
  function part(name, f, deg = 35, o = null) { const mb = new MBc(); f(mb); if (deg > 0) mb.smooth(deg, o); const dst = piece(name);
    for (let i = 0; i < mb.p.length; i++) dst.p.push(mb.p[i]); for (let i = 0; i < mb.n.length; i++) dst.n.push(mb.n[i]);
    for (let i = 0; i < mb.c.length; i++) dst.c.push(mb.c[i]); for (let i = 0; i < mb.m.length; i++) dst.m.push(mb.m[i]); return mb; }
  /* ---------- primitives (as the kit's: rings lofted, caps, tubes, revolves) ---------- */
  const Q = (mb, a, b, c, d, m) => mb.quad(a, b, c, d, m[0], m[1], m[2]);
  const T3 = (mb, a, b, c, m) => mb.tri(a, b, c, m[0], m[1], m[2]);
  function loft(mb, rings, m, closed = true, mf = null) {
    for (let i = 0; i < rings.length - 1; i++) { const A = rings[i], B = rings[i + 1], n = A.length;
      for (let j = 0; j < (closed ? n : n - 1); j++) { const j1 = (j + 1) % n, mm = mf ? mf(i, j) : m; if (!mm) continue; Q(mb, A[j], B[j], B[j1], A[j1], mm); } } }
  function cap(mb, ring, m, c = null) { if (!c) { c = [0, 0, 0]; for (const p of ring) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; } c = c.map(v => v / ring.length); }
    for (let j = 0; j < ring.length; j++) T3(mb, c, ring[j], ring[(j + 1) % ring.length], m); }
  function frameOf(t) { const g = Math.abs(t[1]) < .9 ? [0, 1, 0] : [1, 0, 0], u = V.norm(V.cross(t, g)); return [u, V.cross(t, u)]; }
  function cyl(mb, a, b, r0, r1, n, m, caps = true) { const t = V.norm(V.sub(b, a)), [u, w] = frameOf(t);
    const ring = (c, r) => { const o = []; for (let i = 0; i < n; i++) { const q = i / n * TAU; o.push(V.add(c, V.add(V.mul(u, Math.cos(q) * r), V.mul(w, Math.sin(q) * r)))); } return o; };
    const A = ring(a, r0), B = ring(b, r1); loft(mb, [A, B], m); if (caps) { cap(mb, A, m); cap(mb, B, m); } }
  /* a tube along a path (frames carried along so it doesn't twist); r a number or r(t) */
  function tube(mb, path, r, nr, m, caps = true) { const rings = []; let up = null;
    for (let i = 0; i < path.length; i++) { const p = path[i], a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], t = V.norm(V.sub(b, a));
      if (!up) up = frameOf(t)[0]; else up = V.norm(V.sub(up, V.mul(t, V.dot(up, t)))); const sd = V.cross(t, up), rr = typeof r === 'function' ? r(i / (path.length - 1)) : r, ring = [];
      for (let k = 0; k < nr; k++) { const q = k / nr * TAU; ring.push(V.add(p, V.add(V.mul(up, Math.cos(q) * rr), V.mul(sd, Math.sin(q) * rr)))); } rings.push(ring); }
    loft(mb, rings, m); if (caps) { cap(mb, rings[0], m); cap(mb, rings[rings.length - 1], m); } return rings; }
  /* a profile swept along a path with a fixed 'up' (struts: a streamline section, its chord kept along up) */
  function sweep(mb, path, prof, m, upv, caps = true) { const rings = [];
    for (let i = 0; i < path.length; i++) { const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], t = V.norm(V.sub(b, a));
      const u = V.norm(V.sub(upv, V.mul(t, V.dot(upv, t)))), s = V.cross(t, u); rings.push(prof.map(q => V.add(path[i], V.add(V.mul(s, q[0]), V.mul(u, q[1]))))); }
    loft(mb, rings, m); if (caps) { cap(mb, rings[0], m); cap(mb, rings[rings.length - 1], m); } return rings; }
  /* revolve a profile [[r, a], ...] (radius, distance along the axis) about axis d through o, n steps */
  function rev(mb, prof, o, d, n, m, a0 = 0, a1 = TAU, mf = null) { d = V.norm(d); const [u, w] = frameOf(d), full = Math.abs(a1 - a0 - TAU) < 1e-9, rings = [];
    for (let i = 0; i <= n; i++) { const q = a0 + (a1 - a0) * (full ? (i % n) : i) / n, cq = Math.cos(q), sq = Math.sin(q);
      rings.push(prof.map(p => V.add(o, V.add(V.mul(d, p[1]), V.add(V.mul(u, cq * p[0]), V.mul(w, sq * p[0])))))); }
    for (let i = 0; i < n; i++) for (let k = 0; k < prof.length - 1; k++) { const mm = mf ? mf(k, i) : m; if (!mm) continue; Q(mb, rings[i][k], rings[i][k + 1], rings[i + 1][k + 1], rings[i + 1][k], mm); }
    return { u, w, d }; }
  /* an oriented box (centre, unit axes, half sizes) */
  function box(mb, c, ax, ay, az, h, m) { const Pt = (i, j, k) => V.add(c, V.add(V.mul(ax, h[0] * i), V.add(V.mul(ay, h[1] * j), V.mul(az, h[2] * k))));
    const F = [[[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]], [[-1, -1, 1], [-1, 1, 1], [-1, 1, -1], [-1, -1, -1]], [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
      [[-1, -1, 1], [-1, -1, -1], [1, -1, -1], [1, -1, 1]], [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]]];
    for (const f of F) Q(mb, Pt(...f[0]), Pt(...f[1]), Pt(...f[2]), Pt(...f[3]), m); }
  const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
  /* a rounded box: a superellipsoid, n steps round (for cushions, the crankcase, rocker covers) */
  function sbox(mb, c, ax, ay, az, h, e, m, n = 16) { const S = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p), rings = [];
    for (let i = 0; i <= n; i++) { const th = -PI / 2 + PI * i / n, ring = [];
      for (let j = 0; j < n * 2; j++) { const ph = TAU * j / (n * 2), x = S(Math.cos(th), e) * S(Math.cos(ph), e), y = S(Math.sin(th), e), z = S(Math.cos(th), e) * S(Math.sin(ph), e);
        ring.push(V.add(c, V.add(V.mul(ax, x * h[0]), V.add(V.mul(ay, y * h[1]), V.mul(az, z * h[2]))))); } rings.push(ring); }
    loft(mb, rings, m); }
  function ball(mb, c, r, n, m) { sbox(mb, c, X, Y, Z, [r, r, r], 1, m, n); }
  /* a round-headed bolt or rivet on a surface: a low dome on the surface's normal */
  function dome(mb, c, nrm, r, h, m, n = 8) { const d = V.norm(nrm), prof = []; for (let k = 0; k <= 3; k++) { const a = k / 3 * PI / 2; prof.push([Math.cos(a) * r, Math.sin(a) * h]); }
    rev(mb, prof, V.sub(c, V.mul(d, h * .25)), d, n, m); }
  /* piecewise curves through points, eased between them */
  const pw = K => x => { if (x <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (x <= K[i][0]) { const a = K[i - 1], b = K[i], t = (x - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (t * t * (3 - 2 * t)); } return K[K.length - 1][1]; };
  /* monotone cubic (for outlines that must stay smooth through their points) */
  function mono(K) { const n = K.length, x = K.map(k => k[0]), y = K.map(k => k[1]), d = [], m = [];
    for (let i = 0; i < n - 1; i++) d.push((y[i + 1] - y[i]) / (x[i + 1] - x[i]));
    m.push(d[0]); for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2); m.push(d[n - 2]);
    return t => { if (t <= x[0]) return y[0]; if (t >= x[n - 1]) return y[n - 1]; let i = 0; while (t > x[i + 1]) i++;
      const h = x[i + 1] - x[i], s = (t - x[i]) / h, s2 = s * s, s3 = s2 * s; return (2 * s3 - 3 * s2 + 1) * y[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * y[i + 1] + (s3 - s2) * h * m[i + 1]; }; }
  const D = {};

  /* =====================================================================================
     THE FUSELAGE: one shape for the cowl, the cabin and the tail cone, so every piece meets the next exactly.
     A section at x: half width w, top yt, bottom yb, the top half a superellipse of power nt (the rounded deck),
     the bottom of power nb (the boxy belly). The ring's points are spaced by angle, with fixed points at the
     stripe's two edges and the window line, so the stripe and the glass have straight clean edges.
     ===================================================================================== */
  const XF = 2.06, XFW = 1.44, XWS = 1.30, XLE = .52, XC1 = -1.22, XT = -3.97;   // cowl front, firewall, windscreen foot, wing LE, cabin back, tail post
  const fw = mono([[XT, .05], [-3.6, .095], [-3.0, .175], [-2.0, .33], [-1.22, .455], [-.4, .49], [.4, .495], [1.0, .485], [1.44, .465], [1.8, .44], [2.06, .40]]);
  const fyb = mono([[XT, -.58], [-3.87, -.60], [-2.71, -.71], [-1.55, -.80], [-.38, -.86], [.43, -.86], [.9, -.80], [1.44, -.67], [1.85, -.62], [2.06, -.55]]);
  const ytRear = mono([[XT, -.075], [-3.87, -.06], [-3.17, .10], [-2.2, .33], [-1.6, .47], [-1.40, .62], [XC1, .86]]);
  const ytFront = mono([[XWS, .31], [1.44, .30], [1.80, .28], [2.06, .245]]);
  /* the cabin top: up the windscreen to the wing's leading edge, level under the wing, then down to the deck */
  const ytCab = x => x >= XWS ? ytFront(x) : x >= XLE ? lerp(.90, .31, (x - XLE) / (XWS - XLE)) : x >= -.72 ? .90 : lerp(.86, .90, sst(XC1, -.72, x));
  const fyt = x => x <= XC1 ? ytRear(x) : x >= XWS ? ytFront(x) : ytCab(x);
  const fnt = pw([[XT, 2.2], [-3.0, 2.4], [-1.6, 2.6], [XC1, 3.0], [.5, 3.4], [1.3, 3.2], [1.44, 2.9], [2.06, 2.3]]);
  const fnb = pw([[XT, 2.4], [-3.0, 3.0], [-1.0, 3.6], [1.0, 3.6], [1.44, 3.0], [2.06, 2.3]]);
  const YW = x => -.05;                                   // the window line
  const YS1 = x => lerp(-.12, -.07, clamp((XFW - x) / (XFW - XT), 0, 1)), YS0 = x => lerp(-.36, -.29, clamp((XFW - x) / (XFW - XT), 0, 1));
  D.fuse = { w: fw, yb: fyb, yt: fyt };
  const NB = 9, NS = 6, NM = 6, NT = 14;                   // ring points (one side): belly to stripe, the stripe, stripe to window line, window line to top
  /* one side's angles, bottom (-pi/2) to top (pi/2), with the fixed points; then the ring, right side up, left side down */
  function sideAngles(x) { const yt = fyt(x), yb = fyb(x), yc = (yt + yb) / 2, h = (yt - yb) / 2;
    const ang = (y, n) => { const v = clamp((y - yc) / h, -.97, .97); const s = Math.pow(Math.abs(v), n / 2); return Math.sign(v) * Math.asin(clamp(s, 0, .9999)); };
    const a0 = ang(YS0(x), fnb(x)), a1 = Math.max(ang(YS1(x), YS1(x) > yc ? fnt(x) : fnb(x)), a0 + .02), aw = Math.max(ang(YW(x), YW(x) > yc ? fnt(x) : fnb(x)), a1 + .02);
    const A = [], seg = (p, q, k) => { for (let i = 0; i < k; i++) A.push(p + (q - p) * i / k); };
    seg(-PI / 2, a0, NB); seg(a0, a1, NS); seg(a1, Math.min(aw, PI / 2 - .05), NM); seg(Math.min(aw, PI / 2 - .05), PI / 2, NT); A.push(PI / 2); return A; }
  function secPt(x, a, side) { const yt = fyt(x), yb = fyb(x), yc = (yt + yb) / 2, h = (yt - yb) / 2, w = fw(x), n = a > 0 ? fnt(x) : fnb(x);
    const c = Math.cos(a), s = Math.sin(a), z = w * Math.pow(Math.abs(c), 2 / n), y = yc + h * Math.sign(s) * Math.pow(Math.abs(s), 2 / n); return [x, y, side * z]; }
  /* the full ring: bottom centre, up the right side, over the top, down the left side (last point before the first) */
  function ring(x) { const A = sideAngles(x), r = []; for (let i = 0; i < A.length; i++) r.push(secPt(x, A[i], 1));
    for (let i = A.length - 2; i >= 1; i--) r.push(secPt(x, A[i], -1)); return r; }
  const NR = (NB + NS + NM + NT) * 2;                      // points in a full ring
  const iS0 = NB, iS1 = NB + NS, iW = NB + NS + NM, iTop = NB + NS + NM + NT; // indices on the right side
  const mirrorI = i => (NR - i) % NR;
  /* stations: dense where the shape turns, exact at every frame and window edge */
  function stations(x0, x1, step, keep = []) { const s = []; const n = Math.max(1, Math.ceil(Math.abs(x1 - x0) / step)); for (let i = 0; i <= n; i++) s.push(x0 + (x1 - x0) * i / n);
    for (const k of keep) if (k < Math.max(x0, x1) && k > Math.min(x0, x1)) s.push(k); return [...new Set(s.map(v => +v.toFixed(5)))].sort((a, b) => b - a); }
  /* where the stripe is: on the fabric from the firewall aft */
  const inStripe = j => (j >= iS0 && j < iS1) || (j >= mirrorI(iS1) && j < mirrorI(iS0));
  /* outward from the fuselage's own axis (for the smoothing's face test) */
  const fuseO = p => [p[0], (fyt(p[0]) + fyb(p[0])) / 2, 0];
  const DOOR = { x0: -.38, x1: .95 };                       // the door (left side)
  const RW = { x0: -1.20, x1: -.46 };                       // the rear side windows

  /* the tail cone: cabin back to the tail post, the whole ring, fabric with the stripe */
  part('body', mb => {
    const S = stations(XC1, XT, .045, [-1.40, -1.6, -3.87]); const R = S.map(ring);
    loft(mb, R, null, true, (i, j) => inStripe(j) && S[i] > -3.9 ? M.FAB2 : M.FAB);
    /* the tail post: closed off (the rudder hangs on it) */
    cap(mb, R[R.length - 1], M.FAB2);
  }, 40, fuseO);
  /* under the cabin: the belly and the sides up to the window line (open above it), firewall to cabin back */
  part('body', mb => {
    const S = stations(XFW, XC1, .04, [XWS, DOOR.x0, DOOR.x1, RW.x0, RW.x1, XLE]);
    const R = S.map(x => { const r = ring(x), o = []; for (let j = mirrorI(iW); j < NR; j++) o.push(r[j]); for (let j = 0; j <= iW; j++) o.push(r[j]); return o; });
    const off = NR - mirrorI(iW);                            // index in the open strip = ring index + off (mod)
    loft(mb, R, null, false, (i, j) => { const jr = (j - off + NR) % NR; return inStripe(jr) ? M.FAB2 : M.FAB; });
  }, 40, fuseO);
  /* the cabin's lining inside it: the same shape 12 mm in, a plain beige-grey cloth (so the paint is only outside) */
  part('cabin', mb => {
    const S = stations(XFW - .01, XC1 + .01, .06);
    const R = S.map(x => { const r = ring(x), o = []; for (let j = mirrorI(iW); j < NR; j++) o.push(r[j]); for (let j = 0; j <= iW; j++) o.push(r[j]);
      return o.map(q => { const c = fuseO(q), d = V.norm(V.sub(q, c)); return V.sub(q, V.mul(d, .012)); }); });
    loft(mb, R, M.LINING, false);
  }, 40, p => fuseO(p));
  /* the cowl: front ring to the firewall, painted metal; then the nose bowl, curving in to the spinner */
  D.cowl = { x0: XFW, x1: XF };
  part('cowl', mb => {
    const S = stations(XF, XFW, .03); const R = S.map(ring);
    loft(mb, R.slice().reverse(), M.MET, true);
    /* the nose bowl: from the cowl's front ring in to a circle round the spinner's back plate (r 0.19, on the
       thrust line), rolling forward over 7 rings */
    const F = ring(XF), rings = [];
    for (let k = 0; k <= 7; k++) { const t = k / 7, e = Math.sin(t * PI / 2);
      rings.push(F.map((p, j) => { const a = Math.atan2(p[1], p[2]), c = [XF, 0, 0], q = [XF, Math.sin(a) * .195, Math.cos(a) * .195];
        const b = V.lerp(p, q, e); b[0] = XF + .055 * Math.sin(t * PI) + .02 * t; return b; })); }
    /* the intake under the spinner: an oval, dark inside */
    const inIntake = p => Math.pow(p[2] / .16, 2) + Math.pow((p[1] + .36) / .075, 2) < 1;
    loft(mb, rings, M.MET, true);
    D.noseX = XF + .02;
  }, 38, p => [p[0] - .3, -.12, 0]);
  /* the intake under the spinner: an oval let into the nose bowl, dark inside, a rolled lip round it */
  part('cowl', mb => { const n = 40, rim = [], inn = [], lip = [];
    for (let k = 0; k < n; k++) { const a = k / n * TAU, z = Math.cos(a) * .135, y = -.335 + Math.sin(a) * .052; rim.push([2.112, y, z]); inn.push([2.07, -.335 + Math.sin(a) * .04, Math.cos(a) * .12]); lip.push([2.114, y, z]); }
    loft(mb, [rim, inn], M.BLK); cap(mb, inn, M.BLK); lip.push(lip[0]); tube(mb, lip, .011, 8, M.MET, false); }, 45);
  /* the louvred vents on the cowl's sides (X 1.56-1.78, Y -0.15 to -0.37), and screws along the cowl's back edge */
  for (const sd of [1, -1]) part('cowl', mb => {
    const x0 = 1.56, x1 = 1.78, y0 = -.37, y1 = -.15, zf = x => fw(x) * sd;
    const wz = (x, y) => { const r = ring(x); let best = r[0], bd = 1e9; for (const p of r) if (p[2] * sd > 0) { const dd = Math.abs(p[1] - y); if (dd < bd) { bd = dd; best = p; } } return best[2]; };
    /* the recess: a dark box let into the side */
    const zc = wz((x0 + x1) / 2, (y0 + y1) / 2), n = [0, 0, sd];
    box(mb, [(x0 + x1) / 2, (y0 + y1) / 2, zc - sd * .004], X, Y, Z, [(x1 - x0) / 2, (y1 - y0) / 2, .006], M.BLK);
    /* the slats: seven, each a bent strip */
    for (let k = 0; k < 7; k++) { const y = y0 + .018 + k * ((y1 - y0 - .036) / 6); box(mb, [(x0 + x1) / 2, y, zc + sd * .002], X, V.norm([0, 1, sd * .9]), V.norm([0, -sd * .9, 1]), [(x1 - x0) / 2 - .006, .009, .0025], M.MET); }
    /* the frame round it */
    box(mb, [(x0 + x1) / 2, y1 + .006, zc + sd * .003], X, Y, Z, [(x1 - x0) / 2 + .008, .006, .004], M.MET); box(mb, [(x0 + x1) / 2, y0 - .006, zc + sd * .003], X, Y, Z, [(x1 - x0) / 2 + .008, .006, .004], M.MET);
    box(mb, [x0 - .006, (y0 + y1) / 2, zc + sd * .003], X, Y, Z, [.006, (y1 - y0) / 2 + .012, .004], M.MET); box(mb, [x1 + .006, (y0 + y1) / 2, zc + sd * .003], X, Y, Z, [.006, (y1 - y0) / 2 + .012, .004], M.MET);
  }, 30);
  part('cowl', mb => { const r = ring(XFW + .018); for (let j = 0; j < NR; j += 2) { const p = r[j], c = [p[0], (fyt(p[0]) + fyb(p[0])) / 2, 0]; dome(mb, p, V.sub(p, c), .006, .003, M.BOLT, 6); }
    const r2 = ring(XF - .02); for (let j = 1; j < NR; j += 3) { const p = r2[j], c = [p[0], (fyt(p[0]) + fyb(p[0])) / 2, 0]; dome(mb, p, V.sub(p, c), .006, .003, M.BOLT, 6); }
    /* the cowl's split line, a seam along each side at the thrust line */
    for (const sd of [1, -1]) { const path = []; for (let k = 0; k <= 20; k++) { const x = lerp(XF - .03, XFW + .03, k / 20), r3 = ring(x); let b = r3[0], bd = 1e9; for (const p of r3) if (p[2] * sd > 0 && Math.abs(p[1]) < bd) { bd = Math.abs(p[1]); b = p; } path.push(V.add(b, [0, 0, sd * .002])); }
      tube(mb, path, .0035, 5, M.BLK, false); }
  }, 30);

  /* =====================================================================================
     THE CABIN'S GLASS AND FRAME: above the window line, firewall's windscreen foot to the cabin back. The glass
     follows the same section (the windscreen is its rounded top ahead of the wing, the side windows its flat
     sides); the frame is tubes along every edge, the door's outline, the posts, the skylight's bars.
     ===================================================================================== */
  {
    const S = stations(XWS, XC1, .03, [DOOR.x0, DOOR.x1, RW.x0, RW.x1, XLE, -.72]);
    const up = x => { const r = ring(x), o = []; for (let j = iW; j <= mirrorI(iW) + (mirrorI(iW) < iW ? NR : 0); j++) o.push(r[j % NR]); return o; };
    const R = S.map(up);
    /* glass everywhere but the roof under the wing (behind it: fabric, the turtle deck's front) */
    part('glass', mb => loft(mb, R, null, false, (i, j) => { const x = (S[i] + S[i + 1]) / 2, k = j + iW;
      if (x < RW.x0) return null; if (x < -.72 && Math.abs(k + .5 - iTop) < 5) return null; if (x < XLE && Math.abs(k + .5 - iTop) < 4) return null; return M.GLASS; }), 0);
    /* ahead of the windscreen, over the firewall: the deck the cowl meets, painted metal */
    part('body', mb => { const S2 = stations(XFW, XWS, .02); loft(mb, S2.map(up), M.MET, false); }, 40, fuseO);
    /* the deck behind the wing (cabin back to the wing's trailing edge, the top), fabric */
    part('body', mb => { const S2 = stations(-.72, XC1, .03); const R2 = S2.map(x => { const r = ring(x), o = []; for (let j = iTop - 5; j <= iTop + 5; j++) o.push(r[j % NR]); return o; }); loft(mb, R2, M.FAB, false); }, 40, fuseO);
    /* the back between the rear windows and the cabin back post (fabric over the frame) */
    part('body', mb => { const S2 = stations(RW.x0, XC1, .01); if (S2.length > 1) { const R2 = S2.map(up); loft(mb, R2, M.FAB, false); } }, 40, fuseO);
    /* the frame: tubes 17 mm round along the window line, the roof edge, the posts and the windscreen's edges */
    const TR = .017;
    part('body', mb => {
      for (const sd of [1, -1]) { const at = (x, j) => { const r = ring(x); return r[sd > 0 ? j : mirrorI(j)]; };
        const line = (j, x0, x1, n = 40) => { const o = []; for (let k = 0; k <= n; k++) o.push(at(lerp(x0, x1, k / n), j)); return o; };
        tube(mb, line(iW, XWS, XC1), TR, 8, M.MET);                     // the window line
        tube(mb, line(iTop - 6, XWS - .02, XLE + .02, 30), TR * .9, 8, M.MET); // the windscreen's side edge
        tube(mb, line(iTop - 4, XLE, -.72, 30), TR, 8, M.MET);           // the roof edge under the wing
        for (const x of [XWS - .005, DOOR.x1, DOOR.x0, RW.x1, RW.x0 - .01]) { const r = ring(x), o = []; for (let j = iW; j <= iTop - 4; j++) o.push(r[sd > 0 ? j : mirrorI(j)]); tube(mb, o, x === DOOR.x0 || x === DOOR.x1 ? TR * 1.15 : TR, 8, M.MET); }
        /* a post up the middle of the quarter window, and the door window's divider (the cockpit picture's) */
        { const x = (XWS + DOOR.x1) / 2 + .05, r = ring(x), o = []; for (let j = iW; j <= iTop - 6; j++) o.push(r[sd > 0 ? j : mirrorI(j)]); tube(mb, o, TR * .7, 6, M.MET); }
        { const x = sd < 0 ? .40 : .30, r = ring(x), o = []; for (let j = iW; j <= iTop - 4; j++) o.push(r[sd > 0 ? j : mirrorI(j)]); tube(mb, o, TR * .55, 6, M.MET); }
      }
      /* the windscreen's foot and its centre bar, over the top */
      { const r = ring(XWS - .005), o = []; for (let j = iTop - 6; j <= iTop + 6; j++) o.push(r[j % NR]); tube(mb, o, TR, 8, M.MET); }
      { const o = []; for (let k = 0; k <= 30; k++) { const x = lerp(XWS - .01, XLE + .01, k / 30), r = ring(x); o.push(V.add(r[iTop], [0, .004, 0])); } tube(mb, o, TR * .7, 6, M.MET); }
    }, 45);
    /* the door's outline on the skin below the window line (a dark seam), its handle and hinges */
    part('body', mb => { const sd = -1, ln = (x, ja, jb) => { const r = ring(x), o = []; for (let j = ja; j >= jb; j--) o.push(V.add(r[mirrorI(j)], [0, 0, sd * .0015])); return o; };
      tube(mb, ln(DOOR.x1 - .005, iW, 3), .004, 5, M.BLK); tube(mb, ln(DOOR.x0 + .005, iW, 3), .004, 5, M.BLK);
      { const o = []; for (let k = 0; k <= 30; k++) { const r = ring(lerp(DOOR.x1, DOOR.x0, k / 30)); o.push(V.add(r[mirrorI(3)], [0, 0, sd * .0015])); } tube(mb, o, .004, 5, M.BLK); }
      const hp = ring(DOOR.x0 + .07)[mirrorI(iW - 2)];
      tube(mb, [V.add(hp, [.0, 0, -.012]), V.add(hp, [.02, 0, -.03]), V.add(hp, [.12, 0, -.03]), V.add(hp, [.14, 0, -.012])], .008, 8, M.POL);
      dome(mb, V.add(hp, [0, 0, -.004]), [0, 0, -1], .016, .006, M.POL, 10);
      for (const y of [-.25, .55]) { const r = ring(DOOR.x1 + .01); let b = r[0], bd = 9; for (const p of r) if (p[2] < 0 && Math.abs(p[1] - y) < bd) { bd = Math.abs(p[1] - y); b = p; }
        box(mb, V.add(b, [0, 0, -.006]), X, Y, Z, [.028, .035, .006], M.MET); cyl(mb, V.add(b, [.0, -.035, -.012]), V.add(b, [0, .035, -.012]), .007, .007, 8, M.POL); }
    }, 40);
    /* inside the back: the baggage bulkhead, dark */
    part('cabin', mb => { const r = ring(XC1 + .005), o = []; for (let j = iW; j <= mirrorI(iW) + NR; j++) o.push(r[j % NR]); cap(mb, o, M.FLOOR, [XC1 + .005, .35, 0]); }, 0);
  }

  /* =====================================================================================
     THE WING: NACA 4415 (flat-ish underneath and thick, like the bush planes' own), chord 1.22 m, 1 degree of
     dihedral, 2 of incidence, root 0.46 m out from the centre to the drooped red tips at 4.95 m (to 5.30). Slotted flaps (0.62 to
     3.28 m) and ailerons (3.33 to 4.84 m), 0.42 m chord, hung under the trailing edge on brackets. Vortex
     generators along the top at 9 per cent of the chord, rib tapes over every rib, top and bottom.
     The skylight between the roots: the wing's own top, in glass.
     ===================================================================================== */
  const WC = .22, WCH = 1.22, WINC = 2 * PI / 180, WDIH = 1 * PI / 180, ZR = .46, ZT = 4.95, ZTIP = 5.30;
  /* the airfoil: upper and lower surfaces, u from the leading edge 0 to the trailing edge 1 */
  function naca(u, m = .04, p = .4, t = .15) { const yt = 5 * t * (.2969 * Math.sqrt(u) - .126 * u - .3516 * u * u + .2843 * u * u * u - .1036 * u ** 4);
    const yc = u < p ? m / (p * p) * (2 * p * u - u * u) : m / ((1 - p) ** 2) * (1 - 2 * p + 2 * p * u - u * u), dy = u < p ? 2 * m / (p * p) * (p - u) : 2 * m / ((1 - p) ** 2) * (p - u), th = Math.atan(dy);
    return { up: [u - yt * Math.sin(th), yc + yt * Math.cos(th)], lo: [u + yt * Math.sin(th), yc - yt * Math.cos(th)] }; }
  const NAF = 46;   // points along each surface
  const AFU = []; for (let i = 0; i <= NAF; i++) { const s = i / NAF; AFU.push((1 - Math.cos(s * PI)) / 2); }
  /* the section as a closed loop: trailing edge along the top to the nose, back along the bottom (2*NAF points) */
  function afLoop(m = .04, t = .15) { const o = []; for (let i = NAF; i >= 0; i--) o.push(naca(AFU[i], m, .4, t).up); for (let i = 1; i < NAF; i++) o.push(naca(AFU[i], m, .4, t).lo); return o; }
  const AF = afLoop();
  const WYLE = .94;   // the root leading edge's height (the lower surface sits on the cabin roof, about 0.90)
  /* a point of the wing: chordwise u, its height in chords v, spanwise z (signed), with the tip's droop */
  function wingPt(a, z, ch = WCH, xle = XLE, dy = 0) { const az = Math.abs(z), x = xle - a[0] * ch * Math.cos(WINC) - a[1] * ch * Math.sin(WINC),
    y = WYLE - a[0] * ch * Math.sin(WINC) + a[1] * ch * Math.cos(WINC) + (az - ZR) * Math.tan(WDIH) + dy; return [x, y, z]; }
  D.wing = { xle: XLE, ch: WCH, yle: WYLE, zr: ZR, zt: ZT, ztip: ZTIP, pt: (u, v, z) => wingPt([u, v], z) };
  const wingO = p => { const az = Math.abs(p[2]); return [p[0], WYLE - .45 * WCH * Math.sin(WINC) + .03 + (az - ZR) * Math.tan(WDIH), p[2]]; };
  for (const sd of [1, -1]) {
    const zs = []; for (let k = 0; k <= 100; k++) zs.push(sd * lerp(ZR, ZT, k / 100));
    part('wing', mb => {
      const R = zs.map(z => AF.map(a => wingPt(a, z)));
      loft(mb, sd > 0 ? R : R.slice().reverse(), M.FAB, true);
      /* the root rib, closed against the cabin roof */
      cap(mb, R[0], M.FAB);
    }, 40, wingO);
    /* the tip: the section's chord drawn in to a rounded end, drooping down 0.14 m, red */
    part('wing', mb => {
      const R = []; const n = 22;
      for (let k = 0; k <= n; k++) { const s = k / n, e = .985 * s, cf = Math.pow(1 - Math.pow(e, 2.4), .42), xc = XLE - .44 * WCH, ch = WCH * cf, xle = xc + .44 * ch, dr = -.14 * s * s;
        const z = sd * lerp(ZT, ZTIP, e); const tk = .15 * (.55 + .45 * cf);
        R.push(afLoop(.04 * cf, tk).map(a => { const p = wingPt(a, z, ch, xle, dr); p[1] += (ZT - ZR) * Math.tan(WDIH) * 0 + (WCH - ch) * .04; return p; })); }
      loft(mb, sd > 0 ? R : R.slice().reverse(), M.MET2, true); cap(mb, R[R.length - 1], M.MET2);
      /* the nav light: red on the left, green on the right, a little lens at the tip's front */
      const p = wingPt([.06, .0], sd * (ZTIP - .06), WCH * .45, XLE - .44 * WCH + .44 * WCH * .45, -.12);
      ball(mb, p, .025, 10, sd < 0 ? M.NAVR : M.NAVG);
      /* screws round the tip's root */
      for (let i = 0; i < AF.length; i += 4) { const q = wingPt(AF[i], sd * (ZT + .012)); dome(mb, q, V.sub(q, wingO(q)), .005, .0025, M.BOLT, 6); }
    }, 50, p => { const q = wingO(p); q[1] -= .07; return q; });
    /* the rib tapes: a strip 22 mm wide, 1.5 mm proud, over every rib, top and bottom */
    part('wing', mb => {
      for (let z0 = ZR + .33; z0 < ZT - .05; z0 += .335) { const z = sd * z0;
        for (const [i0, i1] of [[0, NAF], [NAF, 2 * NAF - 1]]) { const strip = [[], []];
          for (let i = i0; i <= i1; i++) { const a = AF[i % AF.length]; for (let e = 0; e < 2; e++) { const zz = z + (e ? .011 : -.011), p = wingPt(a, zz), o = wingO(p), d = V.norm(V.sub(p, o)); strip[e].push(V.add(p, V.mul(d, .0015))); } }
          loft(mb, strip, M.TAPE, false); } }
    }, 50, wingO);
    /* the vortex generators: little fins at 9% of the chord, one every 0.26 m, toed out 15 degrees */
    part('wing', mb => {
      for (let z0 = ZR + .2; z0 < ZT - .05; z0 += .26) { const z = sd * z0, u = .09, a = naca(u).up, p = wingPt(a, z), nn = V.norm(V.sub(p, wingO(p)));
        const fwd = V.norm(V.sub(wingPt(naca(u - .02).up, z), wingPt(naca(u + .02).up, z))), toe = 15 * PI / 180 * sd;
        const f = V.norm([fwd[0] * Math.cos(toe), fwd[1], fwd[0] * Math.sin(toe)]), sdv = V.norm(V.cross(f, nn));
        box(mb, V.add(p, V.mul(nn, .002)), f, nn, sdv, [.022, .002, .007], M.ALU);
        const b = V.add(p, V.mul(f, .015)), t = V.add(p, V.mul(f, -.02)), tp = V.add(V.add(p, V.mul(f, -.015)), V.mul(nn, .028));
        for (const o of [-.0012, .0012]) { const of = V.mul(sdv, o); T3(mb, V.add(b, of), V.add(t, of), V.add(tp, of), M.ALU); T3(mb, V.add(b, of), V.add(tp, of), V.add(t, of), M.ALU); } }
    }, 0);
    /* the flaps and ailerons: their own pieces, each round its hinge */
    for (const [nm, z0, z1] of [['flap', .62, 3.28], ['aileron', 3.33, 4.84]]) {
      const key = nm + (sd > 0 ? 'R' : 'L'), ch = .42, AF2 = afLoop(0, .12), TEp = wingPt([1, naca(1).up[1]], sd * z0);
      const xle = XLE - WCH * Math.cos(WINC) + .10, yle = (zz) => WYLE - WCH * Math.sin(WINC) - .035 + (Math.abs(zz) - ZR) * Math.tan(WDIH);
      const sp = (a, zz) => [xle - a[0] * ch * Math.cos(WINC * 2) - a[1] * ch * Math.sin(WINC * 2), yle(zz) - a[0] * ch * Math.sin(WINC * 2) + a[1] * ch * Math.cos(WINC * 2), zz];
      part(key, mb => { const R = []; for (let k = 0; k <= 40; k++) { const zz = sd * lerp(z0, z1, k / 40); R.push(AF2.map(a => sp(a, zz))); }
        loft(mb, sd > 0 ? R : R.slice().reverse(), M.FAB, true); cap(mb, R[0], M.FAB); cap(mb, R[R.length - 1], M.FAB);
        /* its rib tapes */
        for (let zz0 = z0 + .3; zz0 < z1 - .05; zz0 += .335) { const st = [[], []]; for (let i = 0; i <= NAF; i++) for (let e = 0; e < 2; e++) { const p = sp(AF2[i], sd * zz0 + (e ? .01 : -.01)); st[e].push([p[0], p[1] + .0015, p[2]]); } loft(mb, st, M.TAPE, false); }
      }, 40, p => { const zz = p[2]; return [xle - .4 * ch, yle(zz) + .005, zz]; });
      /* the brackets it hangs on, from under the wing's trailing edge (fixed to the wing) */
      part('wing', mb => { const nb = nm === 'flap' ? 4 : 3; for (let k = 0; k < nb; k++) { const zz = sd * lerp(z0 + .15, z1 - .15, k / (nb - 1)), hp = sp([.22, 0], zz), wp = wingPt([.78, naca(.78).lo[1]], zz);
          const a = V.add(wp, [0, -.004, 0]), b = V.add(hp, [0, .01, 0]); box(mb, V.lerp(a, b, .5), V.norm(V.sub(b, a)), V.norm(V.cross(V.sub(b, a), Z)), Z, [V.len(V.sub(b, a)) / 2 + .01, .03, .004], M.MET);
          cyl(mb, V.add(hp, [0, 0, -.012]), V.add(hp, [0, 0, .012]), .007, .007, 8, M.BOLT); } }, 30);
      const hinge = sp([.22, 0], 0); D[key] = { hinge: [hinge[0], 0, 0], z: [sd * z0, sd * z1], axis: [0, 0, sd], yAt: zz => sp([.22, 0], zz)[1] };
    }
  }
  /* the skylight: the wing's top between the roots, glass, with two bars along it and one across */
  part('glass', mb => { const R = []; for (let k = 0; k <= 12; k++) { const z = lerp(-ZR, ZR, k / 12), o = []; for (let i = NAF - 2; i >= 3; i--) o.push(wingPt(naca(AFU[i]).up, z)); R.push(o); } loft(mb, R, M.GLASS, false); }, 0);
  part('wing', mb => { for (const z of [-.14, .14, -ZR + .01, ZR - .01]) { const o = []; for (let i = NAF - 2; i >= 3; i--) o.push(V.add(wingPt(naca(AFU[i]).up, z), [0, .006, 0])); tube(mb, o, .012, 6, M.MET); }
    for (const u of [.04, .5, .93]) { const o = []; for (let k = 0; k <= 12; k++) o.push(V.add(wingPt(naca(u).up, lerp(-ZR, ZR, k / 12)), [0, .006, 0])); tube(mb, o, .013, 6, M.MET); }
    /* the centre section's leading edge and trailing edge, metal, across the cabin */
    const le = []; for (let i = NAF - 6; i < NAF + 6; i++) le.push(i); const R = []; for (let k = 0; k <= 12; k++) { const z = lerp(-ZR, ZR, k / 12); R.push(AF.slice(NAF - 3, NAF + 5).map(a => V.add(wingPt(a, z), [0, 0, 0]))); }
    loft(mb, R, M.MET, false);
  }, 40);

  /* =====================================================================================
     THE STRUTS: front and rear lift struts each side, from a fitting on the lower longeron (x 0.40, y -0.74) out to
     the spars at 3.0 m; jury struts from 60% of the way up them to the wing at 2.1 m. Streamlined tube, 90 x 36 mm,
     painted; clevis fittings bolted at both ends (the close-up's).
     ===================================================================================== */
  const STREAM = []; for (let i = 0; i < 20; i++) { const a = i / 20 * TAU, c = Math.cos(a); STREAM.push([Math.sin(a) * .018 * (1 - .25 * c), (c > 0 ? c * .03 : c * .06)]); }
  const lowSurf = (u, z) => wingPt(naca(u).lo, z);
  for (const sd of [1, -1]) {
    const F = [.40, -.74, sd * .48], zA = sd * 3.0, FA = lowSurf(.20, zA), RA = lowSurf(.64, zA);
    D['strut' + (sd > 0 ? 'R' : 'L')] = { root: F, front: FA, rear: RA };
    part('body', mb => {
      for (const A of [FA, RA]) { const a = V.add(F, V.mul(V.norm(V.sub(A, F)), .06)), b = V.sub(A, V.mul(V.norm(V.sub(A, F)), .06)), path = []; for (let k = 0; k <= 24; k++) path.push(V.lerp(a, b, k / 24));
        sweep(mb, path, STREAM.map(q => [q[0] * (1 + .25 * Math.sin(PI * 0)), q[1]]), M.MET, X);
        /* the clevises: a forked block, its bolt through */
        for (const [e, o] of [[a, F], [b, A]]) { const d = V.norm(V.sub(e, o)), s = V.norm(V.cross(d, X)); box(mb, V.lerp(e, o, .45), d, s, V.cross(d, s), [.05, .013, .022], M.MET);
          cyl(mb, V.add(o, V.mul(s, -.02)), V.add(o, V.mul(s, .02)), .008, .008, 8, M.BOLT); for (const q of [-.022, .022]) cyl(mb, V.add(o, V.mul(s, q)), V.add(o, V.mul(s, q * 1.25)), .012, .012, 6, M.BOLT); } }
      /* the wing's fitting plates, under the spar (the close-up's), riveted */
      for (const A of [FA, RA]) { box(mb, V.add(A, [0, .004, 0]), X, Y, Z, [.07, .004, .05], M.MET); for (const dx of [-.055, -.02, .02, .055]) for (const dz of [-.035, .035]) dome(mb, V.add(A, [dx, -.0005, dz]), [0, -1, 0], .005, .003, M.BOLT, 6); }
      /* the fuselage's fitting */
      box(mb, F, X, Y, Z, [.06, .03, .02], M.MET); cyl(mb, V.add(F, [0, 0, -.03]), V.add(F, [0, 0, .03]), .009, .009, 8, M.BOLT);
      /* the jury struts: from halfway up each lift strut to the wing at 1.8 m; and the brace between them */
      for (const [A, u] of [[FA, .22], [RA, .62]]) { const m0 = V.lerp(F, A, .6), w = lowSurf(u, sd * 2.1), path = [m0, V.lerp(m0, w, .5), w];
        sweep(mb, [m0, V.lerp(m0, w, .33), V.lerp(m0, w, .66), V.sub(w, [0, .02, 0])], STREAM.map(q => [q[0] * .6, q[1] * .55]), M.MET, X);
        box(mb, V.sub(w, [0, .01, 0]), X, Y, Z, [.035, .006, .025], M.MET); box(mb, m0, X, Y, Z, [.03, .02, .02], M.MET); }
      { const a = V.lerp(F, FA, .6), b = V.lerp(F, RA, .6); tube(mb, [a, b], .008, 6, M.MET); }
    }, 40);
  }

  /* =====================================================================================
     THE GEAR: tube legs in a V from the fuselage's belly to each axle, a shock strut with a coil spring, the
     tundra tires (0.92 m, 0.40 m wide) on small hubs, disc brakes inboard. Track 2.50 m, axle at x 0.98, y -1.33.
     ===================================================================================== */
  const AX = .98, AY = -1.33, TW = 1.25, TR_ = .46, TWD = .40;
  D.gear = { x: AX, y: AY, track: TW * 2, R: TR_, W: TWD, ground: AY - TR_ };
  for (const sd of [1, -1]) {
    const hub = [AX, AY, sd * TW], axIn = [AX, AY, sd * 1.02];
    part('body', mb => {
      const legF = [.90, -.70, sd * .44], legR = [.30, -.84, sd * .40], shk = [.62, -.86, sd * .10], shkB = [AX - .02, AY + .08, sd * .96];
      for (const a of [legF, legR]) { const b = axIn, path = []; for (let k = 0; k <= 12; k++) path.push(V.lerp(a, b, k / 12)); sweep(mb, path, STREAM.map(q => [q[0] * 1.15, q[1] * .9]), M.MET, X); box(mb, a, X, Y, Z, [.045, .025, .03], M.MET); }
      /* the axle fitting: a block and the axle itself */
      box(mb, axIn, X, Y, Z, [.06, .06, .05], M.MET); cyl(mb, axIn, V.add(hub, [0, 0, -sd * .06]), .03, .03, 12, M.STEEL);
      /* the shock strut: a cylinder, its chrome rod, the coil round it, a boot */
      const sA = shk, sB = shkB, d = V.norm(V.sub(sB, sA)), L = V.len(V.sub(sB, sA));
      cyl(mb, sA, V.add(sA, V.mul(d, L * .55)), .028, .028, 12, M.MET); cyl(mb, V.add(sA, V.mul(d, L * .5)), sB, .013, .013, 10, M.POL);
      const [u, w] = frameOf(d), coil = []; for (let k = 0; k <= 160; k++) { const t = k / 160, q = t * 9 * TAU; coil.push(V.add(V.add(sA, V.mul(d, L * (.56 + .38 * t))), V.add(V.mul(u, Math.cos(q) * .036), V.mul(w, Math.sin(q) * .036)))); }
      tube(mb, coil, .0065, 6, M.STEEL); for (const e of [sA, sB]) ball(mb, e, .026, 10, M.MET);
      /* the brake line down the front leg */
      const bl = []; for (let k = 0; k <= 16; k++) bl.push(V.add(V.lerp(legF, axIn, k / 16), [.025, 0, 0])); bl.push(V.add(hub, [.05, .04, -sd * .14])); tube(mb, bl, .004, 5, M.BLK, false);
    }, 40);
    /* the wheel (it turns): tyre, hub, bolts; the brake (it doesn't): disc and caliper */
    const wk = 'wheel' + (sd > 0 ? 'R' : 'L');
    part(wk, mb => {
      /* the tire's profile, bead to bead over the crown (radius, axial), with five circumferential grooves in the crown */
      const prof = [], rimR = .155, hw = TWD / 2, rc = (rimR + TR_) / 2, ar = (TR_ - rimR) / 2, be = Math.asin(.075 / hw), n = 72, ne = 2.7;
      const sp = (v, e) => Math.sign(v) * Math.pow(Math.abs(v), e);
      for (let k = 0; k <= n; k++) { const th = lerp(-(PI - be), PI - be, k / n); let r = rc + ar * sp(Math.cos(th), 2 / ne), ax = hw * sp(Math.sin(th), 2 / ne);
        if (Math.cos(th) > .35) for (let g = -2; g <= 2; g++) { const d = Math.abs(ax - g * .058); if (d < .006) r -= .007 * (1 - d / .006); }
        prof.push([r, ax]); }
      const TRD = k => { const th = lerp(-(PI - be), PI - be, (k + .5) / n); return Math.cos(th) > .2 ? M.TREAD : M.WALL; };
      rev(mb, prof.map(p => [p[0], p[1] * sd]), hub, [0, 0, 1], 144, null, 0, TAU, TRD);
      /* the hub: two aluminium halves, a bolt ring, the centre cap */
      const hp = [[rimR, hw * .62], [rimR + .012, hw * .58], [rimR + .006, hw * .45], [.11, hw * .38], [.07, hw * .32], [.045, hw * .40], [0, hw * .42]];
      rev(mb, hp.map(p => [p[0], p[1] * sd]), hub, [0, 0, 1], 48, M.ALU);
      for (let k = 0; k < 8; k++) { const a = k / 8 * TAU, c = V.add(hub, [Math.cos(a) * .095, Math.sin(a) * .095, sd * hw * .36]); cyl(mb, c, V.add(c, [0, 0, sd * .018]), .009, .009, 6, M.BOLT); }
      rev(mb, [[.14, -hw * .55], [.12, -hw * .52], [.08, -hw * .5], [0, -hw * .5]].map(p => [p[0], p[1] * sd]), hub, [0, 0, 1], 40, M.ALU);
    }, 40, p => [hub[0], hub[1], sd * TW]);
    D[wk] = { hub, R: TR_, W: TWD };
    part('brake' + (sd > 0 ? 'R' : 'L'), mb => {
      const c = V.add(hub, [0, 0, -sd * (TWD / 2 * .55 + .02)]); cyl(mb, V.add(c, [0, 0, -.004]), V.add(c, [0, 0, .004]), .12, .12, 40, M.ROTOR);
      box(mb, V.add(c, [.07, .07, 0]), V.norm([1, -1, 0]), V.norm([1, 1, 0]), Z, [.04, .03, .025], M.CAST);
      for (const q of [-.015, .015]) cyl(mb, V.add(c, [.07 + q, .07 + q, -.03]), V.add(c, [.07 + q, .07 + q, .03]), .006, .006, 6, M.BOLT);
    }, 35);
  }
  /* the tailwheel: three leaves of spring from the tail's belly, a fork on a pivot, a small solid tire, the
     steering chains and springs up to the rudder's horns */
  const TWX = -4.30, TWY = -1.06, TWR = .14;
  D.tailwheel = { hub: [TWX, TWY, 0], R: TWR, ground: TWY - TWR };
  part('body', mb => {
    const a = [-3.70, -.585, 0], b = [-4.16, -.86, 0];
    for (let k = 0; k < 3; k++) { const L = 1 - k * .18, p = []; for (let i = 0; i <= 12; i++) { const t = i / 12 * L, q = V.lerp(a, b, t); q[1] += -.012 * k - .03 * Math.sin(PI * t); p.push(q); }
      sweep(mb, p, [[-.025, -.006], [.025, -.006], [.025, .006], [-.025, .006]], M.STEEL, Z); }
    box(mb, a, X, Y, Z, [.05, .02, .035], M.MET); for (const q of [-.25, .55]) box(mb, V.lerp(a, b, q < 0 ? .3 : .55), X, Y, Z, [.012, .03, .03], M.STEEL);
    /* the pivot and the steering arms */
    cyl(mb, [b[0] - .02, b[1] + .03, 0], [b[0] - .02, b[1] - .07, 0], .022, .022, 12, M.STEEL); box(mb, [b[0], b[1] - .02, 0], X, Y, Z, [.012, .01, .09], M.STEEL);
    for (const sd of [1, -1]) { const s = [b[0], b[1] - .02, sd * .085], e = [-4.07, -.58, sd * .11]; const ch = []; for (let k = 0; k <= 10; k++) { const q = V.lerp(s, e, k / 10); q[1] -= .025 * Math.sin(PI * k / 10); ch.push(q); }
      tube(mb, ch.slice(0, 5), .004, 5, M.STEEL); const sp = []; const L5 = V.lerp(s, e, .45), d = V.norm(V.sub(e, L5)), [u, w] = frameOf(d), Ls = V.len(V.sub(e, L5)); for (let k = 0; k <= 80; k++) { const t = k / 80, q = t * 16 * TAU; sp.push(V.add(V.add(L5, V.mul(d, Ls * t)), V.add(V.mul(u, Math.cos(q) * .008), V.mul(w, Math.sin(q) * .008)))); }
      tube(mb, sp, .0022, 4, M.STEEL); }
  }, 40);
  part('tailwheel', mb => {
    const c = [TWX, TWY, 0];
    rev(mb, [[.07, -.035], [.12, -.038], [.135, -.032], [TWR, -.02], [TWR + .002, 0], [TWR, .02], [.135, .032], [.12, .038], [.07, .035]], c, Z, 48, M.WALL);
    rev(mb, [[.07, -.034], [.05, -.03], [.03, -.04], [0, -.04]], c, Z, 24, M.ALU); rev(mb, [[.07, .034], [.05, .03], [.03, .04], [0, .04]], c, Z, 24, M.ALU);
    /* the fork */
    for (const sd of [1, -1]) box(mb, [TWX + .05, TWY + .09, sd * .055], V.norm([.45, 1, 0]), V.norm([-1, .45, 0]), Z, [.12, .02, .007], M.STEEL);
    box(mb, [TWX + .1, TWY + .2, 0], X, Y, Z, [.03, .015, .065], M.STEEL); cyl(mb, [TWX, TWY, -.065], [TWX, TWY, .065], .012, .012, 8, M.BOLT);
  }, 35, [TWX, TWY, 0]);

  /* =====================================================================================
     THE TAIL: a braced stabiliser (span 3.5 m, half-elliptical tips) and split elevator; the fin and the rudder, red, the
     rudder hung on the tail post with the horn and the cables. A thin symmetric section built slice by slice.
     ===================================================================================== */
  /* a thin lifting surface from slices: each slice {s: spanwise, le, te, t}; at(s, x, h) places a point (x along
     the chord, h off the mid-plane) */
  function thinSurf(mb, slices, at, m, capEnds = true) { const NA = 18, R = [];
    for (const sl of slices) { const o = [], ch = sl.le - sl.te; for (let i = NA; i >= 0; i--) { const u = (1 - Math.cos(i / NA * PI)) / 2, tk = sl.t * ch * 5 * (.2969 * Math.sqrt(u) - .126 * u - .3516 * u * u + .2843 * u ** 3 - .1036 * u ** 4); o.push(at(sl.s, sl.le - u * ch, tk)); }
      for (let i = 1; i < NA; i++) { const u = (1 - Math.cos(i / NA * PI)) / 2, tk = sl.t * ch * 5 * (.2969 * Math.sqrt(u) - .126 * u - .3516 * u * u + .2843 * u ** 3 - .1036 * u ** 4); o.push(at(sl.s, sl.le - u * ch, -tk)); } R.push(o); }
    loft(mb, R, m); if (capEnds) { cap(mb, R[0], m); cap(mb, R[R.length - 1], m); } return R; }
  /* the stabiliser and elevators: hinge at x -3.98, the stab ahead of it, the elevator behind (to -4.45); y 0.0 */
  const SY = .0, SLE = -3.20, SHX = -3.98, STE = -4.45, SSP = 1.65;
  const SSP2 = 1.75, STR = .62, scx = (SLE + STE) / 2, sch = (SLE - STE) / 2;
  const stabHalf = s => s <= SSP2 - STR ? sch : sch * Math.sqrt(Math.max(0, 1 - Math.pow((s - (SSP2 - STR)) / STR, 2)));
  const stabLE = s => scx + stabHalf(s) + .03 * Math.min(1, s / 1.2), stabTE = s => scx - stabHalf(s);
  for (const sd of [1, -1]) {
    const atH = (s, x, h) => [x, SY + h, sd * s];
    part('stab', mb => { const sl = []; for (let k = 0; k <= 36; k++) { const s = lerp(.05, SSP2 - .004, 1 - Math.pow(1 - k / 36, 1.6)), le = stabLE(s), te = Math.max(stabTE(s), SHX - .008);
        if (le - te > .015) sl.push({ s, le, te, t: .08 }); }
      thinSurf(mb, sl, atH, M.FAB); }, 40, p => [p[0], SY, p[2]]);
    part('elev' + (sd > 0 ? 'R' : 'L'), mb => { const sl = []; for (let k = 0; k <= 30; k++) { const s = lerp(.11, SSP2, 1 - Math.pow(1 - k / 30, 1.5)), te = stabTE(s);
        if (SHX - .012 - te > .015) sl.push({ s, le: SHX - .012, te, t: .09 }); }
      thinSurf(mb, sl, atH, M.FAB); }, 40, p => [p[0], SY, p[2]]);
    /* the bracing wires: under it to the tail's belly, over it to the fin */
    part('body', mb => { const sp = [-3.62, SY - .01, sd * .95], st = [-3.62, SY + .01, sd * .95];
      tube(mb, [V.add(sp, [0, -.004, 0]), [-3.80, -.55, sd * .05]], .0028, 5, M.CABLE); tube(mb, [V.add(sp, [-.05, -.004, 0]), [-3.95, -.57, sd * .04]], .0028, 5, M.CABLE);
      tube(mb, [V.add(st, [0, .004, 0]), [-3.78, .72, sd * .012]], .0028, 5, M.CABLE); tube(mb, [V.add(st, [-.06, .004, 0]), [-3.95, .70, sd * .012]], .0028, 5, M.CABLE);
      for (const e of [sp, st, [-3.80, -.55, sd * .05], [-3.78, .72, sd * .012]]) ball(mb, e, .009, 6, M.STEEL); }, 30);
  }
  D.elev = { hinge: [SHX, SY, 0], axis: [0, 0, 1] };
  /* the fin: from the deck's top at x -3.08 up to the rounded top (x -4.0, y 1.33); the rudder behind the post at
     x -4.05 down to y -0.55, its trailing edge curving out to x -4.60 */
  const RHX = -4.05;
  const finLE = mono([[.0, -3.10], [.25, -3.30], [.55, -3.60], [.85, -3.84], [1.10, -3.96], [1.27, -4.03]]);
  const rudTE = mono([[-.56, -4.47], [-.3, -4.55], [.2, -4.60], [.6, -4.60], [.95, -4.53], [1.18, -4.40], [1.31, -4.20], [1.345, -4.05]]);
  const atV = (s, x, h) => [x, s, h];
  part('fin', mb => { const sl = []; for (let k = 0; k <= 26; k++) { const y = lerp(-.07, 1.25, k / 26); sl.push({ s: y, le: finLE(y), te: RHX + .01, t: .085 }); }
    thinSurf(mb, sl.filter(q => q.le - q.te > .02), atV, M.FAB2);
    /* its top, rounded: the leading edge curving over to the post */
    const tsl = []; for (let k = 0; k <= 8; k++) { const y = lerp(1.25, 1.335, k / 8); tsl.push({ s: y, le: lerp(finLE(1.25), RHX + .02, Math.pow(k / 8, 2)), te: RHX + .01, t: .085 }); }
    thinSurf(mb, tsl.filter(q => q.le - q.te > .01), atV, M.FAB2); }, 45, p => [p[0], p[1], 0]);
  part('rudder', mb => { const sl = []; for (let k = 0; k <= 34; k++) { const y = lerp(-.56, 1.34, k / 34); sl.push({ s: y, le: RHX - .01, te: Math.min(rudTE(y), RHX - .03), t: .10 }); }
    thinSurf(mb, sl, atV, M.FAB2);
    /* the horns at its foot and the cables' eyes */
    for (const sd of [1, -1]) { box(mb, [-4.10, -.58, sd * .07], X, Y, Z, [.05, .012, .045], M.STEEL); ball(mb, [-4.07, -.58, sd * .11], .008, 6, M.STEEL); } }, 45, p => [p[0], p[1], 0]);
  D.rudder = { hinge: [RHX, 0, 0], axis: [0, 1, 0] };
  /* the hinges along the post (fixed), and the tail light on top of the rudder */
  part('body', mb => { for (const y of [-.45, .05, .55, 1.05]) { box(mb, [RHX, y, 0], X, Y, Z, [.018, .022, .02], M.STEEL); cyl(mb, [RHX, y - .025, 0], [RHX, y + .025, 0], .006, .006, 6, M.BOLT); }
    for (const sd of [1, -1]) { const p = [SHX + .02, SY + .01, sd * .5]; box(mb, p, X, Y, Z, [.012, .015, .015], M.STEEL); } }, 30);
  part('rudder', mb => { ball(mb, [-4.56, .05, 0], .02, 8, M.NAVW); }, 30);
  part('fin', mb => { cyl(mb, [RHX, -.58, 0], [RHX, 1.33, 0], .021, .021, 14, M.MET2); ball(mb, [RHX, 1.33, 0], .021, 10, M.MET2); }, 50);
  part('stab', mb => { cyl(mb, [SHX, SY, -(SSP2 - .2)], [SHX, SY, SSP2 - .2], .013, .013, 12, M.FAB); }, 50);
  /* the fin's and stabiliser's rib tapes, as the wing's (the tail picture's) */
  part('fin', mb => { for (let y = .1; y < 1.2; y += .17) for (const sd of [1, -1]) { const st = [[], []]; for (let e = 0; e < 2; e++) for (let k = 0; k <= 12; k++) { const x = lerp(finLE(y + (e ? .01 : -.01)) - .01, RHX + .02, k / 12), u = (finLE(y) - x) / (finLE(y) - RHX); const tk = .085 * (finLE(y) - RHX) * 5 * (.2969 * Math.sqrt(clamp(u, 0, 1)) - .126 * u - .3516 * u * u + .2843 * u ** 3 - .1036 * u ** 4);
        st[e].push([x, y + (e ? .01 : -.01), sd * (tk + .0015)]); } loft(mb, sd > 0 ? st : st.slice().reverse(), M.TAPE2, false); } }, 50);

  /* =====================================================================================
     THE PROP (it turns, about x): two metal blades, 2.3 m across, flat-faced, twisted from 34 degrees at the root
     to 12 at the tip, black tips; the spinner, polished, and its back plate.
     ===================================================================================== */
  const PX = 2.17, PR = 1.15; D.prop = { hub: [PX, 0, 0], R: PR, axis: [1, 0, 0] };
  part('prop', mb => {
    for (const bs of [1, -1]) { const R = []; const NS = 40;
      for (let k = 0; k <= NS; k++) { const r = lerp(.12, PR, k / NS), t = (r - .12) / (PR - .12), ch = (.11 + .08 * Math.sin(PI * Math.min(1, t * 1.25)) - .05 * t) * (t > .93 ? Math.sqrt(Math.max(.02, 1 - Math.pow((t - .93) / .07, 2))) : 1), th = lerp(34, 12, Math.sqrt(t)) * PI / 180, tk = lerp(.16, .07, t);
        const sec = afLoop(.03, tk).map(a => { const cx = (a[0] - .35) * ch, cy = a[1] * ch; return [PX + cy * Math.cos(th) - cx * Math.sin(th), (cx * Math.cos(th) + cy * Math.sin(th)) * bs, bs * r]; });
        R.push(sec); }
      loft(mb, bs > 0 ? R : R.slice().reverse(), null, true, (i) => i >= NS - 4 ? M.TIPBLK : M.ALU); cap(mb, R[R.length - 1], M.TIPBLK); }
  }, 40, p => [PX, 0, p[2]]);
  part('prop', mb => {
    const sp = []; for (let k = 0; k <= 16; k++) { const t = k / 16; sp.push([.175 * Math.pow(1 - t, .55) * (1 - .1 * t), t * .30]); } sp.push([0, .30]);
    rev(mb, sp, [PX - .07, 0, 0], X, 48, M.POL); rev(mb, [[.19, -.01], [.19, .01], [.175, .01]], [PX - .07, 0, 0], X, 48, M.ALU);
  }, 50, [PX, 0, 0]);

  /* =====================================================================================
     THE EXHAUST: two pipes from under the cowl's chin, turned down and back (the front view's pair)
     ===================================================================================== */
  part('body', mb => { for (const sd of [1, -1]) { const p = [[1.92, -.50, sd * .11], [1.90, -.60, sd * .115], [1.82, -.70, sd * .12], [1.66, -.76, sd * .12], [1.50, -.79, sd * .12]];
      const rings = tube(mb, p, .028, 14, M.EXH, false); const e = rings[rings.length - 1]; const inner = e.map(q => V.lerp(q, p[p.length - 1], .25)); loft(mb, [e, inner], M.EXH); cap(mb, inner, M.BLK); } }, 40);

  /* =====================================================================================
     THE ENGINE (under the cowl, seen with it off): a flat four, its finned barrels and heads, rocker covers, the
     ignition leads with red boots, the magnetos at the back, the alternator, the sump and the carburettor, the
     headers down to the two pipes, the mount tubes back to the firewall.
     ===================================================================================== */
  part('engine', mb => {
    const ec = [1.80, -.06, 0];
    sbox(mb, ec, X, Y, Z, [.20, .12, .12], .45, M.CAST, 14);                       // the crankcase
    sbox(mb, [1.78, -.25, 0], X, Y, Z, [.18, .07, .10], .5, M.CAST, 10);           // the sump
    cyl(mb, [1.98, -.02, 0], [2.08, -.02, 0], .075, .075, 24, M.CAST); cyl(mb, [2.08, 0, 0], [2.11, 0, 0], .14, .14, 32, M.STEEL);   // the nose and the prop flange
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; cyl(mb, [2.11, Math.cos(a) * .10, Math.sin(a) * .10], [2.125, Math.cos(a) * .10, Math.sin(a) * .10], .012, .012, 6, M.BOLT); }
    for (const [x, sd] of [[1.90, 1], [1.68, 1], [1.84, -1], [1.62, -1]]) {
      const b0 = [x, -.03, sd * .12], b1 = [x, -.03, sd * .27], hd = [x, -.03, sd * .31];
      cyl(mb, b0, b1, .052, .052, 20, M.CAST, false);
      for (let f = 0; f < 13; f++) { const z = lerp(.14, .265, f / 12); cyl(mb, [x, -.03, sd * z], [x, -.03, sd * (z + .0035)], .078, .078, 24, M.CAST); }   // the barrel's fins
      sbox(mb, hd, X, Y, Z, [.078, .078, .04], .55, M.CAST, 10);                     // the head
      for (let f = 0; f < 7; f++) { const y = -.095 + f * .02; box(mb, [x, y, sd * .315], X, Y, Z, [.082, .003, .048], M.CAST); }
      sbox(mb, [x, .05, sd * .32], X, Y, Z, [.068, .026, .032], .4, M.POL, 10);      // the rocker cover
      for (const q of [-.03, .03]) dome(mb, [x + q, .076, sd * .32], Y, .006, .004, M.BOLT, 6);
      /* plugs and leads: two a cylinder, red boots, back to the magnetos */
      for (const py of [.02, -.085]) { const pl = [x - .02, py, sd * .355]; cyl(mb, V.sub(pl, [0, 0, sd * .01]), V.add(pl, [0, 0, sd * .025]), .01, .01, 8, M.REDBOOT);
        const lead = [V.add(pl, [0, 0, sd * .025]), V.add(pl, [-.03, .05, sd * .035]), [x - .1, .14, sd * .2], [1.56, .12, sd * .08]]; tube(mb, lead, .0052, 6, M.RUB, false); }
      /* the intake tube from the sump, the header down to the pipes */
      tube(mb, [[x, -.22, sd * .08], [x, -.16, sd * .18], [x - .02, -.10, sd * .26]], .015, 8, M.ALU, false);
      tube(mb, [[x + .03, -.10, sd * .29], [x + .06, -.24, sd * .27], [x + .05, -.40, sd * .18], [1.92, -.50, sd * .11]], .02, 10, M.EXH, false);
    }
    /* the magnetos, the alternator, the carburettor and its air box, the oil filter */
    for (const sd of [1, -1]) cyl(mb, [1.58, .10, sd * .07], [1.50, .10, sd * .07], .04, .04, 14, M.BLK);
    cyl(mb, [2.00, -.17, .13], [1.92, -.17, .13], .055, .055, 18, M.ALU); for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; box(mb, [1.96, -.17 + Math.cos(a) * .056, .13 + Math.sin(a) * .056], X, Y, Z, [.035, .004, .004], M.ALU); }
    sbox(mb, [1.70, -.36, 0], X, Y, Z, [.06, .05, .06], .5, M.ALU, 10); sbox(mb, [1.78, -.44, 0], X, Y, Z, [.10, .03, .09], .3, M.BLK, 10);
    cyl(mb, [1.55, -.15, -.10], [1.48, -.15, -.10], .045, .045, 14, M.REDBOOT);
    /* the mount: tubes from the crankcase's back to the firewall's corners */
    for (const [y, z] of [[.18, .32], [.18, -.32], [-.48, .30], [-.48, -.30]]) for (const e of [[1.62, .06 * Math.sign(y), z * .35], [1.62, -.12, z * .3]]) tube(mb, [e, [XFW + .01, y, z]], .011, 8, M.MET);
    /* the firewall: a plate the cowl closes onto */
    { const r = ring(XFW); cap(mb, r.map(p => [XFW + .004, p[1], p[2] * .98]), M.MET); }
  }, 35, p => [1.78, -.06, 0]);

  /* =====================================================================================
     THE CABIN INSIDE: the floor, two seats one behind the other (brown leather on tube frames, belts), the stick,
     the rudder pedals, the panel of three round gauges and three switches, the frame's diagonals behind the glass.
     ===================================================================================== */
  part('cabin', mb => {
    const fy = -.70; box(mb, [.0, fy - .02, 0], X, Y, Z, [1.12, .006, .36], M.FLOOR);
    for (const [sx, k] of [[.32, 1], [-.62, .9]]) {
      /* the frame: tubes for legs and the base */
      for (const sz of [-.18, .18]) { tube(mb, [[sx + .14, fy, sz], [sx + .12, fy + .28, sz], [sx - .14, fy + .30, sz], [sx - .22, fy + .02, sz]], .011, 6, M.MET); tube(mb, [[sx - .14, fy + .30, sz], [sx - .24, fy + .86, sz]], .011, 6, M.MET); }
      tube(mb, [[sx + .12, fy + .28, -.18], [sx + .12, fy + .28, .18]], .011, 6, M.MET);
      /* the cushion and the back, pleated */
      sbox(mb, [sx, fy + .36, 0], X, Y, Z, [.20, .06, .21], .35, M.SEAT, 14);
      const ba = 12 * PI / 180, bc = [sx - .20, fy + .66, 0], bx = [Math.sin(ba), Math.cos(ba), 0], bn = [Math.cos(ba), -Math.sin(ba), 0];
      sbox(mb, bc, bn, bx, Z, [.06, .32, .21], .35, M.SEAT, 14);
      for (let q = -3; q <= 3; q++) { const c0 = V.add(bc, V.add(V.mul(bn, .058), [0, 0, q * .055])); box(mb, c0, bn, bx, Z, [.004, .28, .004], M.SEAT); }
      /* the lap belt */
      for (const sz of [-.19, .19]) box(mb, [sx - .1, fy + .42, sz * .9], V.norm([1, .5, 0]), V.norm([-.5, 1, 0]), Z, [.13, .003, .025], M.BELT);
      box(mb, [sx + .02, fy + .43, 0], X, Y, Z, [.035, .006, .045], M.POL);
    }
    /* the stick, its boot, the pedals */
    tube(mb, [[.62, fy, 0], [.62, fy + .2, 0], [.60, fy + .62, 0]], .011, 8, M.BLK); tube(mb, [[.60, fy + .58, 0], [.60, fy + .74, 0]], .018, 10, M.BLK); sbox(mb, [.62, fy + .04, 0], X, Y, Z, [.05, .04, .05], .6, M.RUB, 8);
    for (const sz of [-.12, .12]) { box(mb, [.98, fy + .14, sz], V.norm([1, .5, 0]), V.norm([-.5, 1, 0]), Z, [.006, .08, .045], M.STEEL); for (let r = 0; r < 4; r++) box(mb, [.99 - .01 * r, fy + .09 + r * .03, sz], V.norm([1, .5, 0]), V.norm([-.5, 1, 0]), Z, [.007, .004, .042], M.ALU); tube(mb, [[1.03, fy + .02, sz], [.99, fy + .14, sz]], .009, 6, M.STEEL); }
    /* the panel: a black board across the cabin, three gauges in chrome bezels, three switches */
    const PXp = 1.12; { const o = []; for (let k = 0; k <= 20; k++) { const a = PI * k / 20; o.push([PXp, .05 + .20 * Math.sin(a) * .5 + .14, -Math.cos(a) * .38]); } o.push([PXp, .02, .38], [PXp, .02, -.38]); cap(mb, o, M.DASH, [PXp, .14, 0]); }
    for (const [gz, gr] of [[-.17, .045], [0, .055], [.17, .045]]) { const c = [PXp - .006, .20, gz]; rev(mb, [[gr + .008, 0], [gr + .008, -.008], [gr, -.01], [gr, -.004]], c, [-1, 0, 0], 32, M.POL); cyl(mb, V.add(c, [.002, 0, 0]), V.add(c, [-.001, 0, 0]), gr, gr, 32, M.GAUGE);
      for (let t = 0; t < 12; t++) { const a = t / 12 * TAU; box(mb, [c[0] - .002, c[1] + Math.cos(a) * gr * .82, c[2] + Math.sin(a) * gr * .82], X, V.norm([0, Math.cos(a), Math.sin(a)]), V.norm([0, -Math.sin(a), Math.cos(a)]), [.001, gr * .1, .0015], M.WHITE); }
      box(mb, [c[0] - .003, c[1] + gr * .3, c[2] + gr * .2], X, V.norm([0, .83, .55]), V.norm([0, -.55, .83]), [.001, gr * .45, .0018], M.WHITE); }
    for (const sz of [-.06, 0, .06]) { cyl(mb, [PXp - .004, .08, sz], [PXp - .02, .08, sz], .008, .008, 8, M.POL); tube(mb, [[PXp - .02, .08, sz], [PXp - .05, .095, sz]], .003, 6, M.POL); }
    /* the frame's diagonals, inside the glass (as the cockpit picture's) */
    for (const sd of [1, -1]) { const at = (x, y) => [x, y, sd * (fw(x) - .03)];
      tube(mb, [at(.95, YW(.95)), at(.42, .86)], .012, 6, M.MET); tube(mb, [at(-.38, YW(-.38)), at(-.90, .85)], .012, 6, M.MET); tube(mb, [at(1.25, -.62), at(.95, YW(.95))], .012, 6, M.MET); tube(mb, [at(-.38, -.7), at(-1.15, -.05)], .012, 6, M.MET); }
    for (const x of [.48, -.7]) tube(mb, [[x, .86, -.42], [x, .87, .42]], .013, 6, M.MET);
  }, 35);
  /* where the pilot sits: the front seat, the eye 0.75 m over the cushion */
  D.eye = [.36, -.70 + .42 + .70, 0];

  /* =====================================================================================
     numbers to place the moving parts, and how many triangles each piece has
     ===================================================================================== */
  const tris = {}; let total = 0; for (const [k, mb] of Object.entries(P)) { tris[k] = mb.m.length / 3; total += tris[k]; }
  D.tris = tris; D.total = total; D.name = 'Redtail'; D.version = 'redtail-1';
  return { pieces: P, info: D };
}
if (typeof module !== 'undefined') module.exports = { redtailBuild };
