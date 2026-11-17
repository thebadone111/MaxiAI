import Hero from '../../elems/hero.jsx';
import Reveal from '../../elems/reveal.jsx';
import PageMeta from '../../elems/pagemeta.jsx';
import { Section, SectionHead, FeatureGrid, CTA, Index } from '../../elems/section.jsx';
import { HomeReveal, Manifesto } from '../../elems/scenes.jsx';
import { Link } from 'react-router-dom';
import { price, marketsShort } from '../../data/site.js';

function HomeEn() {
  return (
    <>
      <PageMeta route="/en/home" />

      <Hero
        eyebrow="Maxi AI Development · London"
        title={<>Software and <em>AI infrastructure</em>, built with the patience of a tradition.</>}
        lead="We design and build the systems modern businesses run on — secure websites, IT infrastructure, and a private AI brain that knows your business and acts on it. London-based; we work with clients wherever they are."
        actions={{
          primary: { to: '/en/contact-us', label: 'Talk to us' },
          secondary: { to: '/en/services#pricing', label: 'or see what we charge' },
        }}
        meta={[
          { label: 'Founded', value: '2024 · London' },
          { label: 'Working in', value: marketsShort },
        ]}
        visual="homeHero"
      />

      {/* Two-tier overview */}
      <Section>
        <SectionHead
          eyebrow="The Practice"
          title={<>Two disciplines, one <em>workshop.</em></>}
          lead="We run a small studio that does one thing well in two registers: dependable infrastructure for established businesses, and a private AI brain that turns everything a business knows into something it can use."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone border border-stone">
          <Reveal variant="up" className="bg-cream p-7 md:p-12 lift">
            <Index n="Tier 01" />
            <h3 className="font-display font-semibold text-[26px] md:text-[32px] mt-6 mb-5 leading-tight">
              Your on-demand <em className="text-signal not-italic">tech department.</em>
            </h3>
            <p className="font-prose text-[17px] md:text-[18px] text-ink-soft leading-relaxed mb-8">
              Secure websites, cybersecurity frameworks, IT infrastructure, bespoke software. Every engagement runs through a single dedicated engineer — one point of contact, end to end. Retainers from {price.retainer} a month. The kind of relationship that survives a decade, not a procurement cycle.
            </p>
            <Link to="/en/services" className="btn-ghost">
              See the services <span className="font-mono">→</span>
            </Link>
          </Reveal>

          <Reveal variant="up" delay={150} className="bg-cream p-7 md:p-12 lift">
            <Index n="Tier 02" />
            <h3 className="font-display font-semibold text-[26px] md:text-[32px] mt-6 mb-5 leading-tight">
              Your company's own <em className="text-signal not-italic">AI brain.</em>
            </h3>
            <p className="font-prose text-[17px] md:text-[18px] text-ink-soft leading-relaxed mb-8">
              A private AI wired into your email, documents and systems. It knows how the business runs, answers anyone on the team with sources, and does the work it's trusted with — and learns as you go.
            </p>
            <Link to="/en/ai-brain" className="btn-ghost">
              Meet the brain <span className="font-mono">→</span>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* The window that opens: the editor typing itself */}
      <HomeReveal />

      {/* What we believe */}
      <Section dark>
        <SectionHead
          dark
          eyebrow="What we believe"
          title={<>Built to <em>Last</em>, not to demo.</>}
        />
        <div className="mb-20 max-w-[1000px]">
          <Manifesto text="The technology industry has spent fifteen years optimising for the launch tweet. We optimise for the third year of a client relationship — when nothing's exciting, everything works, and the bills get paid on time." />
        </div>

        <FeatureGrid
          dark
          columns={3}
          items={[
            {
              title: 'Precision over flourish',
              body: 'Every decision is reversible, documented and explained. Software someone else can read in five years — including us.',
            },
            {
              title: 'Revenue, not runway',
              body: 'We build on what our services earn. That discipline finds its way into how we treat the work we do for you.',
            },
            {
              title: 'One dedicated engineer',
              body: 'You speak to the person writing your code. Not an account manager, not a ticket queue. The shortest possible path between a question and an answer.',
            },
          ]}
        />
      </Section>

      {/* Selected engagements */}
      <Section dark>
        <SectionHead
          dark
          eyebrow="Selected engagements"
          title={<>The companies we <em>keep.</em></>}
          lead="We don't publish client work as a matter of course — discretion is part of what we're paid for. These four are the exceptions: businesses happy to be named."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {[
            { name: 'Minifinans AB', sector: 'Financial services · Sweden', work: 'Website and AI integration.' },
            { name: 'Ashford Partners Ltd', sector: 'Advisory · United Kingdom', work: 'Corporate branding and digital suite.' },
            { name: 'Nordic Fiber', sector: 'Infrastructure · Sweden', work: 'Cybersecurity review and infrastructure.' },
            { name: 'sconcierge', sector: 'Hospitality · Malta', work: 'Operational software.' },
          ].map((c, i) => (
            <Reveal key={i} variant="up" delay={i * 110} className="bg-ink p-7 md:p-10 flex flex-col justify-between gap-6 lg:min-h-[260px] lift">
              <Index n={i + 1} />
              <div>
                <h4 className="font-display font-semibold text-[24px] leading-tight text-cream">{c.name}</h4>
                <p className="font-mono text-[11px] tracking-widest uppercase text-cream/70 mt-3 leading-snug">{c.sector}</p>
                <p className="font-prose text-[15px] text-cream mt-4 leading-snug">{c.work}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade" delay={300}>
          <p className="font-prose italic text-[17px] text-cream/70 mt-10">
            Most clients we've had for years. None we've lost to dissatisfaction.
          </p>
        </Reveal>
      </Section>

      <CTA
        eyebrow="Begin"
        title={<>A short conversation is the <em>fastest way</em> to find out if we fit.</>}
        body="No deck, no sales call. Tell us what you're building and we'll tell you honestly whether we're the right studio for it."
        secondary={{ to: '/en/services#pricing', label: 'or see what we charge' }}
      />
    </>
  );
}

export default HomeEn;
