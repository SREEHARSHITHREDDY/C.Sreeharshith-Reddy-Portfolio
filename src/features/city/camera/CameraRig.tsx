"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroShot } from "./path";

/** Slow cinematic drift around the hero shot. The scroll-driven descent plugs in here later. */
export function CameraRig({ hq, drift = true }: { hq: { x: number; z: number; height: number }; drift?: boolean }) {
  const shot = heroShot(hq);
  const look = new THREE.Vector3(...shot.target);

  useFrame((state) => {
    const t = drift ? state.clock.elapsedTime : 0;
    const cam = state.camera;
    cam.position.set(shot.position[0] + Math.sin(t * 0.05) * 16, shot.position[1] + Math.sin(t * 0.037) * 4, shot.position[2]);
    cam.lookAt(look.x + Math.sin(t * 0.04) * 10, look.y, look.z);
    const p = cam as THREE.PerspectiveCamera;
    if (p.fov !== shot.fov) {
      p.fov = shot.fov;
      p.updateProjectionMatrix();
    }
  });

  return null;
}
