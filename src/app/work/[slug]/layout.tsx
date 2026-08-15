import Link from "next/link";
import { Container } from "@/components/ui";

/**
 * Case study layout.
 * Provides the back navigation, header padding, and prose container.
 * Content is rendered by page.tsx via MDX.
 */
export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      {/* ── Back navigation ──────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <Container>
          <div
            style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
            className="flex items-center"
          >
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", textDecoration: "none" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M12 7H2M6 3L2 7l4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All work
            </Link>
          </div>
        </Container>
      </div>

      {/* ── Case study content ───────────────────────────────────────────── */}
      <Container>
        <div
          className="py-[clamp(3rem,8vw,8rem)]"
          style={{ maxWidth: "720px" }}
        >
          {children}
        </div>
      </Container>
    </div>
  );
}
