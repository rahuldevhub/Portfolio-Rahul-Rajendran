"use client";

/**
 * Story — "Evolution of a Product Builder".
 *
 * Desktop: a sticky left column (character + level/XP + skill tree) stays fixed
 * while the right column scrolls through five level chapters. An Intersection
 * Observer tracks the active chapter and drives the character's accent glow,
 * the XP bar, the skill-tree highlight, and a brief "skill unlocked" toast.
 *
 * Mobile: the sticky column is hidden; chapters stack full-width, each carrying
 * its own level header + skills card.
 *
 * Respects prefers-reduced-motion (toast + entrance reveals disabled).
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, BookOpen, Pen, Code2, Target, Rocket, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui";
import { storyStages, storySectionIntro, storyFinale } from "@/content/story";
import { characterSrc } from "@/content/hero";

const TOTAL = storyStages.length;

/**
 * Per-level skill emblem orbiting the character. As the active level climbs,
 * each level's emblem appears around the character (accumulating) — conveying
 * the "character upgrades / skills merge" evolution without 5 separate PNGs.
 * Positions are placed around the character's periphery; last level sits up top
 * like a crown. All icons are memory-confirmed-safe lucide imports.
 */
const LEVEL_EMBLEMS: { Icon: LucideIcon; pos: React.CSSProperties; float: number }[] = [
  { Icon: BookOpen, pos: { top: "14%", left: "-6%" },     float: 5 },  // Freelancer
  { Icon: Pen,      pos: { top: "6%",  right: "-4%" },     float: 6 },  // Designer
  { Icon: Code2,    pos: { top: "46%", right: "-9%" },     float: 4.5 }, // Developer
  { Icon: Target,   pos: { top: "40%", left: "-9%" },      float: 5.5 }, // Product Builder
  { Icon: Rocket,   pos: { top: "-7%", left: "50%", marginLeft: "-16px" }, float: 5 }, // Founder (crown)
];

