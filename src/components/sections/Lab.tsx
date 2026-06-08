"use client";

/**
 * Lab — "Rahul's Open Tabs".
 *
 * A custom minimal browser window showing the projects/ideas currently "open"
 * in Rahul's head. Left column = editorial intro with a blinking cursor; right
 * column = a premium browser with switchable tabs, an active-tab detail card,
 * a dark "Tab Insights" panel, and a status footer.
 *
 * Arc × Linear × Raycast energy — clean, editorial, builder. Not a dashboard,
 * not a game. Respects prefers-reduced-motion.
 */

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Section, Container } from "@/components/ui";
import { openTabs, labIntro } from "@/content/lab";
import type { OpenTab } from "@/content/lab";

/* ── Inline glyphs ──────────────────────────────────────────────────────── */
const Star = ({ s = 16, c = "currentColor", fill = "none" }: { s?: number; c?: string; fill?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} aria-hidden="true"><path d="M12 3l2.6 6.3L21 10l-4.8 4.2 1.5 6.3L12 17.4 6.3 20.5l1.5-6.3L3 10l6.4-.7L12 3z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /></svg>
);
const Clock = ({ s = 16, c = "currentColor" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7" /><path d="M12 7.5V12l3 2" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Brain = ({ s = 16, c = "currentColor" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4a3 3 0 00-3 3 3 3 0 00-1 5.8A3 3 0 008 17a3 3 0 003-3V6a2 2 0 00-2-2zM15 4a3 3 0 013 3 3 3 0 011 5.8A3 3 0 0116 17a3 3 0 01-3-3V6a2 2 0 012-2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /></svg>
);
const Trend = ({ s = 16, c = "currentColor" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 17l6-6 4 4 7-7" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 8h4v4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Bulb = ({ s = 16, c = "currentColor" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.5.4.5.6.5 1.1v1h6v-1c0-.5 0-.7.5-1.1A6 6 0 0012 3z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Close = ({ s = 12, c = "currentColor" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
);

/* ── Metadata cell ──────────────────────────────────────────────────────── */
function MetaCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{label}</div>
      {children}
    </div>
  );
}

