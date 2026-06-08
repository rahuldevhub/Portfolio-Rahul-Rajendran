/**
 * Story section — "Evolution of a Product Builder".
 * Five levels: Freelancer → Designer → Developer → Product Builder → Founder.
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
      "Client work taught me how to listen before building. Websites, logos, decks, campaigns — whatever the brief, I found a path through it. Saying yes to the wrong things teaches you exactly what the right things look like.",
      "The freelancer phase is where you learn that most problems aren't technical. They're about understanding what someone actually needs, versus what they think they're asking for.",
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
      "Design revealed that the interface is never just visual. It's a set of decisions about what matters and what doesn't — baked invisibly into every layout, every label, every transition.",
      "Good design isn't decoration. It's invisible decision-making — craft for its own sake, the pixel that moves 2px in the right direction and makes everything click.",
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
      "I wanted to build the thing — not just prototype, actually ship. Front-end first, then back-end, then infrastructure. The gap between a beautiful mockup and a working product is where most ideas quietly die.",
      "Crossing that gap became my speciality. Once you've shipped something real, you can never design the same way again. You start designing for the engineer, not just the eye.",
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
      "It was the combination. Strategy informing design informing engineering informing growth — all as one continuous thought. When you can hold all of it at once, you stop optimizing for the layer and start optimizing for the outcome.",
      "That's when product building becomes a real craft. Not a role. Not a title. A way of thinking that runs from the first user interview to the last deployment.",
    ],
    skills: ["Product Thinking", "Strategy", "Prioritization"],
  },
  {
    id: "founder",
    level: "05",
    phase: "Founder",
    accent: "#6D5EF8",
    unlock: "Building what should exist.",
    heading: "Now I'm building the thing I'd want to use.",
    body: [
      "Every layer led here. The freelancer who figured out scope. The designer who systemized taste. The developer who learned to ship. The product thinker who learned to prioritize.",
      "The next chapter is founding — building something with a clear point of view, at my own pace, for people who feel the same friction I do.",
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
  lead: "Every layer led to one skill:",
  emphasis: "Building products people actually use.",
  cta: { label: "See My Work", href: "#work" },
};
