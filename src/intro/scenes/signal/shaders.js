/*
 * One vertex pipeline, two materials (nodes and wires). Scatter -> network
 * -> letter is written once, in `place()`, and both programs share it.
 *
 * Light on ink: colour is premultiplied and blended over, so overlapping
 * points brighten towards cream and never past it. Signal red appears in
 * exactly two places — where a scan rule passes a node, and at the head of
 * an activation running along a wire — which keeps it to the ~3% of the
 * frame the brand rations it to.
 */

const PLACE = /* glsl */ `
attribute vec3 aGrid;
attribute vec3 aTarget;
attribute vec4 aSeed;

uniform float uSettle;
uniform float uResolve;
uniform float uTime;
uniform float uDrift;

float staged(float u, float s, float spread) {
  float a = s * spread;
  return smoothstep(a, a + (1.0 - spread), u);
}

vec3 place(out float k, out float r) {
  k = staged(uSettle, aSeed.y, 0.35);
  vec3 p = mix(position, aGrid, k);
  // A slow idle drift, strongest while scattered, gone once resolved.
  float ph = aSeed.x * 6.2831;
  p.xy += vec2(sin(uTime * 0.7 + ph), cos(uTime * 0.55 + ph * 1.3)) * uDrift * (1.0 - 0.7 * k);
  r = staged(uResolve, aSeed.z, 0.55);
  return mix(p, aTarget, r);
}
`

export const NODE_VERTEX = /* glsl */ `
${PLACE}
uniform float uOpacity;
uniform float uActive;
uniform float uScanA;
uniform float uScanB;
uniform float uSize;
uniform float uDpr;

varying float vAlpha;
varying float vHot;

void main() {
  float k, r;
  vec3 p = place(k, r);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  // The activation wave crossing the layers, left to right.
  float wave = exp(-pow((aSeed.w - fract(uTime * 0.42) * 1.3 + 0.15) * 6.0, 2.0)) * uActive;
  // The scan rules light the nodes they pass. mv.y is screen-space px.
  float scan = max(exp(-pow((mv.y - uScanA) / 9.0, 2.0)), exp(-pow((mv.y - uScanB) / 9.0, 2.0)));
  vHot = max(scan, wave * 0.55) * (1.0 - r);

  float twinkle = 0.62 + 0.38 * sin(uTime * 2.1 + aSeed.x * 31.0);
  vAlpha = uOpacity * mix(twinkle * (0.35 + 0.65 * k), 1.0, r);
  gl_PointSize = uSize * uDpr * (1.0 + vHot * 0.9) * mix(1.0, 0.8, r);
}
`

export const NODE_FRAGMENT = /* glsl */ `
uniform vec3 uCream;
uniform vec3 uSignal;
varying float vAlpha;
varying float vHot;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.18, d) * vAlpha;
  if (a < 0.004) discard;
  vec3 c = mix(uCream, uSignal, clamp(vHot, 0.0, 1.0));
  gl_FragColor = vec4(c * a, a);
}
`

export const WIRE_VERTEX = /* glsl */ `
${PLACE}
attribute vec2 aWire;   // x: 0 at the source end, 1 at the target; y: seed
varying float vEnd;
varying float vWire;
varying float vSettled;

void main() {
  float k, r;
  vec3 p = place(k, r);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  vEnd = aWire.x;
  vWire = aWire.y;
  // A wire only shows once both its nodes have arrived: a wire between two
  // nodes still in flight is a long diagonal streak, not a connection.
  vSettled = pow(k, 6.0) * (1.0 - r);
}
`

export const WIRE_FRAGMENT = /* glsl */ `
uniform vec3 uCream;
uniform vec3 uSignal;
uniform float uWires;
uniform float uTime;
varying float vEnd;
varying float vWire;
varying float vSettled;

void main() {
  // One pulse per wire, travelling source to target at its own phase.
  float head = fract(uTime * 0.85 + vWire);
  float pulse = exp(-pow((vEnd - head) * 7.0, 2.0)) * step(0.55, fract(vWire * 7.13));
  float a = uWires * vSettled * (0.07 + 0.75 * pulse);
  if (a < 0.003) discard;
  vec3 c = mix(uCream, uSignal, pulse * 0.85);
  gl_FragColor = vec4(c * a, a);
}
`
