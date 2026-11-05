import { useEffect, useRef, useSyncExternalStore } from 'react'
import { onMeasure, onScrollFrame, reducedMotion } from './smooth'

/*
 * Motion hooks. Ported from Minifinans (src/motion/hooks.js, `motion`
 * branch). The difference here is the prerender: MaxiAI's pages are rendered
 * to HTML at build time and hydrated, so nothing may read window during
 * render, and anything that depends on a media query must render the
 * server's answer first and correct itself after hydration
 * (useSyncExternalStore's server snapshot does exactly that).
 */

/*
 * One IntersectionObserver for the whole page.
 *
 * `once` targets get `is-in` and are then dropped; the others toggle `in-view`
 * both ways, which is how loops and compositor layers are kept off while the
 * element is off screen.
 */
const targets = new WeakMap()
let observer = null

/*
 * Anything already on screen when the page paints is put straight into its
 * revealed state with transitions switched off for one frame. Without this
 * the visible part of the page fades up from nothing — content withheld from
 * someone who has not scrolled yet.
 */
const LOAD_GRACE_MS = 500
let loadedAt = 0

function settle(el) {
  if (performance.now() - loadedAt > LOAD_GRACE_MS) {
    el.classList.add('is-in')
    return
  }
  el.classList.add('no-reveal-anim', 'is-in')
  requestAnimationFrame(() =>
    requestAnimationFrame(() => el.classList.remove('no-reveal-anim')))
}

// Dense enough that any threshold a caller asks for fires within 0.05 of it.
const THRESHOLDS = Array.from({ length: 11 }, (_, i) => i * 0.05)

function observe(el, opts) {
  if (!el) return () => {}
  if (typeof IntersectionObserver === 'undefined') {
    el.classList.add(opts.once ? 'is-in' : 'in-view')
    return () => {}
  }
  if (!observer) {
    loadedAt = performance.now()
    observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const o = targets.get(e.target)
        if (!o) return
        if (o.once) {
          // Either `threshold` visible, or taller than the viewport with a
          // quarter-screen of it showing — a very tall block could otherwise
          // never reach its own threshold.
          const enough =
            e.intersectionRatio >= o.threshold ||
            e.intersectionRect.height >= window.innerHeight / 4
          if (e.isIntersecting && enough) {
            settle(e.target)
            observer.unobserve(e.target)
            targets.delete(e.target)
          }
        } else {
          e.target.classList.toggle('in-view', e.isIntersecting)
        }
      }),
      { threshold: THRESHOLDS, rootMargin: '0px 0px -5% 0px' },
    )
  }
  targets.set(el, opts)
  observer.observe(el)
  return () => {
    observer.unobserve(el)
    targets.delete(el)
  }
}

// Adds `is-in` once the element is `threshold` visible; index.css does the
// motion. Heroes must not use this — see useIntroDone in src/intro/state.js.
export function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  useEffect(() => observe(ref.current, { once: true, threshold }), [threshold])
  return ref
}

// Toggles `in-view` while the element is on screen.
export function useInView() {
  const ref = useRef(null)
  useEffect(() => observe(ref.current, { once: false }), [])
  return ref
}

/*
 * Calls fn(progress, element) as the element travels through the viewport —
 * 0 when its top meets the viewport bottom, 1 when its bottom meets the
 * viewport top — and only while on screen and only when progress moved.
 *
 * `span`: progress over the element's own scroll length instead, for sticky
 * scenes: 0 when its top reaches the viewport top, 1 when its bottom reaches
 * the viewport bottom.
 *
 * Reduced motion is enforced here rather than in each caller: fn is called
 * once with `rest` and never subscribed.
 */
export function useScrollProgress(fn, { span = false, measure, rest = 1 } = {}) {
  const ref = useRef(null)
  const cb = useRef(fn)
  const measureCb = useRef(measure)
  useEffect(() => {
    cb.current = fn
    measureCb.current = measure
  })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion()) {
      measureCb.current?.(el)
      cb.current(rest, el)
      return
    }
    let top = 0
    let height = 0
    let last = -1
    const offMeasure = onMeasure(() => {
      const r = el.getBoundingClientRect()
      top = r.top + window.scrollY
      height = r.height
      measureCb.current?.(el)
      last = -1
    })
    const offScroll = onScrollFrame((y, viewport) => {
      if (y + viewport < top - viewport * 0.2 || y > top + height + viewport * 0.2) return
      const raw = span
        ? (y - top) / Math.max(1, height - viewport)
        : (y + viewport - top) / (viewport + height)
      const p = Math.min(1, Math.max(0, raw))
      if (p === last) return
      last = p
      cb.current(p, el)
    })
    return () => {
      offMeasure()
      offScroll()
    }
  }, [span, rest])
  return ref
}

/*
 * A live media query. The server snapshot is `serverValue`, so the prerendered
 * HTML and the first client render agree; React re-renders with the real
 * value straight after hydration. On client-side navigations there is no
 * hydration and the real value is used from the first render.
 */
function useMedia(q, serverValue) {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(q)
      mq.addEventListener('change', notify)
      return () => mq.removeEventListener('change', notify)
    },
    () => window.matchMedia(q).matches,
    () => serverValue,
  )
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)', false)
export const useMinWidth = (px) => useMedia(`(min-width: ${px}px)`, false)
export const useFinePointer = () => useMedia('(pointer: fine)', false)

// True on the client after hydration, false in the prerender and on the
// hydration pass. For anything that must not be in the static HTML.
export const useHydrated = () =>
  useSyncExternalStore(() => () => {}, () => true, () => false)
