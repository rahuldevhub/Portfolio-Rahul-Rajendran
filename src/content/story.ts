/**
 * Story section — "Evolution of a Product Builder".
 * Five levels: Freelancer → Designer → Developer → Product Builder → Builder.
 * Each level is a scroll-driven chapter that unlocks skills and evolves the
 * sticky character (accent color, XP, skill tree). Editorial, not resume-style.
 */

export interface StoryStage {
  id: string;
  /** Two-digit level number, e.g. "01" */
  level: string;
  /** Title / class name, e.g. "Freelancer" */
  phase: string;
  /** Per-level accent color — themes the character glow, XP bar, tree node */
  accent: string;
  /** Punchy unlock line shown as the chapter eyebrow */
  unlock: string;
  /** Editorial chapter heading */
  heading: string;
  /** Narrative paragraphs */
  body: string[];
  /** Skills unlocked at this level */
  skills: string[];
}

export const storyStages: StoryStage[] = [
  {
    id: "freelancer",
    level: "01",
    phase: "Freelancer",
    accent: "#6B6B70",
    unlock: "Said yes to everything.",
    heading: "Started by saying yes to everything.",
    body: [
      "Websites, logos, decks, campaigns — whatever the brief, I found a way through it. Most problems turned out not to be technical. They were about understanding what someone actually needs versus what they think they're asking for. Saying yes to the wrong things taught me exactly what the right things look like.",
    ],
    skills: ["Communication", "Client Handling", "Problem Solving"],
  },
  {
    id: "designer",
    level: "02",
    phase: "Designer",
    accent: "#8B5CF6",
    unlock: "Fell for how things feel.",
    heading: "Then I became obsessed with how things feel.",
    body: [
      "Design revealed that the interface is never just visual — it's a system of invisible decisions about what matters and what doesn't. Every layout, every label, every transition. The pixel that moves 2px in the right direction and makes everything click.",
    ],
    skills: ["UX Thinking", "Design Systems", "Visual Hierarchy"],
  },
  {
    id: "developer",
    level: "03",
    phase: "Developer",
    accent: "#2563EB",
    unlock: "Learned to ship.",
    heading: "Beautiful mockups were not enough.",
    body: [
      "I wanted to build the thing — not just prototype, actually ship. The gap between a beautiful mockup and a working product is where most ideas quietly die. Once you've shipped something real, you can never design the same way again. You start designing for the engineer, not just the eye.",
    ],
    skills: ["React", "Backend", "Deployment"],
  },
  {
    id: "product",
    level: "04",
    phase: "Product Builder",
    accent: "#D97706",
    unlock: "Connected everything.",
    heading: "The job was never any one of those things.",
    body: [
      "Strategy informing design informing engineering informing growth — all as one continuous thought. When you hold all of it at once, you stop optimizing for the layer and start optimizing for the outcome. Not a role. Not a title. A way of thinking.",
    ],
    skills: ["Product Thinking", "Strategy", "Prioritization"],
  },
  {
    id: "builder",
    level: "05",
    phase: "Builder",
    accent: "#6D5EF8",
    unlock: "Every layer became one system.",
    heading: "Now everything I learned works together.",
    body: [
      "The freelancer who figured out scope. The designer who systemized taste. The developer who learned to ship. The product thinker who learned to prioritize. Every layer merged into one way of working — building end-to-end products with a clear point of view.",
    ],
    skills: ["Vision", "Ownership", "Conviction"],
  },
];

export const storySectionIntro = {
  eyebrow: "The Arc",
  headline: "Evolution of a\nProduct Builder",
  subtitle: "I wasn't chasing titles. I was solving the next problem.",
};

export const storyFinale = {
  lead: "Not a designer. Not just a developer.",
  emphasis: "A product builder.",
  cta: { label: "See My Work", href: "#work" },
};
