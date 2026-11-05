import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { VISUAL_MODE } from '../data/site.js';

/*
 * Which visual variant the site shows: 'photo' (stock photography through
 * the AVIF pipeline) or 'code' (procedural, drawn-on-scroll visuals).
 *
 * Both are built so the two can be compared on the real site. The default
 * lives in src/data/site.js and is what the prerender bakes into the HTML.
 * ?visuals=photo|code overrides it for this visit (remembered in
 * sessionStorage), and the command palette can toggle it. The override is
 * applied after hydration, so the server and client still agree on the
 * first render.
 *
 * Once one variant is chosen, delete the other's slots from
 * src/visuals/registry.jsx, this provider, and the palette command.
 */
export const MODES = ['photo', 'code'];
const KEY = 'maxi:visuals';

const VisualsContext = createContext({ mode: VISUAL_MODE, setMode: () => {} });
export const useVisuals = () => useContext(VisualsContext);

export function VisualsProvider({ children }) {
  const [mode, setModeState] = useState(VISUAL_MODE);

  useEffect(() => {
    let next = null;
    try {
      const q = new URLSearchParams(window.location.search).get('visuals');
      if (MODES.includes(q)) {
        next = q;
        sessionStorage.setItem(KEY, q);
      } else {
        const saved = sessionStorage.getItem(KEY);
        if (MODES.includes(saved)) next = saved;
      }
    } catch {
      /* storage blocked: the default stands */
    }
    if (next && next !== VISUAL_MODE) setModeState(next);
  }, []);

  const setMode = useCallback((m) => {
    if (!MODES.includes(m)) return;
    setModeState(m);
    try { sessionStorage.setItem(KEY, m); } catch { /* ignore */ }
  }, []);

  return (
    <VisualsContext.Provider value={{ mode, setMode }}>
      {children}
    </VisualsContext.Provider>
  );
}
