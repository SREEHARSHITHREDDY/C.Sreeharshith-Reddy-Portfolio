"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSkyRig } from "../environment/SkyRig";
import { createScreenMaterial } from "../materials/screenMaterial";
import type { ScreenSpec } from "../plan";

/** Animated LED billboards on the biggest towers. */
export function Screens({ screens }: { screens: ScreenSpec[] }) {
  const rig = useSkyRig();
  const ref = useRef<THREE.InstancedMesh>(null);
  const { material, uniforms } = useMemo(createScreenMaterial, []);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1);
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(Float32Array.from(screens, (s) => s.seed), 1));
    g.setAttribute("aHue", new THREE.InstancedBufferAttribute(Float32Array.from(screens, (s) => s.hue), 1));
    return g;
  }, [screens]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    screens.forEach((sc, i) => {
      q.setFromAxisAngle(up, sc.rotY);
      m.compose(p.set(sc.x, sc.y + sc.h / 2, sc.z), q, s.set(sc.w, sc.h, 1));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [screens]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uGlow.value = rig.windowGlow;
  });

  if (screens.length === 0) return null;
  return <instancedMesh ref={ref} args={[geometry, material, screens.length]} frustumCulled={false} />;
}
