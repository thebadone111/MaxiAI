import Header from '../../elems/header.jsx';
import Footer from '../../elems/footer.jsx';
import Hero from '../../elems/hero.jsx';
import Reveal from '../../elems/reveal.jsx';
import { Section, SectionHead, FeatureGrid, CTA } from '../../elems/section.jsx';
import { Link } from 'react-router-dom';

function HomeEn() {
  return (
    <>
      <Header variant="dark" />

      <Hero
        eyebrow="Maxi AI Development · London"
        title={<>Software and <em>AI infrastructure</em>, built with the patience of a tradition.</>}
        lead="We design and build the systems modern businesses run on — secure websites, IT infrastructure, and the custom AI-integrated SaaS that the next generation of creators is starting to need. London-based; we work with clients wherever they are."
        meta={[
          { label: 'Founded', value: '2024 · London' },
          { label: 'Clients', value: 'Worldwide' },
        ]}
      />

      {/* Two-tier overview */}
      <Section>
        <SectionHead
          eyebrow="The Practice"
          title={<>Two disciplines, one <em>workshop.</em></>}
          lead="We run a small studio that does one thing well in two registers: dependable infrastructure for established businesses, and the bespoke SaaS the next generation of creators needs to run their operations at scale."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone border border-stone">
          <Reveal variant="up" className="bg-cream p-12 lift">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal">Tier 01</span>
            <h3 className="font-display font-semibold text-[32px] mt-6 mb-5 leading-tight">
              Your on-demand <em className="text-signal not-italic">tech department.</em>
            </h3>
            <p className="font-prose text-[18px] text-ink-soft leading-relaxed mb-8">
              Secure websites, cybersecurity frameworks, IT infrastructure, bespoke software. Every engagement runs through a single dedicated programmer — one point of contact, end to end. The kind of relationship that survives a decade, not a procurement cycle.
            </p>
            <Link to="/en/services" className="btn-ghost">
              See the services <span className="font-mono">→</span>
            </Link>
          </Reveal>

          <Reveal variant="up" delay={150} className="bg-cream p-12 lift">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal">Tier 02</span>
            <h3 className="font-display font-semibold text-[32px] mt-6 mb-5 leading-tight">
              Custom AI-integrated SaaS for <em className="text-signal not-italic">creators.</em>
            </h3>
            <p className="font-prose text-[18px] text-ink-soft leading-relaxed mb-8">
              Cross-platform uploaders, unified dashboards, bespoke operational infrastructure — built around the way you actually run your business. The product layer modern creators have outgrown the generic tools for.
            </p>
            <Link to="/en/ai-product" className="btn-ghost">
              See the product <span className="font-mono">→</span>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* What we believe */}
      <Section dark>
        <SectionHead
          dark
          eyebrow="What we believe"
          title={<>Built to <em>last</em>, not to demo.</>}
          lead="The technology industry has spent fifteen years optimising for the launch tweet. We optimise for the third year of a client relationship — when nothing's exciting, everything works, and the bills get paid on time."
        />

        <FeatureGrid
          dark
          columns={3}
          items={[
            {
              title: 'Precision over flourish',
              body: 'Every decision is reversible, documented, and explained. Software that someone else can read in five years — including us.',
            },
            {
              title: 'Revenue, not runway',
              body: 'We build on what our services earn. That discipline finds its way into how we treat the work we do for you.',
            },
            {
              title: 'One dedicated builder',
              body: 'You speak to the person writing your code. Not an account manager, not a ticket queue. The shortest possible path between question and answer.',
            },
          ]}
        />
      </Section>

      {/* Operating principles — adapted from About */}
      <Section>
        <SectionHead
          eyebrow="Operating principles"
          title={<>What we are willing to be known <em>for.</em></>}
          lead="Four positions we hold across every engagement — the ones that shape what we build and how we behave when no one is watching."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { n: '01', title: 'Build for the third year', body: 'Most software lives or dies in year three of its operation. We optimise for that year, not for the launch tweet.' },
            { n: '02', title: 'Speak plainly', body: 'No jargon designed to keep you out of the conversation. If we cannot explain it to you in plain English, we do not understand it well enough to ship it.' },
            { n: '03', title: 'One builder per client', body: 'The person who writes your code is the person you call. The shortest possible path between a question and an answer.' },
            { n: '04', title: 'Discretion is part of the work', body: 'We work with founders, financial firms, and creators whose audiences number in the millions. We do not talk about it unless they ask us to.' },
          ].map((p, i) => (
            <Reveal key={p.n} variant="up" delay={i * 100} className="border-t border-stone pt-8">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal">{p.n}</span>
              <h3 className="font-display font-semibold text-[26px] mt-4 mb-3">{p.title}</h3>
              <p className="font-prose text-[17px] text-ink-soft leading-relaxed">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Notable clients */}
      <Section dark>
        <SectionHead
          dark
          eyebrow="Selected engagements"
          title={<>The companies we <em>keep.</em></>}
          lead="A few of the businesses currently running on systems we built and maintain. Most clients we have had for years; none we have lost to dissatisfaction."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {[
            { name: 'Minifinans AB', sector: 'Financial services · Sweden' },
            { name: 'Ashford Partners Ltd', sector: 'Advisory · United Kingdom' },
            { name: 'Nordic Fiber', sector: 'Infrastructure · Sweden' },
            { name: 'sconcierge', sector: 'Hospitality · Malta' },
          ].map((c, i) => (
            <Reveal key={i} variant="up" delay={i * 110} className="bg-ink p-10 flex flex-col justify-between min-h-[200px] lift">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className="font-display font-semibold text-[24px] mt-6 text-cream">{c.name}</h4>
                <p className="font-ui text-[15px] font-medium text-cream mt-3 leading-snug">{c.sector}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTA
        eyebrow="Begin"
        title={<>A short conversation is the <em>fastest way</em> to find out if we fit.</>}
        body="No deck, no sales call. Tell us what you're building, and we'll tell you honestly whether we're the right studio for it."
      />

      <Footer />
    </>
  );
}

export default HomeEn;
