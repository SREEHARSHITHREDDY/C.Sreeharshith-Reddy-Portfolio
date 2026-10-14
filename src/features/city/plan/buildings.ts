import { mulberry32 } from "@/lib/random";
import { BLOCK, DOWNTOWN, GRID, PITCH, RIVER } from "../constants";
import { inRiverCorridor, riverX } from "./river";
import { STYLE, type BuildingPlan, type Beacon, type ScreenSpec, type Tier } from "./types";

type Rnd = () => number;
const range = (r: Rnd, a: number, b: number) => a + r() * (b - a);

const FACADE: Record<number, (r: Rnd) => [number, number, number]> = {
  [STYLE.GLASS]: (r) => [range(r, 0.5, 0.62), range(r, 0.6, 0.72), range(r, 0.7, 0.85)],
  [STYLE.CONCRETE]: (r) => {
    const v = range(r, 0.2, 0.34);
    return [v, v * 0.97, v * 0.92];
  },
  [STYLE.BRICK]: (r) => [range(r, 0.2, 0.3), range(r, 0.09, 0.13), range(r, 0.06, 0.09)],
  [STYLE.FINS]: (r) => {
    const v = range(r, 0.05, 0.09);
    return [v, v, v * 1.15];
  },
  [STYLE.HQ]: () => [0.62, 0.7, 0.85],
};

/** Place the HQ on the first valid land block right of the river, a few blocks into the distance. */
function hqBlock() {
  const gz = -4;
  const cz = gz * PITCH;
  let gx = Math.ceil((riverX(cz) + RIVER.halfWidth + RIVER.quay + BLOCK / 2 + 4) / PITCH);
  while (inRiverCorridor(gx * PITCH, cz, BLOCK / 2 - 8)) gx++;
  return { gx, gz, x: gx * PITCH, z: cz };
}

