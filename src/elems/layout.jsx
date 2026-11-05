import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header.jsx';
import Footer from './footer.jsx';
import Curtain from './curtain.jsx';
import CommandPalette from './command.jsx';
import { VisualsProvider } from '../visuals/mode.jsx';
import { scrollToEl, scrollToTop, startSmoothScroll } from '../motion/smooth.js';
import Intro from '../intro/Intro.jsx';

/*
 * The shared page shell (after Minifinans' src/elems/layout.jsx).
 *
 * Header, <main> and Footer used to be rendered by each page. They live here
 * so the smooth-scroll engine has something to mount on that outlives
 * navigation. Two consequences are handled below: scroll position and focus
 * are no longer reset by <main> being destroyed, so both are reset
 * deliberately.
 */
export default function Layout() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  // Expression body, not a block: this must return the teardown, or
  // StrictMode's remount leaves a second Lenis running at double speed.
  useEffect(() => startSmoothScroll(), []);

  // The browser restoring a position and Lenis holding its own target
  // disagree on back/forward; own it rather than letting them race.
  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  /*
   * Hash links: measured after fonts load as well, because Fraunces and
   * Libre Baskerville have very different metrics from their fallbacks and
   * the target moves under us. The offset clears the fixed header.
   */
  useEffect(() => {
    if (hash) {
      const go = () =>
        scrollToEl(document.getElementById(decodeURIComponent(hash.slice(1))), { offset: -24 });
      const id = setTimeout(go, 60);
      document.fonts?.ready.then(() => setTimeout(go, 60)).catch(() => {});
      return () => clearTimeout(id);
    }
    if (!first.current) scrollToTop();
  }, [pathname, hash]);

  // Move focus to <main> on navigation (not on first load), so a keyboard
  // user lands in the new page rather than continuing through the header.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (hash) return;
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <VisualsProvider>
      <Intro>
        <a href="#main" className="skip-link" onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById('main');
          scrollToEl(main, { immediate: true });
          main?.focus({ preventScroll: true });
        }}>
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none pt-[var(--header-h)]">
          <Outlet />
        </main>
        <Footer />
        <Curtain />
        <CommandPalette />
      </Intro>
    </VisualsProvider>
  );
}
