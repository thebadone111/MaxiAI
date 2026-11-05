/*
 * The network: where every node starts, where it organises to, and which
 * nodes are wired to which.
 *
 * As in Minifinans' Settlement, the topology never changes. Chaos, order and
 * the letter are three positions for the same vertex and the vertex shader
 * mixes between them, so "a network forming" costs attributes rather than
 * rebuilt geometry. Nothing is allocated after setup.
 *
 * All randomness is a seeded mulberry32: every visit sees the same frame,
 * and a `?at=` screenshot is reproducible.
 */

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/*
 * Layers (x) by nodes per layer (y) by depth rows (z). The phone gets a
 * smaller network, not a sparser one.
 */
export const TIERS = {
  A: { layers: 9, rows: 14, depth: 4, fan: 2, dpr: 2, rx: -0.2, ry: 0.34, aa: true, size: 4 },
  B: { layers: 8, rows: 12, depth: 3, fan: 2, dpr: 1.75, rx: -0.2, ry: 0.34, aa: true, size: 4 },
  C: { layers: 7, rows: 9, depth: 3, fan: 2, dpr: 1.5, rx: -0.16, ry: 0.26, aa: false, size: 3.4 },
}

export function pickTier(vw) {
  const n = navigator
  if (vw < 640) return 'C'
  const cores = n.hardwareConcurrency || 4
  const mobile = /Android|iPhone|iPad|iPod/.test(n.userAgent)
  if (window.devicePixelRatio >= 2 && !mobile && cores >= 8) return 'A'
  return 'B'
}

/*
 * position  scattered start            (vec3)
 * grid      place in the network       (vec3)
 * seed      x twinkle phase, y settle stagger, z resolve order (set later),
 *           w layer fraction 0..1 — the activation wave's coordinate (vec4)
 *
 * Edges are returned as a separate, non-indexed vertex list (two vertices
 * per wire, each a copy of its node's attributes plus `end` 0|1 and a per-
 * wire seed), because a wire's pulse needs to know how far along the wire a
 * fragment is — which a node shared by several wires cannot say.
 */
export function buildNetwork(tier, vw, vh) {
  const rand = mulberry32(0x6d617869) // "maxi"
  const { layers, rows, depth, fan } = tier
  const n = layers * rows * depth

  const W = Math.min(1100, vw * 0.8)
  const H = Math.min(440, vh * 0.46)
  const D = Math.min(220, W * 0.2)

  const position = new Float32Array(n * 3)
  const grid = new Float32Array(n * 3)
  const target = new Float32Array(n * 3)
  const seed = new Float32Array(n * 4)

  const idx = (i, j, k) => (i * rows + j) * depth + k

  for (let i = 0; i < layers; i++) {
    // Layers bulge in the middle, like a diagram of a model's hidden layers.
    const bulge = 0.62 + 0.38 * Math.sin((i / (layers - 1)) * Math.PI)
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < depth; k++) {
        const v = idx(i, j, k)
        grid[v * 3] = (i / (layers - 1) - 0.5) * W
        grid[v * 3 + 1] = (j / (rows - 1) - 0.5) * H * bulge + (rand() - 0.5) * 6
        grid[v * 3 + 2] = (k / Math.max(1, depth - 1) - 0.5) * D

        position[v * 3] = (rand() - 0.5) * vw * 1.25
        position[v * 3 + 1] = (rand() - 0.5) * vh * 1.25
        position[v * 3 + 2] = (rand() - 0.5) * 600

        seed[v * 4] = rand()
        seed[v * 4 + 1] = rand()
        seed[v * 4 + 2] = 0
        seed[v * 4 + 3] = i / (layers - 1)
      }
    }
  }

  // Wires: each node to `fan` nodes of the next layer, same depth row,
  // neighbouring heights.
  const wires = []
  for (let i = 0; i < layers - 1; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < depth; k++) {
        const picks = new Set()
        while (picks.size < fan) {
          const jj = Math.min(rows - 1, Math.max(0, j + Math.round((rand() - 0.5) * 3)))
          picks.add(jj)
          if (picks.size < fan && rand() < 0.2) break
        }
        for (const jj of picks) wires.push([idx(i, j, k), idx(i + 1, jj, k), rand()])
      }
    }
  }

  return { n, position, grid, target, seed, wires, W, H }
}

/*
 * Give every node its point on the letter. Nodes and targets are both
 * ranked top to bottom and paired by rank, so the network's upper rows
 * become the top of the M and nothing has to cross the whole screen.
 * Resolve order follows the target's place around the outline.
 */
export function assignTargets(net, marks) {
  const { n, grid, target, seed } = net
  const nodes = Array.from({ length: n }, (_, i) => i).sort(
    (a, b) => grid[b * 3 + 1] - grid[a * 3 + 1] || grid[a * 3] - grid[b * 3])
  const tgts = Array.from({ length: n }, (_, i) => i).sort(
    (a, b) => marks.xy[b * 2 + 1] - marks.xy[a * 2 + 1] || marks.xy[a * 2] - marks.xy[b * 2])
  for (let r = 0; r < n; r++) {
    const v = nodes[r]
    const t = tgts[r]
    target[v * 3] = marks.xy[t * 2]
    target[v * 3 + 1] = marks.xy[t * 2 + 1]
    target[v * 3 + 2] = 0
    seed[v * 4 + 2] = marks.order[t]
  }
}

// Expand the wires into a vertex list sharing the nodes' attribute values.
export function buildWires(net) {
  const m = net.wires.length * 2
  const out = {
    position: new Float32Array(m * 3),
    grid: new Float32Array(m * 3),
    target: new Float32Array(m * 3),
    seed: new Float32Array(m * 4),
    wire: new Float32Array(m * 2), // x: end 0|1, y: per-wire seed
  }
  net.wires.forEach(([a, b, s], w) => {
    ;[a, b].forEach((v, e) => {
      const o = w * 2 + e
      for (let c = 0; c < 3; c++) {
        out.position[o * 3 + c] = net.position[v * 3 + c]
        out.grid[o * 3 + c] = net.grid[v * 3 + c]
        out.target[o * 3 + c] = net.target[v * 3 + c]
      }
      for (let c = 0; c < 4; c++) out.seed[o * 4 + c] = net.seed[v * 4 + c]
      out.wire[o * 2] = e
      out.wire[o * 2 + 1] = s
    })
  })
  return out
}
