export type ContentStatus = "placeholder" | "received" | "built";

export type FloorTemplate =
  | "lobby"
  | "about"
  | "gallery"
  | "timeline"
  | "cards"
  | "grid"
  | "cabin";

export interface Floor {
  id: string;
  /** Label shown in the elevator panel: "G", "1", ... "TOP" */
  level: string;
  name: string;
  blurb: string;
  template: FloorTemplate;
  status: ContentStatus;
}

export type ProjectCategory = "enterprise" | "research" | "innovation" | "product";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  year: number;
  /** GitHub "owner/repo" once provided; drives live data on the project building. */
  repo: string | null;
  status: ContentStatus;
}
