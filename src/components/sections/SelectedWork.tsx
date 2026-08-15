"use client";

/**
 * Selected Work — four category tabs:
 *   Product Engineering  Editorial case study cards → /work/[slug]
 *   AR Experiences       2-col video-placeholder grid
 *   UI/UX Systems        3-col screen-placeholder grid
 *   Publishing           5-col portrait book-cover grid
 *
 * Tab switching uses AnimatePresence (mode="wait") for smooth panel cross-fade.
 * Active tab pill slides via motion layoutId — same pattern as Nav.
 * Reduced-motion: panel transitions disabled, all grids render statically.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  type MotionValue,
} from "motion/react";
import { Container, Placeholder } from "@/components/ui";
import {
  workCategories,
  creativeWorks,
  creativeWorksIntro,
  type SelectedWorkItem,
  type WorkMetric,
  type CreativeWorkItem,
} from "@/content/selected-work";

/* ── Shared card transition ─────────────────────────────────────────────── */
const CARD_TRANSITION = {
  type: "tween" as const,
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

/* ── Editorial shared pieces ────────────────────────────────────────────── */
function MetaRow({ index, category, year }: { index: number; category?: string; year: number }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        className="text-[11px] font-semibold tabular-nums tracking-[0.1em] uppercase"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.75 }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className="h-px flex-1"
        style={{ backgroundColor: "var(--border)", maxWidth: "2rem" }}
        aria-hidden="true"
      />
      <span
        className="text-xs font-medium"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
      >
        {category}
      </span>
      <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
        {year}
      </span>
    </div>
  );
}

