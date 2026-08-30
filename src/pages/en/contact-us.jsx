import { useRef, useState } from 'react';
import Header from '../../elems/header.jsx';
import Footer from '../../elems/footer.jsx';
import Hero from '../../elems/hero.jsx';
import PageMeta from '../../elems/pagemeta.jsx';
import { contact } from '../../data/site.js';

function ContactForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ sending: false, ok: null, msg: '' });

  const sendEmail = async (e) => {
    e.preventDefault();
    if (e.currentTarget.elements['company_website']?.value) return;
    try {
      setStatus({ sending: true, ok: null, msg: '' });
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.sendForm(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );
      setStatus({ sending: false, ok: true, msg: 'Message received. We will reply within one working day.' });
      formRef.current?.reset();
    } catch (err) {
      console.error(err);
      setStatus({ sending: false, ok: false, msg: `Something went wrong. Please email ${contact.email} directly.` });
    }
  };

  const fieldClass = 'w-full bg-transparent border-0 border-b border-stone py-4 px-1 font-ui text-[16px] text-ink placeholder:text-ink-mid focus:border-ink focus:outline-none transition-colors';
  const labelClass = 'font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mid block mb-2';

  return (
    <form ref={formRef} onSubmit={sendEmail} className="space-y-10">
      <input type="hidden" name="time" value={new Date().toISOString()} />
      <div className="hidden">
        <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClass}>First name</label>
          <input type="text" name="first_name" required placeholder="Your first name" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Last name</label>
          <input type="text" name="last_name" required placeholder="Your last name" className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input type="email" name="user_email" required placeholder="you@company.com" className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>Subject</label>
        <input type="text" name="subject" required placeholder="What this is about" className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>Message</label>
        <textarea name="message" required rows="6" placeholder="Tell us about the work. The more concrete, the better." className={`${fieldClass} resize-vertical leading-relaxed`} />
      </div>

      <div className="pt-4">
        <button type="submit" disabled={status.sending} className="btn-primary">
          {status.sending ? 'Sending…' : 'Send message'}
          <span style={{ fontFamily: 'DM Mono, monospace' }}>→</span>
        </button>

        {status.ok !== null && (
          <p className="mt-6 font-mono text-[12px] text-signal tracking-wide">{status.msg}</p>
        )}
      </div>
    </form>
  );
}

function ContactUsEn() {
  return (
    <>
      <PageMeta route="/en/contact-us" />
      <Header variant="dark" />

      <Hero
        eyebrow="Contact"
        title={<>Tell us what <em>you're working on.</em></>}
        lead="Thirty minutes is usually enough for both of us to know whether this is worth continuing. If it isn't, we'll say so — we'd rather turn work down than take it on badly."
        meta={[
          { label: 'Response time', value: 'Within one working day' },
          { label: 'Office', value: 'London' },
        ]}
      />

      <section className="bg-cream pb-32">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <span className="eyebrow">Send a message</span>
            <hr className="signal-rule mt-5 mb-12" />
            <ContactForm />
          </div>

          <aside className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-stone">
            <span className="eyebrow">Direct lines</span>
            <hr className="signal-rule mt-5 mb-12" />

            <div className="space-y-12">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mid mb-3">Email</p>
                <a href={`mailto:${contact.email}`} className="font-display text-[28px] text-ink hover:text-signal transition-colors">
                  {contact.email}
                </a>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mid mb-3">Office</p>
                <p className="font-prose text-[18px] text-ink leading-relaxed">
                  {contact.address.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < contact.address.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ContactUsEn;
