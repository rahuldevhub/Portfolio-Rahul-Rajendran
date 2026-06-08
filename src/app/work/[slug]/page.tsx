import { notFound } from "next/navigation";
import { work } from "@/content/work";

/**
 * Case study page.
 * Imports the corresponding MDX file via a static module map.
 * Static map (not template literals) required for webpack static analysis.
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
  "lead-crm": () => import("@/content/work/lead-crm.mdx"),
  "author-dashboard": () => import("@/content/work/author-dashboard.mdx"),
  trackpwd: () => import("@/content/work/trackpwd.mdx"),
};

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loader = modules[slug];
  if (!loader) return {};
  const mod = await loader();
  const meta = mod.meta;
  return {
    title: meta ? `${meta.title} — Rahul Rajendran` : "Case Study — Rahul Rajendran",
    description: meta?.description,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loader = modules[slug];
  if (!loader) notFound();

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
