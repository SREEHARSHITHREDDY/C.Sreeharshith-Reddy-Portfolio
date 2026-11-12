"use client";

import { create } from "zustand";

export type View =
  | { kind: "city" }
  | { kind: "project"; id: string }
  | { kind: "linkedin" }
  | { kind: "hq"; floor: string };

interface NavState {
  view: View;
  hover: string | null;
  /** Where the visitor stands in the CEO cabin. */
  /** Which exhibit the visitor is standing at on a gallery floor. */
  exhibit: number;
  setExhibit: (i: number) => void;
  cabinSpot: "desk" | "window";
  setCabinSpot: (s: "desk" | "window") => void;
  goCity: () => void;
  openProject: (id: string) => void;
  openLinkedIn: () => void;
  /** Enter the HQ (lobby by default) or move the elevator to another floor. */
  openHq: (floor?: string) => void;
  setHover: (id: string | null) => void;
}

/** Where the visitor is in the city. Shared by the 3D camera, the 2D scene and every panel. */
export const useNav = create<NavState>((set) => ({
  view: { kind: "city" },
  hover: null,
  exhibit: 0,
  setExhibit: (exhibit) => set({ exhibit: Math.max(0, exhibit) }),
  cabinSpot: "desk",
  setCabinSpot: (cabinSpot) => set({ cabinSpot }),
  goCity: () => set({ view: { kind: "city" } }),
  openProject: (id) => set({ view: { kind: "project", id } }),
  openLinkedIn: () => set({ view: { kind: "linkedin" } }),
  openHq: (floor = "lobby") =>
    set((st) => ({ view: { kind: "hq", floor }, cabinSpot: "desk", exhibit: st.view.kind === "hq" && st.view.floor === floor ? st.exhibit : 0 })),
  setHover: (hover) => set({ hover }),
}));

/** Open a landmark by id ("linkedin" or a project id). */
export function openLandmark(id: string) {
  const { openLinkedIn, openProject } = useNav.getState();
  if (id === "linkedin") openLinkedIn();
  else openProject(id);
}
