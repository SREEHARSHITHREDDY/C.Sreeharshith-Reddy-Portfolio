"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { mulberry32 } from "@/lib/random";
import type { TimeOfDay } from "@/hooks/useTimeOfDay";
import { HQ_CENTER, HQ_TIERS, VIEW_H, VIEW_W, buildSkyline, windowsPath } from "./skyline";
import "./parallax.css";

const stars = (() => {
  const rnd = mulberry32(7);
  return Array.from({ length: 90 }, () => ({ left: rnd() * 100, top: rnd() * 55, size: 1 + rnd() * 1.5, delay: rnd() * 4 }));
})();

/**
 * Layered parallax skyline. Lightweight: no WebGL, no images, pure CSS + SVG.
 * The intro (clouds parting, skyline rising) is driven by the --journey CSS
 * variable that features/intro publishes, so 2D tells the same story as 3D.
 */
export function CityParallax({ time }: { time: TimeOfDay }) {
  const root = useRef<HTMLDivElement>(null);
  const { palette: p, sun } = time;

  const hqZone: [number, number] = [HQ_CENTER - 62, HQ_CENTER + 62];
  const far = useMemo(() => buildSkyline(11, 50, 140, 12, 26), []);
  const mid = useMemo(() => buildSkyline(23, 80, 190, 14, 32), []);
  const near = useMemo(() => buildSkyline(37, 110, 240, 20, 44, hqZone), []); // eslint-disable-line react-hooks/exhaustive-deps
  const midWin = useMemo(() => windowsPath(mid, 5, 7), [mid]);
  const nearWin = useMemo(() => windowsPath(near, 9, 9), [near]);
  const hqWin = useMemo(() => windowsPath(HQ_TIERS.map((t) => ({ ...t, x: t.x + 1, w: t.w - 2 })), 3, 8), []);

  // pointer parallax without re-rendering React
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--px", String(e.clientX / window.innerWidth - 0.5));
      el.style.setProperty("--py", String(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // same side as 3D: the sun rises on the right and sets on the left, just above the far skyline
  const arc = (sun.azimuth - 90) / 180;
  const sunX = 85 - arc * 70;
  const sunY = 60 - sun.elevation * 0.85;

  const vars = {
    "--sky-top": p.skyTop,
    "--sky-mid": p.skyMid,
    "--sky-bottom": p.skyBottom,
    "--sun": p.sun,
    "--fog": p.fog,
    "--cloud": p.cloud,
    "--glow": p.windowGlow,
    "--stars": p.stars,
  } as CSSProperties;

  return (
    <div ref={root} className="scene2d" style={vars} aria-hidden="true">
      <div className="s2d-world">
        <div className="s2d-stars">
          {stars.map((s, i) => (
            <i key={i} style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
          ))}
        </div>

        <div className="s2d-sun" style={{ left: `${sunX}%`, top: `${sunY}%`, opacity: sun.isMoon ? 0.7 : 1 }} />

        <div className="s2d-clouds">
          <span style={{ top: "14%", width: 380, animationDuration: "170s" }} />
          <span style={{ top: "27%", width: 560, animationDuration: "230s", animationDelay: "-90s" }} />
          <span style={{ top: "9%", width: 300, animationDuration: "200s", animationDelay: "-40s" }} />
        </div>

        <svg className="s2d-layer far" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMax slice">
          {far.map((b, i) => (
            <rect key={i} x={b.x} y={VIEW_H - b.h} width={b.w} height={b.h} />
          ))}
        </svg>
        <svg className="s2d-layer mid" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMax slice">
          {mid.map((b, i) => (
            <rect key={i} x={b.x} y={VIEW_H - b.h} width={b.w} height={b.h} />
          ))}
          <path className="win" d={midWin} />
        </svg>
        <svg className="s2d-layer near" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMax slice">
          {near.map((b, i) => (
            <rect key={i} x={b.x} y={VIEW_H - b.h} width={b.w} height={b.h} />
          ))}
          <path className="win" d={nearWin} />
          {/* HQ tower */}
          {HQ_TIERS.map((t, i) => (
            <rect key={i} className="hq" x={t.x} y={VIEW_H - t.h} width={t.w} height={t.h} />
          ))}
          <path className="win hq-win" d={hqWin} />
          {[70, 118, 168, 214].map((y) => (
            <rect key={y} className="crown" x={HQ_CENTER - 34} y={VIEW_H - y} width={68} height={1.6} />
          ))}
          <rect className="crown" x={HQ_CENTER - 1.2} y={VIEW_H - 336} width={2.4} height={40} />
          <circle className="beacon" cx={HQ_CENTER} cy={VIEW_H - 338} r={2.6} />
        </svg>

        <div className="s2d-haze" />
      </div>

      {/* clouds the intro parts as the visitor scrolls */}
      <div className="s2d-intro">
        <i className="bank b1" />
        <i className="bank b2" />
        <i className="bank b3" />
      </div>
    </div>
  );
}
