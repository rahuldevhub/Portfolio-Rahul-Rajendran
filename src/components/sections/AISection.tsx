"use client";

/**
 * AISection — "AI Operations" command center.
 *
 * A co-pilot network, not a tool list. Four AI models orbit a central decision
 * core (Rahul); on scroll-in each model comes online in turn, sending a signal
 * inward, and the core routes the combined signal down into the OUTPUT row
 * (Products / Content / Systems / Automation). Hovering a model reads it out.
 *
 * Story: AI assists, the human decides. Visual language: a radial command
 * center with flowing signal — distinct from the cards / tree / stack / journal
 * elsewhere. Respects prefers-reduced-motion.
 */

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui";
import { aiTools, aiCore, aiOutputs, aiSectionIntro } from "@/content/ai";
import type { AITool } from "@/content/ai";

const VW = 460;
const VH = 380;
const CX = 230;
const CY = 190;
const TOTAL = aiTools.length;

/* ── Connector lines with signal flowing inward to the core ─────────────── */
function Wires({ activeCount, hoveredId, prefersReduced }: {
  activeCount: number; hoveredId: string | null; prefersReduced: boolean | null;
}) {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%"
      style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "visible" }} aria-hidden="true">
      {aiTools.map((t, i) => {
        const on = i < activeCount;
        const hot = hoveredId === t.id;
        return (
          <g key={t.id}>
            <line x1={t.node.x} y1={t.node.y} x2={CX} y2={CY}
              stroke={on ? t.accent : "var(--border)"}
              strokeWidth={hot ? 2.6 : on ? 1.8 : 1.2}
              opacity={on ? (hot ? 0.95 : 0.5) : 0.4}
              style={{ transition: "stroke 0.4s ease, opacity 0.4s ease, stroke-width 0.3s ease" }}
            />
            {on && !prefersReduced && (
              <motion.circle r={hot ? 3.4 : 2.8} fill={t.accent}
                animate={{ cx: [t.node.x, CX], cy: [t.node.y, CY], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "linear", delay: i * 0.25 }}
                style={{ filter: `drop-shadow(0 0 4px ${t.accent})` }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── A model satellite (orb + label) ────────────────────────────────────── */
function Satellite({ tool, on, hot, onHover }: {
  tool: AITool; on: boolean; hot: boolean; onHover: (v: boolean) => void;
}) {
  const a = tool.accent;
  const dir = tool.labelSide;
  const flex = dir === "top" ? "column-reverse" : dir === "bottom" ? "column"
    : dir === "left" ? "row-reverse" : "row";
  const align = dir === "left" ? "flex-end" : dir === "right" ? "flex-start" : "center";
  const textAlign = dir === "left" ? "right" : dir === "right" ? "left" : "center";
  return (
    <div
      onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}
      style={{
        position: "absolute", left: `${(tool.node.x / VW) * 100}%`, top: `${(tool.node.y / VH) * 100}%`,
        transform: "translate(-50%, -50%)", zIndex: 3,
        display: "flex", flexDirection: flex, alignItems: align, gap: "0.5rem", cursor: "default",
      }}
    >
      {/* orb */}
      <motion.div
        animate={{ scale: hot ? 1.12 : 1, opacity: on ? 1 : 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{
          position: "relative", width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
          background: on ? `radial-gradient(circle at 50% 40%, ${a}26 0%, rgba(255,255,255,0.96) 72%)` : "var(--bg)",
          border: `2px solid ${on ? a : "var(--border)"}`,
          boxShadow: on ? (hot ? `0 0 0 6px ${a}1C, 0 8px 22px ${a}3A` : `0 4px 14px ${a}26`) : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.3s ease",
        }}
      >
        {/* pulsing core */}
        <motion.span
          animate={on ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.4 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 12, height: 12, borderRadius: "50%", background: on ? a : "var(--text-muted)" }}
        />
      </motion.div>
      {/* label */}
      <div style={{ textAlign: textAlign as React.CSSProperties["textAlign"], minWidth: 70 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem", color: "var(--text)", lineHeight: 1.1 }}>
          {tool.name}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.06em", textTransform: "uppercase", color: on ? a : "var(--text-muted)", transition: "color 0.4s ease" }}>
          {tool.role}
        </div>
      </div>
    </div>
  );
}

export function AISection() {
  const prefersReduced = useReducedMotion();
  const [activeCount, setActiveCount] = useState(prefersReduced ? TOTAL : 0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const netRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (prefersReduced) { setActiveCount(TOTAL); return; }
    const el = netRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          let n = 0;
          const tick = () => { n += 1; setActiveCount(n); if (n < TOTAL) timer = window.setTimeout(tick, 520); };
          let timer = window.setTimeout(tick, 400);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  const complete = activeCount >= TOTAL;
  const coreOn = activeCount > 0;
  const headlineLines = aiSectionIntro.headline.split("\n");
  const readout = hoveredId ? aiTools.find((t) => t.id === hoveredId)! : null;

  return (
    <section style={{ backgroundColor: "var(--surface)" }} className="relative py-[clamp(4rem,7vw,8rem)]">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-16 lg:items-center">

          {/* ── LEFT: thesis + readout ───────────────────────────────────── */}
          <motion.div
            initial={!prefersReduced ? { opacity: 0, y: 22 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 3px rgba(43,107,255,0.16)" }} />
              {aiSectionIntro.eyebrow}
            </p>
            <h2 className="font-semibold leading-[1.05] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3.1rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
              <span className="block">{headlineLines[0]}</span>
              <span className="block" style={{
                background: "linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {headlineLines[1]}
              </span>
            </h2>
            <p className="mt-6 text-base leading-[1.75]" style={{ color: "var(--text-muted)", maxWidth: "42ch" }}>
              {aiSectionIntro.body}
            </p>

            {/* live readout */}
            <div className="mt-8" style={{
              minHeight: 64, padding: "0.85rem 1.1rem", borderRadius: "14px",
              background: "rgba(255,255,255,0.6)", border: `1px solid ${readout ? readout.accent + "3A" : "var(--border)"}`,
              transition: "border-color 0.3s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: complete ? "#059669" : "var(--accent)", boxShadow: `0 0 0 3px ${complete ? "rgba(5,150,105,0.2)" : "rgba(43,107,255,0.16)"}` }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {readout ? readout.role + " Layer" : complete ? "All systems active · 4 co-pilots online" : "Booting co-pilots…"}
                </span>
              </div>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--text)" }}>
                {readout ? readout.description : "Hover a model to inspect its role. Every signal routes through one decision layer — mine."}
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT: command center ────────────────────────────────────── */}
          <div ref={netRef}>
            {/* network */}
            <div className="relative mx-auto w-full" style={{ maxWidth: "460px", height: 380 }}>
              <Wires activeCount={activeCount} hoveredId={hoveredId} prefersReduced={prefersReduced} />

              {aiTools.map((t, i) => (
                <Satellite key={t.id} tool={t} on={i < activeCount} hot={hoveredId === t.id}
                  onHover={(v) => setHoveredId(v ? t.id : null)} />
              ))}

              {/* core — Rahul / Decision Engine */}
              <div style={{
                position: "absolute", left: `${(CX / VW) * 100}%`, top: `${(CY / VH) * 100}%`,
                transform: "translate(-50%, -50%)", zIndex: 4,
              }}>
                <motion.div
                  animate={coreOn ? { scale: 1 } : { scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  style={{
                    position: "relative", width: 104, height: 104, borderRadius: "26px",
                    background: "linear-gradient(150deg, #FFFFFF 0%, rgba(43,107,255,0.08) 100%)",
                    border: "1.5px solid rgba(109,94,248,0.4)",
                    boxShadow: coreOn ? "0 14px 40px rgba(109,94,248,0.28), 0 0 26px rgba(43,107,255,0.18)" : "0 8px 22px rgba(0,0,0,0.06)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    transition: "box-shadow 0.5s ease",
                  }}
                >
                  {coreOn && !prefersReduced && (
                    <motion.span aria-hidden="true"
                      animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      style={{ position: "absolute", inset: -5, borderRadius: "30px", background: "conic-gradient(from 0deg, transparent, rgba(43,107,255,0.5), rgba(109,94,248,0.6), transparent)", filter: "blur(5px)", opacity: 0.55, zIndex: -1 }}
                    />
                  )}
                  <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.01em",
                    background: "linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%)",
                    WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    {aiCore.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    {aiCore.role}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* output beam */}
            <div aria-hidden="true" style={{ position: "relative", height: 28, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 2, height: "100%", background: complete ? "var(--accent-2)" : "var(--border)", opacity: complete ? 0.6 : 1, transition: "all 0.4s ease" }} />
              {complete && !prefersReduced && (
                <motion.span animate={{ top: ["-10%", "110%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ position: "absolute", left: "50%", marginLeft: -3, width: 6, height: 6, borderRadius: "50%", background: "var(--accent-2)", boxShadow: "0 0 8px var(--accent-2)" }} />
              )}
            </div>

            {/* output row */}
            <motion.div
              animate={complete ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 6 }}
              transition={{ duration: 0.5 }}
              style={{
                padding: "1rem 1.2rem", borderRadius: "16px",
                background: "linear-gradient(120deg, rgba(43,107,255,0.07), rgba(109,94,248,0.08))",
                border: "1px solid rgba(109,94,248,0.26)",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-2)", marginBottom: "0.6rem", textAlign: "center" }}>
                Output
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {aiOutputs.map((o) => (
                  <span key={o} style={{
                    fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text)",
                    padding: "0.35em 0.85em", borderRadius: "999px",
                    background: "rgba(255,255,255,0.75)", border: "1px solid var(--border)",
                  }}>
                    {o}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
