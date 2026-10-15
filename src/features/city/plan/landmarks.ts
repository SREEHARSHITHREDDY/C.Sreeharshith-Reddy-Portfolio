import { BLOCK, PITCH, RIVER } from "../constants";
import { inRiverCorridor, riverX } from "./river";

export type Side = "L" | "R";

/**
 * Where the landmark towers stand: river side and block row (gz). The first
 * seven carry the projects, the LinkedIn tower is the one at LINKEDIN_SLOT.
 * Chosen so all of them are visible from the arrival shot, spread on both banks.
 */
export const LANDMARK_SLOTS: { side: Side; gz: number }[] = [
  { side: "L", gz: -1 },
  { side: "R", gz: -1 },
  { side: "L", gz: -2 },
  { side: "R", gz: -2 },
  { side: "L", gz: -3 },
  { side: "R", gz: -3 },
  { side: "L", gz: -4 },
  { side: "R", gz: -6 },
];
export const LINKEDIN_SLOT = 2;

/** Silhouette recipes: [totalHeight, [widthFraction, heightFraction][]] from the base upward. */
export const LANDMARK_SHAPES: { height: number; steps: [number, number][] }[] = [
  { height: 190, steps: [[1, 0.55], [0.72, 0.3], [0.4, 0.15]] },
  { height: 160, steps: [[0.8, 0.8], [0.45, 0.2]] },
  { height: 175, steps: [[1, 0.35], [0.62, 0.65]] },
  { height: 210, steps: [[0.7, 0.7], [0.5, 0.3]] },
  { height: 150, steps: [[1, 0.5], [0.6, 0.35], [0.3, 0.15]] },
  { height: 185, steps: [[0.9, 0.45], [0.66, 0.35], [0.38, 0.2]] },
  { height: 140, steps: [[1, 0.7], [0.55, 0.3]] },
  { height: 200, steps: [[0.76, 0.6], [0.48, 0.4]] },
];

/** Grid block on the given bank of the river at row gz. */
export function landBlock(side: Side, gz: number) {
  const cz = gz * PITCH;
  const edge = RIVER.halfWidth + RIVER.quay + BLOCK / 2 + 4;
  let gx = side === "R" ? Math.ceil((riverX(cz) + edge) / PITCH) : Math.floor((riverX(cz) - edge) / PITCH);
  while (inRiverCorridor(gx * PITCH, cz, BLOCK / 2 - 8)) gx += side === "R" ? 1 : -1;
  return { gx, gz, x: gx * PITCH, z: cz };
}

/** Hex accent colours: projects first (see data/projects.ts), then LinkedIn. */
export const LINKEDIN_ACCENT = "#2f8cf0";
