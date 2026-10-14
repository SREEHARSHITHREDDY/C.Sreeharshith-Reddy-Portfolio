import { RIVER } from "../constants";

export const riverX = (z: number) =>
  RIVER.offset + RIVER.amp * Math.sin((z / RIVER.wavelength) * Math.PI * 2 + RIVER.phase);

/** Horizontal distance from the river centre line. */
export const riverDx = (x: number, z: number) => Math.abs(x - riverX(z));

/** True inside the water. */
export const inWater = (x: number, z: number, margin = 0) => riverDx(x, z) < RIVER.halfWidth + margin;

/** True inside water + embankment, where no buildings are placed. */
export const inRiverCorridor = (x: number, z: number, margin = 0) =>
  riverDx(x, z) < RIVER.halfWidth + RIVER.quay + margin;
