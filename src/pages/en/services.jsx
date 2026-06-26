import Header from '../../elems/header.jsx';
import Footer from '../../elems/footer.jsx';
import Hero from '../../elems/hero.jsx';
import { Section, SectionHead, FeatureGrid, CTA } from '../../elems/section.jsx';

function ServicesEn() {
  return (
    <>
      <Header variant="dark" />

      <Hero
        eyebrow="Tier 01 · Services"
        title={<>The <em>tech department</em> your business already has — it just doesn't know it yet.</>}
        lead="Web, security, infrastructure, and bespoke development under one roof, run by people who write the code themselves. A retainer relationship engineered to outlast the people who set it up."
        meta={[
          { label: 'Model', value: 'Retainer + project' },
          { label: 'Point of contact', value: 'One dedicated builder' },
          { label: 'Geography', value: 'UK · SE · HK' },
        ]}
      />

      <Section>
        <SectionHead
          eyebrow="What we deliver"
          title={<>Four disciplines, one <em>standard.</em></>}
          lead="The services are organised around the things a small or mid-sized business actually depends on, not the things that look good on a pitch."
        />

        <FeatureGrid
          columns={2}
          items={[
            {
              title: 'Web development & hosting',
              body: 'High-performance websites built for the long term — clean code, sensible CMS choices, and hosting we own the support call for. From a brochure site to a full ecommerce build.',
            },
            {
              title: 'Cybersecurity & anonymity',
              body: 'Threat modelling, hardening, secure operational tooling, and the kind of anonymity work that financial and political clients need but rarely ask for openly. Discreet, technical, documented.',
            },
            {
              title: 'IT infrastructure & cloud',
              body: 'Microsoft 365, Google Workspace, email and domains, identity management, backup, and the small daily things that fall over when no one is looking. Quiet, reliable, audited.',
            },
            {
              title: 'Bespoke software & automation',
              body: 'Internal tools, integrations, dashboards, and the workflow software that replaces the spreadsheet someone has been guarding for six years. Built once, well, and handed back to you.',
            },
          ]}
        />
      </Section>

      <Section dark>
        <SectionHead
          dark
          eyebrow="How we work"
          title={<>A practice, not a <em>process.</em></>}
          lead="We don't have a discovery phase, a sprint zero, or a Notion template. We have a small number of careful people who do this for a living."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            { step: '01', title: 'Conversation', body: 'A real conversation about what your business actually needs — not a sales script. Usually thirty minutes is enough to know whether we should keep talking.' },
            { step: '02', title: 'Proposal', body: 'A short, written proposal: scope, price, who is doing the work, and what the first three months look like. No surprises.' },
            { step: '03', title: 'Build & hold', body: 'We build the thing, then we hold it — quietly, in the background, while you get on with the rest of your business. That holding pattern is where most of the value lives.' },
          ].map((s, i) => (
            <div key={i} className="bg-ink p-10">
              <span className="font-mono text-[28px] text-signal font-light">{s.step}</span>
              <h3 className="font-display font-semibold text-[24px] mt-6 mb-4 text-cream">{s.title}</h3>
              <p className="font-prose text-[15px] text-cream/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTA
        eyebrow="Begin"
        title={<>Tell us what <em>breaks first</em> when no one's watching.</>}
        body="That's usually the right place to start. A short call, a written proposal, and a clear answer about whether we're a fit."
      />

      <Footer />
    </>
  );
}

export default ServicesEn;
