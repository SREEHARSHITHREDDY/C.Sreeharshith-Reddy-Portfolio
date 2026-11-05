"use client";

import { projects } from "@/data";
import { openLandmark, useNav } from "@/store/nav";
import "./directory.css";

/**
 * A bottom rail listing every building. It is the accessible, touch-friendly
 * way to move around, and the only way in 2D mode.
 */
export function Directory() {
  const view = useNav((s) => s.view);
  const hover = useNav((s) => s.hover);
  const setHover = useNav((s) => s.setHover);
  const openHq = useNav((s) => s.openHq);
  const active = view.kind === "project" ? view.id : view.kind === "linkedin" ? "linkedin" : null;

  const item = (id: string, label: string, accent: string, onClick: () => void, extra = "") => (
    <li key={id}>
      <button
        type="button"
        className={`dir-btn${active === id ? " is-active" : ""}${hover === id ? " is-hover" : ""}${extra}`}
        style={{ ["--dir" as string]: accent }}
        onClick={onClick}
        onPointerEnter={() => setHover(id)}
        onPointerLeave={() => setHover(null)}
        onFocus={() => setHover(id)}
        onBlur={() => setHover(null)}
      >
        <i />
        {label}
      </button>
    </li>
  );

  return (
    <nav className="directory" aria-label="Buildings">
      <ol>
        {item("hq", "HQ · Enter", "#f59e0b", () => openHq(), " dir-hq")}
        {projects.map((p) => item(p.id, p.title, p.accent, () => openLandmark(p.id)))}
        {item("linkedin", "LinkedIn", "#2f8cf0", () => openLandmark("linkedin"))}
      </ol>
    </nav>
  );
}
