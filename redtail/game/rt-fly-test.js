window.RTF_T = (() => {
  const D = __dyb, car = () => D.GAME.car, R2 = __rt2, F = R2.RTF, MPH = 2.23694, FT = 3.281, th = R2.RT.th0, c0 = Math.cos(th), s0 = Math.sin(th);
  const pitchA = () => { const M = car().M; return Math.asin(M[3] * c0 + M[4] * s0); };
  const bank = () => Math.atan2(-car().M[5], car().M[4]);
  const hdg = () => { const M = car().M, fx = M[0] * c0 + M[1] * s0, fz = M[6] * c0 + M[7] * s0; return Math.atan2(-fz, fx); };
  const st = () => { const t = car(); return { mph: +(F.V * MPH).toFixed(1), alt: +(F.alt * FT).toFixed(0), fpm: Math.round(F.vs * 196.85), aoa: +(F.alpha * 57.3).toFixed(1),
    pitch: +(pitchA() * 57.3).toFixed(1), bank: +(bank() * 57.3).toFixed(1), air: !!t.air, rpm: Math.round(R2.RT.eng.rpm), stall: +F.stall.toFixed(2), warn: F.warn, up: +t.M[4].toFixed(2),
    whole: [t.p, t.v, t.w].every(a => Array.from(a).every(Number.isFinite)) }; };
  const IN = { steer: 0, thr: 0, brk: 0, hb: 0, nos: false, elev: 0, flap: 0 };
  const run = (secs, each, dt = 1 / 120) => { D.setTestInput(IN); const n = Math.round(secs / dt); for (let i = 0; i < n; i++) { D.step(dt); if (each && each(i * dt + dt) === false) return i * dt; } return secs; };
  const level = k => { const t = car(), w = t.w, M = t.M, pr = w[0] * M[0] + w[1] * M[3] + w[2] * M[6]; IN.steer = Math.max(-1, Math.min(1, -(bank() - (k || 0)) * 2.2 - pr * .5)); };
  const pitchRate = () => { const t = car(), w = t.w, M = t.M; return w[0] * M[2] + w[1] * M[5] + w[2] * M[8]; };
  const holdV = vt => { IN.elev = Math.max(-1, Math.min(1, (F.V - vt) * .09 - pitchRate() * .9)); };
  const holdVS = (vs) => { IN.elev = Math.max(-1, Math.min(1, (vs - F.vs) * .12 - pitchRate() * .9)); };
  const place = (x, z, yaw) => { D.placeCar(x, z, yaw); IN.thr = 0; IN.brk = 1; IN.elev = 0; IN.steer = 0; run(2); IN.brk = 0; };
  const inAir = (alt, mph, yaw = 0) => { place(-3000, -150, yaw); const t = car(); t.p[1] += alt; const V = mph / MPH; t.v[0] = Math.cos(yaw) * V; t.v[2] = -Math.sin(yaw) * V; t.v[1] = 0; t.w.fill(0); t.air = true; t.airT = 1; };
  return {
    st,
    takeoff(flap = 1) { place(-3200, 1.8, 0); IN.flap = flap; IN.thr = 1; const t = car(), x0 = t.p[0]; const o = { flap }; let tailT = null, lift = null, clear = null;
      run(40, tt => { const s = st();
        if (F.V * MPH < 22) IN.elev = 0; else if (!tailT) IN.elev = -.7; 
        if (!tailT && pitchA() < (th - 4 / 57.3)) { tailT = { t: +tt.toFixed(1), mph: s.mph, m: +(t.p[0] - x0).toFixed(0) }; IN.elev = 0; }
        if (tailT && !lift && F.V * MPH > 44) IN.elev = .45;
        if (!lift && t.air && F.alt > .4) { lift = { t: +tt.toFixed(1), mph: s.mph, m: +(t.p[0] - x0).toFixed(0) }; }
        if (lift) { holdV(60 / MPH); level(0); }
        if (lift && !clear && F.alt > 15.24) { clear = { t: +tt.toFixed(1), m: +(t.p[0] - x0).toFixed(0), mph: s.mph }; return false; } });
      o.tailUp = tailT; o.liftoff = lift; o.clear50ft = clear; IN.flap = 0;
      const a0 = F.alt; run(20, () => { holdV(65 / MPH); level(0); }); o.climbAt65mph_fpm = Math.round((F.alt - a0) / 20 * 196.85); o.after = st(); return o; },
    cruise() { inAir(300, 90); IN.thr = 1; IN.flap = 0; const a0 = F.alt; run(70, () => { IN.elev = Math.max(-1, Math.min(1, -F.vs * .1 - (F.alt - a0) * .02 - pitchRate() * .9)); level(0); }); return { fullThrottleLevel: st() }; },
    trim() { inAir(300, 75); IN.thr = .6; IN.flap = 0; IN.elev = 0; const tr = []; run(40, tt => { level(0); IN.elev = 0; if (Math.abs(tt % 5) < 1e-6) tr.push([+(F.V * MPH).toFixed(0), Math.round(F.vs * 196.85)]); }); return { handsOff60pct_mph_fpm_every5s: tr, end: st() }; },
    stall(flap = 0) { inAir(400, 70); IN.thr = 0; IN.flap = flap; run(8, () => { level(0); holdVS(0); }); const o = { flap }; let warn = null, brk = null, minV = 99, alt0 = F.alt, maxDrop = 0, nose = 0;
      run(40, tt => { level(0); if (!brk) { IN.elev = Math.min(1, IN.elev + .0025); holdVSAdd(); } else IN.elev = 1;
        const s = st(); minV = Math.min(minV, s.mph); if (!warn && F.warn) warn = { mph: s.mph, aoa: s.aoa }; if (!brk && F.stall > .5) { brk = { mph: s.mph, aoa: s.aoa, t: +tt.toFixed(1) }; alt0 = F.alt; }
        if (brk) { maxDrop = Math.max(maxDrop, (alt0 - F.alt) * FT); nose = Math.min(nose, s.pitch); if (tt - brk.t > 6) return false; } });
      function holdVSAdd() { IN.elev = Math.max(IN.elev, Math.min(1, (0 - F.vs) * .12 - pitchRate() * .9)); }
      o.horn = warn; o.breaks = brk; o.minMph = +minV.toFixed(1); o.noseDropMinPitchDeg = nose; o.altLostFt6s = Math.round(maxDrop);
      IN.elev = 0; run(10, () => { level(0); holdV(70 / MPH); }); o.recovered = st(); return o; },
    turn() { inAir(300, 75); IN.thr = .75; IN.flap = 0; run(5, () => { level(0); holdVS(0); }); const h0 = hdg(), a0 = F.alt;
      run(20, () => { level(45 / 57.3); holdVS(0); }); let dh = hdg() - h0; return { bank45_deg_per_s: +Math.abs(dh * 57.3 / 20 % 360).toFixed(1), raw: +(dh * 57.3).toFixed(0), altChangeFt: Math.round((F.alt - a0) * FT), end: st() }; },
    roll() { inAir(300, 75); IN.thr = .7; run(3, () => { level(0); holdVS(0); }); IN.steer = 1; let t90 = null; run(4, tt => { IN.steer = 1; if (!t90 && bank() > 90 / 57.3) { t90 = +tt.toFixed(2); return false; } }); return { fullAileronTo90deg_s: t90, end: st() }; },
    land() { inAir(60, 65); IN.thr = .15; IN.flap = 2; const o = {}; let td = null, maxG = 0;
      run(60, tt => { level(0); const t = car();
        if (!td) { if (F.alt > 3) { holdV(55 / MPH); IN.elev = Math.min(IN.elev, Math.max(-1, (-3.5 - F.vs) * .15 - pitchRate() * .9 + .2)); } else { IN.thr = 0; holdVS(-.6); }
          if (t.wheels.some(w => w.contact)) td = { mph: +(F.V * MPH).toFixed(1), fpm: Math.round(F.vs * 196.85), pitch: +(pitchA() * 57.3).toFixed(1), t: +tt.toFixed(1), x: t.p[0] }; }
        else { IN.elev = .6; IN.thr = 0; IN.brk = F.V * MPH < 30 ? 1 : 0; if (F.V < .5) return false; } });
      o.touchdown = td; o.stop = st(); o.rolloutM = td ? +(car().p[0] - td.x).toFixed(0) : null; IN.brk = 0; return o; },
    pose(alt, mph, bankDeg, flap) { inAir(alt, mph); IN.thr = .7; IN.flap = flap | 0; run(3, () => { level(bankDeg / 57.3); holdVS(0); }); IN.steer = 0; D.setTestInput(Object.assign({}, IN, { steer: Math.max(-1, Math.min(1, bankDeg / 90)) * .2 })); return st(); },
    noseover() { place(-3000, 1.8, 0); IN.brk = 1; IN.thr = 1; IN.elev = -1; let mx = 0; run(8, () => { mx = Math.max(mx, -pitchA() * 57.3); }); const o = { fullPowerFullForwardOnBrakes_minPitchDeg: +(-mx).toFixed(1), end: st() }; IN.elev = 0; IN.thr = 0; return o; },
    stickTest() { const r = document.getElementById('rtStick').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, shown: !document.getElementById('rtStick').hidden, tilt: !document.getElementById('rtTilt').hidden, flaps: document.getElementById('tLow').textContent, gas: document.querySelector('#tGas span').textContent }; },
    groundPose() { place(-3000, 1.8, 0); IN.thr = 0; IN.brk = 1; D.setTestInput(IN); return st(); },
  };
})();
RTF_T.clip = async (mode) => { const D = __dyb, R = __rt2, t = D.GAME.car, pt = t.pt, v = D.GAME.voice;
  await R.audio(); const A = R.ENG().audio; await A.ctx.resume();
  v.port.post({ t: 'cfg', cfg: R.SIM.dspCfg(mode === 'old' ? R.oldSpec() : t.spec) }); R.RTS.vol = mode === 'old' ? 0 : 1; R.RT.clip = true; pt.st = 'run';
  const dest = A.ctx.createMediaStreamDestination(); A.comp.connect(dest);
  const rec = new MediaRecorder(dest.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 160000 }), ch = []; rec.ondataavailable = e => ch.push(e.data);
  rec.start(); const t0 = performance.now();
  await new Promise(res => { const iv = setInterval(() => { const s = (performance.now() - t0) / 1000; if (s > 13) { clearInterval(iv); res(); return; }
    let thr, rpm, V; if (s < 2.5) { thr = 0; rpm = 750; V = 0; } else if (s < 4) { const k = (s - 2.5) / 1.5; thr = k; rpm = 750 + 1700 * k; V = 0; }
    else if (s < 8.5) { const k = (s - 4) / 4.5; thr = 1; V = 35 * k; rpm = 2450 + 5.5 * V; } else if (s < 11) { thr = 1; V = 35 + 8 * (s - 8.5) / 2.5; rpm = Math.min(2800, 2450 + 5.5 * V); }
    else { thr = 0; V = 40; rpm = Math.max(1100, 2650 - (s - 11) * 900); }
    if (mode === 'old') rpm = Math.min(rpm, 2350);
    R.RT.eng.rpm = rpm; R.RT.eng.thr = thr; R.RTF.V = V; pt.rpm = rpm; pt.we = rpm * Math.PI * 2 / 60; pt.thr = thr; pt.thrSnd = thr; pt.load = thr; pt._out();
    v.port.post({ t: 'p', p: pt.soundParams(0, V, { dist: 3, pan: 0, rear: .6 }) }); R.rtSound(true); }, 25); });
  rec.stop(); await new Promise(r => rec.onstop = r); R.RT.clip = false; R.RTS.vol = 1;
  const u8 = new Uint8Array(await new Blob(ch).arrayBuffer()); let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
  return { kind: A.kind, worklet: A.worklet, rate: A.ctx.sampleRate, b64: btoa(s) }; };
