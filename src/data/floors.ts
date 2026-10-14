import type { Floor } from "./types";

/**
 * HQ floor plan. Order is bottom -> top; the elevator panel lists these.
 * Each floor renders through a template driven by data, so adding content
 * never needs layout work, and 2D and 3D share the same entries.
 */
export const floors: Floor[] = [
  { id: "lobby", level: "G", name: "Lobby", blurb: "Welcome, short intro, the elevator", template: "lobby", status: "placeholder" },
  { id: "about", level: "1", name: "About", blurb: "Bio, skills, stats", template: "about", status: "placeholder" },
  { id: "projects", level: "2", name: "Projects", blurb: "Overview of all seven projects, each linking to its building in the city", template: "gallery", status: "placeholder" },
  { id: "experience", level: "3", name: "Experience", blurb: "Work and startup roles", template: "timeline", status: "placeholder" },
  { id: "leadership", level: "4", name: "Leadership", blurb: "Campus roles, volunteering, events organised", template: "timeline", status: "placeholder" },
  { id: "achievements", level: "5", name: "Achievements", blurb: "Patent, hackathons, awards", template: "cards", status: "placeholder" },
  { id: "certifications", level: "6", name: "Certifications", blurb: "Credentials with verify links", template: "grid", status: "placeholder" },
  { id: "cabin", level: "TOP", name: "CEO Cabin", blurb: "You at the desk, plus contact details", template: "cabin", status: "placeholder" },
];
