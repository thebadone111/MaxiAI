import { useCallback, useRef } from 'react';
import { useHydrated, useMinWidth, useReducedMotion, useScrollProgress } from '../motion/hooks.js';
import { EditorReveal } from '../visuals/code.jsx';
import { Section, SectionHead } from './section.jsx';
import Reveal from './reveal.jsx';

/*
 * Scroll scenes: sequences the scroll drives directly. Each one is ported
 * from a sibling site and runs on the shared engine in src/motion — measured
 * once, then arithmetic and transform writes per frame, no React renders.
 */

const easeOut = (x) => 1 - Math.pow(1 - x, 3);

/* ─── The window that opens ─────────────────────────────────────────────
 *
 * After Minifinans' ImageReveal. A window at 42% of the screen opens to full
 * bleed as you scroll; its content counter-scales so it stays at natural
 * size — the window opens around the editor, which types itself as it
 * does — and the corner radius is divided by the frame's scale so it stays
 * a constant size on screen and lands at 0. Transforms only.
 */
const START = 0.42;
const RADIUS = 6;

export function HomeReveal({ caption }) {
  const frame = useRef(null);
  const inner = useRef(null);
  const listeners = useRef(new Set());

  const register = useCallback((fn) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  }, []);

  const ref = useScrollProgress((p) => {
    const k = easeOut(Math.min(1, p / 0.55));
    const s = START + (1 - START) * k;
    if (frame.current) {
      frame.current.style.transform = `scale(${s.toFixed(4)})`;
      frame.current.style.borderRadius = `${((RADIUS * (1 - k)) / s).toFixed(2)}px`;
    }
    if (inner.current) inner.current.style.transform = `scale(${(1 / s).toFixed(4)})`;
    listeners.current.forEach((fn) => fn(p, k));
  }, { span: true, rest: 1 });

  return (
    <section ref={ref} className="relative bg-cream" style={{ height: '260vh' }} aria-label="Our work, in practice">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          ref={frame}
          className="will-move absolute inset-0 overflow-hidden bg-ink"
          style={{ transform: `scale(${START})`, borderRadius: RADIUS / START }}
        >
          <div
            ref={inner}
            className="will-move absolute inset-0"
            style={{ transform: `scale(${1 / START})` }}
          >
            <EditorReveal register={register} />
          </div>
        </div>
        {caption && (
          <p className="absolute inset-x-0 bottom-0 px-6 pb-8 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-cream mix-blend-difference sm:px-10">
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── The process track ─────────────────────────────────────────────────
 *
 * After Minifinans' ProcessTrack. The steps on a horizontal track that the
 * vertical scroll drives, with a progress rule and a counter on screen
 * throughout. Short — about half a viewport per step.
 *
 * Below 1280px, under reduced motion, and in the prerender, it is the plain
 * row of steps: no scroll is taken over on a phone.
 */
function Steps({ items, dark }) {
  return (
    <div className={`grid grid-cols-1 gap-px border ${items.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} ${dark ? 'border-cream/10 bg-cream/10' : 'border-stone bg-stone'}`}>
      {items.map((s, i) => (
        <div key={s.title} className={`${dark ? 'bg-ink' : 'bg-cream'} lift p-10`}>
          <Reveal variant="up" delay={i * 110}>
            <span className="font-mono text-[28px] font-light text-signal">{String(i + 1).padStart(2, '0')}</span>
            <h3 className={`mb-4 mt-6 font-display text-[24px] font-semibold ${dark ? 'text-cream' : 'text-ink'}`}>{s.title}</h3>
            <p className={`font-prose text-[17px] leading-relaxed ${dark ? 'text-cream/90' : 'text-ink-soft'}`}>{s.body}</p>
          </Reveal>
        </div>
      ))}
    </div>
  );
}

function Track({ items, eyebrow, title, lead }) {
  const track = useRef(null);
  const bar = useRef(null);
  const counter = useRef(null);
  const distance = useRef(0);
  const active = useRef(-1);
  const panels = useRef([]);
  const n = items.length;

  const ref = useScrollProgress((p) => {
    if (!track.current) return;
    track.current.style.transform = `translate3d(${(-p * distance.current).toFixed(1)}px, 0, 0)`;
    bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    const i = Math.min(n - 1, Math.floor(p * n));
    if (i === active.current) return;
    panels.current[active.current]?.classList.remove('is-active');
    panels.current[i]?.classList.add('is-active');
    counter.current.textContent = String(i + 1).padStart(2, '0');
    active.current = i;
  }, {
    span: true,
    rest: 0,
    measure: () => {
      const el = track.current;
      if (el) distance.current = Math.max(0, el.scrollWidth - el.parentElement.clientWidth);
    },
  });

  return (
    <section ref={ref} className="relative bg-ink text-cream" style={{ height: `${n * 55 + 60}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="wrap w-full">
          <div className="flex items-end justify-between gap-10 pb-16">
            <div className="max-w-[720px]">
              <span className="eyebrow">{eyebrow}</span>
              <span className="signal-rule mb-8 mt-5" />
              <h2 className="font-display text-[56px] font-light leading-[1.05] text-cream">{title}</h2>
              {lead && <p className="mt-6 max-w-[620px] font-prose text-[19px] leading-[1.65] text-cream/85">{lead}</p>}
            </div>
            <p className="tabular m-0 font-mono text-[52px] font-light leading-none text-signal">
              <span ref={counter}>01</span>
              <span className="text-cream/30"> / {String(n).padStart(2, '0')}</span>
            </p>
          </div>
        </div>

        <ol
          ref={track}
          className="will-move m-0 flex list-none p-0"
          style={{ paddingLeft: 'max(var(--gutter), calc((100vw - 1280px) / 2 + var(--gutter)))' }}
        >
          {items.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => { panels.current[i] = el; }}
              className="track-panel flex w-[46vw] max-w-[680px] shrink-0 flex-col pr-[6vw]"
            >
              <div className="h-px w-full bg-cream/25" aria-hidden="true" />
              <span className="tabular mt-6 block font-mono text-[28px] font-light text-signal" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-[30px] font-semibold text-cream">{step.title}</h3>
              <p className="mt-4 max-w-[42ch] font-prose text-[17px] leading-relaxed text-cream/85">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="wrap mt-16 w-full">
          <div className="h-px w-full bg-cream/15">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-signal" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcessTrack({ items, eyebrow, title, lead, id }) {
  const hydrated = useHydrated();
  const wide = useMinWidth(1280);
  const reduced = useReducedMotion();

  if (!hydrated || !wide || reduced) {
    return (
      <Section dark id={id}>
        <SectionHead dark eyebrow={eyebrow} title={title} lead={lead} />
        <Steps items={items} dark />
      </Section>
    );
  }
  return (
    <div id={id}>
      <Track items={items} eyebrow={eyebrow} title={title} lead={lead} />
    </div>
  );
}

/* ─── The manifesto ─────────────────────────────────────────────────────
 *
 * After MaisonMere's Manifesto. A paragraph whose words light one at a time
 * as it scrolls through the viewport — only the words that changed are
 * touched. The text is plain text in the HTML; the dimming is decoration.
 */
export function Manifesto({ text, className = '' }) {
  const words = text.split(' ');
  const spans = useRef([]);
  // Every word starts lit, as in the prerendered HTML; the first scroll
  // frame dims the ones the reader has not reached.
  const lit = useRef(words.length);

  const ref = useScrollProgress((p) => {
    const n = Math.round(Math.min(1, Math.max(0, (p - 0.18) / 0.42)) * words.length);
    if (n === lit.current) return;
    const [a, b] = n > lit.current ? [lit.current, n] : [n, lit.current];
    for (let i = a; i < b; i++) spans.current[i]?.classList.toggle('lit', i < n);
    lit.current = n;
  }, { rest: 1 });

  return (
    <div>
      <p ref={ref} className={`mf-text font-display text-[30px] font-light leading-[1.3] md:text-[46px] ${className}`}>
        {words.map((w, i) => (
          <span key={i}>
            <span ref={(el) => { spans.current[i] = el; }} className="mf-word lit">{w}</span>{' '}
          </span>
        ))}
      </p>
    </div>
  );
}
