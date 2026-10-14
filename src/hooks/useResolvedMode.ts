"use client";

import { useEffect, useState } from "react";
import { useExperience } from "@/store/experience";
import {
  detectCapabilities,
  isLowPower,
  recommendMode,
  type DeviceCapabilities,
  type Mode,
} from "@/lib/capabilities";

export interface ResolvedExperience {
  ready: boolean;
  mode: Mode;
  lowPower: boolean;
  caps: DeviceCapabilities | null;
}

/** Resolves "auto" to a real mode once the device has been inspected. */
export function useResolvedMode(): ResolvedExperience {
  const modePref = useExperience((s) => s.modePref);
  const [caps, setCaps] = useState<DeviceCapabilities | null>(null);

  useEffect(() => {
    setCaps(detectCapabilities());
  }, []);

  if (!caps) return { ready: false, mode: "2d", lowPower: true, caps: null };

  let mode: Mode = modePref === "auto" ? recommendMode(caps) : modePref;
  // Never try 3D on a device with no WebGL, whatever was saved.
  if (!caps.webgl) mode = "2d";

  return { ready: true, mode, lowPower: isLowPower(caps), caps };
}
