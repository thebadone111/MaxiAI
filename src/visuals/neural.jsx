import { useEffect, useRef } from 'react';
import { useScrollProgress } from '../motion/hooks.js';
import { reducedMotion } from '../motion/smooth.js';
import './neural.css';

/*
 * "How it learns" — the company brain, drawn as the machine-learning system
 * it is. A sticky scroll scene on a 2D canvas, four beats:
 *
 *   01 Ingest   every email, document and record streams in as a vector
 *   02 Embed    the vectors drift into clusters — related things land near
 *               each other — while a loss curve falls
 *   03 Connect  edges form inside and between clusters: a knowledge graph,
 *               with signals travelling along it
 *   04 Recall   a question arrives as a red vector; its nearest neighbours
 *               light up and are pulled in as the answer's sources
 *
 * Every position is a pure function of progress (plus a small idle shimmer
 * from the clock), so it scrubs both ways and a reload lands on the same
 * frame. The beats overlap — points are still arriving as the first ones
 * begin to cluster — and every transition uses a smootherstep curve, so
 * nothing starts or stops abruptly.
 *
 * Smoothness: the canvas never follows the raw scroll position. It follows
 * an eased copy that glides towards it (a frame-rate-independent
 * exponential approach), so a coarse wheel notch becomes a glide rather
 * than a jump. Drawing is batched — one path per alpha band for the points,
 * one stroke per edge type — about twenty canvas calls a frame instead of
 * fifteen hundred, which is what keeps it at a steady 60fps.
 *
 * The loop only runs while the scene is on screen. Under reduced motion it
 * draws the finished graph once and never animates.
 */

/* The story, as fractions of the scene's scroll length. Each beat overlaps
   the next. Change a number here and the canvas, readout and captions all
   follow. */
const T = {
  ingest: [0.0, 0.3],
  embed: [0.22, 0.6],
  connect: [0.54, 0.8],
  recall: [0.78, 0.97],
};
const EASE_MS = 160; // how quickly the drawing catches up with the scroll

const CLUSTERS = [
  { name: 'clients', x: 0.2, y: 0.3 },
  { name: 'invoices', x: 0.68, y: 0.22 },
  { name: 'projects', x: 0.5, y: 0.52 },
  { name: 'decisions', x: 0.82, y: 0.7 },
  { name: 'people', x: 0.26, y: 0.78 },
];
const LINKS = [[0, 1], [0, 2], [1, 2], [2, 3], [4, 3], [4, 2], [0, 4]];
const SOURCES = ['email', 'docs', 'crm', 'finance'];
const QUERY = { x: 0.43, y: 0.27 };
const K = 9;

const STEPS = [
  { n: '01', title: 'Ingest', body: 'Every email, document and record becomes a vector.' },
  { n: '02', title: 'Embed', body: 'Related things land near each other — clients, invoices, decisions.' },
  { n: '03', title: 'Connect', body: 'A graph of who, what and why, kept up to date.' },
  { n: '04', title: 'Recall', body: 'Ask a question; it finds the memories that answer it.' },
];

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
// Smootherstep: zero velocity *and* zero acceleration at both ends.
const ease = (v) => v * v * v * (v * (v * 6 - 15) + 10);
const span = (p, a, b) => clamp01((p - a) / (b - a));

function gauss(rand) {
  // Box–Muller, clipped so no point lands far outside its cluster.
  const u = Math.max(1e-6, rand());
  const v = rand();
  return Math.max(-2.2, Math.min(2.2, Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)));
}

