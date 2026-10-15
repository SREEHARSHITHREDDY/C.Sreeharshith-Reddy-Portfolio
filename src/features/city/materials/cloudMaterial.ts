import * as THREE from "three";
import { GLSL_NOISE } from "../shaders/noise";

/**
 * One deck of procedural cloud. The camera flies through a stack of these
 * during the intro. Each deck fades out when the camera is right next to it
 * (so there is never a hard slice) and once the camera has dropped below it.
 */
export function createCloudMaterial(seed: number, depth: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uVis: { value: 1 },
      uSeed: { value: seed },
      uDepth: { value: depth },
      uLit: { value: new THREE.Color("#ffffff") },
      uShade: { value: new THREE.Color("#888899") },
      uSunDir: { value: new THREE.Vector3(0, 0.3, -1) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uVis; uniform float uSeed; uniform float uDepth;
      uniform vec3 uLit; uniform vec3 uShade; uniform vec3 uSunDir;
      varying vec3 vWPos;
      ${GLSL_NOISE}

      float density(vec2 p) {
        vec2 q = p * 0.0011 + vec2(uSeed, uSeed * 0.37) + vec2(uTime * 0.004, uTime * 0.0015);
        float base = fbm(q);
        float detail = fbm(q * 3.1 + 11.7);
        return base * 0.82 + detail * 0.32;
      }

      void main() {
        float d = density(vWPos.xz);
        float cover = smoothstep(0.34, 0.66, d);

        // cheap self-shadowing: compare density a step toward the sun
        vec2 toSun = normalize(uSunDir.xz + vec2(0.0001)) * 70.0;
        float ds = density(vWPos.xz + toSun);
        float shade = clamp((d - ds) * 7.0 + 0.5, 0.0, 1.0);
        // sun-facing edges glow, cores and undersides sit in cool shade; lower decks are darker
        vec3 col = mix(uShade, uLit, shade);
        col = mix(col, uLit, smoothstep(0.62, 0.95, d) * 0.3);
        col *= 1.0 - uDepth * 0.28;
        col *= 0.88 + 0.24 * fbm(vWPos.xz * 0.006 + uSeed);

        float dist = length(vWPos - cameraPosition);
        float alpha = cover * smoothstep(7500.0, 3200.0, dist);
        float dy = abs(cameraPosition.y - vWPos.y);
        alpha *= smoothstep(25.0, 240.0, dy); // never slice hard through the deck
        alpha *= uVis;
        gl_FragColor = vec4(col, alpha * 0.97);
      }`,
  });
}
