import { useEffect, useLayoutEffect, useRef } from 'react'
import { Mark } from '../../../elems/logo.jsx'
import { marketsShort } from '../../../data/site.js'
import { T, RULE_A, RULE_B, ASPECT } from './timeline'

/*
 * Scene — Signal.
 *
 * Scattered points — tokens — drift onto an ink ground and organise into a
 * layered network. Its layers wire up and activations run along the wires.
 * The mark's own two red rules then sweep down through it, lighting each
 * node they pass, and stop where they sit in the mark. The network collapses
 * onto the outline of the M, the real mark fills that outline, the full-width
 * rules contract into the mark's own, and the name decodes beneath.
 *
 * On exit the ink sheet tears along the rules — top half up, bottom half
 * down — while the mark flies to the header's mark, so the intro does not
 * end and a website appear: the mark you watched being made is the one in
 * the corner of the page.
 *
 * Built on Minifinans' Settlement: the loading boundary is the ENGINE, not
 * this component. What draws first is not a placeholder, it is the half of
 * the scene that was always DOM — ground, rules, mark, name. The network is
 * absent for the first 0.1s by design, so a slow import is invisible, and a
 * failed one leaves a composition that still finishes.
 */

/*
 * Is a context worth having? Probes with failIfMajorPerformanceCaveat first;
 * if only a plain context succeeds we are on a software rasteriser (tier C).
 * Each probe loses its context at once — iOS counts them against a cap. This
 * lives in the main chunk on purpose: it gates the import.
 */
function probe(type, strict) {
  const c = document.createElement('canvas')
  const gl = c.getContext(type, strict && { failIfMajorPerformanceCaveat: true })
  if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext()
  c.width = c.height = 1
  return !!gl
}

function worthIt() {
  const n = navigator
  if (n.connection?.saveData) return null
  if ((n.deviceMemory ?? 8) <= 2 || (n.hardwareConcurrency ?? 8) <= 2) return null
  if (probe('webgl2', true) || probe('webgl', true)) return 'full'
  if (probe('webgl2', false) || probe('webgl', false)) return 'soft'
  return null
}

const NAME = 'Maxi AI Development'
const READOUT = `London · Est. 2024 · ${marketsShort}`
const GLYPHS = '01<>/{}[]=+*#%&$ABCDEFGHJKLMNPQRSTUVWXYZ'

/* The name resolves left to right out of mono glyphs. Pure function of time,
   like everything else here, so a freeze is exact. */
function decodeAt(text, t, start, dur) {
  const k = (t - start) / dur
  if (k <= 0) return ''
  if (k >= 1) return text
  const settled = Math.floor(text.length * k)
  let out = text.slice(0, settled)
  const tail = Math.min(text.length, settled + 4)
  for (let i = settled; i < tail; i++) {
    out += text[i] === ' ' ? ' ' : GLYPHS[(i * 7 + Math.floor(t * 30)) % GLYPHS.length]
  }
  return out
}

const typeAt = (text, t, start, dur) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.round(((t - start) / dur) * text.length))))

