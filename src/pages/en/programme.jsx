import { useState } from 'react';
import Header from '../../elems/header.jsx';
import Footer from '../../elems/footer.jsx';
import Hero from '../../elems/hero.jsx';
import Reveal from '../../elems/reveal.jsx';
import PageMeta from '../../elems/pagemeta.jsx';
import { Section, SectionHead, TwoColumnList, CTA } from '../../elems/section.jsx';
import { price, contact, VAT_NOTE } from '../../data/site.js';

const fieldClass =
  'w-full bg-transparent border-0 border-b border-stone py-4 px-1 font-ui text-[16px] text-ink placeholder:text-ink-mid focus:border-ink focus:outline-none transition-colors';
const labelClass = 'font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mid block mb-2';

function ApplicationForm() {
  const [status, setStatus] = useState({ sending: false, ok: null, msg: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Honeypot — bots fill hidden fields, people don't.
    if (data.company_website) return;

    const name = String(data.contact_name || '').trim();
    const [firstName, ...rest] = name.split(' ');

    // Composed into the variables the existing EmailJS template already
    // expects, so this form works without a new template.
    const params = {
      first_name: firstName || name,
      last_name: rest.join(' '),
      user_email: data.user_email,
      subject: 'Studio Programme application — ' + data.business_name,
      time: new Date().toISOString(),
      message: [
        'Business: ' + data.business_name,
        'Contact: ' + name,
        'Phone: ' + data.phone,
        'Email: ' + data.user_email,
        'What they do: ' + data.what_you_do,
        '',
        'Happy with the ' + price.care + '/month care plan: ' + data.price_ok,
      ].join('\n'),
    };

    try {
      setStatus({ sending: true, ok: null, msg: '' });
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        params,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );
      setStatus({
        sending: false,
        ok: true,
        msg: 'Application received. We will look you up and come back to you within a working day.',
      });
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus({
        sending: false,
        ok: false,
        msg: 'Something went wrong. Please email ' + contact.email + ' or call ' + contact.phone + '.',
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-10 max-w-[720px]">
      <div className="hidden">
        <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className={labelClass} htmlFor="business_name">Business name</label>
        <input id="business_name" name="business_name" type="text" required placeholder="The name above the door" className={fieldClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClass} htmlFor="contact_name">Your name</label>
          <input id="contact_name" name="contact_name" type="text" required placeholder="Who we'll be speaking to" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" required placeholder="Best number for you" className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="user_email">Email</label>
        <input id="user_email" name="user_email" type="email" required placeholder="you@yourbusiness.co.uk" className={fieldClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="what_you_do">What you do</label>
        <textarea id="what_you_do" name="what_you_do" required rows="4" placeholder="A sentence or two. Plumber, barber, garage, restaurant — whatever it is." className={`${fieldClass} resize-vertical leading-relaxed`} />
      </div>

      <fieldset>
        <legend className={labelClass}>
          The care plan is {price.care} a month — is that OK?
        </legend>
        <div className="flex gap-8 mt-4">
          {['Yes', 'No'].map((v) => (
            <label key={v} className="flex items-center gap-3 font-ui text-[16px] text-ink cursor-pointer">
              <input type="radio" name="price_ok" value={v} required className="accent-[#C0392B] w-4 h-4" />
              {v}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="pt-4">
        <button type="submit" disabled={status.sending} className="btn-primary">
          {status.sending ? 'Sending…' : 'Apply for a place'}
          <span style={{ fontFamily: 'DM Mono, monospace' }}>→</span>
        </button>

        {status.ok !== null && (
          <p className="mt-6 font-mono text-[12px] text-signal tracking-wide">{status.msg}</p>
        )}
      </div>
    </form>
  );
}

function ProgrammeEn() {
  return (
    <>
      <PageMeta route="/en/programme" />
      <Header variant="dark" />

      <Hero
        eyebrow="The Studio Programme · London & Stockholm"
        title={<>We'll build your website. <em>You won't pay for it.</em></>}
        lead="We can produce a proper landing page and register your domain in an afternoon. That's cheap enough for us to give away — so we do, to a limited number of businesses a year, because a few of them grow into something bigger later."
        actions={{
          primary: { to: '/en/programme#apply', label: 'See if you qualify' },
          secondary: { href: contact.phoneHref, label: 'or call us on ' + contact.phone },
        }}
        meta={[
          { label: 'Cost of the build', value: '£0' },
          { label: 'What you pay', value: price.care + '/month, care plan' },
          { label: 'Places this year', value: '10' },
        ]}
        status="Places open for this year"
      />

      <Section>
        <SectionHead
          eyebrow="What's included"
          title={<>A real website, not a <em>placeholder.</em></>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              n: '01',
              title: 'A one-page site, built properly',
              body: 'Fast, mobile, written from your own photographs, opening hours and reviews. Nothing for you to prepare.',
            },
            {
              n: '02',
              title: 'Your domain, registered in your name',
              body: "Not ours. We're listed as the technical contact so we can look after it, but you own it and you can take it anywhere, any time. We think holding a client's domain hostage is a shabby way to run a business.",
            },
            {
              n: '03',
              title: 'Hosting, SSL, backups and renewals',
              body: 'Handled. You won’t hear about any of it unless something needs your decision.',
            },
            {
              n: '04',
              title: 'Small changes whenever you need them',
              body: 'Text, photographs, prices, opening hours. Email us and it’s done inside two working days.',
            },
          ].map((p, i) => (
            <Reveal key={p.n} variant="up" delay={i * 100} className="border-t border-stone pt-8">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal">{p.n}</span>
              <h3 className="font-display font-semibold text-[26px] mt-4 mb-3">{p.title}</h3>
              <p className="font-prose text-[17px] text-ink-soft leading-relaxed">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="The arrangement"
          title={<>Free build. <em>{price.care} a month</em> to keep it running.</>}
          lead={"That's the whole deal, and here's the honest reason for it: the build takes us two hours, and the care plan is what makes it worth doing. If " + price.care + " a month isn't right for you, tell us now and we'll part on good terms."}
        />

        <TwoColumnList
          columns={[
            {
              title: 'What the care plan covers',
              items: [
                'Hosting, domain renewal and SSL',
                'Backups and uptime monitoring',
                'Text and image changes',
                'Contact details, prices and opening hours',
                'New photographs and reviews',
                'Two working day turnaround',
              ],
            },
            {
              title: 'What starts a separate conversation',
              items: [
                'Additional pages — ' + price.careMulti + '/month instead of ' + price.care,
                'Anything with logic in it — bookings, payments, logins, shops — is a quoted project, from ' + price.project,
                'Integrations with systems you already run',
                'Email, Microsoft 365 and IT infrastructure',
                'Full redesigns',
              ],
            },
          ]}
        />

        <Reveal variant="fade" delay={250}>
          <p className="font-prose text-[18px] text-ink-soft leading-relaxed mt-10 max-w-[720px]">
            We'll always quote in writing before anything in the second column happens. Nothing gets added to your bill without you agreeing to it first.
          </p>
        </Reveal>

        <Reveal variant="fade" delay={320}>
          <p className="font-mono text-[12px] tracking-wide text-ink-mid mt-6">
            {price.careAnnual} a year if you'd rather pay annually — two months off. No minimum term on monthly. {VAT_NOTE}
          </p>
        </Reveal>
      </Section>

      <Section dark>
        <SectionHead
          dark
          eyebrow="Who we build for"
          title={<>Established local businesses <em>without a website.</em></>}
          lead="If you've been running for a few years, you're good at what you do, and the only thing people find when they look you up is a Google listing — that's exactly who this is for."
        />

        <Reveal variant="up">
          <p className="font-prose text-[19px] text-cream leading-relaxed max-w-[720px]">
            It's not for brand-new ventures still working out what they sell, and it's not a design competition. It's a solid, fast, honest page that makes you look like the business you already are.
          </p>
        </Reveal>
      </Section>

      <Section>
        <SectionHead
          eyebrow="The obvious question"
          title={<>What&rsquo;s the <em>catch?</em></>}
          lead="There isn't one, but there is a reason."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[980px]">
          <Reveal variant="up" className="border-t border-stone pt-8">
            <p className="font-prose text-[18px] text-ink-soft leading-relaxed">
              We're a London studio that does infrastructure, security and custom software for larger clients. Every so often one of these small builds grows into a business that needs a proper website, a booking system, or someone to look after its email and security. That's the bet — most won't, and that's fine.
            </p>
          </Reveal>
          <Reveal variant="up" delay={130} className="border-t border-stone pt-8">
            <p className="font-prose text-[18px] text-ink-soft leading-relaxed">
              You're under no obligation to ever buy anything else from us. You can cancel the monthly plan with a month's notice and take your domain with you.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Application */}
      <Section id="apply">
        <SectionHead
          eyebrow="Apply"
          title={<>Ten places, and we'd rather <em>fill them well.</em></>}
          lead="Tell us your business name and we'll look you up. If it's a fit we'll build the page first and send you the link — you decide once you can see it."
        />

        <ApplicationForm />
      </Section>

      <CTA
        eyebrow="Or just call"
        title={<>Easier to <em>say it out loud?</em></>}
        body="Ring us and describe the business in a minute. If it's a fit, we'll tell you on the call."
        linkTo="/en/programme#apply"
        linkLabel="Apply for a place"
        secondary={{ href: contact.phoneHref, label: 'or call ' + contact.phone }}
      />

      <Footer />
    </>
  );
}

export default ProgrammeEn;
