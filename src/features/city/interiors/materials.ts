import * as THREE from "three";
import { createCabinMaterials } from "../cabin/materials";
import { marble } from "./textures";

/** Cabin surfaces plus the extras the other floors need (marble, glass, pedestal stone). */
export function createHallMaterials(L: number, W: number, H: number, lobby = false) {
  const base = createCabinMaterials(L, W, H);
  return {
    ...base,
    marbleFloor: new THREE.MeshStandardMaterial({ map: marble(Math.round(L / 3)), roughness: 0.18, metalness: 0.1, envMapIntensity: 0.5 }),
    stone: new THREE.MeshStandardMaterial({ color: "#b9b3a7", roughness: 0.4, envMapIntensity: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#cfe6ff", transparent: true, opacity: 0.12, roughness: 0.04, metalness: 0, envMapIntensity: 1.2, depthWrite: false, side: THREE.DoubleSide }),
    beam: new THREE.MeshBasicMaterial({ color: "#ffd9a0", transparent: true, opacity: 0.05, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    lobby,
  };
}
export type HallMaterials = ReturnType<typeof createHallMaterials>;