export function planBuildings(): BuildingPlan {
  const rnd = mulberry32(20261014);
  const tiers: Tier[] = [];
  const beacons: Beacon[] = [];
  const screens: ScreenSpec[] = [];
  const hq = hqBlock();

  const tint = (style: number) => FACADE[style](rnd);

  function addTier(x: number, y: number, z: number, w: number, h: number, d: number, style: number): Tier {
    const t: Tier = { x, y, z, w, h, d, style, seed: rnd() * 100, color: tint(style) };
    tiers.push(t);
    return t;
  }

  function addBuilding(x: number, z: number, w: number, d: number, h: number, core: number) {
    const tall = h > 45;
    const style = h > 80
      ? rnd() < 0.62 ? STYLE.GLASS : rnd() < 0.7 ? STYLE.FINS : STYLE.CONCRETE
      : h > 38
        ? rnd() < 0.4 ? STYLE.GLASS : STYLE.CONCRETE
        : rnd() < 0.5 ? STYLE.BRICK : STYLE.CONCRETE;

    if (!tall) {
      addTier(x, 0, z, w, h, d, style);
      if (rnd() < 0.7) addTier(x + range(rnd, -w * 0.2, w * 0.2), h, z + range(rnd, -d * 0.2, d * 0.2), w * range(rnd, 0.25, 0.45), range(rnd, 2.5, 5), d * range(rnd, 0.25, 0.45), STYLE.CONCRETE);
      return;
    }

    const podiumH = Math.min(h * 0.3, range(rnd, 9, 20));
    addTier(x, 0, z, w, podiumH, d, rnd() < 0.5 ? STYLE.CONCRETE : style);
    const ins = range(rnd, 0.06, 0.16);
    const sw = w * (1 - ins * 2);
    const sd = d * (1 - ins * 2);
    let top = podiumH;
    const shaftH = (h - podiumH) * (h > 120 ? 0.62 : 1);
    addTier(x, top, z, sw, shaftH, sd, style);
    top += shaftH;
    let tw = sw;
    let td = sd;
    if (h > 120) {
      tw *= 0.72;
      td *= 0.72;
      const h2 = (h - podiumH) * 0.3;
      addTier(x, top, z, tw, h2, td, style);
      top += h2;
    }
    // crown, antenna and aviation light
    if (rnd() < 0.55) {
      const ch = range(rnd, 5, 12);
      addTier(x, top, z, tw * 0.55, ch, td * 0.55, STYLE.CONCRETE);
      top += ch;
    }
    if (h > 110 && rnd() < 0.6) {
      const ah = range(rnd, 18, 46);
      addTier(x, top, z, 0.9, ah, 0.9, STYLE.FINS);
      top += ah;
    }
    if (h > 95) beacons.push({ x, y: top + 0.6, z, size: 1.3 });

    // LED screens on the camera-facing and side facades of the biggest towers
    if (h > 90 && core > 0.25 && rnd() < 0.22) {
      const sh = Math.min(h * 0.22, 34);
      const sy = podiumH + range(rnd, 10, Math.max(12, shaftH * 0.55));
      const side = rnd();
      const base = { y: sy, w: Math.min(sw * 0.7, 30), h: sh, hue: rnd(), seed: rnd() * 100 };
      if (side < 0.55) screens.push({ ...base, x, z: z + sd / 2 + 0.3, rotY: 0 });
      else if (side < 0.78) screens.push({ ...base, x: x + sw / 2 + 0.3, z, rotY: Math.PI / 2, w: Math.min(sd * 0.7, 30) });
      else screens.push({ ...base, x: x - sw / 2 - 0.3, z, rotY: -Math.PI / 2, w: Math.min(sd * 0.7, 30) });
    }
  }

  for (let gx = GRID.x0; gx <= GRID.x1; gx++) {
    for (let gz = GRID.z0; gz <= GRID.z1; gz++) {
      const cx = gx * PITCH;
      const cz = gz * PITCH;
      if (inRiverCorridor(cx, cz, BLOCK / 2 - 8)) continue;
      if (gx === hq.gx && gz === hq.gz) continue;

      const dd = Math.hypot((cx - riverX(DOWNTOWN.z)) * 0.85, cz - DOWNTOWN.z);
      const core = Math.exp(-(dd * dd) / (2 * DOWNTOWN.spread ** 2));
      if (core < 0.18 && rnd() < 0.08) continue; // parks and empty plots on the outskirts

      const baseH = 18 + 210 * core * core + 40 * core;
      const mode = rnd();
      const lots =
        core > 0.45 && mode < 0.55 ? 1 : mode < 0.78 ? 2 : 4;
      const m = 3;
      const half = BLOCK / 2 - m;

      const place = (lx: number, lz: number, lw: number, ld: number) => {
        let h = baseH * range(rnd, 0.45, 1.25);
        if (core > 0.3 && rnd() < 0.08) h *= 1.5;
        h = Math.max(14, Math.min(h, core > 0.15 ? 260 : 75));
        addBuilding(cx + lx, cz + lz, lw, ld, h, core);
      };

      if (lots === 1) place(0, 0, half * 2, half * 2);
      else if (lots === 2) {
        const alongX = rnd() < 0.5;
        const g = 2;
        const s = (half * 2 - g) / 2;
        if (alongX) {
          place(-(s + g) / 2, 0, s, half * 2);
          place((s + g) / 2, 0, s, half * 2);
        } else {
          place(0, -(s + g) / 2, half * 2, s);
          place(0, (s + g) / 2, half * 2, s);
        }
      } else {
        const g = 2;
        const s = (half * 2 - g) / 2;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) place(sx * (s + g) / 2, sz * (s + g) / 2, s, s);
      }
    }
  }

  // ---- HQ tower -----------------------------------------------------------
  const { x: hx, z: hz } = hq;
  const push = (y: number, w: number, h: number, d: number, style: number) => {
    const t = addTier(hx, y, hz, w, h, d, style);
    t.color = FACADE[style](rnd);
    return y + h;
  };
  let y = push(0, 56, 24, 56, STYLE.CONCRETE);
  y = push(y, 40, 130, 40, STYLE.HQ);
  y = push(y, 31, 80, 31, STYLE.HQ);
  y = push(y, 22, 46, 22, STYLE.HQ);
  y = push(y, 12, 24, 12, STYLE.HQ);
  y = push(y, 2.2, 56, 2.2, STYLE.FINS);
  beacons.push({ x: hx, y: y + 1, z: hz, size: 2.2 });

  return { tiers, beacons, screens, hq: { x: hx, z: hz, height: y } };
}
