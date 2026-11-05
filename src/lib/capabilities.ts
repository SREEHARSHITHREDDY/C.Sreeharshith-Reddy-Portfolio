export interface DeviceCapabilities {
  webgl: boolean;
  lowMemory: boolean;
  fewCores: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  smallScreen: boolean;
}

export type Mode = "2d" | "3d";

export function detectCapabilities(): DeviceCapabilities {
  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    webgl,
    lowMemory: typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2,
    fewCores: typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    smallScreen: window.innerWidth < 700,
  };
}

/** Default mode for a first visit. Visitors can always switch afterwards. */
export function recommendMode(c: DeviceCapabilities): Mode {
  if (!c.webgl || c.reducedMotion || c.lowMemory || c.fewCores) return "2d";
  return "3d";
}

/** Lighter 3D settings for phones and tablets. */
export function isLowPower(c: DeviceCapabilities): boolean {
  return c.coarsePointer || c.smallScreen;
}
