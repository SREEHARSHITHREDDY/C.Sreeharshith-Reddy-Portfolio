import * as THREE from "three";
import { GLSL_HASH } from "../shaders/noise";

/** Animated LED billboard in the brand colours (cyan, violet, gold). No text, so nothing fake is shown. */
export function createScreenMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uGlow: { value: 0 } }]),
    fog: true,
    vertexShader: /* glsl */ `
      attribute float aSeed; attribute float aHue;
      varying vec2 vUv; varying float vSeed; varying float vHue;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv; vSeed = aSeed; vHue = aHue;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uGlow;
      varying vec2 vUv; varying float vSeed; varying float vHue;
      #include <fog_pars_fragment>
      ${GLSL_HASH}
      void main() {
        float t = uTime * 0.5 + vSeed;
        vec3 cyan = vec3(0.02, 0.72, 0.84), violet = vec3(0.49, 0.23, 0.93), gold = vec3(0.96, 0.62, 0.04);
        vec3 a = vHue < 0.4 ? cyan : (vHue < 0.75 ? violet : gold);
        vec3 b = vHue < 0.4 ? violet : (vHue < 0.75 ? cyan : violet);
        float bars = 0.5 + 0.5 * sin(vUv.x * 16.0 + t * 2.2 + sin(vUv.y * 7.0 + t) * 1.6);
        vec3 col = mix(a, b, clamp(vUv.y + 0.3 * sin(t), 0.0, 1.0));
        col += gold * pow(bars, 7.0) * 0.5;
        col *= 0.88 + 0.12 * sin(vUv.y * 260.0);
        float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
        col = mix(vec3(1.0), col, smoothstep(0.0, 0.035, edge));
        col *= 2.1 * (0.4 + 0.6 * uGlow);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`,
  });
  return { material, uniforms: material.uniforms as { uTime: { value: number }; uGlow: { value: number } } };
}
