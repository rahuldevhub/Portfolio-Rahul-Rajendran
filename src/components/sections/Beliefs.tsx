"use client";

/**
 * Beliefs — "My Operating System" philosophy deck.
 *
 * Layout (desktop): left column = eyebrow + heading + handwritten note +
 * character (with the five principle emblems orbiting it). Right column = a
 * status bar (principles collected + OS status), a horizontally-scrollable row
 * of five collectible principle cards (the 5th "legendary"), a connector
 * timeline, and a footer (handwritten line + carousel arrows).
 *
 * A founder's philosophy deck — Apple × Linear × Arc, not a Pokémon binder.
 * Cards tilt subtly in 3D on hover; the legendary card glows. Reuses the hero
 * character so the narrative (Who I Am → How I Became → How I Think) stays
 * visually connected. Respects prefers-reduced-motion.
 */

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Zap, Pen, Code2, Target, Sparkles, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui";
import { beliefs, beliefsSectionIntro } from "@/content/beliefs";
import type { Belief, BeliefIcon } from "@/content/beliefs";
import { characterSrc } from "@/content/hero";

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

/* Floating emblem positions around the sticky character. */
const EMBLEMS: { icon: BeliefIcon; accent: string; pos: React.CSSProperties; float: number }[] = [
  { icon: "Pen",    accent: "#8B5CF6", pos: { top: "16%", left: "-2%" },  float: 6 },
  { icon: "Zap",    accent: "#6366F1", pos: { top: "8%",  right: "0%" },  float: 5 },
  { icon: "Target", accent: "#D97706", pos: { top: "44%", left: "-8%" },  float: 5.5 },
  { icon: "Code2",  accent: "#2563EB", pos: { top: "48%", right: "-6%" }, float: 4.5 },
  { icon: "Shield", accent: "#059669", pos: { bottom: "24%", left: "2%" }, float: 6.5 },
];

