import Reveal from './reveal.jsx';

function Hero({ eyebrow, title, lead, meta, status = 'Currently taking new engagements' }) {
  return (
    <section className="bg-cream relative overflow-hidden">
      {/* Subtle stone accent in corner */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full opacity-40 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #E8E4D8 0%, transparent 70%)', transform: 'translate(20%, -30%)' }}/>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-24 md:pb-40 relative">
        <Reveal variant="fade" delay={0}>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <Reveal variant="rule" as="hr" delay={150} className="mt-6 mb-10" />

        <Reveal variant="up" delay={250}>
          <h1 className="font-display text-[44px] md:text-[88px] leading-[1.02] font-light text-ink max-w-[900px]">
            {title}
          </h1>
        </Reveal>

        {lead && (
          <Reveal variant="up" delay={450}>
            <p className="font-prose text-[20px] md:text-[24px] leading-[1.6] text-ink-soft mt-10 max-w-[720px]">
              {lead}
            </p>
          </Reveal>
        )}

        {meta && (
          <Reveal variant="up" delay={650}>
            <div className="flex flex-wrap gap-x-14 gap-y-5 mt-14">
              {meta.map((m, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mid">{m.label}</span>
                  <span className="font-ui text-[16px] font-medium text-ink">{m.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {status && (
          <Reveal variant="fade" delay={900}>
            <div className="mt-16 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mid border-t border-stone pt-5">
              <span className="pulse-dot" />
              <span>{status}</span>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default Hero;