export function Lab() {
  const prefersReduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = openTabs[activeIdx] as OpenTab;
  const activeId = active.id;
  const headlineLines = labIntro.headline.split("\n");

  /* Auto-rotate the tabs like a real browser; pause on hover. */
  useEffect(() => {
    if (prefersReduced || paused) return;
    const iv = setInterval(() => setActiveIdx((i) => (i + 1) % openTabs.length), 4500);
    return () => clearInterval(iv);
  }, [prefersReduced, paused]);

  return (
    <Section id="lab" bg="surface">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.72fr_1fr] lg:gap-14 lg:items-center">

          {/* ── LEFT: intro ──────────────────────────────────────────────── */}
          <motion.div
            initial={!prefersReduced ? { opacity: 0, y: 22 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
              {labIntro.eyebrow}
            </p>
            <h2 className="font-semibold leading-[1.0] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.5rem, 4.2vw, 3.75rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
              {headlineLines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                  {i === headlineLines.length - 1 && (
                    <motion.span aria-hidden="true"
                      animate={!prefersReduced ? { opacity: [1, 1, 0, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
                      style={{ display: "inline-block", width: "0.07em", height: "0.92em", marginLeft: "0.08em", background: "var(--accent)", verticalAlign: "text-bottom", borderRadius: "1px" }} />
                  )}
                </span>
              ))}
            </h2>
            <p className="mt-4" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem", color: "var(--accent)", textDecoration: "underline", textDecorationColor: "rgba(79,124,255,0.32)", textUnderlineOffset: "5px" }}>
              {labIntro.note}
            </p>
            <div className="mt-7" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              <p style={{ color: "var(--text)", fontWeight: 600, marginBottom: "0.5rem" }}>{labIntro.punch}</p>
              {labIntro.description.map((l, i) => <p key={i} style={{ color: "var(--text-muted)" }}>{l}</p>)}
            </div>

            {/* Current mode card */}
            <div className="mt-8 inline-flex items-center gap-3.5" style={{ padding: "0.9rem 1.25rem", borderRadius: "16px", background: "rgba(255,255,255,0.7)", border: "1px solid var(--border)", boxShadow: "0 8px 22px rgba(0,0,0,0.04)" }}>
              <span style={{ width: 44, height: 44, borderRadius: "12px", flexShrink: 0, background: "rgba(79,124,255,0.1)", border: "1px solid rgba(79,124,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={18} strokeWidth={1.9} style={{ color: "var(--accent)" }} aria-hidden="true" />
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>Current Mode</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--text)" }}>{labIntro.mode}</div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: browser window ────────────────────────────────────── */}
          <motion.div
            onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            initial={!prefersReduced ? { opacity: 0, y: 26, scale: 0.98 } : false}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid var(--border)", background: "#FFFFFF", boxShadow: "0 30px 70px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.05)" }}
          >
            {/* Tab bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 0.9rem 0", background: "var(--surface)", borderBottom: "1px solid var(--border)", overflowX: "auto", scrollbarWidth: "none" }}>
              <div style={{ display: "flex", gap: "0.4rem", padding: "0 0.5rem 0.7rem", flexShrink: 0 }} aria-hidden="true">
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                ))}
              </div>
              {openTabs.map((t, i) => {
                const on = t.id === activeId;
                return (
                  <motion.button key={t.id} type="button" onClick={() => setActiveIdx(i)}
                    whileHover={!prefersReduced ? { y: -2 } : {}}
                    style={{
                      position: "relative", display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0,
                      padding: "0.6rem 0.85rem", marginBottom: "-1px",
                      borderTopLeftRadius: "10px", borderTopRightRadius: "10px",
                      background: on ? "#FFFFFF" : "transparent",
                      border: on ? "1px solid var(--border)" : "1px solid transparent",
                      borderBottom: on ? "1px solid #FFFFFF" : "1px solid transparent",
                      cursor: "pointer",
                    }}>
                    {/* live-pulse dot on the active tab */}
                    <span style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
                      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: t.accent }} />
                      {on && !prefersReduced && (
                        <motion.span aria-hidden="true" animate={{ scale: [1, 2.6], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: t.accent }} />
                      )}
                    </span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: on ? 600 : 500, color: on ? "var(--text)" : "var(--text-muted)", whiteSpace: "nowrap" }}>{t.name}</span>
                    <span style={{ color: "var(--text-muted)", opacity: on ? 0.7 : 0.4, display: "flex" }}><Close s={11} c="currentColor" /></span>
                    {on && (
                      <motion.span layoutId="lab-tab-underline" style={{ position: "absolute", left: "0.7rem", right: "0.7rem", bottom: -1, height: 2, borderRadius: "2px", background: "var(--accent)" }} />
                    )}
                  </motion.button>
                );
              })}
              <button type="button" aria-label="More tabs" style={{ flexShrink: 0, marginBottom: "0.5rem", width: 28, height: 28, borderRadius: "8px", border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>+</button>
            </div>

            {/* Content area */}
            <div className="flex flex-col gap-4 p-5 lg:flex-row" style={{ background: "#FFFFFF" }}>
              {/* Active tab card */}
              <motion.div
                key={active.id}
                initial={!prefersReduced ? { opacity: 0, x: 16 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ flex: 1, minWidth: 0, padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border)", background: "#FFFFFF" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span style={{ display: "inline-block", fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: active.accent, padding: "0.3em 0.7em", borderRadius: "999px", background: `${active.accent}16`, border: `1px solid ${active.accent}2E` }}>
                    {active.status}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontFamily: "var(--font-mono)", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#EF4444" }}>
                    <span style={{ position: "relative", width: 6, height: 6 }}>
                      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#EF4444" }} />
                      {!prefersReduced && (
                        <motion.span aria-hidden="true" animate={{ scale: [1, 2.4], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#EF4444" }} />
                      )}
                    </span>
                    Live
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1rem" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.7rem", color: "var(--text)", letterSpacing: "-0.02em" }}>{active.name}</h3>
                  <span style={{ width: 30, height: 30, borderRadius: "9px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><Star s={15} /></span>
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--text-muted)", marginBottom: "1.1rem", maxWidth: "44ch" }}>{active.description}</p>
                {/* last touched — compact line */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.3rem", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                  <Clock s={13} c="currentColor" /> Last touched · {active.updated}
                </div>
                <div style={{ height: 1, background: "var(--border)", marginBottom: "1.4rem" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "1rem", alignItems: "center", marginBottom: "1.4rem" }}>
                  <MetaCell label="Current Focus">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ width: 36, height: 36, borderRadius: "10px", flexShrink: 0, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: active.accent }}><Brain s={18} c={active.accent} /></span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.25 }}>{active.focus}</span>
                    </div>
                  </MetaCell>
                  <MetaCell label="Stage">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.4em 0.75em", borderRadius: "999px", background: `${active.accent}14`, border: `1px solid ${active.accent}2E` }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: active.accent }} />
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: active.accent }}>{active.stage}</span>
                    </span>
                  </MetaCell>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", padding: "0.9rem 1rem", borderRadius: "12px", background: `${active.accent}0E`, border: `1px solid ${active.accent}22` }}>
                  <Sparkles size={16} strokeWidth={2} style={{ color: active.accent, flexShrink: 0, marginTop: "0.1rem" }} aria-hidden="true" />
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: active.accent, marginBottom: "0.2rem" }}>Current Obsession</div>
                    <div style={{ fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.45 }}>{active.obsession}</div>
                  </div>
                </div>
              </motion.div>

              {/* Tab insights (dark) */}
              <div className="w-full lg:w-[244px] lg:shrink-0" style={{ padding: "1.3rem", borderRadius: "16px", background: "#0E1117", alignSelf: "stretch" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.3rem" }}>
                  <Trend s={16} c="#9AA4B2" />
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>{labIntro.panelTitle}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {openTabs.map((t, i) => {
                    const sel = t.id === activeId;
                    return (
                      <button key={t.id} type="button" onClick={() => setActiveIdx(i)}
                        style={{ display: "flex", flexDirection: "column", gap: "0.4rem", background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent, boxShadow: sel ? `0 0 8px ${t.accent}` : "none" }} />
                            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", fontWeight: sel ? 700 : 500, color: sel ? "#FFFFFF" : "rgba(255,255,255,0.72)" }}>{t.name}</span>
                          </span>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, color: sel ? t.accent : "rgba(255,255,255,0.6)" }}>{t.bandwidth}%</span>
                        </span>
                        <span style={{ height: 4, borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <motion.span initial={false} animate={{ width: `${t.bandwidth}%`, opacity: sel ? 1 : 0.55 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            style={{ display: "block", height: "100%", borderRadius: "999px", background: t.accent }} />
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: "1.4rem", display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.85rem", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ color: "#FEBC2E", flexShrink: 0 }}><Bulb s={16} c="#FEBC2E" /></span>
                  <span style={{ fontSize: "0.72rem", lineHeight: 1.45, color: "rgba(255,255,255,0.6)" }}>Many more ideas on the list. Some are quiet. Some are crazy.</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "0.85rem 1.4rem", borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.7rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <motion.span animate={!prefersReduced ? { opacity: [1, 0.4, 1] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)", flexShrink: 0 }} />
                {labIntro.counters.map((c, i) => (
                  <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
                    {i > 0 && <span style={{ opacity: 0.4 }}>·</span>}
                    <span><span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)" }}>{c.value}</span> {c.label}</span>
                  </span>
                ))}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-caveat)", fontSize: "1.15rem", color: "var(--accent)" }}>
                More coming soon
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
