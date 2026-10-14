"use client";

import { useEffect } from "react";
import { site } from "@/data";
import { SceneHost } from "@/components/scene/SceneHost";
import { ControlBar } from "@/components/ui/ControlBar";
import { FloorPanel } from "@/components/ui/FloorPanel";
import { useResolvedMode } from "@/hooks/useResolvedMode";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { PHASE_LABEL } from "@/lib/timeOfDay";
import { useExperience } from "@/store/experience";

export default function Home() {
  // saved visitor choices are restored after mount, so server and client render the same first frame
  useEffect(() => {
    useExperience.persist.rehydrate();
  }, []);

  const exp = useResolvedMode();
  const time = useTimeOfDay();

  return (
    <main className="stage">
      <SceneHost exp={exp} time={time} />

      <header className="brand">
        <p className="eyebrow">Step 0 · Foundation</p>
        <h1>{site.brand}</h1>
        <p className="meta">
          {exp.ready ? exp.mode.toUpperCase() : "…"} · {PHASE_LABEL[time.phase]}
        </p>
      </header>

      <ControlBar exp={exp} />
      <FloorPanel />
    </main>
  );
}
