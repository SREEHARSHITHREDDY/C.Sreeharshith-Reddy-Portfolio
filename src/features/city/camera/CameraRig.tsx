"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "@/store/journey";
import { cameraAt } from "./path";

/** Places the camera along the intro journey every frame. Progress comes from scroll (see features/intro). */
export function CameraRig({ hq, drift = true }: { hq: { x: number; z: number; height: number }; drift?: boolean }) {
  useFrame((state) => {
    const shot = cameraAt(journey.value, hq, drift ? state.clock.elapsedTime : 0);
    const cam = state.camera as THREE.PerspectiveCamera;
    cam.position.set(...shot.position);
    cam.lookAt(...shot.target);
    if (Math.abs(cam.fov - shot.fov) > 0.01) {
      cam.fov = shot.fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
