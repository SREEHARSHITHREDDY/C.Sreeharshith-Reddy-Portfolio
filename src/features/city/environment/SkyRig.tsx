"use client";

import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TimeOfDay } from "@/hooks/useTimeOfDay";
import type { Palette } from "@/lib/timeOfDay";
import { sunDirection } from "./sunDirection";

/**
 * One shared, smoothly damped copy of the time-of-day palette. Every 3D
 * component reads from this instead of re-deriving colours, so the whole
 * scene eases between sunrise, day, sunset and night together.
 */
export interface SkyRig {
  skyTop: THREE.Color;
  skyMid: THREE.Color;
  skyBottom: THREE.Color;
  sun: THREE.Color;
  ambient: THREE.Color;
  fog: THREE.Color;
  cloud: THREE.Color;
  sunIntensity: number;
  ambientIntensity: number;
  fogDensity: number;
  windowGlow: number;
  stars: number;
  sunDir: THREE.Vector3;
}

function build(p: Palette, dir: THREE.Vector3): SkyRig {
  return {
    skyTop: new THREE.Color(p.skyTop),
    skyMid: new THREE.Color(p.skyMid),
    skyBottom: new THREE.Color(p.skyBottom),
    sun: new THREE.Color(p.sun),
    ambient: new THREE.Color(p.ambient),
    fog: new THREE.Color(p.fog),
    cloud: new THREE.Color(p.cloud),
    sunIntensity: p.sunIntensity,
    ambientIntensity: p.ambientIntensity,
    fogDensity: p.fogDensity,
    windowGlow: p.windowGlow,
    stars: p.stars,
    sunDir: dir.clone(),
  };
}

const Ctx = createContext<SkyRig | null>(null);

export function SkyRigProvider({ time, children }: { time: TimeOfDay; children: ReactNode }) {
  const target = useMemo(
    () => build(time.palette, sunDirection(time.sun.azimuth, time.sun.elevation)),
    [time],
  );
  const current = useRef<SkyRig | null>(null);
  if (current.current === null) current.current = build(time.palette, sunDirection(time.sun.azimuth, time.sun.elevation));

  // runs before every other frame callback (negative priority keeps auto-render on)
  useFrame((_, dt) => {
    const c = current.current!;
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 2.2);
    c.skyTop.lerp(target.skyTop, k);
    c.skyMid.lerp(target.skyMid, k);
    c.skyBottom.lerp(target.skyBottom, k);
    c.sun.lerp(target.sun, k);
    c.ambient.lerp(target.ambient, k);
    c.fog.lerp(target.fog, k);
    c.cloud.lerp(target.cloud, k);
    c.sunIntensity += (target.sunIntensity - c.sunIntensity) * k;
    c.ambientIntensity += (target.ambientIntensity - c.ambientIntensity) * k;
    c.fogDensity += (target.fogDensity - c.fogDensity) * k;
    c.windowGlow += (target.windowGlow - c.windowGlow) * k;
    c.stars += (target.stars - c.stars) * k;
    c.sunDir.lerp(target.sunDir, k).normalize();
  }, -100);

  return <Ctx.Provider value={current.current}>{children}</Ctx.Provider>;
}

export function useSkyRig(): SkyRig {
  const rig = useContext(Ctx);
  if (!rig) throw new Error("useSkyRig must be used inside <SkyRigProvider>");
  return rig;
}

/** Copy the rig into sky-shader uniforms. */
export function applySkyUniforms(mat: THREE.ShaderMaterial, rig: SkyRig, time: number) {
  const u = mat.uniforms;
  u.uTop.value.copy(rig.skyTop);
  u.uMid.value.copy(rig.skyMid);
  u.uBottom.value.copy(rig.skyBottom);
  u.uSunColor.value.copy(rig.sun);
  u.uSunDir.value.copy(rig.sunDir);
  u.uCloud.value.copy(rig.cloud);
  u.uSunI.value = rig.sunIntensity;
  u.uStars.value = rig.stars;
  u.uTime.value = time;
}
