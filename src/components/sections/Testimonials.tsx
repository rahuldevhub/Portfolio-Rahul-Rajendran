"use client";

/**
 * Testimonials — "Signals From The Field" global reputation map.
 *
 * The proof section: other people talking about Rahul. A dotted world-grid with
 * country nodes wired to a central brand core; on scroll-in each country comes
 * online in turn (signal pulse), its review card fades in, and a reputation
 * marquee + stat bar anchor the bottom. Hovering a country highlights its card
 * and connector.
 *
 * Distinct from every other section — a map / control-room of evidence rather
 * than a testimonial card grid. Respects prefers-reduced-motion.
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui";
import {
  reputationCountries, reputationAchievements, marqueeReviews, reputationIntro,
  featuredHighlight, fiverrScreenshots,
} from "@/content/testimonials";
import type { ReputationCountry, RepStatIcon } from "@/content/testimonials";

const VW = 900;
const VH = 560;
const CX = 450;
const CY = 290;
const TOTAL = reputationCountries.length;

/* Stylised dotted world map: continent "blobs" that mask a dot pattern so the
 * dots only appear over land. Approximate, but reads as a world map. */
const CONTINENTS = [
  "radial-gradient(ellipse 17% 21% at 23% 36%, #000 58%, transparent 100%)",  // N. America
  "radial-gradient(ellipse 8% 16% at 31% 73%, #000 58%, transparent 100%)",   // S. America
  "radial-gradient(ellipse 7% 9%  at 52% 27%, #000 55%, transparent 100%)",   // Europe
  "radial-gradient(ellipse 11% 20% at 55% 62%, #000 58%, transparent 100%)",  // Africa
  "radial-gradient(ellipse 20% 19% at 75% 33%, #000 58%, transparent 100%)",  // Asia
  "radial-gradient(ellipse 7% 8%  at 85% 78%, #000 58%, transparent 100%)",   // Australia
].join(", ");

/* ── Inline glyphs ──────────────────────────────────────────────────────── */
function StarRow({ n, color }: { n: number; color: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={color} aria-hidden="true">
          <path d="M12 2l2.9 6.9L22 9.5l-5.4 4.7 1.7 7.1L12 17.8 5.7 21.3l1.7-7.1L2 9.5l7.1-.6L12 2z" />
        </svg>
      ))}
    </span>
  );
}
function VerifiedTag({ color }: { color: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-display)", fontSize: "0.54rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill={color} opacity="0.16" />
        <path d="M8 12.5l2.5 2.5L16 9" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Verified
    </span>
  );
}
function StatGlyph({ icon, color }: { icon: RepStatIcon; color: string }) {
  const c = color, w = 1.8;
  if (icon === "Globe") return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={w} /><path d="M3 12h18M12 3c2.5 2.5 2.5 16 0 18M12 3c-2.5 2.5-2.5 16 0 18" stroke={c} strokeWidth={w} /></svg>);
  if (icon === "Star") return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.6 6.3L21 10l-4.8 4.2 1.5 6.3L12 17.4 6.3 20.5l1.5-6.3L3 10l6.4-.7L12 3z" stroke={c} strokeWidth={w} strokeLinejoin="round" /></svg>);
  if (icon === "Trophy") return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 4h10v4a5 5 0 01-10 0V4z" stroke={c} strokeWidth={w} strokeLinejoin="round" /><path d="M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M9 16h6M10 16v3M14 16v3M8 21h8" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>);
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={w} /><path d="M12 7v10M9.5 14c0 1.4 1.1 2 2.5 2s2.5-.6 2.5-2-1.1-1.8-2.5-2-2.5-.6-2.5-2 1.1-2 2.5-2 2.5.6 2.5 2" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

