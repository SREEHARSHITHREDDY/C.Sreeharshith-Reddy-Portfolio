"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { projects } from "@/data";
import { useJourney } from "@/store/journey";
import { openLandmark, useNav } from "@/store/nav";
import type { CityPlan } from "../plan";

const titles: Record<string, string> = { linkedin: "LinkedIn", ...Object.fromEntries(projects.map((p) => [p.id, p.title])) };
const HQ_ID = "hq";

/** Invisible hit boxes + floating name tags for every clickable tower, plus the HQ itself. */
export function Landmarks({ plan }: { plan: CityPlan }) {
  const entered = useJourney((s) => s.entered);
  const view = useNav((s) => s.view);
  const hover = useNav((s) => s.hover);
  const setHover = useNav((s) => s.setHover);
  const openHq = useNav((s) => s.openHq);
  const inHq = view.kind === "hq";
  const active = entered && !inHq;
  // name tags only make sense from the arrival shot; up close the panel carries the name
  const showTags = view.kind === "city";

  useEffect(() => {
    document.body.style.cursor = hover && active ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover, active]);

  const items = useMemo(
    () => [
      ...plan.landmarks.map((l) => ({ id: l.id, x: l.x, z: l.z, w: l.w, d: l.d, h: l.height, accent: l.accent, label: titles[l.id], kind: l.kind })),
      { id: HQ_ID, x: plan.hq.x, z: plan.hq.z, w: 44, d: 44, h: plan.hq.height, accent: "#f59e0b", label: "Headquarters", kind: "hq" as const },
    ],
    [plan],
  );

  if (!entered) return null;

  return (
    <group visible={!inHq}>
      {items.map((it) => (
        <group key={it.id}>
          <mesh
            position={[it.x, it.h / 2, it.z]}
            onPointerOver={(e) => {
              if (!active) return;
              e.stopPropagation();
              setHover(it.id);
            }}
            onPointerOut={() => setHover(null)}
            onClick={(e) => {
              if (!active) return;
              e.stopPropagation();
              if (it.id === HQ_ID) openHq();
              else openLandmark(it.id);
            }}
          >
            <boxGeometry args={[it.w, it.h, it.d]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
          </mesh>

          <HoverGlow x={it.x} z={it.z} w={it.w} d={it.d} h={it.h} color={it.accent} on={active && hover === it.id} />

          <Html position={[it.x, it.h + 16, it.z]} center zIndexRange={[9, 0]} style={{ pointerEvents: active && showTags ? "auto" : "none", opacity: showTags ? 1 : 0, transition: "opacity 0.4s" }}>
            <button
              type="button"
              className={`tag${hover === it.id ? " is-hover" : ""}${it.kind === "hq" ? " tag-hq" : ""}`}
              style={{ ["--tag" as string]: it.accent }}
              tabIndex={-1}
              onPointerEnter={() => active && setHover(it.id)}
              onPointerLeave={() => setHover(null)}
              onClick={() => (it.id === HQ_ID ? openHq() : openLandmark(it.id))}
            >
              <i />
              {it.label}
            </button>
          </Html>
        </group>
      ))}
    </group>
  );
}

/** Soft additive column of light that fades in around the hovered tower. */
function HoverGlow({ x, z, w, d, h, color, on }: { x: number; z: number; w: number; d: number; h: number; color: string; on: boolean }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((_, dt) => {
    if (!mat.current) return;
    const target = on ? 0.22 : 0;
    mat.current.opacity += (target - mat.current.opacity) * (1 - Math.exp(-dt * 9));
  });
  return (
    <mesh position={[x, h / 2, z]} renderOrder={5}>
      <boxGeometry args={[w * 1.04, h * 1.01, d * 1.04]} />
      <meshBasicMaterial ref={mat} color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </mesh>
  );
}
