"use client";

/**
 * Work section — homepage preview of case studies.
 * Three cards, each linking to /work/[slug] for the full case study.
 * motion/react whileInView for scroll reveals.
 */

import Link from "next/link";
import { motion } from "motion/react";
import { Container, Placeholder } from "@/components/ui";
import { work } from "@/content/work";

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const CARD_TRANSITION = {
  type: "tween" as const,
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export function Work() {
  return (
    <section
      id="work"
      style={{ backgroundColor: "var(--bg)" }}
      className="relative overflow-hidden py-[clamp(4rem,7vw,8rem)]"
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
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
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
            Selected case studies.
          </h2>
        </motion.div>

        {/* ── Case study cards ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-[clamp(2rem,4vw,3.5rem)]">
          {work.map((item, i) => (
            <motion.article
              key={item.slug}
              variants={CARD_VARIANTS}
              transition={{ ...CARD_TRANSITION, delay: i * 0.08 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-6%" }}
            >
              <Link
                href={`/work/${item.slug}`}
                className="group block"
                style={{ textDecoration: "none" }}
              >
                {/* Thumbnail — capped at 440px so title + description read together */}
                <div
                  className="mb-5 overflow-hidden rounded-[var(--radius-lg)]"
                  style={{ maxHeight: "440px" }}
                >
                  <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                    <Placeholder
                      label={item.thumbnailLabel}
                      aspect="16/10"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Meta row */}
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="text-[11px] font-semibold tabular-nums tracking-[0.1em] uppercase"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
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
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
                  <div>
                    <h3
                      className="mb-2 font-semibold leading-[1.15] tracking-[-0.018em] transition-colors duration-200"
                      style={{
                        fontSize: "clamp(1.35rem, 2vw, 1.85rem)",
                        fontFamily: "var(--font-display)",
                        color: "var(--text)",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-[1.65]"
                      style={{ color: "var(--text-muted)", maxWidth: "52ch" }}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 group-hover:text-[var(--text)] lg:whitespace-nowrap"
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

                {/* Outcome chip */}
                <p
                  className="mt-4 text-xs font-medium"
                  style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
                >
                  {item.outcome}
                </p>
              </Link>

              {/* Separator */}
              {i < work.length - 1 && (
                <div
                  className="mt-[clamp(2rem,4vw,3.5rem)] h-px"
                  style={{ backgroundColor: "var(--border)" }}
                  aria-hidden="true"
                />
              )}
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
