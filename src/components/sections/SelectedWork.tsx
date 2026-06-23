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

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { Container, Placeholder } from "@/components/ui";
import { workCategories, type SelectedWorkItem, type WorkMetric } from "@/content/selected-work";

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
  reduced,
}: {
  label: string;
  slot: React.CSSProperties;
  i: number;
  reduced: boolean | null;
}) {
  return (
    <motion.span
      initial={reduced ? false : { opacity: 0, y: 14, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.09 }}
      className="absolute z-10 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium"
      style={{
        ...slot,
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
  );
}

/* ── Chapter visual — floating, layered, premium, ringed with artifacts ─── */
function ChapterVisual({ item, reduced }: { item: SelectedWorkItem; reduced: boolean | null }) {
  return (
    <div className="relative">
      {/* Floating proof-of-work artifacts (desktop only) */}
      {item.artifacts && item.artifacts.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden="true">
          {item.artifacts.slice(0, ARTIFACT_SLOTS.length).map((a, i) => (
            <Artifact key={a} label={a} slot={ARTIFACT_SLOTS[i]} i={i} reduced={reduced} />
          ))}
        </div>
      )}

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
        {item.mediaSrc ? (
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
  );
}

/* ── Chapter copy block (shared by sticky + static) ─────────────────────── */
function ChapterCopy({ item, index }: { item: SelectedWorkItem; index: number }) {
  return (
    <div className="order-2 lg:order-1">
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
      <p
        className="mt-4 text-base leading-[1.7]"
        style={{ color: "var(--text-muted)", maxWidth: "42ch" }}
      >
        {item.description}
      </p>
      <Metrics metrics={item.metrics} />
      <ReadStoryCTA outcome={item.outcome} />
    </div>
  );
}

/* ── Chapter card body (the white editorial "page") ─────────────────────── */
function ChapterCard({
  item,
  index,
  reduced,
}: {
  item: SelectedWorkItem;
  index: number;
  reduced: boolean | null;
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
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 42, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid items-center gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]"
        >
          <ChapterCopy item={item} index={index} />
          <div className="order-1 lg:order-2">
            <ChapterVisual item={item} reduced={reduced} />
          </div>
        </motion.div>
      </div>
    </Link>
  );
}

/* ── Sticky chapter — owns the full viewport with an opaque background, so the
 *    next chapter cleanly covers (replaces) the previous one as it rises. ── */
function Chapter({
  item,
  index,
  reduced,
}: {
  item: SelectedWorkItem;
  index: number;
  reduced: boolean | null;
}) {
  // A <div>, not a <section> — the global `section + section` border-top rule
  // would otherwise draw a hairline across each pinned chapter.
  return (
    <div
      className="sticky top-0 flex min-h-screen items-center"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="w-full">
        <ChapterCard item={item} index={index} reduced={reduced} />
      </div>
    </div>
  );
}

/* ── Left-edge chapter progress rail (desktop only) ─────────────────────── */
function ChapterRail({
  items,
  active,
  visible,
}: {
  items: SelectedWorkItem[];
  active: number;
  visible: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 left-[clamp(1rem,3vw,2.5rem)] z-40 hidden -translate-y-1/2 flex-col gap-4 min-[1520px]:flex"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      {items.map((it, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={it.id} className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center"
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: current ? "var(--text)" : done ? "var(--text-muted)" : "transparent",
                border: current || done ? "none" : "1.5px solid var(--border)",
                boxShadow: current ? "0 0 0 4px rgba(10,10,11,0.10)" : "none",
                transition: "all 0.35s ease",
              }}
            >
              {done && (
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.2l2 2 4-4.4" stroke="var(--bg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
              {it.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Editorial grid (Product Engineering) — scroll-driven chapter deck ───── */
function EditorialGrid({ items }: { items: SelectedWorkItem[] }) {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [railVisible, setRailVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Derive the active chapter (and rail visibility) from the deck's scroll
  // progress — robust where per-element scroll math is unreliable with sticky.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length)));
    setActive(next);
    setRailVisible(v > 0.005 && v < 0.995);
  });

  if (shouldReduce) {
    return (
      <div className="flex flex-col gap-[clamp(3rem,6vw,5.5rem)]">
        {items.map((item, i) => (
          <ChapterCard key={item.id} item={item} index={i} reduced />
        ))}
      </div>
    );
  }

  return (
    <>
      <ChapterRail items={items} active={active} visible={railVisible} />
      <div ref={containerRef} className="relative">
        {items.map((item, i) => (
          <Chapter key={item.id} item={item} index={i} reduced={shouldReduce} />
        ))}
      </div>
    </>
  );
}

/* ── Video grid (AR Experiences) ────────────────────────────────────────── */
function VideoGrid({ items }: { items: SelectedWorkItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...CARD_TRANSITION, delay: i * 0.07 }}
        >
          {/* Thumbnail */}
          <div className="group mb-4 overflow-hidden rounded-[var(--radius-lg)]">
            <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              <Placeholder
                label={item.mediaLabel}
                aspect={item.mediaAspect}
                type="video"
                className="w-full"
              />
            </div>
          </div>

          {/* Meta */}
          <div className="mb-1 flex items-center gap-2">
            <span
              className="text-[10px] font-semibold tabular-nums tracking-[0.1em] uppercase"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              {item.year}
            </span>
            <span
              className="h-px flex-1"
              style={{ backgroundColor: "var(--border)", maxWidth: "1.5rem" }}
              aria-hidden="true"
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
            >
              {item.category}
            </span>
          </div>

          <h3
            className="mb-1.5 font-semibold tracking-[-0.014em]"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </h3>
          <p
            className="text-sm leading-[1.6]"
            style={{ color: "var(--text-muted)" }}
          >
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Screen grid (UI/UX Systems) ────────────────────────────────────────── */
function ScreenGrid({ items }: { items: SelectedWorkItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...CARD_TRANSITION, delay: i * 0.07 }}
        >
          {/* Screen thumbnail */}
          <div className="group mb-4 overflow-hidden rounded-[var(--radius-lg)]">
            <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              <Placeholder
                label={item.mediaLabel}
                aspect={item.mediaAspect}
                type="image"
                className="w-full"
              />
            </div>
          </div>

          {/* Meta */}
          <p
            className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
          >
            {item.category}
          </p>

          <h3
            className="mb-1.5 font-semibold tracking-[-0.014em]"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </h3>
          <p
            className="text-sm leading-[1.6]"
            style={{ color: "var(--text-muted)" }}
          >
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Book grid (Publishing) ─────────────────────────────────────────────── */
function BookGrid({ items }: { items: SelectedWorkItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...CARD_TRANSITION, delay: i * 0.06 }}
        >
          {/* Book cover */}
          <div className="group mb-3 overflow-hidden rounded-[var(--radius-sm)]">
            <div
              className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <Placeholder
                label={item.mediaLabel}
                aspect={item.mediaAspect}
                type="image"
                className="w-full rounded-[var(--radius-sm)]"
              />
            </div>
          </div>

          <p
            className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
          >
            {item.year}
          </p>

          <h3
            className="font-semibold leading-[1.25] tracking-[-0.012em]"
            style={{
              fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
            }}
          >
            {item.title}
          </h3>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────────────── */
export function SelectedWork() {
  const [activeId, setActiveId] = useState(workCategories[0].id);
  const shouldReduce = useReducedMotion();

  const active = workCategories.find((c) => c.id === activeId)!;

  return (
    <section
      id="work"
      style={{ backgroundColor: "var(--surface)" }}
      className="relative py-[clamp(4rem,7vw,8rem)]"
    >
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

        {/* ── Category tabs ───────────────────────────────────────────────── */}
        <div
          className="mb-10 -mx-[clamp(1.5rem,5vw,2.5rem)] px-[clamp(1.5rem,5vw,2.5rem)] overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div
            className="flex gap-1 pb-px"
            style={{ minWidth: "max-content" }}
            role="tablist"
            aria-label="Work categories"
          >
            {workCategories.map((cat) => {
              const isActive = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(cat.id)}
                  className="relative rounded-[var(--radius-sm)] px-4 py-2.5 text-sm transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--text)" : "var(--text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="work-tab-bg"
                      className="absolute inset-0 rounded-[var(--radius-sm)]"
                      style={{ backgroundColor: "var(--surface)" }}
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  )}
                  <span className="relative">{cat.label}</span>
                </button>
              );
            })}
          </div>
          {/* Bottom rule */}
          <div
            className="h-px"
            style={{ backgroundColor: "var(--border)" }}
            aria-hidden="true"
          />
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
            {active.gridStyle === "editorial"  && <EditorialGrid  items={active.items} />}
            {active.gridStyle === "video-grid" && <VideoGrid      items={active.items} />}
            {active.gridStyle === "screen-grid"&& <ScreenGrid     items={active.items} />}
            {active.gridStyle === "book-grid"  && <BookGrid       items={active.items} />}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
