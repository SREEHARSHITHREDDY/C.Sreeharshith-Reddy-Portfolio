"use client";

import { useMemo, type ReactNode } from "react";
import type { HallMaterials } from "./materials";
import type { HallSpec } from "./layout";

/**
 * Empty hall: floor, ceiling, panelled end and south walls, light strips,
 * and the north glazing (mullions only) that opens onto the live city.
 */
export function HallShell({ spec, m, floor, children }: { spec: HallSpec; m: HallMaterials; floor: "wood" | "marble"; children?: ReactNode }) {
  const { L, W, H } = spec;
  const mullions = useMemo(() => {
    const n = Math.round(L / 3);
    return Array.from({ length: n + 1 }, (_, i) => -L / 2 + (i / n) * L);
  }, [L]);

  return (
    <group>
      <mesh material={floor === "marble" ? m.marbleFloor : m.floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}><planeGeometry args={[L, W]} /></mesh>
      <mesh material={m.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}><planeGeometry args={[L, W]} /></mesh>
      <mesh material={m.wallLong} rotation={[0, Math.PI / 2, 0]} position={[-L / 2, H / 2, 0]}><planeGeometry args={[W, H]} /></mesh>
      <mesh material={m.wallLong} rotation={[0, -Math.PI / 2, 0]} position={[L / 2, H / 2, 0]}><planeGeometry args={[W, H]} /></mesh>
      <mesh material={m.wallShort} rotation={[0, Math.PI, 0]} position={[0, H / 2, W / 2]}><planeGeometry args={[L, H]} /></mesh>

      <mesh material={m.darkWood} position={[0, 0.09, W / 2 - 0.02]}><boxGeometry args={[L, 0.18, 0.04]} /></mesh>
      <mesh material={m.gold} position={[0, H - 0.05, W / 2 - 0.02]}><boxGeometry args={[L, 0.05, 0.05]} /></mesh>

      {/* long ceiling light strips */}
      {[-W / 4, W / 4].map((z) => (
        <mesh key={z} material={m.light} position={[0, H - 0.02, z]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[L * 0.86, 0.14]} /></mesh>
      ))}

      {/* north glazing */}
      {mullions.map((x, i) => (
        <mesh key={i} material={m.darkWood} position={[x, H / 2, -W / 2 + 0.05]}><boxGeometry args={[0.1, H, 0.1]} /></mesh>
      ))}
      <mesh material={m.darkWood} position={[0, H - 0.06, -W / 2 + 0.05]}><boxGeometry args={[L, 0.12, 0.1]} /></mesh>
      <mesh material={m.darkWood} position={[0, 0.1, -W / 2 + 0.05]}><boxGeometry args={[L, 0.2, 0.12]} /></mesh>
      {children}
    </group>
  );
}
