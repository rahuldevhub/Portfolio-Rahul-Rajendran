"use client";

/**
 * Capabilities — "Builder Skill Tree" (RPG progression system).
 *
 * Three columns (desktop):
 *   LEFT   — section header + RPG "Builder Profile" stat card + dark "Builder
 *            Status" card.
 *   CENTER — a six-node branching skill tree. On scroll-in, nodes UNLOCK one by
 *            one (pop + glow + check), their connector paths light up and flow,
 *            and the detail panel walks through each skill. When all six are
 *            unlocked a "BUILD COMPLETE" moment fires.
 *   RIGHT  — the live detail panel for the active skill (rarity, level, real
 *            metric + special move, abilities, XP bar, quote, next reward).
 *
 * Below the tree: an achievements row + a transition into the Work section.
 * Colours mirror the Story levels. Respects prefers-reduced-motion.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Target, Pen, Code2, Zap, Sparkles, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui";
import {
  capabilities, capabilitiesSectionIntro, builderProfile, achievements, skillTreeOutro, masterBuilder,
} from "@/content/capabilities";
import type { Capability, SkillIcon } from "@/content/capabilities";

const VW = 460;
const VH = 820;
const TOTAL = capabilities.length;
const byId = (id: string) => capabilities.find((c) => c.id === id)!;
const indexOf = (id: string) => capabilities.findIndex((c) => c.id === id);

/* ── Icons ──────────────────────────────────────────────────────────────── */
const LUCIDE: Partial<Record<SkillIcon, LucideIcon>> = { Target, Pen, Code2, Zap, Sparkles };
function TrendingGlyph({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17l6-6 4 4 7-7" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8h4v4" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SkillGlyph({ icon, size, color }: { icon: SkillIcon; size: number; color: string }) {
  if (icon === "TrendingUp") return <TrendingGlyph size={size} color={color} />;
  const Icon = LUCIDE[icon]!;
  return <Icon size={size} strokeWidth={1.9} style={{ color }} aria-hidden="true" />;
}
function CheckGlyph({ size = 12, color = "#FFF" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TrophyGlyph({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4h10v4a5 5 0 01-10 0V4z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M9 16h6M10 16v3M14 16v3M8 21h8" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Connector paths — flow when both endpoints are unlocked ────────────── */
function Connectors({ activeId, unlockedCount, prefersReduced }: {
  activeId: string; unlockedCount: number; prefersReduced: boolean | null;
}) {
  const lines: { from: Capability; to: Capability }[] = [];
  capabilities.forEach((c) => c.connectsTo.forEach((id) => lines.push({ from: c, to: byId(id) })));
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%"
      style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "visible" }} aria-hidden="true">
      {lines.map(({ from, to }, i) => {
        const unlocked = indexOf(from.id) < unlockedCount && indexOf(to.id) < unlockedCount;
        const hot = activeId === from.id || activeId === to.id;
        const d = `M ${from.node.x} ${from.node.y} C ${from.node.x} ${(from.node.y + to.node.y) / 2}, ${to.node.x} ${(from.node.y + to.node.y) / 2}, ${to.node.x} ${to.node.y}`;
        return (
          <g key={i}>
            {/* base track */}
            <path d={d} fill="none"
              stroke={unlocked ? to.accent : "var(--border)"}
              strokeWidth={hot ? 3 : unlocked ? 2.4 : 1.6}
              opacity={unlocked ? (hot ? 0.95 : 0.55) : 0.5}
              strokeLinecap="round"
              style={{ transition: "stroke 0.4s ease, opacity 0.4s ease, stroke-width 0.4s ease" }}
            />
            {/* flowing particles overlay */}
            {unlocked && !prefersReduced && (
              <motion.path d={d} fill="none"
                stroke={to.accent} strokeWidth={hot ? 3 : 2.4}
                strokeDasharray="1 13" strokeLinecap="round"
                animate={{ strokeDashoffset: [0, -28] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                style={{ opacity: hot ? 1 : 0.8 }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Tree node — icons only (all detail lives in the right card) ────────── */
function TreeNode({
  c, active, lit, onSelect, prefersReduced,
}: {
  c: Capability; active: boolean; lit: boolean; onSelect: () => void;
  prefersReduced: boolean | null;
}) {
  return (
    <div style={{
      position: "absolute",
      left: `${(c.node.x / VW) * 100}%`, top: `${(c.node.y / VH) * 100}%`,
      transform: "translate(-50%, -50%)", zIndex: 2,
    }}>
      <motion.button
        type="button"
        onMouseEnter={onSelect} onFocus={onSelect} onClick={onSelect}
        aria-label={c.label}
        animate={
          prefersReduced
            ? { opacity: 1, scale: 1 }
            : lit
              ? { opacity: 1, scale: active ? 1.12 : 1 }
              : { opacity: 0.45, scale: 0.9 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 17 }}
        style={{
          position: "relative", cursor: "pointer",
          width: 88, height: 88, borderRadius: "50%",
          background: lit
            ? (active
                ? `radial-gradient(circle at 50% 40%, ${c.accent}33 0%, rgba(255,255,255,0.96) 70%)`
                : "rgba(255,255,255,0.96)")
            : "var(--surface)",
          border: `2px solid ${lit ? c.accent : "var(--border)"}`,
          boxShadow: lit
            ? (active ? `0 0 0 7px ${c.accent}1F, 0 12px 34px ${c.accent}40` : `0 6px 18px ${c.accent}26`)
            : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        {/* Legendary aura — Creative Tech is the wildcard */}
        {c.id === "creative-tech" && lit && !prefersReduced && (
          <>
            <motion.span aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: -7, borderRadius: "50%",
                background: `conic-gradient(from 0deg, ${c.accent}00, ${c.accent}, #EC4899, ${c.accent}, ${c.accent}00)`,
                filter: "blur(5px)", opacity: 0.8, zIndex: -1,
              }}
            />
            <motion.span aria-hidden="true"
              animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", inset: -14, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}66, transparent 70%)`, zIndex: -1 }}
            />
          </>
        )}
        <SkillGlyph icon={c.icon} size={36} color={lit ? c.accent : "#B5B5C0"} />
        {lit && (
          <motion.span
            initial={!prefersReduced ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.08 }}
            style={{
              position: "absolute", top: -2, right: -2, width: 24, height: 24, borderRadius: "50%",
              background: c.accent, border: "2.5px solid var(--surface)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 2px 6px ${c.accent}55`,
            }}>
            <CheckGlyph size={13} />
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}

const RARITY_RING: Record<string, string> = { Rare: "RARE", Epic: "EPIC", Legendary: "LEGENDARY" };

/* Subtle ambient dots behind the tree. */
const ATMOS = [
  { x: "12%", y: "18%", r: 3, d: 5.5 }, { x: "86%", y: "12%", r: 2, d: 6.5 },
  { x: "78%", y: "62%", r: 3, d: 7 },  { x: "8%", y: "70%", r: 2.5, d: 6 },
  { x: "50%", y: "8%", r: 2, d: 8 },   { x: "92%", y: "85%", r: 2.5, d: 5.8 },
  { x: "20%", y: "92%", r: 2, d: 7.4 },
];

export function Capabilities() {
  const prefersReduced = useReducedMotion();
  /* step = how many nodes have activated (0..TOTAL). Drives the signal cascade. */
  const [step, setStep] = useState(prefersReduced ? TOTAL : 0);
  /* hovered node overrides the auto-driven card; null = follow the loop. */
  const [hovered, setHovered] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const treeRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<string | null>(null);
  hoveredRef.current = hovered;

  /* Observe whether the tree is on screen — the OS only runs while watched. */
  useEffect(() => {
    const el = treeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Booting loop: signal travels node→node, holds at Master Builder, resets, repeats. */
  useEffect(() => {
    if (prefersReduced) { setStep(TOTAL); return; }
    if (!inView) return;
    let cancelled = false;
    let timer: number;
    const run = (s: number) => {
      if (cancelled) return;
      if (s <= TOTAL) {
        setStep(s);
        timer = window.setTimeout(() => run(s + 1), s === TOTAL ? 3000 : 820);
      } else {
        setStep(0);            // fade everything to inactive
        timer = window.setTimeout(() => run(1), 1100);
      }
    };
    timer = window.setTimeout(() => run(1), 450);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [prefersReduced, inView]);

  /* The skill currently driven by the loop (latest activated node). */
  const loopActiveId = capabilities[Math.max(0, Math.min(step, TOTAL) - 1)].id;
  const activeId = hovered ?? loopActiveId;
  const active = byId(activeId);
  const xpPct = Math.min(100, (active.xp / active.nextXp) * 100);
  const complete = step >= TOTAL;
  const noteLines = capabilitiesSectionIntro.note.split("\n");

  const profileRows: [string, string][] = [
    ["Class", builderProfile.class],
    ["Level", String(builderProfile.level)],
    ["XP", builderProfile.xp],
    ["Projects", builderProfile.projects],
    ["Skills", builderProfile.skills],
  ];

  return (
    <section style={{ backgroundColor: "var(--surface)" }} className="relative overflow-hidden py-[clamp(4rem,7vw,8rem)]">
      <Container>
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
          {capabilitiesSectionIntro.treeLabel}
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[230px_1fr_440px] lg:gap-10">

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              {capabilitiesSectionIntro.eyebrow}
            </p>
            <h2 className="font-semibold leading-[1.04] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 3vw, 2.75rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
              {capabilitiesSectionIntro.headline}
            </h2>
            <p className="mt-4" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.35rem", color: "var(--accent)", lineHeight: 1.3 }}>
              {noteLines.map((l, i) => <span key={i} className="block">{l}</span>)}
            </p>

            {/* Builder Profile card */}
            <div className="mt-7" style={{
              padding: "1.2rem 1.3rem", borderRadius: "18px",
              background: "linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(43,107,255,0.06) 100%)",
              border: "1px solid var(--border)", boxShadow: "0 10px 28px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.9rem" }}>
                <Sparkles size={14} strokeWidth={2} style={{ color: "var(--accent)" }} aria-hidden="true" />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Builder Profile
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {profileRows.map(([k, v]) => (
                  <div key={k} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", color: k === "Class" ? "var(--accent)" : "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Builder Status (dark) */}
            <div className="mt-4" style={{
              padding: "1.05rem 1.25rem", borderRadius: "16px",
              background: "var(--text)", boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <Sparkles size={15} strokeWidth={2} style={{ color: "#A78BFA" }} aria-hidden="true" />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                  Builder Status
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#34D399" }}>
                  {complete ? "All Systems Active" : "Booting Systems…"}
                </span>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 0 3px rgba(52,211,153,0.25)" }} />
              </div>
              <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.6)", marginTop: "0.15rem" }}>
                {step} / {TOTAL} skills online
              </div>
            </div>
          </div>

          {/* ── CENTER: tree ──────────────────────────────────────────────── */}
          <div ref={treeRef} className="relative mx-auto w-full" style={{ maxWidth: "360px", aspectRatio: `${VW} / ${VH}` }}
            onMouseLeave={() => setHovered(null)}>
            {/* ambient dots */}
            {!prefersReduced && ATMOS.map((p, i) => (
              <motion.span key={i} aria-hidden="true"
                animate={{ y: [0, -8, 0], opacity: [0.05, 0.12, 0.05] }}
                transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", left: p.x, top: p.y, width: p.r * 2, height: p.r * 2, borderRadius: "50%", background: "var(--text-muted)", zIndex: 0 }}
              />
            ))}

            <Connectors activeId={activeId} unlockedCount={step} prefersReduced={prefersReduced} />
            {capabilities.map((c, i) => (
              <TreeNode key={c.id} c={c}
                active={activeId === c.id}
                lit={i < step}
                onSelect={() => setHovered(c.id)}
                prefersReduced={prefersReduced}
              />
            ))}
          </div>

          {/* ── RIGHT: detail panel (morphs as the signal advances) ───────── */}
          <div>
            <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={!prefersReduced ? { opacity: 0, y: -20 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={!prefersReduced ? { opacity: 0, y: 20 } : undefined}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "relative", padding: "1.75rem 1.65rem", borderRadius: "22px",
                background: `linear-gradient(160deg, rgba(255,255,255,0.95) 0%, ${active.accent}12 100%)`,
                border: `1px solid ${active.accent}30`,
                boxShadow: `0 20px 48px rgba(0,0,0,0.08), 0 0 30px ${active.accent}18`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1.4rem" }}>
                <Sparkles size={14} strokeWidth={2} style={{ color: active.accent }} aria-hidden="true" />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: active.accent }}>
                  Skill Unlocked
                </span>
              </div>

              {/* Big collectible header — icon stacked above name */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "1.4rem" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "20px", flexShrink: 0, marginBottom: "0.9rem",
                  background: `linear-gradient(150deg, ${active.accent}2E 0%, ${active.accent}10 100%)`,
                  border: `1.5px solid ${active.accent}42`, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 8px 22px ${active.accent}2E`,
                }}>
                  <SkillGlyph icon={active.icon} size={34} color={active.accent} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.85rem", color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "0.55rem" }}>
                  {active.label}
                </h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: active.accent, padding: "0.3em 0.75em", borderRadius: "999px", background: `${active.accent}1A`, border: `1px solid ${active.accent}3A` }}>
                    {RARITY_RING[active.rarity]} Class
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)" }}>Lv {active.level}</span>
                </div>
              </div>

              {/* Real-stat chips */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.1rem" }}>
                {([["Track Record", active.metric], ["Special Move", active.special]] as const).map(([k, v]) => (
                  <div key={k} style={{ padding: "0.55rem 0.7rem", borderRadius: "10px", background: "rgba(255,255,255,0.7)", border: "1px solid var(--border)" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.1rem" }}>{k}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8rem", color: active.accent }}>{v}</div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "0.84rem", lineHeight: 1.6, color: "var(--text-muted)", marginBottom: "1.1rem" }}>
                {active.description}
              </p>

              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                Abilities
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.1rem" }}>
                {active.abilities.map((ab) => (
                  <div key={ab} style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.5rem 0.6rem", borderRadius: "10px", background: "rgba(255,255,255,0.7)", border: "1px solid var(--border)" }}>
                    <span style={{ width: 16, height: 16, borderRadius: "5px", flexShrink: 0, background: active.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckGlyph size={9} />
                    </span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--text)" }}>{ab}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>XP Journey</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, color: active.accent }}>{active.xp} / {active.nextXp} XP</span>
              </div>
              <div style={{ width: "100%", height: "7px", borderRadius: "999px", background: "var(--border)", overflow: "hidden", marginBottom: "1.1rem" }}>
                <motion.div animate={{ width: `${xpPct}%`, backgroundColor: active.accent }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ height: "100%", borderRadius: "999px" }} />
              </div>

              <div style={{ padding: "0.9rem 1rem", borderRadius: "12px", background: `${active.accent}0E`, border: `1px solid ${active.accent}22`, fontSize: "0.82rem", fontStyle: "italic", lineHeight: 1.5, color: "var(--text)" }}>
                <span style={{ color: active.accent, fontWeight: 700 }}>“</span>{active.quote}<span style={{ color: active.accent, fontWeight: 700 }}>”</span>
              </div>
            </motion.div>
            </AnimatePresence>

            {/* Next reward */}
            <div className="mt-4" style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1.1rem", borderRadius: "14px", background: "rgba(255,255,255,0.7)", border: "1px solid var(--border)" }}>
              <Sparkles size={16} strokeWidth={2} style={{ color: "var(--accent-2)" }} aria-hidden="true" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>Next Reward</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Master Builder</div>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 600, color: "var(--accent-2)" }}>1000 XP to go</span>
            </div>
          </div>
        </div>

        {/* ── Final boss: Master Builder ────────────────────────────────── */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={false}
          animate={complete ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
          aria-hidden={!complete}
        >
          <div style={{
            position: "relative", overflow: "hidden", textAlign: "center",
            padding: "1.9rem 3.25rem", borderRadius: "22px",
            background: "linear-gradient(135deg, rgba(43,107,255,0.07) 0%, rgba(109,94,248,0.11) 100%)",
            border: "1px solid rgba(109,94,248,0.32)",
            boxShadow: "0 24px 60px rgba(109,94,248,0.2), 0 0 34px rgba(109,94,248,0.14)",
          }}>
            {/* shimmer sweep */}
            {complete && !prefersReduced && (
              <motion.div aria-hidden="true"
                initial={{ x: "-130%" }} animate={{ x: "240%" }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "45%", background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)", pointerEvents: "none" }}
              />
            )}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.6rem" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2l2.6 6.6L21 9.3l-5 4.5 1.6 6.7L12 16.9 6.4 20.5 8 13.8l-5-4.5 6.4-.7L12 2z"
                  fill="url(#mbStar)" />
                <defs>
                  <linearGradient id="mbStar" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--accent-2)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-2)", marginBottom: "0.4rem" }}>
              {masterBuilder.rank}
            </p>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              lineHeight: 1.05, letterSpacing: "-0.02em",
              background: "linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {masterBuilder.title}
            </h3>
            <p style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {masterBuilder.sub}
            </p>

            {/* Skill checklist */}
            <div className="mt-5 flex flex-wrap justify-center" style={{ gap: "0.45rem", maxWidth: "440px" }}>
              {capabilities.map((c) => (
                <span key={c.id} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.3em 0.7em", borderRadius: "999px",
                  background: "rgba(255,255,255,0.7)", border: `1px solid ${c.accent}33`,
                }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", background: c.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CheckGlyph size={8} />
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", fontWeight: 600, color: "var(--text)" }}>{c.label}</span>
                </span>
              ))}
            </div>

            {/* Status line */}
            <div style={{ marginTop: "1.1rem", display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Status: <span style={{ color: "#059669", fontWeight: 700 }}>All Systems Online</span>
              </span>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", boxShadow: "0 0 0 3px rgba(5,150,105,0.2)" }} />
            </div>
          </div>
        </motion.div>

        {/* ── Achievements ──────────────────────────────────────────────── */}
        <div className="mt-14">
          <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
            Achievements
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {achievements.map((a, i) => (
              <motion.div key={a}
                initial={!prefersReduced ? { opacity: 0, y: 12 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.55rem 1rem", borderRadius: "999px", background: "rgba(255,255,255,0.7)", border: "1px solid var(--border)" }}
              >
                <span style={{ color: "var(--accent)" }}><TrophyGlyph size={14} color="var(--accent)" /></span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text)" }}>{a}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Completion + transition to Work ───────────────────────────── */}
        <div className="mt-14 flex flex-col items-center text-center">
          <motion.div
            animate={complete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.55rem",
              padding: "0.45rem 1rem", borderRadius: "999px", marginBottom: "1.5rem",
              background: "rgba(5,150,105,0.10)", border: "1px solid rgba(5,150,105,0.3)",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", boxShadow: "0 0 0 3px rgba(5,150,105,0.2)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#059669" }}>
              {skillTreeOutro.complete} · {skillTreeOutro.completeSub}
            </span>
          </motion.div>

          <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>{skillTreeOutro.lead}</p>
          <h3 className="font-semibold leading-[1.08] tracking-[-0.026em]"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontFamily: "var(--font-display)", color: "var(--text)", maxWidth: "20ch" }}>
            {skillTreeOutro.emphasis}
          </h3>
          <a href={skillTreeOutro.cta.href}
            className="group mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)", fontFamily: "var(--font-display)" }}>
            {skillTreeOutro.cta.label}
            <ArrowUpRight size={15} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Container>
    </section>
  );
}
