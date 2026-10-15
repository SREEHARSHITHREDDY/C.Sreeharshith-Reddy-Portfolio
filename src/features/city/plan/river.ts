import { RIVER, RIVER_FADE } from "../constants";

/** 1 inside the city, easing to 0 over the far straight reach. Mirrored in the ground shader. */
const meander = (z: number) => {
  const t = Math.min(1, Math.max(0, (RIVER_FADE.zStart - z) / (RIVER_FADE.zStart - RIVER_FADE.zEnd)));
  return 1 - t * t * (3 - 2 * t);
};

export const riverX = (z: number) =>
  RIVER.offset + RIVER.amp * meander(z) * Math.sin((z / RIVER.wavelength) * Math.PI * 2 + RIVER.phase);

/** Horizontal distance from the river centre line. */
export const riverDx = (x: number, z: number) => Math.abs(x - riverX(z));

/** True inside the water. */
export const inWater = (x: number, z: number, margin = 0) => riverDx(x, z) < RIVER.halfWidth + margin;

/** True inside water + embankment, where no buildings are placed. */
export const inRiverCorridor = (x: number, z: number, margin = 0) =>
  riverDx(x, z) < RIVER.halfWidth + RIVER.quay + margin;
