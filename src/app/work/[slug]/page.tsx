import { notFound } from "next/navigation";
import { work } from "@/content/work";
import { workCategories, type SelectedWorkItem } from "@/content/selected-work";

/**
 * Case study page.
 * Imports the corresponding MDX file via a static module map.
 * Static map (not template literals) required for webpack static analysis.
 *
 * Projects that don't have a full MDX case study yet (currently the public
 * AR items) still get a real /work/[slug] page — a compact, data-driven
 * fallback built directly from the existing Selected Work content, reusing
 * the same header treatment as the MDX case studies below. This keeps the
 * routing/data structure reusable without inventing case-study content that
 * doesn't exist yet.
 */

type CaseStudyModule = {
  default: React.ComponentType;
  meta?: {
    title: string;
    description: string;
    category: string;
    year: number;
    outcome: string;
  };
};

const modules: Record<string, () => Promise<CaseStudyModule>> = {
  "infinity-gst": () => import("@/content/work/infinity-gst.mdx"),
  "author-dashboard": () => import("@/content/work/author-dashboard.mdx"),
  trackpwd: () => import("@/content/work/trackpwd.mdx"),
};

/** Every Selected Work item that has a slug but no MDX module above. */
const dataOnlyItems: SelectedWorkItem[] = workCategories
  .flatMap((cat) => cat.items)
  .filter((item): item is SelectedWorkItem & { slug: string } => Boolean(item.slug) && !modules[item.slug!]);

function findDataItem(slug: string) {
  return dataOnlyItems.find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return [
    ...work.map((item) => ({ slug: item.slug })),
    ...dataOnlyItems.map((item) => ({ slug: item.slug! })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loader = modules[slug];
  if (loader) {
    const mod = await loader();
    const meta = mod.meta;
    return {
      title: meta ? `${meta.title} — Rahul Rajendran` : "Case Study — Rahul Rajendran",
      description: meta?.description,
    };
  }
  const item = findDataItem(slug);
  if (!item) return {};
  return {
    title: `${item.title} — Rahul Rajendran`,
    description: item.description,
  };
}

/** Compact fallback for projects without a full MDX case study yet. */
function DataOnlyCaseStudy({ item }: { item: SelectedWorkItem }) {
  return (
    <article>
      <header style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="mb-5 flex items-center gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
          >
            {item.category}
          </span>
          <span className="text-xs" style={{ color: "var(--border)" }} aria-hidden="true">·</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.year}</span>
        </div>

        <h1
          className="mb-5 font-semibold leading-[1.08] tracking-[-0.026em]"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          {item.title}
        </h1>

        <p className="mb-6 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "48ch" }}>
          {item.description}
        </p>

        <div className="mt-8 h-px" style={{ backgroundColor: "var(--border)" }} aria-hidden="true" />
      </header>

      <p
        className="rounded-[14px] border px-5 py-4 text-sm leading-[1.6]"
        style={{ color: "var(--text-muted)", borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        Full write-up coming soon — this project doesn&rsquo;t have a complete case study yet.
      </p>
    </article>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loader = modules[slug];

  if (!loader) {
    const item = findDataItem(slug);
    if (!item) notFound();
    return <DataOnlyCaseStudy item={item} />;
  }

  const mod = await loader();
  const Content = mod.default;
  const meta = mod.meta;

  return (
    <article>
      {/* ── Case study header ────────────────────────────────────────────── */}
      {meta && (
        <header style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          {/* Category + year */}
          <div
            className="mb-5 flex items-center gap-3"
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
            >
              {meta.category}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--border)" }}
              aria-hidden="true"
            >
              ·
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {meta.year}
            </span>
          </div>

          {/* Title */}
          <h1
            className="mb-5 font-semibold leading-[1.08] tracking-[-0.026em]"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
            }}
          >
            {meta.title}
          </h1>

          {/* Description */}
          <p
            className="mb-6 text-base leading-[1.7]"
            style={{ color: "var(--text-muted)", maxWidth: "48ch" }}
          >
            {meta.description}
          </p>

          {/* Outcome */}
          <p
            className="text-sm font-medium"
            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
          >
            {meta.outcome}
          </p>

          {/* Divider */}
          <div
            className="mt-8 h-px"
            style={{ backgroundColor: "var(--border)" }}
            aria-hidden="true"
          />
        </header>
      )}

      {/* ── MDX content ──────────────────────────────────────────────────── */}
      <Content />
    </article>
  );
}
