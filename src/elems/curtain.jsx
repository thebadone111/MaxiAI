import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mark } from './logo.jsx';
import { reducedMotion } from '../motion/smooth.js';
import './chrome.css';

const NAMES = {
  '/en/home': 'Home',
  '/en/services': 'Services',
  '/en/ai-product': 'AI Product',
  '/en/programme': 'The Studio Programme',
  '/en/about-us': 'About',
  '/en/contact-us': 'Contact',
  '/en/privacy': 'Privacy',
  '/en/tos': 'Terms',
};

/*
 * The page curtain (after MaisonMere's Layout.jsx Curtain).
 *
 * On every route change after the first, an ink panel bearing the mark and
 * the destination's name covers the cut, a signal rule draws along its foot,
 * and it lifts away. The new page renders underneath at once — the curtain
 * hides the swap rather than delaying it.
 *
 * Mounted from a layout effect, so it is on screen in the same frame as the
 * new page and the cut is never seen. Skipped on hash-only navigation and
 * under reduced motion.
 */
export default function Curtain() {
  const { pathname } = useLocation();
  const prev = useRef(pathname);
  const [run, setRun] = useState(null);

  useLayoutEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    if (reducedMotion()) return;
    setRun({ id: Date.now(), name: NAMES[pathname] || 'Maxi' });
  }, [pathname]);

  useLayoutEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setRun(null), 1150);
    return () => clearTimeout(t);
  }, [run]);

  if (!run) return null;
  return (
    <div key={run.id} className="curtain" aria-hidden="true">
      <div className="curtain-inner">
        <Mark className="h-16 w-auto md:h-20" tone="cream" />
        <p className="curtain-name">{run.name}</p>
      </div>
      <span className="curtain-rule" />
    </div>
  );
}
