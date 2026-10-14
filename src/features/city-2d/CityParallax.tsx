"use client";


import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { mulberry32 } from "@/lib/random";
import "./parallax.css";
import type { TimeOfDay } from "@/hooks/useTimeOfDay";

interface Building {
  x: number;
  w: number;
  h: number;
}

function buildSkyline(seed: number, minH: number, maxH: number, minW: number, maxW: number, width = 1200): Building[] {
  const rnd = mulberry32(seed);
  const out: Building[] = [];
  let x = -20;
  while (x < width + 20) {
    const w = minW + rnd() * (maxW - minW);
    out.push({ x, w, h: minH + rnd() * (maxH - minH) });
    x += w + 2 + rnd() * 6;
  }
  return out;
}

function windowsPath(buildings: Building[], seed: number, baseY: number, step = 9): string {
  const rnd = mulberry32(seed);
  let d = "";
  for (const b of buildings) {
    for (let wx = b.x + 5; wx < b.x + b.w - 6; wx += step) {
      for (let wy = baseY - b.h + 8; wy < baseY - 6; wy += step + 2) {
        if (rnd() > 0.45) d += `M${wx.toFixed(1)} ${wy.toFixed(1)}h3.2v4.2h-3.2z`;
      }
    }
  }
  return d;
}

const H = 300;
const stars = (() => {
  const rnd = mulberry32(7);
  return Array.from({ length: 70 }, () => ({
    left: rnd() * 100,
    top: rnd() * 55,
    size: 1 + rnd() * 1.6,
    delay: rnd() * 4,
  }));
})();

/** Layered parallax skyline. Lightweight: no WebGL, no images, pure CSS + SVG. */
export function CityParallax({ time }: { time: TimeOfDay }) {
  const root = useRef<HTMLDivElement>(null);
  const { palette: p, sun } = time;

  const far = useMemo(() => buildSkyline(11, 60, 150, 26, 54), []);
  const mid = useMemo(() => buildSkyline(23, 90, 200, 30, 62), []);
  const near = useMemo(() => buildSkyline(37, 120, 250, 38, 76), []);
  const midWin = useMemo(() => windowsPath(mid, 5, H), [mid]);
  const nearWin = useMemo(() => windowsPath(near, 9, H, 11), [near]);

  // Pointer parallax without re-rendering React.
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

  const sunX = ((sun.azimuth - 90) / 180) * 100;
  const sunY = 78 - sun.elevation * 0.95;

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
      <div className="s2d-stars">
        {stars.map((s, i) => (
          <i key={i} style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
        ))}
      </div>

      <div
        className="s2d-sun"
        style={{ left: `${sunX}%`, top: `${sunY}%`, opacity: sun.isMoon ? 0.55 : 1 }}
      />

      <div className="s2d-clouds">
        <span style={{ top: "18%", width: 360, animationDuration: "160s" }} />
        <span style={{ top: "30%", width: 520, animationDuration: "220s", animationDelay: "-90s" }} />
        <span style={{ top: "12%", width: 280, animationDuration: "190s", animationDelay: "-40s" }} />
      </div>

      <svg className="s2d-layer far" viewBox={`0 0 1200 ${H}`} preserveAspectRatio="xMidYMax slice">
        {far.map((b, i) => (
          <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} />
        ))}
      </svg>
      <svg className="s2d-layer mid" viewBox={`0 0 1200 ${H}`} preserveAspectRatio="xMidYMax slice">
        {mid.map((b, i) => (
          <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} />
        ))}
        <path className="win" d={midWin} />
      </svg>
      <svg className="s2d-layer near" viewBox={`0 0 1200 ${H}`} preserveAspectRatio="xMidYMax slice">
        {near.map((b, i) => (
          <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} />
        ))}
        {/* HQ tower: tallest, gold crown */}
        <rect x="560" y={H - 285} width="80" height="285" />
        <rect className="crown" x="560" y={H - 285} width="80" height="4" />
        <rect className="crown" x="596" y={H - 305} width="8" height="20" />
        <path className="win" d={nearWin} />
      </svg>

      <div className="s2d-haze" />
    </div>
  );
}
