import { Link } from 'react-router-dom';
import { contact, marketsLong, STATUS } from '../data/site.js';
import { legalEntity } from '../data/legal.js';
import { Lockup } from './logo.jsx';
import { BuildStamp, LondonTime } from './live.jsx';
import { openCommandPalette, useShortcutLabel } from './command.jsx';
import Reveal from './reveal.jsx';

function Footer() {
  const shortcut = useShortcutLabel();
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      {/* The closing line: large, quiet, and the last thing on every page. */}
      <div className="wrap border-b border-cream/10 pb-16 pt-24 md:pb-20 md:pt-32">
        <Reveal variant="rule" />
        <Reveal variant="up" delay={120}>
          <p className="mt-8 max-w-[14ch] font-display text-[44px] font-light leading-[1.02] tracking-[-0.02em] text-cream md:text-[88px]">
            Built for the <em className="font-normal italic text-signal">third year.</em>
          </p>
        </Reveal>
        <Reveal variant="up" delay={240} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link to="/en/contact-us" className="btn-primary btn-signal">
            Talk to us <span>→</span>
          </Link>
          <a href={`mailto:${contact.email}`} className="link-sweep font-mono text-[14px] text-cream/80 hover:text-cream">
            {contact.email}
          </a>
        </Reveal>
      </div>

      <div className="wrap grid grid-cols-1 gap-12 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Lockup tone="cream" size={32} />
          <p className="mt-6 max-w-sm font-prose text-[15px] italic leading-relaxed text-cream/85">
            Building software and AI infrastructure for businesses that intend to stay.
          </p>
          <p className="mt-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
            <span className="pulse-dot" /> {STATUS}
          </p>
        </div>

        <div className="md:col-span-3">
          <span className="eyebrow text-mist">Explore</span>
          <ul className="mt-5 space-y-3 font-ui text-[14px] text-cream/80">
            {[
              ['/en/home', 'Home'],
              ['/en/services', 'Services'],
              ['/en/services#pricing', 'Pricing'],
              ['/en/ai-product', 'AI Product'],
              ['/en/programme', 'Studio Programme'],
              ['/en/about-us', 'About'],
              ['/en/contact-us', 'Contact'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="link-sweep transition-colors hover:text-cream">{label}</Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={openCommandPalette}
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist transition-colors hover:text-cream"
          >
            or press <kbd className="rounded-[3px] border border-cream/20 px-1.5 py-0.5 font-mono normal-case tracking-wider">{shortcut}</kbd>
          </button>
        </div>

        <div className="md:col-span-4">
          <span className="eyebrow text-mist">Office</span>
          <p className="mt-5 font-prose text-[14px] leading-relaxed text-cream">
            {contact.address.map((line, i) => (
              <span key={i}>
                {line}
                {i < contact.address.length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className="mt-3 font-mono text-[12px] text-cream/70">
            <LondonTime />
          </p>

          <span className="eyebrow mt-8 block text-mist">Working in</span>
          <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-widest text-cream">
            {marketsLong}
          </p>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="wrap flex flex-col items-center justify-between gap-4 py-6 text-center md:flex-row md:text-left">
          {/* Statutory identity — the details a UK company should be findable by */}
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-cream">
            © {new Date().getFullYear()} {legalEntity.name}
            <span className="text-cream/50"> · Company no. {legalEntity.companyNo} · ICO {legalEntity.icoRegNo}</span>
          </p>

          <nav aria-label="Legal" className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest">
            <Link to="/en/privacy" className="text-cream transition-colors hover:text-signal">Privacy</Link>
            <span className="text-cream/30">·</span>
            <Link to="/en/tos" className="text-cream transition-colors hover:text-signal">Terms</Link>
            <span className="text-cream/30">·</span>
            <BuildStamp className="text-cream/40" />
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
