import * as THREE from "three";
import { GLSL_HASH } from "../shaders/noise";

export interface BuildingUniforms {
  uGlow: { value: number };
}

/**
 * Physically based facade material. Windows, mullions, lit rooms, floor bands
 * and ground-contact darkening are all generated procedurally from world
 * position, so one instanced mesh renders the whole skyline with no textures.
 */
export function createBuildingMaterial() {
  const uniforms: BuildingUniforms = { uGlow: { value: 0 } };
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, metalness: 0 });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uGlow = uniforms.uGlow;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
        attribute float aSeed; attribute float aStyle;
        varying vec3 vWPos; varying vec3 vWNor; varying float vSeed; varying float vStyle;`,
      )
      .replace(
        "#include <begin_vertex>",
        /* glsl */ `#include <begin_vertex>
        vec4 iw = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
        vWPos = iw.xyz;
        vWNor = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * objectNormal);
        vSeed = aSeed; vStyle = aStyle;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
        uniform float uGlow;
        varying vec3 vWPos; varying vec3 vWNor; varying float vSeed; varying float vStyle;
        ${GLSL_HASH}`,
      )
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
        float nx = abs(vWNor.x), nz = abs(vWNor.z), ny = abs(vWNor.y);
        bool roof = ny > 0.6;
        bool xFace = nx > nz;
        vec2 fuv = vec2(xFace ? vWPos.z : vWPos.x, vWPos.y);
        float facadeId = xFace ? (vWNor.x > 0.0 ? 1.0 : 2.0) : (vWNor.z > 0.0 ? 3.0 : 4.0);

        vec2 cellSize; vec2 margin; float lf; float glassiness;
        if (vStyle < 0.5)      { cellSize = vec2(2.7, 3.9); margin = vec2(0.05, 0.12); lf = 0.62; glassiness = 1.0; }
        else if (vStyle < 1.5) { cellSize = vec2(3.8, 3.7); margin = vec2(0.22, 0.26); lf = 0.50; glassiness = 0.75; }
        else if (vStyle < 2.5) { cellSize = vec2(3.4, 3.3); margin = vec2(0.27, 0.30); lf = 0.42; glassiness = 0.55; }
        else if (vStyle < 3.5) { cellSize = vec2(1.9, 4.2); margin = vec2(0.06, 0.10); lf = 0.50; glassiness = 0.9; }
        else                   { cellSize = vec2(2.4, 3.9); margin = vec2(0.04, 0.10); lf = 0.85; glassiness = 1.0; }

        vec2 g = fuv / cellSize;
        vec2 cid = floor(g);
        vec2 cf = fract(g);
        vec2 aa = fwidth(g) * 1.3 + 0.0001;
        float wx = smoothstep(margin.x, margin.x + aa.x, cf.x) * (1.0 - smoothstep(1.0 - margin.x - aa.x, 1.0 - margin.x, cf.x));
        float wy = smoothstep(margin.y, margin.y + aa.y, cf.y) * (1.0 - smoothstep(1.0 - margin.y - aa.y, 1.0 - margin.y, cf.y));
        float openFrac = (1.0 - 2.0 * margin.x) * (1.0 - 2.0 * margin.y);
        float winMask = mix(wx * wy, openFrac, smoothstep(0.35, 0.9, max(aa.x, aa.y)));
        winMask *= roof ? 0.0 : 1.0;

        float rnd = h21(cid + vec2(vSeed * 13.7, facadeId * 7.1));
        float floorOn = step(0.2, h21(vec2(cid.y, vSeed * 91.3)));
        float lit = step(1.0 - lf * 0.7 * uGlow * floorOn, rnd) * winMask;
        float hue = h21(cid + vec2(vSeed * 3.1 + 5.0, facadeId));
        vec3 litCol = hue < 0.7 ? vec3(1.0, 0.64, 0.30) : (hue < 0.9 ? vec3(0.78, 0.9, 1.0) : vec3(0.55, 0.45, 1.0));

        vec3 glassCol = vStyle < 3.5 && vStyle > 0.5 ? vec3(0.34, 0.42, 0.52) : vec3(0.58, 0.68, 0.8);
        glassCol *= 0.8 + 0.4 * h21(cid + vec2(2.0, vSeed));
        diffuseColor.rgb = mix(diffuseColor.rgb, glassCol, winMask * glassiness);

        float ao = mix(0.45, 1.0, smoothstep(0.0, 24.0, vWPos.y));
        diffuseColor.rgb *= ao;
        if (roof) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.055, 0.055, 0.06), 0.75);

        float bandMask = 0.0;
        if (vStyle > 3.5 && !roof) {
          bandMask = step(0.962, fract(vWPos.y / 36.0));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.95, 0.62, 0.1), bandMask);
        }`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        /* glsl */ `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.05 + 0.1 * h21(cid + 9.0), winMask * glassiness);
        roughnessFactor = mix(roughnessFactor, 0.28, bandMask);`,
      )
      .replace(
        "#include <metalnessmap_fragment>",
        /* glsl */ `#include <metalnessmap_fragment>
        metalnessFactor = mix(metalnessFactor, 1.0, max(winMask * glassiness, bandMask));`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `#include <emissivemap_fragment>
        totalEmissiveRadiance += litCol * lit * 1.5;
        totalEmissiveRadiance += vec3(1.0, 0.7, 0.25) * bandMask * (0.6 + 1.8 * uGlow);`,
      );
  };

  return { material, uniforms };
}