export default function Signal({ leaving, reduced, frozen }) {
  const root = useRef(null)
  const holder = useRef(null)
  const markBox = useRef(null)
  const name = useRef(null)
  const readout = useRef(null)
  const count = useRef(null)
  const engine = useRef(null)
  const gone = useRef(false)
  const origin = useRef(performance.now()).current

  const frozenAt = () =>
    frozen && root.current
      ? parseFloat(getComputedStyle(root.current).getPropertyValue('--at')) || 0
      : null

  /* The type: name decode, readout typing, the progress counter. In the DOM,
     so it runs whether or not WebGL does. Writes only on change. */
  useEffect(() => {
    if (reduced) return
    const at = frozenAt()
    const paint = (t) => {
      const n = decodeAt(NAME, t, T.word, 0.7)
      const r = typeAt(READOUT, t, T.readout, 0.6)
      const c = String(Math.round(100 * Math.min(1, Math.max(0, (t - 0.2) / (T.mark - 0.2))))).padStart(3, '0')
      if (name.current.textContent !== n) name.current.textContent = n
      if (readout.current.textContent !== r) readout.current.textContent = r
      if (count.current.textContent !== c) count.current.textContent = c
    }
    if (at != null) {
      paint(at)
      return
    }
    let raf = 0
    const tick = (now) => {
      const t = (now - origin) / 1000
      paint(t)
      raf = t > T.readout + 0.7 ? 0 : requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, frozen, origin])

  /* The network. Gated before the import fires: reduced motion, save-data, a
     small machine, or no usable context, and three.js is never fetched.
     StrictMode mounts this twice, so `cancelled` is checked after the awaits
     and the engine owns its own canvas. */
  useEffect(() => {
    if (reduced) return
    const quality = worthIt()
    if (!quality) return
    let cancelled = false
    const run = async () => {
      const [mod] = await Promise.all([import('./engine'), document.fonts?.ready])
      if (cancelled || gone.current) return
      // Too late to be part of the story; never create a context at all.
      if (performance.now() - origin > 2000) return
      const h = mod.start({
        holder: holder.current,
        mark: markBox.current,
        origin,
        frozenAt: frozenAt(),
        software: quality === 'soft',
      })
      if (cancelled) h.dispose()
      else engine.current = h
    }
    run().catch((e) => {
      if (import.meta.env.DEV) console.warn('[signal] engine unavailable', e)
    })
    return () => {
      cancelled = true
      engine.current?.dispose()
      engine.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, origin])

  /*
   * The exit. One batch of reads at T=0: the intro's mark and the header's
   * mark, so the flight lands exactly — scale from the widths, translation
   * from the centres (the scroll lock keeps the gutter reserved, so the
   * header sits half a scrollbar left of the overlay's centre; reading both
   * rects makes that free).
   */
  useLayoutEffect(() => {
    if (!leaving) return
    gone.current = true
    engine.current?.leave()
    if (reduced) return
    const el = markBox.current
    const target = document.querySelector('[data-header-mark]')
    if (!el || !target) return
    const from = el.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    if (!from.width || !to.width) return
    const put = (k, v) => el.style.setProperty(k, v)
    put('--fly-dx', `${(to.left + to.width / 2 - (from.left + from.width / 2)).toFixed(1)}px`)
    put('--fly-dy', `${(to.top + to.height / 2 - (from.top + from.height / 2)).toFixed(1)}px`)
    put('--fly-s', (to.width / from.width).toFixed(4))
    el.classList.add('sig-fly')
  }, [leaving, reduced])

  const mode = `${reduced ? 'sig-still' : ''} ${frozen ? 'sig-frozen' : ''} ${leaving ? 'sig-out' : ''}`
  const vars = {
    '--rule-a': RULE_A,
    '--rule-b': RULE_B,
    '--split': (RULE_A + RULE_B) / 2,
    '--aspect': ASPECT,
    '--t-scan': `${T.scan}s`,
    '--t-scan-len': `${T.scanLen}s`,
    '--t-mark': `${T.mark}s`,
    '--t-contract': `${T.contract}s`,
    '--t-handover': `${T.handover}s`,
  }

  return (
    <div ref={root} className={`sig ${mode}`} style={vars} aria-hidden="true">
      <div className="sig-half sig-top" />
      <div className="sig-half sig-bottom" />

      {!reduced && <div ref={holder} className="sig-sheet" />}

      <div className="sig-corner sig-corner-l">
        <span className="pulse-dot" /> Maxi<span className="sig-corner-long">&nbsp;AI Development Ltd</span>
      </div>
      <div className="sig-corner sig-corner-r">
        Init <span ref={count} className="tabular">{reduced ? '100' : '000'}</span>%
      </div>

      <div className="sig-scan sig-scan-a" />
      <div className="sig-scan sig-scan-b" />

      <div ref={markBox} className="sig-mark">
        <Mark className="sig-mark-svg" tone="cream" rulesClassName="sig-mark-rules" />
      </div>

      <div className="sig-type">
        <p ref={name} className="sig-name">{reduced ? NAME : ''}</p>
        <p ref={readout} className="sig-readout">{reduced ? READOUT : ''}</p>
      </div>
    </div>
  )
}