/* ── Review card ────────────────────────────────────────────────────────── */
/* Tiny resting rotations per country for an organic, scattered feel. */
const CARD_ROT: Record<string, number> = { us: -2, de: 1.5, it: -1.5, in: 2 };
function ReviewCard({ c, on, active, onHover, prefersReduced }: {
  c: ReputationCountry; on: boolean; active: boolean; onHover: (v: boolean) => void; prefersReduced: boolean | null;
}) {
  const a = c.accent;
  const rot = CARD_ROT[c.id] ?? 0;
  return (
    <motion.div
      className="hidden lg:block"
      onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}
      initial={false}
      animate={{
        opacity: on ? (active ? 1 : 0.14) : 0,
        y: on ? 0 : 14,
        rotate: prefersReduced ? 0 : active ? 0 : rot,
        scale: prefersReduced ? 1 : on ? (active ? 1.17 : 0.8) : 0.8,
        filter: active || prefersReduced ? "blur(0px)" : "blur(2.4px)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      style={{
        position: "absolute", width: 252, zIndex: active ? 12 : 5, ...c.card,
        transformOrigin: c.origin,
        padding: "1rem 1.1rem", borderRadius: "16px",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${active ? a + "55" : "var(--border)"}`,
        boxShadow: active ? `0 28px 60px ${a}38, 0 0 28px ${a}28` : "0 10px 24px rgba(0,0,0,0.05)",
        pointerEvents: active ? "auto" : "none",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.7rem" }}>
        <StarRow n={c.review.rating} color={a} />
        <VerifiedTag color="#059669" />
      </div>
      <p style={{ fontSize: "0.8rem", lineHeight: 1.55, color: "var(--text)", margin: "0 0 0.85rem" }}>
        &ldquo;{c.review.quote}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: `${a}1A`, border: `1px solid ${a}33`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.62rem", color: a }}>
          {c.review.initials}
        </span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8rem", color: "var(--text)", lineHeight: 1.1 }}>{c.review.name}</div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{c.review.location}</div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const prefersReduced = useReducedMotion();
  const [activeCount, setActiveCount] = useState(prefersReduced ? TOTAL : 0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  /* Reveal cascade on scroll-in. */
  useEffect(() => {
    if (prefersReduced) { setActiveCount(TOTAL); return; }
    const el = mapRef.current; if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          let n = 0;
          const tick = () => { n += 1; setActiveCount(n); if (n < TOTAL) timer = window.setTimeout(tick, 560); };
          let timer = window.setTimeout(tick, 450);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  const complete = activeCount >= TOTAL;

  /* Once all countries are online, auto-rotate the spotlight review every ~4.5s. */
  useEffect(() => {
    if (prefersReduced || !complete) return;
    const iv = setInterval(() => setSpotlight((s) => (s + 1) % TOTAL), 4500);
    return () => clearInterval(iv);
  }, [prefersReduced, complete]);

  const idx = (id: string) => reputationCountries.findIndex((c) => c.id === id);
  const headlineLines = reputationIntro.headline.split("\n");
  /* The spotlighted country — hover overrides the auto-rotation. */
  const activeId = hoveredId ?? reputationCountries[spotlight].id;
  const activeColor = reputationCountries.find((c) => c.id === activeId)?.accent ?? "#2563EB";

  return (
    <section style={{ backgroundColor: "var(--bg)" }} className="relative overflow-hidden py-[clamp(4rem,7vw,8rem)]">
      <Container>
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
          {reputationIntro.mapLabel}
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[330px_1fr] lg:gap-10">

          {/* ── LEFT: intro ──────────────────────────────────────────────── */}
          <motion.div
            initial={!prefersReduced ? { opacity: 0, y: 22 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              {reputationIntro.eyebrow}
            </p>
            <h2 className="font-semibold leading-[1.02] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.25rem, 3.6vw, 3.25rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
              {headlineLines.map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <p className="mt-4" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem", color: "var(--accent)" }}>
              {reputationIntro.note}
            </p>
            <p className="mt-5 text-sm leading-[1.6]" style={{ color: "var(--text)", fontWeight: 500 }}>
              {reputationIntro.subline.split("\n").map((l, i) => <span key={i} className="block">{l}</span>)}
            </p>
            <p className="mt-5 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "34ch" }}>
              {reputationIntro.body}
            </p>

            {/* trusted card */}
            <div className="mt-8 inline-flex items-center gap-3" style={{ padding: "0.9rem 1.2rem", borderRadius: "16px", background: "rgba(255,255,255,0.6)", border: "1px solid var(--border)" }}>
              <span style={{ width: 42, height: 42, borderRadius: "12px", flexShrink: 0, background: "rgba(43,107,255,0.1)", border: "1px solid rgba(43,107,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StatGlyph icon="Globe" color="var(--accent)" />
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>Trusted across</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", lineHeight: 1 }}>4+ <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)" }}>countries</span></div>
              </div>
            </div>

            <p className="mt-6 hidden lg:block" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2rem", color: "var(--text-muted)", transform: "rotate(-3deg)", maxWidth: "16ch" }}>
              {reputationIntro.hint} →
            </p>
          </motion.div>

          {/* ── RIGHT: the map ───────────────────────────────────────────── */}
          <div ref={mapRef} className="relative w-full" style={{ minHeight: 560 }}>
            {/* dot-grid backdrop */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle, #AEB6CE 1.4px, transparent 1.4px)",
              backgroundSize: "15px 15px",
              // dots only show where there's "land" — a stylised dotted world map
              maskImage: CONTINENTS, WebkitMaskImage: CONTINENTS,
              opacity: 0.32, filter: "blur(0.4px)",
            }} />

            {/* connectors + nodes (desktop) */}
            <div className="absolute inset-0 hidden lg:block">
              <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
                {reputationCountries.map((c, i) => {
                  const on = i < activeCount;
                  const hot = activeId === c.id;
                  const d = `M ${CX} ${CY} C ${(CX + c.node.x) / 2} ${CY}, ${(CX + c.node.x) / 2} ${c.node.y}, ${c.node.x} ${c.node.y}`;
                  return (
                    <g key={c.id}>
                      <path d={d} fill="none" stroke={on ? c.accent : "var(--border)"} strokeWidth={hot ? 2.4 : 1.5}
                        strokeDasharray="2 7" opacity={on ? (hot ? 0.9 : 0.5) : 0.4}
                        style={{ transition: "stroke 0.4s ease, opacity 0.4s ease" }} />
                      {on && !prefersReduced && (
                        <motion.circle r={3} fill={c.accent}
                          animate={{ cx: [CX, c.node.x], cy: [CY, c.node.y], opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                          style={{ filter: `drop-shadow(0 0 4px ${c.accent})` }} />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* country nodes */}
              {reputationCountries.map((c, i) => {
                const on = i < activeCount;
                const hot = activeId === c.id;
                return (
                  <div key={c.id}
                    onMouseEnter={() => setHoveredId(c.id)} onMouseLeave={() => setHoveredId(null)}
                    style={{ position: "absolute", left: `${(c.node.x / VW) * 100}%`, top: `${(c.node.y / VH) * 100}%`, transform: "translate(-50%, -50%)", zIndex: 7, display: "flex", alignItems: "center", gap: "0.5rem", cursor: "default" }}>
                    <motion.span
                      animate={
                        on
                          ? (hot && !prefersReduced
                              ? { scale: [1.18, 1.34, 1.18], opacity: 1 }
                              : { scale: hot ? 1.26 : 1, opacity: 1 })
                          : { scale: 0.6, opacity: 0.4 }
                      }
                      transition={
                        on && hot && !prefersReduced
                          ? { scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.3 } }
                          : { type: "spring", stiffness: 300, damping: 16 }
                      }
                      style={{ position: "relative", width: 16, height: 16, borderRadius: "50%", background: c.accent, boxShadow: `0 0 0 4px ${c.accent}24, 0 0 12px ${c.accent}` }}>
                      {on && !prefersReduced && (
                        <motion.span animate={{ scale: [1, hot ? 2.6 : 2.2], opacity: [hot ? 0.65 : 0.5, 0] }} transition={{ duration: hot ? 1.6 : 2, repeat: Infinity, ease: "easeOut" }}
                          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: c.accent }} />
                      )}
                    </motion.span>
                    <motion.div animate={{ opacity: on ? 1 : 0.4 }} style={{ whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem", color: "var(--text)" }}>
                        <span style={{ fontSize: "0.95rem" }}>{c.flag}</span> {c.name}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: c.accent }}>{c.reviews} Review{c.reviews > 1 ? "s" : ""}</div>
                    </motion.div>
                  </div>
                );
              })}

              {/* center — the character; the source of the reputation network.
                  Sits slightly below the connector hub so reviews read as hero. */}
              <div style={{ position: "absolute", left: `${(CX / VW) * 100}%`, top: `${(CY / VH) * 100}%`, transform: "translate(-50%, -60%)", zIndex: 8 }}>
                {/* Layered aura — inner blue, outer purple, large soft (active-colour) */}
                <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "44%", width: 170, height: 170, transform: "translate(-50%,-50%)", borderRadius: "50%", filter: "blur(24px)", zIndex: 0, background: "radial-gradient(circle, rgba(99,102,241,0.28) 0%, rgba(99,102,241,0.12) 42%, transparent 72%)" }} />
                <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "44%", width: 240, height: 240, transform: "translate(-50%,-50%)", borderRadius: "50%", filter: "blur(44px)", zIndex: 0, background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0.10) 50%, transparent 76%)" }} />
                <motion.div aria-hidden="true"
                  animate={{ backgroundColor: activeColor }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ position: "absolute", left: "50%", top: "46%", width: 300, height: 300, transform: "translate(-50%,-50%)", borderRadius: "50%", filter: "blur(64px)", opacity: 0.2, zIndex: 0 }} />
                {/* elliptical platform pool */}
                <motion.div aria-hidden="true"
                  animate={{ backgroundColor: activeColor }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ position: "absolute", left: "50%", bottom: -6, width: 150, height: 30, transform: "translateX(-50%)", borderRadius: "50%", filter: "blur(11px)", opacity: 0.4, zIndex: 0 }} />
                {!prefersReduced && (
                  <motion.span aria-hidden="true"
                    animate={{ scale: [1, 1.7], opacity: [0.3, 0], borderColor: activeColor }}
                    transition={{ scale: { duration: 3, repeat: Infinity, ease: "easeOut" }, opacity: { duration: 3, repeat: Infinity, ease: "easeOut" }, borderColor: { duration: 0.6 } }}
                    style={{ position: "absolute", left: "50%", top: "50%", width: 110, height: 110, transform: "translate(-50%,-50%)", borderRadius: "50%", border: "1.5px solid", zIndex: 0 }} />
                )}
                {/* the figure — character2 (landscape); edges masked, premium drop-shadows */}
                <motion.div
                  animate={!prefersReduced ? { y: [-7, 7, -7], rotate: [-1, 1, -1] } : {}}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "relative", width: 270, zIndex: 1 }}
                >
                  <Image src="/character2.png" alt="Rahul" width={1536} height={1024} priority
                    style={{
                      width: "100%", height: "auto", display: "block",
                      maskImage: "radial-gradient(ellipse 30% 84% at 50% 46%, #000 56%, transparent 84%)",
                      WebkitMaskImage: "radial-gradient(ellipse 30% 84% at 50% 46%, #000 56%, transparent 84%)",
                      filter: "drop-shadow(0 20px 40px rgba(99,102,241,0.28)) drop-shadow(0 0 70px rgba(99,102,241,0.18))",
                    }} />
                </motion.div>
              </div>
            </div>

            {/* review cards in corners */}
            {reputationCountries.map((c) => (
              <ReviewCard key={c.id} c={c} on={idx(c.id) < activeCount} active={activeId === c.id}
                onHover={(v) => setHoveredId(v ? c.id : null)} prefersReduced={prefersReduced} />
            ))}

            {/* mobile fallback — stacked review cards */}
            <div className="flex flex-col gap-4 lg:hidden">
              {reputationCountries.map((c) => (
                <div key={c.id} style={{ padding: "1rem 1.1rem", borderRadius: "16px", background: "rgba(255,255,255,0.9)", border: "1px solid var(--border)", boxShadow: "0 10px 26px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                    <StarRow n={c.review.rating} color={c.accent} />
                    <span style={{ fontSize: "0.8rem" }}>{c.flag} {c.name}</span>
                  </div>
                  <p style={{ fontSize: "0.84rem", lineHeight: 1.55, color: "var(--text)", margin: "0 0 0.7rem" }}>&ldquo;{c.review.quote}&rdquo;</p>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem", color: "var(--text)" }}>{c.review.name} <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>· {c.review.location}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Client impact highlight ──────────────────────────────────── */}
        <motion.div
          className="mt-14"
          initial={!prefersReduced ? { opacity: 0, y: 24 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative", overflow: "hidden",
            padding: "clamp(1.75rem, 3vw, 2.75rem)", borderRadius: "24px",
            background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, ${featuredHighlight.accent}12 100%)`,
            border: `1px solid ${featuredHighlight.accent}2E`,
            boxShadow: `0 24px 60px ${featuredHighlight.accent}1A, 0 0 30px ${featuredHighlight.accent}12`,
          }}
        >
          <span aria-hidden="true" style={{ position: "absolute", top: "-1.5rem", left: "1.5rem", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "9rem", lineHeight: 1, color: `${featuredHighlight.accent}1F` }}>&ldquo;</span>
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem", fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: featuredHighlight.accent, padding: "0.3em 0.8em", borderRadius: "999px", background: `${featuredHighlight.accent}16`, border: `1px solid ${featuredHighlight.accent}33` }}>
              {featuredHighlight.tag}
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.3rem, 2.6vw, 2.1rem)", lineHeight: 1.3, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "32ch", marginBottom: "1.25rem" }}>
              {featuredHighlight.quote}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <StarRow n={5} color={featuredHighlight.accent} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>{featuredHighlight.name}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{featuredHighlight.flag} {featuredHighlight.location} · Verified</span>
            </div>
          </div>
        </motion.div>

        {/* ── Marquee ───────────────────────────────────────────────────── */}
        <div className="relative mt-6 overflow-hidden" style={{ borderRadius: "16px", background: "rgba(255,255,255,0.5)", border: "1px solid var(--border)", maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)" }}>
          <motion.div className="flex gap-3 py-3" style={{ width: "max-content" }}
            animate={!prefersReduced ? { x: ["0%", "-50%"] } : {}}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}>
            {[...marqueeReviews, ...marqueeReviews].map((m, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.9rem", borderRadius: "999px", background: "rgba(255,255,255,0.8)", border: "1px solid var(--border)", flexShrink: 0 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem" }}>{m.flag}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text)" }}>{m.user}</span>
                <StarRow n={m.rating} color="#D97706" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{m.rating}</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Evidence strip — real Fiverr screenshots ──────────────────── */}
        <div className="mt-12">
          <div className="mb-5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              Verified on Fiverr
            </p>
            <h3 className="mt-1 font-semibold tracking-[-0.02em]" style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
              Proof beats promises.
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {fiverrScreenshots.map((shot) => shot.imageSrc && (
              <div key={shot.id} style={{
                flex: "0 0 auto", width: shot.prominent ? 420 : 300, borderRadius: "14px", overflow: "hidden",
                border: "1px solid var(--border)", boxShadow: "0 12px 30px rgba(0,0,0,0.07)", background: "#fff",
              }}>
                <Image src={shot.imageSrc} alt={shot.alt ?? shot.label} width={shot.imageWidth ?? 1536} height={shot.imageHeight ?? 1024}
                  style={{ width: "100%", height: "auto", display: "block" }} />
                {shot.caption && (
                  <div style={{ padding: "0.5rem 0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                    {shot.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Achievement badges ────────────────────────────────────────── */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {reputationAchievements.map((s, i) => (
            <motion.div key={s.title}
              initial={!prefersReduced ? { opacity: 0, y: 12 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                padding: "1rem 1.15rem", borderRadius: "16px",
                background: `linear-gradient(135deg, rgba(255,255,255,0.85), ${s.accent}12)`,
                border: `1px solid ${s.accent}30`, boxShadow: `0 10px 26px ${s.accent}16`,
              }}>
              <span style={{ width: 42, height: 42, borderRadius: "12px", flexShrink: 0, background: `${s.accent}1A`, border: `1px solid ${s.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StatGlyph icon={s.icon} color={s.accent} />
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.15rem" }}>{s.title}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "var(--text)", lineHeight: 1 }}>{s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
