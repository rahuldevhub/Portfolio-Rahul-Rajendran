/**
 * Process section — "The Build Log" (founder journal).
 * Seven journal entries — bold opinions / mental models, not generic process
 * steps. Each is a recorded thought with a timestamp, presented as a deck of
 * cards the visitor flips through.
 */

export interface ProcessStep {
  id: string;
  step: number;
  /** Renamed, memorable phase label */
  phase: string;
  /** Timestamp for the journal vibe */
  time: string;
  /** The bold opinion — the headline of the entry */
  headline: string;
  description: string;
  /** One-line principle — shown as a footer note */
  insight: string;
  /** The flip-side: where this thought was actually applied */
  back: { project: string; lesson: string; result: string };
}

export const processSteps: ProcessStep[] = [
  {
    id: "idea",
    step: 1,
    phase: "Question",
    time: "11:42 PM",
    headline: "Not every idea\nis a product.",
    description:
      "The first test is whether the problem is real or invented. I sit with the friction before I get excited about a solution. Most ideas don't survive ten minutes of honest questioning — the ones that do earn the next step.",
    insight: "Ideas are cheap. The valuable thing is finding one worth protecting from your own enthusiasm.",
    back: { project: "TrackPWD", lesson: "Killed four ideas before committing to one.", result: "Saved months building the wrong thing." },
  },
  {
    id: "research",
    step: 2,
    phase: "Signal",
    time: "9:15 AM",
    headline: "The answer is usually\nalready in the room.",
    description:
      "Adjacent products, forum complaints, abandoned sign-up flows — the signal is everywhere once you stop looking for confirmation. Research isn't validating what you believe. It's finding the one thing you didn't expect that changes everything.",
    insight: "Every breakthrough is a conversation the team was too busy to have earlier.",
    back: { project: "Lead CRM", lesson: "One buried support thread reframed the whole product.", result: "Onboarding rebuilt around it." },
  },
  {
    id: "architecture",
    step: 3,
    phase: "Structure",
    time: "2:30 PM",
    headline: "Good architecture\nis invisible.",
    description:
      "Data models, system boundaries, integration seams — drawing these out before building reveals constraints you didn't know existed. Architecture isn't a deliverable. It's a forcing function for clarity. If the diagram is confusing, the product will be too.",
    insight: "A messy architecture is usually a messy understanding of the problem.",
    back: { project: "Author Dashboard", lesson: "Redrew the data model twice before any code.", result: "Zero painful rewrites later." },
  },
  {
    id: "design",
    step: 4,
    phase: "Clarity",
    time: "4:08 PM",
    headline: "Design is the first\ntest of whether it works.",
    description:
      "Not visual design — structural design. How does the user's mental model map to the interface? Where does the complexity live, and who bears it? The visual layer earns its place only after these questions have answers.",
    insight: "If you can't design it simply, you don't understand it yet.",
    back: { project: "Lead CRM", lesson: "Collapsed three screens into one.", result: "Support tickets dropped sharply." },
  },
  {
    id: "build",
    step: 5,
    phase: "Execution",
    time: "1:24 AM",
    headline: "Shipping is not\nthe end of thinking.",
    description:
      "The build phase is where assumptions meet reality. I build toward the seams first — the integrations, the edge cases, the moments where the mental model collides with the machine. That's where you learn what the product actually is.",
    insight: "The first 80% takes 80% of the time. The last 20% takes the other 80%.",
    back: { project: "Author Dashboard", lesson: "Built the hardest integration first.", result: "No surprises at launch." },
  },
  {
    id: "launch",
    step: 6,
    phase: "Reality Check",
    time: "7:51 AM",
    headline: "How you launch is\npart of the product.",
    description:
      "Distribution is a design problem made early, not a marketing event tacked on at the end. Who hears about it first, and why does it matter to them specifically? The first hundred users don't just validate the product — they shape what it becomes.",
    insight: "Products that find users early outlast products that wait to be found.",
    back: { project: "TrackPWD", lesson: "Shipped to fifty people before five thousand.", result: "Found the real use case early." },
  },
  {
    id: "iterate",
    step: 7,
    phase: "Feedback Loop",
    time: "10:36 PM",
    headline: "What you shipped\nis the first draft.",
    description:
      "Retention patterns, support queues, session recordings — the product tells you what it needs next. The discipline is choosing which signal to follow and which to discard. Iteration without prioritization is just motion.",
    insight: "The product that doesn't change after users touch it wasn't listening.",
    back: { project: "Lead CRM", lesson: "Removed a feature users swore they wanted.", result: "Retention went up, not down." },
  },
];

export const processSectionIntro = {
  eyebrow: "Build Log",
  headline: "Field notes\nfrom the build.",
  subheadline:
    "Not a process diagram — the opinions and mental models I actually build by. Tap an entry to see where it was applied.",
};
