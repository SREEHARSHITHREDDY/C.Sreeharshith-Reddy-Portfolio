"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useSkyRig } from "./SkyRig";

/** Sun/moon key light plus a sky/ground hemisphere fill. No shadow maps: depth comes from reflections, fog and baked-in contact darkening. */
export function Lighting() {
  const rig = useSkyRig();
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);

  useFrame(() => {
    if (sun.current) {
      sun.current.color.copy(rig.sun);
      sun.current.intensity = rig.sunIntensity * 1.7;
      sun.current.position.copy(rig.sunDir).multiplyScalar(500);
    }
    if (hemi.current) {
      hemi.current.color.copy(rig.skyMid);
      hemi.current.groundColor.copy(rig.fog).multiplyScalar(0.35);
      hemi.current.intensity = 0.12 + rig.ambientIntensity * 0.75;
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} />
      <directionalLight ref={sun} />
    </>
  );
}
