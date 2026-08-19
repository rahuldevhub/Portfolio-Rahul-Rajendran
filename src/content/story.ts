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
    unlock: "Said yes. Figured it out later.",
    heading: "I said yes first. Figured out how later.",
    body: [
      "A website? Sure. A logo? Sure. A slide deck due tomorrow? Apparently, also sure. Every brief taught me something different — how to talk to clients, how to read a messy request for what it actually meant, how to solve problems that had nothing to do with code. Saying yes to things I wasn't ready for was the fastest way to get ready.",
    ],
    skills: ["Communication", "Client Handling", "Problem Solving"],
  },
  {
    id: "designer",
    level: "02",
    phase: "Designer",
    accent: "#8B5CF6",
    unlock: "Started caring how things feel.",
    heading: "Then I became obsessed with how things feel.",
    body: [
      "Design was the first time I noticed how much a layout, a label, or a transition could change how something feels — not just how it looks. I started arguing with pixels. Unfortunately, the pixels usually won. That's when I stopped thinking about products as a list of features and started thinking about how they feel to use.",
    ],
    skills: ["UX Thinking", "Design Systems", "Visual Hierarchy"],
  },
  {
    id: "developer",
    level: "03",
    phase: "Developer",
    accent: "#2563EB",
    unlock: "Learned to actually ship.",
    heading: "Beautiful mockups were not enough.",
    body: [
      "I could design something. But at some point I wanted to make the actual thing work, not just look like it worked. Turns out a Figma prototype doesn't care about your deadline. So I learned React, learned enough backend to be dangerous, and learned what it actually takes to ship something and keep it alive. Once you've shipped something real, you can't design the same way again — you start designing for the engineer, not just the eye.",
    ],
    skills: ["React", "Backend", "Deployment"],
  },
  {
    id: "product",
    level: "04",
    phase: "Product Builder",
    accent: "#D97706",
    unlock: "Stopped separating the layers.",
    heading: "I stopped asking what to build.",
    body: [
      "Strategy, design, engineering, growth — I used to think of these as separate jobs. At some point they stopped feeling that way. Eventually, I stopped asking \"What should I build?\" and started asking \"What actually needs to exist?\" That's a different question, and it changes everything below it. You stop optimizing for the layer and start optimizing for the outcome. Not a role. Not a title. Just how I think now.",
    ],
    skills: ["Product Thinking", "Strategy", "Prioritization"],
  },
  {
    id: "builder",
    level: "05",
    phase: "Builder",
    accent: "#6D5EF8",
    unlock: "All of it, finally, one system.",
    heading: "Turns out, none of those versions of me were wasted.",
    body: [
      "The freelancer who learned to listen and figure out scope. The designer who learned to care about how things feel. The developer who learned to actually ship. The product thinker who learned to prioritize. I stopped trying to be just one of them. Turns out you don't have to — you just bring all of them to the same table.",
    ],
    skills: ["Vision", "Ownership", "Conviction"],
  },
];

export const storySectionIntro = {
  eyebrow: "The Arc",
  headline: "Evolution of a\nProduct Builder",
  subtitle: "I didn't really plan to become a Product Builder. I just kept saying yes to problems I probably shouldn't have.",
};

export const storyFinale = {
  lead: "I stopped trying to pick one title. Not a designer. Not just a developer.",
  emphasis: "A product builder.",
  cta: { label: "See My Work", href: "#work" },
};
