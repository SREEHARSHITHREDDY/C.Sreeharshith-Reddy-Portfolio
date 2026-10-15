"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSkyRig } from "./SkyRig";

const fwd = new THREE.Vector3();

/**
 * Aerial-perspective haze: distant towers dissolve into the horizon glow.
 * The haze colour is the sky's own horizon colour in the camera's direction
 * (including the sun's glow), so the far ground melts into the sky seamlessly.
 */
export function Atmosphere() {
  const rig = useSkyRig();

  useFrame(({ scene, camera }) => {
    if (!scene.fog) scene.fog = new THREE.FogExp2("#000000", 0.001);
    const fog = scene.fog as THREE.FogExp2;

    camera.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    // true 3D angle to the sun, exactly as the sky shader measures it, so a high midday sun adds almost no glow at the horizon
    const sd = Math.max(0, fwd.dot(rig.sunDir));
    const glow = (Math.pow(sd, 5) * 0.4 + Math.pow(sd, 18) * 0.35) * rig.sunIntensity;

    rig.horizon.copy(rig.skyBottom).lerp(rig.fog, 0.35);
    rig.horizon.r += rig.sun.r * glow;
    rig.horizon.g += rig.sun.g * glow;
    rig.horizon.b += rig.sun.b * glow;
    fog.color.copy(rig.horizon);
    fog.density = 0.0002 + rig.fogDensity * 0.00075;
  });

  return null;
}
