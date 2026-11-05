/*
 * The M, as a list of points to plot. Adapted from Minifinans'
 * mark-targets.js.
 *
 * A contour, not a fill: filling the silhouette with points gives a grey
 * blob, while plotting its edge gives something unmistakably the letter,
 * which the real mark then fills. The source is the same traced path the
 * <Mark> component draws (src/elems/mark-paths.js), so there is no second
 * copy of the artwork to keep in step. The tracer emits M/L/Z only, which is
 * all this parser understands — check that first if the artwork is replaced.
 */
import { MARK } from '../../../elems/mark-paths.js'

function polylines(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g) || []
  const subs = []
  let pts = null
  let i = 0
  while (i < tok.length) {
    const k = tok[i++]
    if (k === 'M') {
      if (pts && pts.length > 4) subs.push(pts)
      pts = [+tok[i++], +tok[i++]]
    } else if (k === 'L') {
      pts.push(+tok[i++], +tok[i++])
    } else if (k === 'Z') {
      if (pts) pts.push(pts[0], pts[1])
    }
  }
  if (pts && pts.length > 4) subs.push(pts)
  return subs
}

// Total length of every subpath, then exactly `count` points spaced evenly
// along all of them — so each lattice node gets exactly one target.
function resampleTo(subs, count) {
  const segs = []
  let total = 0
  for (const p of subs) {
    for (let i = 2; i < p.length; i += 2) {
      const len = Math.hypot(p[i] - p[i - 2], p[i + 1] - p[i - 1])
      segs.push([p[i - 2], p[i - 1], p[i], p[i + 1], total, len])
      total += len
    }
  }
  const out = new Float32Array(count * 2)
  let s = 0
  for (let n = 0; n < count; n++) {
    const at = (n / count) * total
    while (s < segs.length - 1 && segs[s][4] + segs[s][5] < at) s++
    const [x0, y0, x1, y1, start, len] = segs[s]
    const k = len ? (at - start) / len : 0
    out[n * 2] = x0 + (x1 - x0) * k
    out[n * 2 + 1] = y0 + (y1 - y0) * k
  }
  return out
}

/*
 * `count` points on the letter's edge, for a mark drawn `width` CSS px wide
 * whose centre is at (cx, cy) in world space (y up, origin at the viewport
 * centre). `order` runs 0 -> 1 around the outline, so the letter draws
 * itself as one sweep rather than arriving in a clump.
 */
export function markTargets(count, width, cx, cy) {
  const s = width / MARK.width
  const xy = resampleTo(polylines(MARK.m), count)
  const order = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    xy[i * 2] = (xy[i * 2] - MARK.width / 2) * s + cx
    xy[i * 2 + 1] = -(xy[i * 2 + 1] - MARK.height / 2) * s + cy
    order[i] = i / count
  }
  return { xy, order }
}
