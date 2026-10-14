import type { Project } from "./types";

/**
 * Titles, taglines, categories and years are carried over from the HTML version.
 * `repo` stays null until the real GitHub repo for each project is provided.
 */
export const projects: Project[] = [
  { id: "shopping-matrix", title: "Shopping Matrix", tagline: "AI-driven multi-vendor e-commerce intelligence platform", category: "enterprise", year: 2025, repo: null, status: "placeholder" },
  { id: "ai-detectchain", title: "AI-DetectChain", tagline: "Blockchain-inspired AI-powered supply chain integrity framework", category: "research", year: 2025, repo: null, status: "placeholder" },
  { id: "ai-safety-filter", title: "AI Safety Filter", tagline: "Modular AI content moderation and safety system", category: "research", year: 2025, repo: null, status: "placeholder" },
  { id: "topicspin", title: "TopicSpin", tagline: "AI-powered structured reasoning and content generation system", category: "innovation", year: 2025, repo: null, status: "placeholder" },
  { id: "peer-grading", title: "Peer Grading Platform", tagline: "Full-stack collaborative academic evaluation system", category: "enterprise", year: 2025, repo: null, status: "placeholder" },
  { id: "smart-stream", title: "Smart Stream", tagline: "IoT-based smart water monitoring and leakage detection system", category: "research", year: 2024, repo: null, status: "placeholder" },
  { id: "syncmates", title: "SyncMates", tagline: "Collaborative calendar-based scheduling platform", category: "product", year: 2025, repo: null, status: "placeholder" },
];
