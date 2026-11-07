window.RTT = (() => {
  const D = __dyb, G = () => D.GAME, car = () => D.GAME.car, MPH = 2.23694, R2 = __rt2;
  const drive = (inp, secs, dt = 1 / 120, each) => { D.setTestInput(inp); const n = Math.round(secs / dt);
    for (let i = 0; i < n; i++) { D.step(dt); if (each && each(i * dt + dt) === false) break; } };
  const place = (x, z, yaw) => { D.placeCar(x, z, yaw); drive({ steer: 0, thr: 0, brk: 1, hb: 1, nos: false }, 2); };
  const pos = () => { const p = car().p; return [p[0], p[2]]; };
  const yawOf = () => { const M = car().M; return Math.atan2(-M[6], M[0]); };
  const pitchDeg = () => +(Math.asin(car().M[3]) * 180 / Math.PI).toFixed(2);
  const whole = () => { const t = car(); return [t.p, t.v, t.w, t.q].every(a => Array.from(a).every(Number.isFinite)); };
  const SPOT = { road: [-3000, 1.8], lake: [-3000, -150], sand: [-3000, 8] };
  const info = () => { const t = car(); return { rt: !!t.rt, mph: +(t.speed * MPH).toFixed(1), rpm: Math.round(t.pt.rpm), whole: whole(), pitch: pitchDeg(),
    contact: t.wheels.map(w => w.contact ? 1 : 0).join(''), surf: t.wheels.map(w => w.surf).join(','), y: +t.p[1].toFixed(3), place: G().place, st: t.pt.st }; };
  function accel(where, secs) { const [x, z] = SPOT[where]; place(x, z, 0); const p0 = pos(), out = [];
    drive({ steer: 0, thr: 1, brk: 0, hb: 0, nos: false }, secs, 1 / 120, tt => { if (Math.abs(tt - Math.round(tt)) < 1e-6) out.push(+(car().speed * MPH).toFixed(1)); });
    const p1 = pos(); return { where, mphEachSecond: out, metres: +Math.hypot(p1[0] - p0[0], p1[1] - p0[1]).toFixed(0), end: info() }; }
  function brake(where, mph) { const [x, z] = SPOT[where]; place(x, z, 0);
    drive({ steer: 0, thr: 1, brk: 0, hb: 0, nos: false }, 60, 1 / 120, () => car().speed * MPH < mph);
    const p0 = pos(), v0 = car().speed * MPH; let tb = 0, maxPitch = -99;
    drive({ steer: 0, thr: 0, brk: 1, hb: 0, nos: false }, 30, 1 / 120, tt => { tb = tt; maxPitch = Math.max(maxPitch, -pitchDeg()); return car().speed > .3; });
    const p1 = pos(); return { where, from: +v0.toFixed(1), stopMetres: +Math.hypot(p1[0] - p0[0], p1[1] - p0[1]).toFixed(1), secs: +tb.toFixed(1), noseDownMaxDeg: +maxPitch.toFixed(1), end: info() }; }
  function turn(where, mph, steer) { const [x, z] = SPOT[where]; place(x, z, 0);
    drive({ steer: 0, thr: 1, brk: 0, hb: 0, nos: false }, 60, 1 / 120, () => car().speed * MPH < mph);
    const y0 = yawOf(); drive({ steer, thr: .45, brk: 0, hb: 0, nos: false }, 3);
    let dy = yawOf() - y0; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
    return { where, mph, steer, turnedDegIn3s: +(dy * 180 / Math.PI).toFixed(0), end: info() }; }
  return {
    fly() { document.getElementById('rtFly').click(); return { st: G().state, ...info() }; },
    info, place, drive,
    ready() { return { st: G().state, built: !!R2.RT.mesh, tex: R2.RT.texN, tris: R2.RT.tris, ...info() }; },
    run(name) {
      if (name === 'rest') { place(...SPOT.road, 0); return { rest: info(), hcg: R2.RT.hcg, a: R2.RT.a, b: R2.RT.b, th0deg: R2.RT.th0 * 180 / Math.PI }; }
      if (name === 'accel') return { road: accel('road', 10), lake: accel('lake', 10), sand: accel('sand', 8) };
      if (name === 'brake') return { road: brake('road', 30), lake: brake('lake', 30) };
      if (name === 'turn') return { right: turn('road', 15, 1), left: turn('road', 15, -1), lakeR: turn('lake', 15, 1) };
      if (name.startsWith('pose:')) { const [x, z, yaw, mph] = name.slice(5).split('_').map(Number); place(x, z, yaw);
        if (mph) drive({ steer: 0, thr: 1, brk: 0, hb: 0, nos: false }, 40, 1 / 120, () => car().speed * MPH < mph);
        D.setTestInput({ steer: 0, thr: mph ? .5 : 0, brk: mph ? 0 : 1, hb: 0, nos: false }); return info(); }
      if (name.startsWith('cam:')) { const i = D.CAMS.indexOf(name.slice(4).replace(/-/g, ' ')); D.CAM.over = null; D.camPick(i); return { cam: i }; }
      if (name.startsWith('look:')) { const [ex, ey, ez, ax, ay, az, fov] = name.slice(5).split('_').map(Number); const t = car();
        const w = (x, y, z) => [t.p[0] + t.M[0] * x + t.M[1] * y + t.M[2] * z, t.p[1] + t.M[3] * x + t.M[4] * y + t.M[5] * z, t.p[2] + t.M[6] * x + t.M[7] * y + t.M[8] * z];
        D.CAM.over = { eye: w(ex, ey, ez), at: w(ax, ay, az), fov: fov || .8 }; return { ok: 1 }; }
      if (name === 'dbg') { const t = car(); D.placeCar(-3000, 1.8, 0); const bad = o => Object.entries(o).filter(([k, v]) => typeof v === 'number' && !Number.isFinite(v)).map(([k]) => k);
        D.setTestInput({ steer: 0, thr: 0, brk: 1, hb: 1, nos: false });
        for (let i = 0; i < 400; i++) { D.step(1 / 240);
          const pt = t.pt, w = t.wheels.map(x => bad(x)), b1 = bad(pt), arr = { p: t.p, v: t.v, w: t.w, q: t.q };
          const ba = Object.entries(arr).filter(([k, a]) => !Array.from(a).every(Number.isFinite)).map(([k]) => k);
          if (ba.length || b1.length || w.some(x => x.length)) return { step: i, arrays: ba, pt: b1, wheels: w, st: pt.st, gear: pt.gear, drv: pt.drv, Te: pt.Te, we: pt.we, engage: pt.engage }; }
        return { ok: 'no NaN in 400 steps', ...info() }; }
      if (name === 'tex') { const g = __game.gl, P = __game.P_LAND, T = R2.RT.tex, o = {};
        o.keys = Object.keys(P.u || {}).filter(k => /RT|Tex|Probe|CSM/.test(k)); o.locs = {};
        for (const k of ['uRTa', 'uRTn', 'uRTo', 'uTex']) { const l = g.getUniformLocation(P.p, k); o.locs[k] = l ? g.getUniform(P.p, l) : null; }
        const fb = g.createFramebuffer(); g.bindFramebuffer(g.FRAMEBUFFER, fb); o.px = {};
        for (const k of ['a', 'n', 'o']) { g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, T[k], 0); const b = new Uint8Array(4); g.readPixels(1024, 1024, 1, 1, g.RGBA, g.UNSIGNED_BYTE, b); o.px[k] = Array.from(b); }
        g.bindFramebuffer(g.FRAMEBUFFER, null); g.deleteFramebuffer(fb); o.pu = P.u && P.u.uRTa; return o; }
      if (name === 'drivecar') { document.getElementById('sasDrive').click(); return { st: G().state, ...info() }; }
      if (name === 'flow') { const o = {}; R2.reset(); o.afterReset = info();
        D.openMenu(false); o.menu = G().state; document.getElementById('sasDrive').click(); o.backToCar = { st: G().state, rt: !!car().rt, build: car().build.id.slice(0, 12) };
        D.openMenu(false); document.getElementById('rtFly').click(); o.planeAgain = { st: G().state, rt: !!car().rt }; return o; }
      if (name === 'dsp') return R2.dsp();
      if (name === 'car') { D.CAM.over = null; R2.rtFly(false); return info(); }
      if (name === 'plane') { R2.rtFly(true); return info(); }
      return { unknown: name };
    }
  };
})();
