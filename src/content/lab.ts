export type ExplorationStatus = "Active" | "Researching" | "Learning" | "Experimenting";

export interface NoteConfig {
  /** SVG user-unit position of the note text anchor */
  x: number;
  y: number;
  /** SVG text-anchor value */
  anchor: "start" | "end" | "middle";
  /** Lines of handwritten annotation text */
  lines: string[];
  /** SVG path for the curved arrow from note to node */
  arrowPath: string;
}

export interface MapNode {
  id: string;
  /** Lucide icon key — maps to ICONS in ExplorationMap */
  icon: "sparkles" | "trending-up" | "clapperboard" | "layers" | "scan";
  title: string;
  description: string;
  status: ExplorationStatus;
  /** 2–3 short focus tags shown in the info card */
  focusTags: string[];
  /** Hex color for this node's glow + icon tint */
  color: string;
  /** Desktop-only annotation note rendered in Caveat font */
  noteConfig: NoteConfig;
}

/**
 * Ordered so node 0 lands at the top of the ring (angle = -90°).
 * Positions are computed radially in ExplorationMap.
 * VB_W=700, VB_H=460, CX=350, CY=230, RADIUS=120
 */
export const mapNodes: MapNode[] = [
  {
    id: "ai-products",
    icon: "sparkles",
    title: "AI Products",
    description: "Building AI-powered tools and workflows that solve real problems.",
    status: "Active",
    focusTags: ["Prototyping", "Workflows", "Building"],
    color: "#3B82F6",
    noteConfig: {
      x: 468,
      y: 38,
      anchor: "start",
      lines: ["shipping fast,", "learning faster"],
      arrowPath: "M 466 57 C 460 80 425 100 390 120",
    },
  },
  {
    id: "saas-startups",
    icon: "trending-up",
    title: "SaaS Startups",
    description: "Exploring scalable, retention-driven product businesses.",
    status: "Researching",
    focusTags: ["Research", "Product Strategy", "Retention"],
    color: "#10B981",
    noteConfig: {
      x: 570,
      y: 164,
      anchor: "start",
      lines: ["where does", "the money stick?"],
      arrowPath: "M 568 183 C 556 196 528 202 500 205",
    },
  },
  {
    id: "vfx-motion",
    icon: "clapperboard",
    title: "VFX & Motion",
    description: "Bringing stories to life — visual effects and motion.",
    status: "Learning",
    focusTags: ["Motion Design", "Storytelling", "Craft"],
    color: "#F43F5E",
    noteConfig: {
      x: 540,
      y: 390,
      anchor: "start",
      lines: ["every frame", "is a decision"],
      arrowPath: "M 538 374 C 520 362 484 350 454 342",
    },
  },
  {
    id: "content-systems",
    icon: "layers",
    title: "Content Systems",
    description: "Creating repeatable content engines that scale.",
    status: "Active",
    focusTags: ["Systems", "Automation", "Distribution"],
    color: "#F59E0B",
    noteConfig: {
      x: 160,
      y: 390,
      anchor: "end",
      lines: ["once built,", "it runs itself"],
      arrowPath: "M 162 374 C 180 362 216 350 246 342",
    },
  },
  {
    id: "interactive-design",
    icon: "scan",
    title: "Interactive Design",
    description: "Crafting immersive experiences people love.",
    status: "Experimenting",
    focusTags: ["Interaction", "Prototyping", "UX"],
    color: "#8B5CF6",
    noteConfig: {
      x: 130,
      y: 164,
      anchor: "end",
      lines: ["feel > function", "(but both matter)"],
      arrowPath: "M 132 183 C 145 196 174 202 206 206",
    },
  },
];

/* ─── "Rahul's Open Tabs" — browser-window Lab section ───────────────────── */

export type TabStatus = "Active" | "Researching" | "Learning" | "Exploring" | "Ideating";

export type TabStage = "Discovering" | "Researching" | "Learning" | "Building" | "Testing";

export interface OpenTab {
  id: string;
  name: string;
  accent: string;
  status: TabStatus;
  description: string;
  /** Current focus line */
  focus: string;
  /** Pipeline stage — replaces a fake % */
  stage: TabStage;
  /** Share of mental bandwidth (0–100; the five sum to 100) */
  bandwidth: number;
  /** Last-touched label */
  updated: string;
  /** The "current obsession" pull-line */
  obsession: string;
}

export const openTabs: OpenTab[] = [
  {
    id: "ai-agents",
    name: "AI Agents",
    accent: "#4F7CFF",
    status: "Active",
    description: "Building intelligent agents and workflows that automate real work and amplify human creativity.",
    focus: "AI Workflows & Automation",
    stage: "Building",
    bandwidth: 43,
    updated: "2 hours ago",
    obsession: "Making AI feel less like a tool, and more like a teammate.",
  },
  {
    id: "content-systems",
    name: "Content Systems",
    accent: "#22C55E",
    status: "Researching",
    description: "Designing repeatable content engines — systems that publish consistently without burning out the creator.",
    focus: "Systems & Distribution",
    stage: "Researching",
    bandwidth: 22,
    updated: "Yesterday",
    obsession: "One input, ten outputs — content that compounds.",
  },
  {
    id: "vfx-learning",
    name: "VFX Learning",
    accent: "#8B5CF6",
    status: "Learning",
    description: "Learning visual effects and motion design to bring stories and products to life with cinematic polish.",
    focus: "Motion & Storytelling",
    stage: "Learning",
    bandwidth: 15,
    updated: "3 days ago",
    obsession: "Every product deserves a title sequence.",
  },
  {
    id: "creator-tools",
    name: "Creator Tools",
    accent: "#F59E0B",
    status: "Exploring",
    description: "Exploring tools that give creators superpowers — small utilities that remove friction from making things.",
    focus: "Utilities & Workflows",
    stage: "Testing",
    bandwidth: 12,
    updated: "Last week",
    obsession: "The best tool is the one you forget you're using.",
  },
  {
    id: "micro-saas",
    name: "Micro SaaS",
    accent: "#EC4899",
    status: "Ideating",
    description: "Ideating small, focused software products — one problem, one audience, sustainable by design.",
    focus: "Product & Strategy",
    stage: "Discovering",
    bandwidth: 8,
    updated: "Brewing",
    obsession: "Small products. Real revenue. Built to last.",
  },
];

export const labIntro = {
  eyebrow: "What's Next",
  headline: "Rahul's\nOpen Tabs",
  note: "A lot on the table. All in progress.",
  punch: "5 tabs open.",
  description: [
    "Some become products.",
    "Some become skills.",
    "Most become lessons.",
  ],
  mode: "Explore • Build • Ship",
  panelTitle: "Mental Bandwidth",
  /** Footer counters — the little story */
  counters: [
    { value: "5", label: "tabs open" },
    { value: "12", label: "archived" },
    { value: "1", label: "shipped" },
  ],
};
