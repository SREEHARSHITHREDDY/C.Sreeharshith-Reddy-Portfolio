"use client";

import { Html, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { HallMaterials } from "./materials";
import { useGuest } from "@/store/guest";

/** The receptionist: waves, and speaks in a bubble that changes once the guest has given their name. */
export function Receptionist({ m, position }: { m: HallMaterials; position: [number, number, number] }) {
  const name = useGuest((s) => s.name);
  const arm = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const blazer = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1c3b57", roughness: 0.7 }), []);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (arm.current) arm.current.rotation.z = -2.35 + Math.sin(t * 4.2) * 0.22 * (name ? 0.4 : 1);
    if (head.current) head.current.rotation.y = Math.sin(t * 0.7) * 0.12;
  });

  return (
    <group position={position}>
      <RoundedBox material={blazer} args={[0.52, 0.66, 0.3]} radius={0.12} smoothness={4} position={[0, 1.22, 0]} />
      <mesh material={m.shirt} position={[0, 1.4, 0.15]}><boxGeometry args={[0.14, 0.2, 0.01]} /></mesh>
      <RoundedBox material={blazer} args={[0.52, 0.45, 0.28]} radius={0.1} position={[0, 0.7, 0]} />
      <mesh material={m.skin} position={[0, 1.6, 0]}><cylinderGeometry args={[0.055, 0.065, 0.1, 12]} /></mesh>
      <group ref={head} position={[0, 1.76, 0.01]}>
        <mesh material={m.skin} scale={[0.92, 1.1, 0.98]}><sphereGeometry args={[0.125, 24, 20]} /></mesh>
        <mesh material={m.hair} position={[0, 0.03, -0.035]} scale={[1.08, 1.15, 1.1]}><sphereGeometry args={[0.13, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.62]} /></mesh>
        <mesh material={m.hair} position={[0, -0.12, -0.07]} scale={[1, 1.5, 0.7]}><sphereGeometry args={[0.1, 16, 12]} /></mesh>
        <mesh material={m.chrome} position={[0, 0.02, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.135, 0.008, 6, 24, Math.PI]} /></mesh>
        <mesh material={m.chrome} position={[0.12, -0.04, 0.05]}><sphereGeometry args={[0.022, 8, 8]} /></mesh>
      </group>
      {/* left arm resting, right arm waving */}
      <RoundedBox material={blazer} args={[0.12, 0.5, 0.13]} radius={0.05} position={[-0.34, 1.12, 0.02]} rotation={[0, 0, 0.08]} />
      <group ref={arm} position={[0.3, 1.45, 0]}>
        <RoundedBox material={blazer} args={[0.12, 0.5, 0.13]} radius={0.05} position={[0, -0.25, 0]} />
        <mesh material={m.skin} position={[0, -0.54, 0]}><sphereGeometry args={[0.055, 12, 10]} /></mesh>
      </group>

      <Html position={[0, 2.25, 0]} center distanceFactor={9} zIndexRange={[16, 0]} style={{ pointerEvents: "none" }}>
        <div className="speech">
          {name ? (
            <>
              <b>Welcome, {name}!</b>
              <span>Take the elevator whenever you are ready.</span>
            </>
          ) : (
            <>
              <b>Welcome to the Empire!</b>
              <span>May I have your name, please?</span>
            </>
          )}
        </div>
      </Html>
    </group>
  );
}
