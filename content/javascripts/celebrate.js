/* Celebrate: small, dependency-free canvas bursts for moments worth marking
 * (a finished checklist, a card's hover trace completing).
 *
 *   ZICelebrate.confetti(origin, options)   paper rectangles, up then down
 *   ZICelebrate.stars(origin, options)      five-point stars that drift and fade
 *   ZICelebrate.streamers(origin, options)  long ribbons that wave as they fall
 *   ZICelebrate.sparks(origin, options)     quick bright streaks out from a point
 *   ZICelebrate.burst(origin, options)      any mix: options.kinds = ['confetti', 'sparks']
 *   ZICelebrate.reducedMotion()             true when the reader asked for less motion
 *
 * origin is an Element (bursts from its centre), a DOMRect, or {x, y} in
 * viewport pixels. Every call returns true when it drew, false when it did not
 * (reduced motion, no canvas). Options, all optional:
 *   count     particles (defaults suit each kind)
 *   colours   CSS colours; defaults to the club palette read from zeekr.css
 *   spread    launch cone in degrees (default 70; 360 for all round)
 *   angle     launch direction in degrees, 0 = up (default 0)
 *   speed     launch speed multiplier (default 1)
 *
 * One fixed, click-through canvas is created on the first burst and removed
 * once the last particle has gone, so nothing runs while idle. Bursts honour
 * prefers-reduced-motion by drawing nothing.
 */
(function () {
  'use strict';

  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var canvas = null;
  var ctx = null;
  var particles = [];
  var frame = 0;
  var last = 0;
  var dpr = 1;

  function reducedMotion() {
    return !!(motionQuery && motionQuery.matches);
  }

  // Read live from body, where Material's data-md-color-scheme sets the
  // secondary hues, so a theme switch is picked up on the next burst.
  function palette() {
    var css = getComputedStyle(document.body || document.documentElement);
    var names = ['--zeekr-orange', '--hue-gold-solid', '--hue-plum-ink', '--hue-slate-solid', '--arctic-white'];
    var out = [];
    names.forEach(function (n) {
      var v = css.getPropertyValue(n).trim();
      if (v) out.push(v);
    });
    return out.length ? out : ['#FF5A00', '#E6B237', '#DDA6C4', '#9DA2A5', '#F2F2F2'];
  }

  function point(origin) {
    if (!origin) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var r = typeof origin.getBoundingClientRect === 'function' ? origin.getBoundingClientRect() : origin;
    if (typeof r.width === 'number' && typeof r.left === 'number') {
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { x: r.x, y: r.y };
  }

  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function ensureCanvas() {
    if (canvas) return true;
    canvas = document.createElement('canvas');
    canvas.className = 'zi-celebrate';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483000';
    ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas = null;
      return false;
    }
    document.body.appendChild(canvas);
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    return true;
  }

  function teardown() {
    window.removeEventListener('resize', sizeCanvas);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null;
    ctx = null;
    frame = 0;
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  // Per-kind physics and shape. Speeds are px per second, gravity px/s².
  var KINDS = {
    confetti: { count: 70, speed: [380, 720], gravity: 900, drag: 1.6, life: [1.6, 2.4], size: [6, 10] },
    stars: { count: 24, speed: [180, 420], gravity: 220, drag: 1.2, life: [1.2, 1.8], size: [7, 12] },
    streamers: { count: 14, speed: [420, 700], gravity: 620, drag: 1.4, life: [2, 2.8], size: [26, 40] },
    sparks: { count: 36, speed: [420, 900], gravity: 120, drag: 3.2, life: [0.35, 0.7], size: [10, 18] }
  };

  function spawn(kind, origin, options) {
    var spec = KINDS[kind];
    var o = options || {};
    var at = point(origin);
    var colours = o.colours && o.colours.length ? o.colours : palette();
    var count = o.count || spec.count;
    var spread = (o.spread == null ? (kind === 'sparks' ? 360 : 70) : o.spread) * Math.PI / 180;
    var aim = ((o.angle || 0) - 90) * Math.PI / 180;
    var mult = o.speed || 1;
    for (var i = 0; i < count; i++) {
      var dir = aim + rand(-spread / 2, spread / 2);
      var v = rand(spec.speed[0], spec.speed[1]) * mult;
      particles.push({
        kind: kind,
        x: at.x,
        y: at.y,
        vx: Math.cos(dir) * v,
        vy: Math.sin(dir) * v,
        g: spec.gravity,
        drag: spec.drag,
        age: 0,
        life: rand(spec.life[0], spec.life[1]),
        size: rand(spec.size[0], spec.size[1]),
        rot: rand(0, Math.PI * 2),
        spin: rand(-10, 10),
        wave: rand(0, Math.PI * 2),
        colour: colours[i % colours.length]
      });
    }
  }

  function star(x, y, r) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var rad = i % 2 ? r * 0.45 : r;
      var a = (i * Math.PI) / 5 - Math.PI / 2;
      ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  function draw(p) {
    var fade = Math.min(1, (p.life - p.age) / 0.4);
    ctx.globalAlpha = Math.max(0, fade);
    ctx.fillStyle = p.colour;
    ctx.strokeStyle = p.colour;
    if (p.kind === 'confetti') {
      // Flutter: the paper's apparent width swings as it tumbles.
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(Math.cos(p.wave), 1);
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    } else if (p.kind === 'stars') {
      star(p.x, p.y, p.size / 2);
    } else if (p.kind === 'streamers') {
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (var s = 0; s <= 6; s++) {
        var t = s / 6;
        var px = p.x - p.vx * 0.02 * t * 3 + Math.sin(p.wave + t * 5) * 5;
        var py = p.y - (p.size * t);
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    } else {
      var len = Math.hypot(p.vx, p.vy) || 1;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - (p.vx / len) * p.size, p.y - (p.vy / len) * p.size);
      ctx.stroke();
    }
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    var alive = [];
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.age += dt;
      if (p.age >= p.life) continue;
      var k = Math.exp(-p.drag * dt);
      p.vx *= k;
      p.vy = p.vy * k + p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      p.wave += 8 * dt;
      draw(p);
      alive.push(p);
    }
    ctx.globalAlpha = 1;
    particles = alive;
    if (particles.length) {
      frame = requestAnimationFrame(tick);
    } else {
      teardown();
    }
  }

  function burst(origin, options) {
    var o = options || {};
    if (reducedMotion() || !document.body || !ensureCanvas()) return false;
    var kinds = o.kinds && o.kinds.length ? o.kinds : ['confetti'];
    kinds.forEach(function (kind) {
      if (KINDS[kind]) spawn(kind, origin, o);
    });
    if (!frame) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
    return true;
  }

  function one(kind) {
    return function (origin, options) {
      var o = Object.assign({}, options, { kinds: [kind] });
      return burst(origin, o);
    };
  }

  window.ZICelebrate = {
    burst: burst,
    confetti: one('confetti'),
    stars: one('stars'),
    streamers: one('streamers'),
    sparks: one('sparks'),
    reducedMotion: reducedMotion
  };
})();
