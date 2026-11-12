"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/store/journey";

/**
 * A tall invisible scroller sitting above the scene. Native scrolling means
 * wheel, touch, keyboard and scrollbar all work, and progress is just
 * scrollTop / maxScroll.
 */
export function ScrollDriver() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    journey.scroller = el;
    el.focus({ preventScroll: true });
    if (journey.value >= 1) el.scrollTop = el.scrollHeight; // reduced motion: start already inside
    return () => {
      if (journey.scroller === el) journey.scroller = null;
    };
  }, []);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    journey.target = max > 0 ? el.scrollTop / max : 0;
  };

  return (
    <div
      ref={ref}
      className="scroller"
      tabIndex={0}
      role="region"
      aria-label="Scroll down to enter the city"
      onScroll={onScroll}
    >
      <div className="scroller-spacer" />
    </div>
  );
}
