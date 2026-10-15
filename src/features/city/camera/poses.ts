import { floors } from "@/data";
import { useNav } from "@/store/nav";
import type { Landmark } from "../plan";
import type { Shot } from "./path";

type Hq = { x: number; z: number; height: number; cabinY: number };

/** Eye heights (metres above ground) for each HQ floor, inside the tower's tiers. */
const FLOOR_Y: Record<string, number> = {
  lobby: 7,
  about: 62,
  projects: 106,
  experience: 150,
  leadership: 194,
  achievements: 232,
  certifications: 262,
};

export const floorIndex = (id: string) => Math.max(0, floors.findIndex((f) => f.id === id));

/** Camera for a landmark: in front of the tower (towards the visitor), looking at its middle. */
export function landmarkShot(l: Landmark): Shot {
  const sideways = l.x < 0 ? 26 : -26;
  const h = l.height;
  return {
    position: [l.x + sideways, Math.max(70, h * 0.6), l.z + 150],
    target: [l.x, h * 0.55, l.z],
    fov: 52,
  };
}

/** Camera inside the HQ at a given floor, looking out over the city (north). */
export function hqFloorShot(hq: Hq, floorId: string, t: number): Shot {
  if (floorId === "cabin") return cabinShot(hq, t);
  const y = FLOOR_Y[floorId] ?? 7;
  const sway = Math.sin(t * 0.12) * 6;
  return {
    position: [hq.x, y, hq.z + 8],
    // look north-west across the river: the open side of the skyline, with the project towers in view
    target: [hq.x - 150 + sway, y - 6 - y * 0.03, hq.z - 190],
    fov: 62,
  };
}

/** The visitor in the CEO cabin: at the desk, or standing at the window looking down on the city. */
export function cabinShot(hq: Hq, t: number): Shot {
  const floor = hq.cabinY;
  if (useNav.getState().cabinSpot === "window") {
    return {
      // right up at the glass, looking down over the downtown towers
      position: [hq.x + 4.2, floor + 1.7, hq.z - 7.3],
      target: [hq.x - 30 + Math.sin(t * 0.15) * 3, floor - 22, hq.z - 62],
      fov: 70,
    };
  }
  return {
    position: [hq.x - 0.6 + Math.sin(t * 0.2) * 0.12, floor + 1.7, hq.z + 6.4],
    target: [hq.x + Math.sin(t * 0.17) * 0.3, floor + 1.45, hq.z - 6],
    fov: 66,
  };
}
