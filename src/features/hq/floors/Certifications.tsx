import { certifications, type Floor } from "@/data";
import { FloorFrame } from "../FloorFrame";

export function Certifications({ floor }: { floor: Floor }) {
  return (
    <FloorFrame floor={floor} intro="Verified credentials. Where a public link exists, you can check it yourself.">
      <ul className="cards">
        {certifications.map((c) => (
          <li key={c.id}>
            <div className="card-top"><span className="tl-meta">{c.date}</span></div>
            <h3>{c.title}</h3>
            <p className="tl-meta">{c.issuer}</p>
            <div className="chips">{c.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            <div className="cert-foot">
              <code>{c.credentialId ?? "—"}</code>
              {c.verifyUrl ? <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer">Verify ↗</a> : <span>No public link</span>}
            </div>
          </li>
        ))}
      </ul>
    </FloorFrame>
  );
}
