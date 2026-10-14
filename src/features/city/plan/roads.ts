import { BOUNDS, GRID, PITCH, ROAD_W, RIVER } from "../constants";
import { inWater, riverX } from "./river";
import type { BridgeSpec, LampSpec, RoadRun } from "./types";

const STEP = 6;

/** Streets that cross the river (every third street). */
const isBridgeStreet = (k: number) => ((k % 3) + 3) % 3 === 0;

function runs(
  axis: "x" | "z",
  fixed: number,
  from: number,
  to: number,
  blocked: (t: number) => boolean,
  bridge: boolean,
): RoadRun[] {
  const out: RoadRun[] = [];
  let start: number | null = null;
  for (let t = from; t <= to + 0.001; t += STEP) {
    const free = !blocked(t);
    if (free && start === null) start = t;
    if ((!free || t + STEP > to) && start !== null) {
      const end = free ? t : t - STEP;
      if (end - start > 30) out.push({ axis, fixed, a: start, b: end, bridge });
      start = null;
    }
  }
  return out;
}

export function planRoads() {
  const roadRuns: RoadRun[] = [];
  const bridges: BridgeSpec[] = [];

  // avenues (run along z) never cross the river
  for (let k = GRID.x0 - 1; k <= GRID.x1; k++) {
    const x = (k + 0.5) * PITCH;
    roadRuns.push(...runs("z", x, BOUNDS.zMin, BOUNDS.zMax, (z) => inWater(x, z, 2), false));
  }

  // streets (run along x); every third one becomes a bridge
  let bridgeCount = 0;
  for (let k = GRID.z0 - 1; k <= GRID.z1; k++) {
    const z = (k + 0.5) * PITCH;
    if (isBridgeStreet(k)) {
      const cx = riverX(z);
      const x0 = cx - RIVER.halfWidth - 10;
      const x1 = cx + RIVER.halfWidth + 10;
      roadRuns.push({ axis: "x", fixed: z, a: BOUNDS.xMin, b: x0, bridge: false });
      roadRuns.push({ axis: "x", fixed: z, a: x0, b: x1, bridge: true });
      roadRuns.push({ axis: "x", fixed: z, a: x1, b: BOUNDS.xMax, bridge: false });
      bridges.push({ z, x0, x1, cable: bridgeCount === 2 });
      bridgeCount++;
    } else {
      roadRuns.push(...runs("x", z, BOUNDS.xMin, BOUNDS.xMax, (x) => inWater(x, z, 2), false));
    }
  }

  // street lamps on both sides of every road, plus the river promenade
  const lamps: LampSpec[] = [];
  const side = ROAD_W / 2 + 1.4;
  for (const r of roadRuns) {
    for (let t = r.a + 10; t < r.b; t += 36) {
      for (const s of [-1, 1]) {
        if (r.axis === "z") lamps.push({ x: r.fixed + s * side, y: 8, z: t + (s > 0 ? 18 : 0) });
        else lamps.push({ x: t + (s > 0 ? 18 : 0), y: 8, z: r.fixed + s * side });
      }
    }
  }
  for (let z = BOUNDS.zMax; z > BOUNDS.zMin; z -= 28) {
    for (const s of [-1, 1]) lamps.push({ x: riverX(z) + s * (RIVER.halfWidth + 3), y: 5, z });
  }

  return { roadRuns, bridges, lamps };
}
