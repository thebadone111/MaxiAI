import {
  BufferAttribute,
  BufferGeometry,
  ColorManagement,
  CustomBlending,
  Group,
  LineSegments,
  LinearSRGBColorSpace,
  OneFactor,
  OneMinusSrcAlphaFactor,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'
import { E_IN, E_OUT, E_SETTLE, span } from './clock'
import { T, RULE_A, RULE_B } from './timeline'
import { TIERS, assignTargets, buildNetwork, buildWires, pickTier } from './geometry'
import { NODE_FRAGMENT, NODE_VERTEX, WIRE_FRAGMENT, WIRE_VERTEX } from './shaders'
import { markTargets } from './mark-targets'

/*
 * The WebGL half of the Signal scene. Reached only through import('./engine'),
 * so three.js lives in its own chunk and is never fetched by a visitor under
 * reduced motion, on save-data, on a small machine, or without WebGL.
 *
 * The structure is Minifinans' Settlement engine: an orthographic camera at
 * one world unit to one CSS pixel (which is what lets the points hand the
 * letter to the DOM <svg> without a seam), colour management off so the
 * tokens match the DOM byte for byte, a shared story clock, a warm-up frame
 * drawn invisibly, runtime demotion, and a context-loss fade.
 *
 * Two draw calls. Nothing allocates after setup.
 */

const PREP_CAP = 400 // ms we will spend compiling before catching up
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const CREAM = [0.980392, 0.968627, 0.941176] // --color-cream #FAF7F0
const SIGNAL = [0.752941, 0.223529, 0.168627] // --color-signal #C0392B

export function start({ holder, mark, origin, frozenAt, software }) {
  const vw = holder.clientWidth || window.innerWidth
  const vh = holder.clientHeight || window.innerHeight
  const tier = TIERS[software ? 'C' : pickTier(vw)]

  /* The one layout read of the build: where the DOM mark sits. Everything
     that must register against it — the letter's outline, the rule lines
     the scan stops on — comes out of this rect. */
  const rect = mark.getBoundingClientRect()
  const markW = rect.width || 200
  const markH = rect.height || 180
  const markCx = rect.left + markW / 2 - vw / 2
  const markCy = vh / 2 - (rect.top + markH / 2)
  const ruleA = vh / 2 - (rect.top + RULE_A * markH)
  const ruleB = vh / 2 - (rect.top + RULE_B * markH)

  const net = buildNetwork(tier, vw, vh)
  assignTargets(net, markTargets(net.n, markW, markCx, markCy))
  const w = buildWires(net)

  const uniforms = {
    uSettle: { value: 0 },
    uResolve: { value: 0 },
    uTime: { value: 0 },
    uDrift: { value: 7 },
    uOpacity: { value: 0 },
    uActive: { value: 0 },
    uWires: { value: 0 },
    uScanA: { value: 1e5 },
    uScanB: { value: 1e5 },
    uSize: { value: tier.size },
    uDpr: { value: 1 },
    uCream: { value: CREAM },
    uSignal: { value: SIGNAL },
  }

  const blend = {
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneMinusSrcAlphaFactor,
  }

  const nodeGeom = new BufferGeometry()
  nodeGeom.setAttribute('position', new BufferAttribute(net.position, 3))
  nodeGeom.setAttribute('aGrid', new BufferAttribute(net.grid, 3))
  nodeGeom.setAttribute('aTarget', new BufferAttribute(net.target, 3))
  nodeGeom.setAttribute('aSeed', new BufferAttribute(net.seed, 4))

  const wireGeom = new BufferGeometry()
  wireGeom.setAttribute('position', new BufferAttribute(w.position, 3))
  wireGeom.setAttribute('aGrid', new BufferAttribute(w.grid, 3))
  wireGeom.setAttribute('aTarget', new BufferAttribute(w.target, 3))
  wireGeom.setAttribute('aSeed', new BufferAttribute(w.seed, 4))
  wireGeom.setAttribute('aWire', new BufferAttribute(w.wire, 2))

  const nodeMat = new ShaderMaterial({ ...blend, uniforms, vertexShader: NODE_VERTEX, fragmentShader: NODE_FRAGMENT })
  const wireMat = new ShaderMaterial({ ...blend, uniforms, vertexShader: WIRE_VERTEX, fragmentShader: WIRE_FRAGMENT })

  const nodes = new Points(nodeGeom, nodeMat)
  const wires = new LineSegments(wireGeom, wireMat)
  wires.renderOrder = 0
  nodes.renderOrder = 1
  nodes.frustumCulled = false
  wires.frustumCulled = false

  // The tilt pivots on the viewport centre, so squaring up reads as the
  // network turning to face you rather than a camera orbiting.
  const group = new Group()
  group.add(wires)
  group.add(nodes)
  const scene = new Scene()
  scene.add(group)

  const camera = new OrthographicCamera(-vw / 2, vw / 2, vh / 2, -vh / 2, -2000, 2000)

  ColorManagement.enabled = false

  const canvas = document.createElement('canvas')
  canvas.className = 'sig-gl'
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: tier.aa && !software,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: frozenAt != null, // a dev freeze draws once
  })
  renderer.outputColorSpace = LinearSRGBColorSpace
  renderer.setClearAlpha(0)

  let dpr = Math.min(window.devicePixelRatio || 1, tier.dpr)
  renderer.setPixelRatio(dpr)
  renderer.setSize(vw, vh, false)
  uniforms.uDpr.value = dpr
  holder.appendChild(canvas)

  // ---------------------------------------------------------------- state

  let dead = false
  let raf = 0
  let held = frozenAt == null ? -1 : frozenAt
  let demotions = 0
  let warm = 0
  let last = 0
  let over = 0
  let sum = 0
  let ri = 0
  const ring = new Float32Array(20)

  const storyAt = (now) => (held >= 0 ? held : (now - origin) / 1000)

  // The scan rules: the same curve as the DOM lines in intro.css (ease-quart
  // over T.scanLen from one viewport above), so node and line stay locked.
  const scanAt = (t, y) => {
    const k = E_OUT(span(t, T.scan, T.scanLen))
    return t < T.scan ? 1e5 : y + vh * (1 - k)
  }

  function write(t) {
    const square = 1 - E_OUT(span(t, T.square, T.squareLen))
    uniforms.uTime.value = t
    uniforms.uSettle.value = E_SETTLE(span(t, T.settle, T.settleLen))
    uniforms.uResolve.value = E_IN(span(t, T.resolve, T.resolveLen))
    uniforms.uOpacity.value = span(t, T.fadeIn, 0.6) * (1 - span(t, T.pointsOut, T.pointsOutLen))
    uniforms.uWires.value = E_IN(span(t, T.edges, T.edgesLen)) * (1 - span(t, T.edgesOut, T.edgesOutLen))
    uniforms.uActive.value = span(t, T.edges + 0.2, 0.5) * (1 - span(t, T.edgesOut, 0.4))
    uniforms.uScanA.value = scanAt(t, ruleA)
    uniforms.uScanB.value = scanAt(t, ruleB)
    group.rotation.x = tier.rx * square
    group.rotation.y = tier.ry * square
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function fade(ms) {
    holder.style.transition = `opacity ${ms}ms linear`
    holder.style.opacity = '0'
  }

  /* Runtime demotion: a 20-frame rolling mean; twenty consecutive frames over
     20 ms and we step down. Pixel ratio first, then drift off, then hand the
     scene to the DOM. */
  function judge(dt, t) {
    if (warm < 30) {
      warm++
      return
    }
    sum += dt - ring[ri]
    ring[ri] = dt
    ri = ri === 19 ? 0 : ri + 1
    const mean = sum / 20
    over = mean > 20 ? over + 1 : 0
    if (over < 20) return
    over = 0
    if (demotions === 0) {
      demotions = 1
      dpr = Math.max(1, dpr * 0.75)
    } else if (demotions === 1) {
      demotions = 2
      dpr = 1
      uniforms.uDrift.value = 0
    } else if (mean > 28) {
      held = t
      fade(250)
      setTimeout(stop, 270)
      return
    } else {
      return
    }
    renderer.setPixelRatio(dpr)
    uniforms.uDpr.value = dpr
  }

  function frame(now) {
    raf = requestAnimationFrame(frame)
    const t = storyAt(now)
    write(t)
    renderer.render(scene, camera)
    if (held < 0 && t >= T.stop) {
      stop()
      return
    }
    if (last) judge(now - last, t)
    last = now
  }

  // --------------------------------------------------------------- resize

  let lastW = vw
  let lastH = vh
  const ro = new ResizeObserver((entries) => {
    if (dead) return
    const r = entries[0].contentRect
    const nw = Math.round(r.width)
    const nh = Math.round(r.height)
    if (!nw || !nh) return
    // An iOS URL bar collapsing is not a resize worth reflowing a story for.
    if (nw === lastW && Math.abs(nh - lastH) < 120) return
    lastW = nw
    lastH = nh
    camera.left = -nw / 2
    camera.right = nw / 2
    camera.top = nh / 2
    camera.bottom = -nh / 2
    camera.updateProjectionMatrix()
    renderer.setSize(nw, nh, false)
    if (held >= 0) {
      write(held)
      renderer.render(scene, camera)
    }
  })
  ro.observe(holder)

  const onLost = (e) => {
    e.preventDefault() // never restore: there is no second act inside 5s
    stop()
    fade(200)
  }
  canvas.addEventListener('webglcontextlost', onLost)

  /* Compile, then draw. The warm-up frame is drawn at opacity 0, so the first
     thing presented is a transparent canvas rather than a pop. The clock is
     not re-originated: it belongs to the component's mount, shared with the
     DOM half, and the engine catches up. */
  const prep = renderer.compileAsync
    ? Promise.race([renderer.compileAsync(scene, camera), wait(PREP_CAP)])
    : Promise.resolve()

  prep.catch(() => {}).then(() => {
    if (dead) return
    write(held >= 0 ? held : 0)
    uniforms.uOpacity.value = 0
    renderer.render(scene, camera)
    requestAnimationFrame(() => {
      if (dead) return
      if (held >= 0) {
        write(held)
        renderer.render(scene, camera)
        return
      }
      raf = requestAnimationFrame(frame)
    })
  })

  return {
    // Freeze the story clock so the same frame holds while CSS fades the
    // canvas, then stop just after it is invisible.
    leave() {
      if (dead) return
      if (held < 0) held = storyAt(performance.now())
      setTimeout(stop, 320)
    },
    dispose() {
      if (dead) return
      dead = true
      stop()
      ro.disconnect()
      canvas.removeEventListener('webglcontextlost', onLost)
      nodeGeom.dispose()
      wireGeom.dispose()
      nodeMat.dispose()
      wireMat.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.width = 1
      canvas.height = 1
      canvas.remove()
    },
  }
}
