import { useState } from 'react';
import Hero from '../../elems/hero.jsx';
import Reveal from '../../elems/reveal.jsx';
import PageMeta from '../../elems/pagemeta.jsx';
import { contact } from '../../data/site.js';

/*
 * Contact — email only, by decision (17 Nov 2026). No form and no third-party
 * form service: the button opens the visitor's own mail app with a subject
 * and a light prompt filled in, and the address is shown in full (and can be
 * copied) for anyone whose machine has no mail app set up.
 */

const SUBJECT = 'Enquiry from maxiai.co.uk';
const BODY = [
  'Hello Maxi,',
  '',
  'What we do:',
  'What we need help with:',
  'Rough timing:',
  '',
].join('\n');

const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

function CopyAddress() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };
  return (
    <button type="button" onClick={copy} className="btn-ghost">
      {copied ? 'Copied' : 'Copy the address'} <span>{copied ? '✓' : '⧉'}</span>
    </button>
  );
}

function ContactUsEn() {
  return (
    <>
      <PageMeta route="/en/contact-us" />

      <Hero
        eyebrow="Contact"
        title={<>Tell us what <em>you're working on.</em></>}
        lead="Thirty minutes is usually enough for both of us to know whether this is worth continuing. If it isn't, we'll say so — we'd rather turn work down than take it on badly."
        meta={[
          { label: 'Response time', value: 'Within one working day' },
          { label: 'Office', value: 'London' },
        ]}
      />

      <section className="bg-cream pb-24 md:pb-32">
        <div className="wrap grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow">Write to us</span>
            <hr className="signal-rule mb-10 mt-5" />

            <Reveal variant="up">
              <a
                href={`mailto:${contact.email}`}
                className="link-sweep break-all font-display text-[clamp(1.75rem,8vw,3.5rem)] font-light leading-tight text-ink transition-colors hover:text-signal"
              >
                {contact.email}
              </a>
            </Reveal>

            <Reveal variant="up" delay={120} className="mt-10 flex flex-wrap items-center gap-4">
              <a href={mailto} className="btn-primary">
                Email us <span>→</span>
              </a>
              <CopyAddress />
            </Reveal>

            <Reveal variant="up" delay={220}>
              <p className="mt-12 max-w-[560px] font-prose text-[18px] leading-relaxed text-ink-soft">
                A few lines is plenty. It helps to know:
              </p>
              <ul className="mt-5 max-w-[560px] space-y-3">
                {[
                  'what the business does, and roughly how big it is;',
                  'what needs doing — or what keeps breaking;',
                  'any timing that matters.',
                ].map((t) => (
                  <li key={t} className="flex gap-3 font-prose text-[17px] leading-[1.6] text-ink-soft">
                    <span className="mt-1 font-mono text-[13px] text-signal">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-[560px] font-prose text-[16px] italic leading-relaxed text-ink-mid">
                Please don&rsquo;t send anything confidential in a first email — we&rsquo;ll agree a proper
                route for that once we&rsquo;ve spoken.
              </p>
            </Reveal>
          </div>

          <aside className="lg:col-span-5 lg:border-l lg:border-stone lg:pl-8">
            <span className="eyebrow">Office</span>
            <hr className="signal-rule mb-10 mt-5" />
            <p className="font-prose text-[18px] leading-relaxed text-ink">
              {contact.address.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < contact.address.length - 1 && <br />}
                </span>
              ))}
            </p>
            <p className="mt-6 font-prose text-[16px] leading-relaxed text-ink-mid">
              Working with clients in the UK, Sweden, Malta and Hong Kong.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

export default ContactUsEn;
