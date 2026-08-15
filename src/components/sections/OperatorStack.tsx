"use client";

/**
 * OperatorStack — "System Architecture".
 *
 * Left: the thesis (most people work inside one layer; Rahul connects the whole
 * stack). Right: six horizontal layer slabs stacked vertically, joined by energy
 * connectors. When the section scrolls into view a signal cascades down the
 * stack — Business → Product → Design → Engineering → AI → Automation — lighting
 * each layer in turn, then resolving into a "Product Builder" output node.
 *
 * A different visual language from the Story (character), Principles (cards) and
 * Skill Tree (node graph): an architecture diagram with flowing signal.
 * Respects prefers-reduced-motion.
 */

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Target, Pen, Code2, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui";
import { stackLayers, stackOutput, stackSectionIntro } from "@/content/stack";
import type { StackLayer, StackIcon } from "@/content/stack";

const TOTAL = stackLayers.length;

/* ── Icons (Business is inline; the rest are confirmed-safe lucide) ──────── */
function BusinessGlyph({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
const LUCIDE: Partial<Record<StackIcon, LucideIcon>> = { Target, Pen, Code2, Sparkles, Zap };
function StackGlyph({ icon, size, color }: { icon: StackIcon; size: number; color: string }) {
  if (icon === "Business") return <BusinessGlyph size={size} color={color} />;
  const Icon = LUCIDE[icon]!;
  return <Icon size={size} strokeWidth={1.9} style={{ color }} aria-hidden="true" />;
}

/* ── Energy connector between two slabs ─────────────────────────────────── */
function Connector({ lit, accent, prefersReduced }: { lit: boolean; accent: string; prefersReduced: boolean | null }) {
  return (
    <div style={{ position: "relative", height: 26, display: "flex", justifyContent: "center" }} aria-hidden="true">
      <div style={{
        width: 2, height: "100%", borderRadius: 2,
        background: lit ? accent : "var(--border)",
        opacity: lit ? 0.6 : 1, transition: "background 0.4s ease, opacity 0.4s ease",
      }} />
      {/* travelling signal dot */}
      {lit && !prefersReduced && (
        <motion.span
          initial={{ top: "-10%", opacity: 0 }}
          animate={{ top: ["-10%", "110%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", left: "50%", marginLeft: -3, width: 6, height: 6, borderRadius: "50%",
            background: accent, boxShadow: `0 0 8px ${accent}`,
          }}
        />
      )}
    </div>
  );
}

/* ── A layer slab ───────────────────────────────────────────────────────── */
function Slab({ layer, lit, hovered, onHover }: {
  layer: StackLayer; lit: boolean; hovered: boolean; onHover: (v: boolean) => void;
}) {
  const a = layer.accent;
  return (
    <motion.div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      animate={{ opacity: lit ? 1 : 0.55 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "relative", borderRadius: "16px", overflow: "hidden",
        padding: "0.95rem 1.1rem",
        background: lit
          ? `linear-gradient(100deg, rgba(255,255,255,0.96) 0%, ${a}12 100%)`
          : "rgba(255,255,255,0.7)",
        border: `1px solid ${lit ? a + "44" : "var(--border)"}`,
        boxShadow: lit
          ? (hovered ? `0 16px 38px ${a}2E, 0 0 24px ${a}26` : `0 8px 22px ${a}1F`)
          : "0 4px 14px rgba(0,0,0,0.03)",
        transform: hovered ? "translateX(4px)" : "none",
        transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.3s ease, transform 0.3s ease",
        cursor: "default",
      }}
    >
      {/* accent rail */}
      <div aria-hidden="true" style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: lit ? a : "var(--border)", transition: "background 0.4s ease",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", paddingLeft: "0.3rem" }}>
        <div style={{
          width: 42, height: 42, borderRadius: "12px", flexShrink: 0,
          background: lit ? `linear-gradient(150deg, ${a}26, ${a}0D)` : "var(--surface)",
          border: `1.5px solid ${lit ? a + "38" : "var(--border)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: lit ? `0 4px 12px ${a}22` : "none",
          transition: "all 0.4s ease",
        }}>
          <StackGlyph icon={layer.icon} size={20} color={lit ? a : "#B5B5C0"} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.02rem", color: "var(--text)", lineHeight: 1.15 }}>
            {layer.name}
          </div>
          <div style={{ fontSize: "0.78rem", color: lit ? a : "var(--text-muted)", fontWeight: 500, transition: "color 0.4s ease" }}>
            {layer.question}
          </div>
        </div>

        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600,
          color: lit ? a : "var(--text-muted)", opacity: lit ? 0.9 : 0.4,
          letterSpacing: "0.05em", flexShrink: 0,
        }}>
          {String(layer.index).padStart(2, "0")}
        </span>
      </div>

      {/* description — reveals on hover */}
      <motion.div
        initial={false}
        animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p style={{ margin: "0.7rem 0 0", paddingLeft: "0.3rem", fontSize: "0.78rem", lineHeight: 1.55, color: "var(--text-muted)" }}>
          {layer.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function OperatorStack() {
  const prefersReduced = useReducedMotion();
  const [activeCount, setActiveCount] = useState(prefersReduced ? TOTAL : 0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  /* Cascade the signal down the stack once it enters view. */
  useEffect(() => {
    if (prefersReduced) { setActiveCount(TOTAL); return; }
    const el = stackRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          let n = 0;
          const tick = () => {
            n += 1;
            setActiveCount(n);
            if (n < TOTAL) timer = window.setTimeout(tick, 460);
          };
          let timer = window.setTimeout(tick, 350);
        }
      });
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  const complete = activeCount >= TOTAL;
  const problem = stackSectionIntro.problemLine.split("\n");
  const solution = stackSectionIntro.solutionLine.split("\n");

  return (
    <section id="operator-stack" style={{ backgroundColor: "var(--bg)" }} className="relative py-[clamp(4rem,7vw,8rem)]">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:items-center">

          {/* ── LEFT: thesis ─────────────────────────────────────────────── */}
          <motion.div
            initial={!prefersReduced ? { opacity: 0, y: 22 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              {stackSectionIntro.eyebrow}
            </p>
            <h2 className="font-semibold leading-[1.06] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 3.4vw, 3rem)", fontFamily: "var(--font-display)" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                {problem.map((l, i) => <span key={i} className="block">{l}</span>)}
              </span>
              <span style={{
                display: "block", marginTop: "0.3em",
                background: "linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {solution.map((l, i) => <span key={i} className="block">{l}</span>)}
              </span>
            </h2>
            <p className="mt-7 text-base leading-[1.75]" style={{ color: "var(--text-muted)", maxWidth: "42ch" }}>
              {stackSectionIntro.body}
            </p>

            <div className="mt-7 flex items-center gap-2.5">
              <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: complete ? "#059669" : "var(--accent)", boxShadow: `0 0 0 3px ${complete ? "rgba(5,150,105,0.2)" : "rgba(43,107,255,0.16)"}` }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                {complete ? "Signal resolved · stack online" : "Signal travelling…"}
              </span>
            </div>
          </motion.div>

          {/* ── RIGHT: the stack ─────────────────────────────────────────── */}
          <div ref={stackRef}>
            {stackLayers.map((layer, i) => (
              <div key={layer.id}>
                <Slab
                  layer={layer}
                  lit={i < activeCount}
                  hovered={hoveredId === layer.id}
                  onHover={(v) => setHoveredId(v ? layer.id : null)}
                />
                <Connector
                  lit={i < activeCount && (i + 1 < activeCount || (i === TOTAL - 1 && complete))}
                  accent={layer.accent}
                  prefersReduced={prefersReduced}
                />
              </div>
            ))}

            {/* Output node — Product Builder */}
            <motion.div
              initial={false}
              animate={complete ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              style={{
                position: "relative", overflow: "hidden", textAlign: "center",
                padding: "1.25rem 1.5rem", borderRadius: "18px",
                background: "linear-gradient(120deg, rgba(43,107,255,0.10) 0%, rgba(196,42,192,0.10) 100%)",
                border: "1px solid rgba(109,94,248,0.32)",
                boxShadow: "0 20px 50px rgba(109,94,248,0.2), 0 0 28px rgba(109,94,248,0.14)",
              }}
            >
              {complete && !prefersReduced && (
                <motion.div aria-hidden="true"
                  initial={{ x: "-130%" }} animate={{ x: "240%" }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.2 }}
                  style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "45%", background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)", pointerEvents: "none" }}
                />
              )}
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-2)", marginBottom: "0.35rem" }}>
                Output
              </p>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                lineHeight: 1.05, letterSpacing: "-0.02em",
                background: "linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {stackOutput.name}
              </h3>
              <p style={{ marginTop: "0.3rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                {stackOutput.sub}
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
