"use client";

/**
 * Contact — "Let's build something worth it."
 *
 * A conversion section, not a contact form. Left: the pitch. Center: the "R."
 * core orbited by the reasons people hire him. Right: every direct contact
 * method as a premium card (copy phone/email, open socials). Bottom: the
 * moments worth reaching out for + an availability strip.
 *
 * The closing chapter of the portfolio — a founder's operating system, not a
 * generic contact page. Respects prefers-reduced-motion.
 */

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Section, Container } from "@/components/ui";
import {
  contactIntro, orbitTraits, contactMethods, reachReasons, contactMeta,
} from "@/content/contact";
import type { ContactIcon, TraitIcon, ReasonIcon } from "@/content/contact";

/* ── Icon set (inline; brand marks simplified) ──────────────────────────── */
function Glyph({ name, s = 20, c = "currentColor" }: { name: ContactIcon | TraitIcon | ReasonIcon | "copy" | "external" | "pin" | "check"; s?: number; c?: string }) {
  const p = { fill: "none", stroke: c, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "phone": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v3a2 2 0 01-2.2 2A16 16 0 013 6.2 2 2 0 015 4z" /></svg>;
    case "mail": return <svg width={s} height={s} viewBox="0 0 24 24"><rect {...p} x="3" y="5" width="18" height="14" rx="2" /><path {...p} d="M4 7l8 6 8-6" /></svg>;
    case "github": return <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.3-1.1.6-1.4-2.2-.300-4.6-1.1-4.6-5a3.9 3.9 0 011-2.7c-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 015 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 011 2.7c0 3.9-2.4 4.7-4.6 5 .3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0012 2z" /></svg>;
    case "linkedin": return <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M6.94 5a1.94 1.94 0 11-3.88 0 1.94 1.94 0 013.88 0zM3.3 8.5h3.3V21H3.3V8.5zM9.2 8.5h3.16v1.7h.05c.44-.83 1.5-1.7 3.1-1.7 3.3 0 3.9 2.17 3.9 5V21h-3.3v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.2V8.5z" /></svg>;
    case "x": return <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M17.3 3h3.3l-7.2 8.2L21.8 21h-6.6l-5.2-6.8L4 21H.7l7.7-8.8L2.2 3h6.8l4.7 6.2L17.3 3zm-1.2 16h1.8L7.9 4.8H6L16.1 19z" /></svg>;
    case "instagram": return <svg width={s} height={s} viewBox="0 0 24 24"><rect {...p} x="3" y="3" width="18" height="18" rx="5" /><circle {...p} cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill={c} stroke="none" /></svg>;
    case "brain": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M9 4a3 3 0 00-3 3 3 3 0 00-1 5.8A3 3 0 008 17a3 3 0 003-3V6a2 2 0 00-2-2zM15 4a3 3 0 013 3 3 3 0 011 5.8A3 3 0 0116 17a3 3 0 01-3-3V6a2 2 0 012-2z" /></svg>;
    case "target": return <svg width={s} height={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="8" /><circle {...p} cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1.3" fill={c} stroke="none" /></svg>;
    case "heart": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M12 20s-7-4.3-9-8.5C1.5 8 3.3 5 6.2 5 8 5 9.2 6 12 8.5 14.8 6 16 5 17.8 5c2.9 0 4.7 3 3.2 6.5C19 15.7 12 20 12 20z" /></svg>;
    case "code": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>;
    case "spark": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /></svg>;
    case "cube": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9" /></svg>;
    case "bulb": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.5.4.5.6.5 1.1v1h6v-1c0-.5 0-.7.5-1.1A6 6 0 0012 3z" /></svg>;
    case "rocket": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5M14 4c3 1 5 3 6 6-2 5-6 8-10 9l-3-3c1-4 4-8 9-10l-2-2zM15 9a1 1 0 100-2 1 1 0 000 2z" /></svg>;
    case "users": return <svg width={s} height={s} viewBox="0 0 24 24"><circle {...p} cx="9" cy="8" r="3" /><path {...p} d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5.8M21 20a6 6 0 00-4-5.6" /></svg>;
    case "crosshair": return <svg width={s} height={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="8" /><path {...p} d="M12 2v4M12 18v4M2 12h4M18 12h4" /><circle cx="12" cy="12" r="1.3" fill={c} stroke="none" /></svg>;
    case "copy": return <svg width={s} height={s} viewBox="0 0 24 24"><rect {...p} x="9" y="9" width="11" height="11" rx="2" /><path {...p} d="M5 15V5a2 2 0 012-2h8" /></svg>;
    case "external": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M7 17L17 7M9 7h8v8" /></svg>;
    case "pin": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} d="M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10z" /><circle {...p} cx="12" cy="11" r="2" /></svg>;
    case "check": return <svg width={s} height={s} viewBox="0 0 24 24"><path {...p} strokeWidth="2.2" d="M5 13l4 4L19 7" /></svg>;
    default: return null;
  }
}

/* ── Orbit (center R + traits) ──────────────────────────────────────────── */
function Orbit({ prefersReduced }: { prefersReduced: boolean | null }) {
  return (
    <div className="relative mx-auto hidden md:block" style={{ width: "100%", maxWidth: 460, aspectRatio: "1" }} aria-hidden="true">
      {/* dashed rings — slow counter-rotation */}
      {[{ r: 44, dur: 60, dir: 1 }, { r: 30, dur: 44, dir: -1 }].map((ring, i) => (
        <motion.div key={i}
          animate={!prefersReduced ? { rotate: 360 * ring.dir } : {}}
          transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", left: "50%", top: "50%", width: `${ring.r * 2}%`, height: `${ring.r * 2}%`, transform: "translate(-50%,-50%)", borderRadius: "50%", border: "1px dashed #C9CDDA" }}>
          <span style={{ position: "absolute", left: "50%", top: -3, width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "#8B5CF6" : "#2563EB", transform: "translateX(-50%)" }} />
        </motion.div>
      ))}

      {/* center core */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 3 }}>
        <div style={{ position: "relative", width: 104, height: 104, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 18px 44px rgba(0,0,0,0.12), 0 0 0 8px rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!prefersReduced && (
            <motion.span animate={{ scale: [1, 1.5], opacity: [0.35, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
              style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid rgba(43,107,255,0.4)" }} />
          )}
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.4rem", color: "var(--text)", letterSpacing: "-0.05em" }}>R<span style={{ color: "var(--accent)" }}>.</span></span>
        </div>
      </div>

      {/* trait markers */}
      {orbitTraits.map((t) => {
        const rad = (t.angle * Math.PI) / 180;
        const dot = { x: 50 + 30 * Math.cos(rad), y: 50 + 30 * Math.sin(rad) };
        const lab = { x: 50 + 44 * Math.cos(rad), y: 50 + 44 * Math.sin(rad) };
        const left = Math.cos(rad) < -0.25, right = Math.cos(rad) > 0.25;
        return (
          <div key={t.id}>
            {/* dot on the orbit */}
            <motion.span
              animate={!prefersReduced ? { scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: (t.angle + 180) / 120 }}
              style={{ position: "absolute", left: `${dot.x}%`, top: `${dot.y}%`, width: 9, height: 9, borderRadius: "50%", background: t.accent, boxShadow: `0 0 8px ${t.accent}`, transform: "translate(-50%,-50%)", zIndex: 2 }} />
            {/* icon + handwritten label */}
            <div style={{ position: "absolute", left: `${lab.x}%`, top: `${lab.y}%`, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: left ? "flex-end" : right ? "flex-start" : "center", gap: "0.2rem", zIndex: 2 }}>
              <span style={{ color: "var(--text-muted)", opacity: 0.7 }}><Glyph name={t.icon} s={18} c="currentColor" /></span>
              <span style={{ fontFamily: "var(--font-caveat)", fontSize: "0.95rem", lineHeight: 1.1, color: "var(--text-muted)", textAlign: left ? "right" : right ? "left" : "center", whiteSpace: "pre-line" }}>{t.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Contact() {
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = (id: string, value: string) => {
    try { navigator.clipboard?.writeText(value).catch(() => {}); } catch { /* clipboard blocked */ }
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800);
  };

  const headLines = contactIntro.headline.split("\n");

  return (
    <Section id="contact" bg="default">
      <Container>
        {/* ── Top: pitch · orbit · contact cards ───────────────────────── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_0.9fr_1fr] lg:gap-10 lg:items-center">

          {/* LEFT — pitch */}
          <motion.div
            initial={!prefersReduced ? { opacity: 0, y: 22 } : false}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
              {contactIntro.eyebrow}
            </p>
            <h2 className="font-semibold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: "clamp(2.75rem, 4.6vw, 4.25rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}>
              {headLines.map((l, i) => <span key={i} className="block">{l}</span>)}
              <span className="relative inline-block" style={{ background: "linear-gradient(115deg, var(--accent) 0%, var(--accent-2) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {contactIntro.highlight}
                <svg width="100%" height="7" viewBox="0 0 200 7" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", left: 0, bottom: "-2px", overflow: "visible" }}>
                  <path d="M2 4 Q100 0 198 4" stroke="var(--accent)" strokeWidth="2.5" fill="none" opacity="0.55" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <div className="mt-7" style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7 }}>
              {contactIntro.supporting.map((l, i) => <p key={i}>{l}</p>)}
            </div>
            <p className="mt-6 inline-flex items-center gap-2" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem", color: "var(--accent)" }}>
              {contactIntro.note}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8c5 0 11 2 14 8M18 16l1-4M18 16l-4 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </p>
          </motion.div>

          {/* CENTER — orbit */}
          <motion.div
            initial={!prefersReduced ? { opacity: 0, scale: 0.94 } : false}
            whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Orbit prefersReduced={prefersReduced} />
          </motion.div>

          {/* RIGHT — contact cards */}
          <div>
            <p className="mb-3 text-right" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.25rem", color: "var(--text-muted)" }}>{contactIntro.reachLabel} ↘</p>
            <div className="flex flex-col gap-2.5">
              {contactMethods.map((m, i) => {
                const isCopy = m.action === "copy";
                const justCopied = copied === m.id;
                return (
                  <motion.a key={m.id}
                    href={isCopy ? undefined : m.href}
                    target={isCopy ? undefined : "_blank"} rel={isCopy ? undefined : "noopener noreferrer"}
                    onClick={isCopy ? (e) => { e.preventDefault(); onCopy(m.id, m.copyValue ?? m.value); } : undefined}
                    initial={!prefersReduced ? { opacity: 0, x: 16 } : false}
                    whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={!prefersReduced ? { y: -2 } : {}}
                    className="group"
                    style={{ display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.85rem 0.95rem", borderRadius: "14px", background: "rgba(255,255,255,0.7)", border: "1px solid var(--border)", boxShadow: "0 4px 14px rgba(0,0,0,0.03)", textDecoration: "none", cursor: "pointer", transition: "box-shadow 0.2s ease, border-color 0.2s ease" }}>
                    <span style={{ width: 42, height: 42, borderRadius: "11px", flexShrink: 0, background: `${m.accent}14`, border: `1px solid ${m.accent}2A`, display: "flex", alignItems: "center", justifyContent: "center", color: m.accent }}>
                      <Glyph name={m.icon} s={20} c={m.accent} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.1rem" }}>{m.label}</span>
                      <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.value}</span>
                    </span>
                    <span style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: justCopied ? "#059669" : "var(--text)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s ease" }}>
                      <Glyph name={justCopied ? "check" : isCopy ? "copy" : "external"} s={14} c="#FFF" />
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Reasons strip ────────────────────────────────────────────── */}
        <div className="mt-14" style={{ padding: "1.5rem 1.75rem", borderRadius: "20px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.5)" }}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr_1fr_1fr_1fr] md:items-center md:gap-8">
            <div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{contactIntro.reasonsKicker}</div>
              <div className="inline-flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.35rem", color: "var(--text)" }}>
                {contactIntro.reasonsLabel}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
            {reachReasons.map((r, i) => (
              <motion.div key={r.id} className="flex items-center gap-3"
                initial={!prefersReduced ? { opacity: 0, y: 12 } : false}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}>
                <span style={{ width: 40, height: 40, borderRadius: "11px", flexShrink: 0, background: `${r.accent}16`, border: `1px solid ${r.accent}28`, display: "flex", alignItems: "center", justifyContent: "center", color: r.accent }}>
                  <Glyph name={r.icon} s={19} c={r.accent} />
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.86rem", fontWeight: 500, color: "var(--text)", lineHeight: 1.3, whiteSpace: "pre-line" }}>{r.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Footer strip ─────────────────────────────────────────────── */}
        <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text)" }}>
              <motion.span animate={!prefersReduced ? { opacity: [1, 0.4, 1] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
              {contactMeta.availability}
            </span>
            <span className="hidden sm:inline" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2rem", color: "var(--accent)" }}>{contactMeta.availabilityNote}</span>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {contactMeta.location}
            <span style={{ width: 30, height: 30, borderRadius: "9px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><Glyph name="pin" s={15} c="currentColor" /></span>
          </span>
        </div>
      </Container>
    </Section>
  );
}
