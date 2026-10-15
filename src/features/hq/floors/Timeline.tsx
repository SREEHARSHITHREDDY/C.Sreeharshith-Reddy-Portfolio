import type { Floor, Role } from "@/data";
import { FloorFrame } from "../FloorFrame";

export function Timeline({ floor, roles, intro }: { floor: Floor; roles: Role[]; intro: string }) {
  return (
    <FloorFrame floor={floor} intro={intro}>
      <ol className="timeline">
        {roles.map((r) => (
          <li key={r.id}>
            <span className="dot" />
            <div className="tl-head">
              <h3>{r.title}</h3>
              <span className={`badge badge-${r.kind}`}>{r.kind}</span>
            </div>
            <p className="tl-meta">{r.org}{r.location ? ` · ${r.location}` : ""} · {r.period}</p>
            <ul className="panel-list">{r.points.map((p) => <li key={p}>{p}</li>)}</ul>
            {r.tags && <div className="chips">{r.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>}
          </li>
        ))}
      </ol>
    </FloorFrame>
  );
}
