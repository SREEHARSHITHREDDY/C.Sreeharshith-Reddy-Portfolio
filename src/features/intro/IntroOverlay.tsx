"use client";

import { useEffect } from "react";
import { site } from "@/data";
import type { Palette } from "@/lib/timeOfDay";
import { scrollJourneyTo, useJourney } from "@/store/journey";
import "./intro.css";

/** Text and white-out layered over the scene during the intro. Driven entirely by CSS variables. */
export function IntroOverlay({ palette }: { palette: Palette }) {
  const entered = useJourney((s) => s.entered);

  // the cloud white-out takes the colour of the current sky's clouds
  useEffect(() => {
    document.documentElement.style.setProperty("--mist-color", palette.cloud);
  }, [palette.cloud]);

  return (
    <div className="intro">
      <div className="intro-mist" aria-hidden="true" />

      <div className="intro-prompt">
        <p className="intro-eyebrow">Portfolio</p>
        <h2 className="intro-title">Scroll to enter</h2>
        <span className="scroll-cue" aria-hidden="true">
          <i />
        </span>
        <button type="button" className="intro-link" onClick={() => scrollJourneyTo(1)}>
          Skip intro
        </button>
      </div>

      <div className="intro-welcome" aria-live="polite">
        <p className="intro-eyebrow">Welcome to our city</p>
        <h2 className="intro-title big">{site.brand}</h2>
      </div>

      {entered && (
        <button type="button" className="intro-replay" onClick={() => scrollJourneyTo(0)}>
          Replay intro
        </button>
      )}
    </div>
  );
}