function build(n) {
  const rand = mulberry32(0x627261696e); // "brain"
  const pts = [];
  for (let i = 0; i < n; i++) {
    const c = i % CLUSTERS.length;
    const cl = CLUSTERS[c];
    pts.push({
      c,
      src: Math.floor(rand() * SOURCES.length),
      // stream start: off the left edge of the field, in a band per source
      sx: -0.12 - rand() * 0.35,
      sy: 0.1 + (Math.floor(rand() * SOURCES.length) + rand()) * 0.2,
      // scattered, unsorted
      rx: 0.04 + rand() * 0.92,
      ry: 0.04 + rand() * 0.92,
      // home in its cluster
      cx: cl.x + gauss(rand) * 0.058,
      cy: cl.y + gauss(rand) * 0.058,
      t: (i / n) * 0.17 + rand() * 0.04, // ingest order, within T.ingest
      e: rand(), // embed stagger
      ph: rand() * Math.PI * 2,
      r: 1.3 + rand() * 1.3,
    });
  }
  // Edges: each point to its two nearest cluster-mates, plus cross-cluster
  // links between related clusters.
  const edges = [];
  const byCluster = CLUSTERS.map((_, c) => pts.map((p, i) => [p, i]).filter(([p]) => p.c === c));
  byCluster.forEach((members) => {
    members.forEach(([p, i]) => {
      const near = members
        .filter(([, j]) => j !== i)
        .map(([q, j]) => [(q.cx - p.cx) ** 2 + (q.cy - p.cy) ** 2, j])
        .sort((a, b) => a[0] - b[0])
        .slice(0, 2);
      near.forEach(([, j]) => { if (i < j) edges.push({ a: i, b: j, cross: false, s: rand(), ph: rand() }); });
    });
  });
  LINKS.forEach(([ca, cb]) => {
    for (let k = 0; k < 7; k++) {
      const A = byCluster[ca][Math.floor(rand() * byCluster[ca].length)][1];
      const B = byCluster[cb][Math.floor(rand() * byCluster[cb].length)][1];
      edges.push({ a: A, b: B, cross: true, s: rand(), ph: rand() });
    }
  });
  // The query's nearest neighbours, by their final positions.
  const nn = pts
    .map((p, i) => [(p.cx - QUERY.x) ** 2 + (p.cy - QUERY.y) ** 2, i])
    .sort((a, b) => a[0] - b[0])
    .slice(0, K)
    .map(([, i]) => i);
  return { pts, edges, nn: new Set(nn), nnList: nn };
}

// A falling, slightly noisy loss curve, fixed.
const LOSS = (() => {
  const r = mulberry32(7);
  return Array.from({ length: 40 }, (_, i) => 0.08 + 0.86 * Math.exp(-i / 9) + (r() - 0.5) * 0.05);
})();
// High loss at the top-left, falling to the bottom-right.
const LOSS_PATH = LOSS.map((v, i) => `${i ? 'L' : 'M'}${((i / 39) * 120).toFixed(1)} ${(1 + (1 - v) * 33).toFixed(1)}`).join(' ');

