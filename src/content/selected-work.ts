/**
 * Selected Work — all four categories.
 * Product Engineering items reuse the same slugs as case study MDX files.
 * All other items use labeled Placeholder media, trivial to replace with real assets.
 */

export type MediaType = "image" | "video";
export type GridStyle = "editorial" | "showcase";

export interface WorkMetric {
  label: string;
  value: string;
}

export interface SelectedWorkItem {
  id: string;
  title: string;
  /** Optional product positioning line shown under the title (hero card) */
  subtitle?: string;
  description: string;
  year: number;
  mediaLabel: string;
  mediaAspect: string;
  mediaType: MediaType;
  /** If set, renders a real image (full, uncropped) instead of a Placeholder. */
  mediaSrc?: string;
  /** If set, links to /work/[slug] case study page */
  slug?: string;
  /** One-line outcome — shown on editorial cards */
  outcome?: string;
  /** Category label — shown on editorial meta row */
  category?: string;
  /** My role on the project */
  role?: string;
  /** 2–3 key metrics — shown as a stat row on editorial cards */
  metrics?: WorkMetric[];
  /** One-line challenge framing — shown below the description */
  challenge?: string;
  /** Outcome framing shown as a Problem → Solution → Impact block (editorial cards).
   *  This answers "why does this project matter?" before the visuals. */
  problem?: string;
  solution?: string;
  impact?: string;
  /** Short "proof of work" tags that float around the chapter visual */
  artifacts?: string[];
  /** Ambient identity colors — drives the soft glow behind the chapter visual */
  accent?: { glowA: string; glowB: string };
}

export interface WorkCategoryData {
  id: string;
  label: string;
  /** Full heading shown above the section itself (falls back to `label`) */
  sectionTitle?: string;
  description: string;
  gridStyle: GridStyle;
  /** Workspace identity — colored tab dot + the section's ambient glow */
  tint: { dot: string; glowA: string; glowB: string };
  items: SelectedWorkItem[];
}

/**
 * AR / Spatial — NDA credibility card.
 * Some Snapchat/AR work was built under NDA and can't be shown publicly.
 * This is a tasteful proof-of-work note, not a dead end — it points to a
 * conversation instead of a screenshot.
 */
export interface ArNdaNote {
  eyebrow: string;
  heading: string;
  body: string;
  meta: { studio: string; platform: string };
  cta: { label: string; href: string };
}

export const arNdaNote: ArNdaNote = {
  eyebrow: "Also Shipped",
  heading: "Some of it can't be shown here.",
  body: "AR / Snapchat work with RBKavin Studio — some of it's under NDA. That's usually a good sign.",
  meta: { studio: "RBKavin Studio", platform: "Snapchat" },
  cta: { label: "Ask me about it", href: "#contact" },
};

/**
 * Publishing — compact summary strip shown above the (deliberately smaller)
 * Publishing grid. Reuses the 160+ countries figure already published in the
 * Hero stats bar — not a new claim.
 */
export interface PublishingSummary {
  eyebrow: string;
  heading: string;
  body: string;
  stat: { value: string; label: string };
}

export const publishingSummary: PublishingSummary = {
  eyebrow: "Ritera Publishing",
  heading: "Another layer of what I've built.",
  body: "Publishing products and books I've worked on have reached readers across 160+ countries.",
  stat: { value: "160+", label: "Countries reached" },
};

/**
 * Creative Works — lighter, experimental companion grid shown after the
 * flagship Product Engineering case studies. These are preview-only cards
 * (no full case study), kept compact and secondary by design.
 */
export interface CreativeWorkItem {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  /** Optional external link (opens in new tab). Omit for "in development". */
  href?: string;
  /** Unique two-stop ambient glow that tints the card on hover */
  accent: { from: string; to: string };
}

export const creativeWorksIntro = {
  /** Handwritten signature line — Rahul personality (rendered in Caveat) */
  signature: "Experiments that escaped the lab.",
  heading: "Creative Works",
  subheading:
    "Selected brand experiences, marketing sites, UI explorations, and client projects.",
  footer:
    "More experiments, client projects, and ideas currently in development.",
};

export const creativeWorks: CreativeWorkItem[] = [
  {
    id: "forge-fitness",
    title: "Forge Fitness",
    subtitle: "Story-Driven Brand Experience",
    tags: ["Motion Design", "Brand Story", "Frontend"],
    accent: { from: "rgba(255,138,76,0.9)", to: "rgba(229,57,53,0.9)" }, // orange → red
  },
  {
    id: "ritera-landing",
    title: "Ritera Landing Pages",
    subtitle: "Publishing Campaign Experiences",
    tags: ["Marketing", "Conversion", "Landing Page"],
    accent: { from: "rgba(140,30,55,0.9)", to: "rgba(212,160,60,0.9)" }, // burgundy → gold
  },
  {
    id: "personal-brand-experiments",
    title: "Personal Brand Experiments",
    subtitle: "Interactive Portfolio Concepts",
    tags: ["UI/UX", "Animation", "Creative"],
    accent: { from: "rgba(34,211,238,0.9)", to: "rgba(43,107,255,0.9)" }, // cyan → blue
  },
  {
    id: "micro-ui-concepts",
    title: "Micro UI Concepts",
    subtitle: "Components and Interaction Systems",
    tags: ["Design System", "Motion", "Frontend"],
    accent: { from: "rgba(168,85,247,0.9)", to: "rgba(244,114,182,0.9)" }, // purple → pink
  },
];

