import { floors, projects } from "@/data";

/** Step-0 scaffold: shows the HQ floor plan so the structure can be checked before the real UI lands. */
export function FloorPanel() {
  return (
    <aside className="floor-panel" aria-label="HQ floor plan">
      <h2>HQ floor plan</h2>
      <ol>
        {[...floors].reverse().map((f) => (
          <li key={f.id}>
            <span className="lvl">{f.level}</span>
            <span className="nm">{f.name}</span>
            <span className={`st st-${f.status}`}>{f.status}</span>
          </li>
        ))}
      </ol>
      <p className="muted">{projects.length} project buildings planned</p>
    </aside>
  );
}
