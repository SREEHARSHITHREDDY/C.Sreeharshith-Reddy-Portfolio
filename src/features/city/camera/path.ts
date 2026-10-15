import { ALT_START, easeInOutCubic, clamp01, journeyAltitude, lerp, smoothstep } from "@/lib/journey";
import { riverX } from "../plan";

type V3 = readonly [number, number, number];

/**
 * Hero framing: a drone hovering high over the river, looking almost level
 * down its length so the skyline stands against the horizon glow.
 */
export function heroShot(hq: { x: number; z: number; height: number }) {
  const z0 = 300;
  return {
    position: [riverX(z0) - 40, 240, z0] as V3,
    target: [hq.x * 0.28, 150, -430] as V3,
    fov: 50,
  };
}

export interface Shot {
  position: V3;
  target: V3;
  fov: number;
}

/**
 * Camera for journey progress p (0..1): start high above the cloud sea
 * looking steeply down, drop through the cloud decks, and settle into the
 * hero shot. `t` adds a slow drift once the visitor has arrived.
 */
export function cameraAt(p: number, hq: { x: number; z: number; height: number }, t: number): Shot {
  const hero = heroShot(hq);
  const e = easeInOutCubic(clamp01(p));
  const y = journeyAltitude(p);
  const arrived = smoothstep(0.93, 1, p);

  const startPos: V3 = [hero.position[0] + 260, ALT_START, 820];
  const startTarget: V3 = [hero.target[0] * 0.5, -120, -160];

  const px = lerp(startPos[0], hero.position[0], e);
  const pz = lerp(startPos[2], hero.position[2], e);
  const driftX = Math.sin(t * 0.05) * 16 * arrived;
  const driftY = Math.sin(t * 0.037) * 4 * arrived;

  return {
    position: [px + driftX, y + driftY, pz],
    target: [
      lerp(startTarget[0], hero.target[0], e) + Math.sin(t * 0.04) * 10 * arrived,
      lerp(startTarget[1], hero.target[1], e),
      lerp(startTarget[2], hero.target[2], e),
    ],
    fov: lerp(66, hero.fov, e),
  };
}
