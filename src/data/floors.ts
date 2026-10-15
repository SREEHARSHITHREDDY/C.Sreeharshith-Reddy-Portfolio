import type { Floor } from "./types";

/** HQ floor plan, bottom to top. */
export const floors: Floor[] = [
  { id: "lobby", level: "G", name: "Lobby", blurb: "Welcome to the headquarters", template: "lobby" },
  { id: "about", level: "1", name: "About", blurb: "Bio, skills and stack", template: "about" },
  { id: "projects", level: "2", name: "Projects", blurb: "Seven buildings, one city", template: "gallery" },
  { id: "experience", level: "3", name: "Experience", blurb: "Startup and work roles", template: "timeline" },
  { id: "leadership", level: "4", name: "Leadership", blurb: "Campus roles and volunteering", template: "timeline" },
  { id: "achievements", level: "5", name: "Achievements", blurb: "Hackathons and programs", template: "cards" },
  { id: "certifications", level: "6", name: "Certifications", blurb: "Verified credentials", template: "grid" },
  { id: "cabin", level: "TOP", name: "CEO Cabin", blurb: "Meet the founder", template: "cabin" },
];
