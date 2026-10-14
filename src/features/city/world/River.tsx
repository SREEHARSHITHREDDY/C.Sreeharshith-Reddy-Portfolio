"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { BOUNDS, RIVER } from "../constants";
import { riverX } from "../plan";

const STEP = 12;

/** Ribbon following the river centre line. Authored in XY so the mesh can lie flat (needed by the reflector). */
function buildRibbon() {
  const zNear = BOUNDS.zMax + 220;
  const zFar = BOUNDS.zMin - 700;
  const rows = Math.ceil((zNear - zFar) / STEP);
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= rows; i++) {
    const z = zNear - i * STEP;
    const cx = riverX(z);
    pos.push(cx - RIVER.halfWidth, -z, 0, cx + RIVER.halfWidth, -z, 0);
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

export function River({ lowPower }: { lowPower: boolean }) {
  const geometry = useMemo(buildRibbon, []);
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]} frustumCulled={false}>
      {lowPower ? (
        <meshStandardMaterial color="#0a1822" roughness={0.08} metalness={0.4} />
      ) : (
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.85}
          mixBlur={1}
          mixStrength={1.7}
          blur={[260, 70]}
          color="#08141d"
          roughness={0.85}
          metalness={0.3}
          depthScale={0.9}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
        />
      )}
    </mesh>
  );
}