function Metrics({ metrics }: { metrics?: WorkMetric[] }) {
  if (!metrics || metrics.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
      {metrics.map((m) => (
        <div key={m.label}>
          <p
            className="font-semibold tabular-nums tracking-[-0.02em]"
            style={{
              fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              lineHeight: 1.2,
            }}
          >
            {m.value}
          </p>
          <p
            className="mt-0.5 text-[11px] uppercase tracking-[0.08em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
          >
            {m.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function ReadStoryCTA({ outcome }: { outcome?: string }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
      {outcome && (
        <p
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", maxWidth: "38ch" }}
        >
          {outcome}
        </p>
      )}
      <div
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 group-hover:text-[var(--text)] shrink-0"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
      >
        Read the build story
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Pointer parallax — tiny cursor-following drift for the active visual ── */
function usePointerParallax(disabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      rawX.set(((e.clientX - cx) / cx) * 7); // ±7px drift
      rawY.set(((e.clientY - cy) / cy) * 7);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [disabled, rawX, rawY]);

  return { x, y };
}

type Parallax = { x: MotionValue<number>; y: MotionValue<number> };

/* ── Floating "proof of work" artifacts placed around the chapter visual ── */
const ARTIFACT_SLOTS: React.CSSProperties[] = [
  { top: "-3%", left: "-5%" },
  { top: "20%", right: "-6%" },
  { bottom: "14%", left: "-7%" },
  { bottom: "-4%", right: "9%" },
  { top: "50%", right: "-9%" },
];

function Artifact({
  label,
  slot,
  i,
  active,
}: {
  label: string;
  slot: React.CSSProperties;
  i: number;
  active: boolean;
}) {
  return (
    <span
      className="absolute z-10"
      style={{
        ...slot,
        // Fade/lift in when this chapter becomes active, staggered.
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: active ? `${0.2 + i * 0.08}s` : "0s",
      }}
    >
      {/* Continuous slow float — independent of the active-state fade above. */}
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }}
        className="block whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium"
        style={{
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.02em",
          color: "var(--text)",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid var(--border)",
          boxShadow: "0 6px 18px rgba(10,10,11,0.08)",
        }}
      >
        {label}
      </motion.span>
    </span>
  );
}

/* ── TrackPWD live visual ───────────────────────────────────────────────────
 *    TrackPWD has no real screenshot, but a blank placeholder made it the
 *    weakest of the three flagship cards. This renders a self-contained
 *    "monitoring console" mock — status header, a scan map with alert pins,
 *    a watched-credentials feed, and footer stats — so it reads as a real
 *    product alongside LedgerFlow and AuthorOS. ──────────────────────────── */
const TRACKPWD_FEED: { label: string; state: "safe" | "breach" | "scanning" }[] = [
  { label: "ops@infinity•••••", state: "safe" },
  { label: "admin@ritera•••••", state: "breach" },
  { label: "team@ratix•••••••", state: "safe" },
  { label: "billing@infinity••", state: "scanning" },
];

const FEED_META: Record<
  "safe" | "breach" | "scanning",
  { dot: string; text: string; label: string }
> = {
  safe:     { dot: "#16A34A", text: "#16A34A", label: "Secure" },
  breach:   { dot: "#E0245E", text: "#E0245E", label: "Breach found" },
  scanning: { dot: "#6D5EF8", text: "#6B6B70", label: "Scanning…" },
};

function TrackPwdVisual() {
  // A loose dotted "world" — a few rows of dots with two alert pins.
  const dots: { x: number; y: number }[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 13; c++) {
      // carve a rough continents silhouette by skipping edges/center gaps
      if ((r === 0 && (c < 2 || c > 10)) || (r === 4 && (c < 1 || c > 11))) continue;
      if (r === 2 && c === 6) continue;
      dots.push({ x: 8 + c * 7, y: 12 + r * 8 });
    }
  }

  return (
    <div
      className="w-full"
      style={{
        aspectRatio: "16 / 10",
        background: "linear-gradient(168deg, #0E1117 0%, #161B26 100%)",
        padding: "clamp(0.9rem, 1.6vw, 1.4rem)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.6rem, 1.1vw, 0.95rem)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#6D5EF8", boxShadow: "0 0 0 4px rgba(109,94,248,0.18)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.7rem",
              letterSpacing: "0.06em", color: "rgba(255,255,255,0.9)", fontWeight: 600,
            }}
          >
            TrackPWD · Monitor
          </span>
        </div>
        <span
          className="flex items-center gap-1.5 rounded-full px-2 py-1"
          style={{
            background: "rgba(22,163,74,0.14)", border: "1px solid rgba(22,163,74,0.3)",
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#4ADE80", letterSpacing: "0.04em" }}>
            LIVE
          </span>
        </span>
      </div>

      {/* Scan map */}
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.5rem" }}
      >
        <svg viewBox="0 0 100 48" style={{ width: "100%", display: "block" }} aria-hidden="true">
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={0.9} fill="rgba(255,255,255,0.16)" />
          ))}
          {/* alert pins */}
          <circle cx={64} cy={20} r={2.4} fill="#E0245E">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={64} cy={20} r={4.5} fill="none" stroke="#E0245E" strokeWidth={0.5} opacity={0.5}>
            <animate attributeName="r" values="2.4;6;2.4" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={26} cy={28} r={1.8} fill="#6D5EF8" opacity={0.9} />
        </svg>
      </div>

      {/* Watched-credentials feed */}
      <div className="flex flex-1 flex-col justify-between gap-1.5">
        {TRACKPWD_FEED.map((row) => {
          const m = FEED_META[row.state];
          return (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-md px-2.5 py-1.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "rgba(255,255,255,0.66)" }}>
                {row.label}
              </span>
              <span className="flex items-center gap-1.5">
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: m.dot }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: m.text, letterSpacing: "0.02em" }}>
                  {m.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div
        className="flex items-center justify-between pt-0.5"
        style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}
      >
        <span>10k+ checks / day</span>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>0 secrets stored</span>
      </div>
    </div>
  );
}

/* ── Chapter visual — ambient glow, mouse parallax, floating artifacts ──── */
function ChapterVisual({
  item,
  active,
  parallax,
}: {
  item: SelectedWorkItem;
  active: boolean;
  parallax?: Parallax;
}) {
  return (
    <motion.div className="relative" style={parallax ? { x: parallax.x, y: parallax.y } : undefined}>
      {/* Ambient color glow — gives each project its own atmosphere */}
      {item.accent && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[20%] -z-10"
          style={{
            background: `radial-gradient(58% 58% at 28% 30%, ${item.accent.glowA} 0%, transparent 72%), radial-gradient(54% 54% at 78% 76%, ${item.accent.glowB} 0%, transparent 72%)`,
            filter: "blur(64px)",
            opacity: active ? 1 : 0,
            transform: active ? "scale(1)" : "scale(0.82)",
            transition: "opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      )}

      {/* Floating proof-of-work artifacts (desktop only) */}
      {item.artifacts && item.artifacts.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden="true">
          {item.artifacts.slice(0, ARTIFACT_SLOTS.length).map((a, i) => (
            <Artifact key={a} label={a} slot={ARTIFACT_SLOTS[i]} i={i} active={active} />
          ))}
        </div>
      )}

      {/* Scale-in wrapper — image grows into place as the chapter activates */}
      <div
        style={{
          transform: active ? "scale(1)" : "scale(0.92)",
          transition: "transform 0.85s cubic-bezier(0.16,1,0.3,1)",
          transitionDelay: active ? "0.06s" : "0s",
        }}
      >
        {/* Depth layer — stacked-paper offset behind the main visual */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1.5 rotate-2 rounded-[calc(var(--radius-lg)+6px)]"
          style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", opacity: 0.55 }}
        />
        <div
          className="relative -rotate-1 overflow-hidden rounded-[var(--radius-lg)] transition-transform duration-700 ease-out group-hover:rotate-0 group-hover:scale-[1.01]"
          style={{ boxShadow: "0 2px 8px rgba(10,10,11,0.06), 0 26px 64px rgba(10,10,11,0.13)" }}
        >
          {item.id === "trackpwd" ? (
            <TrackPwdVisual />
          ) : item.mediaSrc ? (
            <img
              src={item.mediaSrc}
              alt={item.mediaLabel}
              loading="lazy"
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          ) : (
            <Placeholder
              label={item.mediaLabel}
              aspect={item.mediaAspect}
              type={item.mediaType}
              className="w-full"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Chapter copy block (text side) ─────────────────────────────────────── */
/* ── Problem → Solution → Impact — the "why this matters" block ──────────────
 *    Leads the editorial card copy with hiring-relevant substance (the outcome
 *    story) before any visuals. Falls back to the plain description if a project
 *    hasn't been given the structured framing yet. ─────────────────────────── */
function ProblemSolutionImpact({ item }: { item: SelectedWorkItem }) {
  if (!item.problem || !item.solution || !item.impact) {
    return (
      <p className="mt-4 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "42ch" }}>
        {item.description}
      </p>
    );
  }
  const rows: { label: string; value: string; accent?: boolean }[] = [
    { label: "Problem", value: item.problem },
    { label: "Solution", value: item.solution },
    { label: "Impact", value: item.impact, accent: true },
  ];
  return (
    <div className="mt-5 flex flex-col gap-3" style={{ maxWidth: "44ch" }}>
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[68px_1fr] gap-3">
          <span
            className="pt-[3px] text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{
              fontFamily: "var(--font-mono)",
              color: r.accent ? "var(--accent)" : "var(--text-muted)",
              opacity: r.accent ? 1 : 0.7,
            }}
          >
            {r.label}
          </span>
          <span
            className="text-[0.92rem] leading-[1.55]"
            style={{ color: r.accent ? "var(--text)" : "var(--text-muted)", fontWeight: r.accent ? 500 : 400 }}
          >
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChapterCopy({
  item,
  index,
  active,
}: {
  item: SelectedWorkItem;
  index: number;
  active: boolean;
}) {
  return (
    <div
      className="order-2 lg:order-1"
      style={{
        // Slide in from the left as the chapter activates.
        transform: active ? "translateX(0)" : "translateX(-26px)",
        transition: "transform 0.85s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: active ? "0.1s" : "0s",
      }}
    >
      <MetaRow index={index} category={item.category} year={item.year} />
      <h3
        className="font-semibold leading-[1.06] tracking-[-0.026em]"
        style={{
          fontSize: "clamp(2rem, 3.6vw, 3.1rem)",
          fontFamily: "var(--font-display)",
          color: "var(--text)",
        }}
      >
        {item.title}
      </h3>
      {item.subtitle && (
        <p
          className="mt-2 text-sm font-medium uppercase tracking-[0.12em]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.8 }}
        >
          {item.subtitle}
        </p>
      )}
      <ProblemSolutionImpact item={item} />
      <Metrics metrics={item.metrics} />
      <ReadStoryCTA outcome={item.outcome} />
    </div>
  );
}

/* ── Chapter card body (the white editorial "page") ─────────────────────── */
function ChapterCard({
  item,
  index,
  active,
  parallax,
}: {
  item: SelectedWorkItem;
  index: number;
  active: boolean;
  parallax?: Parallax;
}) {
  return (
    <Link href={`/work/${item.slug}`} className="group block" style={{ textDecoration: "none" }}>
      <div
        className="rounded-[clamp(20px,2.2vw,30px)] border p-[clamp(1.5rem,3.4vw,3.4rem)]"
        style={{
          backgroundColor: "var(--bg)",
          borderColor: "var(--border)",
          boxShadow: "0 1px 2px rgba(10,10,11,0.04), 0 34px 70px -28px rgba(10,10,11,0.22)",
        }}
      >
        <div className="grid items-center gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
          <ChapterCopy item={item} index={index} active={active} />
          <div className="order-1 lg:order-2">
            <ChapterVisual item={item} active={active} parallax={parallax} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Pinned chapter — absolutely stacked & centered inside the sticky frame.
 *    Only ONE card is visible at a time; cards crossfade in place so the frame
 *    never moves and never reveals empty space. ──────────────────────────── */
function PinnedCard({
  item,
  index,
  active,
  parallax,
}: {
  item: SelectedWorkItem;
  index: number;
  active: boolean;
  parallax: Parallax;
}) {
  return (
    <div
      className="absolute inset-x-0 top-1/2"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.97)",
        transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: active ? "auto" : "none",
        zIndex: active ? 2 : 1,
      }}
    >
      <ChapterCard item={item} index={index} active={active} parallax={parallax} />
    </div>
  );
}

/* ── Left-edge progress timeline (desktop only) ─────────────────────────── */
function ChapterRail({
  items,
  active,
  visible,
  progress,
  creativeActive,
}: {
  items: SelectedWorkItem[];
  active: number;
  visible: boolean;
  progress: MotionValue<number>;
  creativeActive: boolean;
}) {
  // Rail nodes = the flagship projects plus a final "Creative" destination so
  // the timeline resolves somewhere instead of trailing off after TrackPWD.
  const nodes = [
    ...items.map((it) => ({ key: it.id, label: it.title, creative: false })),
    { key: "creative", label: "Creative", creative: true },
  ];
  const creativeIndex = items.length;
  // Effective active index — jumps to the Creative node once it's in view.
  const effective = creativeActive ? creativeIndex : active;

  // During the deck, the smooth fill should reach the last project node
  // (fraction (n-1)/n of the track); the Creative node tops it off at 100%.
  const deckMax = `${((items.length - 1) / items.length) * 100}%`;
  const fillHeight = useTransform(progress, [0, 1], ["0%", deckMax]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 left-[clamp(1rem,3vw,2.5rem)] z-40 hidden -translate-y-1/2 min-[1520px]:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      <div className="relative flex flex-col gap-12">
        {/* Connecting timeline track (dot-centre to dot-centre) */}
        <div
          className="absolute w-[2px]"
          style={{ left: 6, top: 10, bottom: 10, backgroundColor: "var(--border)" }}
        />
        {/* Blue progress fill that grows as you scroll the deck */}
        <motion.div
          className="absolute w-[2px]"
          style={{
            left: 6,
            top: 10,
            height: creativeActive ? "calc(100% - 20px)" : fillHeight,
            maxHeight: "calc(100% - 20px)",
            backgroundColor: "var(--accent)",
            transition: "height 0.45s ease",
          }}
        />

        {nodes.map((node, i) => {
          const done = i < effective;
          const current = i === effective;
          const filled = current || done;
          return (
            <div key={node.key} className="relative z-10 flex h-5 items-center gap-3">
              <span
                className="flex items-center justify-center"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  flexShrink: 0,
                  // The Creative destination reads as a hollow ring target when
                  // current, distinguishing the category from the projects.
                  backgroundColor: node.creative
                    ? current
                      ? "var(--surface)"
                      : "var(--surface)"
                    : filled
                      ? "var(--accent)"
                      : "var(--surface)",
                  border: node.creative
                    ? `2px solid ${current ? "var(--accent)" : "var(--border)"}`
                    : filled
                      ? "none"
                      : "1.5px solid var(--border)",
                  boxShadow: current ? "0 0 0 4px rgba(43,107,255,0.16)" : "none",
                  transition: "all 0.35s ease",
                }}
              >
                {node.creative && current && (
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />
                )}
                {!node.creative && done && (
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.2l2 2 4-4.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.04em",
                  color: current ? "var(--text)" : "var(--text-muted)",
                  fontWeight: current ? 600 : 500,
                  opacity: current ? 1 : done ? 0.7 : 0.45,
                  transition: "all 0.35s ease",
                }}
              >
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Pinned crossfade deck — only mounted on wide screens. Isolated so the
 *    useScroll target ref is always attached to a live DOM node (mounting it
 *    conditionally in the parent left the ref un-hydrated → motion error). ── */
function PinnedDeck({
  items,
  creativeInView,
}: {
  items: SelectedWorkItem[];
  creativeInView: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const inView = useInView(containerRef, { margin: "-25% 0px -25% 0px" });
  const parallax = usePointerParallax(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Active chapter = which third of the deck's scroll range we're in.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length))));
  });

  return (
    <>
      <ChapterRail
        items={items}
        active={active}
        visible={inView || creativeInView}
        progress={scrollYProgress}
        creativeActive={creativeInView}
      />
      {/* Tall scroll track gives each chapter a full viewport of dwell time. */}
      <div ref={containerRef} className="relative" style={{ height: `${items.length * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="relative w-full">
            {items.map((item, i) => (
              <PinnedCard
                key={item.id}
                item={item}
                index={i}
                active={i === active}
                parallax={parallax}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Editorial grid (Product Engineering) — picks deck vs. flat stack ──────
 *    The pinned crossfade deck only makes sense on wide screens where the
 *    side-by-side card fits one viewport. On narrow screens (or reduced-motion)
 *    a card is taller than the viewport, so we fall back to a vertical stack. */
function EditorialGrid({
  items,
  creativeInView,
}: {
  items: SelectedWorkItem[];
  creativeInView: boolean;
}) {
  const shouldReduce = useReducedMotion();
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (shouldReduce || !isWide) {
    return (
      <div className="flex flex-col gap-[clamp(3rem,6vw,5.5rem)]">
        {items.map((item, i) => (
          <ChapterCard key={item.id} item={item} index={i} active />
        ))}
      </div>
    );
  }

  return <PinnedDeck items={items} creativeInView={creativeInView} />;
}

/* ── Showcase visual — per-item mini-mockup for the AR & Publishing tabs ─────
 *    No real captures yet, so each card gets a distinct built preview keyed by
 *    id: AR cards render a spatial/lens scene; Publishing cards render the
 *    production craft (cover system / interior spread / workflow). ─────────── */
function ShowcaseVisual({ item }: { item: SelectedWorkItem }) {
  const a = item.accent ?? { glowA: "rgba(43,107,255,0.9)", glowB: "rgba(109,94,248,0.9)" };
  const grad = `linear-gradient(135deg, ${a.glowA}, ${a.glowB})`;

  /* ── AR Experiences ─────────────────────────────────────────────── */
  if (item.id === "ar-spatial-retail") {
    return (
      <div className="relative h-full w-full" style={{ background: "linear-gradient(162deg,#10131B,#1C2334)" }}>
        <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g stroke="rgba(255,255,255,0.08)" strokeWidth="0.4">
            {[0, 1, 2, 3, 4].map((i) => <line key={`h${i}`} x1="-10" y1={58 + i * 8} x2="130" y2={58 + i * 8} />)}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <line key={`v${i}`} x1={i * 15} y1="58" x2={i * 15 - 20} y2="92" />)}
          </g>
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative" style={{ width: 84, height: 84 }}>
            {[
              "left-0 top-0 border-l-2 border-t-2",
              "right-0 top-0 border-r-2 border-t-2",
              "left-0 bottom-0 border-l-2 border-b-2",
              "right-0 bottom-0 border-r-2 border-b-2",
            ].map((c) => (
              <span key={c} className={`absolute h-3.5 w-3.5 ${c}`} style={{ borderColor: "rgba(255,255,255,0.85)" }} />
            ))}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: 50, height: 50, borderRadius: 13, background: grad, boxShadow: `0 16px 38px -8px ${a.glowB}` }}
            />
          </div>
        </div>
        <span className="absolute left-3 top-3 rounded px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.12)", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.12em", color: "#fff" }}>
          AR · PLACED
        </span>
      </div>
    );
  }

  if (item.id === "ar-arch-viz") {
    return (
      <div className="relative h-full w-full" style={{ background: "linear-gradient(162deg,#0F141D,#172234)" }}>
        <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g stroke="rgba(34,211,238,0.18)" strokeWidth="0.4">
            {[0, 1, 2, 3].map((i) => <line key={`h${i}`} x1="-10" y1={64 + i * 8} x2="130" y2={64 + i * 8} />)}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <line key={`v${i}`} x1={i * 15} y1="64" x2={i * 15 - 16} y2="92" />)}
          </g>
          {/* isometric building wireframe */}
          <g stroke="#22D3EE" strokeWidth="0.9" fill="rgba(34,211,238,0.06)" strokeLinejoin="round">
            <polygon points="60,18 86,32 86,60 60,74 34,60 34,32" />
            <line x1="60" y1="18" x2="60" y2="46" />
            <line x1="34" y1="32" x2="60" y2="46" />
            <line x1="86" y1="32" x2="60" y2="46" />
            <line x1="60" y1="46" x2="60" y2="74" />
          </g>
        </svg>
      </div>
    );
  }

  if (item.id === "ar-brand-lens") {
    return (
      <div className="relative h-full w-full" style={{ background: "linear-gradient(162deg,#15101F,#241636)" }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: grad, filter: "blur(1px)", boxShadow: `0 0 36px ${a.glowB}` }} />
        </div>
        <svg viewBox="0 0 120 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="60" cy="45" r="30" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" strokeDasharray="2 3" />
          <circle cx="60" cy="45" r="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
          {[[44, 30], [78, 36], [70, 62], [40, 56]].map(([x, y], i) => (
            <g key={i} fill="#fff" opacity="0.85">
              <path d={`M${x} ${y - 3} L${x + 1} ${y - 1} L${x + 3} ${y} L${x + 1} ${y + 1} L${x} ${y + 3} L${x - 1} ${y + 1} L${x - 3} ${y} L${x - 1} ${y - 1} Z`} />
            </g>
          ))}
        </svg>
        <span className="absolute left-3 top-3 rounded px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.12)", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.12em", color: "#fff" }}>
          LENS · LIVE
        </span>
      </div>
    );
  }

  /* ── Publishing ─────────────────────────────────────────────────── */
  if (item.id === "pub-cover-system") {
    const covers = [
      { band: "linear-gradient(135deg,#962D4B,#C2526E)" },
      { band: "linear-gradient(135deg,#B98A2E,#E6C264)" },
      { band: "linear-gradient(135deg,#7C2438,#A23E57)" },
    ];
    return (
      <div className="relative flex h-full w-full items-center justify-center gap-3 px-4" style={{ background: "#F3EEE4" }}>
        {/* system baseline grid */}
        <svg viewBox="0 0 120 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g stroke="rgba(150,45,75,0.07)" strokeWidth="0.4">
            {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1="0" y1={i * 18} x2="120" y2={i * 18} />)}
          </g>
        </svg>
        {covers.map((c, i) => (
          <div
            key={i}
            className="relative flex flex-col overflow-hidden rounded-sm"
            style={{ width: "26%", aspectRatio: "2/3", background: "#fff", boxShadow: "0 8px 20px -8px rgba(120,40,60,0.4), 0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <div style={{ height: "42%", background: c.band }} />
            <div className="flex flex-1 flex-col gap-1 p-1.5">
              <span style={{ height: 4, width: "85%", borderRadius: 2, background: "rgba(150,45,75,0.5)" }} />
              <span style={{ height: 3, width: "60%", borderRadius: 2, background: "rgba(10,10,11,0.18)" }} />
              <span className="mt-auto" style={{ height: 3, width: "40%", borderRadius: 2, background: "rgba(212,160,60,0.7)" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (item.id === "pub-interior") {
    const Page = ({ dropcap }: { dropcap?: boolean }) => (
      <div className="flex h-full flex-1 flex-col gap-1.5 p-3" style={{ background: "#FBF8F1" }}>
        {dropcap ? (
          <div className="flex gap-1.5">
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", lineHeight: 0.8, color: "#962D4B", fontWeight: 700 }}>A</span>
            <div className="flex flex-1 flex-col gap-1 pt-1">
              <span style={{ height: 3, borderRadius: 2, background: "rgba(10,10,11,0.16)" }} />
              <span style={{ height: 3, width: "92%", borderRadius: 2, background: "rgba(10,10,11,0.16)" }} />
            </div>
          </div>
        ) : (
          <span style={{ height: 3, width: "55%", borderRadius: 2, background: "rgba(150,45,75,0.45)" }} />
        )}
        {[...Array(6)].map((_, i) => (
          <span key={i} style={{ height: 3, width: `${[100, 96, 99, 94, 98, 70][i]}%`, borderRadius: 2, background: "rgba(10,10,11,0.13)" }} />
        ))}
        <span className="mt-auto self-center" style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "rgba(10,10,11,0.4)" }}>
          {dropcap ? "12" : "13"}
        </span>
      </div>
    );
    return (
      <div className="flex h-full w-full items-center justify-center p-4" style={{ background: "#EFE7D8" }}>
        <div className="flex h-[86%] w-[88%] overflow-hidden rounded-sm" style={{ boxShadow: "0 10px 28px -10px rgba(120,40,60,0.4)" }}>
          <Page dropcap />
          <div style={{ width: 1, background: "rgba(120,40,60,0.18)" }} />
          <Page />
        </div>
      </div>
    );
  }

  // pub-workflow — manuscript → edit → design → ship pipeline
  const steps = ["Manuscript", "Edit", "Design", "Ship"];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 px-5" style={{ background: "#F3EEE4" }}>
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <span
            className="flex items-center justify-center"
            style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: i === steps.length - 1 ? "linear-gradient(135deg,#962D4B,#D4A03C)" : "#fff",
              border: i === steps.length - 1 ? "none" : "1.5px solid rgba(150,45,75,0.4)",
              color: i === steps.length - 1 ? "#fff" : "#962D4B",
              fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600,
            }}
          >
            {i + 1}
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", fontWeight: 600, color: "#3A2730" }}>
            {s}
          </span>
          <span className="ml-2 h-px flex-1" style={{ background: "rgba(150,45,75,0.22)" }} />
          {i < steps.length - 1 && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="#962D4B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Showcase grid (AR & Publishing) — large glowing preview cards ───────────
 *    Replaces the old video/screen/book grids. Each card: a large built
 *    preview with the item's accent glow, then category / title / description.
 *    No timeline — that's exclusive to the Product Engineering tab. ────────── */
function ShowcaseGrid({ items }: { items: SelectedWorkItem[] }) {
  const shouldReduce = useReducedMotion();
  return (
    <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const a = item.accent ?? { glowA: "rgba(43,107,255,0.9)", glowB: "rgba(109,94,248,0.9)" };
        return (
          <motion.div
            key={item.id}
            initial={shouldReduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ ...CARD_TRANSITION, delay: i * 0.1 }}
          >
            <div className="group">
              {/* Large preview with ambient glow */}
              <div className="relative mb-4">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-[12%] -z-10 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(50% 50% at 28% 22%, ${a.glowA} 0%, transparent 70%), radial-gradient(52% 52% at 78% 82%, ${a.glowB} 0%, transparent 70%)`,
                    filter: "blur(40px)",
                  }}
                />
                <div
                  className="overflow-hidden rounded-[var(--radius-lg)] border"
                  style={{
                    borderColor: "var(--border)",
                    aspectRatio: "4 / 3",
                    boxShadow: "0 2px 8px rgba(10,10,11,0.05), 0 22px 50px -26px rgba(10,10,11,0.2)",
                  }}
                >
                  <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                    <ShowcaseVisual item={item} />
                  </div>
                </div>
              </div>

              {/* Meta */}
              <p
                className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.1em]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                {item.category}
              </p>
              <h3
                className="mb-1.5 font-semibold tracking-[-0.014em]"
                style={{
                  fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
                  fontFamily: "var(--font-display)",
                  color: "var(--text)",
                  lineHeight: 1.25,
                }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-[1.6]" style={{ color: "var(--text-muted)", maxWidth: "42ch" }}>
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Creative thumbnail — a tiny self-contained "preview" per card ───────────
 *    No real screenshots exist yet, so each card gets a distinct mini-mockup
 *    keyed by id (brand hero / publishing UI / 3D character / component grid).
 *    They read as real work instead of a blank dashboard chip. ────────────── */
function CreativeThumb({ item }: { item: CreativeWorkItem }) {
  const { from, to } = item.accent;
  const grad = `linear-gradient(135deg, ${from}, ${to})`;

  if (item.id === "forge-fitness") {
    // Story-driven brand hero — bold type + motion streaks
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ background: grad }}>
        <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={-10 + i * 30} y1={0} x2={20 + i * 30} y2={60} stroke="rgba(255,255,255,0.16)" strokeWidth={6} />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col justify-end p-3.5">
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", lineHeight: 0.95, color: "#fff", letterSpacing: "-0.02em", fontStyle: "italic" }}>
            FORGE
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            STRENGTH IN MOTION
          </span>
        </div>
      </div>
    );
  }

  if (item.id === "ritera-landing") {
    // Publishing UI preview — mini browser with a campaign hero
    return (
      <div className="relative h-full w-full overflow-hidden p-2.5" style={{ background: "var(--surface)" }}>
        <div className="flex h-full flex-col overflow-hidden rounded-md" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-1 px-2 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
            {["#E0245E", "#D4A03C", "#16A34A"].map((c) => (
              <span key={c} style={{ width: 5, height: 5, borderRadius: "50%", background: c, opacity: 0.6 }} />
            ))}
          </div>
          <div className="flex flex-1 gap-2 p-2.5">
            <div className="h-full w-1/3 rounded" style={{ background: grad }} />
            <div className="flex flex-1 flex-col justify-center gap-1.5">
              <span style={{ height: 5, width: "85%", borderRadius: 3, background: "var(--border)" }} />
              <span style={{ height: 5, width: "60%", borderRadius: 3, background: "var(--border)" }} />
              <span className="mt-1" style={{ height: 11, width: "55%", borderRadius: 5, background: grad }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (item.id === "personal-brand-experiments") {
    // 3D character / interactive preview — glowing orb with orbit rings
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ background: "linear-gradient(160deg, #11131A, #1B2030)" }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: grad, filter: "blur(2px)", boxShadow: `0 0 28px ${to}` }} />
        </div>
        <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <ellipse cx={50} cy={30} rx={32} ry={13} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.6} strokeDasharray="2 2" />
          <ellipse cx={50} cy={30} rx={20} ry={28} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.6} strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }

  // micro-ui-concepts — component grid preview
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1.5 p-2.5" style={{ background: "var(--surface)" }}>
      {/* toggle */}
      <div className="flex items-center justify-center rounded-md" style={{ background: "#fff", border: "1px solid var(--border)" }}>
        <div className="flex items-center rounded-full p-0.5" style={{ width: 26, background: grad }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff", marginLeft: "auto" }} />
        </div>
      </div>
      {/* button */}
      <div className="flex items-center justify-center rounded-md" style={{ background: "#fff", border: "1px solid var(--border)" }}>
        <span style={{ height: 10, width: 28, borderRadius: 5, background: grad }} />
      </div>
      {/* slider */}
      <div className="flex items-center justify-center rounded-md px-2" style={{ background: "#fff", border: "1px solid var(--border)" }}>
        <div className="relative h-1 w-full rounded-full" style={{ background: "var(--border)" }}>
          <span className="absolute -top-1 h-3 w-3 rounded-full" style={{ left: "55%", background: grad }} />
        </div>
      </div>
      {/* mini card */}
      <div className="flex flex-col justify-center gap-1 rounded-md px-2" style={{ background: "#fff", border: "1px solid var(--border)" }}>
        <span style={{ height: 4, width: "70%", borderRadius: 2, background: grad }} />
        <span style={{ height: 4, width: "45%", borderRadius: 2, background: "var(--border)" }} />
      </div>
    </div>
  );
}

/* ── Creative Works card ────────────────────────────────────────────────────
 *    Compact, glassy preview card. Secondary to the flagship deck by design.
 *    Now leads with a mini-thumbnail so it reads as real work; hover gives
 *    lift + border glow + ambient wash + thumbnail zoom + tag drift. ──────── */
function CreativeCard({
  item,
  index,
  shouldReduce,
}: {
  item: CreativeWorkItem;
  index: number;
  shouldReduce: boolean | null;
}) {
  const Wrapper = item.href ? "a" : "div";
  const wrapperProps = item.href
    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
    >
      <Wrapper
        {...wrapperProps}
        className="group relative flex h-[clamp(248px,25vw,290px)] flex-col overflow-hidden rounded-[var(--radius-lg)]"
        style={{
          textDecoration: "none",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--border)",
          transition:
            "transform 300ms cubic-bezier(0.16,1,0.3,1), border-color 300ms ease, box-shadow 300ms ease",
        }}
        onMouseEnter={(e) => {
          if (shouldReduce) return;
          const el = e.currentTarget;
          el.style.transform = "translateY(-8px)";
          el.style.borderColor = item.accent.from;
          el.style.boxShadow = `0 20px 48px -16px ${item.accent.to}, 0 0 0 1px ${item.accent.from}`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(0)";
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "none";
        }}
      >
        {/* Ambient glow — blurred two-stop gradient, revealed on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[30%] -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(50% 50% at 22% 18%, ${item.accent.from} 0%, transparent 70%), radial-gradient(54% 54% at 82% 88%, ${item.accent.to} 0%, transparent 70%)`,
            filter: "blur(44px)",
          }}
        />

        {/* Mini-thumbnail — zooms slightly on hover */}
        <div className="relative h-[clamp(112px,12vw,140px)] shrink-0 overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.05]">
            <CreativeThumb item={item} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col p-4">
          <h4
            className="font-semibold leading-[1.2] tracking-[-0.014em]"
            style={{
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
            }}
          >
            {item.title}
          </h4>
          <p className="mt-1 text-[0.78rem] leading-[1.4]" style={{ color: "var(--text-muted)" }}>
            {item.subtitle}
          </p>

          {/* Tags — drift up slightly on hover */}
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em]"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  background: "rgba(10,10,11,0.04)",
                  border: "1px solid var(--border)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}

/* ── Creative Works subsection ──────────────────────────────────────────────
 *    Lighter, experimental companion to the flagship deck. Held to ~20% of the
 *    visual weight — compact cards, glass surfaces, no large media.
 *    On wide screens it tucks up under the pinned deck (the deck's last card is
 *    centered, leaving a tall void below it) via a viewport-relative negative
 *    margin, so TrackPWD → Creative reads as one continuous section. ──────── */
function CreativeWorks({
  sectionRef,
  isWide,
}: {
  sectionRef: React.Ref<HTMLDivElement>;
  isWide: boolean;
}) {
  const shouldReduce = useReducedMotion();

  // gap ≈ 21rem − 50vh absorbs the pinned deck's centered-card void → ~110px.
  const marginTop = isWide ? "calc(21rem - 50vh)" : "clamp(3rem, 6vw, 4.5rem)";

  return (
    <div ref={sectionRef} style={{ marginTop }}>
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <p
          className="mb-1"
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)",
            color: "var(--accent-2)",
            lineHeight: 1,
          }}
        >
          {creativeWorksIntro.signature}
        </p>
        <h3
          className="font-semibold leading-[1.12] tracking-[-0.022em]"
          style={{
            fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
            fontFamily: "var(--font-display)",
            color: "var(--text)",
          }}
        >
          {creativeWorksIntro.heading}
        </h3>
        <p
          className="mt-2 text-sm leading-[1.6]"
          style={{ color: "var(--text-muted)", maxWidth: "56ch" }}
        >
          {creativeWorksIntro.subheading}
        </p>
      </motion.div>

      {/* 4-col desktop · 2-col tablet · 1-col mobile */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {creativeWorks.map((item, i) => (
          <CreativeCard key={item.id} item={item} index={i} shouldReduce={shouldReduce} />
        ))}
      </div>

      {/* Ongoing-work footer line */}
      <motion.p
        initial={shouldReduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="mt-8 text-[0.8rem]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.75 }}
      >
        <span style={{ color: "var(--accent)" }}>+</span> {creativeWorksIntro.footer}
      </motion.p>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────────────── */
export function SelectedWork() {
  const [activeId, setActiveId] = useState(workCategories[0].id);
  const shouldReduce = useReducedMotion();

  // Creative Works in-view drives the timeline rail's final "Creative" node.
  const creativeRef = useRef<HTMLDivElement>(null);
  const creativeInView = useInView(creativeRef, { margin: "-35% 0px -35% 0px" });

  // Wide-only: lets Creative Works tuck up under the pinned deck's trailing void.
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const active = workCategories.find((c) => c.id === activeId)!;

  return (
    <section
      id="work"
      style={{ backgroundColor: "var(--surface)" }}
      className="relative py-[clamp(4rem,7vw,8rem)]"
    >
      {/* Ambient section atmosphere — a very low-opacity brand glow that takes
          on the ACTIVE workspace's identity (blue / purple / burgundy) and
          crossfades when you switch tabs. No clipping here: an overflow on this
          sticky-deck ancestor would break the pinned timeline, so the glow
          layer is unclipped + pointer-safe. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeId}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background:
                `radial-gradient(40% 26% at 18% 8%, ${active.tint.glowA} 0%, transparent 70%),` +
                `radial-gradient(46% 30% at 84% 40%, ${active.tint.glowB} 0%, transparent 70%),` +
                `radial-gradient(44% 28% at 16% 84%, ${active.tint.glowA} 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>
      </div>
      <div className="relative z-10">
      <Container>
        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          className="mb-[clamp(2rem,3.5vw,3rem)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
          >
            Work
          </p>
          <h2
            className="font-semibold leading-[1.08] tracking-[-0.026em]"
            style={{
              fontSize: "clamp(2.1rem, 4vw, 3.75rem)",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
            }}
          >
            Built across every layer.
          </h2>
        </motion.div>

        {/* ── Browser-style workspace switcher ─────────────────────────────
            A floating window chrome (traffic lights + tab strip) that frames the
            categories as different "workspaces" rather than a generic segmented
            control. Active tab = elevated white pill (layoutId morph) with an
            accent bottom-highlight; inactive = translucent + muted, brighter on
            hover. Each tab carries its workspace's colored dot. ─────────────── */}
        <div className="mb-8 -mx-[clamp(1.5rem,5vw,2.5rem)] overflow-x-auto px-[clamp(1.5rem,5vw,2.5rem)]" style={{ WebkitOverflowScrolling: "touch" }}>
          <div
            className="inline-flex items-center gap-3 rounded-[14px] border px-3 py-2.5"
            style={{
              minWidth: "max-content",
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "0 1px 2px rgba(10,10,11,0.04), 0 18px 40px -28px rgba(10,10,11,0.3)",
            }}
          >
            {/* traffic lights */}
            <div className="flex items-center gap-[7px] pl-1" aria-hidden="true">
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: c, opacity: 0.9 }} />
              ))}
            </div>

            <span className="h-5 w-px" style={{ backgroundColor: "var(--border)" }} aria-hidden="true" />

            {/* tabs */}
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Work categories">
              {workCategories.map((cat) => {
                const isActive = cat.id === activeId;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveId(cat.id)}
                    className="group relative flex items-center gap-2 rounded-[9px] px-3.5 py-2 text-sm transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--text)" : "var(--text-muted)",
                      background: isActive ? "transparent" : "rgba(255,255,255,0.5)",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.85)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="work-tab-bg"
                        className="absolute inset-0 rounded-[9px]"
                        style={{
                          backgroundColor: "#fff",
                          boxShadow: "0 1px 2px rgba(10,10,11,0.06), 0 8px 20px -10px rgba(10,10,11,0.25)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="work-tab-underline"
                        className="absolute bottom-1 left-1/2 h-[2.5px] -translate-x-1/2 rounded-full"
                        style={{ width: "55%", backgroundColor: cat.tint.dot }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span
                      className="relative z-10"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: cat.tint.dot,
                        boxShadow: isActive ? `0 0 0 3px ${cat.tint.dot}26` : "none",
                        opacity: isActive ? 1 : 0.6,
                        transition: "opacity 0.3s ease, box-shadow 0.3s ease",
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                    <span className="relative z-10 whitespace-nowrap">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Category description ────────────────────────────────────────── */}
        <p
          className="mb-10 text-sm leading-[1.65]"
          style={{ color: "var(--text-muted)", maxWidth: "52ch" }}
        >
          {active.description}
        </p>

        {/* ── Tab panels ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeId}
            initial={shouldReduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {active.gridStyle === "editorial" && <EditorialGrid items={active.items} creativeInView={creativeInView} />}
            {active.gridStyle === "showcase"  && <ShowcaseGrid  items={active.items} />}

            {/* Creative Works — companion gallery, only under Product Engineering */}
            {active.id === "product-engineering" && (
              <CreativeWorks sectionRef={creativeRef} isWide={isWide} />
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
      </div>
    </section>
  );
}
