"use client";

/**
 * Process — "Build Log" (founder journal deck).
 *
 * A fanned stack of notebook cards the visitor flips through. The front card is
 * a recorded thought (bold opinion + timestamp); tapping it FLIPS it in 3D to
 * the back — where that thought was actually applied (project / lesson /
 * result). Advancing slides the current card off to the left while the next
 * rises from the stack. Warm paper, faint rules, and a dog-eared corner sell
 * the "journal" feel.
 *
 * Distinct visual language from every other section. Respects
 * prefers-reduced-motion (no 3D flourish, instant navigation).
 */

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui";
import { processSteps, processSectionIntro } from "@/content/process";

const TOTAL = processSteps.length;

/* Stack transform by offset from the active (front) card — a fanned deck. */
function cardStyle(offset: number, pr: boolean | null) {
  if (offset < 0) return { x: -90, y: 0, scale: 0.96, rotate: pr ? 0 : -4, opacity: 0, z: 1 };
  const fan = [
    { x: 0,  y: 0,  scale: 1,    rotate: 0,   opacity: 1,    z: 40 },
    { x: 8,  y: 14, scale: 0.97, rotate: 1.5, opacity: 0.7,  z: 39 },
    { x: 14, y: 26, scale: 0.94, rotate: 2.6, opacity: 0.42, z: 38 },
    { x: 19, y: 36, scale: 0.92, rotate: 3.4, opacity: 0.22, z: 37 },
  ];
  const m = fan[offset] ?? { x: 22, y: 44, scale: 0.9, rotate: 3.6, opacity: 0, z: 36 - offset };
  return { x: m.x, y: m.y, scale: m.scale, rotate: pr ? 0 : m.rotate, opacity: m.opacity, z: m.z };
}

function ArrowBtn({ dir, disabled, onClick, label }: {
  dir: "prev" | "next"; disabled: boolean; onClick: () => void; label: string;
}) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-label={label}
      className="flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-30 hover:enabled:border-[var(--accent)] hover:enabled:shadow-[0_0_0_4px_rgba(43,107,255,0.12)]"
      style={{ width: 46, height: 46, border: "1px solid var(--border)", background: "transparent", cursor: disabled ? "default" : "pointer" }}
    >
      <span style={{ fontSize: "1.1rem", lineHeight: 1, color: "var(--text-muted)" }}>{dir === "prev" ? "←" : "→"}</span>
    </button>
  );
}

/* Shared notebook chrome (ruled lines, margin, dog-ear) for both faces. */
function PaperChrome({ tint }: { tint?: string }) {
  return (
    <>
      {/* horizontal ruling */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, borderRadius: "20px", pointerEvents: "none",
        background: "repeating-linear-gradient(transparent 0, transparent 30px, rgba(10,10,20,0.035) 31px)",
        opacity: 0.7,
      }} />
      {/* margin rule */}
      <div aria-hidden="true" style={{ position: "absolute", left: "2.7rem", top: 0, bottom: 0, width: 1, background: tint ?? "rgba(43,107,255,0.14)" }} />
      {/* dog-eared corner */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, right: 0, width: 0, height: 0,
        borderStyle: "solid", borderWidth: "0 26px 26px 0",
        borderColor: "transparent rgba(0,0,0,0.05) transparent transparent",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, right: 0, width: 0, height: 0,
        borderStyle: "solid", borderWidth: "26px 0 0 26px",
        borderColor: `${tint ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.85)"} transparent transparent transparent`,
        filter: "drop-shadow(-1px 1px 1px rgba(0,0,0,0.05))",
      }} />
    </>
  );
}

