"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useSkyRig } from "../environment/SkyRig";
import type { LampSpec } from "../plan";

/** Street lamps as glowing points. They only light up as the sky darkens; bloom does the rest. */
export function Lamps({ lamps }: { lamps: LampSpec[] }) {
  const rig = useSkyRig();
  const ref = useRef<THREE.InstancedMesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    lamps.forEach((l, i) => mesh.setMatrixAt(i, m.makeTranslation(l.x, l.y, l.z)));
    mesh.instanceMatrix.needsUpdate = true;
  }, [lamps]);

  useFrame(() => {
    mat.current?.color.setRGB(1, 0.62, 0.28).multiplyScalar(0.01 + rig.windowGlow * rig.windowGlow * 3.2);
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, lamps.length]} frustumCulled={false}>
      <sphereGeometry args={[0.75, 6, 4]} />
      <meshBasicMaterial ref={mat} toneMapped={false} />
    </instancedMesh>
  );
}