export default function NeuralScene() {
  const canvas = useRef(null);
  const headEl = useRef(null);
  const footEl = useRef(null);
  const hudEl = useRef(null);
  // target: where the scroll is. shown: where the drawing is, gliding after it.
  const state = useRef({ target: 1, shown: 1, net: null, w: 0, h: 0, dpr: 1, field: null });
  const hud = useRef({});
  const steps = useRef([]);
  const bar = useRef(null);
  const lossRef = useRef(null);
  const activeStep = useRef(3); // the markup starts on the last beat
  const visible = useRef(false);
  const raf = useRef(0);

  // HUD and captions follow progress; written only when they change.
  const paintHud = (p) => {
    const ingested = ease(span(p, T.ingest[0], T.ingest[1] - 0.04));
    const docs = Math.round(3212 * ingested);
    const set = (k, v) => { const el = hud.current[k]; if (el && el.textContent !== v) el.textContent = v; };
    set('docs', docs.toLocaleString('en-GB'));
    set('vectors', Math.round(docs * 15.2).toLocaleString('en-GB'));
    const emb = span(p, T.embed[0] + 0.06, T.embed[1] - 0.06);
    set('clusters', String(emb <= 0 ? 0 : Math.min(CLUSTERS.length, Math.ceil(emb * CLUSTERS.length))));
    set('edges', Math.round(ease(span(p, ...T.connect)) * 18420).toLocaleString('en-GB'));
    const lossK = ease(span(p, ...T.embed));
    set('loss', LOSS[Math.min(39, Math.round(lossK * 39))].toFixed(3));
    set('epoch', String(Math.max(1, Math.round(lossK * 12))).padStart(2, '0'));
    if (lossRef.current) lossRef.current.style.strokeDashoffset = String(1 - lossK);
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    const i = p < T.embed[0] + 0.04 ? 0 : p < T.connect[0] + 0.02 ? 1 : p < T.recall[0] ? 2 : 3;
    if (i !== activeStep.current) {
      steps.current[activeStep.current]?.classList.remove('is-active');
      steps.current[i]?.classList.add('is-active');
      activeStep.current = i;
    }
  };

  const draw = (time) => {
    const s = state.current;
    const cv = canvas.current;
    if (!cv || !s.net) return;
    const ctx = cv.getContext('2d');
    const { shown: p, w, h, dpr, field } = s;
    const { pts, edges, nn, nnList } = s.net;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const fx = (u) => field.x + u * field.w;
    const fy = (v) => field.y + v * field.h;
    const embed = span(p, ...T.embed);
    const connect = span(p, ...T.connect);
    const recall = span(p, ...T.recall);
    const shimmer = time * 0.0005;
    const TAU = Math.PI * 2;

    // positions this frame
    const n = pts.length;
    const X = s.X || (s.X = new Float32Array(n));
    const Y = s.Y || (s.Y = new Float32Array(n));
    const A = s.A || (s.A = new Float32Array(n));
    const ingestLen = 0.12;
    for (let i = 0; i < n; i++) {
      const q = pts[i];
      const k = ease(clamp01((p - q.t) / ingestLen));
      const e = ease(clamp01((embed - q.e * 0.4) / 0.6));
      const ux = q.sx + (q.rx - q.sx) * k;
      const uy = q.sy + (q.ry - q.sy) * k;
      const jitter = 0.0032 * (1 - 0.65 * e);
      X[i] = fx(ux + (q.cx - ux) * e + Math.sin(shimmer + q.ph) * jitter);
      Y[i] = fy(uy + (q.cy - uy) * e + Math.cos(shimmer * 1.3 + q.ph) * jitter);
      A[i] = k;
    }

    // edges: each grows from one end to the other; two strokes in total
    if (connect > 0) {
      ctx.lineWidth = 1;
      for (const cross of [false, true]) {
        ctx.strokeStyle = cross ? 'rgba(250,247,240,0.22)' : 'rgba(250,247,240,0.1)';
        ctx.globalAlpha = ease(clamp01(connect * 1.6));
        ctx.beginPath();
        for (const ed of edges) {
          if (ed.cross !== cross) continue;
          const g = ease(clamp01((connect - ed.s * 0.45) / 0.55));
          if (g <= 0) continue;
          ctx.moveTo(X[ed.a], Y[ed.a]);
          ctx.lineTo(X[ed.a] + (X[ed.b] - X[ed.a]) * g, Y[ed.a] + (Y[ed.b] - Y[ed.a]) * g);
        }
        ctx.stroke();
      }
      // signals travelling the cross-cluster links, one fill
      const sig = ease(span(connect, 0.6, 1));
      if (sig > 0) {
        ctx.globalAlpha = sig;
        ctx.fillStyle = 'rgba(192,57,43,0.95)';
        ctx.beginPath();
        for (const ed of edges) {
          if (!ed.cross) continue;
          const t = (time * 0.00028 + ed.ph) % 1;
          const x = X[ed.a] + (X[ed.b] - X[ed.a]) * t;
          const y = Y[ed.a] + (Y[ed.b] - Y[ed.a]) * t;
          ctx.moveTo(x + 1.7, y);
          ctx.arc(x, y, 1.7, 0, TAU);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // recall: the query glides in, then reaches out to its neighbours
    const arrive = ease(span(recall, 0, 0.45));
    const qx = fx(QUERY.x - 0.3 * (1 - arrive));
    const qy = fy(QUERY.y - 0.25 * (1 - arrive));
    const reach = ease(span(recall, 0.35, 0.9));
    if (reach > 0) {
      ctx.strokeStyle = 'rgba(192,57,43,0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      nnList.forEach((i, k) => {
        const l = ease(clamp01(reach * K - k));
        if (l <= 0) return;
        ctx.moveTo(qx, qy);
        ctx.lineTo(qx + (X[i] - qx) * l, qy + (Y[i] - qy) * l);
      });
      ctx.stroke();
    }

    // points, batched into alpha bands
    const dim = 1 - 0.55 * ease(span(recall, 0.3, 0.8));
    const lit = ease(span(recall, 0.45, 0.85));
    const BANDS = 8;
    ctx.fillStyle = 'rgb(250,247,240)';
    for (let band = 1; band <= BANDS; band++) {
      const lo = (band - 1) / BANDS;
      const hi = band / BANDS;
      ctx.globalAlpha = 0.8 * hi * dim;
      ctx.beginPath();
      let any = false;
      for (let i = 0; i < n; i++) {
        const a = A[i];
        if (a <= lo || a > hi || (lit > 0 && nn.has(i))) continue;
        const r = pts[i].r;
        ctx.moveTo(X[i] + r, Y[i]);
        ctx.arc(X[i], Y[i], r, 0, TAU);
        any = true;
      }
      if (any) ctx.fill();
    }
    ctx.globalAlpha = 1;

    // the recalled memories: red, with a halo
    if (lit > 0) {
      ctx.fillStyle = `rgba(192,57,43,${lit.toFixed(3)})`;
      ctx.beginPath();
      for (const i of nnList) {
        const r = pts[i].r + 1.4 * lit;
        ctx.moveTo(X[i] + r, Y[i]);
        ctx.arc(X[i], Y[i], r, 0, TAU);
      }
      ctx.fill();
      ctx.strokeStyle = `rgba(192,57,43,${(0.45 * lit).toFixed(3)})`;
      ctx.beginPath();
      for (const i of nnList) {
        const r = pts[i].r + 6;
        ctx.moveTo(X[i] + r, Y[i]);
        ctx.arc(X[i], Y[i], r, 0, TAU);
      }
      ctx.stroke();
    }

    if (arrive > 0) {
      const a = arrive;
      ctx.fillStyle = `rgba(192,57,43,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(qx, qy, 5, 0, TAU);
      ctx.fill();
      // a slow sonar ring, eased in and out over each pulse
      const pulse = (time * 0.00045) % 1;
      ctx.strokeStyle = `rgba(192,57,43,${(0.5 * a * (1 - pulse)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(qx, qy, 8 + ease(pulse) * 22, 0, TAU);
      ctx.stroke();

      ctx.font = '11px "DM Mono", ui-monospace, monospace';
      const l1 = w < 600 ? 'query · "northgate — paid?"' : 'query · "northgate quote — paid?"';
      const l2 = `top-${K} memories · cos ≥ 0.82`;
      // Right of the query; else left of it; else pinned inside the right
      // edge and lifted clear of the point.
      const room = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 24;
      let lx = qx + 14;
      let ly = qy - 12;
      ctx.textAlign = 'start';
      if (qx + room > w) {
        ctx.textAlign = 'end';
        lx = qx - 14;
        if (qx - room < 0) {
          lx = w - 10;
          ly = qy - 30;
        }
      }
      ctx.fillStyle = `rgba(250,247,240,${a.toFixed(3)})`;
      ctx.fillText(l1, lx, ly);
      ctx.fillStyle = `rgba(154,149,168,${ease(span(recall, 0.75, 1)).toFixed(3)})`;
      ctx.fillText(l2, lx, ly + 16);
      ctx.textAlign = 'start';
    }

    // cluster labels
    const label = ease(span(embed, 0.45, 1)) * (1 - 0.5 * ease(recall));
    if (label > 0) {
      ctx.font = '10px "DM Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(154,149,168,${label.toFixed(3)})`;
      CLUSTERS.forEach((c) => {
        ctx.fillText(c.name.toUpperCase().split('').join(' '), fx(c.x), fy(c.y) - field.h * 0.16);
      });
      ctx.textAlign = 'start';
    }
  };

  const ref = useScrollProgress((p) => {
    const s = state.current;
    s.target = p;
    // Off screen (or reduced motion) there is no loop to glide: jump.
    if (!raf.current) {
      s.shown = p;
      paintHud(p);
      draw(performance.now());
    }
  }, { span: true, rest: 1 });

  // Size the canvas and the drawing field; rebuild the point set for the
  // screen's area so a phone gets fewer points, not a crowded field.
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const s = state.current;
      s.w = r.width;
      s.h = r.height;
      s.dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * s.dpr);
      cv.height = Math.round(r.height * s.dpr);
      const wide = r.width >= 900;
      /* The field is whatever space the type leaves: below the heading (and
         on desktop the readout), above the captions (and on a phone the
         readout). Measured, so it holds on any screen from 320x568 up. */
      const rel = (el) => {
        if (!el || el.offsetParent === null) return null;
        const b = el.getBoundingClientRect();
        return { top: b.top - r.top, bottom: b.bottom - r.top };
      };
      const head = rel(headEl.current);
      const foot = rel(footEl.current);
      const hud = rel(hudEl.current);
      if (wide) {
        const top = Math.max(r.height * 0.26, (hud?.bottom ?? 0) + 36);
        const bottom = (foot?.top ?? r.height * 0.8) - 28;
        s.field = { x: r.width * 0.38, y: top, w: r.width * 0.56, h: Math.max(120, bottom - top) };
      } else {
        const top = (head?.bottom ?? r.height * 0.4) + 18;
        const bottom = (hud?.top ?? foot?.top ?? r.height * 0.75) - 14;
        s.field = { x: r.width * 0.08, y: top, w: r.width * 0.84, h: Math.max(90, bottom - top) };
      }
      const n = wide ? 520 : 300;
      if (!s.net || s.net.pts.length !== n) {
        s.net = build(n);
        s.X = s.Y = s.A = null;
      }
      draw(performance.now());
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    if (headEl.current) ro.observe(headEl.current);
    if (footEl.current) ro.observe(footEl.current);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  // The idle loop (shimmer, signals, the query's ring) runs only on screen.
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || reducedMotion()) return;
    let last = 0;
    const loop = (t) => {
      const s = state.current;
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      // Exponential approach, independent of frame rate: covers ~63% of the
      // remaining distance every EASE_MS.
      s.shown += (s.target - s.shown) * (1 - Math.exp(-dt / EASE_MS));
      if (Math.abs(s.target - s.shown) < 0.0001) s.shown = s.target;
      paintHud(s.shown);
      draw(t);
      if (visible.current) raf.current = requestAnimationFrame(loop);
      else { raf.current = 0; last = 0; }
    };
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (visible.current && !raf.current) raf.current = requestAnimationFrame(loop);
    });
    io.observe(cv);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, []);

  const h = (k) => (el) => { hud.current[k] = el; };

  return (
    <section ref={ref} className="neural relative bg-ink text-cream" style={{ height: '640vh' }} aria-labelledby="neural-title">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        <div ref={headEl} className="neural-head wrap">
          <span className="eyebrow">How it learns</span>
          <span className="signal-rule mb-6 mt-5" />
          <h2 id="neural-title" className="font-display text-[clamp(1.875rem,8vw,2.25rem)] font-light leading-[1.08] text-cream md:text-[52px] md:leading-[1.05]">
            From scattered files to a <em>working memory.</em>
          </h2>
        </div>

        <dl ref={hudEl} className="neural-hud" aria-hidden="true">
          <div><dt>documents</dt><dd ref={h('docs')} className="tabular">3,212</dd></div>
          <div><dt>vectors</dt><dd ref={h('vectors')} className="tabular">48,822</dd></div>
          <div><dt>clusters</dt><dd ref={h('clusters')} className="tabular">5</dd></div>
          <div><dt>edges</dt><dd ref={h('edges')} className="tabular">18,420</dd></div>
          <div className="neural-loss">
            <dt>loss · epoch <span ref={h('epoch')}>12</span></dt>
            <dd>
              <span ref={h('loss')} className="tabular">0.081</span>
              <svg viewBox="0 0 120 36" aria-hidden="true">
                <path d={LOSS_PATH} pathLength="1" ref={lossRef} />
              </svg>
            </dd>
          </div>
        </dl>

        <div ref={footEl} className="neural-foot wrap">
          <ol className="neural-steps">
            {STEPS.map((s, i) => (
              <li key={s.n} ref={(el) => { steps.current[i] = el; }} className={`neural-step ${i === 3 ? 'is-active' : ''}`}>
                <span className="font-mono text-[11px] tracking-[0.22em] text-signal">{s.n}</span>
                <span className="neural-step-title">{s.title}</span>
                <span className="neural-step-body">{s.body}</span>
              </li>
            ))}
          </ol>
          <div className="neural-bar" aria-hidden="true"><span ref={bar} /></div>
        </div>
      </div>
    </section>
  );
}
