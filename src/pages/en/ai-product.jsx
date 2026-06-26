import Header from '../../elems/header.jsx';
import Footer from '../../elems/footer.jsx';
import Hero from '../../elems/hero.jsx';
import { Section, SectionHead, FeatureGrid, CTA } from '../../elems/section.jsx';

function AIProductEn() {
  return (
    <>
      <Header variant="dark" />

      <Hero
        eyebrow="Tier 02 · Product"
        title={<>An AI workforce for the <em>creator</em> who runs a real business.</>}
        lead="You're a one-person company doing the work of seven. Leads go cold, DMs stack up, calls don't get booked, follow-ups never happen. We've built the assistant that handles all of it — trained to your voice, your offer, and your calendar."
        meta={[
          { label: 'Status', value: 'Private beta · 2026' },
          { label: 'Channels', value: 'Chat · Voice · SMS' },
          { label: 'Pricing', value: 'Monthly subscription' },
        ]}
      />

      <Section>
        <SectionHead
          eyebrow="What it does"
          title={<>The work that <em>nobody</em> has time for.</>}
          lead="Four jobs the assistant does every day, while you sleep, post, film, travel, or run the rest of your business."
        />

        <FeatureGrid
          columns={4}
          items={[
            { title: 'Qualifies leads', body: 'Develops and qualifies leads 24/7 the way your best team member would — with context, patience, and the right next step.' },
            { title: 'Answers instantly', body: 'Replies to questions and nurtures prospects across the time zones you actually have followers in.' },
            { title: 'Books appointments', body: 'Sets and confirms calls, classes, consultations — keeps the calendar full and the no-shows low.' },
            { title: 'Omnichannel', body: 'Chat, voice, and two-way SMS across Instagram, TikTok, email, QR codes, and NFC. One workforce, every channel.' },
          ]}
        />
      </Section>

      <Section dark>
        <SectionHead
          dark
          eyebrow="Why us, not a chatbot"
          title={<>Generic AI doesn't <em>understand the work.</em></>}
          lead="The off-the-shelf assistants weren't built for someone whose business is themselves. Ours was."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            { title: 'Trained on your voice', body: 'Not a generic prompt. The assistant reads the way you talk, mirrors the way you sell, and respects the tone that earned you the audience in the first place.' },
            { title: 'Plugged into the calendar', body: 'It books, reschedules, confirms, and reminds. Direct calendar integration with the platforms creators actually use.' },
            { title: 'Built by the operators', body: 'Maxi runs on services revenue, not investor pressure. The product is shaped by what your business needs, not what the next funding round demands.' },
          ].map((s, i) => (
            <div key={i} className="bg-ink p-10">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display font-semibold text-[22px] mt-6 mb-4 text-cream">{s.title}</h3>
              <p className="font-prose text-[15px] text-cream/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTA
        eyebrow="Early access"
        title={<>The private beta opens in <em>waves.</em></>}
        body="If you run a creator business that's outgrown a one-person team, tell us a bit about it. We'll let you know when the next wave opens."
        linkLabel="Request access"
      />

      <Footer />
    </>
  );
}

export default AIProductEn;
