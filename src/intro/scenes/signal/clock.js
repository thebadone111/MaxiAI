/*
 * The story clock, and the easing vocabulary every value is a function of.
 * Copied from Minifinans' Settlement scene unchanged.
 *
 * One rule governs the whole scene: every visual value is a pure function of
 * story time. Nothing integrates, nothing accumulates, nothing remembers the
 * last frame. That is what makes `?at=` a genuine freeze rather than an
 * approximation, lets the engine pick up mid-stride when the lazy chunk
 * arrives late, and -- most importantly -- stops the DOM half and the canvas
 * half of this composition from drifting apart. They are both reading the
 * same number.
 *
 * The origin is the component's mount, not the moment WebGL became ready.
 * The spec asks for the 5s budget to begin when we can actually draw, but the
 * DOM half (CSS animations, the counting readout) has been running since
 * mount and the harness's own 5s hold started there too. Re-originating the
 * GL clock would buy a correct budget at the cost of the one thing the clock
 * exists to guarantee. So the engine catches up instead.
 */

// Newton-Raphson on the x polynomial, then evaluate y. Five iterations is
// plenty for curves this tame, and a bisection pass covers the flat regions
// where the derivative vanishes.
const ca = (a, b) => 1 - 3 * b + 3 * a
const cb = (a, b) => 3 * b - 6 * a
const cc = (a) => 3 * a
const curve = (t, a, b) => ((ca(a, b) * t + cb(a, b)) * t + cc(a)) * t
const slope = (t, a, b) => 3 * ca(a, b) * t * t + 2 * cb(a, b) * t + cc(a)

function bezier(x1, y1, x2, y2) {
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 5; i++) {
      const s = slope(t, x1, x2)
      if (s < 1e-5) break
      const e = curve(t, x1, x2) - x
      if (e > -1e-6 && e < 1e-6) break
      t -= e / s
    }
    if (t < 0) t = 0
    if (t > 1) t = 1
    return curve(t, y1, y2)
  }
}

export const E_IN = bezier(0.22, 0.61, 0.36, 1) // --ease-reveal: entrances
export const E_OUT = bezier(0.76, 0, 0.24, 1) //  --ease-quart: exits, the scan, the squaring-up
export const E_SETTLE = bezier(0.33, 0, 0.17, 1) // the one long gathering

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// Normalised progress through a beat. Every uniform in the engine is one of
// these fed through one of the curves above; nothing else.
export const span = (t, start, dur) => clamp01((t - start) / dur)

export const mix = (a, b, k) => a + (b - a) * k
