"use client";

import { create } from "zustand";

/**
 * Journey progress is read every frame (3D camera, CSS variables), so it lives
 * in a plain mutable object. React only hears about the coarse "entered" flag.
 */
export const journey = {
  /** Where the scroll position says we should be (0..1). */
  target: 0,
  /** Smoothed value actually used for rendering. */
  value: 0,
  /** The scroll container, so buttons can skip / replay. */
  scroller: null as HTMLDivElement | null,
};

interface JourneyState {
  entered: boolean;
  setEntered: (v: boolean) => void;
}

export const useJourney = create<JourneyState>((set) => ({
  entered: false,
  setEntered: (entered) => set({ entered }),
}));

/** Smoothly scroll the intro to a given progress (0 = replay, 1 = skip). */
export function scrollJourneyTo(p: number) {
  const el = journey.scroller;
  if (!el) return;
  const max = el.scrollHeight - el.clientHeight;
  el.scrollTo({ top: max * p, behavior: "smooth" });
}
