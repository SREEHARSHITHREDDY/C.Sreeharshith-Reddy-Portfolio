"use client";

import { useEffect } from "react";
import { journeyVars } from "@/lib/journey";
import { journey, useJourney } from "@/store/journey";

/**
 * Damps scroll progress and publishes it as CSS variables on <html>:
 * --journey, --j-prompt, --j-welcome, --j-mist, --j-ui.
 * CSS (and the 3D camera) read these every frame without re-rendering React.
 */
export function useJourneyLoop() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // no cinematic descent: arrive straight in the city
      journey.target = 1;
      journey.value = 1;
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt * 4.5);
      journey.value += (journey.target - journey.value) * k;
      if (Math.abs(journey.target - journey.value) < 0.0005) journey.value = journey.target;

      const p = journey.value;
      const v = journeyVars(p);
      root.style.setProperty("--journey", p.toFixed(4));
      root.style.setProperty("--j-prompt", v.prompt.toFixed(3));
      root.style.setProperty("--j-welcome", v.welcome.toFixed(3));
      root.style.setProperty("--j-mist", v.mist.toFixed(3));
      root.style.setProperty("--j-ui", v.ui.toFixed(3));

      const st = useJourney.getState();
      if (!st.entered && p > 0.985) st.setEntered(true);
      else if (st.entered && p < 0.95) st.setEntered(false);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
}
