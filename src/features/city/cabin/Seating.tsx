"use client";

import { RoundedBox } from "@react-three/drei";
import type { CabinMaterials } from "./materials";

type P = { m: CabinMaterials; position: [number, number, number]; rotY?: number };

/** Round-table chair: leather seat and curved back on a chrome pedestal. Faces +z at rotY 0. */
export function DiningChair({ m, position, rotY = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh material={m.chrome} position={[0, 0.2, 0]}><cylinderGeometry args={[0.035, 0.035, 0.4, 10]} /></mesh>
      <mesh material={m.chrome} position={[0, 0.02, 0]}><cylinderGeometry args={[0.26, 0.26, 0.03, 20]} /></mesh>
      <RoundedBox material={m.leather} args={[0.56, 0.1, 0.54]} radius={0.04} smoothness={3} position={[0, 0.46, 0]} />
      <RoundedBox material={m.leather} args={[0.56, 0.52, 0.09]} radius={0.04} smoothness={3} position={[0, 0.78, -0.25]} rotation={[-0.1, 0, 0]} />
      <RoundedBox material={m.leatherDark} args={[0.05, 0.05, 0.4]} radius={0.02} position={[-0.3, 0.64, -0.02]} />
      <RoundedBox material={m.leatherDark} args={[0.05, 0.05, 0.4]} radius={0.02} position={[0.3, 0.64, -0.02]} />
    </group>
  );
}

/** Tall executive chair behind the desk. */
export function ExecutiveChair({ m, position, rotY = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh material={m.chrome} position={[0, 0.25, 0]}><cylinderGeometry args={[0.04, 0.04, 0.5, 10]} /></mesh>
      <mesh material={m.chrome} position={[0, 0.03, 0]}><cylinderGeometry args={[0.36, 0.36, 0.04, 5]} /></mesh>
      <RoundedBox material={m.leatherDark} args={[0.74, 0.14, 0.72]} radius={0.06} smoothness={4} position={[0, 0.56, 0]} />
      <RoundedBox material={m.leatherDark} args={[0.74, 1.05, 0.14]} radius={0.07} smoothness={4} position={[0, 1.12, -0.34]} rotation={[-0.08, 0, 0]} />
      <RoundedBox material={m.leatherDark} args={[0.1, 0.07, 0.56]} radius={0.03} position={[-0.42, 0.78, -0.04]} />
      <RoundedBox material={m.leatherDark} args={[0.1, 0.07, 0.56]} radius={0.03} position={[0.42, 0.78, -0.04]} />
    </group>
  );
}

/** Low armchair for the lounge corner. */
export function Armchair({ m, position, rotY = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <RoundedBox material={m.leather} args={[0.95, 0.42, 0.9]} radius={0.08} smoothness={4} position={[0, 0.3, 0]} />
      <RoundedBox material={m.leather} args={[0.95, 0.6, 0.2]} radius={0.08} smoothness={4} position={[0, 0.72, -0.35]} rotation={[-0.12, 0, 0]} />
      <RoundedBox material={m.leather} args={[0.2, 0.3, 0.8]} radius={0.06} smoothness={3} position={[-0.5, 0.58, 0]} />
      <RoundedBox material={m.leather} args={[0.2, 0.3, 0.8]} radius={0.06} smoothness={3} position={[0.5, 0.58, 0]} />
      {[[-0.4, -0.35], [0.4, -0.35], [-0.4, 0.35], [0.4, 0.35]].map(([x, z], i) => (
        <mesh key={i} material={m.gold} position={[x, 0.05, z]}><cylinderGeometry args={[0.025, 0.02, 0.1, 8]} /></mesh>
      ))}
    </group>
  );
}
