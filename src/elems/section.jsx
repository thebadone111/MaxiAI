import { Link } from 'react-router-dom';
import Reveal from './reveal.jsx';
import { Decode } from './live.jsx';

/*
 * Layout primitives. Reveals live here, never in page files (as on
 * Minifinans): a page composes these and gets the motion for free.
 */

export function Section({ children, dark = false, className = '', id }) {
  return (
    <section id={id} className={`${dark ? 'bg-ink text-cream' : 'bg-cream text-ink'} py-24 md:py-32 ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

/** Index number in DM Mono, decoded in on reveal: 01, 02… */
export function Index({ n, className = '' }) {
  return (
    <Decode
      text={String(n).padStart(2, '0')}
      className={`font-mono text-[11px] uppercase tracking-[0.22em] text-signal ${className}`}
      duration={400}
    />
  );
}

export function SectionHead({ eyebrow, title, lead, dark = false, align = 'left', children }) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} mb-16 max-w-[820px]`}>
      <Reveal variant="fade">
        <Decode text={eyebrow} className="eyebrow" />
      </Reveal>
      <Reveal variant="rule" as="hr" delay={100} className={`mb-8 mt-5 ${align === 'center' ? 'mx-auto' : ''}`} />
      <Reveal variant="up" delay={180}>
        <h2 className={`font-display text-[34px] font-light leading-[1.05] md:text-[56px] ${dark ? 'text-cream' : 'text-ink'}`}>
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal variant="up" delay={300}>
          <p className={`mt-8 font-prose text-[19px] leading-[1.65] md:text-[21px] ${dark ? 'text-cream/90' : 'text-ink-soft'}`}>
            {lead}
          </p>
        </Reveal>
      )}
      {children}
    </div>
  );
}

export function FeatureGrid({ items, columns = 3, dark = false }) {
  const colsClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-px border ${dark ? 'border-cream/10 bg-cream/10' : 'border-stone bg-stone'}`}>
      {items.map((it, i) => (
        <div key={i} className={`${dark ? 'bg-ink' : 'bg-cream'} lift group relative p-10`}>
          <Reveal variant="up" delay={i * 90}>
            <Index n={i + 1} />
            <h3 className={`mb-4 mt-6 font-display text-[22px] font-semibold md:text-[26px] ${dark ? 'text-cream' : 'text-ink'}`}>
              {it.title}
            </h3>
            <p className={`font-prose text-[17px] leading-[1.65] ${dark ? 'text-cream/90' : 'text-ink-soft'}`}>
              {it.body}
            </p>
          </Reveal>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100" />
        </div>
      ))}
    </div>
  );
}

/**
 * PriceTable — the published pricing block.
 * Rows are { label, price, note }. Reads as a rate card, not a plan grid;
 * the point is that a visitor can see the number without booking a call.
 * Prices decode in as each row arrives.
 */
export function PriceTable({ rows, footnote }) {
  return (
    <div className="border-t border-stone">
      {rows.map((r, i) => (
        <Reveal
          key={i}
          variant="up"
          delay={i * 70}
          className="group grid grid-cols-1 gap-3 border-b border-stone py-8 transition-colors hover:bg-cream-deep md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
        >
          <div className="md:col-span-4">
            <h3 className="font-display text-[22px] font-semibold text-ink md:text-[26px]">{r.label}</h3>
          </div>
          <div className="md:col-span-3">
            <Decode text={r.price} className="tabular font-mono text-[20px] text-signal md:text-[24px]" delay={i * 70} />
          </div>
          <div className="md:col-span-5">
            <p className="font-prose text-[17px] leading-[1.65] text-ink-soft">{r.note}</p>
          </div>
        </Reveal>
      ))}
      {footnote && (
        <Reveal variant="fade" delay={200}>
          <p className="mt-8 font-prose text-[17px] italic text-ink-mid">{footnote}</p>
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
    <div className="grid grid-cols-1 gap-px border border-stone bg-stone md:grid-cols-2">
      {columns.map((col, i) => (
        <div key={i} className="bg-cream p-10 md:p-12">
          <Reveal variant="up" delay={i * 110}>
            <Index n={i + 1} />
            <h3 className="mb-6 mt-6 font-display text-[24px] font-semibold text-ink">{col.title}</h3>
            <ul className="space-y-3">
              {col.items.map((item, j) => (
                <li key={j} className="flex gap-3 font-prose text-[17px] leading-[1.6] text-ink-soft">
                  <span className="mt-1 font-mono text-[13px] text-signal">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      ))}
    </div>
  );
}

/**
 * Ruled points — a numbered list with a hairline above each item. The
 * pattern the pages had written out by hand four times.
 */
export function RuledPoints({ items, columns = 2, size = 'md' }) {
  return (
    <div className={`grid grid-cols-1 gap-12 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
      {items.map((p, i) => (
        <Reveal key={i} variant="up" delay={(i % columns) * 100} className="border-t border-stone pt-8">
          {p.title && <Index n={i + 1} />}
          {p.title && <h3 className="mb-3 mt-4 font-display text-[26px] font-semibold">{p.title}</h3>}
          <p className={`font-prose leading-relaxed text-ink-soft ${size === 'lg' ? 'text-[18px]' : 'text-[17px]'}`}>{p.body}</p>
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
      <div className="wrap">
        <Reveal variant="up">
          <div className="cta-panel relative overflow-hidden rounded-[2px] bg-ink p-10 text-cream md:p-20">
            <div aria-hidden="true" className="cta-glow" />
            <div aria-hidden="true" className="cta-grid" />
            <div className="relative max-w-[700px]">
              <Decode text={eyebrow} className="eyebrow" />
              <Reveal variant="rule" as="hr" delay={150} className="mb-8 mt-5" />
              <h2 className="font-display text-[32px] font-light leading-[1.05] text-cream md:text-[52px]">
                {title}
              </h2>
              {body && (
                <p className="mt-8 max-w-[600px] font-prose text-[19px] leading-[1.65] text-cream/90 md:text-[21px]">
                  {body}
                </p>
              )}
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link to={linkTo} className="btn-primary btn-signal">
                  {linkLabel}
                  <span>→</span>
                </Link>

                {secondary && (
                  <>
                    <span className="font-mono text-[13px] text-cream/40">·</span>
                    {secondary.href ? (
                      <a href={secondary.href} className="link-sweep font-prose text-[17px] italic text-cream/80 transition-colors hover:text-cream">
                        {secondary.label}
                      </a>
                    ) : (
                      <Link to={secondary.to} className="link-sweep font-prose text-[17px] italic text-cream/80 transition-colors hover:text-cream">
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
