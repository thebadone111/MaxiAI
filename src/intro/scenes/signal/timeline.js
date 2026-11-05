import { MARK } from '../../../elems/mark-paths.js'

/*
 * The Signal scene's story, in seconds from mount. One table, read by both
 * halves: the engine (as uniform curves) and index.jsx (as CSS custom
 * properties, so every keyframe delay in intro.css comes from here too).
 * Moving a beat means changing one number.
 *
 *   0.0  scatter     points drift in, unsorted — tokens
 *   0.4  settle      they organise into a layered network
 *   1.2  edges       the layers connect; activations run left to right
 *   1.7  scan        the mark's two red rules sweep down through it
 *   2.35 resolve     the network collapses onto the outline of the M
 *   3.2  mark        the real mark fills that outline
 *   3.45 handover    the full-width rules contract into the mark's own
 *   3.6  word        the name decodes under it
 */
export const T = {
  fadeIn: 0.1,
  settle: 0.4,
  settleLen: 1.25,
  edges: 1.2,
  edgesLen: 0.6,
  scan: 1.7,
  scanLen: 0.9,
  square: 2.2,
  squareLen: 1.0,
  resolve: 2.35,
  resolveLen: 1.05,
  edgesOut: 2.35,
  edgesOutLen: 0.45,
  mark: 3.2,
  contract: 3.3,
  handover: 3.45,
  pointsOut: 3.35,
  pointsOutLen: 0.55,
  word: 3.6,
  readout: 4.0,
  stop: 4.1,
}

/* Where the two rules sit inside the mark, as fractions of its height, and
   the mark's aspect. Read off the traced artwork once at module load. The
   hooked ends make each rule's bounding box taller than the rule, so the
   rule's line is taken as the median y of its outline. */
function ruleLines() {
  return MARK.rules
    .split('Z')
    .filter((sub) => sub.trim())
    .map((sub) => {
      const ys = sub.match(/-?\d*\.?\d+/g).map(Number).filter((_, i) => i % 2 === 1)
      ys.sort((a, b) => a - b)
      return ys[Math.floor(ys.length / 2)]
    })
    .sort((a, b) => a - b)
}

const lines = ruleLines()
export const RULE_A = (lines[0] ?? 312) / MARK.height
export const RULE_B = (lines[1] ?? 340) / MARK.height
export const ASPECT = MARK.width / MARK.height
