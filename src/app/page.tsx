"use client";

import { useEffect } from "react";
import { site } from "@/data";
import { SceneHost } from "@/components/scene/SceneHost";
import { ControlBar } from "@/components/ui/ControlBar";
import { FloorPanel } from "@/components/ui/FloorPanel";
import { IntroOverlay } from "@/features/intro/IntroOverlay";
import { ScrollDriver } from "@/features/intro/ScrollDriver";
import { useJourneyLoop } from "@/features/intro/useJourneyLoop";
import { useResolvedMode } from "@/hooks/useResolvedMode";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { PHASE_LABEL } from "@/lib/timeOfDay";
import { useExperience } from "@/store/experience";
import { useJourney } from "@/store/journey";

export default function Home() {
  // saved visitor choices are restored after mount, so server and client render the same first frame
  useEffect(() => {
    useExperience.persist.rehydrate();
  }, []);

  useJourneyLoop();
  const entered = useJourney((s) => s.entered);
  const exp = useResolvedMode();
  const time = useTimeOfDay();

  return (
    <main className="stage" data-entered={entered}>
      <SceneHost exp={exp} time={time} />

      <ScrollDriver />
      <IntroOverlay palette={time.palette} />

      <header className="brand">
        <p className="eyebrow">Portfolio</p>
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
