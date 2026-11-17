import Hero from '../../elems/hero.jsx';
import Reveal from '../../elems/reveal.jsx';
import PageMeta from '../../elems/pagemeta.jsx';
import { Section, SectionHead, FeatureGrid, RuledPoints, CTA, Index } from '../../elems/section.jsx';
import { Split } from '../../visuals/Visual.jsx';

/*
 * Tier 02 — the company brain.
 *
 * The pitch is the brain itself: a private AI connected to a business's own
 * systems that knows how the company works, answers with sources, acts with
 * approval, and keeps learning. It is the same kind of system Maxi runs on
 * internally, which is the "built by people who run one" point below.
 */

const STEPS = [
  {
    title: 'Connect',
    body: 'Email, shared drives, CRM, accounting, calendars and chat. Read access first; write access only where you want it to act.',
  },
  {
    title: 'Organise',
    body: 'Documents, decisions and conversations become a structured memory of the business — people, clients, projects, and what was agreed with whom.',
  },
  {
    title: 'Ask and act',
    body: 'Anyone on the team asks in plain English, from wherever they already work. It drafts, files and follows up; a person approves anything that matters.',
  },
  {
    title: 'Learn',
    body: 'New mail, documents and decisions flow in continuously. The brain you have in a year knows far more than the one you start with.',
  },
];

function AIBrainEn() {
  return (
    <>
      <PageMeta route="/en/ai-brain" />

      <Hero
        eyebrow="Tier 02 · The company brain"
        title={<>Your company's own <em>AI brain</em> — one that knows the business, and acts on it.</>}
        lead="Every business already has a brain. It's scattered across inboxes, shared drives, spreadsheets and the heads of the three people who never take a holiday. We give it a home: a private AI that reads your systems, learns how the business really runs, answers anyone on the team, and does the work — not just the talking."
        actions={{
          primary: { to: '/en/contact-us', label: 'Talk to us' },
          secondary: { to: '/en/ai-brain#how-it-works', label: 'or see how it works' },
        }}
        meta={[
          { label: 'Connects to', value: 'Email · Docs · CRM · Finance' },
          { label: 'Lives in', value: 'Infrastructure you own' },
          { label: 'Engagement', value: 'Build + retainer' },
        ]}
      />

      <Section>
        <SectionHead
          eyebrow="What it is"
          title={<>Not a chatbot. A <em>memory</em> with hands.</>}
          lead="Off-the-shelf AI assistants know the internet. They don't know your clients, your prices, the decision you made in March, or why you made it. A company brain does — because it's wired into the places that knowledge already lives."
        />

        <FeatureGrid
          columns={3}
          items={[
            {
              title: 'It knows',
              body: 'Connected to your email, documents, CRM, accounting and calendars. Every answer cites the source it came from, and people only see what they are allowed to see.',
            },
            {
              title: 'It acts',
              body: 'Drafts the reply, files the invoice, books the meeting, updates the record, raises the task. Anything with consequences waits for a person to approve it.',
            },
            {
              title: 'It learns',
              body: 'Every decision, client conversation and finished project is written back into the brain, so it grows more useful each week instead of going stale.',
            },
          ]}
        />
      </Section>

      <Section dark id="how-it-works">
        <Split visual="aiBrain" dark>
          <SectionHead
            dark
            eyebrow="How it works"
            title={<>Wired into the systems you <em>already run.</em></>}
            lead="No new platform to move to. The brain plugs into the tools your team uses today and sits quietly behind them."
          />
          <ol className="grid grid-cols-1 gap-px border border-cream/10 bg-cream/10 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.title} className="bg-ink p-7 md:p-8">
                <Reveal variant="up" delay={(i % 2) * 100}>
                  <Index n={i + 1} />
                  <h3 className="mb-3 mt-4 font-display text-[24px] font-semibold text-cream">{s.title}</h3>
                  <p className="font-prose text-[16px] leading-relaxed text-cream/85">{s.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Split>
      </Section>

      <Section>
        <SectionHead
          eyebrow="What teams use it for"
          title={<>The questions that used to need <em>the one person who knows.</em></>}
        />
        <RuledPoints
          size="lg"
          items={[
            { title: 'Answers, with sources', body: '"What did we quote that client last spring?" Answered in seconds, with a link to the email it came from.' },
            { title: 'Inbox and follow-up', body: 'Triage, drafts written in your voice, chasers sent on time. Nothing quietly dropped because someone was away.' },
            { title: 'Onboarding', body: 'A new hire asks the brain instead of interrupting whoever has been there longest — and gets the real answer, not the handbook one.' },
            { title: 'Reporting', body: 'Weekly summaries of clients, cash and pipeline, written from the source data rather than from memory on a Friday afternoon.' },
          ]}
        />
      </Section>

      <Section>
        <SectionHead
          eyebrow="Why ours"
          title={<>Your brain. Not <em>somebody else's</em> subscription.</>}
          lead="A generic assistant rents you somebody else's idea of how a business works. We build one around yours."
        />

        <div className="grid grid-cols-1 gap-px border border-stone bg-stone md:grid-cols-3">
          {[
            { title: 'Yours to keep', body: 'The brain, the data and the code belong to you. It runs in infrastructure you own and can take with you — no per-seat pricing creep, no platform pivot that breaks it on a Tuesday.' },
            { title: 'Private by design', body: 'Access follows your existing permissions, every action it takes is logged, and your business data is never used to train anyone else’s model.' },
            { title: 'Built by people who run one', body: 'We run our own company on a brain like this every day. We know where it earns its keep — and where a human should stay in the loop.' },
          ].map((s, i) => (
            <div key={i} className="bg-cream p-7 md:p-10">
              <Reveal variant="up" delay={i * 90}>
                <Index n={i + 1} />
                <h3 className="mb-4 mt-6 font-display text-[24px] font-semibold">{s.title}</h3>
                <p className="font-prose text-[17px] leading-relaxed text-ink-soft">{s.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </Section>

      <CTA
        eyebrow="Begin"
        title={<>Tell us where the <em>knowledge</em> in your business lives.</>}
        body="That's where the brain starts. A short conversation, a clear scope, and a written proposal before anything is built."
        secondary={{ to: '/en/services#pricing', label: 'or see what we charge' }}
      />
    </>
  );
}

export default AIBrainEn;
