import { Link } from 'react-router-dom';
import Reveal from './reveal.jsx';

export function Section({ children, dark = false, className = '' }) {
  return (
    <section className={`${dark ? 'bg-ink text-cream' : 'bg-cream text-ink'} py-24 md:py-32 ${className}`}>
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

export function CTA({ eyebrow, title, body, linkTo = '/en/contact-us', linkLabel = 'Talk to us' }) {
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
              <div className="mt-12">
                <Link to={linkTo} className="btn-primary" style={{ background: '#C0392B', borderColor: '#C0392B' }}>
                  {linkLabel}
                  <span style={{ fontFamily: 'DM Mono, monospace' }}>→</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
