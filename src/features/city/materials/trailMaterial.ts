import * as THREE from "three";
import { GLSL_HASH } from "../shaders/noise";

/** Additive light-trail streaks that slide along each road lane (head-lights and tail-lights). */
export function createTrailMaterial() {
  const uniforms = {
    ...THREE.UniformsLib.fog,
    uTime: { value: 0 },
    uIntensity: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(uniforms),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: true,
    vertexShader: /* glsl */ `
      attribute float aLen; attribute float aDir; attribute float aSeed; attribute float aKind;
      varying vec2 vUv; varying float vLen; varying float vDir; varying float vSeed; varying float vKind;
      varying float vFogDepth;
      void main() {
        vUv = uv; vLen = aLen; vDir = aDir; vSeed = aSeed; vKind = aKind;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        vFogDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uIntensity; uniform float fogDensity;
      varying vec2 vUv; varying float vLen; varying float vDir; varying float vSeed; varying float vKind;
      varying float vFogDepth;
      ${GLSL_HASH}
      void main() {
        float s = vUv.x * vLen;
        float spacing = 70.0 + 50.0 * h21(vec2(vSeed, 1.0));
        float speed = 14.0 + 12.0 * h21(vec2(vSeed, 2.0));
        float cell = (s * vDir - uTime * speed) / spacing;
        float id = floor(cell);
        float f = fract(cell);
        float exists = step(0.38, h21(vec2(id, vSeed * 7.0)));
        float streak = exists * smoothstep(0.0, 0.01, f) * exp(-f * 4.5);
        float across = smoothstep(0.5, 0.05, abs(vUv.y - 0.5));
        float ends = smoothstep(0.0, 0.03, vUv.x) * smoothstep(1.0, 0.97, vUv.x);
        vec3 col = vKind > 0.5 ? vec3(1.0, 0.07, 0.04) : vec3(1.0, 0.8, 0.5);
        float fogF = exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
        float a = streak * across * ends * uIntensity * fogF;
        gl_FragColor = vec4(col * a * 3.2, a);
      }`,
  });
  // keep a handle on the live uniforms
  return { material, uniforms: material.uniforms as { uTime: { value: number }; uIntensity: { value: number } } };
}
