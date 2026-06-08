import type { MDXComponents } from "mdx/types";
import { Placeholder } from "@/components/ui";

/**
 * Global MDX component overrides.
 * Required by Next.js App Router when using @next/mdx.
 * Components defined here are available in all .mdx files without importing.
 */
export function useMDXComponents(): MDXComponents {
  return {
    // Make Placeholder available in MDX files for screenshot slots
    Placeholder,

    // Prose overrides — keep these minimal; prose styling is in the layout
    h1: (props) => (
      <h1
        style={{
          fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: "-0.024em",
          color: "var(--text)",
          fontFamily: "var(--font-display)",
          marginBottom: "1.25rem",
          marginTop: "2.5rem",
        }}
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        style={{
          fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.018em",
          color: "var(--text)",
          fontFamily: "var(--font-display)",
          marginBottom: "1rem",
          marginTop: "2.25rem",
        }}
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--text)",
          fontFamily: "var(--font-display)",
          marginBottom: "0.75rem",
          marginTop: "2rem",
        }}
        {...props}
      />
    ),
    p: (props) => (
      <p
        style={{
          fontSize: "1rem",
          lineHeight: 1.75,
          color: "var(--text-muted)",
          marginBottom: "1.25rem",
        }}
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        style={{
          paddingLeft: "1.25rem",
          marginBottom: "1.25rem",
          color: "var(--text-muted)",
          lineHeight: 1.75,
        }}
        {...props}
      />
    ),
    li: (props) => (
      <li style={{ marginBottom: "0.4rem" }} {...props} />
    ),
    hr: () => (
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--border)",
          marginTop: "2.5rem",
          marginBottom: "2.5rem",
        }}
      />
    ),
    blockquote: (props) => (
      <blockquote
        style={{
          borderLeft: "2px solid var(--accent)",
          paddingLeft: "1.25rem",
          marginLeft: 0,
          marginBottom: "1.25rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
        {...props}
      />
    ),
    strong: (props) => (
      <strong style={{ color: "var(--text)", fontWeight: 600 }} {...props} />
    ),
    code: (props) => (
      <code
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.875em",
          backgroundColor: "var(--surface)",
          padding: "0.15em 0.35em",
          borderRadius: "3px",
          color: "var(--text)",
        }}
        {...props}
      />
    ),
  };
}
