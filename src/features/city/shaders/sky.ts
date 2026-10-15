import * as THREE from "three";
import { GLSL_NOISE } from "./noise";

const vert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uBottom;
  uniform vec3 uSunColor; uniform vec3 uSunDir; uniform vec3 uCloud; uniform vec3 uHorizon;
  uniform float uSunI; uniform float uStars; uniform float uTime;
  varying vec3 vDir;
  ${GLSL_NOISE}

  void main() {
    vec3 d = normalize(vDir);
    float h = max(d.y, 0.0);
    vec3 col = mix(uBottom, uMid, smoothstep(0.0, 0.22, h));
    col = mix(col, uTop, smoothstep(0.18, 0.85, h));

    float sd = max(dot(d, normalize(uSunDir)), 0.0);
    // warm bloom of light hugging the horizon around the sun
    col += uSunColor * pow(sd, 5.0) * 0.4 * uSunI * smoothstep(0.55, 0.0, h);
    col += uSunColor * pow(sd, 18.0) * 0.35 * uSunI;

    // the lowest sliver of sky is exactly the distance-fog colour, so ground and sky meet without a seam
    col = mix(uHorizon, col, smoothstep(0.0, 0.05, d.y));

    // stars
    // stars: one jittered point per cell, tiny and round
    vec3 sv = d * 300.0;
    vec3 sid = floor(sv);
    float sh = h31(sid);
    vec3 jit = vec3(h31(sid + 3.1), h31(sid + 7.7), h31(sid + 11.3)) - 0.5;
    float sdist = length(sv - (sid + 0.5 + jit * 0.5));
    float tw = 0.6 + 0.4 * sin(uTime * 2.0 + sh * 60.0);
    float starMask = step(0.992, sh) * smoothstep(0.2, 0.0, sdist) * mix(0.55, 1.0, step(0.9985, sh));
    col += vec3(1.0, 0.96, 0.9) * starMask * 1.6 * tw * uStars * smoothstep(0.03, 0.3, d.y);

    // clouds: projected onto a plane, lit from the sun side
    if (d.y > 0.0) {
      vec2 uv = d.xz / (d.y + 0.2) * 1.3 + vec2(uTime * 0.005, uTime * 0.0015);
      float c = fbm(uv);
      float cover = smoothstep(0.5, 0.82, c) * smoothstep(0.0, 0.16, d.y);
      float lit = clamp(pow(sd, 2.5) * 1.4 + 0.25, 0.0, 1.0);
      vec3 cc = mix(uCloud * 0.42, uCloud * 1.05 + uSunColor * 0.75, lit);
      vec2 toSun = normalize(uSunDir.xz + 0.0001) * 0.07;
      float c2 = fbm(uv + toSun);
      cc *= mix(0.62, 1.18, clamp((c - c2) * 7.0 + 0.5, 0.0, 1.0));
      col = mix(col, cc, cover * 0.92);
    }

    // sun / moon disc
    col += uSunColor * (smoothstep(0.99935, 0.99985, sd) * 9.0 * uSunI + pow(sd, 90.0) * 0.9 * uSunI);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createSkyMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color() },
      uMid: { value: new THREE.Color() },
      uBottom: { value: new THREE.Color() },
      uSunColor: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uCloud: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uSunI: { value: 1 },
      uStars: { value: 0 },
      uTime: { value: 0 },
    },
  });
}
