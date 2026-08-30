import { Link } from 'react-router-dom';
import Reveal from './reveal.jsx';

export function Section({ children, dark = false, className = '', id }) {
  return (
    <section id={id} className={`${dark ? 'bg-ink text-cream' : 'bg-cream text-ink'} py-24 md:py-32 ${className}`}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, dark = false, align = 'left' }) {
  return (
    <div className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-[820px] mb-16`}>
      <Reveal variant="fade">
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <Reveal variant="rule" as="hr" delay={100} className={`mt-5 mb-8 ${align === 'center' ? 'mx-auto' : ''}`} />
      <Reveal variant="up" delay={200}>
        <h2 className={`font-display font-light text-[34px] md:text-[56px] leading-[1.05] ${dark ? 'text-cream' : 'text-ink'}`}>
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal variant="up" delay={350}>
          <p className={`font-prose text-[19px] md:text-[21px] leading-[1.65] mt-8 ${dark ? 'text-cream' : 'text-ink-soft'}`}>
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function FeatureGrid({ items, columns = 3, dark = false }) {
  const colsClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-px ${dark ? 'bg-white/10' : 'bg-stone'} border ${dark ? 'border-white/10' : 'border-stone'}`}>
      {items.map((it, i) => (
        <Reveal key={i} variant="up" delay={i * 120} className={`${dark ? 'bg-ink' : 'bg-cream'} p-10 lift`}>
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className={`font-display font-semibold text-[22px] md:text-[26px] mt-6 mb-4 ${dark ? 'text-cream' : 'text-ink'}`}>
            {it.title}
          </h3>
          <p className={`font-prose text-[17px] leading-[1.65] ${dark ? 'text-cream' : 'text-ink-soft'}`}>
            {it.body}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * PriceTable — the published pricing block.
 * Rows are { label, price, note }. Reads as a rate card, not a plan grid;
 * the point is that a visitor can see the number without booking a call.
 */
export function PriceTable({ rows, footnote }) {
  return (
    <div className="border-t border-stone">
      {rows.map((r, i) => (
        <Reveal
          key={i}
          variant="up"
          delay={i * 90}
          className="border-b border-stone py-8 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 md:items-baseline"
        >
          <div className="md:col-span-4">
            <h3 className="font-display font-semibold text-[22px] md:text-[26px] text-ink">{r.label}</h3>
          </div>
          <div className="md:col-span-3">
            <span className="font-mono text-[20px] md:text-[24px] text-signal">{r.price}</span>
          </div>
          <div className="md:col-span-5">
            <p className="font-prose text-[17px] text-ink-soft leading-[1.65]">{r.note}</p>
          </div>
        </Reveal>
      ))}
      {footnote && (
        <Reveal variant="fade" delay={200}>
          <p className="font-prose italic text-[17px] text-ink-mid mt-8">{footnote}</p>
        </Reveal>
      )}
    </div>
  );
}

/**
 * TwoColumnList — "what's covered" against "what starts a separate
 * conversation". Used on the programme page, where being explicit about
 * the boundary is the whole point.
 */
export function TwoColumnList({ columns }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone border border-stone">
      {columns.map((col, i) => (
        <Reveal key={i} variant="up" delay={i * 130} className="bg-cream p-10 md:p-12">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display font-semibold text-[24px] mt-6 mb-6 text-ink">{col.title}</h3>
          <ul className="space-y-3">
            {col.items.map((item, j) => (
              <li key={j} className="font-prose text-[17px] text-ink-soft leading-[1.6] flex gap-3">
                <span className="text-signal font-mono text-[13px] mt-1">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

export function CTA({
  eyebrow,
  title,
  body,
  linkTo = '/en/contact-us',
  linkLabel = 'Talk to us',
  secondary,
}) {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <Reveal variant="up">
          <div className="bg-ink text-cream rounded-sm p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[30vw] h-[30vw] rounded-full opacity-20 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, #C0392B 0%, transparent 70%)', transform: 'translate(30%, -40%)' }}/>
            <div className="relative max-w-[700px]">
              <span className="eyebrow">{eyebrow}</span>
              <Reveal variant="rule" as="hr" delay={150} className="mt-5 mb-8" />
              <h2 className="font-display font-light text-[32px] md:text-[52px] leading-[1.05] text-cream">
                {title}
              </h2>
              {body && (
                <p className="font-prose text-[19px] md:text-[21px] leading-[1.65] text-cream mt-8 max-w-[600px]">
                  {body}
                </p>
              )}
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link to={linkTo} className="btn-primary" style={{ background: '#C0392B', borderColor: '#C0392B' }}>
                  {linkLabel}
                  <span style={{ fontFamily: 'DM Mono, monospace' }}>→</span>
                </Link>

                {secondary && (
                  <>
                    <span className="font-mono text-[13px] text-cream/40">·</span>
                    {secondary.href ? (
                      <a
                        href={secondary.href}
                        className="font-prose italic text-[17px] text-cream/80 underline underline-offset-4 decoration-1 hover:text-signal transition-colors"
                      >
                        {secondary.label}
                      </a>
                    ) : (
                      <Link
                        to={secondary.to}
                        className="font-prose italic text-[17px] text-cream/80 underline underline-offset-4 decoration-1 hover:text-signal transition-colors"
                      >
                        {secondary.label}
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
