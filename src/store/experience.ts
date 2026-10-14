"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Mode } from "@/lib/capabilities";
import type { TimePreference } from "@/lib/timeOfDay";

export type ModePreference = "auto" | Mode;

interface ExperienceState {
  modePref: ModePreference;
  timePref: TimePreference;
  setModePref: (m: ModePreference) => void;
  setTimePref: (t: TimePreference) => void;
}

/**
 * Visitor choices, saved in the browser (like a light/dark toggle).
 * "auto" means: pick a sensible default for this device / the visitor's clock.
 */
export const useExperience = create<ExperienceState>()(
  persist(
    (set) => ({
      modePref: "auto",
      timePref: "auto",
      setModePref: (modePref) => set({ modePref }),
      setTimePref: (timePref) => set({ timePref }),
    }),
    {
      name: "empire-experience",
      skipHydration: true, // rehydrated after mount to avoid SSR mismatch
      partialize: (s) => ({ modePref: s.modePref, timePref: s.timePref }),
    },
  ),
);
