/**
 * The intro journey as pure maths: no React, no three.js. Progress p runs 0 -> 1
 * as the visitor scrolls. Both the 3D camera and the 2D parallax read the same
 * curve, so the two modes always tell the same story.
 */

/** Altitudes (metres) of the three cloud decks the camera descends through. */
export const CLOUD_LAYERS = [1250, 1010, 790] as const;
export const ALT_START = 1500;
export const ALT_END = 240;

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Camera height for a given progress. */
export const journeyAltitude = (p: number) => ALT_END + (ALT_START - ALT_END) * (1 - easeInOutCubic(clamp01(p)));

export interface JourneyVars {
  /** "Scroll to enter" prompt: visible only at the very start. */
  prompt: number;
  /** "Welcome to our city" title. */
  welcome: number;
  /** Cloud white-out while the camera is inside a cloud deck. */
  mist: number;
  /** In-city UI (floor panel etc.) fades in once the visitor has arrived. */
  ui: number;
}

export function journeyVars(p: number): JourneyVars {
  const y = journeyAltitude(p);
  let mist = 0;
  for (const c of CLOUD_LAYERS) mist = Math.max(mist, clamp01(1 - Math.abs(y - c) / 120));
  return {
    prompt: clamp01(1 - p * 14),
    welcome: smoothstep(0.62, 0.76, p) * (1 - smoothstep(0.92, 0.985, p)),
    mist: mist * 0.72,
    ui: smoothstep(0.9, 1, p),
  };
}
