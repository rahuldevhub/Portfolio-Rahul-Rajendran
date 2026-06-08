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

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Container, Placeholder } from "@/components/ui";
import { workCategories, type SelectedWorkItem, type WorkMetric } from "@/content/selected-work";

/* ── Shared card transition ─────────────────────────────────────────────── */
const CARD_TRANSITION = {
  type: "tween" as const,
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

/* ── Editorial grid (Product Engineering) ──────────────────────────────── */
function EditorialGrid({ items }: { items: SelectedWorkItem[] }) {
  return (
    <div className="flex flex-col gap-[clamp(2rem,4vw,3.5rem)]">
      {items.map((item, i) => (
        <article key={item.id}>
          <Link
            href={`/work/${item.slug}`}
            className="group block"
            style={{ textDecoration: "none" }}
          >
            {/* Thumbnail */}
            <div
              className="mb-5 overflow-hidden rounded-[var(--radius-lg)]"
              style={{ maxHeight: "440px" }}
            >
              <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                <Placeholder
                  label={item.mediaLabel}
                  aspect={item.mediaAspect}
                  type={item.mediaType}
                  className="w-full"
                />
              </div>
            </div>

            {/* Meta row */}
            <div className="mb-3 flex items-center gap-3">
              <span
                className="text-[11px] font-semibold tabular-nums tracking-[0.1em] uppercase"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.75 }}
              >
                {String(i + 1).padStart(2, "0")}
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
                {item.category}
              </span>
              <span
                className="ml-auto text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {item.year}
              </span>
            </div>

            {/* Title + description */}
            <div>
              <h3
                className="mb-2 font-semibold leading-[1.15] tracking-[-0.018em]"
                style={{
                  fontSize: "clamp(1.35rem, 2vw, 1.85rem)",
                  fontFamily: "var(--font-display)",
                  color: "var(--text)",
                }}
              >
                {item.title}
              </h3>

              {/* Role line */}
              {item.role && (
                <p
                  className="mb-3 text-xs font-medium uppercase tracking-[0.08em]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.7 }}
                >
                  {item.role}
                </p>
              )}

              {/* Challenge */}
              {item.challenge && (
                <p
                  className="mb-4 border-l-2 pl-4 text-sm italic leading-[1.72]"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)", maxWidth: "52ch" }}
                >
                  {item.challenge}
                </p>
              )}

              <p
                className="text-sm leading-[1.65]"
                style={{ color: "var(--text-muted)", maxWidth: "52ch" }}
              >
                {item.description}
              </p>
            </div>

            {/* Metrics row */}
            {item.metrics && item.metrics.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                {(item.metrics as WorkMetric[]).map((m) => (
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
            )}

            {/* CTA + outcome */}
            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
              >
                {item.outcome}
              </p>
              <div
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 group-hover:text-[var(--text)] shrink-0"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
              >
                View case study
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
          </Link>

          {/* Separator */}
          {i < items.length - 1 && (
            <div
              className="mt-[clamp(2rem,4vw,3.5rem)] h-px"
              style={{ backgroundColor: "var(--border)" }}
              aria-hidden="true"
            />
          )}
        </article>
      ))}
    </div>
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
