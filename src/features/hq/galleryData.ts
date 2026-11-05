import { achievements, certifications, leadership, projects, work, type Role } from "@/data";
import type { ExhibitKind } from "@/features/city/interiors/Exhibit";
import { LANDMARK_SLOTS, LINKEDIN_SLOT } from "@/features/city/plan/landmarks";

export interface GalleryEntry {
  id: string;
  title: string;
  sub: string;
  accent: string;
  body: string;
  bullets?: string[];
  chips?: string[];
  meta?: string;
  exhibit: ExhibitKind;
  /** Link out (verify, repo). */
  link?: { label: string; href: string };
  /** In-app action: open this project's building. */
  projectId?: string;
}

const projectSlot = LANDMARK_SLOTS.map((_, i) => i).filter((i) => i !== LINKEDIN_SLOT);

const roleEntry = (r: Role, accent: string, eyebrow: string): GalleryEntry => ({
  id: r.id,
  title: r.title,
  sub: r.org,
  accent,
  body: `${r.org}${r.location ? ` · ${r.location}` : ""}`,
  meta: r.period,
  bullets: r.points,
  chips: r.tags,
  exhibit: { type: "card", card: { eyebrow, title: r.title, lines: [r.org], footer: r.period, accent: "#f59e0b", theme: "navy" } },
});

/** What stands in each case on a gallery floor. The same entries feed the 3D cases and the info card. */
export function galleryFor(floorId: string): GalleryEntry[] {
  switch (floorId) {
    case "projects":
      return projects.map((p, i) => ({
        id: p.id,
        title: p.title,
        sub: `${p.category} · ${p.year}`,
        accent: p.accent,
        body: p.about,
        bullets: p.features,
        chips: p.stack,
        meta: p.timeline ? `${p.timeline.start} – ${p.timeline.end ?? "Present"}` : String(p.year),
        exhibit: { type: "project", shapeIndex: projectSlot[i], accent: p.accent },
        projectId: p.id,
        link: p.repo ? { label: "Open repository", href: `https://github.com/${p.repo}` } : undefined,
      }));
    case "experience":
      return work.map((r) => roleEntry(r, "#f59e0b", "Work experience"));
    case "leadership":
      return leadership.map((r) => roleEntry(r, r.kind === "volunteering" ? "#06b6d4" : "#f59e0b", r.kind));
    case "achievements":
      return achievements.map((a) => ({
        id: a.id,
        title: a.title,
        sub: a.issuer,
        accent: "#f59e0b",
        body: a.description,
        meta: a.date,
        exhibit: { type: "trophy", card: { eyebrow: a.kind, title: a.title, lines: [a.issuer], footer: a.date, accent: "#b8801a" } },
      }));
    case "certifications":
      return certifications.map((c) => ({
        id: c.id,
        title: c.title,
        sub: c.issuer,
        accent: "#c98a1e",
        body: c.issuer,
        chips: c.skills,
        meta: `${c.date}${c.credentialId ? ` · ID ${c.credentialId}` : ""}`,
        exhibit: { type: "card", card: { eyebrow: "Certificate of completion", title: c.title, lines: [c.issuer], footer: c.date, accent: "#b8801a" } },
        link: c.verifyUrl ? { label: "Verify credential", href: c.verifyUrl } : undefined,
      }));
    default:
      return [];
  }
}
