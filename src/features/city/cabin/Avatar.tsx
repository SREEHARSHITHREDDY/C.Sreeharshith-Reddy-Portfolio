"use client";

import { Html } from "@react-three/drei";
import { RoundedBox } from "@react-three/drei";
import { site } from "@/data";
import type { CabinMaterials } from "./materials";

/**
 * Stylised stand-in for the founder, seated at the desk facing the visitor.
 * Swap this group for a scanned model or a photo plane when one is available.
 */
export function Avatar({ m, position }: { m: CabinMaterials; position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* torso and jacket */}
      <RoundedBox material={m.suit} args={[0.58, 0.66, 0.34]} radius={0.12} smoothness={4} position={[0, 1.1, 0]} />
      <mesh material={m.shirt} position={[0, 1.2, 0.17]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.1, 0.34, 3]} /></mesh>
      <mesh material={m.gold} position={[0, 1.15, 0.176]}><boxGeometry args={[0.03, 0.2, 0.01]} /></mesh>
      {/* shoulders and arms resting on the desk */}
      <RoundedBox material={m.suit} args={[0.16, 0.5, 0.18]} radius={0.07} smoothness={3} position={[-0.38, 1.0, 0.18]} rotation={[-1.1, 0, 0.12]} />
      <RoundedBox material={m.suit} args={[0.16, 0.5, 0.18]} radius={0.07} smoothness={3} position={[0.38, 1.0, 0.18]} rotation={[-1.1, 0, -0.12]} />
      {/* neck and head */}
      <mesh material={m.skin} position={[0, 1.5, 0.02]}><cylinderGeometry args={[0.065, 0.075, 0.12, 12]} /></mesh>
      <mesh material={m.skin} position={[0, 1.66, 0.03]} scale={[0.95, 1.12, 1]}><sphereGeometry args={[0.135, 24, 20]} /></mesh>
      <mesh material={m.hair} position={[0, 1.72, 0]} scale={[1, 0.78, 1.02]}><sphereGeometry args={[0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} /></mesh>
      {/* legs under the desk */}
      <RoundedBox material={m.suit} args={[0.5, 0.18, 0.62]} radius={0.07} position={[0, 0.75, 0.2]} />

      <Html position={[0, 2.15, 0.1]} center distanceFactor={7} zIndexRange={[16, 0]} style={{ pointerEvents: "none" }}>
        <div className="avatar-tag">
          <b>{site.name}</b>
          <span>{site.title}</span>
        </div>
      </Html>
    </group>
  );
}