export function Story() {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [toastOn, setToastOn] = useState(false);
  /* Mobile-only: which level card is expanded (accordion). null = all collapsed. */
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);
  /* Mobile-only quest: only the first N levels are revealed; "Continue Journey"
   * unlocks the next. Desktop always shows all. */
  const [revealed, setRevealed] = useState(1);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  /* Track the active chapter as it crosses the viewport centre. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 }
    );
    chapterRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Skill-unlock toast — flashes briefly whenever the active level changes. */
  useEffect(() => {
    if (prefersReduced) return;
    setToastOn(true);
    const t = setTimeout(() => setToastOn(false), 2600);
    return () => clearTimeout(t);
  }, [active, prefersReduced]);

  const stage  = storyStages[active];
  const accent = stage.accent;
  const xpPct  = ((active + 1) / TOTAL) * 100;

  const headlineLines = storySectionIntro.headline.split("\n");

  return (
    <section
      id="story"
      style={{ backgroundColor: "var(--surface)" }}
      className="relative py-[clamp(4rem,7vw,8rem)]"
    >
      <Container>
        {/* ── Intro ─────────────────────────────────────────────────────── */}
        <motion.div
          className="mb-[clamp(2.5rem,5vw,4.5rem)]"
          initial={!prefersReduced ? { opacity: 0, y: 24 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
          >
            {storySectionIntro.eyebrow}
          </p>
          <h2
            className="font-semibold leading-[1.0] tracking-[-0.03em]"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
            }}
          >
            {headlineLines.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>
          <p
            className="mt-5 text-base"
            style={{ color: "var(--text-muted)", maxWidth: "44ch", fontFamily: "var(--font-caveat)", fontSize: "1.4rem" }}
          >
            {storySectionIntro.subtitle}
          </p>
        </motion.div>

        {/* ── Two columns: sticky character | scroll chapters ───────────── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">

          {/* ── LEFT — sticky character HUD (desktop only) ──────────────── */}
          <div
            className="hidden lg:block"
            style={{ alignSelf: "start", position: "sticky", top: "calc(var(--nav-height) + 3rem)" }}
          >
            {/* Character with accent glow */}
            <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
              {/* Accent glow — colour morphs per level */}
              <motion.div
                aria-hidden="true"
                animate={{ backgroundColor: accent }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: "50%", top: "52%",
                  width: "78%", height: "62%", transform: "translate(-50%, -50%)",
                  borderRadius: "50%", filter: "blur(46px)", opacity: 0.3, zIndex: 0,
                }}
              />
              {/* Platform pool */}
              <motion.div
                aria-hidden="true"
                animate={{ backgroundColor: accent }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: "50%", bottom: "2%",
                  width: "58%", height: "40px", transform: "translateX(-50%)",
                  borderRadius: "50%", filter: "blur(16px)", opacity: 0.28, zIndex: 0,
                }}
              />
              <motion.div
                animate={!prefersReduced ? { y: [-4, 4, -4] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "relative", width: "74%", zIndex: 1 }}
              >
                <Image
                  src={characterSrc}
                  alt="Rahul — evolving character"
                  width={1024}
                  height={1536}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </motion.div>

              {/* Evolving skill emblems — accumulate around the character per level */}
              {LEVEL_EMBLEMS.map((emblem, i) => {
                const unlocked = i <= active;
                const { Icon } = emblem;
                const emAccent = storyStages[i].accent;
                return (
                  <motion.div
                    key={i}
                    aria-hidden="true"
                    initial={false}
                    animate={
                      unlocked
                        ? { opacity: 1, scale: 1, ...(prefersReduced ? {} : { y: [0, -emblem.float, 0] }) }
                        : { opacity: 0, scale: 0.6 }
                    }
                    transition={
                      unlocked
                        ? {
                            opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                            scale:   { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                            y:       { duration: emblem.float, repeat: Infinity, ease: "easeInOut", repeatType: "loop" },
                          }
                        : { duration: 0.3 }
                    }
                    style={{
                      position: "absolute", zIndex: 2, pointerEvents: "none",
                      width: 36, height: 36, borderRadius: "11px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(255,255,255,0.82)",
                      backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                      border: `1px solid ${emAccent}40`,
                      boxShadow: `0 6px 18px rgba(0,0,0,0.08), 0 0 16px ${emAccent}22`,
                      ...emblem.pos,
                    }}
                  >
                    <Icon size={16} strokeWidth={1.8} style={{ color: emAccent }} />
                  </motion.div>
                );
              })}
            </div>

            {/* Level + XP */}
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                }}>
                  Builder Progress
                </span>
                <motion.span
                  key={stage.phase}
                  initial={!prefersReduced ? { opacity: 0, y: 6 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: accent,
                  }}
                >
                  Lv {stage.level} · {stage.phase}
                </motion.span>
              </div>
              {/* XP track — fill glows with the accent */}
              <div style={{
                width: "100%", height: "8px", borderRadius: "999px",
                background: "var(--border)", overflow: "hidden",
              }}>
                <motion.div
                  animate={
                    !prefersReduced
                      ? { width: `${xpPct}%`, backgroundColor: accent, boxShadow: [`0 0 6px ${accent}66`, `0 0 14px ${accent}99`, `0 0 6px ${accent}66`] }
                      : { width: `${xpPct}%`, backgroundColor: accent }
                  }
                  transition={{
                    width: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    backgroundColor: { duration: 0.7 },
                    boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  style={{ height: "100%", borderRadius: "999px" }}
                />
              </div>
              <div style={{
                marginTop: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.62rem",
                letterSpacing: "0.08em", color: "var(--text-muted)", textAlign: "right",
              }}>
                {active + 1} / {TOTAL} unlocked
              </div>
            </div>

            {/* Skill tree */}
            <div style={{ marginTop: "1.75rem" }}>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: "0.62rem", fontWeight: 600,
                letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)",
                marginBottom: "0.85rem",
              }}>
                Skill Tree
              </p>
              <ol style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {storyStages.map((s, i) => {
                  const completed = i < active;
                  const current   = i === active;
                  const dotColor  = completed || current ? s.accent : "var(--border)";
                  return (
                    <li key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.7rem", position: "relative" }}>
                      {/* connector */}
                      {i < TOTAL - 1 && (
                        <span aria-hidden="true" style={{
                          position: "absolute", left: "5px", top: "18px", width: "2px", height: "calc(100% - 4px)",
                          background: i < active ? s.accent : "var(--border)",
                          opacity: i < active ? 0.5 : 1, transition: "background 0.4s ease",
                        }} />
                      )}
                      {/* node */}
                      <span style={{
                        width: 12, height: 12, borderRadius: "50%", flexShrink: 0, zIndex: 1,
                        background: completed ? s.accent : current ? s.accent : "var(--surface)",
                        border: `2px solid ${dotColor}`,
                        boxShadow: current ? `0 0 0 4px ${s.accent}24` : "none",
                        transition: "all 0.4s ease",
                      }} />
                      <span style={{
                        padding: "0.55rem 0",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.82rem",
                        fontWeight: current ? 700 : 500,
                        color: current ? "var(--text)" : completed ? "var(--text-muted)" : "var(--text-muted)",
                        opacity: current ? 1 : completed ? 0.85 : 0.5,
                        transition: "all 0.4s ease",
                      }}>
                        {s.phase}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* ── RIGHT — scrolling chapters ──────────────────────────────── */}
          <div className="flex flex-col gap-16 lg:gap-0">

            {/* Mobile journey stepper — single sticky tracker under the nav */}
            <div
              className="lg:hidden"
              style={{ position: "sticky", top: "calc(var(--nav-height))", zIndex: 20, marginBottom: "0.25rem", padding: "0.7rem 1rem", borderRadius: "14px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid var(--border)", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Builder Journey</span>
                <motion.span key={stage.phase} initial={!prefersReduced ? { opacity: 0, y: 4 } : false} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8rem", color: accent }}>Lv {stage.level} · {stage.phase}</motion.span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>01</span>
                {storyStages.map((st, i) => {
                  const reached = i <= active;
                  const cur = i === active;
                  return (
                    <div key={st.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      {i > 0 && <span style={{ flex: 1, height: 2, borderRadius: 2, background: i <= active ? storyStages[i].accent : "var(--border)", opacity: i <= active ? 0.6 : 1, transition: "all 0.4s ease" }} />}
                      <motion.span
                        animate={cur && !prefersReduced ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                        transition={cur && !prefersReduced ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                        style={{ width: cur ? 13 : 9, height: cur ? 13 : 9, borderRadius: "50%", flexShrink: 0, background: reached ? st.accent : "var(--surface)", border: `2px solid ${reached ? st.accent : "var(--border)"}`, boxShadow: cur ? `0 0 0 4px ${st.accent}26` : "none", transition: "background 0.4s ease, border-color 0.4s ease, width 0.3s ease, height 0.3s ease" }} />
                    </div>
                  );
                })}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>05</span>
              </div>
            </div>

            {storyStages.map((s, i) => {
              const isOpen = mobileOpen === i;
              return (
              <motion.article
                key={s.id}
                data-idx={i}
                ref={(el) => { chapterRefs.current[i] = el; }}
                className={`relative pl-9 lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center lg:pl-0 ${i < revealed ? "" : "hidden lg:flex"}`}
                initial={!prefersReduced ? { opacity: 0, y: 36 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Mobile timeline rail — dot + connecting line */}
                <div aria-hidden="true" className="lg:hidden" style={{ position: "absolute", left: 1, top: "0.3rem", bottom: i < TOTAL - 1 ? "-4rem" : "auto", width: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: 15, height: 15, borderRadius: "50%", flexShrink: 0, zIndex: 1, background: i <= active ? s.accent : "var(--surface)", border: `2px solid ${i <= active ? s.accent : "var(--border)"}`, boxShadow: i === active ? `0 0 0 4px ${s.accent}24` : "none", transition: "all 0.4s ease" }} />
                  {i < TOTAL - 1 && <span style={{ flex: 1, width: 2, marginTop: 3, background: i < active ? s.accent : "var(--border)", opacity: i < active ? 0.5 : 1, transition: "all 0.4s ease" }} />}
                </div>

                {/* Tappable header — toggles the level on mobile; static on desktop */}
                <div onClick={() => setMobileOpen(isOpen ? null : i)} className="cursor-pointer select-none lg:cursor-default">

                {/* Level eyebrow */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600,
                    letterSpacing: "0.12em", color: s.accent,
                    padding: "0.2em 0.6em", borderRadius: "999px",
                    background: `${s.accent}16`, border: `1px solid ${s.accent}2E`,
                  }}>
                    LEVEL {s.level}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 600,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)",
                  }}>
                    {s.phase}
                  </span>
                </div>

                {/* Heading */}
                <h3
                  className="mb-5 font-semibold leading-[1.12] tracking-[-0.022em]"
                  style={{
                    fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
                    fontFamily: "var(--font-display)",
                    color: "var(--text)",
                    maxWidth: "24ch",
                  }}
                >
                  {s.heading}
                </h3>

                {/* Mobile expand affordance */}
                <div className="lg:hidden" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.7rem", marginTop: "0.9rem", marginBottom: isOpen ? "1.5rem" : "0.2rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 700, color: s.accent, padding: "0.3em 0.75em", borderRadius: "999px", background: `${s.accent}14`, border: `1px solid ${s.accent}2E` }}>
                    +{s.skills.length} Skills
                  </span>
                  {isOpen ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-mono)", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      Collapse <span style={{ display: "inline-block", transform: "rotate(180deg)" }}>▾</span>
                    </span>
                  ) : (
                    <motion.span
                      animate={!prefersReduced ? { boxShadow: [`0 4px 14px ${s.accent}44`, `0 6px 22px ${s.accent}77`, `0 4px 14px ${s.accent}44`] } : {}}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "0.45rem",
                        padding: "0.55rem 1.05rem", borderRadius: "999px",
                        background: s.accent, color: "#FFFFFF",
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 11V8a5 5 0 019.9-1M5 11h14v9H5v-9z" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Tap to unlock
                      <span aria-hidden="true">→</span>
                    </motion.span>
                  )}
                </div>
                </div>{/* /tappable header */}

                {/* Expandable content — collapsed on mobile until tapped, always open on desktop */}
                <div className={isOpen ? "block" : "hidden lg:block"}>

                {/* Skills card */}
                <div style={{
                  display: "inline-flex", flexWrap: "wrap", gap: "0.5rem",
                  padding: "0.9rem 1rem", marginBottom: "1.5rem", maxWidth: "fit-content",
                  borderRadius: "14px",
                  background: `linear-gradient(145deg, rgba(255,255,255,0.7) 0%, ${s.accent}10 100%)`,
                  border: `1px solid ${s.accent}24`,
                  boxShadow: `0 8px 24px rgba(0,0,0,0.04), 0 0 18px ${s.accent}12`,
                }}>
                  <span style={{
                    width: "100%", fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: s.accent, marginBottom: "0.15rem",
                  }}>
                    Unlocked
                  </span>
                  {s.skills.map((skill) => (
                    <span key={skill} style={{
                      display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 500,
                      color: "var(--text)", padding: "0.3em 0.7em", borderRadius: "999px",
                      background: "rgba(255,255,255,0.75)", border: `1px solid ${s.accent}2A`,
                    }}>
                      <span style={{ color: s.accent, fontWeight: 700 }}>+</span>
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Body */}
                <div className="flex flex-col gap-4" style={{ maxWidth: "52ch" }}>
                  {s.body.map((p, j) => (
                    <p key={j} className="text-base leading-[1.75]" style={{ color: "var(--text-muted)" }}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Continue Journey — mobile quest control (reveals the next level) */}
                {i === revealed - 1 && i < TOTAL - 1 && (
                  <button
                    type="button"
                    className="lg:hidden"
                    onClick={() => {
                      setRevealed(i + 2);
                      setMobileOpen(i + 1);
                      requestAnimationFrame(() => {
                        const next = chapterRefs.current[i + 1];
                        if (next) window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY - 120, behavior: prefersReduced ? "auto" : "smooth" });
                      });
                    }}
                    style={{
                      marginTop: "1.6rem", display: "inline-flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.7rem 1.2rem", borderRadius: "999px", cursor: "pointer",
                      background: s.accent, color: "#FFFFFF", border: "none",
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem",
                      boxShadow: `0 10px 24px ${s.accent}44`,
                    }}
                  >
                    Continue Journey
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                )}

                </div>{/* /expandable content */}
              </motion.article>
              );
            })}
          </div>
        </div>

        {/* ── Finale ────────────────────────────────────────────────────── */}
        <motion.div
          className={`mt-[clamp(3rem,7vw,7rem)] flex-col items-center text-center lg:flex ${revealed >= TOTAL ? "flex" : "hidden lg:flex"}`}
          initial={!prefersReduced ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Achievement trophy */}
          <motion.div
            initial={!prefersReduced ? { scale: 0.5, opacity: 0 } : false}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            style={{ position: "relative", marginBottom: "1.1rem" }}
          >
            <motion.span aria-hidden="true"
              animate={!prefersReduced ? { scale: [1, 1.25, 1], opacity: [0.5, 0.2, 0.5] } : {}}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,94,248,0.35), transparent 70%)", filter: "blur(8px)" }} />
            <span style={{ position: "relative", width: 64, height: 64, borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(150deg, rgba(43,107,255,0.14), rgba(109,94,248,0.18))", border: "1px solid rgba(109,94,248,0.35)", boxShadow: "0 14px 34px rgba(109,94,248,0.24)" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 4h10v4a5 5 0 01-10 0V4z" stroke="url(#trophyG)" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M9 16h6M10 16v3M14 16v3M8 21h8" stroke="url(#trophyG)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <defs><linearGradient id="trophyG" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="var(--accent)" /><stop offset="100%" stopColor="var(--accent-2)" /></linearGradient></defs>
              </svg>
            </span>
          </motion.div>

          {/* Game-completion badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.4rem 0.95rem", borderRadius: "999px", marginBottom: "1.25rem",
            background: "rgba(5,150,105,0.10)", border: "1px solid rgba(5,150,105,0.30)",
          }}>
            <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", boxShadow: "0 0 0 3px rgba(5,150,105,0.2)" }} />
            <span style={{
              fontFamily: "var(--font-display)", fontSize: "0.62rem", fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase", color: "#059669",
            }}>
              Builder OS Unlocked · 5 / 5 Levels Cleared
            </span>
          </div>

          {/* Completion stats */}
          <div className="flex flex-wrap justify-center gap-3" style={{ marginBottom: "1.75rem" }}>
            {([["5 / 5", "Levels"], ["15", "Skills"], ["Lv 05", "Founder"]] as const).map(([v, l]) => (
              <div key={l} style={{
                padding: "0.55rem 1rem", borderRadius: "12px", minWidth: "84px",
                background: "rgba(255,255,255,0.7)", border: "1px solid var(--border)",
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "var(--text)", lineHeight: 1.1 }}>{v}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "0.15rem" }}>{l}</div>
              </div>
            ))}
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.75rem" }}>
            {storyFinale.lead}
          </p>
          <h3
            className="font-semibold leading-[1.05] tracking-[-0.028em]"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3.25rem)",
              fontFamily: "var(--font-display)",
              maxWidth: "18ch",
              background: "linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >
            {storyFinale.emphasis}
          </h3>
          <a
            href={storyFinale.cta.href}
            className="group mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)", fontFamily: "var(--font-display)" }}
          >
            {storyFinale.cta.label}
            <ArrowUpRight size={15} strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Bridge into the Principles / Operating System section */}
          <p style={{
            marginTop: "2.5rem", fontFamily: "var(--font-caveat)", fontSize: "1.45rem",
            color: "var(--text-muted)", maxWidth: "30ch", lineHeight: 1.4,
          }}>
            Every lesson became a principle. Every principle became a system.
          </p>
        </motion.div>
      </Container>

      {/* ── Skill-unlock toast — single persistent element, animates visibility ── */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={toastOn ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", left: "2rem", bottom: "2rem", zIndex: 60,
          padding: "0.85rem 1.1rem", borderRadius: "14px",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: `1px solid ${accent}3A`,
          boxShadow: `0 12px 34px rgba(0,0,0,0.10), 0 0 22px ${accent}22`,
          display: "flex", alignItems: "center", gap: "0.8rem", pointerEvents: "none",
        }}
      >
        <span style={{
          width: 34, height: 34, borderRadius: "10px", flexShrink: 0,
          background: `${accent}1F`, border: `1px solid ${accent}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accent, fontWeight: 800, fontFamily: "var(--font-display)",
        }}>
          {stage.level}
        </span>
        <div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700,
            letterSpacing: "0.16em", textTransform: "uppercase", color: accent,
          }}>
            Skill Unlocked
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)",
          }}>
            {stage.phase}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
