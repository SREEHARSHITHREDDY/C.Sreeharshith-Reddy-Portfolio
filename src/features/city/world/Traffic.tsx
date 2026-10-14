"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSkyRig } from "../environment/SkyRig";
import { createTrailMaterial } from "../materials/trailMaterial";
import type { RoadRun } from "../plan";

const LANE_OFFSET = 3.3;
const LANE_W = 3.4;

interface Lane {
  x: number;
  y: number;
  z: number;
  rotY: number;
  len: number;
  dir: number;
  kind: number;
  seed: number;
}

/** Two lanes per road run, each with sliding head-light / tail-light streaks. */
export function Traffic({ runs }: { runs: RoadRun[] }) {
  const rig = useSkyRig();
  const ref = useRef<THREE.InstancedMesh>(null);
  const { material, uniforms } = useMemo(createTrailMaterial, []);

  const lanes = useMemo<Lane[]>(() => {
    const out: Lane[] = [];
    runs.forEach((r, i) => {
      const len = r.b - r.a;
      const mid = (r.a + r.b) / 2;
      const y = r.bridge ? 1.55 : 0.25;
      [1, -1].forEach((s, li) => {
        const seed = i * 2 + li + 0.5;
        if (r.axis === "z") out.push({ x: r.fixed + s * LANE_OFFSET, y, z: mid, rotY: Math.PI / 2, len, dir: s, kind: li, seed });
        else out.push({ x: mid, y, z: r.fixed + s * LANE_OFFSET, rotY: 0, len, dir: s, kind: li, seed });
      });
    });
    return out;
  }, [runs]);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1);
    g.rotateX(-Math.PI / 2);
    g.setAttribute("aLen", new THREE.InstancedBufferAttribute(Float32Array.from(lanes, (l) => l.len), 1));
    g.setAttribute("aDir", new THREE.InstancedBufferAttribute(Float32Array.from(lanes, (l) => l.dir), 1));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(Float32Array.from(lanes, (l) => l.seed), 1));
    g.setAttribute("aKind", new THREE.InstancedBufferAttribute(Float32Array.from(lanes, (l) => l.kind), 1));
    return g;
  }, [lanes]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    lanes.forEach((l, i) => {
      q.setFromAxisAngle(up, l.rotY);
      m.compose(p.set(l.x, l.y, l.z), q, s.set(l.len, 1, LANE_W));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [lanes]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uIntensity.value = 0.12 + 0.88 * rig.windowGlow;
  });

  return <instancedMesh ref={ref} args={[geometry, material, lanes.length]} frustumCulled={false} renderOrder={2} />;
}
