"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { Plant } from "../cabin/Decor";
import { Armchair, DiningChair } from "../cabin/Seating";
import { HallShell } from "./HallShell";
import { InteriorLights } from "./InteriorLights";
import type { HallSpec } from "./layout";
import { createHallMaterials } from "./materials";

/** A quiet lounge for the About floor: round table, armchairs, bookshelf wall. */
export function LoungeRoom({ spec }: { spec: HallSpec }) {
  const m = useMemo(() => createHallMaterials(spec.L, spec.W, spec.H), [spec]);
  const { L, W, H } = spec;
  return (
    <group>
      <HallShell spec={spec} m={m} floor="wood" />
      <mesh material={m.rug} rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.012, 0]}><circleGeometry args={[3.4, 48]} /></mesh>
      <mesh material={m.gold} rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.015, 0]}><ringGeometry args={[3.2, 3.26, 48]} /></mesh>
      <mesh material={m.darkWood} position={[-4, 0.74, 0]}><cylinderGeometry args={[1.25, 1.25, 0.07, 48]} /></mesh>
      <mesh material={m.darkWood} position={[-4, 0.37, 0]}><cylinderGeometry args={[0.2, 0.3, 0.7, 20]} /></mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        const x = -4 + Math.sin(a) * 1.9;
        const z = Math.cos(a) * 1.9;
        return <DiningChair key={i} m={m} position={[x, 0, z]} rotY={Math.atan2(-4 - x, -z)} />;
      })}
      <group position={[8, 0, -0.5]}>
        <Armchair m={m} position={[-1.2, 0, 0]} rotY={Math.PI / 2} />
        <Armchair m={m} position={[1.2, 0, 0]} rotY={-Math.PI / 2} />
        <mesh material={m.darkWood} position={[0, 0.38, 0]}><cylinderGeometry args={[0.5, 0.5, 0.05, 32]} /></mesh>
        <mesh material={m.gold} position={[0, 0.19, 0]}><cylinderGeometry args={[0.04, 0.04, 0.38, 10]} /></mesh>
      </group>
      {/* bookshelf on the south wall */}
      <group position={[0, 0, W / 2 - 0.3]}>
        <RoundedBox material={m.midWood} args={[10, 3.2, 0.5]} radius={0.02} position={[0, 1.6, 0]} />
        {[0.6, 1.3, 2.0, 2.7].map((y) => (
          <mesh key={y} material={m.darkWood} position={[0, y, 0.12]}><boxGeometry args={[9.6, 0.04, 0.4]} /></mesh>
        ))}
        {Array.from({ length: 28 }, (_, i) => (
          <mesh key={i} material={i % 3 === 0 ? m.leather : i % 3 === 1 ? m.fabric : m.gold} position={[-4.6 + (i % 14) * 0.7, i < 14 ? 0.95 : 1.65, 0.14]}>
            <boxGeometry args={[0.12 + (i % 4) * 0.02, 0.55, 0.28]} />
          </mesh>
        ))}
      </group>
      <Plant m={m} position={[-L / 2 + 1, 0, -W / 2 + 1.3]} />
      <Plant m={m} position={[L / 2 - 1, 0, -W / 2 + 1.3]} />
      <InteriorLights points={[[-4, H - 0.6, 0], [8, H - 0.6, -0.5], [0, H - 0.6, 3], [-12, H - 0.6, 0]]} />
    </group>
  );
}
