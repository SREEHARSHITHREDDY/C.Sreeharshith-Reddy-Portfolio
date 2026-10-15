"use client";

import { useEffect } from "react";
import { site } from "@/data";
import { SceneHost } from "@/components/scene/SceneHost";
import { ControlBar } from "@/components/ui/ControlBar";
import { HqShell, useEscapeToCity } from "@/features/hq/HqShell";
import { Directory } from "@/features/nav/Directory";
import { LinkedInPanel } from "@/features/panels/LinkedInPanel";
import { ProjectPanel } from "@/features/panels/ProjectPanel";
import { IntroOverlay } from "@/features/intro/IntroOverlay";
import { ScrollDriver } from "@/features/intro/ScrollDriver";
import { useJourneyLoop } from "@/features/intro/useJourneyLoop";
import { useResolvedMode } from "@/hooks/useResolvedMode";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { PHASE_LABEL } from "@/lib/timeOfDay";
import { useExperience } from "@/store/experience";
import { useJourney } from "@/store/journey";
import { useNav } from "@/store/nav";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  // saved visitor choices are restored after mount, so server and client render the same first frame
  useEffect(() => {
    useExperience.persist.rehydrate();
  }, []);

  useJourneyLoop();
  useEscapeToCity();
  const view = useNav((s) => s.view);
  const entered = useJourney((s) => s.entered);
  const exp = useResolvedMode();
  const time = useTimeOfDay();

  return (
    <main className="stage" data-entered={entered} data-view={view.kind}>
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
      {entered && view.kind !== "hq" && <Directory />}
      <AnimatePresence>
        {entered && view.kind === "project" && <ProjectPanel key={view.id} id={view.id} />}
        {entered && view.kind === "linkedin" && <LinkedInPanel key="linkedin" />}
      </AnimatePresence>
      {entered && <HqShell />}
    </main>
  );
}
