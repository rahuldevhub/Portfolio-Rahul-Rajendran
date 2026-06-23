/**
 * Selected Work — all four categories.
 * Product Engineering items reuse the same slugs as case study MDX files.
 * All other items use labeled Placeholder media, trivial to replace with real assets.
 */

export type MediaType = "image" | "video";
export type GridStyle = "editorial" | "video-grid" | "screen-grid" | "book-grid";

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
  /** Short "proof of work" tags that float around the chapter visual */
  artifacts?: string[];
}

export interface WorkCategoryData {
  id: string;
  label: string;
  description: string;
  gridStyle: GridStyle;
  items: SelectedWorkItem[];
}

export const workCategories: WorkCategoryData[] = [
  {
    id: "product-engineering",
    label: "Product Engineering",
    description:
      "Full-stack products built end-to-end — from problem framing to production.",
    gridStyle: "editorial",
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
        metrics: [
          { label: "Documents",   value: "5" },        // Quotation · Proforma · Invoice · Receipt · Expense
          { label: "GSTR-1 / 3B", value: "GST-ready" },
          { label: "Brands",      value: "2" },         // Ritera Publishing · Ratix Info Tech
        ],
        artifacts: ["GST-ready", "Auto filing", "Quotation", "Tax invoice", "Cash flow"],
      },
      {
        id: "author-dashboard",
        title: "Author Dashboard",
        subtitle: "Publishing Platform",
        description:
          "From writing drafts to understanding readers — one workspace for the whole publishing loop.",
        year: 2024,
        mediaLabel: "Author Dashboard — product screenshot",
        mediaAspect: "16/10",
        mediaType: "image",
        slug: "author-dashboard",
        outcome: "Shipped from zero to 200 active writers in 6 weeks.",
        category: "Product · Design · Engineering",
        role: "Product, Design & Engineering — solo", // !! PLACEHOLDER !!
        challenge: "Writers were toggling between 4 tools to write, publish, and track readers. Every context-switch killed momentum.", // !! PLACEHOLDER !!
        metrics: [
          { label: "Active writers",  value: "200"    }, // !! PLACEHOLDER !!
          { label: "Time to launch",  value: "6 weeks" }, // !! PLACEHOLDER !!
          { label: "Integrations",    value: "8"       }, // !! PLACEHOLDER !!
        ],
        artifacts: ["Publishing", "Analytics", "Engagement", "Audience"],
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
        metrics: [
          { label: "Checks / day",  value: "10k+"  }, // !! PLACEHOLDER !!
          { label: "Server cost",   value: "$4/mo" }, // !! PLACEHOLDER !!
          { label: "Data stored",   value: "Zero"  }, // !! PLACEHOLDER !!
        ],
        artifacts: ["Security", "Monitoring", "Zero storage", "Automation"],
      },
    ],
  },
  {
    id: "ar",
    label: "AR Experiences",
    description:
      "Immersive augmented reality for retail, architecture, and brand storytelling.",
    gridStyle: "video-grid",
    items: [
      {
        id: "ar-spatial-retail",
        title: "Spatial Retail",
        description:
          "Interactive AR product try-on for e-commerce — visualize in your space before you buy.",
        year: 2024,
        mediaLabel: "Spatial Retail AR — demo video",
        mediaAspect: "16/9",
        mediaType: "video",
        category: "AR · Retail · WebXR",
      },
      {
        id: "ar-arch-viz",
        title: "Architecture Viz",
        description:
          "Real-time AR walkthrough for architectural projects — place a building in any physical space.",
        year: 2023,
        mediaLabel: "Architecture Viz AR — demo video",
        mediaAspect: "16/9",
        mediaType: "video",
        category: "AR · Architecture · Real Estate",
      },
      {
        id: "ar-brand-lens",
        title: "Brand Lens",
        description:
          "Custom AR filters and interactive lenses for brand campaigns — built for reach, not gimmick.",
        year: 2023,
        mediaLabel: "Brand Lens AR — demo video",
        mediaAspect: "16/9",
        mediaType: "video",
        category: "AR · Branding · Social",
      },
    ],
  },
  {
    id: "ui-ux",
    label: "UI/UX Systems",
    description:
      "Design systems and interface frameworks built for scale — tokens to components to patterns.",
    gridStyle: "screen-grid",
    items: [
      {
        id: "design-system-core",
        title: "Design System Core",
        description:
          "A token-based design system with 200+ components, full dark mode, and multi-brand theming support.",
        year: 2024,
        mediaLabel: "Design System Core — component library",
        mediaAspect: "4/3",
        mediaType: "image",
        category: "Design System · Tokens · Figma",
      },
      {
        id: "dashboard-framework",
        title: "Dashboard Framework",
        description:
          "A data-dense layout system for SaaS products — complex information made clear without sacrificing density.",
        year: 2024,
        mediaLabel: "Dashboard Framework — UI screens",
        mediaAspect: "4/3",
        mediaType: "image",
        category: "Dashboard · SaaS · Data Viz",
      },
      {
        id: "mobile-ux",
        title: "Mobile App UX",
        description:
          "End-to-end mobile UX for a consumer fintech app — from discovery flows to production-ready specs.",
        year: 2023,
        mediaLabel: "Mobile App UX — screens",
        mediaAspect: "4/3",
        mediaType: "image",
        category: "Mobile · Fintech · UX",
      },
    ],
  },
  {
    id: "publishing",
    label: "Publishing",
    description:
      "Books and long-form work at the intersection of building, design, and systems thinking.",
    gridStyle: "book-grid",
    items: [
      {
        id: "book-product-builder",
        title: "The Product Builder",
        description:
          "A practical guide to shipping products from idea to market — for independent builders.",
        year: 2024,
        mediaLabel: "The Product Builder — book cover",
        mediaAspect: "2/3",
        mediaType: "image",
        category: "Product · Founders",
      },
      {
        id: "book-systems-thinking",
        title: "Systems Thinking for Makers",
        description:
          "How the parts connect — engineering, design, and business as one system.",
        year: 2023,
        mediaLabel: "Systems Thinking for Makers — book cover",
        mediaAspect: "2/3",
        mediaType: "image",
        category: "Systems · Strategy",
      },
      {
        id: "book-design-for-engineers",
        title: "Design for Engineers",
        description:
          "The visual thinking primer for technical founders who want to ship better products.",
        year: 2023,
        mediaLabel: "Design for Engineers — book cover",
        mediaAspect: "2/3",
        mediaType: "image",
        category: "Design · Engineering",
      },
      {
        id: "book-automate-to-amplify",
        title: "Automate to Amplify",
        description:
          "Workflow automation for solopreneurs — remove the repetitive, reclaim your judgment.",
        year: 2023,
        mediaLabel: "Automate to Amplify — book cover",
        mediaAspect: "2/3",
        mediaType: "image",
        category: "Automation · Productivity",
      },
      {
        id: "book-ar-storytellers",
        title: "AR for Storytellers",
        description:
          "Immersive experiences for brands and creators — a practitioner's guide to augmented reality.",
        year: 2022,
        mediaLabel: "AR for Storytellers — book cover",
        mediaAspect: "2/3",
        mediaType: "image",
        category: "AR · Creative",
      },
    ],
  },
];
