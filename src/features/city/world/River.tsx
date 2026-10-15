"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { BOUNDS, RIVER } from "../constants";
import { useSkyRig } from "../environment/SkyRig";
import { createWaterMaterial } from "../materials/waterMaterial";
import { riverX } from "../plan";

const STEP = 12;
const OVERLAP = 0.8; // ribbon is slightly wider than the opening in the ground, so no slivers show

/** Ribbon following the river centre line. Authored in XY so the mesh can lie flat. */
function buildRibbon() {
  const zNear = BOUNDS.zMax + 400;
  const zFar = BOUNDS.zMin - 2400;
  const rows = Math.ceil((zNear - zFar) / STEP);
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= rows; i++) {
    const z = zNear - i * STEP;
    const cx = riverX(z);
    pos.push(cx - RIVER.halfWidth - OVERLAP, -z, 0, cx + RIVER.halfWidth + OVERLAP, -z, 0);
    uv.push(0, i / rows, 1, i / rows);
    if (i < rows) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function River() {
  const rig = useSkyRig();
  const geometry = useMemo(buildRibbon, []);
  const { material, uniforms } = useMemo(createWaterMaterial, []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uGlow.value = rig.windowGlow;
    // water takes a little of the sky's colour so it never looks like a flat black ribbon
    uniforms.uTint.value.set("#0a1a26").lerp(rig.skyMid, 0.22);
  });

  return (
    <>
      {/* the water surface */}
      <mesh geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]} frustumCulled={false} renderOrder={1} />
      {/* far below the mirrored skyline: whatever the reflection does not cover shows a deep dark bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -900, 0]} frustumCulled={false}>
        <planeGeometry args={[16000, 16000]} />
        <meshBasicMaterial color="#02050a" fog={false} />
      </mesh>
    </>
  );
}
