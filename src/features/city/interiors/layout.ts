import { HQ_TIERS as T } from "../constants";

export type HallKind = "lobby" | "lounge" | "gallery";

export interface HallSpec {
  id: string;
  kind: HallKind;
  /** Floor height above ground. */
  y: number;
  /** Interior length (x), width (z) and ceiling height. */
  L: number;
  W: number;
  H: number;
  /** Depth of the tier this hall sits in, so the hall can hug its north (window) face. */
  tierD: number;
}

const hall = (id: string, kind: HallKind, y: number, tier: number, L: number, W: number, H = 4.4): HallSpec => ({ id, kind, y, L, W, H, tierD: tier });

/** Each HQ floor, matched to the tier it lives in (see HQ_TIERS). */
export const HALLS: Record<string, HallSpec> = {
  lobby: hall("lobby", "lobby", 0, T.base[0], 44, 26, 7),
  about: hall("about", "lounge", 30, T.shaft1[0], 38, 14),
  projects: hall("projects", "gallery", 70, T.shaft1[0], 38, 10),
  experience: hall("experience", "gallery", 110, T.shaft1[0], 38, 10),
  leadership: hall("leadership", "gallery", 165, T.shaft2[0], 30, 10),
  achievements: hall("achievements", "gallery", 205, T.shaft2[0], 30, 10),
  certifications: hall("certifications", "gallery", 244, T.shaft3[0], 22, 10),
};

/** z offset (from the HQ centre) of a hall's centre: pushed against the tier's north face. */
export const hallCentreZ = (h: HallSpec) => -(h.tierD / 2 - h.W / 2 - 0.8);

/** Local x of exhibit i of n, evenly spread along the corridor. */
export const exhibitX = (i: number, n: number, L: number) => -L / 2 + (L / n) * (i + 0.5);

/** Where the visitor stands in a hall (local coordinates). */
export const WALK_Z = 3.9;
export const CASE_Z = -1.3;
