import { achievements, type Floor } from "@/data";
import { FloorFrame } from "../FloorFrame";

export function Achievements({ floor }: { floor: Floor }) {
  return (
    <FloorFrame floor={floor} intro="Hackathons, programs and national competitions.">
      <ul className="cards">
        {achievements.map((a) => (
          <li key={a.id}>
            <div className="card-top">
              <span className={`badge badge-${a.kind}`}>{a.kind}</span>
              <span className="tl-meta">{a.date}</span>
            </div>
            <h3>{a.title}</h3>
            <p className="tl-meta">{a.issuer}</p>
            <p className="panel-body">{a.description}</p>
          </li>
        ))}
      </ul>
    </FloorFrame>
  );
}
