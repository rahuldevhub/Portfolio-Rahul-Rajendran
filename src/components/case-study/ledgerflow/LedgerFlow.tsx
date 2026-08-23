"use client";

/**
 * LedgerFlow case study — full custom page.
 *
 * Replaces the MDX-driven case study for this one project with a visual,
 * interactive narrative: Problem → Idea → Product (screen explorer) →
 * System → Business Health → Cash Flow → GST (carousel) → Mobile (carousel) →
 * Engineering → Decisions → Closing.
 *
 * Reuses the site's existing primitives (Container, Section) and motion
 * language (whileInView reveals, hover-driven detail panels, the
 * OperatorStack-style signal cascade) rather than introducing a new one.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import {
  FileText,
  FileCheck,
  Wallet,
  Receipt,
  CreditCard,
  TrendingUp,
  Calculator,
  Send,
  Users,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Download,
  Zap,
  Database,
  LineChart,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Container, Section } from "@/components/ui";
import { Cards, Card } from "@/components/case-study/blocks";
import {
  ledgerflowHero,
  problem,
  ideaIntro,
  stages,
  productExplorerIntro,
  productScreens,
  type ProductScreen,
  systemFlow,
  dashboardSection,
  cashFlowSection,
  gstSection,
  mobileSection,
  buildGroups,
  engineeringIntro,
  engineeringPrinciples,
  decisions,
  decisionsIntro,
  closing,
} from "@/content/work/ledgerflow";

/* ── Shared bits ──────────────────────────────────────────────────────── */

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className="mb-4 text-xs font-semibold uppercase tracking-[0.16em]"
      style={{ color: dark ? "rgba(255,255,255,0.7)" : "var(--accent)", fontFamily: "var(--font-display)" }}
    >
      {children}
    </p>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: 11, height: 11, borderRadius: 999, background: color, display: "inline-block" }}
    />
  );
}

/** macOS/browser chrome frame around a real screenshot, with room for overlays. */
function BrowserFrame({
  url,
  children,
  wide = false,
}: {
  url?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        overflow: "hidden",
        boxShadow: wide
          ? "0 1px 3px rgba(10,10,11,0.05), 0 40px 90px -30px rgba(10,10,11,0.28)"
          : "0 1px 3px rgba(10,10,11,0.04), 0 24px 56px -20px rgba(10,10,11,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "11px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <span style={{ display: "flex", gap: 6 }} aria-hidden="true">
          <Dot color="#FF5F57" />
          <Dot color="#FEBC2E" />
          <Dot color="#28C840" />
        </span>
        {url && (
          <span
            style={{
              marginLeft: 8,
              flex: 1,
              maxWidth: 320,
              padding: "4px 14px",
              borderRadius: 999,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {url}
          </span>
        )}
      </div>
      <div style={{ position: "relative", lineHeight: 0 }}>{children}</div>
    </div>
  );
}

function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ display: "block", width: "100%", height: "auto", objectFit: "cover" }}
    />
  );
}

/**
 * Shared autoplay-carousel state. Advances `index` every `intervalMs` via a
 * self-resetting timeout — because the effect depends on `index`, a manual
 * `setIndex` call (thumbnail click, dot click, arrow button) naturally
 * restarts the countdown instead of needing separate reset logic.
 * `enabled` should be `false` under prefers-reduced-motion.
 */
function useAutoplay(count: number, intervalMs: number, enabled: boolean) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!enabled || paused || count <= 1) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearTimeout(id);
  }, [enabled, paused, count, intervalMs, index]);

  return { index, setIndex, paused, setPaused };
}

