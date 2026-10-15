import type { Project } from "./types";

/**
 * Ported from the HTML version. Set `repo` ("owner/name") to enable live GitHub
 * data on a building; until then the panel links to the GitHub profile.
 */
export const projects: Project[] = [
  {
    "id": "shopping-matrix",
    "title": "Shopping Matrix",
    "tagline": "AI-driven multi-vendor e-commerce intelligence platform",
    "category": "enterprise",
    "year": 2025,
    "about": "Shopping Matrix is an AI-powered multi-vendor e-commerce intelligence platform that analyzes large-scale sales trends, customer behavior, and inventory performance. It provides predictive insights and strategic recommendations to help vendors optimize pricing and maximize revenue.",
    "features": [
      "AI-based demand forecasting and trend prediction",
      "Customer behavior and product analytics",
      "Dynamic pricing and discount optimization",
      "Vendor performance dashboards",
      "Inventory optimization engine"
    ],
    "impact": "Improves vendor profitability and operational efficiency through data-driven decision-making and reduced inventory mismanagement.",
    "implementation": "Built predictive ML models and a decision-support engine to process multi-vendor datasets. Designed scalable architecture for structured commerce data and optimization insights.",
    "stack": [
      "Python",
      "Machine Learning",
      "Data Analytics",
      "React",
      "Node.js",
      "Cloud Deployment"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer"
      },
      {
        "name": "Ch. Hemanth Sri Sai Raja",
        "role": "Team Member"
      },
      {
        "name": "Krishna Sankeerth Pagoti",
        "role": "Team Member"
      },
      {
        "name": "D. Pragnya",
        "role": "Team Member"
      }
    ],
    "mentor": {
      "name": "Dr. S. Bhanu Prakash",
      "role": "Mentor"
    },
    "repo": null,
    "accent": "#f59e0b"
  },
  {
    "id": "ai-detectchain",
    "title": "AI-DetectChain",
    "tagline": "Blockchain-inspired AI-powered supply chain integrity framework",
    "category": "research",
    "year": 2025,
    "about": "AI-DetectChain is a blockchain-inspired framework that enhances supply chain transparency using hash chaining and anomaly detection. It identifies tampered, duplicate, or missing transaction records in datasets.",
    "features": [
      "SHA-256 hash-based chaining",
      "AI-driven anomaly detection",
      "Duplicate & missing record validation",
      "Transparent supply chain simulation",
      "Cybersecurity verification layer"
    ],
    "impact": "Strengthens data integrity and digital trust in supply chain systems aligned with secure infrastructure practices.",
    "implementation": "Implemented blockchain-style hashing architecture with rule-based anomaly detection to validate transactions and detect inconsistencies.",
    "stack": [
      "Python",
      "SHA-256 Hashing",
      "Data Structures",
      "Cybersecurity Concepts",
      "Simulation"
    ],
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
        "name": "M. Ruthwika Prakash",
        "role": "Team Member"
      },
      {
        "name": "M. Sai Yaswanth",
        "role": "Team Member"
      },
      {
        "name": "G. Sai Vaibhav",
        "role": "Team Member"
      }
    ],
    "mentor": {
      "name": "Prof. Meher Gayatri",
      "role": "Mentor"
    },
    "repo": null,
    "accent": "#06b6d4"
  },
  {
    "id": "ai-safety-filter",
    "title": "AI Safety Filter",
    "tagline": "Modular AI content moderation and safety system",
    "category": "research",
    "year": 2025,
    "about": "AI Safety Filter is a modular system designed to detect harmful or unsafe inputs using contextual validation and risk classification techniques.",
    "features": [
      "Context-aware input validation",
      "Risk classification and severity tagging",
      "Multi-layer filtering architecture",
      "Modular moderation pipeline",
      "Compliance-focused design"
    ],
    "impact": "Enhances AI reliability and ensures safe, policy-compliant outputs.",
    "implementation": "Designed a layered moderation pipeline combining validation logic and contextual classification for safe AI responses.",
    "stack": [
      "Python",
      "AI Safety Principles",
      "Content Moderation",
      "Rule-Based Systems"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Lead / Developer"
      },
      {
        "name": "Rithvik Gattu",
        "role": "Team Member"
      },
      {
        "name": "Gaddam Sai Teja",
        "role": "Team Member"
      },
      {
        "name": "M. Sai Yaswanth",
        "role": "Team Member"
      },
      {
        "name": "G. Sai Vaibhav",
        "role": "Team Member"
      }
    ],
    "mentor": {
      "name": "Prof. Vaishali Thakur",
      "role": "Mentor"
    },
    "repo": null,
    "accent": "#a78bfa"
  },
  {
    "id": "topicspin",
    "title": "TopicSpin",
    "tagline": "AI-powered structured reasoning and content generation system",
    "category": "innovation",
    "year": 2025,
    "about": "TopicSpin is an AI-based reasoning system that converts broad topics into structured, presentation-ready content using contextual analysis.",
    "features": [
      "Topic segmentation and refinement",
      "Structured summaries and outlines",
      "Context-aware reasoning",
      "Automated content generation",
      "Logical flow optimization"
    ],
    "impact": "Reduces manual effort in structuring content and improves clarity in presentations.",
    "implementation": "Built a reasoning pipeline using contextual analysis and segmentation to transform raw topics into structured outputs.",
    "stack": [
      "Python",
      "NLP Concepts",
      "Prompt Engineering",
      "Structured Reasoning"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Developer"
      }
    ],
    "mentor": {
      "name": "Joshua Gnanaselvan",
      "role": "Mentor"
    },
    "repo": null,
    "accent": "#f472b6"
  },
  {
    "id": "peer-grading",
    "title": "Peer Grading Platform",
    "tagline": "Full-stack collaborative academic evaluation system",
    "category": "enterprise",
    "year": 2025,
    "about": "Peer Grading Platform is a full-stack system designed to streamline student evaluation workflows with structured grading and analytics.",
    "features": [
      "Role-based authentication",
      "Section-wise grading system",
      "Duplicate submission detection",
      "Automated student management",
      "Real-time analytics dashboard"
    ],
    "impact": "Improves grading transparency, efficiency, and accuracy in academic environments.",
    "implementation": "Developed using React and TypeScript with a cloud backend supporting authentication, grading workflows, and analytics.",
    "stack": [
      "React",
      "TypeScript",
      "Node.js",
      "Cloud Backend",
      "Authentication Systems"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Developer"
      }
    ],
    "mentor": {
      "name": "Joshua Gnanaselvan",
      "role": "Mentor"
    },
    "repo": null,
    "accent": "#34d399"
  },
  {
    "id": "smart-stream",
    "title": "Smart Stream",
    "tagline": "IoT-based smart water monitoring and leakage detection system",
    "category": "research",
    "year": 2024,
    "about": "Smart Stream is an IoT-enabled system that monitors water usage in real time and detects leakages using sensor data and analytics.",
    "features": [
      "Real-time flow and pressure monitoring",
      "Leakage detection system",
      "Cloud dashboard visualization",
      "Historical usage analytics",
      "Sustainability insights"
    ],
    "impact": "Promotes efficient water usage and enables early leakage detection.",
    "implementation": "Integrated IoT sensors with microcontrollers and cloud-based systems for real-time monitoring and analytics.",
    "stack": [
      "IoT Sensors",
      "Microcontroller",
      "Embedded Systems",
      "Cloud Dashboard",
      "Data Visualization"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Developer"
      },
      {
        "name": "Rithvik Gattu",
        "role": "Team Member"
      },
      {
        "name": "Gaddam Sai Teja",
        "role": "Team Member"
      },
      {
        "name": "Y. Akhil Abhinay",
        "role": "Team Member"
      }
    ],
    "mentor": {
      "name": "Dr. S. Bhanu Prakash",
      "role": "Mentor"
    },
    "repo": null,
    "accent": "#38bdf8"
  },
  {
    "id": "syncmates",
    "title": "SyncMates",
    "tagline": "Collaborative calendar-based scheduling platform",
    "category": "product",
    "year": 2025,
    "about": "SyncMates is a collaborative scheduling platform that helps users manage events, connect with friends, and avoid conflicts using a unified system.",
    "features": [
      "Shared calendar system",
      "Friend-based collaboration",
      "Conflict detection algorithms",
      "Unified planning interface",
      "Productivity-focused tools"
    ],
    "impact": "Enhances coordination and productivity through centralized scheduling.",
    "implementation": "Built an interactive system with calendar sync logic and event conflict detection.",
    "stack": [
      "React",
      "JavaScript",
      "Node.js",
      "Calendar APIs",
      "Cloud Backend"
    ],
    "team": [
      {
        "name": "C. Sree Harshith Reddy",
        "role": "Developer"
      }
    ],
    "mentor": null,
    "repo": null,
    "accent": "#fb7185"
  }
];
