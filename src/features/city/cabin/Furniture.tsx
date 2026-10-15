"use client";

import { RoundedBox } from "@react-three/drei";
import type { CabinMaterials } from "./materials";
import { DESK, LOUNGE, TABLE } from "./layout";
import { Armchair, DiningChair, ExecutiveChair } from "./Seating";
import { Avatar } from "./Avatar";

/** Desk, round meeting table, lounge, rug and credenza: the large pieces. */
export function Furniture({ m, width }: { m: CabinMaterials; width: number }) {
  const chairs = [0, 1, 2, 3, 4].map((i) => {
    const a = (i / 5) * Math.PI * 2 + 0.4;
    const r = TABLE.r + 0.62;
    const x = TABLE.x + Math.sin(a) * r;
    const z = TABLE.z + Math.cos(a) * r;
    return { x, z, rotY: Math.atan2(TABLE.x - x, TABLE.z - z) };
  });

  return (
    <group>
      {/* rug under the round table */}
      <mesh material={m.rug} rotation={[-Math.PI / 2, 0, 0]} position={[TABLE.x, 0.012, TABLE.z]}>
        <circleGeometry args={[3.1, 64]} />
      </mesh>
      <mesh material={m.gold} rotation={[-Math.PI / 2, 0, 0]} position={[TABLE.x, 0.015, TABLE.z]}>
        <ringGeometry args={[2.9, 2.96, 64]} />
      </mesh>

      {/* round meeting table */}
      <group position={[TABLE.x, 0, TABLE.z]}>
        <mesh material={m.darkWood} position={[0, 0.74, 0]}><cylinderGeometry args={[TABLE.r, TABLE.r, 0.07, 64]} /></mesh>
        <mesh material={m.gold} position={[0, 0.705, 0]}><cylinderGeometry args={[TABLE.r * 0.98, TABLE.r * 0.98, 0.01, 64]} /></mesh>
        <mesh material={m.darkWood} position={[0, 0.37, 0]}><cylinderGeometry args={[0.2, 0.3, 0.7, 24]} /></mesh>
        <mesh material={m.darkWood} position={[0, 0.03, 0]}><cylinderGeometry args={[0.75, 0.8, 0.06, 40]} /></mesh>
        {/* a water carafe and glasses */}
        <mesh material={m.chrome} position={[0.2, 0.84, 0.1]}><cylinderGeometry args={[0.07, 0.09, 0.2, 16]} /></mesh>
        {[[-0.4, 0.3], [0.5, -0.45], [-0.2, -0.6]].map(([x, z], i) => (
          <mesh key={i} material={m.shirt} position={[x, 0.78, z]}><cylinderGeometry args={[0.04, 0.035, 0.08, 12]} /></mesh>
        ))}
      </group>
      {chairs.map((c, i) => (
        <DiningChair key={i} m={m} position={[c.x, 0, c.z]} rotY={c.rotY} />
      ))}

      {/* executive desk */}
      <group position={[DESK.x, 0, DESK.z]}>
        <RoundedBox material={m.darkWood} args={[4.4, 0.08, 1.8]} radius={0.03} position={[0, 0.76, 0]} />
        <RoundedBox material={m.darkWood} args={[0.35, 0.72, 1.6]} radius={0.02} position={[-1.95, 0.36, 0]} />
        <RoundedBox material={m.darkWood} args={[0.35, 0.72, 1.6]} radius={0.02} position={[1.95, 0.36, 0]} />
        <RoundedBox material={m.midWood} args={[3.7, 0.55, 0.06]} radius={0.02} position={[0, 0.5, -0.7]} />
        <mesh material={m.leatherDark} position={[0, 0.805, 0.1]}><boxGeometry args={[1.6, 0.012, 0.8]} /></mesh>
        {/* laptop */}
        <RoundedBox material={m.chrome} args={[0.52, 0.02, 0.36]} radius={0.008} position={[-0.9, 0.82, 0.25]} />
        <mesh material={m.chrome} position={[-0.9, 0.97, 0.07]} rotation={[-0.2, 0, 0]}><boxGeometry args={[0.52, 0.32, 0.015]} /></mesh>
        <mesh material={m.screen} position={[-0.9, 0.97, 0.074]} rotation={[-0.2, 0, 0]}><planeGeometry args={[0.48, 0.28]} /></mesh>
        {/* desk lamp, nameplate, pens */}
        <mesh material={m.gold} position={[1.4, 0.88, -0.1]}><cylinderGeometry args={[0.012, 0.012, 0.2, 8]} /></mesh>
        <mesh material={m.gold} position={[1.4, 0.99, -0.02]} rotation={[0.9, 0, 0]}><coneGeometry args={[0.1, 0.12, 16, 1, true]} /></mesh>
        <mesh material={m.lightSoft} position={[1.4, 0.95, -0.02]}><sphereGeometry args={[0.03, 8, 8]} /></mesh>
        <mesh material={m.gold} position={[0.55, 0.84, 0.6]}><boxGeometry args={[0.55, 0.06, 0.05]} /></mesh>
      </group>
      <ExecutiveChair m={m} position={[DESK.x, 0, DESK.z - 1.35]} rotY={0} />
      <Avatar m={m} position={[DESK.x, 0, DESK.z - 1.3]} />

      {/* visitor's side of the desk */}
      <DiningChair m={m} position={[DESK.x - 0.9, 0, DESK.z + 1.7]} rotY={Math.PI} />
      <DiningChair m={m} position={[DESK.x + 0.9, 0, DESK.z + 1.7]} rotY={Math.PI} />

      {/* lounge corner */}
      <group position={[LOUNGE.x, 0, LOUNGE.z]}>
        <mesh material={m.rug} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}><circleGeometry args={[2.0, 48]} /></mesh>
        <mesh material={m.darkWood} position={[0, 0.4, 0]}><cylinderGeometry args={[0.55, 0.55, 0.05, 40]} /></mesh>
        <mesh material={m.gold} position={[0, 0.2, 0]}><cylinderGeometry args={[0.04, 0.04, 0.4, 10]} /></mesh>
        <Armchair m={m} position={[-1.3, 0, -0.1]} rotY={Math.PI / 2 + 0.2} />
        <Armchair m={m} position={[0.1, 0, 1.4]} rotY={Math.PI + 0.5} />
        <Armchair m={m} position={[0.1, 0, -1.5]} rotY={-0.4} />
      </group>

      {/* credenza along the west wall, with awards */}
      <group position={[-width / 2 + 0.45, 0, -2.2]} rotation={[0, Math.PI / 2, 0]}>
        <RoundedBox material={m.midWood} args={[3.4, 0.8, 0.5]} radius={0.02} position={[0, 0.4, 0]} />
        {[-1.0, 0, 1.0].map((x, i) => (
          <group key={i} position={[x, 0.8, 0]}>
            <mesh material={m.gold} position={[0, 0.02, 0]}><cylinderGeometry args={[0.07, 0.08, 0.04, 12]} /></mesh>
            <mesh material={m.gold} position={[0, 0.17, 0]}><cylinderGeometry args={[0.012, 0.012, 0.24, 8]} /></mesh>
            <mesh material={m.gold} position={[0, 0.34, 0]}><cylinderGeometry args={[0.07, 0.03, 0.12, 12]} /></mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
