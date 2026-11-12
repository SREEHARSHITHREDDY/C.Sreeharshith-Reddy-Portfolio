import * as THREE from "three";
import { BOUNDS, PITCH, RIVER, RIVER_FADE, ROAD_W } from "../constants";

export interface GroundUniforms {
  uGlow: { value: number };
}

/** Street grid, pavements, lane markings, lamp pools and a river promenade, all in one shader. */
export function createGroundMaterial() {
  const uniforms: GroundUniforms = { uGlow: { value: 0 } };
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uGlow = uniforms.uGlow;
    shader.uniforms.uBounds = { value: new THREE.Vector4(BOUNDS.xMin, BOUNDS.xMax, BOUNDS.zMin, BOUNDS.zMax) };
    shader.uniforms.uRiver = { value: new THREE.Vector4(RIVER.offset, RIVER.amp, RIVER.wavelength, RIVER.phase) };

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
        uniform float uGlow; uniform vec4 uBounds; uniform vec4 uRiver;
        varying vec3 vWPos;
        const float PITCH = ${PITCH.toFixed(1)};
        const float ROADW = ${ROAD_W.toFixed(1)};
        const float HALFW = ${RIVER.halfWidth.toFixed(1)};
        float riverCentre(float z) {
          float t = clamp((${RIVER_FADE.zStart.toFixed(1)} - z) / ${(RIVER_FADE.zStart - RIVER_FADE.zEnd).toFixed(1)}, 0.0, 1.0);
          float m = 1.0 - t * t * (3.0 - 2.0 * t);
          return uRiver.x + uRiver.y * m * sin(z / uRiver.z * 6.2831853 + uRiver.w);
        }`,
      )
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
        vec2 p = vWPos.xz;
        float inGrid = step(uBounds.x, p.x) * step(p.x, uBounds.y) * step(uBounds.z, p.y) * step(p.y, uBounds.w);
        vec2 m = abs(mod(p, PITCH) - PITCH * 0.5);
        float rx = 1.0 - smoothstep(ROADW * 0.5 - 0.35, ROADW * 0.5, m.x);
        float rz = 1.0 - smoothstep(ROADW * 0.5 - 0.35, ROADW * 0.5, m.y);
        float road = max(rx, rz) * inGrid;
        float wk = max(1.0 - smoothstep(ROADW * 0.5 + 2.6, ROADW * 0.5 + 3.0, m.x),
                       1.0 - smoothstep(ROADW * 0.5 + 2.6, ROADW * 0.5 + 3.0, m.y)) * inGrid;

        vec3 lot = vec3(0.055, 0.056, 0.06);
        vec3 pave = vec3(0.13, 0.125, 0.12);
        vec3 asphalt = vec3(0.028, 0.029, 0.033);
        vec3 base = mix(lot, pave, wk);
        base = mix(base, asphalt, road);

        // lane markings (not inside intersections)
        float mark = 0.0;
        float avenueMark = (1.0 - smoothstep(0.1, 0.2, m.x)) * step(0.45, fract(p.y / 10.0)) * rx * (1.0 - rz);
        float streetMark = (1.0 - smoothstep(0.1, 0.2, m.y)) * step(0.45, fract(p.x / 10.0)) * rz * (1.0 - rx);
        mark = max(avenueMark, streetMark) * inGrid;
        float edgeX = (1.0 - smoothstep(0.08, 0.16, abs(m.x - (ROADW * 0.5 - 0.7)))) * rx * (1.0 - rz);
        float edgeZ = (1.0 - smoothstep(0.08, 0.16, abs(m.y - (ROADW * 0.5 - 0.7)))) * rz * (1.0 - rx);
        mark = max(mark, max(edgeX, edgeZ) * 0.6 * inGrid);
        base = mix(base, vec3(0.5, 0.48, 0.4), mark * 0.85);

        // river promenade: lighter stone strip just outside the water
        float dxr = abs(p.x - riverCentre(p.y)) - HALFW;
        float prom = (1.0 - smoothstep(0.0, 5.0, dxr)) * step(0.0, dxr);
        base = mix(base, pave * 0.9, prom * 0.9);
        if (dxr < 0.0) discard; // open water: the river mesh and mirrored skyline show through
        diffuseColor.rgb *= base * 1.0;`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        /* glsl */ `#include <roughnessmap_fragment>
        roughnessFactor = mix(0.92, 0.34, road);
        roughnessFactor = mix(roughnessFactor, 0.5, mark);`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `#include <emissivemap_fragment>
        float poolA = 0.5 + 0.5 * cos(6.2831853 * p.y / 36.0);
        float poolS = 0.5 + 0.5 * cos(6.2831853 * p.x / 36.0);
        float pool = max(rx * (1.0 - rz) * poolA, rz * (1.0 - rx) * poolS) + 0.25 * road;
        totalEmissiveRadiance += vec3(1.0, 0.6, 0.26) * (0.045 * pool * road + 0.03 * wk) * uGlow;`,
      );
  };

  return { material, uniforms };
}
