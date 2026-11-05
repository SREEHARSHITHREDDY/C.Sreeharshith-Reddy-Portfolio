import type { Certification } from "./types";

const verify = (id: string) => `https://coursera.org/verify/${id}`;

export const certifications: Certification[] = [
  { id: "skillified", title: "Professional Career Development & Industry Orientation", issuer: "Skillified Mentor", date: "Mar 2026",
    skills: ["Career Development", "Industry Exposure", "Professional Skills"], credentialId: "d90d01fc-68a1-4e5e-ad99", verifyUrl: null },
  { id: "eou", title: "Economics Micro & Macro — Professional Diploma", issuer: "European Open University", date: "Feb 2026",
    skills: ["Microeconomics", "Macroeconomics", "Economic Analysis"], credentialId: null, verifyUrl: null },
  { id: "gatech", title: "Write Professional Emails in English", issuer: "Georgia Institute of Technology · Coursera", date: "Mar 2025",
    skills: ["Business Communication", "Professional Writing"], credentialId: "EHJ56C1W9IE2", verifyUrl: verify("EHJ56C1W9IE2") },
  { id: "duke", title: "Java Programming: Solving Problems with Software", issuer: "Duke University · Coursera", date: "Apr 2025",
    skills: ["Java", "Problem Solving", "OOP"], credentialId: "MTBWB0BUN7PP", verifyUrl: verify("MTBWB0BUN7PP") },
  { id: "packt", title: "Data Structures Using Python — An Introduction", issuer: "Packt · Coursera", date: "Feb 2025",
    skills: ["Data Structures", "Python"], credentialId: "UCJWA8KDQHVN", verifyUrl: verify("UCJWA8KDQHVN") },
  { id: "yonsei", title: "Advanced Functional Ceramics", issuer: "Yonsei University · Coursera", date: "Mar 2025",
    skills: ["Materials Science", "Engineering Concepts"], credentialId: "YBAZDESCB410", verifyUrl: verify("YBAZDESCB410") },
];
