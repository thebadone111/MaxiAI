import Hero from '../../elems/hero.jsx';
import Reveal from '../../elems/reveal.jsx';
import { ProcessTrack } from '../../elems/scenes.jsx';
import { Split } from '../../visuals/Visual.jsx';
import PageMeta from '../../elems/pagemeta.jsx';
import { Section, SectionHead, FeatureGrid, PriceTable, CTA } from '../../elems/section.jsx';
import { price, marketsShort, VAT_NOTE } from '../../data/site.js';

function ServicesEn() {
  return (
    <>
      <PageMeta route="/en/services" />

      <Hero
        eyebrow="Tier 01 · Services"
        title={<>The <em>tech department</em> your business already has — it just doesn't know it yet.</>}
        lead="Web, security, infrastructure and bespoke development under one roof, run by the people who write the code. A retainer relationship engineered to outlast the people who set it up."
        actions={{
          primary: { to: '/en/contact-us', label: 'Talk to us' },
          secondary: { to: '/en/services#rebuild', label: "or see how we'd start" },
        }}
        meta={[
          { label: 'Model', value: `Retainer + project · from ${price.retainer}/month` },
          { label: 'Point of contact', value: 'One dedicated engineer' },
          { label: 'Working in', value: marketsShort },
        ]}
      />

      <Section>
        <SectionHead
          eyebrow="What we deliver"
          title={<>Four disciplines, one <em>standard.</em></>}
          lead="The services are organised around what a small or mid-sized business actually depends on, not what looks good on a pitch."
        />

        <FeatureGrid
          columns={2}
          items={[
            {
              title: 'Web development & hosting',
              body: 'High-performance websites built for the long term — clean code, sensible CMS choices, and hosting we own the support call for. From a brochure site to a full ecommerce build.',
            },
            {
              title: 'Cybersecurity & compliance',
              body: 'Threat modelling, hardening, Cyber Essentials readiness, and the discreet operational security that financial and political clients need but rarely ask for openly. Documented, technical, quiet.',
            },
            {
              title: 'IT infrastructure & cloud',
              body: 'Microsoft 365, Google Workspace, email and domains, identity management, backup — and the small daily things that fall over when no one is looking. Reliable, audited, boring.',
            },
            {
              title: 'Bespoke software & automation',
              body: 'Internal tools, integrations, dashboards, and the workflow software that replaces the spreadsheet someone has been guarding for six years. Built once, well, and handed back to you.',
            },
          ]}
        />
      </Section>

      {/* Pricing — the single most important block on the site */}
      <Section id="pricing">
        <SectionHead
          eyebrow="What it costs"
          title={<>Published, because you <em>shouldn't have to ask.</em></>}
          lead="Most studios make you sit through a call to find out whether you can afford them. We'd rather you knew now."
        />

        <PriceTable
          rows={[
            {
              label: 'A rebuilt homepage',
              price: '—',
              note: 'We rebuild yours and send you the link. Nothing to sign.',
            },
            {
              label: 'Care plan',
              price: `${price.care}/month`,
              note: `A one-page site: hosting, domains, backups and small changes. ${price.careAnnual} a year if you'd rather pay annually.`,
            },
            {
              label: 'Care plan · multi-page',
              price: `${price.careMulti}/month`,
              note: 'More than one page, same arrangement.',
            },
            {
              label: 'Retainer',
              price: `from ${price.retainer}/month`,
              note: 'Your dedicated engineer, ongoing.',
            },
            {
              label: 'Project work',
              price: `from ${price.project}`,
              note: 'Bookings, payments, logins, integrations. Quoted in writing before anything starts.',
            },
          ]}
          footnote={`No hourly billing surprises. No minimum term on monthly plans. ${VAT_NOTE}`}
        />
      </Section>

      <ProcessTrack
        id="how-we-work"
        eyebrow="How we work"
        title={<>A practice, not a <em>process.</em></>}
        lead="We don't have a discovery phase, a sprint zero, or a Notion template. We have a small number of careful people who do this for a living."
        items={[
          { title: 'Conversation', body: 'A real conversation about what your business actually needs — not a sales script. Thirty minutes is usually enough to know whether we should keep talking.' },
          { title: 'Proposal', body: "A short written proposal: scope, price, who's doing the work, and what the first three months look like. No surprises." },
          { title: 'Build & hold', body: 'We build the thing, then we hold it — quietly, in the background, while you get on with the rest of your business. That holding pattern is where most of the value lives.' },
        ]}
      />

      {/* Step zero — how the conversation actually opens */}
      <Section id="rebuild">
        <Split visual="services">
        <SectionHead
          eyebrow="Before any of that"
          title={<>We don't pitch. We <em>rebuild your homepage</em> and send it to you.</>}
          lead="It takes an afternoon. You get a link to a working rebuild of your own front page, and an honest view of what the current one is costing you."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[980px]">
          <Reveal variant="up" className="border-t border-stone pt-8">
            <p className="font-prose text-[18px] text-ink-soft leading-relaxed">
              Nothing to sign, nothing to buy, and no follow-up sequence. If it's better, you'll be able to see that for yourself — which is a more useful conversation than any deck we could send instead.
            </p>
          </Reveal>
          <Reveal variant="up" delay={130} className="border-t border-stone pt-8">
            <p className="font-prose text-[18px] text-ink-soft leading-relaxed">
              It's also the most honest way we know to answer the question everyone actually has at this stage, which is whether we're any good. Tell us the address and we'll take it from there.
            </p>
          </Reveal>
        </div>
        </Split>
      </Section>

      <CTA
        eyebrow="Begin"
        title={<>Tell us what <em>breaks first</em> when no one's watching.</>}
        body="That's usually the right place to start. A short call, a written proposal, and a clear answer about whether we're a fit."
        secondary={{ to: '/en/services#rebuild', label: 'or let us rebuild your homepage first' }}
      />
    </>
  );
}

export default ServicesEn;
