"use client";

import { useExperience } from "@/store/experience";
import { PHASES, PHASE_LABEL, type TimePreference } from "@/lib/timeOfDay";

/** Auto (follows the visitor's clock) or a fixed mood. */
export function TimeSelect() {
  const timePref = useExperience((s) => s.timePref);
  const setTimePref = useExperience((s) => s.setTimePref);

  return (
    <label className="time-select">
      <span className="sr-only">Time of day</span>
      <select value={timePref} onChange={(e) => setTimePref(e.target.value as TimePreference)}>
        <option value="auto">Auto time</option>
        {PHASES.map((p) => (
          <option key={p} value={p}>
            {PHASE_LABEL[p]}
          </option>
        ))}
      </select>
    </label>
  );
}
