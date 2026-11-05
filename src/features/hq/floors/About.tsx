import { bio, skills, stats, tech, type Floor } from "@/data";
import { FloorFrame } from "../FloorFrame";

export function About({ floor }: { floor: Floor }) {
  return (
    <FloorFrame floor={floor} title="About me" intro="Turning ideas into scalable AI-driven products that solve real-world problems.">
      {bio.map((p, i) => <p key={i} className="panel-body">{p}</p>)}

      <div className="stats">
        {stats.map((s) => (
          <div key={s.label}><b>{s.value}{s.suffix}</b><span>{s.label}</span></div>
        ))}
      </div>

      <h3 className="panel-h">Core skills</h3>
      <ul className="skills">
        {skills.map((s) => (
          <li key={s.name}>
            <div><span>{s.name}</span><i>{s.level}%</i></div>
            <div className="bar" role="progressbar" aria-valuenow={s.level} aria-valuemin={0} aria-valuemax={100} aria-label={s.name}>
              <em style={{ width: `${s.level}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <h3 className="panel-h">Tech stack</h3>
      {tech.map((g) => (
        <div key={g.label} className="tech-group">
          <span>{g.label}</span>
          <div className="chips">{g.items.map((i) => <span key={i} className="chip">{i}</span>)}</div>
        </div>
      ))}
    </FloorFrame>
  );
}
