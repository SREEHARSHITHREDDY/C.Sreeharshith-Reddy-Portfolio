"use client";

import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { useNav } from "@/store/nav";
import type { CityPlan } from "../plan";
import { CeilingLights, Plant, Sconce } from "./Decor";
import { Furniture } from "./Furniture";
import { LOUNGE, ROOM, TABLE } from "./layout";
import { createCabinMaterials } from "./materials";

/**
 * The CEO cabin: a real room inside the HQ penthouse. Walls, floor and
 * ceiling face inward; the north wall is open glazing onto the city, so the
 * skyline outside is the live 3D city (and follows the time of day).
 */
export function CabinRoom({ hq }: { hq: CityPlan["hq"] }) {
  const m = useMemo(() => createCabinMaterials(ROOM.w, ROOM.d, ROOM.h), []);
  const inCabin = useNav((s) => s.view.kind === "hq" && s.view.floor === "cabin");
  const { w, d, h } = ROOM;

  useEffect(() => () => Object.values(m).forEach((mat) => mat.dispose()), [m]);

  const mullions = useMemo(() => {
    const n = 8;
    return Array.from({ length: n + 1 }, (_, i) => -w / 2 + (i / n) * w);
  }, [w]);

  return (
    // hidden unless the visitor is inside: from the floors below, the room's ceiling would show through the tower
    <group position={[hq.x, hq.cabinY, hq.z]} visible={inCabin}>
      {/* floor, ceiling and walls (all facing inwards) */}
      <mesh material={m.floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}><planeGeometry args={[w, d]} /></mesh>
      <mesh material={m.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}><planeGeometry args={[w, d]} /></mesh>
      <mesh material={m.wallLong} rotation={[0, Math.PI / 2, 0]} position={[-w / 2, h / 2, 0]}><planeGeometry args={[d, h]} /></mesh>
      <mesh material={m.wallLong} rotation={[0, -Math.PI / 2, 0]} position={[w / 2, h / 2, 0]}><planeGeometry args={[d, h]} /></mesh>
      <mesh material={m.wallShort} rotation={[0, Math.PI, 0]} position={[0, h / 2, d / 2]}><planeGeometry args={[w, h]} /></mesh>

      {/* skirting and crown moulding */}
      <mesh material={m.darkWood} position={[0, 0.08, d / 2 - 0.02]}><boxGeometry args={[w, 0.16, 0.04]} /></mesh>
      <mesh material={m.gold} position={[0, h - 0.05, d / 2 - 0.02]}><boxGeometry args={[w, 0.04, 0.04]} /></mesh>
      <mesh material={m.gold} position={[-w / 2 + 0.02, h - 0.05, 0]}><boxGeometry args={[0.04, 0.04, d]} /></mesh>
      <mesh material={m.gold} position={[w / 2 - 0.02, h - 0.05, 0]}><boxGeometry args={[0.04, 0.04, d]} /></mesh>

      {/* north glazing: mullions, transom and sill, open to the city beyond */}
      {mullions.map((x, i) => (
        <mesh key={i} material={m.darkWood} position={[x, h / 2, -d / 2 + 0.05]}><boxGeometry args={[0.1, h, 0.1]} /></mesh>
      ))}
      <mesh material={m.darkWood} position={[0, h - 0.06, -d / 2 + 0.05]}><boxGeometry args={[w, 0.12, 0.1]} /></mesh>
      <mesh material={m.darkWood} position={[0, 0.1, -d / 2 + 0.05]}><boxGeometry args={[w, 0.2, 0.12]} /></mesh>
      <mesh material={m.darkWood} position={[0, h * 0.62, -d / 2 + 0.05]}><boxGeometry args={[w, 0.05, 0.06]} /></mesh>

      {/* drapes at both ends of the glazing */}
      {[-1, 1].map((s) => (
        <mesh key={s} material={m.curtain} position={[s * (w / 2 - 0.9), h / 2, -d / 2 + 0.28]}>
          <boxGeometry args={[1.5, h - 0.2, 0.18]} />
        </mesh>
      ))}

      {/* wall art on the east wall above the lounge */}
      <group position={[w / 2 - 0.04, 2.6, LOUNGE.z]} rotation={[0, -Math.PI / 2, 0]}>
        <RoundedBox material={m.gold} args={[2.5, 1.7, 0.05]} radius={0.01} />
        <mesh material={m.art} position={[0, 0, 0.03]}><planeGeometry args={[2.3, 1.5]} /></mesh>
      </group>

      <Furniture m={m} width={w} />
      <Plant m={m} position={[w / 2 - 0.8, 0, -d / 2 + 1.2]} />
      <Plant m={m} position={[-w / 2 + 0.8, 0, -d / 2 + 1.2]} scale={0.92} />
      <Plant m={m} position={[w / 2 - 0.7, 0, d / 2 - 0.9]} scale={0.8} />

      <Sconce m={m} position={[-w / 2 + 0.06, 2.4, -4.5]} rotY={Math.PI / 2} />
      <Sconce m={m} position={[-w / 2 + 0.06, 2.4, 4.5]} rotY={Math.PI / 2} />
      <Sconce m={m} position={[w / 2 - 0.06, 2.4, -4.5]} rotY={-Math.PI / 2} />
      <Sconce m={m} position={[w / 2 - 0.06, 2.4, 4.5]} rotY={-Math.PI / 2} />
      <CeilingLights m={m} pendant={[TABLE.x, TABLE.z]} />

      {/* real lights only while the visitor is inside, so the rest of the city never pays for them */}
      {inCabin && (
        <>
          <ambientLight color="#ffd9b0" intensity={0.55} />
          <pointLight position={[TABLE.x, h - 1.0, TABLE.z]} color="#ffcf94" intensity={260} distance={0} decay={2} />
          <pointLight position={[0, h - 0.6, -4.5]} color="#ffd9a8" intensity={240} distance={0} decay={2} />
          <pointLight position={[LOUNGE.x, h - 0.7, LOUNGE.z]} color="#ffc98a" intensity={180} distance={0} decay={2} />
          <pointLight position={[0, h - 0.6, 4.5]} color="#ffdcb0" intensity={150} distance={0} decay={2} />
        </>
      )}
    </group>
  );
}
