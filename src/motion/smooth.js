/*
 * Smooth scrolling (Lenis) and the one scroll signal every scroll-driven
 * effect listens to. Ported from Minifinans (src/motion/smooth.js on its
 * `motion` branch), made safe to import during the prerender: nothing here
 * touches window or document until a function is called from an effect.
 *
 * The rule that makes this cheap: effects never read layout while scrolling.
 * Element positions are measured once, and again only when the page can have
 * changed size (`onMeasure`), so a scroll frame is pure arithmetic plus a
 * compositor-only style write.
 *
 * No GSAP ScrollTrigger. It cost 1720 ms of total blocking time on another
 * project of ours, which is the whole reason this is hand-rolled.
 */
import Lenis from 'lenis'

const isClient = typeof window !== 'undefined'
const query = (q) => (isClient ? window.matchMedia(q).matches : false)

export const reducedMotion = () => query('(prefers-reduced-motion: reduce)')
export const finePointer = () => query('(pointer: fine)')

let lenis = null
let teardown = null
const scrollers = new Set()
const measurers = new Set()
let vh = isClient ? window.innerHeight : 800

const emit = () => {
  const y = window.scrollY
  scrollers.forEach((fn) => fn(y, vh))
}

let measureQueued = false
function measure() {
  measureQueued = false
  vh = window.innerHeight
  measurers.forEach((fn) => fn())
  emit()
}

/*
 * Batched deliberately. Every useScrollProgress registration wants a measure,
 * and a dozen of them on one route change would otherwise be a dozen forced
 * layouts in a single frame — a visible hitch right after navigation.
 */
export function queueMeasure() {
  if (measureQueued || !isClient) return
  measureQueued = true
  requestAnimationFrame(measure)
}

export function startSmoothScroll() {
  // StrictMode mounts effects twice in development. A second Lenis would
  // drive window.scrollTo alongside the first and the page would scroll at
  // double speed.
  if (teardown) return teardown

  const smooth = !reducedMotion()

  if (smooth) {
    lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: false })
    lenis.on('scroll', emit)
    // A lock taken before this ran (a child's effect fires before the
    // parent's) would otherwise be half-applied: overflow is set, but Lenis
    // scrolls programmatically, which overflow does not block.
    if (locks.size > 0) lenis.stop()
  } else {
    // Without Lenis nothing emits the scroll signal, and every scroll-driven
    // effect would freeze at its mount value.
    window.addEventListener('scroll', emit, { passive: true })
  }

  const ro = new ResizeObserver(queueMeasure) // content height: fonts, images, route changes
  ro.observe(document.body)
  window.addEventListener('resize', queueMeasure)
  // The body observer only fires when body's own box changes; a font swap or
  // an image inside a fixed-ratio frame can still move what is below it.
  document.fonts?.ready.then(queueMeasure)
  window.addEventListener('load', queueMeasure)

  teardown = () => {
    ro.disconnect()
    window.removeEventListener('resize', queueMeasure)
    window.removeEventListener('load', queueMeasure)
    if (smooth) {
      lenis.destroy()
      lenis = null
    } else {
      window.removeEventListener('scroll', emit)
    }
    teardown = null
  }
  return teardown
}

// fn(scrollY, viewportHeight) on every scrolled frame, and once straight away.
export function onScrollFrame(fn) {
  scrollers.add(fn)
  fn(window.scrollY, vh)
  return () => scrollers.delete(fn)
}

// fn() whenever the layout may have moved. Read positions here, never in
// onScrollFrame. Batched into the next frame with everyone else's.
export function onMeasure(fn) {
  measurers.add(fn)
  queueMeasure()
  return () => measurers.delete(fn)
}

/*
 * Several things may hold the page still at once (intro, menu, command
 * palette); it moves again when none do. `overflow` alone is not a lock here:
 * Lenis scrolls programmatically and sails straight through it, so
 * lenis.stop() is the part that works. The style write covers reduced-motion
 * visits where Lenis never starts.
 */
const locks = new Set()
export function lockScroll(owner, locked) {
  if (!isClient) return
  if (locked) locks.add(owner)
  else locks.delete(owner)

  const still = locks.size > 0
  if (lenis) still ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = still ? 'clip' : ''
  document.documentElement.style.touchAction = still ? 'none' : ''
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}

export function scrollToEl(el, { offset = 0, immediate = false } = {}) {
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, immediate, force: true })
  else el.scrollIntoView()
}

// Whole-page progress, 0 at the top and 1 at the bottom. For the header's
// progress rule; measured on the same cadence as everything else.
let docH = 1
export function onPageProgress(fn) {
  const offM = onMeasure(() => {
    docH = Math.max(1, document.documentElement.scrollHeight - vh)
  })
  const offS = onScrollFrame((y) => fn(Math.min(1, Math.max(0, y / docH))))
  return () => {
    offM()
    offS()
  }
}
