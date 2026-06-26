import Header from '../../elems/header.jsx';
import Footer from '../../elems/footer.jsx';
import Hero from '../../elems/hero.jsx';
import { Section, SectionHead, FeatureGrid, CTA } from '../../elems/section.jsx';
import { Link } from 'react-router-dom';

function HomeEn() {
  return (
    <>
      <Header variant="dark" />

      <Hero
        eyebrow="Maxi AI Development · London"
        title={<>Software and <em>AI infrastructure</em>, built with the patience of a tradition.</>}
        lead="We design and build the systems modern businesses run on — secure websites, IT infrastructure, and the AI assistants that handle the work no one has time for. London-based, with clients across Sweden and Hong Kong."
        meta={[
          { label: 'Founded', value: '2024 · London' },
          { label: 'Clients', value: 'UK · SE · HK' },
          { label: 'Sectors', value: 'SMB · Creator economy' },
          { label: 'Status', value: 'Taking new work' },
        ]}
      />

      {/* Two-tier overview */}
      <Section>
        <SectionHead
          eyebrow="The Practice"
          title={<>Two disciplines, one <em>workshop.</em></>}
          lead="We run a small studio that does one thing well in two registers: dependable infrastructure for established businesses, and the AI workforce that the next generation of creators is starting to need."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone border border-stone">
          <div className="bg-cream p-12">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">Tier 01</span>
            <h3 className="font-display font-semibold text-[32px] mt-6 mb-5 leading-tight">
              Your on-demand <em className="text-signal not-italic">tech department.</em>
            </h3>
            <p className="font-prose text-[16px] text-ink-mid leading-relaxed mb-8">
              Secure websites, cybersecurity frameworks, IT infrastructure, bespoke software. Every engagement runs through a single dedicated programmer — one point of contact, end to end. The kind of relationship that survives a decade, not a procurement cycle.
            </p>
            <Link to="/en/services" className="btn-ghost">
              See the services <span className="font-mono">→</span>
            </Link>
          </div>

          <div className="bg-cream p-12">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">Tier 02</span>
            <h3 className="font-display font-semibold text-[32px] mt-6 mb-5 leading-tight">
              AI assistants, built for <em className="text-signal not-italic">creators.</em>
            </h3>
            <p className="font-prose text-[16px] text-ink-mid leading-relaxed mb-8">
              An always-on workforce for the creator who runs a real business but has no team. Qualifies leads, answers DMs, books appointments — across chat, voice, and two-way SMS. Trained to your voice, your offer, your calendar.
            </p>
            <Link to="/en/ai-product" className="btn-ghost">
              See the product <span className="font-mono">→</span>
            </Link>
          </div>
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

      {/* Notable clients */}
      <Section>
        <SectionHead
          eyebrow="Selected engagements"
          title={<>The companies we <em>keep.</em></>}
          lead="A few of the businesses currently running on systems we built and maintain. Most clients we've had for years; none we've lost to dissatisfaction."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone border border-stone">
          {[
            { name: 'Minifinans AB', sector: 'Financial services · Sweden' },
            { name: 'Ashford Partners Ltd', sector: 'Advisory · United Kingdom' },
            { name: 'Nordic Fiber', sector: 'Infrastructure · Sweden' },
            { name: 'SConcierge', sector: 'Hospitality · Hong Kong' },
          ].map((c, i) => (
            <div key={i} className="bg-cream p-10 flex flex-col justify-between min-h-[180px]">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mid">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className="font-display font-semibold text-[20px] mt-6">{c.name}</h4>
                <p className="font-mono text-[11px] text-ink-mid mt-2 tracking-wide">{c.sector}</p>
              </div>
            </div>
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
