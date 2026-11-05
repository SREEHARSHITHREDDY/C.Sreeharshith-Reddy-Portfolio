import { floors } from "@/data";
import { galleryFor } from "@/features/hq/galleryData";
import { useNav } from "@/store/nav";
import { CASE_Z, HALLS, WALK_Z, exhibitX, hallCentreZ } from "../interiors/layout";
import type { Landmark } from "../plan";
import type { Shot } from "./path";

type Hq = { x: number; z: number; height: number; cabinY: number };

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

/** Camera inside the HQ at a given floor: lobby, lounge or gallery corridor (standing at the current exhibit). */
export function hqFloorShot(hq: Hq, floorId: string, t: number): Shot {
  if (floorId === "cabin") return cabinShot(hq, t);
  const spec = HALLS[floorId];
  if (!spec) return { position: [hq.x, 7, hq.z + 8], target: [hq.x - 150, 4, hq.z - 190], fov: 62 };
  const zc = hq.z + hallCentreZ(spec);
  const eye = spec.y + 1.65;
  const sway = Math.sin(t * 0.3) * 0.08;

  if (spec.kind === "lobby") {
    return { position: [hq.x - 3 + sway, eye, zc + 9], target: [hq.x + 3.5, spec.y + 1.6, zc - 6.5], fov: 62 };
  }
  if (spec.kind === "lounge") {
    return { position: [hq.x - 15 + sway, eye, zc + 4.6], target: [hq.x + 1, spec.y + 1.2, zc - 3], fov: 66 };
  }
  const items = galleryFor(floorId).length || 1;
  const i = Math.min(useNav.getState().exhibit, items - 1);
  const x = hq.x + exhibitX(i, items, spec.L);
  return {
    // stand back a little and look just right of the case, so it sits in the open left of the screen
    position: [x - 0.8 + sway, eye, zc + WALK_Z],
    target: [x + 1.7, spec.y + 1.45, zc + CASE_Z],
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
