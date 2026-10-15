/**
 * Time-of-day system. A palette is defined per keyframe hour and blended
 * smoothly in between, so the sky never jumps. Pure TypeScript: no Three.js,
 * so 2D mode uses it without downloading the 3D stack.
 */

export type Phase = "sunrise" | "day" | "sunset" | "dusk" | "night";
export type TimePreference = "auto" | Phase;

export interface Palette {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  sun: string;
  sunIntensity: number; // 0..1.3
  ambient: string;
  ambientIntensity: number; // 0..1
  fog: string;
  fogDensity: number; // 0..1, higher = thicker
  windowGlow: number; // 0..1
  stars: number; // 0..1
  cloud: string;
}

export const PHASES: Phase[] = ["sunrise", "day", "sunset", "dusk", "night"];

export const PHASE_LABEL: Record<Phase, string> = {
  sunrise: "Sunrise",
  day: "Day",
  sunset: "Sunset",
  dusk: "Dusk",
  night: "Night",
};

const night: Palette = {
  skyTop: "#05040c", skyMid: "#0b0820", skyBottom: "#1a1038",
  sun: "#aab8ff", sunIntensity: 0.2,
  ambient: "#3b2a7a", ambientIntensity: 0.28,
  fog: "#07060e", fogDensity: 0.55,
  windowGlow: 1, stars: 1, cloud: "#2a2350",
};
const sunrise: Palette = {
  skyTop: "#4b3a96", skyMid: "#e58fb0", skyBottom: "#ffc58a",
  sun: "#ffb45e", sunIntensity: 0.75,
  ambient: "#b88bd9", ambientIntensity: 0.45,
  fog: "#f2b8a0", fogDensity: 0.45,
  windowGlow: 0.5, stars: 0.1, cloud: "#ffd3b8",
};
const day: Palette = {
  skyTop: "#3a8fe0", skyMid: "#7fc3f2", skyBottom: "#d6efff",
  sun: "#fff4dc", sunIntensity: 1.25,
  ambient: "#cfe6ff", ambientIntensity: 0.8,
  fog: "#cfe3f5", fogDensity: 0.25,
  windowGlow: 0, stars: 0, cloud: "#ffffff",
};
const sunset: Palette = {
  skyTop: "#1d1a52", skyMid: "#a8467e", skyBottom: "#ff8a3a",
  sun: "#ffa24c", sunIntensity: 0.85,
  ambient: "#6c74c0", ambientIntensity: 0.42,
  fog: "#c8684c", fogDensity: 0.5,
  windowGlow: 0.78, stars: 0.05, cloud: "#ff9a68",
};
const dusk: Palette = {
  skyTop: "#130e36", skyMid: "#43287c", skyBottom: "#b9487a",
  sun: "#e4b4d8", sunIntensity: 0.3,
  ambient: "#4f3590", ambientIntensity: 0.3,
  fog: "#4a2a68", fogDensity: 0.5,
  windowGlow: 0.95, stars: 0.6, cloud: "#8a4a9e",
};

export const PHASE_PALETTE: Record<Phase, Palette> = { sunrise, day, sunset, dusk, night };

/** Keyframes across a 24h day. First and last entries wrap around. */
const KEYFRAMES: { hour: number; palette: Palette }[] = [
  { hour: 0, palette: night },
  { hour: 4.8, palette: night },
  { hour: 6, palette: sunrise },
  { hour: 8, palette: day },
  { hour: 16.5, palette: day },
  { hour: 18.5, palette: sunset },
  { hour: 19.9, palette: dusk },
  { hour: 21.5, palette: night },
  { hour: 24, palette: night },
];

/** Representative hour for each phase, used by the manual picker. */
export const PHASE_HOUR: Record<Phase, number> = {
  sunrise: 6,
  day: 12,
  sunset: 18.5,
  dusk: 19.9,
  night: 23,
};

export function getPhase(hour: number): Phase {
  const h = ((hour % 24) + 24) % 24;
  if (h >= 5 && h < 7) return "sunrise";
  if (h >= 7 && h < 17) return "day";
  if (h >= 17 && h < 19.25) return "sunset";
  if (h >= 19.25 && h < 21) return "dusk";
  return "night";
}

// ---- colour helpers -------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export function lerpPalette(a: Palette, b: Palette, t: number): Palette {
  return {
    skyTop: lerpHex(a.skyTop, b.skyTop, t),
    skyMid: lerpHex(a.skyMid, b.skyMid, t),
    skyBottom: lerpHex(a.skyBottom, b.skyBottom, t),
    sun: lerpHex(a.sun, b.sun, t),
    sunIntensity: lerp(a.sunIntensity, b.sunIntensity, t),
    ambient: lerpHex(a.ambient, b.ambient, t),
    ambientIntensity: lerp(a.ambientIntensity, b.ambientIntensity, t),
    fog: lerpHex(a.fog, b.fog, t),
    fogDensity: lerp(a.fogDensity, b.fogDensity, t),
    windowGlow: lerp(a.windowGlow, b.windowGlow, t),
    stars: lerp(a.stars, b.stars, t),
    cloud: lerpHex(a.cloud, b.cloud, t),
  };
}

/** Blended palette for any hour (0..24, fractional). */
export function paletteForHour(hour: number): Palette {
  const h = ((hour % 24) + 24) % 24;
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (h >= a.hour && h <= b.hour) {
      const span = b.hour - a.hour;
      const t = span === 0 ? 0 : smooth((h - a.hour) / span);
      return lerpPalette(a.palette, b.palette, t);
    }
  }
  return night;
}

/**
 * Sun (or moon at night) position as azimuth/elevation in degrees.
 * The sun is up from 05:30 to 19:00 (rises east, peaks at midday, sets west,
 * dipping a little below the horizon at both ends). After that a dim "moon"
 * follows the same arc until dawn, so there is never a hard jump at one hour.
 */
export function sunAngles(hour: number): { azimuth: number; elevation: number; isMoon: boolean } {
  const h = ((hour % 24) + 24) % 24;
  const isDay = h >= 5.5 && h < 19;
  const t = isDay ? (h - 5.5) / 13.5 : (((h - 19 + 24) % 24) / 10.5);
  return {
    azimuth: 90 + t * 180, // east -> west
    elevation: Math.sin(t * Math.PI) * 64 - 4,
    isMoon: !isDay,
  };
}

export function localHour(date = new Date()): number {
  return date.getHours() + date.getMinutes() / 60;
}
