import { Link } from 'react-router-dom';
import Reveal from './reveal.jsx';

/**
 * Layout primitives for the two legal notices.
 *
 * Long-form legal text has a different job from the marketing pages: it has
 * to be searched, not just read through. So the measure is narrower, the
 * clauses are numbered and individually linkable, and there is a contents
 * rail that sticks. Motion is deliberately limited to the headings — a
 * fade-up on every paragraph of a privacy notice reads as evasive.
 */

/* ── Page head ─────────────────────────────────────────── */

export function LegalHero({ eyebrow, title, lead, updated, meta = [] }) {
  return (
    <section className="bg-cream relative overflow-hidden border-b border-stone">
      <div
        className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #E8E4D8 0%, transparent 70%)',
          transform: 'translate(20%, -30%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-20 relative">
        <Reveal variant="fade">
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <Reveal variant="rule" as="hr" delay={150} className="mt-6 mb-10" />

        <Reveal variant="up" delay={250}>
          <h1 className="font-display text-[40px] md:text-[72px] leading-[1.02] font-light text-ink max-w-[900px]">
            {title}
          </h1>
        </Reveal>

        {lead && (
          <Reveal variant="up" delay={400}>
            <p className="font-prose text-[19px] md:text-[21px] leading-[1.65] text-ink-soft mt-10 max-w-[720px]">
              {lead}
            </p>
          </Reveal>
        )}

        <Reveal variant="up" delay={550}>
          <div className="flex flex-wrap gap-x-14 gap-y-5 mt-14">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mid">In effect from</span>
              <span className="font-ui text-[16px] font-medium text-ink">{updated}</span>
            </div>
            {meta.map((m, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mid">{m.label}</span>
                <span className="font-ui text-[16px] font-medium text-ink">{m.value}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Contents rail + clause body ───────────────────────── */

function Contents({ sections }) {
  return (
    <nav aria-label="Contents" className="lg:sticky lg:top-10">
      <span className="eyebrow">Contents</span>
      <hr className="signal-rule mt-5 mb-8" />
      <ol className="space-y-3">
        {sections.map((s, i) => (
          <li key={s.id} className="flex gap-3 items-baseline">
            <span className="font-mono text-[11px] text-ink-mid shrink-0">{String(i + 1).padStart(2, '0')}</span>
            <a
              href={`#${s.id}`}
              className="font-ui text-[14px] leading-snug text-ink-soft hover:text-signal transition-colors"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * LegalBody — renders both the contents rail and the numbered clauses from
 * one section list, so the two can never drift apart.
 */
export function LegalBody({ sections }) {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
        <div className="lg:col-span-3">
          <Contents sections={sections} />
        </div>

        <div className="lg:col-span-9 max-w-[760px]">
          {sections.map((s, i) => (
            <Clause key={s.id} id={s.id} n={i + 1} title={s.title}>
              {s.body}
            </Clause>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clause({ id, n, title, children }) {
  return (
    <section id={id} className="scroll-mt-10 mb-20 last:mb-0">
      <Reveal variant="up">
        <div className="border-t border-stone pt-8">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal">
            {String(n).padStart(2, '0')}
          </span>
          <h2 className="font-display font-semibold text-[28px] md:text-[34px] leading-[1.15] text-ink mt-4">
            {title}
          </h2>
        </div>
      </Reveal>
      <div className="mt-7 space-y-6">{children}</div>
    </section>
  );
}

/* ── Text primitives ───────────────────────────────────── */

export function P({ children }) {
  return <p className="font-prose text-[17px] md:text-[18px] leading-[1.75] text-ink-soft">{children}</p>;
}

/** A run-in sub-heading inside a clause, for the longer sections. */
export function H({ children }) {
  return <h3 className="font-display font-semibold text-[21px] md:text-[23px] text-ink pt-4">{children}</h3>;
}

export function Bullets({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="font-prose text-[17px] md:text-[18px] text-ink-soft leading-[1.7] flex gap-3">
          <span className="text-signal font-mono text-[13px] mt-1 shrink-0">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Pulled-out statement, for the handful of commitments worth not burying. */
export function Note({ children }) {
  return (
    <div className="border-l-2 border-signal pl-6 py-1">
      <p className="font-prose italic text-[17px] md:text-[18px] leading-[1.7] text-ink">{children}</p>
    </div>
  );
}

/**
 * Table — the lawful-basis and retention schedules. Wide content scrolls
 * inside its own box rather than pushing the page sideways.
 */
export function Table({ head, rows }) {
  return (
    <div className="overflow-x-auto border border-stone">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="bg-stone">
            {head.map((h, i) => (
              <th
                key={i}
                className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink px-5 py-4 align-bottom font-normal"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-stone align-top">
              {r.map((cell, j) => (
                <td key={j} className="font-prose text-[15px] leading-[1.6] text-ink-soft px-5 py-5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Closing note on a dark ground — where to write if something here is wrong. */
export function LegalFootNote({ children }) {
  return (
    <section className="bg-ink text-cream py-16">
      <div className="max-w-[860px] mx-auto px-6 md:px-10">
        <span className="eyebrow">Questions</span>
        <hr className="signal-rule mt-5 mb-8" />
        <p className="font-prose text-[18px] md:text-[19px] leading-[1.7] text-cream">{children}</p>
      </div>
    </section>
  );
}

export function Xlink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-signal underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
    >
      {children}
    </Link>
  );
}

export function Alink({ href, children }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-signal underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
    >
      {children}
    </a>
  );
}
