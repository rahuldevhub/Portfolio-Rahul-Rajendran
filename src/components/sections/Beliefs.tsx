"use client";

/**
 * Beliefs — "How I Think" (Section 03).
 *
 * Designed as a single-viewport composition on desktop (xl+): the section
 * height is pinned to the space under the navbar so all five principle
 * cards, the progression line, and the closing statement are visible
 * without a second scroll. Tablet/mobile fall back to normal vertical flow.
 *
 * Left = eyebrow + heading + handwritten note + supporting copy + the
 * character (the exact Testimonials asset, /character2.png, same bust-crop
 * mask), ringed by a faint dotted orbit and five floating principle icons —
 * decorative storytelling, not UI. Hovering an orbit icon subtly highlights
 * its matching card on the right, and vice versa.
 *
 * Right = a plain-text header, five compact horizontal principle rows, a
 * quiet number progression, and a handwritten closing line. No XP, no
 * "unlocked" language, no status badges, no dashboard widgets.
 */

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Zap, Pen, Code2, Target, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui";
import { beliefs, beliefsSectionIntro } from "@/content/beliefs";
import type { Belief, BeliefIcon } from "@/content/beliefs";

/* Inline shield (lucide Shield isn't on the confirmed-safe list for this build). */
function ShieldGlyph({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5l7 3v5.5c0 4.4-3 7.6-7 8.9-4-1.3-7-4.5-7-8.9V5.5l7-3z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LUCIDE: Partial<Record<BeliefIcon, LucideIcon>> = { Zap, Pen, Code2, Target };

function PrincipleIcon({ icon, size, color }: { icon: BeliefIcon; size: number; color: string }) {
  if (icon === "Shield") return <ShieldGlyph size={size} color={color} />;
  const Icon = LUCIDE[icon]!;
  return <Icon size={size} strokeWidth={1.9} style={{ color }} aria-hidden="true" />;
}

/* Floating emblem positions around the character — ids match `beliefs` so
   hovering one can highlight its matching card. Loose circular arrangement,
   pulled in close so nothing clips the column edge. */
const EMBLEMS: { id: string; icon: BeliefIcon; accent: string; pos: React.CSSProperties; float: number; delay: number }[] = [
  { id: "clarity",     icon: "Pen",    accent: "#8B5CF6", pos: { top: "10%", left: "0%" },    float: 5,   delay: 0 },
  { id: "friction",    icon: "Zap",    accent: "#6366F1", pos: { top: "2%",  right: "4%" },   float: 4,   delay: 0.5 },
  { id: "intentional", icon: "Target", accent: "#D97706", pos: { top: "44%", left: "-6%" },   float: 5.5, delay: 1 },
  { id: "invisible",   icon: "Code2",  accent: "#2563EB", pos: { top: "48%", right: "-4%" },  float: 4.5, delay: 1.5 },
  { id: "trust",       icon: "Shield", accent: "#059669", pos: { bottom: "12%", left: "6%" }, float: 6,   delay: 2 },
];

/* ─── Character with faint orbit + floating principle icons ──────────────── */
function BuilderCharacter({
  prefersReduced, hoveredId, onHoverIcon,
}: {
  prefersReduced: boolean | null;
  hoveredId: string | null;
  onHoverIcon: (id: string | null) => void;
}) {
  return (
    <div className="w-[230px] lg:w-[280px] xl:w-[320px]" style={{ position: "relative", margin: "0 auto", aspectRatio: "1" }}>
      {/* Soft ambient glow */}
      <motion.div aria-hidden="true"
        animate={!prefersReduced ? { opacity: [0.7, 0.85, 0.7] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)",
          width: "80%", height: "62%", borderRadius: "50%", zIndex: 0,
          background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(99,102,241,0.08) 50%, transparent 74%)",
          filter: "blur(28px)",
        }} />

      {/* Extremely faint dotted orbit — no rotation, just presence */}
      <svg viewBox="0 0 200 200" aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <ellipse cx="100" cy="98" rx="88" ry="80" fill="none" stroke="#8A8AA6"
          strokeWidth="1" strokeDasharray="2 7" opacity="0.16" />
      </svg>

      {/* The character — exact Testimonials asset (/character2.png) and mask,
          only re-placed and re-sized for this section. Positioning transform
          lives on a plain div; motion only animates the child (motion.div
          manages its own transform, which would otherwise clobber a static
          translate() set alongside an animate prop on the same element). */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "120%", zIndex: 1 }}>
        <motion.div
          animate={!prefersReduced ? { y: [-5, 5, -5] } : {}}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative" }}
        >
          <Image src="/character2.png" alt="Rahul" width={1536} height={1024} priority
            style={{
              width: "100%", height: "auto", display: "block",
              maskImage: "radial-gradient(ellipse 30% 84% at 50% 46%, #000 56%, transparent 84%)",
              WebkitMaskImage: "radial-gradient(ellipse 30% 84% at 50% 46%, #000 56%, transparent 84%)",
              filter: "drop-shadow(0 14px 26px rgba(99,102,241,0.16))",
            }} />
        </motion.div>
      </div>

      {/* Floating principle icons — decorative storytelling, not UI cards */}
      {EMBLEMS.map((em) => {
        const on = hoveredId === em.id;
        return (
          <motion.div key={em.id} aria-hidden="true"
            onHoverStart={() => onHoverIcon(em.id)}
            onHoverEnd={() => onHoverIcon(null)}
            animate={!prefersReduced
              ? { y: [0, -em.float, 0], scale: on ? 1.12 : 1 }
              : { scale: on ? 1.12 : 1 }}
            transition={
              !prefersReduced
                ? { y: { duration: em.float + 2, repeat: Infinity, ease: "easeInOut", delay: em.delay }, scale: { duration: 0.2 } }
                : { duration: 0.2 }
            }
            style={{
              position: "absolute", zIndex: 2, cursor: "default",
              width: 40, height: 40, borderRadius: "12px",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${em.accent}${on ? "66" : "35"}`,
              boxShadow: on
                ? `0 6px 16px rgba(0,0,0,0.10), 0 0 18px ${em.accent}3A`
                : `0 4px 12px rgba(0,0,0,0.06), 0 0 10px ${em.accent}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              ...em.pos,
            }}>
            <PrincipleIcon icon={em.icon} size={17} color={em.accent} />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Single principle row (compact horizontal card) ──────────────────────── */
function PrincipleRow({
  b, prefersReduced, highlighted, onHover,
}: {
  b: Belief; prefersReduced: boolean | null; highlighted: boolean; onHover: (id: string | null) => void;
}) {
  return (
    <motion.div
      onHoverStart={() => onHover(b.id)}
      onHoverEnd={() => onHover(null)}
      whileHover={!prefersReduced ? { y: -2 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-6"
      style={{
        position: "relative",
        padding: "1.15rem 1.4rem",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.85)",
        borderTop: `1px solid ${highlighted ? `${b.accent}55` : "var(--border)"}`,
        borderRight: `1px solid ${highlighted ? `${b.accent}55` : "var(--border)"}`,
        borderBottom: `1px solid ${highlighted ? `${b.accent}55` : "var(--border)"}`,
        borderLeft: `2.5px solid ${b.accent}`,
        boxShadow: highlighted ? `0 4px 14px ${b.accent}1F` : "0 2px 6px rgba(0,0,0,0.02)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Number + title + principle statement */}
      <div className="flex flex-1 items-start gap-3.5" style={{ minWidth: 0, flexBasis: "52%" }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "1.05rem", fontWeight: 700,
          color: b.accent, flexShrink: 0, minWidth: "1.5rem",
        }}>
          {b.num}
        </span>
        <div style={{ minWidth: 0 }}>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem",
            letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--text)",
            marginBottom: "0.3rem", lineHeight: 1.3,
          }}>
            {b.title}
          </h3>
          <p style={{ fontSize: "0.87rem", lineHeight: 1.42, color: "var(--text-muted)", margin: 0 }}>
            {b.description}
          </p>
        </div>
      </div>

      {/* Vertical divider (desktop only) */}
      <span aria-hidden="true" className="hidden sm:block" style={{ width: 1, alignSelf: "stretch", background: "var(--border)", flexShrink: 0 }} />

      {/* In practice */}
      <div className="flex-1 pl-8 sm:pl-0" style={{ minWidth: 0, flexBasis: "48%" }}>
        <span style={{
          display: "block", fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase",
          color: b.accent, marginBottom: "0.3rem",
        }}>
          In Practice
        </span>
        <p style={{ fontSize: "0.87rem", lineHeight: 1.42, color: "var(--text-muted)", margin: 0 }}>
          {b.inPractice}
        </p>
      </div>

      {/* Icon badge */}
      <div style={{
        position: "absolute", top: "0.85rem", right: "0.85rem",
        width: 34, height: 34, borderRadius: "9px", flexShrink: 0,
        background: `${b.accent}10`, border: `1px solid ${b.accent}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <PrincipleIcon icon={b.icon} size={15} color={b.accent} />
      </div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────────── */
export function Beliefs() {
  const prefersReduced = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Split heading so "everything" can be gradient-highlighted.
  const [pre, post] = beliefsSectionIntro.headline.split("everything");

  return (
    <section
      id="beliefs"
      style={{ backgroundColor: "var(--bg)" }}
      className="relative py-[clamp(3rem,6vw,5rem)] xl:flex xl:min-h-[calc(100vh-var(--nav-height))] xl:items-center xl:py-8"
    >
      <Container className="xl:w-full">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[32%_1fr] lg:gap-10 lg:items-center">

          {/* ── LEFT: heading + character ─────────────────────────────────── */}
          <div>
            <motion.div
              initial={!prefersReduced ? { opacity: 0, y: 22 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                {beliefsSectionIntro.eyebrow}
              </p>
              <h2 className="font-semibold leading-[1.1] tracking-[-0.026em]"
                style={{ fontSize: "clamp(1.95rem, 2.5vw, 2.45rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
                {pre}
                <span style={{
                  background: "linear-gradient(110deg, var(--accent) 0%, var(--accent-2) 100%)",
                  WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>everything</span>
                {post}
              </h2>
              <p className="mt-3" style={{
                fontFamily: "var(--font-caveat)", fontSize: "1.4rem", color: "var(--text-muted)",
                textDecoration: "underline", textDecorationColor: "rgba(107,107,112,0.3)",
                textUnderlineOffset: "4px",
              }}>
                {beliefsSectionIntro.note}
              </p>
              <p className="mt-3" style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "30ch" }}>
                {beliefsSectionIntro.supporting.map((line, i) => (
                  <span key={i} style={{ display: "block" }}>{line}</span>
                ))}
              </p>
            </motion.div>

            {/* Character — anchored lower-left, with orbit + floating icons */}
            <div className="mt-9">
              <BuilderCharacter prefersReduced={prefersReduced} hoveredId={hoveredId} onHoverIcon={setHoveredId} />
            </div>
          </div>

          {/* ── RIGHT: header + rows + progression + footer ─────────────────── */}
          <div className="min-w-0">
            {/* Header — plain editorial label, no icon or counter widget */}
            <motion.div
              className="mb-6"
              initial={!prefersReduced ? { opacity: 0, y: 16 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem",
                letterSpacing: "0.01em", color: "var(--text)", margin: 0,
              }}>
                {beliefsSectionIntro.principlesEyebrow}
              </h3>
              <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                {beliefsSectionIntro.principlesCaption}
              </p>
            </motion.div>

            {/* Principle rows */}
            <motion.div
              className="flex flex-col gap-3"
              initial={!prefersReduced ? { opacity: 0, y: 24 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {beliefs.map((b) => (
                <PrincipleRow
                  key={b.id} b={b} prefersReduced={prefersReduced}
                  highlighted={hoveredId === b.id}
                  onHover={setHoveredId}
                />
              ))}
            </motion.div>

            {/* Progression — a quiet timeline indicator, not a dashboard widget */}
            <div className="mt-6 flex items-center" aria-hidden="true" style={{ height: "36px" }}>
              {beliefs.map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", flex: i < beliefs.length - 1 ? 1 : "0 0 auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                    <span aria-hidden="true" style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background: b.accent, opacity: hoveredId === b.id ? 0.9 : 0.5,
                      transition: "opacity 0.2s ease",
                    }} />
                    <span style={{
                      fontSize: "0.68rem", letterSpacing: "0.04em", color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)", opacity: 0.7,
                    }}>
                      {b.num}
                    </span>
                  </div>
                  {i < beliefs.length - 1 && (
                    <span style={{ flex: 1, height: "1px", margin: "0 8px", background: "var(--border)" }} />
                  )}
                </div>
              ))}
            </div>

            {/* Footer: handwritten line */}
            <p className="mt-5" style={{
              fontFamily: "var(--font-caveat)", fontSize: "1.35rem", color: "var(--text-muted)",
            }}>
              Principles aren&apos;t for motivation. They&apos;re for{" "}
              <span style={{ textDecoration: "underline", textDecorationColor: "rgba(107,107,112,0.35)", textUnderlineOffset: "3px" }}>
                decisions
              </span>.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
