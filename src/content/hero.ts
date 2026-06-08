/**
 * Hero section content — swap values here, never in components.
 */
export const hero = {
  eyebrow: "The Product Builder",

  /** Two headline lines — rendered as separate animated blocks */
  headlineLines: [
    "Most products break between idea and execution.",
    "I build across the gap.",
  ] as [string, string],

  /** Capability tags — shown as a muted separator row */
  supporting: "Product Thinking · Design · Engineering · AI · Growth",

  ctas: {
    primary: {
      label: "Explore My Work",
      href: "#work",
    },
    secondary: {
      label: "Let's Build Something",
      href: "#contact",
    },
  },
} as const;

/** Nodes that orbit around Rahul in the 3D ecosystem visual */
export const ecosystemNodes = [
  // Inner orbit
  { label: "Product",     radius: 2.5, inclination:  0.08, speed: 0.14, offset: 0,               accent: true  },
  { label: "Design",      radius: 2.5, inclination:  0.08, speed: 0.14, offset: Math.PI,          accent: false },
  // Middle orbit
  { label: "Engineering", radius: 3.6, inclination: -0.15, speed: 0.09, offset: Math.PI * 0.3,   accent: true  },
  { label: "AI",          radius: 3.6, inclination: -0.15, speed: 0.09, offset: Math.PI * 1.3,   accent: false },
  // Outer orbit
  { label: "Marketing",   radius: 4.6, inclination:  0.06, speed: 0.055, offset: Math.PI * 0.5,  accent: false },
  { label: "Publishing",  radius: 4.6, inclination:  0.06, speed: 0.055, offset: Math.PI * 1.2,  accent: false },
  { label: "AR",          radius: 4.6, inclination:  0.06, speed: 0.055, offset: Math.PI * 1.85, accent: false },
] as const;

/** The three orbit ring radii with their inclination angles */
export const orbitRings = [
  { radius: 2.5, inclination:  0.08 },
  { radius: 3.6, inclination: -0.15 },
  { radius: 4.6, inclination:  0.06 },
] as const;

/* ─── New Hero (Phase 4) ─────────────────────────────────────────────────── */

/**
 * Character image src — swap to /character.png when ready.
 * To activate: replace <Placeholder> in Hero.tsx with <Image src={characterSrc} ... />.
 */
export const characterSrc = "/character.png";

export type SkillCardIcon =
  | "Sparkles"
  | "Pen"
  | "Code2"
  | "Play"
  | "Clapperboard";

export type StatIcon = "Zap" | "BookOpen" | "Rocket" | "Target" | "Sparkles";

export interface SkillCard {
  id: string;
  title: string;
  /** Hex accent color — used ONLY inside this card */
  color: string;
  statusLabel: string;
  description: string;
  icon: SkillCardIcon;
  /** Whether to show on mobile (only 3 of 5) */
  showOnMobile: boolean;
  /** Absolute position within the desktop scene container */
  pos: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  /** Float loop: peak y offset (px) and duration (s) */
  float: { y: number; duration: number };
}

export interface StatItem {
  icon: StatIcon;
  value: string;
  label: string;
  color: string;
}

export const skillCards: SkillCard[] = [
  {
    id: "ai-tools",
    title: "AI & Tools",
    color: "#2563EB",
    statusLabel: "Learning",
    description: "AI, automation & intelligent systems.",
    icon: "Sparkles",
    showOnMobile: true,
    // Top-center — lifted above the character's head (matches reference)
    pos: { top: "-11%", left: "33%" },
    float: { y: 8, duration: 4.2 },
  },
  {
    id: "ui-ux",
    title: "UI / UX Design",
    color: "#8B5CF6",
    statusLabel: "Designing",
    description: "Clean, intuitive digital experiences.",
    icon: "Pen",
    showOnMobile: true,
    // Left-upper — on the orbit's left arc
    pos: { top: "26%", left: "-2%" },
    float: { y: 10, duration: 3.8 },
  },
  {
    id: "web-dev",
    title: "Web Development",
    color: "#059669",
    statusLabel: "Building",
    description: "Fast, scalable web apps.",
    icon: "Code2",
    showOnMobile: true,
    // Right-upper-mid — on the orbit's right arc
    pos: { top: "37%", right: "-2%" },
    float: { y: 7, duration: 4.6 },
  },
  {
    id: "content",
    title: "Content Systems",
    color: "#D97706",
    statusLabel: "Creating",
    description: "Content that connects & converts.",
    icon: "Play",
    showOnMobile: false,
    // Left-lower — on the orbit's lower-left arc
    pos: { bottom: "14%", left: "-2%" },
    float: { y: 9, duration: 4.0 },
  },
  {
    id: "vfx",
    title: "VFX & Motion",
    color: "#E11D48",
    statusLabel: "Experimenting",
    description: "Bringing stories to life visually.",
    icon: "Clapperboard",
    showOnMobile: false,
    // Right-lower — on the orbit's lower-right arc
    pos: { bottom: "4%", right: "-2%" },
    float: { y: 6, duration: 5.1 },
  },
];

export const statsBar: StatItem[] = [
  { icon: "Zap",      value: "5",    label: "Focus Areas",     color: "#2563EB" },
  { icon: "Sparkles", value: "∞",    label: "Ideas Exploring", color: "#8B5CF6" },
  { icon: "Rocket",   value: "24/7", label: "Building Mode",    color: "#059669" },
  { icon: "Target",   value: "1",    label: "Goal · Impact",   color: "#E11D48" },
];
