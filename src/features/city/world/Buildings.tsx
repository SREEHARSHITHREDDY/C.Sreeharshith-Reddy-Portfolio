"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSkyRig } from "../environment/SkyRig";
import { createBuildingMaterial } from "../materials/buildingMaterial";
import type { Tier } from "../plan";

/** The whole skyline as one instanced mesh: every tier of every tower is a scaled box. */
export function Buildings({ tiers }: { tiers: Tier[] }) {
  const rig = useSkyRig();
  const ref = useRef<THREE.InstancedMesh>(null);
  const { material, uniforms } = useMemo(createBuildingMaterial, []);

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(Float32Array.from(tiers, (t) => t.seed), 1));
    g.setAttribute("aStyle", new THREE.InstancedBufferAttribute(Float32Array.from(tiers, (t) => t.style), 1));
    const accent = new Float32Array(tiers.length * 3);
    tiers.forEach((t, i) => {
      if (t.accent) accent.set(t.accent, i * 3);
    });
    g.setAttribute("aAccent", new THREE.InstancedBufferAttribute(accent, 3));
    return g;
  }, [tiers]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const c = new THREE.Color();
    tiers.forEach((t, i) => {
      m.compose(p.set(t.x, t.y, t.z), q, s.set(t.w, t.h, t.d));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.setRGB(t.color[0], t.color[1], t.color[2]));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [tiers]);

  useFrame(() => {
    uniforms.uGlow.value = rig.windowGlow;
  });

  return <instancedMesh ref={ref} args={[geometry, material, tiers.length]} frustumCulled={false} />;
}
