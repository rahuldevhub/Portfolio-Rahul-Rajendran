/**
 * Work / case studies data.
 * Each entry maps to an MDX file at src/content/work/[slug].mdx
 */

export interface WorkItem {
  slug: string;
  title: string;
  description: string;
  /** Short category label — shown on cards */
  category: string;
  /** Year launched */
  year: number;
  /** Thumbnail placeholder label */
  thumbnailLabel: string;
  /** Thumbnail aspect ratio */
  thumbnailAspect?: string;
  /** Outcome / result summary — one line */
  outcome: string;
  /** Whether to feature prominently */
  featured?: boolean;
}

export const work: WorkItem[] = [
  {
    slug: "infinity-gst",
    title: "LedgerFlow",
    description:
      "A business operating system for a real Indian company — quotations, invoicing, expenses, cash flow, and GST filing connected as one financial lifecycle.",
    category: "Product · Design · Engineering",
    year: 2025,
    thumbnailLabel: "LedgerFlow — dashboard screenshot",
    thumbnailAspect: "16/9",
    outcome: "One source of truth — from the first quotation sent to the final GST return filed.",
    featured: true,
  },
  {
    slug: "author-dashboard",
    title: "Author Dashboard",
    description:
      "A writing and publishing workspace that connects content creation to audience analytics in one view.",
    category: "Product · Design · Engineering",
    year: 2024,
    thumbnailLabel: "Author Dashboard — product screenshot",
    thumbnailAspect: "16/9",
    outcome: "Shipped from zero to 200 active writers in 6 weeks.",
    featured: true,
  },
  {
    slug: "trackpwd",
    title: "TrackPWD",
    description:
      "A privacy-first password health tracker that audits credential exposure without storing any secrets.",
    category: "Engineering · Automation · Security",
    year: 2023,
    thumbnailLabel: "TrackPWD — product screenshot",
    thumbnailAspect: "16/9",
    outcome: "Zero-storage architecture. Handles 10k checks/day on a $4/mo server.",
    featured: true,
  },
];
