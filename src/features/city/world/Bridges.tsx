"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { ROAD_W } from "../constants";
import { useSkyRig } from "../environment/SkyRig";
import type { BridgeSpec } from "../plan";

const DECK_W = ROAD_W + 2;

function Bridge({ b, edge }: { b: BridgeSpec; edge: THREE.MeshBasicMaterial }) {
  const len = b.x1 - b.x0;
  const cx = (b.x0 + b.x1) / 2;

  const piers = useMemo(() => {
    const out: number[] = [];
    for (let x = b.x0 + 26; x < b.x1 - 20; x += 34) out.push(x);
    return out;
  }, [b]);

  const cables = useMemo(() => {
    if (!b.cable) return null;
    const pts: number[] = [];
    const towers = [cx - 20, cx + 20];
    for (const tx of towers) {
      for (const sz of [-1, 1]) {
        const z = b.z + sz * (DECK_W / 2 - 0.5);
        for (let k = 1; k <= 7; k++) {
          const dx = k * 5;
          const ty = 70 - k * 1.2;
          for (const dir of [-1, 1]) pts.push(tx, ty, z, tx + dir * dx, 1.6, z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return { g, towers };
  }, [b, cx]);

  return (
    <group>
      <mesh position={[cx, 0.7, b.z]}>
        <boxGeometry args={[len, 1.4, DECK_W]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.6} metalness={0.2} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[cx, 1.7, b.z + s * (DECK_W / 2 - 0.4)]} material={edge}>
          <boxGeometry args={[len, 0.35, 0.35]} />
        </mesh>
      ))}
      {piers.map((x) => (
        <mesh key={x} position={[x, -2, b.z]}>
          <boxGeometry args={[5, 5.4, DECK_W - 4]} />
          <meshStandardMaterial color="#15151a" roughness={0.8} />
        </mesh>
      ))}
      {cables && (
        <>
          {cables.towers.map((tx) =>
            [-1, 1].map((sz) => (
              <mesh key={`${tx}${sz}`} position={[tx, 36, b.z + sz * (DECK_W / 2 - 0.5)]}>
                <boxGeometry args={[2.4, 72, 2.4]} />
                <meshStandardMaterial color="#1b1b24" roughness={0.4} metalness={0.5} />
              </mesh>
            )),
          )}
          {cables.towers.map((tx) => (
            <mesh key={`cap${tx}`} position={[tx, 71.5, b.z]}>
              <boxGeometry args={[2.6, 1.2, DECK_W]} />
              <meshBasicMaterial color="#06b6d4" toneMapped={false} />
            </mesh>
          ))}
          <lineSegments geometry={cables.g}>
            <lineBasicMaterial color="#cfe9ff" toneMapped={false} transparent opacity={0.55} />
          </lineSegments>
        </>
      )}
    </group>
  );
}

export function Bridges({ bridges }: { bridges: BridgeSpec[] }) {
  const rig = useSkyRig();
  // every bridge shares one lit-edge material, brightened as the sky darkens
  const edge = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  useFrame(() => {
    edge.color.setRGB(1, 0.85, 0.6).multiplyScalar(0.25 + rig.windowGlow * 3);
  });
  return (
    <>
      {bridges.map((b) => (
        <Bridge key={b.z} b={b} edge={edge} />
      ))}
    </>
  );
}
