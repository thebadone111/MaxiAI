import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Wordmark({ variant = 'dark' }) {
  const inkColor = variant === 'dark' ? '#1C1A2E' : '#FAF7F0';
  const mutedColor = variant === 'dark' ? '#6B6880' : '#9A95A8';
  return (
    <Link to="/en/home" className="inline-flex items-end gap-0 group" aria-label="Maxi AI Development — Home">
      <svg width="160" height="52" viewBox="0 0 220 70" className="transition-opacity group-hover:opacity-80">
        <line x1="0" y1="10" x2="100" y2="10" stroke="#C0392B" strokeWidth="2.5"/>
        <text x="0" y="46" fontFamily="Fraunces, Georgia, serif" fontWeight="600" fontSize="34" fill={inkColor} letterSpacing="1">Maxi</text>
        <text x="0" y="64" fontFamily="'DM Mono', monospace" fontWeight="300" fontSize="8" fill={mutedColor} letterSpacing="3.5">AI DEVELOPMENT LTD · LONDON</text>
      </svg>
    </Link>
  );
}

function NavLinks({ variant = 'dark', onClick }) {
  const links = [
    { to: '/en/home', label: 'Home' },
    { to: '/en/services', label: 'Services' },
    { to: '/en/ai-product', label: 'AI Product' },
    { to: '/en/about-us', label: 'About' },
  ];
  const base = variant === 'dark' ? 'text-ink' : 'text-cream';
  return (
    <>
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          onClick={onClick}
          className={`font-ui font-medium text-[14px] tracking-wide ${base} opacity-80 hover:opacity-100 hover:text-signal transition-all`}
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

function Header({ variant = 'dark' }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [open]);

  const ctaClass = variant === 'dark' ? 'btn-primary' : 'btn-ghost';

  return (
    <header className={`w-full border-b ${variant === 'dark' ? 'border-stone' : 'border-white/15'} relative z-30`}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <Wordmark variant={variant} />

        <nav className="hidden lg:flex items-center gap-10">
          <NavLinks variant={variant} />
        </nav>

        <div className="hidden lg:block">
          <Link to="/en/contact-us" className={ctaClass} style={{ padding: '12px 22px', fontSize: '13px' }}>
            Talk to us
            <span style={{ fontFamily: 'DM Mono, monospace' }}>→</span>
          </Link>
        </div>

        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px ${variant === 'dark' ? 'bg-ink' : 'bg-cream'} transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`}/>
          <span className={`block w-6 h-px ${variant === 'dark' ? 'bg-ink' : 'bg-cream'} transition-opacity ${open ? 'opacity-0' : ''}`}/>
          <span className={`block w-6 h-px ${variant === 'dark' ? 'bg-ink' : 'bg-cream'} transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden fixed inset-0 bg-cream z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-start gap-6 p-10 pt-32">
          <span className="eyebrow">Navigation</span>
          <div className="flex flex-col gap-5 mt-2">
            <NavLinks variant="dark" onClick={() => setOpen(false)} />
          </div>
          <Link to="/en/contact-us" onClick={() => setOpen(false)} className="btn-primary mt-6">
            Talk to us <span style={{ fontFamily: 'DM Mono, monospace' }}>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
