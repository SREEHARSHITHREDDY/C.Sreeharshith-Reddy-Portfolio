/** Shared city dimensions (world units = metres). */
export const PITCH = 72; // block pitch, road centre to road centre
export const ROAD_W = 14;
export const BLOCK = PITCH - ROAD_W;

/** Block grid extents (in block indices). */
export const GRID = { x0: -12, x1: 12, z0: -15, z1: 3 };

/** World bounds covered by the street grid. */
export const BOUNDS = {
  xMin: (GRID.x0 - 0.5) * PITCH,
  xMax: (GRID.x1 + 0.5) * PITCH,
  zMin: (GRID.z0 - 0.5) * PITCH,
  zMax: (GRID.z1 + 0.5) * PITCH,
};

/** River: a sine-wave centre line running along -z, `halfWidth` each side of it. */
export const RIVER = {
  halfWidth: 34,
  quay: 26, // embankment between water and the first buildings
  amp: 52,
  wavelength: 640,
  phase: 0.2,
  offset: 18,
};

/** Past the last block the river relaxes into a long straight reach, so the far distance stays calm. */
export const RIVER_FADE = { zStart: BOUNDS.zMin + 100, zEnd: BOUNDS.zMin - 800 };

export const DOWNTOWN = { z: -340, spread: 215 };

/** The CEO cabin: a room inside the HQ penthouse. Exterior shell size (the room is inset by the wall thickness). */
export const CABIN = { shellW: 20, shellD: 18, shellH: 7.5, wall: 0.3 };
