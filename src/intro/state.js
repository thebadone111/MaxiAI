import { createContext, useContext } from 'react'

/*
 * Whether this visit sees the intro, and the handoff signal. Ported from
 * Minifinans (src/intro/state.js), adapted for a prerendered site.
 *
 * Once per visit, not once per page load: sessionStorage, so moving around
 * the site does not replay it, but coming back tomorrow does.
 *
 * The decision is made TWICE, identically, and that is deliberate:
 *
 *   1. By the inline script in index.html's <head>, before first paint. If
 *      the intro will play it puts `intro-pending` on <html>, and CSS covers
 *      the prerendered page with the ink ground so nothing flashes before
 *      React has loaded. (That script cannot import this module — it must
 *      run before any bundle has been fetched — so its logic is a copy.
 *      Change one, change both.)
 *   2. By <Intro>, which reads that class after hydration and mounts the
 *      overlay. Reading the class rather than re-deciding keeps the two in
 *      step by construction.
 *
 * Query parameters, for showing people and for development:
 *   ?intro         replay it
 *   ?intro=off     skip it
 *   ?still         the reduced-motion version            (dev only)
 *   ?at=2.4        freeze every animation at that second (dev only)
 */

/*
 * True once the page is allowed to arrive.
 *
 * It flips at the FIRST frame of the intro's exit, not when the overlay
 * unmounts, so the hero begins its own arrival while the overlay is still
 * leaving and the two read as one event.
 *
 * The default is `true`, which keeps an ordinary page load unanimated: the
 * hero is `is-in` on its first paint, and a CSS transition only runs on a
 * change. Heroes must read this rather than useReveal() — an
 * IntersectionObserver still fires behind a fixed overlay, so an
 * observer-driven hero would play its whole reveal unseen.
 */
export const IntroDone = createContext(true)
export const useIntroDone = () => useContext(IntroDone)

export const KEY = 'maxi:intro'
export const PENDING = 'intro-pending'

const params = () => new URLSearchParams(window.location.search)

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* storage blocked: it will play again, which is the lesser failure */
  }
}

// Set by the head script; see the note above.
export const introPending = () =>
  document.documentElement.classList.contains(PENDING)

export const clearPending = () =>
  document.documentElement.classList.remove(PENDING)

// Development only. A number freezes the scene at that second so a frame can
// be screenshotted; null means run normally.
export function freezeAt() {
  if (!import.meta.env.DEV) return null
  const v = params().get('at')
  const n = Number(v)
  return v !== null && Number.isFinite(n) ? n : null
}

export function forceStill() {
  return import.meta.env.DEV && params().has('still')
}
