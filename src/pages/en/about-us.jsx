import Header from '../../elems/header.jsx';
import Footer from '../../elems/footer.jsx';
import Hero from '../../elems/hero.jsx';
import Reveal from '../../elems/reveal.jsx';
import { Section, SectionHead, CTA } from '../../elems/section.jsx';

function AboutUsEn() {
  return (
    <>
      <Header variant="dark" />

      <Hero
        eyebrow="About"
        title={<>A small London studio, <em>doing the work.</em></>}
        lead="Maxi AI Development was incorporated in London in 2024 by two founders who'd rather build the company than talk about building it. We do consultancy that pays the bills, and product work that's quietly building into the company's second act."
        meta={[
          { label: 'Incorporated', value: '2024 · London' },
          { label: 'Founders', value: '2' },
          { label: 'Clients reached', value: 'UK · Sweden · Malta' },
        ]}
      />

      <Section>
        <SectionHead
          eyebrow="The Founders"
          title={<>Two complementary halves of <em>one practice.</em></>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone border border-stone">
          <Reveal variant="up" className="bg-cream p-12 lift">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">Co-founder</span>
            <h3 className="font-display font-semibold text-[34px] mt-5 mb-3">Oliver Lee</h3>
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-mid mb-6">
              Commercial · Marketing · Brand
            </p>
            <p className="font-prose text-[18px] text-ink-soft leading-relaxed">
              Oliver leads the commercial side of the business — the conversations with clients, the brand voice, the way the company shows up in the world. The reason most clients hear of us in the first place.
            </p>
          </Reveal>

          <Reveal variant="up" delay={150} className="bg-cream p-12 lift">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">Co-founder</span>
            <h3 className="font-display font-semibold text-[34px] mt-5 mb-3">Tiger Gjers</h3>
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-mid mb-6">
              Technical lead · Architecture · Delivery
            </p>
            <p className="font-prose text-[18px] text-ink-soft leading-relaxed">
              Tiger owns the architecture, the delivery, and the long-term direction of the AI product. The person actually writing the code on most engagements, and the person you'll likely speak to about what's possible.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section dark>
        <SectionHead
          dark
          eyebrow="Where we work"
          title={<>London-based. Useful in <em>three time zones.</em></>}
          lead="The studio is registered and run from London, but our work has never been confined to it. Our long-running clients sit across the United Kingdom, Sweden, and Malta — three markets where the appetite for careful, technical work is consistently underserved."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            { city: 'London', country: 'United Kingdom', note: 'Headquarters, financial services, advisory.' },
            { city: 'Stockholm', country: 'Sweden', note: 'Fintech, infrastructure, retail tech.' },
            { city: 'Valletta', country: 'Malta', note: 'Hospitality, concierge, family office software.' },
          ].map((c, i) => (
            <Reveal key={i} variant="up" delay={i * 120} className="bg-ink p-10 lift">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display font-semibold text-[28px] mt-6 text-cream">{c.city}</h3>
              <p className="font-mono text-[11px] tracking-widest uppercase text-cream mt-1">{c.country}</p>
              <p className="font-prose text-[17px] text-cream leading-relaxed mt-6">{c.note}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Operating principles"
          title={<>What we are willing to be known <em>for.</em></>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { n: '01', title: 'Build for the third year', body: 'Most software lives or dies in year three of its operation. We optimise for that year, not for the launch tweet.' },
            { n: '02', title: 'Speak plainly', body: 'No jargon designed to keep you out of the conversation. If we can\'t explain it to you in plain English, we don\'t understand it well enough to ship it.' },
            { n: '03', title: 'One builder per client', body: 'The person who writes your code is the person you call. The shortest possible path between a question and an answer.' },
            { n: '04', title: 'Discretion is part of the work', body: 'We work with founders, financial firms, and creators whose audiences number in the millions. We don\'t talk about it unless they ask us to.' },
          ].map((p, i) => (
            <Reveal key={p.n} variant="up" delay={i * 100} className="border-t border-stone pt-8">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">{p.n}</span>
              <h3 className="font-display font-semibold text-[26px] mt-4 mb-3">{p.title}</h3>
              <p className="font-prose text-[18px] text-ink-soft leading-relaxed">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTA
        eyebrow="Get in touch"
        title={<>The best way to know if we fit is to <em>ask.</em></>}
        body="A short conversation, no obligation. Tell us what you're working on and we'll tell you honestly whether we can help."
      />

      <Footer />
    </>
  );
}

export default AboutUsEn;
