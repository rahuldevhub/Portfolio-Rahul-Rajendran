/**
 * Beliefs / "My Operating System" — Rahul's principles for building, framed as
 * a collectible philosophy deck. Five principles; the last is "legendary".
 * First-person, confident, specific. Not aspirational platitudes.
 */

export type BeliefIcon = "Zap" | "Pen" | "Code2" | "Shield" | "Target";

export interface Belief {
  id: string;
  /** Two-digit card number, e.g. "01" */
  num: string;
  /** Short all-caps card title */
  title: string;
  /** One-to-two line principle, plain language */
  description: string;
  /** Card emblem */
  icon: BeliefIcon;
  /** Rarity label shown on the card */
  rarity: string;
  /** The standout final card */
  legendary?: boolean;
  /** Builder XP awarded */
  xp: number;
  /** Per-card accent color */
  accent: string;
}

export interface BeliefsSectionIntro {
  eyebrow: string;
  /** Heading — the word "everything" is gradient-highlighted in the component */
  headline: string;
  /** Handwritten sub-note */
  note: string;
  /** Closing handwritten line under the deck */
  footnote: string;
}

export const beliefsSectionIntro: BeliefsSectionIntro = {
  eyebrow: "How I Think",
  headline: "These are the principles that power everything I build.",
  note: "My operating system",
  footnote: "Principles aren't for motivation. They're for decisions.",
};

export const beliefs: Belief[] = [
  {
    id: "friction",
    num: "01",
    title: "Remove Friction",
    description: "If a feature creates work, it's probably not helping.",
    icon: "Zap",
    rarity: "Core Principle",
    xp: 20,
    accent: "#6366F1",
  },
  {
    id: "clarity",
    num: "02",
    title: "Create Clarity",
    description: "If users need instructions, the design is still talking too much.",
    icon: "Pen",
    rarity: "Core Principle",
    xp: 20,
    accent: "#8B5CF6",
  },
  {
    id: "invisible",
    num: "03",
    title: "Invisible Technology",
    description: "Nobody praises a light switch. It just works.",
    icon: "Code2",
    rarity: "Core Principle",
    xp: 20,
    accent: "#2563EB",
  },
  {
    id: "trust",
    num: "04",
    title: "Earn Trust",
    description: "Fast gets attention. Reliable keeps it.",
    icon: "Shield",
    rarity: "Core Principle",
    xp: 20,
    accent: "#059669",
  },
  {
    id: "intentional",
    num: "05",
    title: "Intentional Features",
    description: "The best feature is often the one we didn't build.",
    icon: "Target",
    rarity: "Legendary Principle",
    legendary: true,
    xp: 50,
    accent: "#D97706",
  },
];
