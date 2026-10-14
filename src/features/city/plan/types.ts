/** Facade styles understood by the building shader. */
export const STYLE = { GLASS: 0, CONCRETE: 1, BRICK: 2, FINS: 3, HQ: 4 } as const;

export interface Tier {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  style: number;
  seed: number;
  /** Linear RGB facade tint. */
  color: [number, number, number];
}

export interface Beacon {
  x: number;
  y: number;
  z: number;
  size: number;
}

export interface ScreenSpec {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  rotY: number;
  hue: number;
  seed: number;
}

export interface BuildingPlan {
  tiers: Tier[];
  beacons: Beacon[];
  screens: ScreenSpec[];
  hq: { x: number; z: number; height: number };
}

export interface RoadRun {
  axis: "x" | "z";
  /** Fixed coordinate (x for axis "z", z for axis "x"). */
  fixed: number;
  a: number;
  b: number;
  bridge: boolean;
}

export interface BridgeSpec {
  z: number;
  x0: number;
  x1: number;
  cable: boolean;
}

export interface LampSpec {
  x: number;
  y: number;
  z: number;
}
