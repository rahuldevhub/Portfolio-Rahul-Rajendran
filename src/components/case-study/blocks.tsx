/**
 * Case-study MDX building blocks.
 *
 * Presentational, server-safe (no hooks) components used inside .mdx case
 * studies to shift the page from "wall of text" to "design artifact":
 *
 *   <MacWindow>      — macOS / browser window chrome around a screenshot.
 *                      Renders a labeled Placeholder until a real `src` is set.
 *   <Cards><Card>    — responsive card grid (numbered approach cards or
 *                      icon/title/desc feature cards).
 *   <Checklist><Check> — outcome-driven checkmark list.
 *   <BuiltWith>      — compact tech-stack chip row.
 *
 * All visual values come from the global design tokens in globals.css.
 */

import { Fragment } from "react";
import { Placeholder } from "@/components/ui";

/* ── MacWindow / BrowserFrame ───────────────────────────────────────────── */

interface MacWindowProps {
  /** Real screenshot path (e.g. "/work/infinity-gst/dashboard.png"). When
   *  omitted, a labeled Placeholder renders inside the chrome instead. */
  src?: string;
  /** Alt text / placeholder label describing the screen. */
  label: string;
  /** Aspect ratio "w/h" — keeps layout stable before the image loads. */
  aspect?: string;
  /** Caption shown beneath the frame. */
  caption?: string;
  /** "mac" = traffic lights only · "browser" = traffic lights + URL pill. */
  variant?: "mac" | "browser";
  /** URL shown in the browser pill (variant="browser"). */
  url?: string;
}

export function MacWindow({
  src,
  label,
  aspect = "16/10",
  caption,
  variant = "mac",
  url = "infinitygst.app",
}: MacWindowProps) {
  return (
    <figure style={{ margin: "2.25rem 0" }}>
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          overflow: "hidden",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.04), 0 18px 40px -12px rgba(0,0,0,0.18)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg)",
          }}
        >
          {/* Traffic lights */}
          <span style={{ display: "flex", gap: "6px" }} aria-hidden="true">
            <span style={dot("#FF5F57")} />
            <span style={dot("#FEBC2E")} />
            <span style={dot("#28C840")} />
          </span>

          {variant === "browser" && (
            <span
              style={{
                marginLeft: "8px",
                flex: 1,
                maxWidth: "260px",
                padding: "3px 12px",
                borderRadius: "999px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {url}
            </span>
          )}
        </div>

        {/* Body */}
        {src ? (
          <img
            src={src}
            alt={label}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              aspectRatio: aspect,
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        ) : (
          <Placeholder label={label} aspect={aspect} className="rounded-none" />
        )}
      </div>

      {caption && (
        <figcaption
          style={{
            marginTop: "0.75rem",
            textAlign: "center",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            letterSpacing: "0.04em",
            color: "var(--text-muted)",
            opacity: 0.8,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function dot(color: string): React.CSSProperties {
  return {
    width: "11px",
    height: "11px",
    borderRadius: "999px",
    background: color,
    display: "inline-block",
  };
}

/* ── Card grid ──────────────────────────────────────────────────────────── */

export function Cards({
  children,
  cols = 3,
}: {
  children: React.ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={
        cols === 2
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
          : "grid grid-cols-1 gap-4 sm:grid-cols-3"
      }
      style={{ margin: "1.75rem 0" }}
    >
      {children}
    </div>
  );
}

export function Card({
  index,
  tag,
  title,
  desc,
}: {
  /** "01" style ordinal — for numbered approach cards. */
  index?: string;
  /** Small caps label above the title — for feature cards. */
  tag?: string;
  title: string;
  /** Body copy. Passed as a prop (not children) so MDX doesn't wrap it in
   *  its own <p>, which would nest invalidly inside this card's <p>. */
  desc: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg, 14px)",
        padding: "1.25rem 1.25rem 1.4rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {index && (
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.06em",
          }}
        >
          {index}
        </span>
      )}
      {tag && (
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            opacity: 0.8,
          }}
        >
          {tag}
        </span>
      )}
      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.02rem",
          fontWeight: 600,
          lineHeight: 1.25,
          letterSpacing: "-0.014em",
          color: "var(--text)",
          margin: 0,
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          color: "var(--text-muted)",
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ── Outcome checklist ──────────────────────────────────────────────────── */

export function Checklist({ children }: { children: React.ReactNode }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: "1.5rem 0",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
    >
      {children}
    </ul>
  );
}

export function Check({ children }: { children: React.ReactNode }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        color: "var(--text)",
        fontSize: "1rem",
        lineHeight: 1.55,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          marginTop: "3px",
          width: "20px",
          height: "20px",
          borderRadius: "999px",
          background: "color-mix(in srgb, var(--accent) 12%, transparent)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.2L5 8.7l4.5-5"
            stroke="var(--accent)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}

/* ── Flow pipeline (The System) ─────────────────────────────────────────── */

export function Flow({
  steps,
}: {
  steps: { label: string; note?: string }[];
}) {
  return (
    <div
      style={{
        margin: "2rem auto",
        maxWidth: "380px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {steps.map((s, i) => (
        <Fragment key={s.label}>
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0.7rem 1rem",
              textAlign: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "var(--text)",
                lineHeight: 1.3,
              }}
            >
              {s.label}
            </div>
            {s.note && (
              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--text-muted)",
                  marginTop: "3px",
                }}
              >
                {s.note}
              </div>
            )}
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "26px",
              }}
              aria-hidden="true"
            >
              <svg width="14" height="26" viewBox="0 0 14 26" fill="none">
                <path d="M7 0 V18" stroke="var(--accent)" strokeWidth="1.5" />
                <path
                  d="M2.8 13.5 L7 19 L11.2 13.5"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

/* ── Scope grid (What I Built) ──────────────────────────────────────────── */

export function Scope({ items }: { items: string[] }) {
  return (
    <div
      className="grid grid-cols-1 gap-x-7 gap-y-3 sm:grid-cols-2"
      style={{ margin: "1.5rem 0" }}
    >
      {items.map((it) => (
        <div
          key={it}
          style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}
        >
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              marginTop: "8px",
              width: "6px",
              height: "6px",
              borderRadius: "2px",
              background: "var(--text-muted)",
              opacity: 0.55,
            }}
          />
          <span
            style={{ fontSize: "0.92rem", lineHeight: 1.5, color: "var(--text)" }}
          >
            {it}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Built With chip row ────────────────────────────────────────────────── */

export function BuiltWith({ items }: { items: string[] }) {
  return (
    <div style={{ margin: "1.25rem 0 0.5rem" }}>
      <p
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-muted)",
          marginBottom: "0.75rem",
        }}
      >
        Built with
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {items.map((it) => (
          <span
            key={it}
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "12px",
              color: "var(--text-muted)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              padding: "4px 12px",
            }}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