RTF_T.adbg = async () => { const R = __rt2; await R.audio(); const E = R.ENG(), A = E.audio; await A.ctx.resume();
  const o = { state: A.ctx.state, vol: E.vol, master: A.master.gain.value, eng: A.eng.gain.value, t0: A.ctx.currentTime };
  const dest = A.ctx.createMediaStreamDestination(), osc = A.ctx.createOscillator(); osc.connect(dest); osc.start();
  const rec = new MediaRecorder(dest.stream), ch = []; rec.ondataavailable = e => ch.push(e.data); rec.start(); await new Promise(r => setTimeout(r, 1500)); rec.stop(); await new Promise(r => rec.onstop = r);
  o.t1 = A.ctx.currentTime; o.bytes = (await new Blob(ch).arrayBuffer()).byteLength; o.voice = { port: !!__dyb.GAME.voice.port, asleep: __dyb.GAME.voice.asleep, node: !!__dyb.GAME.voice.node };
  const an = A.ctx.createAnalyser(); A.master.connect(an); const buf = new Float32Array(2048); await new Promise(r => setTimeout(r, 300)); an.getFloatTimeDomainData(buf); o.masterRms = Math.sqrt(buf.reduce((a, b) => a + b * b, 0) / buf.length);
  return o; };
RTF_T.nosedbg = (pitch) => { const D = __dyb, t = D.GAME.car, out = []; D.placeCar(-3000, 1.8, 0); const IN = { steer: 0, thr: 0, brk: 1, hb: 0, nos: false, elev: 0 }; D.setTestInput(IN);
  for (let i = 0; i < 240; i++) D.step(1 / 120); IN.thr = 1; IN.elev = pitch;
  for (let i = 1; i <= 600; i++) { D.step(1 / 120); if (i % 60 === 0) out.push([+(i / 120).toFixed(1), +(t.speed * 2.237).toFixed(1), +(Math.asin(t.M[3]) * 57.3).toFixed(1), t.wheels.map(w => +w.w.toFixed(1)).join('/'), t.pt.hold ? 'H' : '', t.rev ? 'R' : '', +__rt2.RTF.ctl.e.toFixed(2), Math.round(__rt2.RTF.T)]); }
  return out; };
