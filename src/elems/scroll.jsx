import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToHash — React Router doesn't scroll to #anchors, and doesn't reset
 * scroll between pages. Both matter here: the secondary CTAs all point at
 * section anchors on other pages.
 *
 * The position is measured twice — once on the next frame, and again once
 * webfonts have loaded, because Fraunces and Libre Baskerville have very
 * different metrics from the fallbacks and the target moves under us.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    const wasFirst = firstRender.current;
    firstRender.current = false;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const go = () => document.getElementById(id)?.scrollIntoView({ block: 'start' });
      const frame = requestAnimationFrame(go);
      document.fonts?.ready.then(go).catch(() => {});
      return () => cancelAnimationFrame(frame);
    }

    // Don't fight the browser's own scroll restoration on a reload.
    if (!wasFirst) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default ScrollToHash;
