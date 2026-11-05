"use client";

import { useEffect } from "react";
import type { Floor } from "@/data";
import { useNav } from "@/store/nav";
import { galleryFor } from "../galleryData";
import { FloorFrame } from "../FloorFrame";

const INTRO: Record<string, string> = {
  projects: "Walk the gallery. Each case holds a model of the project's building in the city.",
  experience: "Where I have built and led outside the classroom.",
  leadership: "Campus leadership, mentorship and volunteering.",
  achievements: "Hackathons, programs and national competitions.",
  certifications: "Verified credentials. Where a public link exists, you can check it yourself.",
};

/** Info card for a gallery floor: pager for the case the visitor is standing at, plus a list to jump around. */
export function GalleryPanel({ floor }: { floor: Floor }) {
  const entries = galleryFor(floor.id);
  const exhibit = useNav((s) => s.exhibit);
  const setExhibit = useNav((s) => s.setExhibit);
  const openProject = useNav((s) => s.openProject);
  const n = entries.length;
  const i = Math.min(exhibit, Math.max(0, n - 1));
  const e = entries[i];

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA"].includes(t.tagName)) return;
      if (ev.key === "ArrowRight") setExhibit(Math.min(n - 1, useNav.getState().exhibit + 1));
      if (ev.key === "ArrowLeft") setExhibit(Math.max(0, useNav.getState().exhibit - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n, setExhibit]);

  if (!e) return <FloorFrame floor={floor} intro={INTRO[floor.id]}><p className="panel-note">Nothing on display yet.</p></FloorFrame>;

  return (
    <FloorFrame floor={floor} intro={INTRO[floor.id]}>
      <div className="pager" role="group" aria-label="Exhibits">
        <button type="button" onClick={() => setExhibit(i - 1)} disabled={i === 0} aria-label="Previous exhibit">←</button>
        <span>{i + 1} / {n}</span>
        <button type="button" onClick={() => setExhibit(i + 1)} disabled={i >= n - 1} aria-label="Next exhibit">→</button>
      </div>

      <article className="exhibit" style={{ ["--card" as string]: e.accent }}>
        {e.meta && <p className="eyebrow" style={{ color: e.accent }}>{e.meta}</p>}
        <h3>{e.title}</h3>
        <p className="tl-meta">{e.sub}</p>
        <p className="panel-body">{e.body}</p>
        {e.bullets && <ul className="panel-list">{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
        {e.chips && <div className="chips">{e.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>}
        <div className="exhibit-actions">
          {e.projectId && <button type="button" className="btn-primary" onClick={() => openProject(e.projectId!)}>Visit building →</button>}
          {e.link && <a className="btn-ghost" href={e.link.href} target="_blank" rel="noopener noreferrer">{e.link.label} ↗</a>}
        </div>
      </article>

      <ol className="exhibit-list">
        {entries.map((x, k) => (
          <li key={x.id}>
            <button type="button" className={k === i ? "is-here" : ""} onClick={() => setExhibit(k)}>
              <i style={{ background: x.accent }} />
              {x.title}
            </button>
          </li>
        ))}
      </ol>
    </FloorFrame>
  );
}
