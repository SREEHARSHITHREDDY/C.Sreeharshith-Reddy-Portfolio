"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LANDMARK_SHAPES } from "../plan/landmarks";
import type { HallMaterials } from "./materials";
import { cardTexture, plaqueTexture, type CardSpec } from "./textures";

export type ExhibitKind =
  | { type: "project"; shapeIndex: number; accent: string }
  | { type: "card"; card: CardSpec }
  | { type: "trophy"; card: CardSpec };

export interface ExhibitSpec {
  id: string;
  title: string;
  sub: string;
  accent: string;
  kind: ExhibitKind;
}

/** Glass case on a stone pedestal, with a name plaque, a spotlight beam and the exhibit inside. */
export function Exhibit({ spec, m, position, active }: { spec: ExhibitSpec; m: HallMaterials; position: [number, number, number]; active: boolean }) {
  const plaque = useMemo(() => plaqueTexture(spec.title, spec.sub, spec.accent), [spec]);
  const plaqueMat = useMemo(() => new THREE.MeshBasicMaterial({ map: plaque, toneMapped: false }), [plaque]);
  const glow = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, dt) => {
    if (!glow.current) return;
    glow.current.opacity += ((active ? 0.12 : 0.035) - glow.current.opacity) * (1 - Math.exp(-dt * 5));
  });

  return (
    <group position={position}>
      {/* pedestal */}
      <RoundedBox material={m.stone} args={[1.2, 0.95, 1.2]} radius={0.02} position={[0, 0.475, 0]} />
      <mesh material={m.gold} position={[0, 0.96, 0]}><boxGeometry args={[1.24, 0.03, 1.24]} /></mesh>
      <mesh material={plaqueMat} position={[0, 0.55, 0.605]}><planeGeometry args={[0.9, 0.28]} /></mesh>

      {/* spotlight beam and floor pool */}
      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.35, 0.95, 2.9, 24, 1, true]} />
        <meshBasicMaterial ref={glow} color="#ffe0b0" transparent opacity={0.035} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh material={m.lightSoft} position={[0, 3.88, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.16, 20]} /></mesh>

      {/* content */}
      <group position={[0, 0.98, 0]}>
        {spec.kind.type === "project" && <ProjectModel shapeIndex={spec.kind.shapeIndex} accent={spec.kind.accent} />}
        {spec.kind.type === "card" && <FramedCard card={spec.kind.card} />}
        {spec.kind.type === "trophy" && <Trophy card={spec.kind.card} m={m} />}
      </group>

      {/* glass */}
      <mesh material={m.glass} position={[0, 1.55, 0]}><boxGeometry args={[1.1, 1.2, 1.1]} /></mesh>
      <mesh material={m.gold} position={[0, 2.16, 0]}><boxGeometry args={[1.14, 0.03, 1.14]} /></mesh>
    </group>
  );
}

/** Miniature of the project's tower in the city, slowly turning. */
function ProjectModel({ shapeIndex, accent }: { shapeIndex: number; accent: string }) {
  const g = useRef<THREE.Group>(null);
  const shape = LANDMARK_SHAPES[shapeIndex % LANDMARK_SHAPES.length];
  const total = shape.height + 22;
  const k = 0.95 / total;
  const body = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1d2433", roughness: 0.25, metalness: 0.6 }), []);
  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(accent).multiplyScalar(2.2), toneMapped: false }), [accent]);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.5;
  });
  const tiers: { y: number; w: number; h: number }[] = [];
  let y = 0;
  for (const [wf, hf] of shape.steps) {
    tiers.push({ y, w: 44 * wf * k, h: shape.height * hf * k });
    y += shape.height * hf * k;
  }
  return (
    <group ref={g}>
      {tiers.map((t, i) => (
        <group key={i}>
          <mesh material={body} position={[0, t.y + t.h / 2, 0]}><boxGeometry args={[t.w, t.h, t.w]} /></mesh>
          {[0.25, 0.55, 0.85].map((f) => (
            <mesh key={f} material={glowMat} position={[0, t.y + t.h * f, 0]}><boxGeometry args={[t.w + 0.006, 0.012, t.w + 0.006]} /></mesh>
          ))}
        </group>
      ))}
      <mesh material={glowMat} position={[0, y + 0.07, 0]}><boxGeometry args={[0.014, 0.14, 0.014]} /></mesh>
    </group>
  );
}

/** A card standing on a small easel inside the case. */
function FramedCard({ card }: { card: CardSpec }) {
  const map = useMemo(() => cardTexture(card), [card]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ map, toneMapped: false }), [map]);
  const frame = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b07a1a", metalness: 1, roughness: 0.3 }), []);
  return (
    <group position={[0, 0.5, 0]} rotation={[-0.12, 0, 0]}>
      <mesh material={frame}><boxGeometry args={[0.9, 0.67, 0.03]} /></mesh>
      <mesh material={mat} position={[0, 0, 0.017]}><planeGeometry args={[0.82, 0.59]} /></mesh>
      <mesh material={frame} position={[0, -0.4, -0.12]} rotation={[0.35, 0, 0]}><boxGeometry args={[0.05, 0.4, 0.03]} /></mesh>
    </group>
  );
}

/** Gold cup with a small card at its foot. */
function Trophy({ card, m }: { card: CardSpec; m: HallMaterials }) {
  const g = useRef<THREE.Group>(null);
  const map = useMemo(() => cardTexture(card), [card]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ map, toneMapped: false }), [map]);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.45;
  });
  return (
    <group>
      <group ref={g} position={[0, 0, -0.1]}>
        <mesh material={m.gold} position={[0, 0.04, 0]}><cylinderGeometry args={[0.16, 0.18, 0.08, 20]} /></mesh>
        <mesh material={m.gold} position={[0, 0.19, 0]}><cylinderGeometry args={[0.025, 0.04, 0.24, 12]} /></mesh>
        <mesh material={m.gold} position={[0, 0.5, 0]}><cylinderGeometry args={[0.2, 0.07, 0.38, 24, 1, true]} /></mesh>
        <mesh material={m.gold} position={[0, 0.31, 0]}><sphereGeometry args={[0.07, 12, 10]} /></mesh>
        <mesh material={m.gold} position={[-0.22, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.07, 0.014, 8, 16, Math.PI]} /></mesh>
        <mesh material={m.gold} position={[0.22, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}><torusGeometry args={[0.07, 0.014, 8, 16, Math.PI]} /></mesh>
      </group>
      <mesh material={mat} position={[0, 0.17, 0.4]} rotation={[-0.5, 0, 0]}><planeGeometry args={[0.6, 0.43]} /></mesh>
    </group>
  );
}
