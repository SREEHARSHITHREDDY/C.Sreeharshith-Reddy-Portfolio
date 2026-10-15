export type ProjectCategory = "enterprise" | "research" | "innovation" | "product";

export type FloorTemplate = "lobby" | "about" | "gallery" | "timeline" | "cards" | "grid" | "cabin";

export interface Floor {
  id: string;
  /** Label shown in the elevator panel: "G", "1", ... "TOP" */
  level: string;
  name: string;
  blurb: string;
  template: FloorTemplate;
}

export interface Person {
  name: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  year: number;
  about: string;
  features: string[];
  impact: string;
  implementation: string;
  stack: string[];
  team: Person[];
  mentor: Person | null;
  /** GitHub "owner/repo". Drives live data on the building. Null until set. */
  repo: string | null;
  /** Accent hue for the building's glow (hex). */
  accent: string;
}

export interface Skill { name: string; level: number }
export interface TechGroup { label: string; items: string[] }
export interface Stat { value: number; suffix: string; label: string }

export interface Role {
  id: string;
  title: string;
  org: string;
  kind: "work" | "leadership" | "volunteering";
  period: string;
  location?: string;
  points: string[];
  tags?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  kind: "achievement" | "internship";
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  credentialId: string | null;
  verifyUrl: string | null;
}
