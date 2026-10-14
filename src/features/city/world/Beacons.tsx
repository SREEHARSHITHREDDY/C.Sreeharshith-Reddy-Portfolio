"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import type { Beacon } from "../plan";

/** Blinking red aviation lights on the tallest towers. */
export function Beacons({ beacons }: { beacons: Beacon[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    beacons.forEach((b, i) => {
      mesh.setMatrixAt(i, m.compose(p.set(b.x, b.y, b.z), q, s.setScalar(b.size)));
      mesh.setColorAt(i, new THREE.Color(0, 0, 0));
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [beacons]);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh?.instanceColor) return;
    const t = state.clock.elapsedTime;
    const c = new THREE.Color();
    beacons.forEach((_, i) => {
      const on = Math.max(0, Math.sin(t * 2.4 + i * 1.7));
      mesh.setColorAt(i, c.setRGB(1, 0.05, 0.03).multiplyScalar(0.2 + on * 6));
    });
    mesh.instanceColor.needsUpdate = true;
  });

  if (beacons.length === 0) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, beacons.length]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
