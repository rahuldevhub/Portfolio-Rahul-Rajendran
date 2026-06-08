/**
 * System Architecture — the six layers an idea travels through to become a
 * product. Message: most people work inside one layer; Rahul connects the whole
 * stack. Each layer answers one question and hands off to the next; a signal
 * cascades down the stack and resolves into "Product Builder".
 */

export type StackIcon = "Business" | "Target" | "Pen" | "Code2" | "Sparkles" | "Zap";

export interface StackLayer {
  id: string;
  index: number;
  name: string;
  /** The question this layer answers */
  question: string;
  /** What it actually handles (shown on hover/active) */
  description: string;
  icon: StackIcon;
  accent: string;
}

export const stackLayers: StackLayer[] = [
  {
    id: "business",
    index: 1,
    name: "Business",
    question: "Why should it exist?",
    description: "Who it's for, and how it sustains itself. The constraints that make every decision below it real.",
    icon: "Business",
    accent: "#2563EB",
  },
  {
    id: "product",
    index: 2,
    name: "Product",
    question: "What should we build?",
    description: "Deciding what to build — and what to leave out. Turning business intent into a problem worth solving.",
    icon: "Target",
    accent: "#4F60F0",
  },
  {
    id: "design",
    index: 3,
    name: "Design",
    question: "How should it feel?",
    description: "Turning decisions into experiences people understand without thinking. Structure before aesthetics.",
    icon: "Pen",
    accent: "#6D5EF8",
  },
  {
    id: "engineering",
    index: 4,
    name: "Engineering",
    question: "How does it work?",
    description: "Making the experience real, fast, and reliable — with the judgment to know when simple wins.",
    icon: "Code2",
    accent: "#8B5CF6",
  },
  {
    id: "ai",
    index: 5,
    name: "AI",
    question: "Where's the leverage?",
    description: "Intelligence wired in where it earns its place — not as a feature, but as a capability.",
    icon: "Sparkles",
    accent: "#A855F7",
  },
  {
    id: "automation",
    index: 6,
    name: "Automation",
    question: "How does it scale?",
    description: "Removing the repetitive so judgment can scale. Pipelines and agents that multiply output.",
    icon: "Zap",
    accent: "#C42AC0",
  },
];

export const stackOutput = {
  name: "Product Builder",
  sub: "The whole stack — moving as one thought.",
};

export const stackSectionIntro = {
  eyebrow: "System Architecture",
  problemLine: "Most people work\ninside one layer.",
  solutionLine: "I connect the\nentire stack.",
  body: "An idea travels down the stack — Business shapes Product, Product shapes Design, Design shapes Engineering. Each layer hands off to the next until it becomes a product.",
};
