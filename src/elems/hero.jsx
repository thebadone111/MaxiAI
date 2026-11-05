import Actions from './actions.jsx';
import { STATUS } from '../data/site.js';
import { useIntroDone } from '../intro/state.js';
import { LondonTime } from './live.jsx';
import Visual from '../visuals/Visual.jsx';

/*
 * The page hero.
 *
 * Its arrival is not scroll-driven: it waits on the intro (useIntroDone),
 * and starts on the first frame of the intro's exit so the two read as one
 * event. On an ordinary page load `is-in` is present on the first paint and
 * nothing animates. Delays and durations per element (after Minifinans):
 *
 *   eyebrow 0 · rule 80 · h1 120 · lead 320 · actions 560 · meta 700 · status 820
 *
 * The type is settled by the time the overlay unmounts (~1150 ms); the
 * actions and meta are still moving, which is what makes it one event.
 *
 * `visual` names a slot in src/visuals/registry.jsx; it renders to the
 * right of the type on wide screens (photo or code, per the visual mode).
 */
function Hero({ eyebrow, title, lead, actions, meta, status = STATUS, visual }) {
  const arrived = useIntroDone();
  const r = (d, dur) => ({ '--d': `${d}ms`, ...(dur && { '--dur': `${dur}ms` }) });

  return (
    <section className={`relative overflow-hidden bg-cream ${arrived ? 'is-in' : ''}`}>
      <div className={`wrap relative pb-24 pt-20 md:pb-32 md:pt-28 ${visual ? 'lg:grid lg:grid-cols-12 lg:gap-12' : ''}`}>
        <div className={visual ? 'lg:col-span-7' : ''}>
          <span className="eyebrow hero-rise block" style={r(0, 500)}>{eyebrow}</span>
          <span className="signal-rule hero-rule mb-10 mt-6" style={r(80)} />

          <h1
            className={`hero-rise max-w-[900px] font-display text-[44px] font-light leading-[1.02] text-ink ${
              visual ? 'md:text-[68px] xl:text-[76px]' : 'md:text-[80px] xl:text-[88px]'
            }`}
            style={r(120, 700)}
          >
            {title}
          </h1>

          {lead && (
            <p
              className="hero-rise mt-10 max-w-[720px] font-prose text-[19px] leading-[1.6] text-ink-soft md:text-[22px]"
              style={r(320, 700)}
            >
              {lead}
            </p>
          )}

          {actions && (
            <div className="hero-rise" style={r(560, 900)}>
              <Actions {...actions} className="mt-12" />
            </div>
          )}

          {meta && (
            <div className="hero-rise mt-14 flex flex-wrap gap-x-14 gap-y-5" style={r(700, 900)}>
              {meta.map((m, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mid">{m.label}</span>
                  <span className="font-ui text-[16px] font-medium text-ink">{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {status && (
            <div
              className="hero-rise mt-16 inline-flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-stone pt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mid"
              style={r(820, 900)}
            >
              <span className="inline-flex items-center gap-3">
                <span className="pulse-dot" />
                <span>{status}</span>
              </span>
              <span className="hidden text-stone sm:inline">/</span>
              <LondonTime className="hidden sm:inline" />
            </div>
          )}
        </div>

        {visual && (
          <div className="relative mt-16 hidden lg:col-span-5 lg:mt-0 lg:block">
            <Visual slot={visual} hero />
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
