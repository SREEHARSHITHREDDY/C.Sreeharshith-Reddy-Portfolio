"use client";

import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { site } from "@/data";
import { useGuest } from "@/store/guest";
import { Plant } from "../cabin/Decor";
import { Armchair } from "../cabin/Seating";
import { HallShell } from "./HallShell";
import { InteriorLights } from "./InteriorLights";
import type { HallSpec } from "./layout";
import { createHallMaterials } from "./materials";
import { Receptionist } from "./Receptionist";
import { signTexture, welcomeTexture } from "./textures";

/** Ground-floor lobby: marble floor, reception desk with a receptionist, the gold Empire sign. */
export function LobbyRoom({ spec }: { spec: HallSpec }) {
  const m = useMemo(() => createHallMaterials(spec.L, spec.W, spec.H, true), [spec]);
  const name = useGuest((s) => s.name);
  const sign = useMemo(() => new THREE.MeshBasicMaterial({ map: signTexture(site.brand), toneMapped: false }), []);
  const welcomeMap = useMemo(() => welcomeTexture(name), [name]);
  const welcome = useMemo(() => new THREE.MeshBasicMaterial({ map: welcomeMap, toneMapped: false }), [welcomeMap]);
  useEffect(() => () => welcomeMap.dispose(), [welcomeMap]);

  const { L, W, H } = spec;
  const deskZ = -6;

  return (
    <group>
      <HallShell spec={spec} m={m} floor="marble">
        {/* the sign wall */}
        <mesh material={sign} position={[0, 4.2, -W / 2 + 0.2]}><planeGeometry args={[16, 3.6]} /></mesh>
      </HallShell>

      {/* reception desk */}
      <group position={[0, 0, deskZ]}>
        <RoundedBox material={m.darkWood} args={[8, 1.1, 1.3]} radius={0.04} position={[0, 0.55, 0]} />
        <mesh material={m.stone} position={[0, 1.12, 0.05]}><boxGeometry args={[8.2, 0.07, 1.5]} /></mesh>
        <mesh material={m.gold} position={[0, 0.5, 0.66]}><boxGeometry args={[7.4, 0.06, 0.02]} /></mesh>
        <mesh material={m.light} position={[0, 0.2, 0.67]}><boxGeometry args={[7.4, 0.04, 0.01]} /></mesh>
        {/* welcome board */}
        <mesh material={welcome} position={[-2.4, 1.52, 0.35]} rotation={[-0.12, 0, 0]}><planeGeometry args={[0.9, 0.45]} /></mesh>
        <mesh material={m.gold} position={[-2.4, 1.3, 0.3]}><boxGeometry args={[0.08, 0.36, 0.04]} /></mesh>
        {/* monitor */}
        <mesh material={m.chrome} position={[1.8, 1.42, -0.2]}><boxGeometry args={[0.7, 0.42, 0.03]} /></mesh>
        <mesh material={m.screen} position={[1.8, 1.42, -0.18]}><planeGeometry args={[0.64, 0.36]} /></mesh>
      </group>
      <Receptionist m={m} position={[0.2, 0, deskZ - 1.5]} />

      {/* seating areas either side */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 13, 0, 1]}>
          <mesh material={m.rug} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}><circleGeometry args={[3.2, 40]} /></mesh>
          <mesh material={m.darkWood} position={[0, 0.4, 0]}><cylinderGeometry args={[0.7, 0.7, 0.05, 32]} /></mesh>
          <mesh material={m.gold} position={[0, 0.2, 0]}><cylinderGeometry args={[0.05, 0.05, 0.4, 10]} /></mesh>
          <Armchair m={m} position={[-1.7, 0, 0.2]} rotY={Math.PI / 2} />
          <Armchair m={m} position={[1.7, 0, 0.2]} rotY={-Math.PI / 2} />
          <Armchair m={m} position={[0, 0, -1.7]} rotY={0} />
        </group>
      ))}
      <Plant m={m} position={[-L / 2 + 1.2, 0, -W / 2 + 1.4]} scale={1.2} />
      <Plant m={m} position={[L / 2 - 1.2, 0, -W / 2 + 1.4]} scale={1.2} />
      <Plant m={m} position={[-5.5, 0, deskZ + 3.5]} scale={0.9} />
      <Plant m={m} position={[5.5, 0, deskZ + 3.5]} scale={0.9} />

      <InteriorLights points={[[0, H - 0.6, -4], [-10, H - 0.6, 0], [10, H - 0.6, 0], [0, H - 0.6, 5]]} />
    </group>
  );
}
