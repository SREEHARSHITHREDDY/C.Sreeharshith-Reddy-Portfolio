import * as THREE from "three";
import { GLSL_NOISE } from "../shaders/noise";

/**
 * Translucent water. Specular reflection of the live sky comes from the scene
 * environment map; the skyline reflection comes from a mirrored copy of the
 * city rendered underneath (see MirroredCity). Animated ripples break up both.
 */
export function createWaterMaterial() {
  const uniforms = { uTime: { value: 0 }, uGlow: { value: 0 }, uTint: { value: new THREE.Color("#0a1a26") } };
  const material = new THREE.MeshStandardMaterial({
    color: 0x0a1a26,
    roughness: 0.06,
    metalness: 0.0,
    transparent: true,
    opacity: 0.52,
    envMapIntensity: 1.6,
    depthWrite: false,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uGlow = uniforms.uGlow;
    shader.uniforms.uTint = uniforms.uTint;

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
        uniform float uTime; uniform float uGlow; uniform vec3 uTint;
        varying vec3 vWPos;
        ${GLSL_NOISE}`,
      )
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
        diffuseColor.rgb = uTint;`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        /* glsl */ `#include <normal_fragment_maps>
        {
          vec2 q = vWPos.xz;
          float t = uTime;
          // two octaves of drifting ripples; the river flows toward the camera
          float n1 = vnoise(q * 0.09 + vec2(t * 0.05, t * 0.25));
          float n2 = vnoise(q * 0.31 + vec2(-t * 0.18, t * 0.4));
          float e = 0.6;
          float dx = (vnoise((q + vec2(e, 0.0)) * 0.09 + vec2(t * 0.05, t * 0.25)) - n1) * 3.0
                   + (vnoise((q + vec2(e, 0.0)) * 0.31 + vec2(-t * 0.18, t * 0.4)) - n2) * 1.5;
          float dz = (vnoise((q + vec2(0.0, e)) * 0.09 + vec2(t * 0.05, t * 0.25)) - n1) * 3.0
                   + (vnoise((q + vec2(0.0, e)) * 0.31 + vec2(-t * 0.18, t * 0.4)) - n2) * 1.5;
          float near = 1.0 - smoothstep(250.0, 1400.0, length(vViewPosition));
          vec3 wob = (viewMatrix * vec4(-dx, 0.0, -dz, 0.0)).xyz * 0.22 * near;
          normal = normalize(normal + wob);
        }`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `#include <emissivemap_fragment>
        totalEmissiveRadiance += uTint * 0.5 * (0.2 + uGlow);`,
      );
  };

  return { material, uniforms };
}
