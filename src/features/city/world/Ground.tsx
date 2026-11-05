"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { useSkyRig } from "../environment/SkyRig";
import { createGroundMaterial } from "../materials/groundMaterial";

/** Street grid, pavements and lamp pools, drawn procedurally on one large plane. */
export function Ground() {
  const rig = useSkyRig();
  const { material, uniforms } = useMemo(createGroundMaterial, []);

  useFrame(() => {
    uniforms.uGlow.value = rig.windowGlow;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={material} frustumCulled={false}>
      <planeGeometry args={[16000, 16000]} />
    </mesh>
  );
}
