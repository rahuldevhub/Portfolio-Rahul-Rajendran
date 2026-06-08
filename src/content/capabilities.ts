/**
 * Builder Skill Tree — the six abilities Rahul operates with, framed as an
 * RPG skill tree. Each node has a level / rarity / XP, a set of unlocked
 * abilities, and a guiding quote. Hovering a node expands its detail panel.
 *
 * Tree shape:
 *        Product Thinking
 *               │
 *            Design
 *               │
 *          Engineering
 *           ╱        ╲
 *     Automation     Growth
 *           ╲        ╱
 *         Creative Technology
 *
 * Colors mirror the Story levels for narrative continuity.
 */

export type SkillIcon = "Target" | "Pen" | "Code2" | "Zap" | "TrendingUp" | "Sparkles";
export type Rarity = "Rare" | "Epic" | "Legendary";

export interface Capability {
  id: string;
  label: string;
  tagline: string;
  description: string;
  icon: SkillIcon;
  accent: string;
  level: number;
  rarity: Rarity;
  xp: number;
  /** XP threshold for the next level — drives the journey bar */
  nextXp: number;
  /** Authentic "real-world" stat, e.g. "7+ Years", "100+ Deploys" */
  metric: string;
  /** RPG "special move" — the signature ability */
  special: string;
  abilities: string[];
  quote: string;
  /** Node position in the tree's 460×800 coordinate space */
  node: { x: number; y: number };
  /** Which lower nodes this connects down to */
  connectsTo: string[];
}

export const capabilities: Capability[] = [
  {
    id: "product",
    label: "Product Thinking",
    tagline: "Turning ideas into impactful systems.",
    description:
      "Framing the right problem before solving the wrong one. Scope decisions, prioritization, and the discipline to say no — all before a single line of code is written.",
    icon: "Target",
    accent: "#D97706",
    level: 85,
    rarity: "Epic",
    xp: 1200,
    nextXp: 1500,
    metric: "Core Skill",
    special: "Saying No",
    abilities: ["Problem Framing", "Prioritization", "Scope Decisions", "Roadmapping"],
    quote: "Solve the right problem before solving it well.",
    node: { x: 230, y: 70 },
    connectsTo: ["design"],
  },
  {
    id: "design",
    label: "Design",
    tagline: "Turning systems into experiences.",
    description:
      "Interfaces that feel inevitable. From information architecture and interaction patterns to high-fidelity UI — designed with the engineer and the user both in the room.",
    icon: "Pen",
    accent: "#8B5CF6",
    level: 87,
    rarity: "Epic",
    xp: 1400,
    nextXp: 2000,
    metric: "7+ Years",
    special: "Creating Clarity",
    abilities: ["UX Architecture", "Design Systems", "Interaction Design", "Visual Hierarchy"],
    quote: "Good design isn't decoration. It's invisible decision-making.",
    node: { x: 230, y: 250 },
    connectsTo: ["engineering"],
  },
  {
    id: "engineering",
    label: "Engineering",
    tagline: "Turning experiences into reliable products.",
    description:
      "End-to-end implementation across front-end, back-end, and infrastructure. Built to last, not just to demo — with the taste to know when the simple solution wins.",
    icon: "Code2",
    accent: "#2563EB",
    level: 92,
    rarity: "Legendary",
    xp: 2400,
    nextXp: 3000,
    metric: "100+ Deploys",
    special: "Shipping Real",
    abilities: ["Frontend Systems", "Backend Logic", "Infrastructure", "Product Shipping"],
    quote: "Beautiful mockups aren't enough. Ship the real thing.",
    node: { x: 230, y: 430 },
    connectsTo: ["automation", "growth"],
  },
  {
    id: "automation",
    label: "Automation",
    tagline: "Removing repetitive work. Multiplying impact.",
    description:
      "LLM integration, agent workflows, and intelligent pipelines wired into the product — the kind of automation that frees teams to focus on what actually needs judgment.",
    icon: "Zap",
    accent: "#EAB308",
    level: 78,
    rarity: "Rare",
    xp: 900,
    nextXp: 1200,
    metric: "50+ Workflows",
    special: "Multiplying Time",
    abilities: ["LLM Integration", "Agent Workflows", "Pipelines", "Internal Tooling"],
    quote: "Automate the repetitive. Reserve judgment for what matters.",
    node: { x: 95, y: 600 },
    connectsTo: ["creative-tech"],
  },
  {
    id: "growth",
    label: "Growth",
    tagline: "Helping products reach the right people.",
    description:
      "Positioning, launch mechanics, and growth loops. Getting the right product in front of the right people — and turning early usage into compounding momentum.",
    icon: "TrendingUp",
    accent: "#059669",
    level: 80,
    rarity: "Rare",
    xp: 1000,
    nextXp: 1400,
    metric: "20+ Launches",
    special: "Finding Users",
    abilities: ["Positioning", "Launch Mechanics", "Growth Loops", "Retention"],
    quote: "The best product still needs to be found.",
    node: { x: 365, y: 600 },
    connectsTo: ["creative-tech"],
  },
  {
    id: "creative-tech",
    label: "Creative Technology",
    tagline: "Experimenting with tech to create something new.",
    description:
      "When the product itself is the canvas. Spatial interfaces, generative systems, real-time 3D — applied with taste, not as a gimmick. Technology as a medium for surprise.",
    icon: "Sparkles",
    accent: "#A855F7",
    level: 90,
    rarity: "Legendary",
    xp: 2000,
    nextXp: 2500,
    metric: "Experimental",
    special: "Genuine Surprise",
    abilities: ["Spatial UI", "Generative Systems", "Real-time 3D", "Experimentation"],
    quote: "Technology as a medium for genuine surprise.",
    node: { x: 230, y: 745 },
    connectsTo: [],
  },
];

export const capabilitiesSectionIntro = {
  eyebrow: "Process",
  treeLabel: "Builder OS · v5.0",
  headline: "How I work.",
  note: "Skills I've unlocked.\nSystems I rely on.",
  subheadline:
    "Not a list of tools. A set of ways of thinking — each one sharpened through real projects, real constraints, and real users.",
  footer: "Different skills. One mission — building products people actually use.",
};

/** RPG-style builder profile shown in the left column. */
export const builderProfile = {
  class: "Product Builder",
  level: 87,
  xp: "12,450",
  projects: "42+",
  skills: "6 / 6",
  status: "Active",
} as const;

/** Achievement badges shown below the tree. */
export const achievements: string[] = [
  "Built End-to-End Products",
  "Designed Systems at Scale",
  "Shipped AI Workflows",
  "Launched a Personal Brand",
];

/** The "final boss" badge shown once every branch is unlocked. */
export const masterBuilder = {
  rank: "Class Mastered",
  title: "Master Builder",
  sub: "All branches unlocked.",
};

/** Completion + transition into the Work section. */
export const skillTreeOutro = {
  complete: "Build Complete",
  completeSub: "6 / 6 Skills Activated · All Systems Online",
  lead: "All skills acquired.",
  emphasis: "Now let's see what they built.",
  cta: { label: "See The Builds", href: "#work" },
};
