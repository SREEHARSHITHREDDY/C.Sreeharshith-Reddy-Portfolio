import type { Project } from "./types";

/**
 * Source: the project portfolio sheet. Fields left blank there are left blank here
 * (no stack, year or timeline is invented). Add `repo: "owner/name"` to switch on live
 * GitHub data. "Aurora" has no details yet, so it is not listed.
 */
export const projects: Project[] = [
  {
    "id": "smart-stream",
    "title": "Smart Stream",
    "tagline": "An IoT-powered smart water monitoring system for efficient water management and leakage detection.",
    "category": "innovation",
    "about": "Smart Stream is an IoT-based water monitoring solution designed to monitor water usage and identify potential leakage in water distribution systems. It focuses on improving water management through real-time monitoring and intelligent detection. The system aims to reduce water wastage and improve resource utilization.",
    "features": [
      "Real-time water usage monitoring",
      "Water leakage detection",
      "IoT-based sensor integration",
      "Water flow and consumption tracking",
      "Identification of abnormal water usage"
    ],
    "impact": "Designed to improve water conservation through continuous monitoring and early leakage detection.",
    "implementation": "Developed using IoT-based monitoring concepts, sensor integration, and software components for tracking water consumption and identifying irregularities.",
    "stack": [],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer"
      }
    ],
    "mentor": null,
    "repo": null,
    "status": "completed",
    "accent": "#38bdf8"
  },
  {
    "id": "shopping-matrix",
    "title": "Shopping Matrix",
    "tagline": "The operating system for physical retail - starting with Indian malls.",
    "category": "product",
    "year": 2025,
    "about": "Shopping Matrix is an AI-driven retail intelligence startup. It began as an online price-comparison and multi-vendor shopping assistant, then pivoted to digitizing the physical mall experience, because online aggregation faced data-access limits (marketplace APIs) and heavy competition. Shoppers can browse real-time inventory across all stores in a nearby mall, pre-order products and food-court meals, and arrive only to collect. Target users are working professionals and college students (18-35) in Indian Tier 1 and Tier 2 cities.",
    "features": [
      "Real-time inventory browsing across all stores in a mall",
      "Pre-order of products with in-mall pickup (reservations)",
      "Food-court meal pre-ordering",
      "Personalized recommendations (designed around collaborative filtering, matrix factorization, association rule mining and time-series forecasting; at design stage, not yet trained or deployed)",
      "Centralized shopping interface for users, malls, stores and food courts"
    ],
    "impact": "Aims to save shoppers time and improve purchasing decisions by connecting mall inventory and food courts to one pre-order flow.",
    "implementation": "Built in staged development with a 15-document product vision suite (also compiled into one master document). The database schema (users, malls, stores, products, inventory, reservations, food courts, food orders) is saved as a SQL migration with row-level-security-ready structure. Supabase integration (Stage 3) was in progress at last check. Startup and patent-oriented project with co-inventors; trademark and patent filings are planned.",
    "stack": [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "ShadCN UI (Radix)",
      "Zustand",
      "TanStack Query",
      "qrcode.react",
      "date-fns",
      "Supabase",
      "GitHub",
      "VS Code"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer (Co-founder)"
      },
      {
        "name": "M. Ruthwika Prakash",
        "role": "Co-inventor"
      },
      {
        "name": "Krishna Sankeerth Pagoti",
        "role": "Co-inventor"
      }
    ],
    "mentor": null,
    "repo": null,
    "status": "in-progress",
    "accent": "#f59e0b",
    "repoPrivate": true,
    "timeline": {
      "start": "March 2025",
      "end": "Ongoing"
    }
  },
  {
    "id": "ai-detectchain",
    "title": "AI-DetectChain",
    "tagline": "A supply chain data integrity verification system combining anomaly detection with blockchain-style hash chains.",
    "category": "innovation",
    "about": "AI-DetectChain (AI Secure Chain) is a supply chain data integrity verification system. It detects tampering and anomalies in records, corrects them automatically, and proves integrity using a SHA-256 hash chain. It was developed at the School of Technology, Woxsen University, with patent filing as the primary goal (Woxsen as Applicant, Harshith as Inventor).",
    "features": [
      "Multi-class anomaly detection",
      "Automated deterministic correction of detected anomalies",
      "Per-record SHA-256 blockchain-style hash chain generation",
      "Hash chain integrity verification",
      "REST API plus browser-based delivery",
      "Five-stage processing pipeline",
      "Simulation of tampering scenarios"
    ],
    "impact": "A complete 14-question Invention Disclosure Form has been prepared with 19 verified references (blockchain platforms, anomaly detection, cryptographic hash integrity, regulatory context, market size). Patent disclosure stage: inventor details and a royalty/IP agreement with the university are still to be completed before filing.",
    "implementation": "Built as a five-stage pipeline: anomaly detection, deterministic correction, hash chain generation, integrity verification, and REST API with a browser front end. Source code is kept in a private repository.",
    "stack": [
      "SHA-256 hashing",
      "REST API",
      "Browser-based front end"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer (Inventor)"
      }
    ],
    "mentor": null,
    "repo": null,
    "status": "in-progress",
    "accent": "#06b6d4",
    "repoPrivate": true
  },
  {
    "id": "ai-safety-filter",
    "title": "AI Safety Filter",
    "tagline": "A modular AI-powered content moderation and safety filtering system.",
    "category": "research",
    "about": "AI Safety Filter is a modular content moderation solution designed to identify and filter potentially harmful, inappropriate, or unsafe content. It focuses on improving digital safety by providing an intelligent filtering mechanism that can be integrated into applications and online platforms.",
    "features": [
      "Automated content moderation",
      "Identification of harmful content",
      "Intelligent content filtering",
      "Modular filtering architecture",
      "Safety-focused content classification",
      "Integration possibilities for digital platforms"
    ],
    "impact": "Aims to create safer digital environments through automated identification and filtering of inappropriate content.",
    "implementation": "Designed using AI-based content classification and modular filtering concepts to identify potentially unsafe content and support automated moderation.",
    "stack": [],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer"
      }
    ],
    "mentor": null,
    "repo": null,
    "status": "in-progress",
    "accent": "#a78bfa"
  },
  {
    "id": "vachan-ai",
    "title": "Vachan AI",
    "tagline": "An agentic AI commitment and relationship intelligence engine that treats every promise as a trackable object.",
    "category": "product",
    "year": 2026,
    "about": "VachanAI (from the Sanskrit \"Vachan\", meaning a promise or word given) is an Agentic AI Commitment and Relationship Intelligence Engine, built as a B.Tech AI semester project under Dr. Rajkumar Kalimuthu (HOD, CSE & BIC, Woxsen University). Its core idea is to treat a promise as a first-class object with its own lifecycle: pending, at-risk, fulfilled. Phase 1 (Students) is complete; Phase 2 is in progress.",
    "features": [
      "LLM-based commitment extraction (Groq API, openai/gpt-oss-120b)",
      "Lifecycle tracker with cross-referencing resolution detection (the core patentable mechanism)",
      "Contacts management with commitment linking and date-range support",
      "Persona selection (student / professional / business) and settings page",
      "Calendar and browser notification reminders",
      "Secure accounts: JWT authentication, bcrypt password hashing, Gmail SMTP email verification, per-user data isolation",
      "3D immersive scroll-based UI (in progress)"
    ],
    "impact": "Test suite at 65-71 passing tests. LLM precision baseline of about 80% exact match (12/15) and about 93% core commitment detection. Full documentation suite produced: BRD/PRD/SDD, architecture diagrams, database design, API design, patent framing and a 14-week execution plan.",
    "implementation": "FastAPI backend with SQLite persistence, LLM extraction through the Groq API, and a lifecycle tracker. The front end is being redesigned with Three.js (ambient wireframe background), the Motion library (scroll-triggered 3D entrances) and mouse-tracked card tilt. A 14-slide presentation was built for review.",
    "stack": [
      "Python",
      "FastAPI",
      "SQLite",
      "Groq API (openai/gpt-oss-120b)",
      "JWT",
      "bcrypt",
      "Gmail SMTP",
      "Three.js",
      "Motion library"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer"
      }
    ],
    "mentor": {
      "name": "Dr. Rajkumar Kalimuthu",
      "role": "Supervisor"
    },
    "repo": "SREEHARSHITHREDDY/Vachan-AI",
    "status": "in-progress",
    "accent": "#f472b6",
    "timeline": {
      "start": "July 2026",
      "end": "Ongoing"
    }
  },
  {
    "id": "syncmates",
    "title": "SyncMates",
    "tagline": "Stop asking. Start planning.",
    "category": "product",
    "about": "SyncMates is a social scheduling web application that helps groups coordinate availability and plan events without the back-and-forth of manual scheduling. It is live at syncmates.in and the codebase is tagged through v1.3 after a launch sprint that fixed about 20 documented issues across frontend, backend and database.",
    "features": [
      "Collaborative calendar management and event planning",
      "Friend availability grid",
      "Partial-match search",
      "Notification management and push notifications",
      "Event reminders and shared meeting minutes",
      "Standalone action items/tasks",
      "AI event assistant (needs a paid API key, currently not enabled)"
    ],
    "impact": "Live product at syncmates.in with launch materials prepared (LinkedIn, WhatsApp, Instagram). A full PRD covers architecture, freemium revenue model with MRR projections, roadmap through v3 and go-to-market strategy. Google Calendar and other calendar integrations are planned for v3.",
    "implementation": "Full-stack app that started on Lovable and was migrated to a self-owned Supabase instance, with four Supabase Edge Functions (AI event assistant, push notifications, event reminders, meeting minutes sharing). Deployed through GitHub to Netlify, with the syncmates.in domain from GoDaddy and automatic SSL. Row-level-security policies were corrected on the main tables.",
    "stack": [
      "React",
      "Tailwind CSS",
      "Supabase (database, auth, Edge Functions)",
      "Netlify",
      "GitHub",
      "VS Code"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Founder / Lead / Developer"
      }
    ],
    "mentor": null,
    "repo": null,
    "status": "in-progress",
    "accent": "#fb7185",
    "demoUrl": "https://syncmates.in",
    "timeline": {
      "start": "",
      "end": "Ongoing (live; v1.3 tagged)"
    }
  },
  {
    "id": "smart-parking",
    "title": "Smart Parking System",
    "tagline": "A data-structure-driven parking management system for efficient vehicle entry, exit, and space management.",
    "category": "innovation",
    "about": "The Smart Parking System (Using Stacks and Queues) was developed as a Data Structures and Algorithms project to demonstrate the practical application of stacks and queues in parking management. It has since grown into a full-stack web application with a dark-themed UI, aimed at both academic/IP use (patent filing through the college IP cell) and commercial use (SaaS with Starter, Pro and Enterprise tiers).",
    "features": [
      "Vehicle entry and exit management",
      "Stack-based parking operations and queue-based vehicle handling",
      "Parking space management and organized vehicle tracking",
      "Dual-mode camera and QR ticket lifecycle",
      "AI-coupled surge pricing",
      "Combined EV charging and parking billing",
      "Hardware-agnostic API contract",
      "Payments, WhatsApp notifications, email, PDF invoices and reports, live WebSocket updates, audit logging (run in mock/test mode)"
    ],
    "impact": "Demonstrates how fundamental data structures solve practical parking problems. The project has 20 database tables and 50+ API routes, plus a business document suite (PRD, BRD, Solution Document, Master Plan deck, Invention Disclosure).",
    "implementation": "Implemented with stack and queue data structures for vehicle movement, then extended into a Flask + PostgreSQL web app with real-time updates and an ESP32/MicroPython hardware layer. Razorpay and Twilio integrations use placeholder keys so features run in test mode. Deployment to Render or Railway and a React Native/Expo mobile app are planned.",
    "stack": [
      "Python",
      "Flask",
      "PostgreSQL",
      "Flask-SocketIO",
      "Flask-Mail",
      "ReportLab",
      "Razorpay (mock)",
      "Twilio WhatsApp (mock)",
      "ESP32/MicroPython",
      "jsQR and qrcode.js",
      "Git/GitHub",
      "VS Code"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer (sole developer)"
      }
    ],
    "mentor": null,
    "repo": "SREEHARSHITHREDDY/Smart-Parking-System-Stack-Queue",
    "status": "completed",
    "accent": "#22c55e"
  },
  {
    "id": "humainity",
    "title": "HumAInity",
    "tagline": "Privacy-preserving, health-aware workforce scheduling for software companies.",
    "category": "product",
    "year": 2026,
    "about": "HumAInity (formerly MediHR OS) brings together Healthcare, Artificial Intelligence and Human Resources. It started as privacy-preserving, health-aware shift scheduling for healthcare workforce management and has been repositioned to target software companies, covering shift rotas and on-call rotations for engineering teams. It was submitted as Capstone Project-I under the 24TU05IT01 Industry Excellence Track (3 credits, 5th semester).",
    "features": [
      "Privacy-preserving, health-aware shift scheduling",
      "Scheduling engine for rotas and on-call rotations",
      "Full-stack web application (frontend, backend, scheduling engine)"
    ],
    "impact": "Aims to build fairer, wellbeing-aware schedules for engineering teams while protecting employee privacy.",
    "implementation": "Harshith is building the full stack (frontend, backend, scheduling engine) as part of a five-member team.",
    "stack": [],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer"
      },
      {
        "name": "Krishna Sankeerth Pagoti",
        "role": "Team Member"
      },
      {
        "name": "Medam Sanjay Lakshman Reddy",
        "role": "Team Member"
      },
      {
        "name": "Prathipati Shreeja",
        "role": "Team Member"
      },
      {
        "name": "Pragnya D",
        "role": "Team Member"
      }
    ],
    "mentor": {
      "name": "Dr. T. Ravindar",
      "role": "Faculty Mentor"
    },
    "repo": null,
    "status": "in-progress",
    "accent": "#14b8a6",
    "timeline": {
      "start": "October 2026",
      "end": "Ongoing"
    }
  },
  {
    "id": "kairos",
    "title": "Kairos",
    "tagline": "An academia-industry collaboration portal for skill mapping, internships and placement.",
    "category": "product",
    "year": 2026,
    "about": "Project Kairos is a full-stack web application built by TeamKairos (Team ID 158240) for Smart India Hackathon 2026, Problem Statement SIH26044 (Ministry of Ayush / AIIA): \"Portal for Academia-Industry Collaboration for Skill Mapping, Internships and Placement.\" One shared backend serves three role-based portals: Student, Industry and Institution.",
    "features": [
      "Student portal: skill scan, scout and match with ATS-style scoring, Bridge Path gap-closing plans, applications Kanban, job feed, resume upload and parsing, career path suggestions, skill gap analysis, learning hub, interview prep, analytics",
      "Industry portal: dashboard, post desk, candidate radar, talent search, learning programs, analytics",
      "Institution portal: placement funnel dashboard, cohort view with CSV export, verify desk with audit log, companies view, faculty opportunities, campus events",
      "Career Readiness Score combining profile completeness, skill verification and market fit",
      "Telegram push notifications"
    ],
    "impact": "Developed end to end and submitted on the SIH portal with a presentation deck. Built to favor reliability for demos, with safe template fallbacks where AI generation is used.",
    "implementation": "Single shared FastAPI backend (\"kairos-core\") with one React/Vite front end using role-based routing. JWT authentication replaced earlier in-memory sessions after a session bug was fixed. SQLAlchemy/SQLite (Postgres-ready, auto-migrating), Telegram Bot API, pypdf resume parsing, a deterministic ATS-style match engine and an optional Gemini layer for Bridge Path and Interview Prep.",
    "stack": [
      "FastAPI",
      "React",
      "Vite",
      "SQLAlchemy",
      "SQLite",
      "JWT",
      "Telegram Bot API",
      "pypdf",
      "Gemini (optional)"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer"
      },
      {
        "name": "TeamKairos (Team ID 158240)",
        "role": "Team"
      }
    ],
    "mentor": null,
    "repo": null,
    "status": "completed",
    "accent": "#eab308",
    "timeline": {
      "start": "",
      "end": "September 2026 (SIH portal submission)"
    }
  }
];
