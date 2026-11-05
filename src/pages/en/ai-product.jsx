import Hero from '../../elems/hero.jsx';
import PageMeta from '../../elems/pagemeta.jsx';
import { Section, SectionHead, FeatureGrid, CTA, Index } from '../../elems/section.jsx';
import { Split } from '../../visuals/Visual.jsx';

function AIProductEn() {
  return (
    <>
      <PageMeta route="/en/ai-product" />

      <Hero
        eyebrow="Tier 02 · Product"
        title={<>Custom <em>AI-integrated software</em> for creators who've outgrown the generic stack.</>}
        lead="The next generation of creators aren't running a side project — they're running multi-channel businesses. We build the software those operations actually need: cross-platform publishing, unified dashboards, and the custom infrastructure no off-the-shelf tool will ever fit."
        actions={{
          primary: { to: '/en/contact-us', label: 'Talk to us' },
          secondary: { to: '/en/services#how-we-work', label: 'or see how we scope a build' },
        }}
        meta={[
          { label: 'Engagement', value: 'Bespoke build + retainer' },
          { label: 'Surface area', value: 'Web · Mobile · API' },
        ]}
      />

      <Section>
        <SectionHead
          eyebrow="What we build"
          title={<>Operational software for businesses that <em>are</em> a person.</>}
          lead="Three things almost every serious creator business needs, and almost none of them can buy off the shelf in a form that actually fits."
        />

        <FeatureGrid
          columns={3}
          items={[
            {
              title: 'Cross-platform publishing',
              body: 'One source of truth, every channel. Write, schedule and publish across Instagram, TikTok, YouTube, X, LinkedIn and the rest — with the per-platform formatting, captioning and analytics handled for you.',
            },
            {
              title: 'Unified dashboards',
              body: 'Audience, revenue, partnerships, brand deals, calendars — pulled into a single operational view. The dashboard your team opens every morning, built for how you actually work.',
            },
            {
              title: 'Custom infrastructure',
              body: 'The internal tools, integrations and workflow software that take an operation from "one person and a spreadsheet" to a real company that scales. Designed around your exact stack.',
            },
          ]}
        />
      </Section>

      <Section dark>
        <Split visual="aiProduct" dark>
          <SectionHead
            dark
            eyebrow="Also possible"
            title={<>AI assistants, when they <em>actually</em> fit.</>}
            lead="If qualifying inbound, answering DMs or booking appointments is the bottleneck, we build that too — but as a piece of your broader operational stack, not a standalone chatbot dressed up as a product. AI is part of the toolkit, not the headline."
          />
        </Split>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Why us, not a SaaS subscription"
          title={<>Off-the-shelf tools weren't built for <em>your business.</em></>}
          lead="A subscription buys you somebody else's idea of what your workflow should look like. We build around the one you already have."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone border border-stone">
          {[
            { title: 'Owned, not rented', body: 'The software is yours. No per-seat pricing creep, no platform pivot that breaks your stack on a Tuesday, no feature you depend on getting deprecated next quarter.' },
            { title: 'Built around your operation', body: 'The way you publish, the way your team is structured, the way revenue actually flows in. Software shaped to the business, not the other way round.' },
            { title: 'Built by the operators', body: 'Maxi runs on services revenue, not investor pressure. The product is shaped by what your business needs, not by what the next funding round demands.' },
          ].map((s, i) => (
            <div key={i} className="bg-cream p-10">
              <Index n={i + 1} />
              <h3 className="font-display font-semibold text-[24px] mt-6 mb-4">{s.title}</h3>
              <p className="font-prose text-[17px] text-ink-soft leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTA
        eyebrow="Begin"
        title={<>Tell us what the <em>spreadsheet</em> is doing for you today.</>}
        body="That's almost always where the work starts. A short conversation, a clear scope, and a written proposal."
        secondary={{ to: '/en/services#how-we-work', label: 'or see how we scope a build' }}
      />
    </>
  );
}

export default AIProductEn;
