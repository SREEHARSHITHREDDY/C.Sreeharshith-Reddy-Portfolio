"use client";

import { projects, type Floor } from "@/data";
import { useNav } from "@/store/nav";
import { FloorFrame } from "../FloorFrame";

export function ProjectsFloor({ floor }: { floor: Floor }) {
  const openProject = useNav((s) => s.openProject);
  return (
    <FloorFrame floor={floor} intro="Each project stands as its own building in the city. Visit one to see the details and live repository activity.">
      <ul className="proj-grid">
        {projects.map((p) => (
          <li key={p.id} style={{ ["--card" as string]: p.accent }}>
            <p className="eyebrow">{p.category} · {p.year}</p>
            <h3>{p.title}</h3>
            <p>{p.tagline}</p>
            <button type="button" className="btn-ghost" onClick={() => openProject(p.id)}>Visit building →</button>
          </li>
        ))}
      </ul>
    </FloorFrame>
  );
}
