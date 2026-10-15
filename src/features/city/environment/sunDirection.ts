import * as THREE from "three";

/**
 * Sun/moon direction for a time of day. The arc is tilted so the light always
 * sits in the far half of the sky: it rises on the right of the view, passes
 * behind the city at noon and sets on the left, which keeps the golden-hour
 * glow in frame for a camera looking down the river.
 */
export function sunDirection(azimuth: number, elevation: number, out = new THREE.Vector3()) {
  const theta = THREE.MathUtils.degToRad(azimuth - 90); // 0 -> PI across the arc
  const el = THREE.MathUtils.degToRad(elevation);
  const hx = Math.cos(theta) * 0.3;
  const hz = -(0.95 + 0.05 * Math.sin(theta));
  const len = Math.hypot(hx, hz);
  const c = Math.cos(el);
  return out.set((hx / len) * c, Math.sin(el), (hz / len) * c).normalize();
}
