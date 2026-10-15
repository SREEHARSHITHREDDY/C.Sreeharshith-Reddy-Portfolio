"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { mulberry32 } from "@/lib/random";
import type { CabinMaterials } from "./materials";
import { ROOM } from "./layout";

/** Large potted plant: dark pot and a fan of glossy leaves. */
export function Plant({ m, position, scale = 1 }: { m: CabinMaterials; position: [number, number, number]; scale?: number }) {
  const leaves = useMemo(() => {
    const r = mulberry32(Math.round(position[0] * 7 + position[2] * 13 + 3));
    return Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + r() * 0.5;
      const tilt = 0.25 + r() * 0.65;
      const len = 0.8 + r() * 0.7;
      return { a, tilt, len, y: 0.7 + r() * 0.5 };
    });
  }, [position]);
  return (
    <group position={position} scale={scale}>
      <mesh material={m.pot} position={[0, 0.35, 0]}><cylinderGeometry args={[0.34, 0.26, 0.7, 24]} /></mesh>
      <mesh material={m.gold} position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.34, 0.012, 8, 32]} /></mesh>
      {leaves.map((l, i) => (
        <group key={i} position={[0, l.y, 0]} rotation={[0, l.a, 0]}>
          <mesh material={m.leaf} position={[0, l.len * 0.5, 0.18 * l.tilt * l.len]} rotation={[l.tilt, 0, 0]} scale={[0.1, l.len, 0.02]}>
            <sphereGeometry args={[1, 10, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Wall sconce: a bronze back-plate with a glowing diffuser. */
export function Sconce({ m, position, rotY }: { m: CabinMaterials; position: [number, number, number]; rotY: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <RoundedBox material={m.gold} args={[0.14, 0.5, 0.06]} radius={0.02} position={[0, 0, 0]} />
      <mesh material={m.light} position={[0, 0, 0.05]}><boxGeometry args={[0.08, 0.38, 0.03]} /></mesh>
    </group>
  );
}

/** Ceiling: recessed downlights in a grid and a gold ring pendant. */
export function CeilingLights({ m, pendant }: { m: CabinMaterials; pendant: [number, number] }) {
  const spots: [number, number][] = [];
  for (const x of [-6, -2, 2, 6]) for (const z of [-5, -1.5, 2, 5.5]) spots.push([x, z]);
  return (
    <group position={[0, ROOM.h - 0.01, 0]}>
      {spots.map(([x, z], i) => (
        <mesh key={i} material={m.light} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.1, 16]} /></mesh>
      ))}
      <group position={[pendant[0], -0.7, pendant[1]]}>
        <mesh material={m.light} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.05, 0.025, 8, 64]} /></mesh>
        <mesh material={m.gold} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.0, 0.012, 8, 64]} /></mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={m.gold} position={[Math.sin((i / 3) * 6.283) * 1.0, 0.35, Math.cos((i / 3) * 6.283) * 1.0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.7, 4]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