function RevealUp({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Reveal for large visuals — fade + slight rise + scale from 0.98 → 1. */
function RevealImage({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Thin accent progress line at the very top of the viewport, tracking scroll through this page. */
function ScrollProgressBar() {
  const prefersReduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-[2px] w-full"
      style={{ background: "transparent" }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

/**
 * Full-screen lightbox for inspecting a screenshot at full size. Closes on
 * Escape, backdrop click, or the close button; traps nothing fancy, but
 * moves focus to the close button on open for keyboard users.
 */
function Lightbox({
  image,
  onClose,
}: {
  image: { src: string; alt: string; title: string; description: string } | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!image) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={image.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-6"
          style={{ background: "rgba(10,10,11,0.72)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="relative flex max-h-[88vh] max-w-[92vw] flex-col overflow-hidden rounded-[16px]"
            style={{ background: "var(--bg)", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className="overflow-auto" style={{ background: "var(--surface)" }}>
              <img src={image.src} alt={image.alt} style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <div className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>
                {image.title}
              </h4>
              <p className="mt-1 text-[0.85rem] leading-[1.55]" style={{ color: "var(--text-muted)", maxWidth: "60ch" }}>
                {image.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Fires a background `Image()` fetch for every url, once, so the browser
 *  cache is warm before StableImageTransition ever needs any of them. */
function usePreloadImages(urls: string[]) {
  useEffect(() => {
    const images = urls.map((url) => {
      const img = new window.Image();
      img.src = url;
      return img;
    });
    return () => {
      images.forEach((img) => { img.onload = null; img.onerror = null; });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Two-layer crossfade for a screenshot carousel — the fix for the "blank/
 * washed-out" and "black phone" bugs. The currently-displayed image is NEVER
 * unmounted or hidden until the next `src` has fully loaded in the
 * background; only then does it crossfade in, and only after that finishes
 * does the old layer get dropped. A stale-request guard (via an incrementing
 * ref) means rapid clicks can never let an old load callback overwrite a
 * newer selection. Requires a parent with a fixed `aspectRatio` so both
 * absolutely-positioned layers have somewhere to sit without layout shift.
 */
function StableImageTransition({
  src,
  alt,
  aspectRatio,
  rounded,
}: {
  src: string;
  alt: string;
  aspectRatio: string;
  rounded?: number;
}) {
  const prefersReduced = useReducedMotion();
  const [current, setCurrent] = useState(src);
  const [incoming, setIncoming] = useState<string | null>(null);
  const [incomingReady, setIncomingReady] = useState(false);
  const requestId = useRef(0);

  // React-sanctioned "adjust state during render" pattern (see the React
  // docs on storing prop-derived state): detecting the prop change here
  // rather than in an effect body means the setState call isn't flagged as
  // a synchronous effect side-effect, and it converges after one extra
  // render since `incoming` then equals `src`.
  if (src !== current && src !== incoming) {
    setIncoming(src);
    setIncomingReady(false);
  }

  // The actual network fetch is a genuine side effect; every setState here
  // happens inside the async onload/onerror callbacks, never synchronously
  // in the effect body itself.
  useEffect(() => {
    if (!incoming) return;
    const myRequest = ++requestId.current;
    const img = new window.Image();
    img.onload = () => {
      if (requestId.current !== myRequest) return; // superseded by a newer selection
      setIncomingReady(true);
    };
    img.onerror = () => {
      if (requestId.current !== myRequest) return;
      // Loading failed — never swap to a broken image; just drop the attempt
      // and keep showing `current`.
      setIncoming(null);
    };
    img.src = incoming;
  }, [incoming]);

  // Reduced motion: promote instantly once loaded — a render-time
  // adjustment again, so there's no synchronous setState in an effect.
  if (incomingReady && incoming && prefersReduced) {
    setCurrent(incoming);
    setIncoming(null);
    setIncomingReady(false);
  }

  // Full motion: hold the crossfade for its duration, then drop the old
  // layer. The setState calls are inside the timeout callback, not the
  // effect body.
  useEffect(() => {
    if (!incomingReady || !incoming || prefersReduced) return;
    const t = window.setTimeout(() => {
      setCurrent(incoming);
      setIncoming(null);
      setIncomingReady(false);
    }, 520);
    return () => window.clearTimeout(t);
  }, [incomingReady, incoming, prefersReduced]);

  const layerStyle = (visible: boolean, slideFrom: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    objectPosition: "top",
    opacity: visible ? 1 : 0,
    transform: prefersReduced
      ? "none"
      : visible
        ? "translateX(0)"
        : `translateX(${slideFrom === "right" ? 8 : -8}px)`,
    transition: prefersReduced ? "none" : "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
  });

  return (
    <div style={{ position: "relative", aspectRatio, overflow: "hidden", borderRadius: rounded, background: "var(--surface)" }}>
      {/* Keyed by its own src: when `current` is promoted to a new image, this
         forces a clean remount at opacity 1 instead of reusing the outgoing
         node (which still carries the fade-out transition and would replay
         a spurious second fade-in as its src attribute changes in place). */}
      <img
        key={current}
        src={current}
        alt={incoming ? "" : alt}
        aria-hidden={incoming ? true : undefined}
        style={layerStyle(!incoming || !incomingReady, "left")}
      />
      {incoming && <img src={incoming} alt={alt} style={layerStyle(incomingReady, "right")} />}
    </div>
  );
}

/** Animated count-up for purely numeric stat values; static render otherwise. */
function StatValue({ value }: { value: string }) {
  const isNumeric = /^\d+$/.test(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [animated, setAnimated] = useState<string | null>(null);
  const done = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isNumeric || prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const target = parseInt(value, 10);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const duration = 700;
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            setAnimated(String(Math.round(p * target)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [isNumeric, prefersReduced, value]);

  const display = !isNumeric || prefersReduced ? value : animated ?? "0";

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

/* ── 01. Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <Section size="lg" bg="default">
      <Container>
        <RevealUp>
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span
              className="text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
            >
              {ledgerflowHero.eyebrow}
            </span>
            <span className="text-xs" style={{ color: "var(--border)" }} aria-hidden="true">·</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{ledgerflowHero.year}</span>
          </div>
        </RevealUp>

        <RevealUp delay={0.05}>
          <h1
            className="font-semibold leading-[0.98] tracking-[-0.03em]"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {ledgerflowHero.title}
          </h1>
        </RevealUp>

        <RevealUp delay={0.1}>
          <p
            className="mt-6 leading-[1.5]"
            style={{ fontSize: "clamp(1.15rem, 2vw, 1.5rem)", color: "var(--text)", maxWidth: "34ch", fontWeight: 500 }}
          >
            {ledgerflowHero.description}
          </p>
          <p
            className="mt-4 text-base font-medium"
            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
          >
            {ledgerflowHero.statement}
          </p>
        </RevealUp>

        <RevealUp delay={0.16}>
          <div
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-10"
            style={{ borderTop: "1px solid var(--border)", paddingTop: "1.75rem" }}
          >
            {ledgerflowHero.meta.map((m) => (
              <div
                key={m.label}
                className="transition-transform duration-300 hover:-translate-y-0.5"
              >
                <p
                  className="font-semibold tracking-[-0.02em]"
                  style={{ fontSize: "1.35rem", fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {m.value}
                </p>
                <p
                  className="mt-0.5 text-[11px] uppercase tracking-[0.08em]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </RevealUp>
      </Container>
    </Section>
  );
}

/* ── 02. The problem ──────────────────────────────────────────────────── */

function ProblemSection() {
  const prefersReduced = useReducedMotion();
  return (
    <Section bg="surface">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <RevealUp>
            <Eyebrow>{problem.eyebrow}</Eyebrow>
            <h2
              className="font-semibold leading-[1.12] tracking-[-0.026em]"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              {problem.headlineTop}
              <br />
              <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{problem.headlineBottom}</span>
            </h2>
            <p className="mt-6 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "40ch" }}>
              {problem.body}
            </p>
          </RevealUp>

          <div>
            <div className="flex flex-col gap-3">
              {problem.fragments.map((f, i) => (
                <motion.div
                  key={f.step}
                  initial={prefersReduced ? false : { opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.55, ease: EASE_OUT, delay: i * 0.09 }}
                  className="flex items-center gap-4 rounded-[14px] border px-5 py-4"
                  style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "rgba(224,36,94,0.1)", color: "#E0245E" }}
                    aria-hidden="true"
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.98rem", color: "var(--text)" }}>
                      {f.step}
                    </p>
                    <p className="mt-0.5 text-[0.85rem]" style={{ color: "var(--text-muted)" }}>
                      {f.tool}
                    </p>
                  </div>
                  <span
                    className="ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
                    style={{ background: "rgba(224,36,94,0.08)", color: "#E0245E", fontFamily: "var(--font-mono)" }}
                  >
                    Manual
                  </span>
                </motion.div>
              ))}
            </div>

            <RevealUp delay={0.3}>
              <p
                className="mt-7 text-base font-medium leading-[1.6]"
                style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
              >
                {problem.insight}
              </p>
            </RevealUp>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ── 03. The idea — sticky scroll-driven flow + stable feature card ─────── */

const STAGE_ICONS: Record<string, LucideIcon> = {
  quotation: FileText,
  proforma: FileCheck,
  payment: Wallet,
  "tax-invoice": Receipt,
  expenses: CreditCard,
  "cash-flow": TrendingUp,
  "gst-summary": Calculator,
  "gst-filing": Send,
};

const IDEA_VH_PER_STAGE = 40;
const IDEA_MANUAL_PRIORITY_MS = 1600;

/** The feature-card content shared by desktop and mobile — icon, title,
 *  description, "carries forward" chip, and the optional screenshot inset. */
function StageCard({ stage, compact = false }: { stage: (typeof stages)[number]; compact?: boolean }) {
  const Icon = STAGE_ICONS[stage.id] ?? FileText;
  return (
    <div>
      <span
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: "rgba(43,107,255,0.1)", color: "var(--accent)" }}
        aria-hidden="true"
      >
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <h3
        className="font-semibold tracking-[-0.02em]"
        style={{ fontSize: "1.3rem", fontFamily: "var(--font-display)", color: "var(--text)" }}
      >
        {stage.label}
      </h3>
      <p className="mt-2.5 text-[0.92rem] leading-[1.65]" style={{ color: "var(--text-muted)", maxWidth: "42ch" }}>
        {stage.description}
      </p>
      <div
        className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
      >
        <ArrowRight size={12} strokeWidth={2} style={{ color: "var(--accent)" }} aria-hidden="true" />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
          {stage.carries}
        </span>
      </div>

      {/* Omitted in the compact desktop sticky card: it's the one stage with a
         screenshot inset, and including it there is what pushed the card
         taller than the sticky viewport slice can guarantee — the same
         screenshot is already shown at full size in the Product section.
         Mobile's accordion has no such height constraint, so it keeps it. */}
      {stage.screenshot && !compact && (
        <div className="mt-4">
          <div
            className="overflow-hidden rounded-[10px] border"
            style={{ borderColor: "var(--border)", boxShadow: "0 8px 20px -14px rgba(10,10,11,0.25)" }}
          >
            <img
              src={stage.screenshot}
              alt={stage.screenshotCaption ?? `${stage.label} — real product screenshot`}
              loading="lazy"
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
          {stage.screenshotCaption && (
            <p className="mt-1.5 text-[0.68rem]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.8 }}>
              {stage.screenshotCaption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** One row in the compact flow list, shared by the desktop panel. */
function FlowRow({
  stage,
  index,
  isActive,
  isDone,
  onSelect,
}: {
  stage: (typeof stages)[number];
  index: number;
  isActive: boolean;
  isDone: boolean;
  onSelect: () => void;
}) {
  const Icon = STAGE_ICONS[stage.id] ?? FileText;
  return (
    <div>
      <button
        onClick={onSelect}
        aria-current={isActive}
        className="flex w-full items-center gap-3 rounded-[10px] px-2.5 transition-all duration-200"
        style={{
          height: 42,
          background: isActive ? "var(--accent)" : "transparent",
          color: isActive ? "#fff" : "var(--text)",
          boxShadow: isActive ? "0 8px 20px -10px rgba(43,107,255,0.5)" : "none",
        }}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
          style={{
            background: isActive ? "rgba(255,255,255,0.22)" : "var(--surface)",
            color: isActive ? "#fff" : "var(--text-muted)",
          }}
        >
          <Icon size={11} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="flex-1 text-left" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem" }}>
          {stage.label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", opacity: isActive ? 0.85 : 0.4 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </button>
      {index < stages.length - 1 && (
        <div className="flex" style={{ height: 4 }} aria-hidden="true">
          <div
            style={{
              width: 2,
              height: "100%",
              marginLeft: "1.375rem",
              background: isDone ? "var(--accent)" : "var(--border)",
              transition: "background 0.3s ease",
            }}
          />
        </div>
      )}
    </div>
  );
}

function IdeaExplorer() {
  const prefersReduced = useReducedMotion();
  const total = stages.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndexState] = useState(0);
  const manualPriority = useRef(false);
  const manualTimeout = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (prefersReduced) return;
    if (manualPriority.current) return; // a manual click is temporarily in charge
    const idx = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    setActiveIndexState(idx);
  });

  const selectStage = (i: number) => {
    manualPriority.current = true;
    if (manualTimeout.current) window.clearTimeout(manualTimeout.current);
    manualTimeout.current = window.setTimeout(() => {
      manualPriority.current = false;
    }, IDEA_MANUAL_PRIORITY_MS);
    setActiveIndexState(i);
  };

  // Mobile's accordion can set activeIndex to -1 (fully collapsed); since
  // both branches below are always mounted (only CSS-hidden per breakpoint),
  // the desktop panel normalizes that to 0 so it's never left with nothing
  // selected and never reads stages[-1].
  const desktopIndex = activeIndex === -1 ? 0 : activeIndex;
  const active = stages[desktopIndex];

  const panel = (
    <div
      className="overflow-hidden rounded-[20px] border"
      style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "0 30px 70px -40px rgba(10,10,11,0.25)" }}
    >
      <div className="p-5">
        <p
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.8 }}
        >
          Financial flow
        </p>
        <div>
          {stages.map((s, i) => (
            <FlowRow
              key={s.id}
              stage={s}
              index={i}
              isActive={i === desktopIndex}
              isDone={i < desktopIndex}
              onSelect={() => selectStage(i)}
            />
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        <motion.div layout className="p-6" transition={{ duration: 0.4, ease: EASE_OUT }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <StageCard stage={active} compact />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );

  return (
    <Section overflowVisible={!prefersReduced}>
      <Container>
        {/* Desktop / tablet — sticky two-column scroll story */}
        <div className="hidden lg:block">
          <div ref={trackRef} style={{ position: "relative", height: prefersReduced ? undefined : `${total * IDEA_VH_PER_STAGE}vh` }}>
            <div
              className="grid grid-cols-[0.4fr_0.6fr] items-center gap-14"
              style={prefersReduced ? undefined : { position: "sticky", top: 112 }}
            >
              <RevealUp>
                <Eyebrow>{ideaIntro.eyebrow}</Eyebrow>
                <h2
                  className="font-semibold leading-[1.06] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {ideaIntro.headlineTop}
                  <br />
                  {ideaIntro.headlineBottom}
                </h2>
                <p className="mt-6 text-base leading-[1.7]" style={{ color: "var(--text)", maxWidth: "44ch" }}>
                  {ideaIntro.bodyLead}
                </p>
                <p className="mt-4 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "44ch" }}>
                  {ideaIntro.bodyFollow}
                </p>
              </RevealUp>

              <RevealUp delay={0.08}>{panel}</RevealUp>
            </div>
          </div>
        </div>

        {/* Mobile — stacked intro + accordion */}
        <div className="lg:hidden">
          <RevealUp>
            <Eyebrow>{ideaIntro.eyebrow}</Eyebrow>
            <h2
              className="font-semibold leading-[1.06] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              {ideaIntro.headlineTop}
              <br />
              {ideaIntro.headlineBottom}
            </h2>
            <p className="mt-6 text-base leading-[1.7]" style={{ color: "var(--text)", maxWidth: "46ch" }}>
              {ideaIntro.bodyLead}
            </p>
            <p className="mt-4 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "46ch" }}>
              {ideaIntro.bodyFollow}
            </p>
          </RevealUp>

          <RevealUp delay={0.1} className="mt-8 flex flex-col gap-2">
            {stages.map((s, i) => {
              const isOpen = i === activeIndex;
              const Icon = STAGE_ICONS[s.id] ?? FileText;
              return (
                <div key={s.id} className="overflow-hidden rounded-[14px] border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  <button
                    onClick={() => setActiveIndexState(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200"
                    style={{ background: isOpen ? "var(--accent)" : "transparent", color: isOpen ? "#fff" : "var(--text)" }}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{ background: isOpen ? "rgba(255,255,255,0.22)" : "var(--bg)", color: isOpen ? "#fff" : "var(--text-muted)" }}
                    >
                      <Icon size={13} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="flex-1" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.92rem" }}>
                      {s.label}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", opacity: isOpen ? 0.85 : 0.45 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ChevronDown
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-4 pb-5 pt-1" style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
                          <div className="pt-4">
                            <StageCard stage={s} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </RevealUp>
        </div>
      </Container>
    </Section>
  );
}

/* ── 04. The product — one large screen at a time ──────────────────────── */

const SCREEN_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  clients: Users,
  quotations: FileText,
  "tax-invoices": Receipt,
  receipts: Wallet,
  expenses: CreditCard,
  "cash-flow": TrendingUp,
  gst: ShieldCheck,
};

function ProductExplorerSection() {
  const prefersReduced = useReducedMotion();
  const { index, setIndex, setPaused } = useAutoplay(productScreens.length, 4500, !prefersReduced);
  const [lightboxItem, setLightboxItem] = useState<ProductScreen | null>(null);
  const active = productScreens[index];
  const total = productScreens.length;

  usePreloadImages(productScreens.map((s) => s.screenshot));

  return (
    <Section bg="surface">
      <Container constrained={false} style={{ maxWidth: "1200px" }}>
        <RevealUp>
          <Eyebrow>{productExplorerIntro.eyebrow}</Eyebrow>
          <h2
            className="font-semibold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {productExplorerIntro.headline}
          </h2>
          <p className="mt-5 text-base leading-[1.7]" style={{ color: "var(--text)", maxWidth: "62ch" }}>
            {productExplorerIntro.body}
          </p>
          <p className="mt-2.5 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "62ch" }}>
            {productExplorerIntro.bodyFollow}
          </p>
        </RevealUp>

        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="mt-9">
          <RevealImage>
            <button
              onClick={() => setLightboxItem(active)}
              aria-label={`Inspect ${active.label} screenshot`}
              className="block w-full text-left transition-transform duration-300 hover:scale-[1.006]"
            >
              <BrowserFrame wide>
                <StableImageTransition src={active.screenshot} alt={active.alt} aspectRatio="3350/1858" />
              </BrowserFrame>
            </button>
          </RevealImage>

          {/* Screen selector */}
          <RevealUp delay={0.08} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {productScreens.map((s, i) => {
                const Icon = SCREEN_ICONS[s.id] ?? FileText;
                const isActive = i === index;
                return (
                  <button
                    key={s.id}
                    onClick={() => setIndex(i)}
                    aria-current={isActive}
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.8rem] font-medium transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: isActive ? "var(--accent)" : "var(--bg)",
                      color: isActive ? "#fff" : "var(--text)",
                      border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    <Icon size={13} strokeWidth={2} aria-hidden="true" style={{ opacity: isActive ? 1 : 0.6 }} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </RevealUp>

          {/* Active screen story */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <p
                  className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.75 }}
                >
                  Active screen
                </p>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>
                  {active.title}
                </h3>
                <p className="mt-1.5 text-[0.92rem] leading-[1.6]" style={{ color: "var(--text-muted)", maxWidth: "58ch" }}>
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
              <span
                className="tabular-nums"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", opacity: 0.7 }}
              >
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <div className="h-1 w-32 overflow-hidden rounded-full" style={{ background: "var(--border)" }} aria-hidden="true">
                <div
                  style={{
                    height: "100%",
                    width: `${((index + 1) / total) * 100}%`,
                    background: "var(--accent)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Lightbox
        image={
          lightboxItem
            ? { src: lightboxItem.screenshot, alt: lightboxItem.alt, title: lightboxItem.title, description: lightboxItem.description }
            : null
        }
        onClose={() => setLightboxItem(null)}
      />
    </Section>
  );
}

/* ── 05. System / data flow ───────────────────────────────────────────── */

interface FlowNode {
  label: string;
  description: string;
}

const FLOW_NODES: FlowNode[] = [
  { label: "Client", description: "GSTIN, state, and contact — recorded once." },
  { label: "Quotation", description: "Line items and terms sent to the client." },
  { label: "Proforma", description: "Terms agreed — same record, next stage." },
  { label: "Payment", description: "Money received against the proforma." },
  { label: "Tax Invoice", description: "GST split decided from the client's state." },
  { label: "Expenses", description: "Costs logged, flagged for input credit." },
  { label: "Cash Flow", description: "Every rupee in and out, netted live." },
  { label: "GST", description: "Output tax minus ITC — always current." },
];

function SystemFlowSection() {
  const prefersReduced = useReducedMotion();
  const [activeCount, setActiveCount] = useState(prefersReduced ? FLOW_NODES.length : 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let n = 0;
          const tick = () => {
            n += 1;
            setActiveCount(n);
            if (n < FLOW_NODES.length) window.setTimeout(tick, 260);
          };
          window.setTimeout(tick, 250);
        }
      });
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  return (
    <Section>
      <Container constrained={false} style={{ maxWidth: "1200px" }}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:items-center">
          <RevealUp>
            <Eyebrow>{systemFlow.eyebrow}</Eyebrow>
            <h2
              className="font-semibold leading-[1.08] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 3.4vw, 3rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              <span className="block">{systemFlow.headlineTop}</span>
              <span
                className="block mt-1"
                style={{
                  background: "linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {systemFlow.headlineBottom}
              </span>
            </h2>
            <p className="mt-6 text-base leading-[1.75]" style={{ color: "var(--text-muted)", maxWidth: "40ch" }}>
              {systemFlow.body}
            </p>
          </RevealUp>

          <div ref={ref} className="flex flex-col">
            {FLOW_NODES.map((node, i) => {
              const lit = i < activeCount;
              const isHovered = hovered === i;
              return (
                <div key={node.label}>
                  <div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative rounded-[14px]"
                    style={{
                      padding: "0.85rem 1.1rem",
                      background: lit ? "var(--bg)" : "rgba(255,255,255,0.4)",
                      border: `1px solid ${lit ? "var(--border)" : "var(--border)"}`,
                      opacity: lit ? 1 : 0.45,
                      boxShadow: isHovered && lit ? "0 10px 28px -14px rgba(43,107,255,0.35)" : "none",
                      transform: isHovered && lit ? "translateX(4px)" : "none",
                      transition: "opacity 0.4s ease, box-shadow 0.3s ease, transform 0.3s ease",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        style={{
                          width: 8, height: 8, borderRadius: 999,
                          background: lit ? "var(--accent)" : "var(--border)",
                          boxShadow: lit ? "0 0 0 4px rgba(43,107,255,0.14)" : "none",
                          transition: "background 0.4s ease",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text)" }}
                      >
                        {node.label}
                      </span>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: EASE_OUT }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="mt-2 pl-[20px] text-[0.82rem] leading-[1.5]" style={{ color: "var(--text-muted)" }}>
                        {node.description}
                      </p>
                    </motion.div>
                  </div>
                  {i < FLOW_NODES.length - 1 && (
                    <div className="flex items-center justify-start" style={{ height: 20, paddingLeft: "1.55rem" }} aria-hidden="true">
                      <div
                        style={{
                          width: 2, height: "100%",
                          background: i < activeCount - 1 ? "var(--accent)" : "var(--border)",
                          opacity: i < activeCount - 1 ? 0.55 : 1,
                          transition: "background 0.4s ease",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ── 06. Business health (dashboard deep-dive) ──────────────────────────── */

function DashboardSection() {
  const [activeCallout, setActiveCallout] = useState<number | null>(null);
  return (
    <Section>
      <Container constrained={false} style={{ maxWidth: "1200px" }}>
        <RevealUp>
          <Eyebrow>{dashboardSection.eyebrow}</Eyebrow>
          <h2
            className="font-semibold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {dashboardSection.headline}
          </h2>
          <p className="mt-4 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "52ch" }}>
            {dashboardSection.body}
          </p>
        </RevealUp>

        <RevealImage delay={0.1} className="mt-10">
          <div className="relative">
            <BrowserFrame url={dashboardSection.url} wide>
              <Shot src="/work/infinity-gst/dashboard.png" alt="LedgerFlow dashboard with revenue, GST, expenses, and business health cards" />
              {dashboardSection.callouts.map((c, i) => (
                <button
                  key={c.label}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: c.left, top: c.top }}
                  onMouseEnter={() => setActiveCallout(i)}
                  onMouseLeave={() => setActiveCallout(null)}
                  onFocus={() => setActiveCallout(i)}
                  onBlur={() => setActiveCallout(null)}
                  aria-label={c.label}
                >
                  <motion.span
                    animate={{ scale: activeCallout === i ? 1.3 : [1, 1.15, 1] }}
                    transition={activeCallout === i ? { duration: 0.2 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="block rounded-full"
                    style={{
                      width: 12, height: 12, background: "var(--accent)",
                      boxShadow: "0 0 0 5px rgba(43,107,255,0.22), 0 2px 8px rgba(10,10,11,0.2)",
                    }}
                  />
                  <AnimatePresence>
                    {activeCallout === i && (
                      <motion.span
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "#fff",
                          background: "var(--text)",
                          boxShadow: "0 8px 20px rgba(10,10,11,0.3)",
                        }}
                      >
                        {c.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </BrowserFrame>
          </div>
        </RevealImage>
      </Container>
    </Section>
  );
}

/* ── 08. Cash flow ─────────────────────────────────────────────────────── */

function CashFlowSection() {
  return (
    <Section bg="surface">
      <Container constrained={false} style={{ maxWidth: "1440px" }}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14 lg:items-center">
          <RevealImage>
            <BrowserFrame url={cashFlowSection.url} wide>
              <Shot src="/work/infinity-gst/cash-flow.png" alt="LedgerFlow cash flow view — net balance, daily in/out chart, and transaction list" />
            </BrowserFrame>
          </RevealImage>

          <RevealUp delay={0.1}>
            <Eyebrow>{cashFlowSection.eyebrow}</Eyebrow>
            <h2
              className="font-semibold leading-[1.1] tracking-[-0.028em]"
              style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              {cashFlowSection.headlineTop}
              <br />
              {cashFlowSection.headlineBottom}
            </h2>
            <p className="mt-5 text-base leading-[1.6]" style={{ color: "var(--text)", maxWidth: "40ch", fontWeight: 500 }}>
              {cashFlowSection.leadLine}
            </p>
            <p className="mt-4 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "40ch" }}>
              {cashFlowSection.body}
            </p>
            <div
              className="mt-7 flex flex-col gap-2 rounded-[14px] border px-5 py-4"
              style={{ background: "var(--bg)", borderColor: "var(--border)", fontFamily: "var(--font-mono)" }}
            >
              {cashFlowSection.formula.map((line) => (
                <span key={line} className="text-[0.85rem]" style={{ color: line.startsWith("=") ? "var(--text)" : "var(--text-muted)", fontWeight: line.startsWith("=") ? 600 : 400 }}>
                  {line}
                </span>
              ))}
            </div>
          </RevealUp>
        </div>
      </Container>
    </Section>
  );
}

/* ── 08. GST — carousel ────────────────────────────────────────────────── */

function GstSection() {
  const prefersReduced = useReducedMotion();
  const { index, setIndex, setPaused } = useAutoplay(gstSection.slides.length, 5000, !prefersReduced);
  const active = gstSection.slides[index];

  usePreloadImages(gstSection.slides.map((s) => s.screenshot));

  return (
    <Section>
      <Container constrained={false} style={{ maxWidth: "1440px" }}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:items-center">
          <RevealUp>
            <Eyebrow>{gstSection.eyebrow}</Eyebrow>
            <h2
              className="font-semibold leading-[1.1] tracking-[-0.028em]"
              style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              {gstSection.headline}
            </h2>
            <p className="mt-5 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "40ch" }}>
              {gstSection.body}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              {gstSection.chain.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1.5 text-[0.78rem] font-medium"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: i === gstSection.chain.length - 1 ? "var(--accent)" : "var(--surface)",
                      color: i === gstSection.chain.length - 1 ? "#fff" : "var(--text)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {step}
                  </span>
                  {i < gstSection.chain.length - 1 && (
                    <ArrowRight size={13} strokeWidth={2} style={{ color: "var(--text-muted)", opacity: 0.5 }} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

            <p className="mt-6 text-[0.82rem] leading-[1.6]" style={{ color: "var(--text-muted)", opacity: 0.85, maxWidth: "44ch" }}>
              {gstSection.caution}
            </p>
          </RevealUp>

          <RevealUp delay={0.1}>
            <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <div className="relative">
                <BrowserFrame url={active.url} wide>
                  <StableImageTransition src={active.screenshot} alt={active.alt} aspectRatio="3350/1858" />
                </BrowserFrame>

                {gstSection.slides.length > 1 && (
                  <>
                    <button
                      onClick={() => setIndex((index - 1 + gstSection.slides.length) % gstSection.slides.length)}
                      aria-label="Previous GST screen"
                      className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
                      style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", color: "var(--text)" }}
                    >
                      <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setIndex((index + 1) % gstSection.slides.length)}
                      aria-label="Next GST screen"
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
                      style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", color: "var(--text)" }}
                    >
                      <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                  >
                    <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>
                      {active.label}
                    </h4>
                    <p className="mt-1.5 text-[0.86rem] leading-[1.55]" style={{ color: "var(--text-muted)", maxWidth: "48ch" }}>
                      {active.caption}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <div className="flex shrink-0 items-center gap-1.5 pt-1">
                  {gstSection.slides.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setIndex(i)}
                      aria-label={`Show ${s.label}`}
                      aria-current={i === index}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === index ? 18 : 7,
                        height: 7,
                        background: i === index ? "var(--accent)" : "var(--border)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </RevealUp>
        </div>
      </Container>
    </Section>
  );
}

/* ── 09. Mobile / PWA — phone carousel ───────────────────────────────── */

function MobileSection() {
  const prefersReduced = useReducedMotion();
  const { index, setIndex, setPaused } = useAutoplay(mobileSection.screens.length, 4500, !prefersReduced);
  const active = mobileSection.screens[index];

  usePreloadImages(mobileSection.screens.map((s) => s.src));

  return (
    <Section bg="surface">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-center">
          <RevealUp>
            <Eyebrow>{mobileSection.eyebrow}</Eyebrow>
            <h2
              className="font-semibold leading-[1.1] tracking-[-0.028em]"
              style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              {mobileSection.headline}
            </h2>
            <p className="mt-5 text-base leading-[1.7]" style={{ color: "var(--text-muted)", maxWidth: "42ch" }}>
              {mobileSection.body}
            </p>

            <motion.div
              animate={prefersReduced ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="mt-6 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <img
                src={mobileSection.logo}
                alt=""
                aria-hidden="true"
                style={{ width: 26, height: 26, borderRadius: 8, display: "block" }}
              />
              <Download size={12} strokeWidth={2} style={{ color: "var(--accent)" }} aria-hidden="true" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                Installed to home screen
              </span>
            </motion.div>
          </RevealUp>

          <RevealUp delay={0.1}>
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className="flex flex-col items-center gap-5"
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: "clamp(190px, 20vw, 240px)",
                  borderRadius: 34,
                  border: "7px solid var(--text)",
                  background: "var(--text)",
                  boxShadow: "0 30px 60px -22px rgba(10,10,11,0.35)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{ width: "38%", height: 16, background: "var(--text)", borderRadius: "0 0 12px 12px", zIndex: 2 }}
                />
                <StableImageTransition src={active.src} alt={active.alt} aspectRatio="1284/2778" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {mobileSection.screens.map((s, i) => {
                  const isActive = i === index;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setIndex(i)}
                      aria-current={isActive}
                      className="rounded-full px-3 py-1.5 text-[0.72rem] font-medium transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        fontFamily: "var(--font-display)",
                        background: isActive ? "var(--accent)" : "var(--bg)",
                        color: isActive ? "#fff" : "var(--text-muted)",
                        border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </RevealUp>
        </div>
      </Container>
    </Section>
  );
}

/* ── 10. Engineering ───────────────────────────────────────────────────── */

/* Small monochrome logomarks for techs without a good lucide equivalent.
 * Deliberately single-color (currentColor) — evidence, not a skills wall. */
function ReactLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.3">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

function VercelLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L22 20H2L12 3Z" fill="currentColor" />
    </svg>
  );
}

function TailwindLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 10c.8-3 2.6-4.5 5.4-4.5 3.7 0 4.3 2.8 6.1 3.2-1.9.4-2.8-1-4.5-1-1.9 0-3 .9-3.6 2.6M2.5 15.5c.8-3 2.6-4.5 5.4-4.5 3.7 0 4.3 2.8 6.1 3.2-1.9.4-2.8-1-4.5-1-1.9 0-3 .9-3.6 2.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TypeScriptLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" fontFamily="var(--font-mono, monospace)">
        TS
      </text>
    </svg>
  );
}

type LogoComponent = (props: { size?: number }) => React.JSX.Element;

const TECH_LOGO: Record<string, LogoComponent> = {
  React: ReactLogo,
  TypeScript: TypeScriptLogo,
  "Tailwind CSS v4": TailwindLogo,
  Vercel: VercelLogo,
  Vite: ({ size = 14 }) => <Zap size={size} strokeWidth={2} aria-hidden="true" />,
  Supabase: ({ size = 14 }) => <Database size={size} strokeWidth={1.8} aria-hidden="true" />,
  PostgreSQL: ({ size = 14 }) => <Database size={size} strokeWidth={1.8} aria-hidden="true" />,
  Recharts: ({ size = 14 }) => <LineChart size={size} strokeWidth={1.8} aria-hidden="true" />,
};

function BuildSection() {
  return (
    <Section>
      <Container>
        <RevealUp>
          <Eyebrow>{engineeringIntro.eyebrow}</Eyebrow>
          <h2
            className="font-semibold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {engineeringIntro.headline}
          </h2>
        </RevealUp>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buildGroups.map((g, i) => (
            <RevealUp key={g.label} delay={i * 0.05}>
              <div
                className="flex h-full flex-col rounded-[16px] border p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(10,10,11,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 16px 36px -20px rgba(43,107,255,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(10,10,11,0.04)"; }}
              >
                <p
                  className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {g.label}
                </p>
                <div className="mb-3.5 flex flex-wrap gap-2">
                  {g.items.map((item) => {
                    const Logo = TECH_LOGO[item];
                    return (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8rem]"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-mono)" }}
                      >
                        {Logo && <Logo size={13} />}
                        {item}
                      </span>
                    );
                  })}
                </div>
                <p className="mt-auto text-[0.82rem] leading-[1.55]" style={{ color: "var(--text-muted)" }}>
                  {g.description}
                </p>
              </div>
            </RevealUp>
          ))}
        </div>

        {/* Engineering thinking — the principles behind the architecture */}
        <div className="mt-14">
          <RevealUp>
            <p
              className="mb-5 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              How I thought about it
            </p>
          </RevealUp>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {engineeringPrinciples.map((p, i) => (
              <RevealUp key={p.title} delay={i * 0.05}>
                <div className="h-full rounded-[14px] border p-4" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
                  <h5 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.92rem", color: "var(--text)" }}>
                    {p.title}
                  </h5>
                  <p className="mt-1.5 text-[0.82rem] leading-[1.5]" style={{ color: "var(--text-muted)" }}>
                    {p.body}
                  </p>
                </div>
              </RevealUp>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ── 11. Product decisions ────────────────────────────────────────────── */

function DecisionsSection() {
  const prefersReduced = useReducedMotion();
  return (
    <Section bg="surface">
      <Container>
        <RevealUp>
          <Eyebrow>{decisionsIntro.eyebrow}</Eyebrow>
          <h2
            className="font-semibold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {decisionsIntro.headline}
          </h2>
        </RevealUp>
        <div className="mt-10">
          <Cards cols={2}>
            {decisions.map((d, i) => (
              <motion.div
                key={d.index}
                initial={prefersReduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.08 }}
              >
                <Card index={d.index} title={d.title} desc={d.body} />
              </motion.div>
            ))}
          </Cards>
        </div>
      </Container>
    </Section>
  );
}

/* ── 12. Closing ───────────────────────────────────────────────────────── */

function ClosingSection() {
  return (
    <Section size="lg" bg="surface">
      <Container>
        <RevealUp>
          <Eyebrow>{closing.eyebrow}</Eyebrow>
          <p
            className="mx-auto text-center"
            style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.3rem)", lineHeight: 1.7, color: "var(--text)", maxWidth: "62ch", fontFamily: "var(--font-display)", fontWeight: 450 }}
          >
            {closing.reflection}
          </p>
        </RevealUp>

        <RevealUp delay={0.1}>
          <h2
            className="mx-auto mt-14 text-center font-semibold leading-[1.1] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", fontFamily: "var(--font-display)", color: "var(--text)", maxWidth: "20ch" }}
          >
            {closing.headline}
          </h2>
        </RevealUp>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {closing.stats.map((s, i) => (
            <RevealUp key={s.label} delay={i * 0.08} className="text-center">
              <p
                className="font-semibold tracking-[-0.02em] whitespace-nowrap"
                style={{ fontSize: "clamp(1.4rem, 3.4vw, 2.75rem)", fontFamily: "var(--font-display)", color: "var(--accent)" }}
              >
                <StatValue value={s.value} />
              </p>
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {s.label}
              </p>
            </RevealUp>
          ))}
        </div>

        <RevealUp delay={0.2}>
          <p
            className="mx-auto mt-12 text-center text-base leading-[1.7]"
            style={{ color: "var(--text-muted)", maxWidth: "52ch" }}
          >
            {closing.body}
          </p>
        </RevealUp>

        <RevealUp delay={0.28}>
          <div className="mt-14 flex flex-col items-center gap-8 text-center">
            <h3
              className="font-semibold tracking-[-0.03em]"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              {closing.ctaHeadline}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={closing.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--accent)", color: "#fff", fontFamily: "var(--font-display)", textDecoration: "none" }}
              >
                {closing.liveLabel}
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-[var(--bg)]"
                style={{ borderColor: "var(--border)", color: "var(--text)", fontFamily: "var(--font-display)", textDecoration: "none" }}
              >
                Back to all work
              </Link>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--text)]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", textDecoration: "none" }}
            >
              Want to see how it was built? Contact
              <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </RevealUp>
      </Container>
    </Section>
  );
}

/* ── Assembly ─────────────────────────────────────────────────────────── */

export function LedgerFlowCaseStudy() {
  return (
    <article>
      <ScrollProgressBar />
      <Hero />
      <ProblemSection />
      <IdeaExplorer />
      <ProductExplorerSection />
      <SystemFlowSection />
      <DashboardSection />
      <CashFlowSection />
      <GstSection />
      <MobileSection />
      <BuildSection />
      <DecisionsSection />
      <ClosingSection />
    </article>
  );
}
