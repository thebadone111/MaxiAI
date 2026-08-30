import { Link } from 'react-router-dom';
import { contact, marketsLong } from '../data/site.js';

function Footer() {
  return (
    <footer className="bg-ink text-cream mt-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Wordmark + statement */}
        <div className="md:col-span-5">
          <img src="/maxi-lockup-light.png" alt="Maxi AI Development" width="1028" height="400" className="h-auto w-40" />
          <p className="font-prose italic text-cream max-w-sm leading-relaxed">
            Building software and AI infrastructure for businesses that intend to stay.
          </p>
        </div>

        {/* Nav columns */}
        <div className="md:col-span-3">
          <span className="eyebrow" style={{ color: '#9A95A8' }}>Explore</span>
          <ul className="mt-5 space-y-3 font-ui text-[14px] text-cream/80">
            <li><Link to="/en/home" className="hover:text-signal transition-colors">Home</Link></li>
            <li><Link to="/en/services" className="hover:text-signal transition-colors">Services</Link></li>
            <li><Link to="/en/ai-product" className="hover:text-signal transition-colors">AI Product</Link></li>
            <li><Link to="/en/about-us" className="hover:text-signal transition-colors">About</Link></li>
            <li><Link to="/en/contact-us" className="hover:text-signal transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <span className="eyebrow" style={{ color: '#9A95A8' }}>Office</span>
          <p className="font-prose text-cream mt-5 text-[14px] leading-relaxed not-italic">
            {contact.address.map((line, i) => (
              <span key={i}>
                {line}
                {i < contact.address.length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className="font-mono text-cream mt-5 text-[12px]">
            <a href={`mailto:${contact.email}`} className="hover:text-signal transition-colors">{contact.email}</a>
          </p>

          <span className="eyebrow block mt-8" style={{ color: '#9A95A8' }}>Working in</span>
          <p className="font-mono text-cream mt-3 text-[11px] tracking-widest uppercase leading-relaxed">
            {marketsLong}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-mono text-cream text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} Maxi AI Development Ltd
          </p>
          <p className="font-mono text-cream text-[10px] tracking-widest uppercase">
            Quiet authority · Built to last
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
