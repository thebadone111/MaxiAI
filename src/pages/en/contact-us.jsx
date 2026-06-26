import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Header from '../../elems/header.jsx';
import Footer from '../../elems/footer.jsx';
import Hero from '../../elems/hero.jsx';

function ContactForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ sending: false, ok: null, msg: '' });

  const sendEmail = async (e) => {
    e.preventDefault();
    if (e.currentTarget.elements['company_website']?.value) return;
    try {
      setStatus({ sending: true, ok: null, msg: '' });
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
      setStatus({ sending: false, ok: false, msg: 'Something went wrong. Please email info@maxiai.co.uk directly.' });
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
      <Header variant="dark" />

      <Hero
        eyebrow="Contact"
        title={<>Tell us what <em>you're building.</em></>}
        lead="A real reply from a real person — usually within a working day. No drip campaign, no scheduling bot. If we're not the right studio for the work, we'll tell you who is."
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
                <a href="mailto:info@maxiai.co.uk" className="font-display text-[28px] text-ink hover:text-signal transition-colors">
                  info@maxiai.co.uk
                </a>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mid mb-3">Office</p>
                <p className="font-prose text-[18px] text-ink leading-relaxed">
                  71–75 Shelton Street<br/>
                  Covent Garden, London WC2H 9JQ<br/>
                  United Kingdom
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mid mb-3">Markets served</p>
                <p className="font-prose text-[18px] text-ink leading-relaxed">
                  United Kingdom<br/>
                  Sweden<br/>
                  Malta
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mid mb-3">Hours</p>
                <p className="font-prose text-[18px] text-ink leading-relaxed">
                  Monday – Friday<br/>
                  09:00 – 18:00 GMT
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