/* ─── 3D tilt-on-hover wrapper ──────────────────────────────────────────── */
function TiltCard({
  children, disabled, style, className,
}: { children: React.ReactNode; disabled?: boolean; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(820px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(820px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.25s ease", transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  );
}

/* ─── Single principle card ─────────────────────────────────────────────── */
function PrincipleCard({ b, prefersReduced }: { b: Belief; prefersReduced: boolean | null }) {
  const legendary = !!b.legendary;
  return (
    <TiltCard
      disabled={!!prefersReduced}
      className="w-[80vw] max-w-[300px] shrink-0 sm:w-[156px]"
      style={{
        scrollSnapAlign: "center",
      }}
    >
      <motion.div
        animate={
          legendary && !prefersReduced
            ? { boxShadow: [
                `0 24px 50px ${b.accent}26, 0 0 24px ${b.accent}1F, inset 0 1px 0 rgba(255,255,255,1)`,
                `0 26px 56px ${b.accent}3A, 0 0 40px ${b.accent}33, inset 0 1px 0 rgba(255,255,255,1)`,
                `0 24px 50px ${b.accent}26, 0 0 24px ${b.accent}1F, inset 0 1px 0 rgba(255,255,255,1)`,
              ] }
            : {}
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "relative",
          height: "390px",
          display: "flex",
          flexDirection: "column",
          padding: "1.15rem 1.15rem 1rem",
          borderRadius: "20px",
          background: legendary
            ? `linear-gradient(160deg, #FFFFFF 0%, ${b.accent}14 100%)`
            : "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.78) 100%)",
          border: legendary ? `1.5px solid ${b.accent}55` : "1px solid var(--border)",
          boxShadow: legendary
            ? `0 24px 50px ${b.accent}26, 0 0 30px ${b.accent}1F, inset 0 1px 0 rgba(255,255,255,1)`
            : "0 12px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
          overflow: "hidden",
        }}
      >
        {/* Legendary shimmer sweep */}
        {legendary && !prefersReduced && (
          <motion.div
            aria-hidden="true"
            initial={{ x: "-130%" }}
            animate={{ x: "230%" }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
            style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: "55%",
              background: `linear-gradient(110deg, transparent 30%, ${b.accent}30 48%, rgba(255,255,255,0.55) 52%, transparent 72%)`,
              pointerEvents: "none", zIndex: 3,
            }}
          />
        )}
        {/* Legendary corner crown */}
        {legendary && (
          <span aria-hidden="true" style={{
            position: "absolute", top: "0.85rem", right: "0.85rem",
            width: 26, height: 26, borderRadius: "8px",
            background: `${b.accent}22`, border: `1px solid ${b.accent}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 8l4 3 5-7 5 7 4-3-2 11H5L3 8z" fill={b.accent} opacity="0.92" />
            </svg>
          </span>
        )}

        {/* Top: number + status dots */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.95rem", fontWeight: 600,
            color: legendary ? b.accent : "var(--text-muted)", letterSpacing: "0.04em",
          }}>
            {b.num}
          </span>
          {!legendary && (
            <span aria-hidden="true" style={{ display: "flex", gap: "3px" }}>
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--border)" }} />
              ))}
            </span>
          )}
        </div>
        <div style={{ width: "22px", height: "2px", borderRadius: "2px", background: legendary ? `${b.accent}66` : "var(--border)", marginTop: "0.5rem" }} />

        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem", marginBottom: "1.25rem" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "16px",
            background: `linear-gradient(150deg, ${b.accent}22 0%, ${b.accent}0D 100%)`,
            border: `1.5px solid ${b.accent}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 6px 16px ${b.accent}1F`,
          }}>
            <PrincipleIcon icon={b.icon} size={26} color={b.accent} />
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "1.05rem", lineHeight: 1.15, letterSpacing: "0.01em",
          textTransform: "uppercase", color: "var(--text)", marginBottom: "0.7rem",
        }}>
          {b.title}
        </h3>

        {/* Description */}
        <p style={{
          textAlign: "center", fontSize: "0.8rem", lineHeight: 1.55,
          color: "var(--text-muted)", margin: 0,
        }}>
          {b.description}
        </p>

        {/* Rarity pill */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "auto", marginBottom: "0.85rem" }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", color: b.accent,
            padding: "0.4em 0.85em", borderRadius: "999px",
            background: `${b.accent}16`, border: `1px solid ${b.accent}33`,
          }}>
            {b.rarity}
          </span>
        </div>

        {/* Footer: XP */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: "0.75rem", borderTop: "1px solid var(--border)",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--text-muted)",
          }}>
            Builder XP
          </span>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, color: b.accent,
          }}>
            +{b.xp} XP
          </span>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ─── Section ───────────────────────────────────────────────────────────── */
const OS_STATUSES = [
  "All Systems Active",
  "Builder OS Running",
  "Status: Building",
  "Shipping > Perfecting",
] as const;

export function Beliefs() {
  const prefersReduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [osIdx, setOsIdx] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  /* Track the centered card (drives the mobile swipe dots). */
  const onRowScroll = () => {
    const el = scrollRef.current; if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const ch = c as HTMLElement;
      const cc = ch.offsetLeft + ch.offsetWidth / 2;
      const d = Math.abs(cc - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setActiveCard(best);
  };

  /* Cycle the OS status line so the badge feels alive. */
  useEffect(() => {
    if (prefersReduced) return;
    const t = setInterval(() => setOsIdx((i) => (i + 1) % OS_STATUSES.length), 3000);
    return () => clearInterval(t);
  }, [prefersReduced]);

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 230, behavior: prefersReduced ? "auto" : "smooth" });
  };

  // Split heading so "everything" can be gradient-highlighted.
  const [pre, post] = beliefsSectionIntro.headline.split("everything");

  return (
    <section id="beliefs" style={{ backgroundColor: "var(--bg)" }} className="relative py-[clamp(4rem,7vw,8rem)]">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[250px_1fr] lg:gap-10">

          {/* ── LEFT: heading + character ─────────────────────────────────── */}
          <div>
            <motion.div
              initial={!prefersReduced ? { opacity: 0, y: 22 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                {beliefsSectionIntro.eyebrow}
              </p>
              <h2 className="font-semibold leading-[1.08] tracking-[-0.028em]"
                style={{ fontSize: "clamp(1.9rem, 2.6vw, 2.6rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
                {pre}
                <span style={{
                  background: "linear-gradient(110deg, var(--accent) 0%, var(--accent-2) 100%)",
                  WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>everything</span>
                {post}
              </h2>
              <p className="mt-4" style={{
                fontFamily: "var(--font-caveat)", fontSize: "1.4rem", color: "var(--text-muted)",
                textDecoration: "underline", textDecorationColor: "rgba(107,107,112,0.3)",
                textUnderlineOffset: "4px",
              }}>
                {beliefsSectionIntro.note}
              </p>
            </motion.div>

            {/* Character with orbiting principle emblems */}
            <div className="mt-8 hidden lg:block" style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
              <motion.div aria-hidden="true"
                animate={!prefersReduced ? { opacity: [0.85, 1, 0.85] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                  width: "85%", height: "62%", borderRadius: "50%", zIndex: 0,
                  background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(96,130,255,0.10) 50%, transparent 72%)",
                  filter: "blur(34px)",
                }} />
              <div aria-hidden="true" style={{
                position: "absolute", left: "50%", bottom: "4%", transform: "translateX(-50%)",
                width: "60%", height: "46px", borderRadius: "50%", zIndex: 0,
                background: "radial-gradient(ellipse at center, rgba(120,110,255,0.34) 0%, rgba(180,130,255,0.16) 55%, transparent 78%)",
                filter: "blur(16px)",
              }} />
              <motion.div
                animate={!prefersReduced ? { y: [-4, 4, -4] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "relative", width: "70%", zIndex: 1 }}
              >
                <Image src={characterSrc} alt="Rahul — character" width={1024} height={1536}
                  style={{ width: "100%", height: "auto", display: "block" }} />
              </motion.div>

              {EMBLEMS.map((em, i) => (
                <motion.div key={i} aria-hidden="true"
                  animate={!prefersReduced ? { y: [0, -em.float, 0] } : {}}
                  transition={{ duration: em.float, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  style={{
                    position: "absolute", zIndex: 2,
                    width: 38, height: 38, borderRadius: "12px",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                    border: `1px solid ${em.accent}40`,
                    boxShadow: `0 6px 18px rgba(0,0,0,0.08), 0 0 16px ${em.accent}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    ...em.pos,
                  }}>
                  <PrincipleIcon icon={em.icon} size={17} color={em.accent} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: status bar + cards + timeline + footer ─────────────── */}
          <div className="min-w-0">
            {/* Status bar */}
            <motion.div
              className="mb-7 flex flex-wrap items-center justify-between gap-4"
              initial={!prefersReduced ? { opacity: 0, y: 16 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Principles collected */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <span aria-hidden="true" style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
                  <span style={{
                    position: "absolute", inset: "6px 4px 4px 8px", borderRadius: "7px",
                    background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.22)", transform: "rotate(-10deg)",
                  }} />
                  <span style={{
                    position: "absolute", inset: "4px 8px 6px 4px", borderRadius: "7px",
                    background: "rgba(255,255,255,0.9)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Zap size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
                  </span>
                </span>
                <div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "0.62rem", fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)",
                  }}>
                    Principles Collected
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--accent)" }}>
                    {beliefs.length} / {beliefs.length} Unlocked
                  </div>
                </div>
              </div>

              {/* OS status badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.7rem",
                padding: "0.55rem 1rem", borderRadius: "12px",
                background: "var(--text)", boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
              }}>
                <Sparkles size={16} strokeWidth={2} style={{ color: "#A78BFA" }} aria-hidden="true" />
                <div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
                  }}>
                    OS Status
                  </div>
                  <motion.div
                    key={osIdx}
                    initial={!prefersReduced ? { opacity: 0, y: 5 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap" }}
                  >
                    {OS_STATUSES[osIdx]}
                  </motion.div>
                </div>
                <span aria-hidden="true" style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#34D399",
                  boxShadow: "0 0 0 3px rgba(52,211,153,0.25)",
                }} />
              </div>
            </motion.div>

            {/* Cards row */}
            <motion.div
              ref={scrollRef}
              onScroll={onRowScroll}
              className="flex gap-3 overflow-x-auto px-1 py-5"
              style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", perspective: "1000px" }}
              initial={!prefersReduced ? { opacity: 0, y: 24 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {beliefs.map((b) => (
                <PrincipleCard key={b.id} b={b} prefersReduced={prefersReduced} />
              ))}
            </motion.div>

            {/* Mobile swipe dots + counter */}
            <div className="mt-1 flex items-center justify-center gap-3 sm:hidden">
              <div className="flex items-center gap-1.5">
                {beliefs.map((b, i) => (
                  <button key={b.id} type="button" aria-label={`Principle ${i + 1}`}
                    onClick={() => { const el = scrollRef.current; const ch = el?.children[i] as HTMLElement | undefined; if (el && ch) el.scrollTo({ left: ch.offsetLeft - (el.clientWidth - ch.offsetWidth) / 2, behavior: prefersReduced ? "auto" : "smooth" }); }}
                    style={{ width: i === activeCard ? 22 : 7, height: 7, borderRadius: "999px", border: "none", cursor: "pointer", background: i === activeCard ? beliefs[activeCard].accent : "var(--border)", transition: "all 0.3s ease" }} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{activeCard + 1} / {beliefs.length}</span>
            </div>

            {/* Connector timeline */}
            <div className="mt-8 hidden items-center sm:flex" aria-hidden="true">
              {beliefs.map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", flex: i < beliefs.length - 1 ? 1 : "0 0 auto" }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: `${b.accent}14`, border: `1.5px solid ${b.accent}45`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <PrincipleIcon icon={b.icon} size={15} color={b.accent} />
                  </span>
                  {i < beliefs.length - 1 && (
                    <span style={{
                      flex: 1, height: "2px", margin: "0 6px", borderRadius: "2px",
                      background: `linear-gradient(90deg, ${b.accent}66, ${beliefs[i + 1].accent}66)`,
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* Footer: handwritten line + carousel arrows */}
            <div className="mt-7 flex items-center justify-between gap-4">
              <p style={{
                fontFamily: "var(--font-caveat)", fontSize: "1.3rem", color: "var(--text-muted)",
              }}>
                Principles aren&apos;t for motivation. They&apos;re for{" "}
                <span style={{ textDecoration: "underline", textDecorationColor: "rgba(107,107,112,0.35)", textUnderlineOffset: "3px" }}>
                  decisions
                </span>.
              </p>
              <div className="flex shrink-0 gap-2">
                {[-1, 1].map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    aria-label={dir < 0 ? "Previous principles" : "Next principles"}
                    onClick={() => scrollBy(dir)}
                    className="flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-[var(--surface)]"
                    style={{ width: 44, height: 44, border: "1px solid var(--border)", background: "transparent", cursor: "pointer" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                      style={{ transform: dir < 0 ? "rotate(180deg)" : "none" }}>
                      <path d="M5 3l5 5-5 5" stroke="var(--text-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
