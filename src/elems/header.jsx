import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Mark } from './logo.jsx';
import { lockScroll, onPageProgress, onScrollFrame } from '../motion/smooth.js';
import { openCommandPalette, useShortcutLabel } from './command.jsx';

const LINKS = [
  { to: '/en/services', label: 'Services' },
  { to: '/en/ai-product', label: 'AI Product' },
  { to: '/en/programme', label: 'Programme' },
  { to: '/en/about-us', label: 'About' },
];

/*
 * The header (behaviour after MaisonMere's Header.jsx).
 *
 *   - Fixed. Hides once you scroll down past 200px; any scroll up brings it
 *     back (3px dead zone, so trackpad jitter does not flicker it).
 *   - Past 40px it takes a translucent cream ground with a backdrop blur and
 *     a hairline, so it reads over any section.
 *   - A 1px signal rule along its foot fills with page progress.
 *   - The mark carries data-header-mark: the intro flies its own mark onto
 *     exactly this element on exit.
 *
 * State changes only re-render when they change; the scroll handler itself
 * is arithmetic.
 */
function useHeaderState() {
  const [state, setState] = useState({ solid: false, hidden: false });
  useEffect(() => {
    let lastY = window.scrollY;
    let cur = { solid: false, hidden: false };
    return onScrollFrame((y) => {
      const dy = y - lastY;
      let hidden = cur.hidden;
      if (y < 200) hidden = false;
      else if (dy > 3) hidden = true;
      else if (dy < -3) hidden = false;
      if (Math.abs(dy) > 3 || y < 200) lastY = y;
      const solid = y > 40;
      if (solid !== cur.solid || hidden !== cur.hidden) {
        cur = { solid, hidden };
        setState(cur);
      }
    });
  }, []);
  return state;
}

function ProgressRule() {
  const bar = useRef(null);
  useEffect(() => onPageProgress((p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  }), []);
  return (
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
      <span ref={bar} className="block h-full origin-left bg-signal" style={{ transform: 'scaleX(0)' }} />
    </span>
  );
}

function Logo({ inverse }) {
  return (
    <Link
      to="/en/home"
      className={`group inline-flex items-center gap-3.5 transition-colors duration-500 ${inverse ? 'text-cream' : 'text-ink'}`}
      aria-label="Maxi AI Development — Home"
    >
      <Mark className="h-[34px] w-auto" tone={inverse ? 'cream' : 'ink'} data-header-mark />
      <span aria-hidden="true" className="h-10 w-px bg-current opacity-50" />
      <span
        className="font-display text-[29px] leading-none transition-colors group-hover:text-signal"
        style={{ fontWeight: 400, fontVariationSettings: '"opsz" 144' }}
      >
        Maxi
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { solid, hidden } = useHeaderState();
  const shortcut = useShortcutLabel();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    lockScroll('menu', open);
    return () => lockScroll('menu', false);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const show = open || !hidden;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 h-[var(--header-h)] transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-expo)] ${
          show ? 'translate-y-0' : '-translate-y-full'
        } ${
          open
            ? 'z-50 bg-transparent'
            : solid
              ? 'z-40 bg-cream/85 backdrop-blur-md shadow-[0_1px_0_var(--color-stone)]'
              : 'z-40 bg-cream'
        }`}
      >
        <div className="wrap flex h-full items-center justify-between gap-8">
          <Logo inverse={open} />

          <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex xl:gap-14">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `link-sweep pb-1 font-ui text-[14px] font-medium tracking-wide transition-colors hover:text-signal ${
                    isActive ? 'text-signal' : 'text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <button
              type="button"
              onClick={openCommandPalette}
              className="inline-flex items-center gap-2 rounded-[3px] border border-stone px-2.5 py-1.5 font-mono text-[11px] tracking-[0.12em] text-ink-mid transition-colors hover:border-ink hover:text-ink"
              aria-label="Open the command menu"
            >
              <span className="text-[13px] leading-none">⌕</span>
              <kbd className="font-mono">{shortcut}</kbd>
            </button>
            <Link to="/en/contact-us" className="btn-primary btn-sm">
              Talk to us <span>→</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={openCommandPalette}
              className={`p-2 font-mono text-[18px] leading-none transition-colors ${open ? 'text-cream' : 'text-ink'}`}
              aria-label="Open the command menu"
            >
              ⌕
            </button>
            <button
              type="button"
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className={`block h-px w-6 transition-[transform,background-color] duration-500 ${open ? 'translate-y-[3.5px] rotate-45 bg-cream' : 'bg-ink'}`} />
              <span className={`block h-px w-6 transition-[transform,background-color] duration-500 ${open ? '-translate-y-[3.5px] -rotate-45 bg-cream' : 'bg-ink'}`} />
            </button>
          </div>
        </div>
        <ProgressRule />
      </header>

      {/* Mobile menu: an ink sheet that drops from the top; the links rise in
          after it. inert while closed, so nothing in it is focusable. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-[45] bg-ink text-cream transition-transform duration-[900ms] ease-[var(--ease-quart)] lg:hidden ${
          open ? 'translate-y-0' : '-translate-y-full'
        } ${open ? 'menu-open' : ''}`}
      >
        <div className="wrap flex h-full flex-col justify-between pb-10 pt-[calc(var(--header-h)+2rem)]">
          <nav aria-label="Mobile" className="flex flex-col gap-2">
            <span className="eyebrow mb-4">Navigation</span>
            {[{ to: '/en/home', label: 'Home' }, ...LINKS, { to: '/en/contact-us', label: 'Contact' }].map((l, i) => (
              <span key={l.to} className="menu-line overflow-hidden" style={{ '--i': i }}>
                <Link to={l.to} onClick={() => setOpen(false)} className="block font-display text-[40px] font-light leading-[1.15] hover:text-signal">
                  {l.label}
                </Link>
              </span>
            ))}
          </nav>
          <Link to="/en/contact-us" onClick={() => setOpen(false)} className="btn-primary btn-signal self-start">
            Talk to us <span>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