export const workCategories: WorkCategoryData[] = [
  {
    id: "product-engineering",
    label: "Product Engineering",
    sectionTitle: "Product Engineering",
    description:
      "Full-stack products built end-to-end — from problem framing to production.",
    gridStyle: "editorial",
    tint: { dot: "#2B6BFF", glowA: "rgba(43,107,255,0.08)", glowB: "rgba(109,94,248,0.05)" },
    items: [
      {
        id: "infinity-gst",
        title: "LedgerFlow",
        subtitle: "Business Operating System",
        description:
          "From quotation to GST filing — one system replacing spreadsheets, manual calculations, and month-end chaos.",
        year: 2025,
        mediaLabel: "LedgerFlow — product overview",
        mediaAspect: "3/2",
        mediaType: "image",
        mediaSrc: "/work/infinity-gst/cover.jpg",
        slug: "infinity-gst",
        outcome: "One source of truth — from the first quotation to the final GST return.",
        category: "Product · Design · Engineering",
        role: "Product, Design & Engineering — solo",
        problem: "A real business ran on spreadsheets, manual GST math, and month-end reconciliation chaos across two brands.",
        solution: "A business operating system: quotation → proforma → tax invoice → receipt → GST filing, all in one flow.",
        impact: "Eliminated manual reconciliation; GSTR-1/3B-ready output; now the single source of truth for Infinity Enterprises.",
        metrics: [
          { label: "Documents",   value: "5" },        // Quotation · Proforma · Invoice · Receipt · Expense
          { label: "GSTR-1 / 3B", value: "GST-ready" },
          { label: "Brands",      value: "2" },         // Ritera Publishing · Ratix Info Tech
        ],
        artifacts: ["GST-ready", "Auto filing", "Quotation", "Tax invoice", "Cash flow"],
        accent: { glowA: "rgba(70,130,255,0.18)", glowB: "rgba(0,200,150,0.13)" },
      },
      {
        id: "author-dashboard",
        title: "AuthorOS",
        subtitle: "Publishing Intelligence Platform",
        description:
          "Most publishing platforms stop at distribution. AuthorOS gives authors a single view of how their books actually perform after launch — sales, royalties, distribution reach, and reader engagement.",
        year: 2024,
        mediaLabel: "AuthorOS — author workspace: book performance, sales, royalties",
        mediaAspect: "3/2",
        mediaType: "image",
        mediaSrc: "/work/author-dashboard/cover.jpg",
        slug: "author-dashboard",
        outcome: "Visibility beyond publication — distribution, sales, and royalties in one place.",
        category: "Product · Design · Engineering",
        role: "Product, Design & Engineering — solo",
        challenge: "Authors publish across multiple marketplaces, then go blind — sales data is fragmented across channels, and the only way to know how a book performs is to request a report and wait.",
        problem: "After publishing, authors went blind — sales fragmented per channel, royalties reconciled by hand, reports only on request.",
        solution: "One workspace unifying distribution, sales, royalties, and reader engagement per book — across every marketplace.",
        impact: "Replaced manual, on-request reporting with live post-launch visibility authors never had before.",
        metrics: [
          { label: "Distribution",     value: "Multi-channel" },
          { label: "Royalty tracking", value: "Per book"      },
          { label: "Visibility",       value: "Post-launch"   },
        ],
        artifacts: ["Publishing", "Royalties", "Distribution", "Reader Reach", "Book Performance"],
        accent: { glowA: "rgba(170,60,80,0.16)", glowB: "rgba(255,180,80,0.13)" },
      },
      {
        id: "trackpwd",
        title: "TrackPWD",
        subtitle: "Security Platform",
        description:
          "Credential monitoring without storing a single secret — privacy-first by architecture.",
        year: 2023,
        mediaLabel: "TrackPWD — product screenshot",
        mediaAspect: "16/10",
        mediaType: "image",
        slug: "trackpwd",
        outcome: "Zero-storage architecture. Handles 10k checks/day on a $4/mo server.",
        category: "Engineering · Automation · Security",
        role: "Engineering & Architecture — solo", // !! PLACEHOLDER !!
        challenge: "Credential monitoring tools all required accounts, stored data, or sent secrets to third-party servers. That's the exact threat they're supposed to prevent.", // !! PLACEHOLDER !!
        problem: "Every credential-monitoring tool wanted accounts, stored data, or secrets sent to third parties — the exact threat they claim to prevent.",
        solution: "Privacy-first by architecture: credential monitoring that verifies exposure without ever storing a single secret.",
        impact: "Zero secrets stored · 10k+ checks/day · runs on a $4/mo server.",
        metrics: [
          { label: "Checks / day",  value: "10k+"  }, // !! PLACEHOLDER !!
          { label: "Server cost",   value: "$4/mo" }, // !! PLACEHOLDER !!
          { label: "Data stored",   value: "Zero"  }, // !! PLACEHOLDER !!
        ],
        artifacts: ["Security", "Monitoring", "Zero storage", "Automation"],
        accent: { glowA: "rgba(90,120,255,0.16)", glowB: "rgba(170,80,255,0.13)" },
      },
    ],
  },
  {
    id: "ar",
    label: "AR Experiences",
    sectionTitle: "AR / Spatial Experiences",
    description:
      "Immersive augmented reality for retail, architecture, and brand storytelling — public work, plus AR I've shipped under NDA.",
    gridStyle: "showcase",
    tint: { dot: "#6D5EF8", glowA: "rgba(109,94,248,0.09)", glowB: "rgba(34,211,238,0.06)" },
    items: [
      {
        id: "ar-spatial-retail",
        slug: "ar-spatial-retail",
        title: "Spatial Retail",
        description:
          "Interactive AR product try-on for e-commerce — visualize an item in your own space before you buy.",
        year: 2024,
        mediaLabel: "Spatial Retail AR",
        mediaAspect: "4/3",
        mediaType: "video",
        category: "AR · Retail · WebXR",
        accent: { glowA: "rgba(109,94,248,0.9)", glowB: "rgba(34,211,238,0.9)" },
      },
      {
        id: "ar-arch-viz",
        slug: "ar-arch-viz",
        title: "Architecture Viz",
        description:
          "Real-time AR walkthroughs for architectural projects — place a full building into any physical space.",
        year: 2023,
        mediaLabel: "Architecture Viz AR",
        mediaAspect: "4/3",
        mediaType: "video",
        category: "AR · Architecture · Real Estate",
        accent: { glowA: "rgba(34,211,238,0.9)", glowB: "rgba(43,107,255,0.9)" },
      },
      {
        id: "ar-brand-lens",
        slug: "ar-brand-lens",
        title: "Brand Lens",
        description:
          "Custom AR filters and interactive lenses for brand campaigns — built for reach, not gimmick.",
        year: 2023,
        mediaLabel: "Brand Lens AR",
        mediaAspect: "4/3",
        mediaType: "video",
        category: "AR · Branding · Social",
        accent: { glowA: "rgba(168,85,247,0.9)", glowB: "rgba(109,94,248,0.9)" },
      },
    ],
  },
  {
    id: "publishing",
    label: "Publishing",
    sectionTitle: "Publishing",
    description:
      "A full publishing operation — from a repeatable cover system to print-ready interiors and the workflow that ships them.",
    gridStyle: "showcase",
    tint: { dot: "#962D4B", glowA: "rgba(150,45,75,0.08)", glowB: "rgba(212,160,60,0.06)" },
    items: [
      {
        id: "pub-cover-system",
        title: "Cover Design System",
        description:
          "A repeatable cover framework — type scale, grid, and color rules that keep a whole catalog visually consistent across dozens of titles.",
        year: 2024,
        mediaLabel: "Cover Design System",
        mediaAspect: "4/3",
        mediaType: "image",
        category: "Design · Systems",
        accent: { glowA: "rgba(150,45,75,0.9)", glowB: "rgba(212,160,60,0.9)" },
      },
      {
        id: "pub-interior",
        title: "Interior Formatting",
        description:
          "Production-ready interior layouts — typographic hierarchy, margins, and pagination tuned for both print and digital editions.",
        year: 2024,
        mediaLabel: "Interior Formatting",
        mediaAspect: "4/3",
        mediaType: "image",
        category: "Typesetting · Print",
        accent: { glowA: "rgba(212,160,60,0.9)", glowB: "rgba(150,45,75,0.9)" },
      },
      {
        id: "pub-workflow",
        title: "Publishing Workflow",
        description:
          "Manuscript to market — an editorial-to-distribution pipeline that turns a raw draft into a shipped, multi-channel book.",
        year: 2023,
        mediaLabel: "Publishing Workflow",
        mediaAspect: "4/3",
        mediaType: "image",
        category: "Process · Operations",
        accent: { glowA: "rgba(150,45,75,0.9)", glowB: "rgba(190,120,50,0.9)" },
      },
    ],
  },
];
