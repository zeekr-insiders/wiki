/* Handover checklist celebrations. handover.js fires zi-hc:section-done once
 * a finished section has folded away; this plays a short effect themed to that section,
 * and a bigger finale when every item is ticked. Everything draws on one fixed
 * canvas with pointer-events: none, created on demand and removed as soon as
 * the last particle is gone, so it never blocks taps or scrolling. Reduced
 * motion gets a static check badge instead, and print gets nothing. Listens on
 * document, so it survives instant navigation without re-initialising.
 */
(function () {
  var TAU = Math.PI * 2;
  var REFIRE_MS = 10000; // untick then retick inside this window stays quiet
  var MAX_PARTS = 700;
  var fired = {};

  var canvas = null;
  var ctx = null;
  var raf = 0;
  var last = 0;
  var W = 0;
  var H = 0;
  var parts = [];
  var sprites = [];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(list) { return list[(Math.random() * list.length) | 0]; }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  // Fade a hex colour to transparent without passing through grey or black.
  function clear(hex) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex);
    return m ? 'rgba(' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) + ',0)' : 'rgba(0,0,0,0)';
  }
  function easeOut(t) { t = clamp(t); return 1 - Math.pow(1 - t, 3); }
  function easeIn(t) { t = clamp(t); return t * t * t; }
  function easeBack(t) { t = clamp(t) - 1; return 1 + 2.7 * t * t * t + 1.7 * t * t; }
  // Full strength, then fade out over the tail of the life.
  function fade(p, from) { return p < from ? 1 : 1 - (p - from) / (1 - from); }

  function reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function printing() {
    return window.matchMedia && window.matchMedia('print').matches;
  }

  // Club colours from zeekr.css, so light and dark both read well.
  function palette() {
    var cs = getComputedStyle(document.body);
    function v(name, fallback) { return cs.getPropertyValue(name).trim() || fallback; }
    var dark = document.body.getAttribute('data-md-color-scheme') === 'slate';
    var c = {
      orange: v('--zeekr-orange', '#FF5A00'),
      gold: v('--hue-gold-solid', '#E6B237'),
      plum: dark ? v('--hue-plum-ink', '#DDA6C4') : v('--hue-plum-solid', '#7C1D50'),
      slate: v('--hue-slate-solid', '#9DA2A5'),
      cream: v('--zeekr-cream', '#FFFBF3'),
      ink: v('--ink', '#1A1A1A'),
      panel: v('--panel', '#FFFFFF'),
      dark: dark
    };
    c.mix = dark ? [c.orange, c.gold, c.plum, c.cream] : [c.orange, c.gold, c.plum, c.slate];
    return c;
  }

  /* ---- Engine: particles with simple physics, plus scripted sprites. ---- */

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function start() {
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'zi-cheer-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize, { passive: true });
    }
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    parts = [];
    sprites = [];
    if (canvas) {
      window.removeEventListener('resize', resize);
      canvas.remove();
      canvas = ctx = null;
    }
  }

  // A sprite runs draw(ctx, progress, sprite) each frame for `life` seconds,
  // after an optional delay; step() lets it emit particles as it goes.
  function sprite(life, draw, opts) {
    var s = { life: life, age: -((opts && opts.delay) || 0), draw: draw, step: opts && opts.step };
    sprites.push(s);
    return s;
  }

  function part(o) {
    if (parts.length >= MAX_PARTS) return;
    o.age = 0;
    o.vx = o.vx || 0;
    o.vy = o.vy || 0;
    o.g = o.g || 0;
    o.drag = o.drag === undefined ? 1 : o.drag;
    o.rot = o.rot === undefined ? rand(0, TAU) : o.rot;
    o.vr = o.vr || 0;
    o.wob = rand(0, TAU);
    o.wobs = o.wobs || rand(6, 12);
    parts.push(o);
  }

  function burst(x, y, n, o) {
    for (var i = 0; i < n; i++) {
      var a = o.angle !== undefined ? o.angle + rand(-o.spread, o.spread) : rand(0, TAU);
      var sp = rand(o.speed[0], o.speed[1]);
      part({
        x: x, y: y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        g: o.g, drag: o.drag,
        life: rand(o.life[0], o.life[1]),
        size: rand(o.size[0], o.size[1]),
        vr: rand(-8, 8),
        color: pick(o.colors),
        shape: o.shape
      });
    }
  }

  function starPath(x, r, points, inner) {
    x.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var rr = i % 2 ? r * inner : r;
      var a = (i / (points * 2)) * TAU - Math.PI / 2;
      x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    x.closePath();
  }

  function drawPart(x, p, t) {
    x.save();
    x.globalAlpha = fade(t, p.fadeFrom || 0.65);
    x.translate(p.x, p.y);
    x.fillStyle = p.color;
    x.strokeStyle = p.color;
    switch (p.shape) {
      case 'rect': // confetti flutters by squashing on one axis
        x.rotate(p.rot);
        x.scale(1, Math.cos(p.wob));
        x.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
        break;
      case 'star':
        x.rotate(p.rot);
        starPath(x, p.size, 5, 0.45);
        x.fill();
        break;
      case 'twinkle': // grows then shrinks, like a glint
        var k = Math.sin(t * Math.PI);
        x.scale(k, k);
        starPath(x, p.size, 4, 0.22);
        x.fill();
        break;
      case 'spark':
        x.lineWidth = p.size;
        x.lineCap = 'round';
        x.beginPath();
        x.moveTo(0, 0);
        x.lineTo(-p.vx * 0.045, -p.vy * 0.045);
        x.stroke();
        break;
      case 'orb':
        var gr = x.createRadialGradient(0, 0, 0, 0, 0, p.size);
        gr.addColorStop(0, p.color);
        gr.addColorStop(1, clear(p.color));
        x.globalAlpha *= 0.75;
        x.fillStyle = gr;
        x.beginPath();
        x.arc(0, 0, p.size, 0, TAU);
        x.fill();
        break;
      case 'ribbon': // a party streamer: a short wavy line that curls as it falls
        x.rotate(p.rot);
        x.lineWidth = 3;
        x.lineCap = 'round';
        x.beginPath();
        for (var i = 0; i <= 10; i++) {
          var yy = (i / 10 - 0.5) * p.size;
          var xx = Math.sin(p.wob + i * 0.9) * 5;
          if (i) x.lineTo(xx, yy); else x.moveTo(xx, yy);
        }
        x.stroke();
        break;
      default: // dot
        x.beginPath();
        x.arc(0, 0, p.size, 0, TAU);
        x.fill();
    }
    x.restore();
  }

  function tick(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    ctx.clearRect(0, 0, W, H);

    sprites = sprites.filter(function (s) {
      s.age += dt;
      if (s.age < 0) return true;
      var p = s.age / s.life;
      if (p >= 1) return false;
      if (s.step) s.step(dt, p, s);
      if (s.draw) {
        ctx.save();
        s.draw(ctx, p, s);
        ctx.restore();
      }
      return true;
    });

    parts = parts.filter(function (p) {
      p.age += dt;
      var t = p.age / p.life;
      if (t >= 1) return false;
      var k = Math.pow(p.drag, dt);
      p.vx *= k;
      p.vy *= k;
      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.wob += p.wobs * dt;
      drawPart(ctx, p, t);
      return true;
    });

    if (!parts.length && !sprites.length) {
      stop();
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  /* ---- One effect per section, anchored to its summary row. ---- */

  function rectOf(el) { return el.getBoundingClientRect(); }

  // handover.js folds the section and brings its heading into view first, so
  // this is the heading; the ticked item is only a fallback if it can't be.
  function anchorFor(sec, item) {
    var sum = sec.querySelector('summary');
    var r = rectOf(sum);
    var bar = sec.closest('.zi-hc-phase');
    bar = bar && bar.querySelector('.zi-hc-progress');
    var top = bar ? rectOf(bar).bottom : 0;
    return (r.top >= top && r.bottom <= window.innerHeight) || !item ? sum : item;
  }

  var effects = {
    // Charging apps: a level-up. "1UP" pops over the count and a balloon floats off.
    'pre-apps': function (sec, c, a) {
      var sum = a;
      var count = a.querySelector('.zi-hc-section__count') || a;
      sprite(1.8, function (x, p) {
        var r = rectOf(sum);
        var bx = Math.min(r.right, W) - 44 + Math.sin(p * TAU * 1.2) * 8;
        var by = r.top + r.height / 2 - easeOut(p) * 260;
        x.globalAlpha = fade(p, 0.7);
        x.strokeStyle = c.ink;
        x.lineWidth = 1.2;
        x.beginPath();
        x.moveTo(bx, by + 24);
        x.bezierCurveTo(bx - 7, by + 36, bx + 7, by + 46, bx - 2, by + 62);
        x.stroke();
        x.fillStyle = c.orange;
        x.beginPath();
        x.moveTo(bx - 4, by + 26);
        x.lineTo(bx + 4, by + 26);
        x.lineTo(bx, by + 19);
        x.fill();
        x.beginPath();
        x.ellipse(bx, by, 17, 21, 0, 0, TAU);
        x.fill();
        x.fillStyle = 'rgba(255,255,255,0.55)';
        x.beginPath();
        x.ellipse(bx - 6, by - 8, 3.5, 7, -0.5, 0, TAU);
        x.fill();
      });
      sprite(1.3, function (x, p) {
        var r = rectOf(count);
        var s = easeBack(p / 0.25);
        x.globalAlpha = fade(p, 0.55);
        x.translate(r.left + r.width / 2, r.top - 8 - easeOut(p) * 46);
        x.scale(s, s);
        x.font = '800 24px "Space Grotesk", system-ui, sans-serif';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.lineJoin = 'round';
        x.lineWidth = 5;
        x.strokeStyle = c.panel;
        x.strokeText('1UP', 0, 0);
        x.fillStyle = c.orange;
        x.fillText('1UP', 0, 0);
      });
    },

    // Car, app and paperwork: a spray of spinning stars.
    'pre-prep': function (sec, c, a) {
      var r = rectOf(a);
      burst(r.left + r.width * 0.3, r.top + r.height / 2, 22, {
        speed: [160, 380], g: 260, drag: 0.35, life: [1.1, 1.6], size: [5, 10],
        colors: [c.gold, c.gold, c.orange, c.plum], shape: 'star'
      });
      burst(r.left + r.width * 0.7, r.top + r.height / 2, 12, {
        speed: [120, 300], g: 260, drag: 0.35, life: [1, 1.5], size: [4, 8],
        colors: [c.gold, c.orange], shape: 'star'
      });
    },

    // Home charging: an arc of electricity and a shower of sparks.
    'pre-plan': function (sec, c, a) {
      var sum = a;
      var r = rectOf(sum);
      var pts = [];
      for (var i = 0; i <= 9; i++) pts.push([i / 9, rand(-1, 1)]);
      sprite(0.6, function (x, p) {
        var rr = rectOf(sum);
        var y = rr.top + rr.height / 2;
        x.globalAlpha = fade(p, 0.3);
        x.lineJoin = 'round';
        x.lineCap = 'round';
        [[7, c.gold, 0.35], [2.5, c.dark ? c.cream : c.orange, 1]].forEach(function (pass) {
          x.lineWidth = pass[0];
          x.strokeStyle = pass[1];
          x.globalAlpha = fade(p, 0.3) * pass[2];
          x.beginPath();
          pts.forEach(function (pt, j) {
            var px = rr.left + 16 + pt[0] * (rr.width - 64) * easeOut(p / 0.25);
            var py = y + (j && j < 9 ? pt[1] * 12 : 0);
            if (j) x.lineTo(px, py); else x.moveTo(px, py);
          });
          x.stroke();
        });
      });
      var sx = r.right - 40;
      var sy = r.top + r.height / 2;
      burst(sx, sy, 34, {
        angle: -Math.PI / 2, spread: 1.3, speed: [180, 460], g: 900, drag: 0.6,
        life: [0.6, 1.1], size: [1.5, 2.8], colors: [c.gold, c.orange, c.gold, c.dark ? c.cream : c.gold], shape: 'spark'
      });
    },

    // Paperwork: party streamers popping up from both ends of the row.
    'paper': function (sec, c, a) {
      var r = rectOf(a);
      [[r.left + 8, -1.1], [r.right - 8, -2.05]].forEach(function (end) {
        for (var i = 0; i < 9; i++) {
          var a = end[1] + rand(-0.3, 0.3);
          var sp = rand(380, 620);
          part({
            x: end[0], y: r.bottom, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            g: 520, drag: 0.25, life: rand(1.4, 1.8), size: rand(26, 40), vr: rand(-3, 3),
            color: pick(c.mix), shape: 'ribbon', wobs: rand(5, 9)
          });
        }
        burst(end[0], r.bottom, 10, {
          angle: end[1], spread: 0.4, speed: [250, 520], g: 520, drag: 0.3,
          life: [1.2, 1.7], size: [6, 9], colors: c.mix, shape: 'rect'
        });
      });
    },

    // Exterior: a polish shine sweeps across the card, leaving glints.
    'ext': function (sec, c, a) {
      sprite(1.0, function (x, p) {
        var r = rectOf(sec);
        var top = Math.max(r.top, 0);
        var bottom = Math.min(r.bottom, H);
        if (bottom <= top) return;
        x.beginPath();
        x.rect(r.left, top, r.width, bottom - top);
        x.clip();
        var band = 90;
        var cx = r.left - band + (r.width + band * 2) * easeOut(p);
        var g = x.createLinearGradient(cx - band, 0, cx + band, 0);
        var shine = c.dark ? 'rgba(255,251,243,0.28)' : 'rgba(255,255,255,0.85)';
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.5, shine);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = g;
        x.transform(1, 0, -0.35, 1, 0, 0); // lean the band like light on paint
        x.fillRect(cx - band + top * 0.35 - 40, top, band * 2 + (bottom - top) * 0.35 + 80, bottom - top);
      }, {
        step: function (dt, p) {
          if (p > 0.9 || Math.random() > dt * 28) return;
          var r = rectOf(sec);
          var x = r.left + (r.width + 180) * easeOut(p) - 90 + rand(-30, 30);
          var y = rand(Math.max(r.top, 0), Math.min(r.top + 160, r.bottom));
          part({ x: x, y: y, life: rand(0.6, 0.9), size: rand(6, 12), rot: 0, color: pick([c.gold, c.orange, c.dark ? c.cream : c.gold]), shape: 'twinkle', fadeFrom: 1 });
        }
      });
    },

    // Interior: the ambient light strip glows along the row and soft lights drift up.
    'int': function (sec, c, a) {
      var sum = a;
      sprite(1.7, function (x, p) {
        var r = rectOf(sum);
        var w = (r.width - 16) * easeOut(p / 0.4);
        var g = x.createLinearGradient(r.left, 0, r.right, 0);
        g.addColorStop(0, c.orange);
        g.addColorStop(0.5, c.plum);
        g.addColorStop(1, c.gold);
        x.globalAlpha = fade(p, 0.6);
        x.shadowColor = c.orange;
        x.shadowBlur = 14;
        x.fillStyle = g;
        x.fillRect(r.left + 8, r.bottom - 4, w, 3);
      });
      var r = rectOf(sum);
      for (var i = 0; i < 14; i++) {
        part({
          x: rand(r.left + 10, r.right - 10), y: r.bottom - rand(0, 10),
          vx: rand(-15, 15), vy: rand(-140, -60), g: -20, drag: 0.7,
          life: rand(1.2, 1.7), size: rand(8, 18), color: pick([c.orange, c.plum, c.gold]), shape: 'orb', fadeFrom: 0.4
        });
      }
    },

    // In the box: a box pops its lid and the goodies spring out.
    'box': function (sec, c, a) {
      var sum = a;
      var r0 = rectOf(sum);
      sprite(1.5, function (x, p) {
        var r = rectOf(sum);
        var bx = r.right - 92;
        var by = r.top + r.height / 2 + 4;
        var s = easeBack(p / 0.2);
        x.globalAlpha = fade(p, 0.7);
        x.translate(bx, by);
        x.scale(s, s);
        x.fillStyle = c.gold;
        x.fillRect(-14, -8, 28, 20);
        x.fillStyle = c.orange;
        x.fillRect(-3, -8, 6, 20);
        var lift = easeOut((p - 0.15) / 0.3);
        x.translate(-16 + 4 * lift, -10 - 22 * lift);
        x.rotate(-0.7 * lift);
        x.fillStyle = c.gold;
        x.fillRect(0, -4, 32, 6);
        x.fillStyle = c.orange;
        x.fillRect(13, -4, 6, 6);
      });
      sprite(0.1, null, {
        delay: 0.25,
        step: function () {
          burst(r0.right - 92, r0.top + r0.height / 2 - 6, 26, {
            angle: -Math.PI / 2, spread: 0.6, speed: [260, 480], g: 900, drag: 0.5,
            life: [0.9, 1.3], size: [4, 8], colors: c.mix, shape: 'rect'
          });
          burst(r0.right - 92, r0.top + r0.height / 2 - 6, 6, {
            angle: -Math.PI / 2, spread: 0.5, speed: [260, 420], g: 900, drag: 0.5,
            life: [1, 1.3], size: [5, 8], colors: [c.gold], shape: 'star'
          });
        }
      });
    },

    // Walk-through: a lightbulb moment.
    'walk': function (sec, c, a) {
      var title = a.querySelector('.zi-hc-section__title') || a;
      sprite(1.6, function (x, p) {
        var r = rectOf(title);
        var s = easeBack(p / 0.25);
        x.globalAlpha = fade(p, 0.65);
        x.translate(r.left + Math.min(r.width, 220) * 0.5, r.top - 26);
        x.scale(s, s);
        var glow = 0.5 + 0.5 * easeOut(p / 0.4);
        x.save();
        x.rotate(p * 0.6);
        x.strokeStyle = c.gold;
        x.lineWidth = 2.5;
        x.lineCap = 'round';
        for (var i = 0; i < 10; i++) {
          var a = (i / 10) * TAU;
          x.beginPath();
          x.moveTo(Math.cos(a) * 20, Math.sin(a) * 20);
          x.lineTo(Math.cos(a) * (24 + 10 * glow), Math.sin(a) * (24 + 10 * glow));
          x.stroke();
        }
        x.restore();
        x.shadowColor = c.gold;
        x.shadowBlur = 16 * glow;
        x.fillStyle = c.gold;
        x.beginPath();
        x.arc(0, -3, 12, 0, TAU);
        x.fill();
        x.shadowBlur = 0;
        x.fillStyle = c.slate;
        x.fillRect(-6, 8, 12, 8);
        x.fillStyle = 'rgba(255,255,255,0.6)';
        x.beginPath();
        x.arc(-4, -7, 3, 0, TAU);
        x.fill();
      });
    },

    // Charging check: a battery fills to 100% and zaps.
    'chg': function (sec, c, a) {
      var sum = a;
      var zapped = false;
      sprite(1.9, function (x, p) {
        var r = rectOf(sum);
        var cx = r.left + r.width / 2;
        var cy = r.top - 22;
        var fill = easeOut(p / 0.5);
        var s = easeBack(p / 0.15);
        x.globalAlpha = fade(p, 0.75);
        x.translate(cx, cy);
        x.scale(s, s);
        x.fillStyle = c.panel;
        x.strokeStyle = c.ink;
        x.lineWidth = 2.5;
        x.fillRect(-34, -14, 64, 28);
        x.strokeRect(-34, -14, 64, 28);
        x.fillStyle = c.ink;
        x.fillRect(30, -6, 5, 12);
        x.fillStyle = fill >= 1 ? c.gold : c.orange;
        x.fillRect(-30, -10, 56 * fill, 20);
        x.font = '700 13px "Space Grotesk", system-ui, sans-serif';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillStyle = '#1A1A1A'; // sits on the orange or gold fill in both themes
        x.fillText(Math.round(fill * 100) + '%', -2, 1);
        if (p > 0.5) { // the zap
          var z = easeBack((p - 0.5) / 0.15);
          x.translate(0, -30);
          x.scale(z, z);
          x.fillStyle = c.gold;
          x.strokeStyle = c.ink;
          x.lineWidth = 1.5;
          x.beginPath();
          x.moveTo(3, -14);
          x.lineTo(-8, 2);
          x.lineTo(-1, 2);
          x.lineTo(-4, 14);
          x.lineTo(8, -3);
          x.lineTo(1, -3);
          x.closePath();
          x.fill();
          x.stroke();
        }
      }, {
        step: function (dt, p) {
          if (zapped || p < 0.5) return;
          zapped = true;
          var r = rectOf(sum);
          burst(r.left + r.width / 2, r.top - 52, 18, {
            speed: [120, 260], g: 300, drag: 0.4, life: [0.5, 0.9], size: [1.5, 2.5],
            colors: [c.gold, c.orange], shape: 'spark'
          });
        }
      });
    },

    // Drive off: a little car zooms across the row with speed lines.
    'off': function (sec, c, a) {
      var sum = a;
      sprite(1.3, function (x, p) {
        var r = rectOf(sum);
        var t = easeIn(p) * 0.65 + p * 0.35;
        var cx = -60 + (W + 120) * t;
        var cy = r.top + r.height / 2;
        x.lineCap = 'round';
        x.strokeStyle = c.slate;
        for (var i = 0; i < 4; i++) {
          var len = 30 + 70 * p + i * 12;
          x.globalAlpha = 0.7 - i * 0.12;
          x.lineWidth = 2;
          x.beginPath();
          x.moveTo(cx - 40 - i * 4, cy - 10 + i * 6);
          x.lineTo(cx - 40 - i * 4 - len, cy - 10 + i * 6);
          x.stroke();
        }
        x.globalAlpha = 1;
        x.translate(cx, cy);
        x.fillStyle = c.orange;
        x.beginPath();
        x.moveTo(-36, 6);
        x.lineTo(-36, -2);
        x.quadraticCurveTo(-34, -8, -24, -9);
        x.lineTo(-14, -18);
        x.lineTo(10, -18);
        x.lineTo(22, -8);
        x.quadraticCurveTo(36, -7, 38, 0);
        x.lineTo(38, 6);
        x.closePath();
        x.fill();
        x.fillStyle = c.dark ? '#000000' : c.ink;
        x.beginPath();
        x.moveTo(-11, -15);
        x.lineTo(-2, -15);
        x.lineTo(-2, -9);
        x.lineTo(-18, -9);
        x.closePath();
        x.moveTo(1, -15);
        x.lineTo(9, -15);
        x.lineTo(17, -9);
        x.lineTo(1, -9);
        x.closePath();
        x.fill();
        [-22, 24].forEach(function (wx) {
          x.save();
          x.translate(wx, 7);
          x.rotate(p * 40);
          x.fillStyle = c.ink;
          x.beginPath();
          x.arc(0, 0, 7, 0, TAU);
          x.fill();
          x.fillStyle = c.slate;
          x.fillRect(-1, -5, 2, 10);
          x.restore();
        });
      }, {
        step: function (dt, p) {
          if (Math.random() > dt * 30) return;
          var r = rectOf(sum);
          var t = easeIn(p) * 0.65 + p * 0.35;
          part({
            x: -60 + (W + 120) * t - 38, y: r.top + r.height / 2 + 12,
            vx: rand(-60, -20), vy: rand(-30, -10), drag: 0.5, life: 0.6,
            size: rand(3, 6), color: c.slate, shape: 'dot', fadeFrom: 0
          });
        }
      });
    },

    // First days: the sun comes up over the row.
    'post-days': function (sec, c, a) {
      var sum = a;
      sprite(1.8, function (x, p) {
        var r = rectOf(sum);
        var cx = r.left + r.width / 2;
        var cy = r.top + 6 - easeOut(p / 0.5) * 26;
        x.globalAlpha = fade(p, 0.65);
        x.beginPath();
        x.rect(0, 0, W, r.top + 6);
        x.clip(); // it rises from behind the row
        var halo = x.createRadialGradient(cx, cy, 10, cx, cy, 90);
        halo.addColorStop(0, c.gold);
        halo.addColorStop(1, clear(c.gold));
        x.globalAlpha *= 0.45;
        x.fillStyle = halo;
        x.fillRect(cx - 90, cy - 90, 180, 180);
        x.globalAlpha = fade(p, 0.65);
        x.save();
        x.translate(cx, cy);
        x.rotate(p * 0.5);
        x.strokeStyle = c.orange;
        x.lineWidth = 3;
        x.lineCap = 'round';
        for (var i = 0; i < 12; i++) {
          var a = (i / 12) * TAU;
          var reach = 30 + 14 * easeOut((p - 0.15) / 0.4);
          x.beginPath();
          x.moveTo(Math.cos(a) * 28, Math.sin(a) * 28);
          x.lineTo(Math.cos(a) * reach, Math.sin(a) * reach);
          x.stroke();
        }
        x.restore();
        x.fillStyle = c.gold;
        x.beginPath();
        x.arc(cx, cy, 22, 0, TAU);
        x.fill();
      });
    },

    // First week and the club: the club stamp comes down.
    'post-week': function (sec, c, a) {
      var sum = a;
      var landed = false;
      var ink = c.dark ? c.orange : c.plum;
      sprite(1.9, function (x, p) {
        var r = rectOf(sum);
        var s = p < 0.18 ? 2.4 - 1.4 * easeIn(p / 0.18) : 1;
        x.globalAlpha = Math.min(1, p / 0.08) * fade(p, 0.7);
        x.translate(r.right - 84, r.top + r.height / 2 - 6);
        x.rotate(-0.22);
        x.scale(s, s);
        x.strokeStyle = ink;
        x.fillStyle = ink;
        x.lineWidth = 3;
        x.beginPath();
        x.arc(0, 0, 32, 0, TAU);
        x.stroke();
        x.lineWidth = 1.5;
        x.beginPath();
        x.arc(0, 0, 26, 0, TAU);
        x.stroke();
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.font = '800 18px "Space Grotesk", system-ui, sans-serif';
        x.fillText('ZI', 0, -3);
        x.font = '700 7px "Space Grotesk", system-ui, sans-serif';
        x.fillText('MEMBER', 0, 11);
        x.save();
        x.translate(0, -17);
        starPath(x, 3.5, 5, 0.45);
        x.fill();
        x.restore();
      }, {
        step: function (dt, p) {
          if (landed || p < 0.18) return;
          landed = true;
          var r = rectOf(sum);
          burst(r.right - 84, r.top + r.height / 2 - 6, 16, {
            speed: [80, 170], g: 0, drag: 0.08, life: [0.5, 0.8], size: [2, 3.5],
            colors: [ink, c.slate], shape: 'dot'
          });
        }
      });
    }
  };

  /* ---- The finale: confetti cannons, rain, stars and fireworks. ---- */

  function finale(c) {
    var nextBoom = 0.15;
    burst(0, H, 70, {
      angle: -Math.PI / 3, spread: 0.3, speed: [700, 1100], g: 800, drag: 0.4,
      life: [2.4, 3], size: [7, 11], colors: c.mix, shape: 'rect'
    });
    burst(W, H, 70, {
      angle: -Math.PI * 2 / 3, spread: 0.3, speed: [700, 1100], g: 800, drag: 0.4,
      life: [2.4, 3], size: [7, 11], colors: c.mix, shape: 'rect'
    });
    sprite(4.2, null, {
      step: function (dt, p, s) {
        if (p < 0.5 && Math.random() < dt * 40) {
          part({
            x: rand(0, W), y: -12, vx: rand(-40, 40), vy: rand(90, 170), g: 40, drag: 0.9,
            life: rand(2.2, 2.8), size: rand(6, 10), vr: rand(-6, 6), color: pick(c.mix),
            shape: Math.random() < 0.2 ? 'star' : 'rect', fadeFrom: 0.75
          });
        }
        // Bursts about twice a second, well under the 3 Hz flash limit.
        if (s.age >= nextBoom && p < 0.62) {
          nextBoom += rand(0.45, 0.6);
          var col = pick(c.mix);
          var bx = rand(W * 0.15, W * 0.85);
          var by = rand(H * 0.12, H * 0.45);
          burst(bx, by, 38, {
            speed: [90, 230], g: 120, drag: 0.35, life: [1, 1.4], size: [1.6, 2.6],
            colors: [col, col, c.gold], shape: 'spark'
          });
          burst(bx, by, 6, {
            speed: [40, 120], g: 120, drag: 0.35, life: [1, 1.3], size: [3, 5],
            colors: [c.gold], shape: 'star'
          });
        }
      }
    });
  }

  /* ---- Messages, the finale card and the reduced-motion cue. ---- */

  var live = null;
  var liveTimer = 0;

  function announce(text) {
    if (!live) {
      live = document.createElement('div');
      live.className = 'zi-sr-only zi-cheer-live';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      document.body.appendChild(live);
    }
    live.textContent = '';
    clearTimeout(liveTimer);
    // A fresh node change on the next frame, so a repeat message is still read.
    requestAnimationFrame(function () { live.textContent = text; });
    liveTimer = setTimeout(function () { live.textContent = ''; }, 6000);
  }

  var card = null;
  var cardTimer = 0;

  function closeCard() {
    clearTimeout(cardTimer);
    document.removeEventListener('keydown', onKey);
    if (card) card.remove();
    card = null;
  }

  function onKey(e) {
    if (e.key === 'Escape') closeCard();
  }

  function showCard() {
    closeCard();
    card = document.createElement('div');
    card.className = 'zi-cheer-finale';
    card.innerHTML = '<p class="zi-cheer-finale__title">You\'re all set.</p>' +
      '<p class="zi-cheer-finale__text">Every item is ticked. Enjoy your Zeekr!</p>' +
      '<button type="button" class="zi-cheer-finale__close">Thanks</button>';
    card.querySelector('button').addEventListener('click', closeCard);
    document.body.appendChild(card);
    document.addEventListener('keydown', onKey);
    cardTimer = setTimeout(closeCard, 9000);
  }

  function staticCue(sec) {
    var sum = sec.querySelector('summary');
    var old = sum.querySelector('.zi-cheer-badge');
    if (old) old.remove();
    var badge = document.createElement('span');
    badge.className = 'zi-cheer-badge';
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = '✓';
    sum.insertBefore(badge, sum.firstChild);
    sec.classList.add('zi-cheer-static');
    setTimeout(function () {
      sec.classList.remove('zi-cheer-static');
      badge.remove();
    }, 2500);
  }

  document.addEventListener('zi-hc:section-done', function (e) {
    var d = e.detail || {};
    var sec = d.section;
    if (!sec || printing()) return;
    var now = Date.now();
    var key = d.all ? '*all' : sec.id;
    if (fired[key] && now - fired[key] < REFIRE_MS) return;
    fired[key] = now;
    fired[sec.id] = now;

    if (d.all) {
      announce('Section complete: ' + d.title + '. Every item is ticked. You\'re all set. Enjoy your Zeekr!');
      showCard();
      if (reduced()) return;
      start();
      finale(palette());
      return;
    }
    announce('Section complete: ' + d.title);
    if (reduced()) {
      staticCue(sec);
      return;
    }
    start();
    (effects[sec.id] || effects['pre-prep'])(sec, palette(), anchorFor(sec, d.item));
  });

  // Start again: whatever is still playing stops with the ticks.
  document.addEventListener('zi-hc:reset', function () {
    stop();
    closeCard();
    fired = {};
  });

  // Leaving the page mid-effect (or Material swapping it) drops any leftovers.
  window.addEventListener('pagehide', function () {
    stop();
    closeCard();
  });
})();
