import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { lockScroll, reducedMotion } from '../motion/smooth'
import {
  IntroDone, clearPending, forceStill, freezeAt, introPending, markIntroSeen,
} from './state'
import Scene from './scenes/signal'
import './intro.css'

/*
 * The entry overlay. Ported from Minifinans (src/intro/Intro.jsx).
 *
 * The page renders underneath it, always — the intro is never on the
 * critical path for the largest paint. It holds for five seconds, or until
 * the first click, key or scroll, once per visit.
 *
 * Difference from Minifinans: this site is prerendered. The server and the
 * hydrating client must render the same tree, and the server cannot know
 * whether this visitor has seen the intro — so both render `gone`, and the
 * overlay is mounted in a layout effect (before the first client paint)
 * when the head script has flagged `intro-pending`. Until then CSS keeps the
 * page covered with the same ink ground, so the handover is invisible.
 */

function setPageInert(on) {
  const root = document.getElementById('root')
  if (!root) return
  for (const el of root.children) {
    if (el.hasAttribute?.('data-intro')) continue
    el.inert = on
  }
}

const HOLD_MS = 5200
const REDUCED_HOLD_MS = 1400
const GRACE_MS = 350 // ignore the input that loaded the page
const OUT_MS = 1150
const REDUCED_OUT_MS = 450

function Overlay({ leaving, reduced, at, onLeave, onDone }) {
  const t0 = useRef(performance.now()).current
  const enter = useRef(null)
  const hold = reduced ? REDUCED_HOLD_MS : HOLD_MS

  const exit = useCallback(() => {
    markIntroSeen()
    onLeave()
  }, [onLeave])

  // A dev freeze holds the frame: no timer and no exit on interaction.
  useEffect(() => {
    if (leaving) return
    const timer = at == null ? setTimeout(exit, hold) : null
    const interact = (e) => {
      if (at != null) return
      if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return
      if (e.target.closest?.('[data-intro-ui]')) return
      if (performance.now() - t0 > GRACE_MS) exit()
    }
    const events = ['pointerdown', 'keydown', 'wheel', 'touchmove']
    events.forEach((ev) => window.addEventListener(ev, interact, { passive: true }))
    return () => {
      clearTimeout(timer)
      events.forEach((ev) => window.removeEventListener(ev, interact))
    }
  }, [exit, hold, leaving, at, t0])

  useEffect(() => { enter.current?.focus({ preventScroll: true }) }, [])

  useEffect(() => {
    if (!leaving) return
    const id = setTimeout(onDone, reduced ? REDUCED_OUT_MS : OUT_MS)
    return () => clearTimeout(id)
  }, [leaving, reduced, onDone])

  /*
   * Cover the scrollbar gutter. `scrollbar-gutter: stable` keeps the track
   * reserved while the scroll is locked, and a fixed `inset-0` resolves
   * against a box that excludes it — leaving a bare stripe down the right
   * edge, glaring on an ink ground. Widen the dialog rather than reflowing
   * the page behind it.
   */
  const dialog = useRef(null)
  useLayoutEffect(() => {
    const el = dialog.current
    if (!el) return
    const fit = () => {
      el.style.width = ''
      const gap = window.innerWidth - el.clientWidth
      if (gap > 0) el.style.width = `calc(100% + ${gap}px)`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div
      ref={dialog}
      data-intro
      role="dialog"
      aria-modal="true"
      aria-label="Maxi AI Development"
      className={`intro fixed inset-0 z-[90] overflow-hidden ${leaving ? 'intro-leaving' : ''} ${
        reduced ? 'intro-reduced' : ''
      }`}
      style={{ '--at': at == null ? '0s' : `${at}s`, '--hold': `${hold}ms` }}
    >
      <Scene leaving={leaving} reduced={reduced} frozen={at != null} />

      <div
        data-intro-ui
        className={`absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-opacity duration-300 sm:px-10 ${
          leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={exit}
          className="py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-mist transition-colors hover:text-cream"
        >
          Skip
        </button>
        <button
          ref={enter}
          type="button"
          onClick={exit}
          className="relative flex h-16 w-16 items-center justify-center font-mono text-[10px] uppercase tracking-[0.22em] text-cream"
        >
          <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="32" cy="32" r="31" fill="none" stroke="var(--color-cream)" strokeOpacity="0.18" />
            <circle
              cx="32" cy="32" r="31" fill="none"
              stroke="var(--color-signal)"
              strokeWidth="1.5"
              pathLength="1" strokeDasharray="1" strokeDashoffset="1"
              style={{
                animation: `intro-count ${hold}ms linear forwards`,
                ...(at != null && { animationDelay: `-${at}s`, animationPlayState: 'paused' }),
              }}
            />
          </svg>
          Enter
        </button>
      </div>
    </div>
  )
}

/*
 * stage: 'gone' (server, hydration) -> 'show' -> 'leaving' -> 'gone'.
 *
 * Intro wraps the page so it can tell the page when to arrive. It renders
 * its children on every frame and must never return early — that would
 * unmount the whole site.
 */
export default function Intro({ children }) {
  const [stage, setStage] = useState('gone')
  const [released, setReleased] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [at, setAt] = useState(null)

  // Before the first client paint: take over from the head script's cover.
  useLayoutEffect(() => {
    if (!introPending()) return
    setReduced(reducedMotion() || forceStill())
    setAt(freezeAt())
    setReleased(false)
    setStage('show')
  }, [])

  // The overlay is mounted (it carries the same ground), so the CSS cover
  // can go. Waiting for the commit is what makes the handover seamless.
  useLayoutEffect(() => {
    if (stage === 'show') clearPending()
  }, [stage])

  useEffect(() => {
    if (stage === 'leaving') setReleased(true)
  }, [stage])

  useEffect(() => {
    if (stage !== 'gone') lockScroll('intro', true)
    else lockScroll('intro', false)
  }, [stage])

  /*
   * Released on unmount only. Returning this from the effect above looks
   * equivalent and is not: React runs every cleanup before any effect, so
   * each stage change would release the lock and re-take it a moment later.
   * In that gap the scrollbar returns, the viewport narrows ~15px, and
   * anything measured at the start of the exit — the mark's flight to the
   * header — misses.
   */
  useEffect(() => () => lockScroll('intro', false), [])

  useEffect(() => {
    if (stage !== 'gone') setPageInert(true)
  }, [stage])

  const leave = useCallback(() => setStage((s) => (s === 'show' ? 'leaving' : s)), [])
  const done = useCallback(() => {
    setStage('gone')
    // Lift inert before moving focus: an inert element cannot take focus.
    setPageInert(false)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [])

  return (
    <IntroDone.Provider value={released}>
      {children}
      {stage !== 'gone' && (
        <Overlay
          leaving={stage === 'leaving'}
          reduced={reduced}
          at={at}
          onLeave={leave}
          onDone={done}
        />
      )}
    </IntroDone.Provider>
  )
}
