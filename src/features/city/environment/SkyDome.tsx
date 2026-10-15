"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createSkyMaterial } from "../shaders/sky";
import { applySkyUniforms, useSkyRig } from "./SkyRig";

/** Procedural sky: gradient, drifting clouds, stars and a sun/moon disc. Follows the camera. */
export function SkyDome() {
  const rig = useSkyRig();
  const material = useMemo(createSkyMaterial, []);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    applySkyUniforms(material, rig, state.clock.elapsedTime);
    mesh.current?.position.copy(state.camera.position);
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[3600, 48, 24]} />
    </mesh>
  );
}
