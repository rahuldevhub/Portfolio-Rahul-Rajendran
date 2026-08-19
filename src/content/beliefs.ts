/**
 * Beliefs / "How I Think" — Rahul's operating principles, framed as an
 * editorial set of five. Thoughtful, technical, dryly funny, still
 * professional. Not aspirational platitudes, not a game deck.
 */

export type BeliefIcon = "Zap" | "Pen" | "Code2" | "Shield" | "Target";

export interface Belief {
  id: string;
  /** Two-digit number, e.g. "01" */
  num: string;
  /** Short all-caps title */
  title: string;
  /** The principle itself, plain language */
  description: string;
  /** How the principle plays out in practice */
  inPractice: string;
  /** Card emblem */
  icon: BeliefIcon;
  /** Per-principle accent color */
  accent: string;
}

export interface BeliefsSectionIntro {
  eyebrow: string;
  /** Heading — the word "everything" is gradient-highlighted in the component */
  headline: string;
  /** Handwritten sub-note */
  note: string;
  /** Supporting copy lines under the handwritten note */
  supporting: string[];
  /** Closing handwritten line under the deck */
  footnote: string;
  /** Right-column header above the principle rows */
  principlesEyebrow: string;
  principlesCaption: string;
}

export const beliefsSectionIntro: BeliefsSectionIntro = {
  eyebrow: "How I Think",
  headline: "These are the principles that power everything I build.",
  note: "The rules I build by.",
  supporting: [
    "I don't start with technology.",
    "I start with what should be easier,",
    "clearer, faster or more trustworthy.",
  ],
  footnote: "Principles aren't for motivation. They're for decisions.",
  principlesEyebrow: "How I Make Decisions",
  principlesCaption: "5 principles I keep coming back to.",
};

export const beliefs: Belief[] = [
  {
    id: "friction",
    num: "01",
    title: "Remove Friction",
    description: "If the user needs a tutorial, three tooltips and a prayer, we probably made it worse.",
    inPractice: "Automate the boring parts before building another dashboard nobody asked for.",
    icon: "Zap",
    accent: "#6366F1",
  },
  {
    id: "clarity",
    num: "02",
    title: "Create Clarity",
    description: "If the interface needs a tour guide, it probably isn't clear yet.",
    inPractice: "Make the next action obvious. Future-me has enough problems already.",
    icon: "Pen",
    accent: "#8B5CF6",
  },
  {
    id: "invisible",
    num: "03",
    title: "Invisible Technology",
    description: "Nobody cares what framework powers the button. They just want the button to work.",
    inPractice: "Let engineering disappear behind a good experience.",
    icon: "Code2",
    accent: "#2563EB",
  },
  {
    id: "trust",
    num: "04",
    title: "Earn Trust",
    description: "Fast gets attention. Reliable gets invited back.",
    inPractice: "Predictable systems, clear states, and fewer ‘works on my machine’ moments.",
    icon: "Shield",
    accent: "#059669",
  },
  {
    id: "intentional",
    num: "05",
    title: "Intentional Features",
    description: "Not every idea needs to become a feature. Some deserve a respectful goodbye.",
    inPractice: "Ship fewer things. Make them useful.",
    icon: "Target",
    accent: "#D97706",
  },
];
