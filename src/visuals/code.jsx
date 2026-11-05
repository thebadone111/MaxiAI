import { useEffect, useRef, useState } from 'react';
import { useHydrated, useReducedMotion, useScrollProgress } from '../motion/hooks.js';
import { useIntroDone } from '../intro/state.js';
import './code.css';

/*
 * The code variant's media: procedural visuals, drawn rather than
 * photographed. SVG and DOM only — no canvas, no library — so they are
 * crisp at any size, cost a few KB, and render complete in the prerendered
 * HTML (the drawn-on-scroll state defaults to finished: --p is 1 until
 * JavaScript takes over).
 *
 * Every panel is the same object: an ink instrument with a mono header
 * strip and a live dot. Signal red is used for one thing per panel — the
 * live element — to keep it rationed.
 */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Drives --p (0..1) on the element from its scroll progress: drawing starts
   as it enters and is complete by the time it is mid-screen. */
function useDraw(from = 0.08, len = 0.42) {
  return useScrollProgress((p, el) => {
    el.style.setProperty('--p', clamp01((p - from) / len).toFixed(3));
  }, { rest: 1 });
}

/* A value that ticks once a second on the client, and is `initial` in the
   prerender, on the hydration pass, and under reduced motion. */
function useTicker(initial, next, ms = 1000) {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const [v, setV] = useState(initial);
  useEffect(() => {
    if (!hydrated || reduced) return;
    const id = setInterval(() => setV((x) => next(x)), ms);
    return () => clearInterval(id);
  }, [hydrated, reduced, ms]); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}

