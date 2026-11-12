import * as THREE from "three";
import { artwork, herringbone, panelling } from "./textures";

/** Surface set for the cabin, built once. Environment reflections are kept low so the room stays moody at any time of day. */
export function createCabinMaterials(width: number, depth: number, height: number) {
  const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ envMapIntensity: 0.35, ...p });
  return {
    floor: std({ map: herringbone(Math.round(width / 2.6)), roughness: 0.38, metalness: 0.02 }),
    wallLong: std({ map: panelling(Math.round(depth / 1.7), Math.round(height / 2)), roughness: 0.55 }),
    wallShort: std({ map: panelling(Math.round(width / 1.7), Math.round(height / 2)), roughness: 0.55 }),
    ceiling: std({ color: "#1b130e", roughness: 0.9 }),
    darkWood: std({ color: "#2a170c", roughness: 0.28, metalness: 0.05 }),
    midWood: std({ color: "#4a2a16", roughness: 0.4 }),
    leather: std({ color: "#5b2f1c", roughness: 0.46 }),
    leatherDark: std({ color: "#241410", roughness: 0.42 }),
    chrome: std({ color: "#d8d8e0", roughness: 0.15, metalness: 1, envMapIntensity: 0.8 }),
    gold: std({ color: "#c98a1e", roughness: 0.25, metalness: 1, envMapIntensity: 0.6 }),
    fabric: std({ color: "#17142b", roughness: 0.95 }),
    curtain: std({ color: "#1e1a33", roughness: 1, side: THREE.DoubleSide }),
    rug: std({ color: "#241f3d", roughness: 1 }),
    pot: std({ color: "#161214", roughness: 0.55 }),
    leaf: std({ color: "#1f5a34", roughness: 0.6, side: THREE.DoubleSide }),
    skin: std({ color: "#b98563", roughness: 0.6 }),
    hair: std({ color: "#0d0a0a", roughness: 0.7 }),
    suit: std({ color: "#17171f", roughness: 0.8 }),
    shirt: std({ color: "#e9e6ee", roughness: 0.7 }),
    art: std({ map: artwork(), roughness: 0.7 }),
    screen: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.55, 0.78, 1).multiplyScalar(1.5), toneMapped: false }),
    light: new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.8, 0.5).multiplyScalar(3.2), toneMapped: false }),
    lightSoft: new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.78, 0.48).multiplyScalar(1.6), toneMapped: false }),
  };
}
export type CabinMaterials = ReturnType<typeof createCabinMaterials>;
