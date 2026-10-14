"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSkyRig } from "./SkyRig";

/** Aerial-perspective haze: distant towers dissolve into the horizon glow. */
export function Atmosphere() {
  const rig = useSkyRig();

  useFrame(({ scene }) => {
    if (!scene.fog) scene.fog = new THREE.FogExp2("#000000", 0.001);
    const fog = scene.fog as THREE.FogExp2;
    fog.color.copy(rig.fog).lerp(rig.skyBottom, 0.85);
    fog.density = 0.00016 + rig.fogDensity * 0.00062;
  });

  return null;
}
