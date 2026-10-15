import { mulberry32 } from "@/lib/random";

export interface Building {
  x: number;
  w: number;
  h: number;
}

/** Skyline coordinate space: 1600 wide, 300 tall. The HQ tower stands at its centre. */
export const VIEW_W = 1600;
export const VIEW_H = 300;
export const HQ_CENTER = VIEW_W / 2;

export function buildSkyline(
  seed: number,
  minH: number,
  maxH: number,
  minW: number,
  maxW: number,
  exclude?: [number, number],
): Building[] {
  const rnd = mulberry32(seed);
  const out: Building[] = [];
  let x = -20;
  while (x < VIEW_W + 20) {
    const w = minW + rnd() * (maxW - minW);
    const b = { x, w, h: minH + rnd() * (maxH - minH) };
    if (!exclude || b.x + b.w < exclude[0] || b.x > exclude[1]) out.push(b);
    x += w + 1.5 + rnd() * 5;
  }
  return out;
}

/** One SVG path of small lit windows for a set of buildings (all windows share one fill, so it stays cheap). */
export function windowsPath(buildings: Building[], seed: number, step: number): string {
  const rnd = mulberry32(seed);
  let d = "";
  for (const b of buildings) {
    for (let wx = b.x + 4; wx < b.x + b.w - 5; wx += step) {
      for (let wy = VIEW_H - b.h + 7; wy < VIEW_H - 5; wy += step + 2) {
        if (rnd() > 0.42) d += `M${wx.toFixed(1)} ${wy.toFixed(1)}h2.6v3.6h-2.6z`;
      }
    }
  }
  return d;
}

/** The HQ tower: stepped tiers, gold bands and a spire. */
export const HQ_TIERS = [
  { x: HQ_CENTER - 46, w: 92, h: 40 },
  { x: HQ_CENTER - 34, w: 68, h: 205 },
  { x: HQ_CENTER - 24, w: 48, h: 252 },
  { x: HQ_CENTER - 15, w: 30, h: 282 },
  { x: HQ_CENTER - 7, w: 14, h: 298 },
] as const;
