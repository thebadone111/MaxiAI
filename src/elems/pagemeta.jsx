import { useEffect } from 'react';
import { routeMeta } from '../data/meta.js';

/**
 * PageMeta — keeps <title> and the meta description correct.
 *
 * The prerenderer already bakes both into each page's <head>, which is what
 * crawlers read. This only has to catch up when a visitor navigates
 * client-side, so it writes to the DOM in an effect rather than rendering
 * tags — no server output, and nothing for hydration to disagree about.
 */
function PageMeta({ route }) {
  useEffect(() => {
    const m = routeMeta[route];
    if (!m) return;

    document.title = m.title;

    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', m.description);
  }, [route]);

  return null;
}

export default PageMeta;
