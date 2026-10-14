"use client";

import { useEffect, useMemo, useState } from "react";
import { useExperience } from "@/store/experience";
import {
  PHASE_HOUR,
  getPhase,
  localHour,
  paletteForHour,
  sunAngles,
  type Palette,
  type Phase,
} from "@/lib/timeOfDay";

export interface TimeOfDay {
  hour: number;
  phase: Phase;
  palette: Palette;
  sun: ReturnType<typeof sunAngles>;
}

/** Follows the visitor's clock (updates each minute), or a manually picked phase. */
export function useTimeOfDay(): TimeOfDay {
  const timePref = useExperience((s) => s.timePref);
  const [clock, setClock] = useState<number>(23); // night until mounted, matches SSR

  useEffect(() => {
    setClock(localHour());
    const id = setInterval(() => setClock(localHour()), 60_000);
    return () => clearInterval(id);
  }, []);

  const hour = timePref === "auto" ? clock : PHASE_HOUR[timePref];

  return useMemo(
    () => ({
      hour,
      phase: getPhase(hour),
      palette: paletteForHour(hour),
      sun: sunAngles(hour),
    }),
    [hour],
  );
}
