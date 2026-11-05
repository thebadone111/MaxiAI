import { useEffect, useRef, useState } from 'react';
import { useHydrated, useReducedMotion } from '../motion/hooks.js';
import { reducedMotion } from '../motion/smooth.js';

/*
 * Small "live" details — the precision layer.
 */

/**
 * London local time, ticking. The prerender cannot know the time, so the
 * server and the hydration pass render the city alone and the clock appears
 * straight after hydration (no mismatch, no layout shift: the slot is fixed
 * width in tabular figures).
 */
export function LondonTime({ className = '' }) {
  const hydrated = useHydrated();
  const [now, setNow] = useState(null);
  useEffect(() => {
    if (!hydrated) return;
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hydrated]);
  return (
    <span className={`tabular ${className}`}>
      London <span className="inline-block min-w-[8ch]">{now ?? ' '}</span>
    </span>
  );
}

/**
 * The build stamp: date and commit, injected by vite.config.js at build
 * time. A quiet signal that the site is software someone ships.
 */
export function BuildStamp({ className = '' }) {
  // eslint-disable-next-line no-undef
  const b = typeof __BUILD__ !== 'undefined' ? __BUILD__ : { date: 'dev', sha: 'local' };
  return (
    <span className={className}>
      Build {b.sha} · {b.date}
    </span>
  );
}

const GLYPHS = '01<>/{}[]=+*#%&$ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Decode — text that resolves left to right out of mono glyphs the first
 * time it scrolls into view. For eyebrows, tier numbers and prices: short
 * strings in DM Mono, where every glyph is the same width and nothing
 * shifts.
 *
 * The real text is in the HTML (prerendered, and for screen readers via a
 * visually hidden copy); the scramble is a decorative layer written straight
 * to a text node and is skipped entirely under reduced motion.
 */
export function Decode({ text, className = '', duration = 650, delay = 0 }) {
  const shown = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = shown.current;
    if (!el || reduced || reducedMotion() || typeof IntersectionObserver === 'undefined') return;
    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      // Already on screen at load: leave it be — a reveal is a reward for
      // scrolling, not a tax on arriving.
      if (performance.now() < 600) return;
      timer = setTimeout(() => {
        const t0 = performance.now();
        const step = (now) => {
          const k = Math.min(1, (now - t0) / duration);
          const settled = Math.floor(text.length * k);
          let out = text.slice(0, settled);
          for (let i = settled; i < text.length; i++) {
            out += text[i] === ' ' ? ' ' : GLYPHS[(i * 7 + Math.floor(now / 40)) % GLYPHS.length];
          }
          el.textContent = out;
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }, delay);
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text, duration, delay, reduced]);
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={shown} aria-hidden="true">{text}</span>
    </span>
  );
}
