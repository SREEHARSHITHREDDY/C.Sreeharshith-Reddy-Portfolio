import type { Skill, Stat, TechGroup } from "./types";

export const bio: string[] = [
  "I'm a Computer Science undergraduate specialising in Artificial Intelligence and Machine Learning, driven by a passion for building real-world, impactful solutions. My work focuses on applying AI, prompt engineering, and emerging technologies to solve practical problems and create meaningful user experiences.",
  "I have developed projects ranging from IoT-based systems like Smart Stream to AI-powered platforms such as Shopping Matrix and secure, blockchain-inspired solutions like AI-DetectChain. These experiences reflect my ability to combine technical skills with problem-solving and innovation.",
  "Beyond development, I bring an entrepreneurial mindset shaped by my experience as a Co-Founder and active leadership roles, where I have mentored peers and contributed to building tech-driven initiatives. I am continuously exploring new ideas, improving my skills, and working toward creating scalable products that make a real difference.",
];

export const stats: Stat[] = [
  { value: 7, suffix: "+", label: "Projects built" },
  { value: 2, suffix: "+", label: "Years experience" },
  { value: 5, suffix: "+", label: "Technologies" },
  { value: 1, suffix: "", label: "Co-Founder" },
];

export const skills: Skill[] = [
  { name: "AI & Machine Learning", level: 88 },
  { name: "Prompt Engineering", level: 85 },
  { name: "Full-Stack Development", level: 78 },
  { name: "IoT Systems", level: 72 },
  { name: "Blockchain & Web3", level: 65 },
  { name: "Product Leadership", level: 80 },
];

export const tech: TechGroup[] = [
  { label: "Languages", items: ["Python", "JavaScript", "C++", "SQL"] },
  { label: "AI / ML", items: ["TensorFlow", "Machine Learning", "Data Analytics", "LLMs"] },
  { label: "Web & Cloud", items: ["React", "Node.js", "Cloud Deploy", "Firebase"] },
  { label: "Other", items: ["IoT", "Blockchain", "SHA-256", "Git"] },
];
