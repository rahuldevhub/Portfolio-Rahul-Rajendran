/**
 * AI section — "AI Operations" command center.
 * Not a tool list — a co-pilot network. AI models feed a central decision core
 * (Rahul); judgment routes their output into products. The tools change; the
 * thinking doesn't. Signal flows from each model → the core → the output.
 */

export interface AITool {
  id: string;
  name: string;
  /** The layer / role it plays */
  role: string;
  tagline: string;
  description: string;
  accent: string;
  /** Node position in the 460×380 network coordinate space */
  node: { x: number; y: number };
  /** Where its label sits relative to the orb */
  labelSide: "top" | "left" | "right" | "bottom";
}

export const aiTools: AITool[] = [
  {
    id: "claude",
    name: "Claude",
    role: "Reasoning",
    tagline: "Long-context reasoning",
    description: "Architecture review, complex writing, and thinking loops where precision and a long context window both matter.",
    accent: "#D97706",
    node: { x: 230, y: 52 },
    labelSide: "top",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    role: "Ideation",
    tagline: "Breadth & quick iteration",
    description: "Fast ideation and wide-surface research — best when speed and breadth matter more than depth.",
    accent: "#059669",
    node: { x: 64, y: 190 },
    labelSide: "left",
  },
  {
    id: "cursor",
    name: "Cursor",
    role: "Execution",
    tagline: "In-editor velocity",
    description: "Writing, refactoring, and navigating large codebases without breaking flow.",
    accent: "#8B5CF6",
    node: { x: 396, y: 190 },
    labelSide: "right",
  },
  {
    id: "gemini",
    name: "Gemini",
    role: "Synthesis",
    tagline: "Multimodal & data-dense",
    description: "Documents, images, and mixed-format research — strong at synthesis across large, varied inputs.",
    accent: "#2563EB",
    node: { x: 230, y: 328 },
    labelSide: "bottom",
  },
];

export const aiCore = {
  name: "Rahul",
  role: "Decision Engine",
};

export const aiOutputs = ["Products", "Content", "Systems", "Automation"];

export const aiSectionIntro = {
  eyebrow: "AI Operations",
  headline: "AI is the multiplier.\nJudgment is the moat.",
  body: "I use AI to compress the distance between idea and prototype — four co-pilots feeding one decision layer. The models change every few months. The thinking doesn't.",
};