export function Process() {
  const pr = useReducedMotion();
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const goTo = (i: number) => { setActive(Math.min(TOTAL - 1, Math.max(0, i))); setFlipped(false); };
  const go = (d: number) => goTo(active + d);
  const headlineLines = processSectionIntro.headline.split("\n");

  const paperBg = "linear-gradient(170deg, #FFFEFB 0%, #FAF7F0 100%)";

  return (
    <section id="process" style={{ backgroundColor: "var(--bg)" }} className="relative py-[clamp(4rem,7vw,8rem)]">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16 lg:items-center">

          {/* ── LEFT: intro + controls ───────────────────────────────────── */}
          <motion.div
            initial={!pr ? { opacity: 0, y: 22 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M16 3l5 5L8 21H3v-5L16 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {processSectionIntro.eyebrow}
            </p>
            <h2 className="font-semibold leading-[1.04] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
              {headlineLines.map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <p className="mt-6 text-base leading-[1.75]" style={{ color: "var(--text-muted)", maxWidth: "40ch" }}>
              {processSectionIntro.subheadline}
            </p>

            <div className="mt-9 flex items-center gap-5">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "var(--text)" }}>
                <span style={{ fontWeight: 700 }}>{String(active + 1).padStart(2, "0")}</span>
                <span style={{ color: "var(--text-muted)" }}> / {String(TOTAL).padStart(2, "0")}</span>
              </div>
              <div className="flex gap-2.5">
                <ArrowBtn dir="prev" disabled={active === 0} onClick={() => go(-1)} label="Previous entry" />
                <ArrowBtn dir="next" disabled={active === TOTAL - 1} onClick={() => go(1)} label="Next entry" />
              </div>
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
              {flipped ? "Tap to flip back ↩" : "Tap the entry to flip →"}
            </p>
          </motion.div>

          {/* ── RIGHT: card deck ─────────────────────────────────────────── */}
          <div style={{ position: "relative", height: 420 }}>
            {processSteps.map((entry, i) => {
              const offset = i - active;
              const s = cardStyle(offset, pr);
              const isFront = offset === 0;
              const headLines = entry.headline.split("\n");
              return (
                <motion.div
                  key={entry.id}
                  initial={false}
                  animate={{ x: s.x, y: s.y, scale: s.scale, rotate: s.rotate, opacity: s.opacity }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  onClick={() => isFront && setFlipped((f) => !f)}
                  style={{
                    position: "absolute", inset: 0, zIndex: s.z,
                    transformOrigin: "center top",
                    pointerEvents: isFront ? "auto" : "none",
                    cursor: isFront ? "pointer" : "default",
                  }}
                >
                  {/* flip wrapper (perspective) */}
                  <div style={{ perspective: 1800, height: "100%" }}>
                    <motion.div
                      animate={{ rotateY: isFront && flipped && !pr ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      style={{ position: "relative", height: "100%", transformStyle: "preserve-3d" }}
                    >
                      {/* ── FRONT ── */}
                      <div style={{
                        position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                        overflow: "hidden", borderRadius: "20px",
                        display: "flex", flexDirection: "column", padding: "1.75rem 1.9rem",
                        background: paperBg, border: "1px solid var(--border)",
                        boxShadow: isFront ? "0 30px 60px rgba(0,0,0,0.10), 0 8px 20px rgba(0,0,0,0.05)" : "0 12px 30px rgba(0,0,0,0.05)",
                      }}>
                        <PaperChrome />
                        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.4rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", padding: "0.25em 0.6em", borderRadius: "999px", background: "rgba(43,107,255,0.08)", border: "1px solid rgba(43,107,255,0.2)" }}>
                              LOG {String(entry.step).padStart(2, "0")}
                            </span>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                              {entry.phase}
                            </span>
                          </div>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--text-muted)" }}>{entry.time}</span>
                        </div>
                        <h3 style={{ position: "relative", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.4vw, 1.95rem)", lineHeight: 1.12, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "1rem", whiteSpace: "pre-line" }}>
                          {headLines.map((l, j) => <span key={j} className="block">{l}</span>)}
                        </h3>
                        <p style={{ position: "relative", fontSize: "0.875rem", lineHeight: 1.7, color: "var(--text-muted)", marginBottom: "auto" }}>
                          {entry.description}
                        </p>
                        <div style={{ position: "relative", marginTop: "1.25rem", paddingLeft: "0.9rem", borderLeft: "2px solid var(--accent)" }}>
                          <p style={{ fontSize: "0.82rem", fontStyle: "italic", lineHeight: 1.5, color: "var(--text)" }}>{entry.insight}</p>
                        </div>
                      </div>

                      {/* ── BACK ── */}
                      <div style={{
                        position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        overflow: "hidden", borderRadius: "20px",
                        display: "flex", flexDirection: "column", padding: "1.75rem 1.9rem",
                        background: "linear-gradient(170deg, #FBFAFF 0%, #F3F0FB 100%)",
                        border: "1px solid rgba(109,94,248,0.28)",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.10), 0 8px 20px rgba(0,0,0,0.05)",
                      }}>
                        <PaperChrome tint="rgba(109,94,248,0.16)" />
                        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.4rem" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent-2)", padding: "0.25em 0.6em", borderRadius: "999px", background: "rgba(109,94,248,0.1)", border: "1px solid rgba(109,94,248,0.26)" }}>
                            LOG {String(entry.step).padStart(2, "0")} · APPLIED
                          </span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Archived</span>
                        </div>

                        <div style={{ position: "relative", marginBottom: "1.3rem" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.3rem" }}>Project</div>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem", color: "var(--text)", letterSpacing: "-0.01em" }}>{entry.back.project}</div>
                        </div>
                        <div style={{ position: "relative", marginBottom: "1.1rem" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.3rem" }}>Lesson</div>
                          <p style={{ fontSize: "0.92rem", lineHeight: 1.55, color: "var(--text)" }}>{entry.back.lesson}</p>
                        </div>
                        <div style={{ position: "relative", marginTop: "auto" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-2)", marginBottom: "0.3rem" }}>Result</div>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--accent-2)", lineHeight: 1.35 }}>{entry.back.result}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── LOG tabs ──────────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-wrap justify-center gap-2">
          {processSteps.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Log ${i + 1}: ${s.phase}`}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.06em",
                  padding: "0.4em 0.7em", borderRadius: "8px", cursor: "pointer",
                  color: on ? "var(--bg)" : "var(--text-muted)",
                  background: on ? "var(--text)" : "transparent",
                  border: `1px solid ${on ? "var(--text)" : "var(--border)"}`,
                  transition: "all 0.2s ease",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
