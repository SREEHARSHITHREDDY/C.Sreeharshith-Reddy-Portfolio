import type { Role } from "./types";

export const work: Role[] = [
  {
    id: "nebulytix", title: "AI Intern", org: "Nebulytix Technologies Pvt. Ltd.", kind: "work", employment: "Internship",
    period: "Apr 2026 – Jul 2026", location: "Hyderabad",
    summary: "Built and shipped core AI features for JobSync AI, an agentic HR platform, including a RAG-based resume-to-job matching engine, an intelligent job scouting agent and a Telegram bot, and authored the product documentation for its three-product suite.",
    points: [
      "Replaced static job matching with a RAG pipeline (pgvector, sentence-transformers all-MiniLM-L6-v2, 384-dimension embeddings), so resumes are matched to jobs by meaning rather than keywords.",
      "Built an intelligent job scouting agent with query expansion using intern and fresher synonyms, step-by-step location widening and URL de-duplication, fixing empty results on fresher searches.",
      "Fixed three critical Telegram bot failures (startup crash from a missing constant, callback crash from blind type conversion, initialisation failure outside the run context) and designed its commands, inline keyboards, callback routing and background execution.",
      "Built a section-aware resume parser that calculates experience from the Experience section only, with overlap-safe date merging, and returns highest role, longest-tenure role and an experience breakdown.",
      "Designed and built a six-page web dashboard (Three.js, GSAP, Chart.js, VanillaTilt.js) connected to REST APIs, with live statistics and a scouted-versus-applied activity chart, and fixed key-casing and path mismatches between front end and back end.",
      "Documented the full Agentic AI HR OS: enumerated 289 functionalities, wrote PRD, BRD and solution design content for all three products, and authored a builder's manual (database schema, 87 API routes, agent modules, five LLM prompts) detailed enough for a team with no prior context to rebuild the system.",
    ],
    result: "Delivered a working semantic matching pipeline, scouting agent, Telegram bot, resume parser and dashboard, plus a complete documentation base for the three-product HR OS. Internship completed with a completion letter from the company, and the work was presented to the college Training & Placement department.",
    mentor: { name: "V. Sunil Kumar Reddy", role: "Mentor" },
    tags: ["Python", "Flask", "PostgreSQL", "pgvector", "sentence-transformers", "RAG", "Telegram Bot API", "REST APIs", "JavaScript", "Three.js", "GSAP", "Chart.js", "pgAdmin 4", "Cline", "Claude"],
  },
  {
    id: "rainc", title: "Co-Founder", org: "RAIN-C", kind: "work", employment: "Founder",
    period: "Oct 2024 – Jul 2025", location: "Hybrid · Hyderabad, Telangana",
    summary: "Co-founded RAIN-C, an initiative focused on building an ecosystem that nurtures entrepreneurship, skill development, and innovation among primary and secondary school students.",
    points: [
      "Co-founded and contributed to building an ecosystem that encourages entrepreneurship and innovation among school students.",
      "Planned and developed initiatives to introduce entrepreneurial thinking at the school level.",
      "Engaged with schools to explore opportunities for student development and innovation.",
      "Promoted skill development and early exposure to entrepreneurship among primary and secondary school students.",
      "Contributed to grassroots innovation initiatives and ecosystem development.",
      "Worked on building opportunities that connect young learners with entrepreneurial and innovation-oriented experiences.",
    ],
    result: "Contributed to establishing an initiative aimed at nurturing entrepreneurial mindsets, practical skills, and grassroots innovation among young students.",
  },
];

export const leadership: Role[] = [
  { id: "ccio", title: "Cyber Crime Intervention Officer", org: "National Security Database", kind: "volunteering", period: "Jan 2025 – Present",
    points: ["Contributed to cybersecurity awareness and intervention initiatives", "Promoted cyber safety practices and digital responsibility"] },
  { id: "dean-fellow", title: "Member — Dean Fellow Leadership Cell", org: "Academic Integration Team, Woxsen University", kind: "leadership", period: "Jul 2025 – Present",
    points: ["Supported academic coordination and student engagement initiatives", "Collaborated with leadership teams to enhance student experience"] },
  { id: "japan-centre", title: "Senior Executive", org: "Woxsen Japan Centre", kind: "leadership", period: "Apr 2025 – Present",
    points: ["Facilitated international collaboration and cultural exchange programs", "Contributed to Indo-Japan academic and innovation initiatives"] },
  { id: "arthaverse", title: "AI Department Executive (HoD)", org: "Arthaverse Club", kind: "leadership", period: "Apr 2025 – Mar 2026",
    points: ["Led AI domain activities, workshops, and technical initiatives", "Coordinated execution of AI-based projects and events"] },
  { id: "ld-ambassador", title: "L&D Ambassador", org: "Centre of Talent Development", kind: "leadership", period: "Nov 2024 – Present",
    points: ["Promoted learning and development initiatives across student communities", "Supported peers in skill-building and career development"] },
  { id: "ai-centre", title: "Student Ambassador", org: "AI Research Centre, Woxsen University", kind: "leadership", period: "Jul – Oct 2025",
    points: ["Represented the AI Research Centre in student outreach initiatives", "Assisted in organizing and promoting AI-focused events"] },
  { id: "tech-club", title: "Executive", org: "Woxsen Tech Club", kind: "leadership", period: "Aug 2024 – Mar 2025",
    points: ["Supported execution of technical events and workshops", "Collaborated with team members to improve student engagement"] },
];
