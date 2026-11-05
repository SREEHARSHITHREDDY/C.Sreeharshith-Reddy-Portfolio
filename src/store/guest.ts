"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GuestState {
  name: string | null;
  setName: (raw: string) => void;
  forget: () => void;
}

/** Strip anything that is not a plain name and cap the length. */
export const cleanName = (raw: string) => raw.replace(/[<>{}\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);

/** The visitor's name, given to the receptionist. Kept only in this browser. */
export const useGuest = create<GuestState>()(
  persist(
    (set) => ({
      name: null,
      setName: (raw) => set({ name: cleanName(raw) || null }),
      forget: () => set({ name: null }),
    }),
    { name: "empire-guest", skipHydration: true },
  ),
);
