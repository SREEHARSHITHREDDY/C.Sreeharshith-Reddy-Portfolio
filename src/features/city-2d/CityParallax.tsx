"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { mulberry32 } from "@/lib/random";
import type { TimeOfDay } from "@/hooks/useTimeOfDay";
import { floorIndex } from "@/features/city/camera/poses";
import { floors, projects } from "@/data";
import { LANDMARK_SHAPES } from "@/features/city/plan/landmarks";
import { openLandmark, useNav } from "@/store/nav";
import { Cabin2D } from "./Cabin2D";
import { HQ_CENTER, HQ_TIERS, LANDMARK_W, LANDMARK_X, VIEW_H, VIEW_W, buildSkyline, windowsPath, type Building } from "./skyline";
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
  const view = useNav((st) => st.view);
  const inHq = view.kind === "hq";
  const alt = inHq ? floorIndex(view.floor) / (floors.length - 1) : 0;

  const hqZone: [number, number] = [HQ_CENTER - 62, HQ_CENTER + 62];
  const far = useMemo(() => buildSkyline(11, 50, 140, 12, 26), []);
  const mid = useMemo(() => buildSkyline(23, 80, 190, 14, 32), []);
  const near = useMemo(
    () => buildSkyline(37, 110, 240, 20, 44, [hqZone, ...LANDMARK_X.map((x): [number, number] => [x - LANDMARK_W / 2 - 4, x + LANDMARK_W / 2 + 4])]),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // the clickable towers: seven projects then LinkedIn, drawn as stepped silhouettes with a name pop-up above
  const towers = useMemo(() => {
    const list = [...projects.map((pr) => ({ id: pr.id, label: pr.title, accent: pr.accent })), { id: "linkedin", label: "LinkedIn", accent: "#2f8cf0" }];
    return list.slice(0, LANDMARK_X.length).map((it, i) => {
      const shape = LANDMARK_SHAPES[i % LANDMARK_SHAPES.length];
      const total = Math.min(shape.height * 0.95, 215);
      let acc = 0;
      const tiers: Building[] = shape.steps.map(([wf, hf]) => {
        acc += hf;
        const w = LANDMARK_W * wf;
        return { x: LANDMARK_X[i] - w / 2, w, h: total * acc };
      });
      return { ...it, cx: LANDMARK_X[i], top: total, tiers, win: windowsPath(tiers, 31 + i, 6) };
    });
  }, []);
  const hover = useNav((st) => st.hover);
  const setHover = useNav((st) => st.setHover);
  const openHq = useNav((st) => st.openHq);
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
    "--alt": alt,
  } as CSSProperties;

  return (
    <div ref={root} className="scene2d" data-hq={inHq} style={vars} aria-hidden="true">
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
          {towers.map((t) => (
            <g key={t.id} className="lm" style={{ ["--lm" as string]: t.accent }}>
              {t.tiers.map((r, i) => (
                <rect key={i} className="lm-body" x={r.x} y={VIEW_H - r.h} width={r.w} height={r.h} />
              ))}
              <path className="win" d={t.win} />
              <rect className="lm-cap" x={t.tiers[t.tiers.length - 1].x} y={VIEW_H - t.top} width={t.tiers[t.tiers.length - 1].w} height={2.4} />
              <rect className="lm-band" x={t.tiers[0].x} y={VIEW_H - t.tiers[0].h * 0.55} width={t.tiers[0].w} height={1.8} />
            </g>
          ))}
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

          {/* name pop-ups above every building (city view only), staggered so neighbours never overlap */}
          <g className={`s2d-tags${view.kind === "city" ? " is-on" : ""}`}>
            {[
              { id: "hq", label: "HQ · Enter", accent: "#f59e0b", cx: HQ_CENTER, y: VIEW_H - 338 - 22, go: () => openHq() },
              ...towers.map((t, i) => ({ id: t.id, label: t.label, accent: t.accent, cx: t.cx, y: VIEW_H - 236 - (i % 4) * 21, drop: VIEW_H - t.top - (VIEW_H - 236 - (i % 4) * 21), go: () => openLandmark(t.id) })),
            ].map((t) => {
              const w = t.label.length * 5.1 + 20;
              return (
                <g
                  key={t.id}
                  className={`s2d-tag${hover === t.id ? " is-hover" : ""}`}
                  style={{ ["--tag" as string]: t.accent }}
                  transform={`translate(${t.cx} ${t.y})`}
                  onClick={t.go}
                  onPointerEnter={() => setHover(t.id)}
                  onPointerLeave={() => setHover(null)}
                >
                  <rect x={-w / 2} y={-8} width={w} height={16} rx={8} />
                  <circle cx={-w / 2 + 8} cy={0} r={2.2} />
                  <text x={-w / 2 + 14} y={0.5}>{t.label}</text>
                  <path d={`M-3 8 L0 12 L3 8 Z`} />
                  <line x1={0} y1={12} x2={0} y2={"drop" in t ? t.drop : 20} />
                </g>
              );
            })}
          </g>
        </svg>

        <div className="s2d-haze" />
      </div>

      {inHq && view.floor === "cabin" && <Cabin2D />}

      {/* clouds the intro parts as the visitor scrolls */}
      <div className="s2d-intro">
        <i className="bank b1" />
        <i className="bank b2" />
        <i className="bank b3" />
      </div>
    </div>
  );
}
