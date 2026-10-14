"use client";

import { useExperience } from "@/store/experience";
import type { Mode } from "@/lib/capabilities";

/** 2D / 3D switch. Works like a light/dark toggle: saved in the browser, auto on first visit. */
export function ModeToggle({ current, canUse3D }: { current: Mode; canUse3D: boolean }) {
  const setModePref = useExperience((s) => s.setModePref);
  const options: Mode[] = ["2d", "3d"];

  return (
    <div className="seg" role="group" aria-label="View mode">
      {options.map((m) => (
        <button
          key={m}
          type="button"
          className="seg-btn"
          aria-pressed={current === m}
          disabled={m === "3d" && !canUse3D}
          title={m === "3d" && !canUse3D ? "3D is not supported on this device" : undefined}
          onClick={() => setModePref(m)}
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
