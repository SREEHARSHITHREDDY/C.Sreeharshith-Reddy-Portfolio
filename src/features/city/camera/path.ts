import { riverX } from "../plan";

/** Hero framing: high above the river looking down its length toward the sunset horizon. */
export function heroShot(hq: { x: number; z: number; height: number }) {
  const z0 = 330;
  return {
    position: [riverX(z0) - 30, 330, z0] as const,
    target: [hq.x * 0.3, 40, -400] as const,
    fov: 50,
  };
}