export function Panel({ label, status = 'live', children, className = '', dark = false }) {
  return (
    <div className={`code-panel ${dark ? 'on-dark' : ''} ${className}`}>
      <div className="code-strip">
        <span>{label}</span>
        <span className="inline-flex items-center gap-2">
          <span className="pulse-dot" /> {status}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* A small labelled node for the SVG diagrams. */
function Node({ x, y, label, sub, hot = false, s = 0 }) {
  return (
    <g className="code-node" style={{ '--s': s }} transform={`translate(${x} ${y})`}>
      <rect x="-46" y="-17" width="92" height="34" rx="2" className={hot ? 'hot' : ''} />
      <text y={sub ? -2 : 4} textAnchor="middle" className="code-node-label">{label}</text>
      {sub && <text y="10" textAnchor="middle" className="code-node-sub">{sub}</text>}
    </g>
  );
}

function Wire({ d, s = 0, pulse = false, dur = 2.4, delay = 0 }) {
  return (
    <g>
      <path d={d} pathLength="1" className="code-wire" style={{ '--s': s }} />
      {pulse && (
        <circle r="2.6" className="code-packet" style={{ offsetPath: `path('${d}')`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }} />
      )}
    </g>
  );
}

/* ─── Home hero: the live system ───────────────────────────────────────── */

export function LiveSystem() {
  const arrived = useIntroDone();
  const latency = useTicker(42, (v) => Math.max(31, Math.min(58, v + Math.round((Math.random() - 0.5) * 8))));
  const reqs = useTicker(1284, (v) => v + 3 + Math.round(Math.random() * 9));
  const W = 400;
  const wires = [
    ['M200 92 L200 150', 0],
    ['M200 184 C200 210 110 210 110 236', 0.15],
    ['M200 184 L200 236', 0.2],
    ['M200 184 C200 210 290 210 290 236', 0.25],
    ['M110 270 C110 300 200 300 200 326', 0.4],
    ['M290 270 C290 300 200 300 200 326', 0.45],
  ];
  return (
    <Panel label="maxi / client-system" className={`code-hero ${arrived ? 'is-in' : ''}`}>
      <svg viewBox={`0 0 ${W} 360`} className="code-svg" aria-hidden="true">
        <defs>
          <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" className="code-dot" />
          </pattern>
        </defs>
        <rect width={W} height="360" fill="url(#dots)" />
        {wires.map(([d, s], i) => <Wire key={i} d={d} s={s} pulse dur={2 + i * 0.35} delay={i * 0.4} />)}
        <Node x={200} y={75} label="visitors" sub="global" s={0} />
        <Node x={200} y={167} label="edge" sub="tls · cache" s={0.1} hot />
        <Node x={110} y={253} label="site" sub="london-1" s={0.3} />
        <Node x={200} y={253} label="api" sub="workers" s={0.32} />
        <Node x={290} y={253} label="m365" sub="identity" s={0.34} />
        <Node x={200} y={343} label="backups" sub="daily · 30d" s={0.5} />
      </svg>
      <dl className="code-metrics">
        <div><dt>uptime · 90d</dt><dd>99.98%</dd></div>
        <div><dt>p95 latency</dt><dd className="tabular">{latency} ms</dd></div>
        <div><dt>requests today</dt><dd className="tabular">{reqs.toLocaleString('en-GB')}</dd></div>
        <div><dt>last deploy</dt><dd>✓ passed</dd></div>
      </dl>
    </Panel>
  );
}

/* ─── Services: infrastructure topology, drawn on scroll ──────────────── */

export function Topology({ dark }) {
  const ref = useDraw();
  return (
    <div ref={ref} className="absolute inset-0">
      <Panel label="infrastructure / topology" status="monitored" dark={dark} className="h-full">
        <svg viewBox="0 0 400 440" className="code-svg" aria-hidden="true">
          <Wire d="M200 60 L200 130" s={0} />
          <Wire d="M200 164 C200 200 90 190 90 230" s={0.12} pulse dur={2.6} />
          <Wire d="M200 164 C200 200 310 190 310 230" s={0.16} pulse dur={2.9} delay={0.6} />
          <Wire d="M200 164 L200 230" s={0.14} />
          <Wire d="M90 264 C90 310 200 300 200 340" s={0.32} />
          <Wire d="M200 264 L200 340" s={0.3} pulse dur={2.2} delay={1} />
          <Wire d="M310 264 C310 310 200 300 200 340" s={0.34} />
          <Wire d="M200 374 L200 412" s={0.5} />
          <Node x={200} y={44} label="your team" sub="12 seats" s={0} />
          <Node x={200} y={147} label="firewall" sub="cyber essentials" s={0.08} hot />
          <Node x={90} y={247} label="website" sub="hosting" s={0.24} />
          <Node x={200} y={247} label="identity" sub="mfa · sso" s={0.26} />
          <Node x={310} y={247} label="email" sub="m365" s={0.28} />
          <Node x={200} y={357} label="backup" sub="encrypted" s={0.44} />
          <text x="200" y="432" textAnchor="middle" className="code-caption" style={{ '--s': 0.6 }}>one engineer · one point of contact</text>
        </svg>
      </Panel>
    </div>
  );
}

/* ─── About: the four markets, with local times ───────────────────────── */

const CITIES = [
  { code: 'LDN', name: 'London', tz: 'Europe/London', lon: -0.13, lat: 51.5, hq: true },
  { code: 'STO', name: 'Stockholm', tz: 'Europe/Stockholm', lon: 18.07, lat: 59.33 },
  { code: 'MLA', name: 'Valletta', tz: 'Europe/Malta', lon: 14.51, lat: 35.9 },
  { code: 'HKG', name: 'Hong Kong', tz: 'Asia/Hong_Kong', lon: 114.17, lat: 22.3 },
];

// A stylised projection into the 4:5 panel: not a map, a route card.
const px = (lon) => 60 + ((lon + 10) / 135) * 280;
const py = (lat) => 360 - ((lat - 15) / 50) * 300;

function useClock(tz) {
  const hydrated = useHydrated();
  const [t, setT] = useState(null);
  useEffect(() => {
    if (!hydrated) return;
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [hydrated, tz]);
  return t ?? '--:--';
}

function City({ c, s }) {
  const time = useClock(c.tz);
  const x = px(c.lon);
  const y = py(c.lat);
  const right = x > 260;
  return (
    <g className="code-node" style={{ '--s': s }}>
      <circle cx={x} cy={y} r={c.hq ? 5 : 3.5} className={c.hq ? 'code-city hq' : 'code-city'} />
      {c.hq && <circle cx={x} cy={y} r="12" className="code-ping" />}
      <text x={right ? x - 10 : x + 10} y={y - 4} textAnchor={right ? 'end' : 'start'} className="code-node-label">{c.code}</text>
      <text x={right ? x - 10 : x + 10} y={y + 9} textAnchor={right ? 'end' : 'start'} className="code-node-sub tabular">{time}</text>
    </g>
  );
}

export function MarketMap({ dark }) {
  const ref = useDraw();
  const [ldn, ...rest] = CITIES;
  const arc = (b) => {
    const x1 = px(ldn.lon), y1 = py(ldn.lat), x2 = px(b.lon), y2 = py(b.lat);
    const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.28 - 20;
    return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
  };
  return (
    <div ref={ref} className="absolute inset-0">
      <Panel label="clients / four markets" status="in hours" dark={dark} className="h-full">
        <svg viewBox="0 0 400 440" className="code-svg" aria-hidden="true">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 L0 0 0 20" className="code-grid" />
            </pattern>
          </defs>
          <rect width="400" height="440" fill="url(#grid)" />
          {rest.map((c, i) => <Wire key={c.code} d={arc(c)} s={0.1 + i * 0.12} pulse dur={2.4 + i * 0.5} delay={i * 0.5} />)}
          {CITIES.map((c, i) => <City key={c.code} c={c} s={i === 0 ? 0 : 0.25 + i * 0.12} />)}
          <text x="200" y="420" textAnchor="middle" className="code-caption" style={{ '--s': 0.7 }}>london hq · uk · se · mt · hk</text>
        </svg>
      </Panel>
    </div>
  );
}

/* ─── AI Product: one source of truth, every channel ──────────────────── */

const CHANNELS = ['instagram', 'tiktok', 'youtube', 'x', 'linkedin', 'newsletter'];

export function FanOut({ dark }) {
  const ref = useDraw();
  const y0 = 80;
  const step = 56;
  return (
    <div ref={ref} className="absolute inset-0">
      <Panel label="publish / one source" status="scheduled" dark={dark} className="h-full">
        <svg viewBox="0 0 400 440" className="code-svg" aria-hidden="true">
          {CHANNELS.map((c, i) => {
            const y = y0 + i * step;
            return <Wire key={c} d={`M146 220 C220 220 210 ${y} 268 ${y}`} s={0.12 + i * 0.05} pulse dur={2.2} delay={i * 0.3} />;
          })}
          <g className="code-node" style={{ '--s': 0 }} transform="translate(92 220)">
            <rect x="-54" y="-40" width="108" height="80" rx="2" className="hot" />
            <text y="-14" textAnchor="middle" className="code-node-label">post.md</text>
            <text y="4" textAnchor="middle" className="code-node-sub">caption · cuts</text>
            <text y="20" textAnchor="middle" className="code-node-sub">schedule 18:00</text>
          </g>
          {CHANNELS.map((c, i) => (
            <g key={c} className="code-node" style={{ '--s': 0.3 + i * 0.06 }} transform={`translate(318 ${y0 + i * step})`}>
              <rect x="-50" y="-15" width="100" height="30" rx="2" />
              <text y="4" textAnchor="middle" className="code-node-label">{c}</text>
            </g>
          ))}
          <text x="200" y="428" textAnchor="middle" className="code-caption" style={{ '--s': 0.7 }}>formatted per platform · one dashboard</text>
        </svg>
      </Panel>
    </div>
  );
}

/* ─── Programme: the care plan, as an uptime record ───────────────────── */

// Ninety days, deterministic: two short dips, the rest full.
const DAYS = Array.from({ length: 90 }, (_, i) => (i === 23 ? 0.72 : i === 61 ? 0.86 : 1));

export function Uptime({ dark }) {
  const ref = useDraw(0.05, 0.5);
  return (
    <div ref={ref} className="absolute inset-0">
      <Panel label="care plan / your-business.co.uk" status="up" dark={dark} className="h-full">
        <div className="flex h-full flex-col justify-between p-6">
          <div>
            <p className="code-big tabular">99.98<span>%</span></p>
            <p className="code-sub">uptime · last 90 days</p>
          </div>
          <div className="code-bars" aria-hidden="true">
            {DAYS.map((h, i) => (
              <span key={i} style={{ '--h': h, '--s': (i / 90) * 0.6 }} className={h < 1 ? 'dip' : ''} />
            ))}
          </div>
          <dl className="code-list">
            <div><dt>backups</dt><dd>daily ✓</dd></div>
            <div><dt>ssl</dt><dd>auto-renews</dd></div>
            <div><dt>domain</dt><dd>in your name</dd></div>
            <div><dt>changes</dt><dd>2 working days</dd></div>
          </dl>
        </div>
      </Panel>
    </div>
  );
}

/* ─── Home reveal: the editor that opens ──────────────────────────────── */

const K = (t) => ['k', t];
const S = (t) => ['s', t];
const C = (t) => ['c', t];
const P = (t) => ['p', t];
const F = (t) => ['f', t];

const CODE = [
  [C('// care-plan.ts — what £100 a month actually runs')],
  [K('import'), P(' { site, backup, monitor } '), K('from'), S(" '@maxi/ops'")],
  [],
  [K('export const'), P(' plan = '), F('site'), P('('), S("'your-business.co.uk'"), P(', {')],
  [P('  hosting:   '), S("'london-1'"), P(',')],
  [P('  tls:       '), S("'auto-renew'"), P(',')],
  [P('  backups:   backup.'), F('daily'), P('({ keep: '), ['n', '30'], P(' }),')],
  [P('  uptime:    monitor.'), F('every'), P('('), S("'60s'"), P('),')],
  [P('  changes:   { turnaround: '), S("'2 working days'"), P(' },')],
  [P('  owner:     '), S("'you'"), P(',  '), C('// the domain is yours')],
  [P('})')],
  [],
  [K('await'), P(' plan.'), F('deploy'), P('()')],
];

const TERM = [
  [['m', '$ '], P('maxi deploy')],
  [['m', '› '], P('build        '), ['ok', '✓'], ['m', ' 1.2s']],
  [['m', '› '], P('tests        '), ['ok', '✓'], ['m', ' 48 passed']],
  [['m', '› '], P('security     '), ['ok', '✓'], ['m', ' headers · tls · deps']],
  [['m', '› '], P('deploy       '), ['ok', '✓'], ['m', ' london-1']],
  [['live', '● live  '], P('your-business.co.uk')],
];

const lineLen = (line) => line.reduce((n, [, t]) => n + t.length, 0);

function Lines({ lines, refs }) {
  return lines.map((line, i) => (
    <div key={i} className="code-line">
      <span className="code-ln">{String(i + 1).padStart(2, ' ')}</span>
      <span ref={(el) => { refs.current[i] = el; }} className="code-text" style={{ width: `${lineLen(line)}ch` }}>
        {line.length ? line.map(([cls, t], j) => <span key={j} className={`tk-${cls}`}>{t}</span>) : ' '}
      </span>
    </div>
  ));
}

/**
 * The editor that opens. It fills the home reveal scene's window and types
 * itself as the window opens — every character is a pure function of scroll
 * progress, so scrolling back un-types it and a reload lands on the same
 * frame. `register` is supplied by RevealScene.
 */
export function EditorReveal({ register }) {
  const codeRefs = useRef([]);
  const termRefs = useRef([]);
  const caret = useRef(null);

  useEffect(() => {
    const total = CODE.reduce((n, l) => n + Math.max(1, lineLen(l)), 0);
    const termTotal = TERM.length;
    let last = -1;
    return register((p) => {
      const typed = Math.round(clamp01((p - 0.12) / 0.5) * total);
      const shownTerm = Math.floor(clamp01((p - 0.62) / 0.25) * termTotal + 0.0001);
      const key = typed * 100 + shownTerm;
      if (key === last) return;
      last = key;
      let left = typed;
      let caretLine = CODE.length - 1;
      let caretCol = lineLen(CODE[CODE.length - 1]);
      let placed = false;
      CODE.forEach((line, i) => {
        const len = Math.max(1, lineLen(line));
        const n = Math.max(0, Math.min(len, left));
        const el = codeRefs.current[i];
        if (el) el.style.width = `${line.length ? n : 0}ch`;
        if (!placed && left < len) {
          placed = true;
          caretLine = i;
          caretCol = line.length ? n : 0;
        }
        left -= len;
      });
      TERM.forEach((_, i) => {
        const el = termRefs.current[i];
        if (el) el.style.width = i < shownTerm ? `${lineLen(TERM[i])}ch` : '0ch';
      });
      // The caret is one absolutely positioned element moved by transform —
      // never re-parented, so React's tree is left alone.
      if (caret.current) {
        caret.current.style.transform =
          `translate(calc(var(--ln-w) + ${caretCol}ch), calc(${caretLine} * var(--lh)))`;
      }
    });
  }, [register]);

  return (
    <div className="code-editor">
      <aside className="code-tree" aria-hidden="true">
        <p className="code-tree-head">your-business</p>
        <p>▾ ops</p>
        <p className="on">· care-plan.ts</p>
        <p>· monitor.ts</p>
        <p>· backup.ts</p>
        <p>▸ site</p>
        <p>▸ mail</p>
        <p className="code-tree-foot">main · ✓ synced</p>
      </aside>
      <div className="code-main">
        <div className="code-tab">care-plan.ts</div>
        <div className="code-body" aria-hidden="true">
          <Lines lines={CODE} refs={codeRefs} />
          <span ref={caret} className="caret code-caret" />
        </div>
        <div className="code-term" aria-hidden="true">
          <Lines lines={TERM} refs={termRefs} />
        </div>
        <p className="sr-only">
          An example configuration: a care plan for a client website with London hosting, automatic TLS,
          daily backups kept for 30 days, uptime checks every minute and a two working day turnaround on changes.
        </p>
      </div>
    </div>
  );
}
