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
 * Every position is a pure function of scroll progress (plus a small idle
 * shimmer from the clock), so it scrubs both ways and a reload lands on the
 * same frame. One canvas, one draw call per layer, nothing allocated per
 * frame. The loop only runs while the scene is on screen. Under reduced
 * motion it draws the finished graph once and never animates.
 */

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
const smooth = (v) => v * v * (3 - 2 * v);
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
      t: (i / n) * 0.18 + rand() * 0.03, // ingest order
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
  const state = useRef({ p: 1, net: null, w: 0, h: 0, dpr: 1, field: null });
  const hud = useRef({});
  const steps = useRef([]);
  const bar = useRef(null);
  const lossRef = useRef(null);
  const activeStep = useRef(3); // the markup starts on the last beat
  const visible = useRef(false);
  const raf = useRef(0);

  // HUD and captions follow progress; written only when they change.
  const paintHud = (p) => {
    const ingested = smooth(span(p, 0, 0.24));
    const docs = Math.round(3212 * ingested);
    const set = (k, v) => { const el = hud.current[k]; if (el && el.textContent !== v) el.textContent = v; };
    set('docs', docs.toLocaleString('en-GB'));
    set('vectors', Math.round(docs * 15.2).toLocaleString('en-GB'));
    set('clusters', String(p < 0.3 ? 0 : Math.min(CLUSTERS.length, Math.ceil(span(p, 0.3, 0.5) * CLUSTERS.length))));
    set('edges', Math.round(span(p, 0.56, 0.78) * 18420).toLocaleString('en-GB'));
    const lossK = span(p, 0.26, 0.56);
    set('loss', LOSS[Math.min(39, Math.round(lossK * 39))].toFixed(3));
    set('epoch', String(Math.max(1, Math.round(lossK * 12))).padStart(2, '0'));
    if (lossRef.current) lossRef.current.style.strokeDashoffset = String(1 - lossK);
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    const i = p < 0.26 ? 0 : p < 0.56 ? 1 : p < 0.8 ? 2 : 3;
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
    const { p, w, h, dpr, field } = s;
    const { pts, edges, nn, nnList } = s.net;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const fx = (u) => field.x + u * field.w;
    const fy = (v) => field.y + v * field.h;
    const ingestP = p;
    const embed = span(p, 0.26, 0.56);
    const connect = span(p, 0.56, 0.8);
    const recall = span(p, 0.8, 0.94);
    const shimmer = time * 0.0006;

    // positions this frame
    const X = s.X || (s.X = new Float32Array(pts.length));
    const Y = s.Y || (s.Y = new Float32Array(pts.length));
    const A = s.A || (s.A = new Float32Array(pts.length));
    for (let i = 0; i < pts.length; i++) {
      const q = pts[i];
      const k = smooth(clamp01((ingestP - q.t) / 0.07));
      const e = smooth(clamp01((embed - q.e * 0.45) / 0.55));
      const ux = q.sx + (q.rx - q.sx) * k;
      const uy = q.sy + (q.ry - q.sy) * k;
      const jitter = 0.0035 * (1 - 0.6 * e);
      X[i] = fx(ux + (q.cx - ux) * e + Math.sin(shimmer + q.ph) * jitter);
      Y[i] = fy(uy + (q.cy - uy) * e + Math.cos(shimmer * 1.3 + q.ph) * jitter);
      A[i] = k;
    }

    // edges
    if (connect > 0) {
      ctx.lineWidth = 1;
      for (const ed of edges) {
        const a = smooth(clamp01((connect - ed.s * 0.5) / 0.5));
        if (a <= 0) continue;
        ctx.strokeStyle = ed.cross
          ? `rgba(250,247,240,${(0.22 * a).toFixed(3)})`
          : `rgba(250,247,240,${(0.1 * a).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(X[ed.a], Y[ed.a]);
        ctx.lineTo(X[ed.b], Y[ed.b]);
        ctx.stroke();
        // a signal travelling the cross-cluster links
        if (ed.cross && a > 0.9) {
          const t = (time * 0.00035 + ed.ph) % 1;
          ctx.fillStyle = 'rgba(192,57,43,0.9)';
          ctx.beginPath();
          ctx.arc(X[ed.a] + (X[ed.b] - X[ed.a]) * t, Y[ed.a] + (Y[ed.b] - Y[ed.a]) * t, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // recall: query vector and its nearest neighbours
    const qx = fx(QUERY.x - 0.3 * (1 - smooth(span(recall, 0, 0.4))));
    const qy = fy(QUERY.y - 0.25 * (1 - smooth(span(recall, 0, 0.4))));
    if (recall > 0) {
      const lines = smooth(span(recall, 0.35, 0.9));
      ctx.strokeStyle = `rgba(192,57,43,${(0.75 * lines).toFixed(3)})`;
      ctx.lineWidth = 1;
      nnList.forEach((i, n) => {
        const l = clamp01(lines * K - n);
        if (l <= 0) return;
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(qx + (X[i] - qx) * l, qy + (Y[i] - qy) * l);
        ctx.stroke();
      });
    }

    // points
    const dim = recall > 0 ? 1 - 0.55 * smooth(span(recall, 0.3, 0.8)) : 1;
    for (let i = 0; i < pts.length; i++) {
      if (A[i] <= 0) continue;
      const hit = recall > 0.5 && nn.has(i);
      ctx.fillStyle = hit
        ? 'rgba(192,57,43,1)'
        : `rgba(250,247,240,${(0.8 * A[i] * dim).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(X[i], Y[i], hit ? pts[i].r + 1.4 : pts[i].r, 0, Math.PI * 2);
      ctx.fill();
      if (hit) {
        ctx.strokeStyle = 'rgba(192,57,43,0.45)';
        ctx.beginPath();
        ctx.arc(X[i], Y[i], pts[i].r + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (recall > 0) {
      const a = smooth(span(recall, 0, 0.3));
      ctx.fillStyle = `rgba(192,57,43,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(qx, qy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(192,57,43,${(0.5 * a).toFixed(3)})`;
      const ring = 10 + ((time * 0.02) % 18);
      ctx.beginPath();
      ctx.arc(qx, qy, ring, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = '11px "DM Mono", ui-monospace, monospace';
      const l1 = w < 600 ? 'query · "northgate — paid?"' : 'query · "northgate quote — paid?"';
      const l2 = `top-${K} memories · cos ≥ 0.82`;
      // Labels sit right of the query, or left of it if they would run off.
      const room = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 24;
      // Right of the query; else left of it; else pinned inside the right
      // edge and lifted clear of the point.
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
      ctx.fillStyle = `rgba(154,149,168,${smooth(span(recall, 0.8, 1)).toFixed(3)})`;
      ctx.fillText(l2, lx, ly + 16);
      ctx.textAlign = 'start';
    }

    // cluster labels
    if (embed > 0.4) {
      const a = smooth(span(embed, 0.4, 1)) * (recall > 0 ? 1 - 0.5 * recall : 1);
      ctx.font = '10px "DM Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      CLUSTERS.forEach((c) => {
        ctx.fillStyle = `rgba(154,149,168,${a.toFixed(3)})`;
        ctx.fillText(c.name.toUpperCase().split('').join(' '), fx(c.x), fy(c.y) - field.h * 0.16);
      });
      ctx.textAlign = 'start';
    }
  };

  const ref = useScrollProgress((p) => {
    state.current.p = p;
    paintHud(p);
    if (!raf.current) draw(performance.now());
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
    const loop = (t) => {
      draw(t);
      raf.current = visible.current ? requestAnimationFrame(loop) : 0;
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
    <section ref={ref} className="neural relative bg-ink text-cream" style={{ height: '320vh' }} aria-labelledby="neural-title">
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
