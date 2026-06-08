"use client";

/**
 * Hero — Phase 4 (scene pass).
 *
 * Layout: section fills 100svh (flex column). Container holds:
 *   - Grid (flex:1) — left text col (36%) | right orbital scene (64%)
 *   - Stats bar (flex-shrink:0) — pinned at the bottom within the viewport
 *
 * Character image: /public/character.png (1024×1536, 2:3 portrait).
 */

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Sparkles, Pen, Code2, Play, Clapperboard,
  Zap, BookOpen, Rocket, Target,
  ArrowUpRight, ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui";
import { hero, characterSrc, skillCards, statsBar } from "@/content/hero";
import type { SkillCard, StatItem, SkillCardIcon, StatIcon } from "@/content/hero";

// ─── Icon registries ───────────────────────────────────────────────────────────
const CARD_ICONS: Record<SkillCardIcon, LucideIcon> = {
  Sparkles, Pen, Code2, Play, Clapperboard,
};
const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  Zap, BookOpen, Rocket, Target, Sparkles,
};

// ─── Scene geometry ────────────────────────────────────────────────────────────
const VB = 560; // SVG viewBox is 0 0 560 560 (square)
const CX = 280;
const CY = 280;

// Character at 68% — the main-character reveal; larger for hero presence
const CHAR_W_PCT = "68%";
// Cards at 31% — sized to sit on the orbit arcs around the character
const CARD_W_PCT = "33.5%";

// Orbit nodes ride the wide ellipse, sitting near each card's inner edge.
const ORBIT_NODES = [
  { id: "ai-tools", svgX: 280, svgY: 96,  color: "#2563EB" }, // top-center
  { id: "ui-ux",    svgX: 86,  svgY: 196, color: "#8B5CF6" }, // left-upper
  { id: "web-dev",  svgX: 498, svgY: 256, color: "#059669" }, // right-mid
  { id: "content",  svgX: 96,  svgY: 396, color: "#D97706" }, // left-lower
  { id: "vfx",      svgX: 470, svgY: 430, color: "#E11D48" }, // right-lower
] as const;

// Curved constellation ring linking all five nodes around the wide ellipse.
const NODE_RING =
  "M 86 196 Q 180 120 280 96 Q 400 124 498 256 Q 500 340 470 430 " +
  "Q 300 470 96 396 Q 60 290 86 196 Z";

// Wide horizontal orbit ellipses encircling the whole scene (matches ref).
// Path form: M (cx-rx),cy a rx,ry 0 1,0 (2rx),0 a rx,ry 0 1,0 -(2rx),0
const ORBIT_PATHS = [
  {
    id: "orbit-outer", rotate: -10,
    d: `M -10,280 a 290,172 0 1,0 580,0 a 290,172 0 1,0 -580,0`,
    stroke: "#A9A9BE", width: 1.2, dash: "6 7", opacity: 0.62,
    ball: { color: "#2563EB", coreR: 3.0, haloR: 7, dur: 30, delay: 0,  reverse: false },
  },
  {
    id: "orbit-mid", rotate: 8,
    d: `M 56,280 a 224,130 0 1,0 448,0 a 224,130 0 1,0 -448,0`,
    stroke: "#AEAEC4", width: 1.05, dash: "5 7", opacity: 0.5,
    ball: { color: "#8B5CF6", coreR: 2.6, haloR: 6, dur: 22, delay: 6,  reverse: true },
  },
  {
    id: "orbit-inner", rotate: -18,
    d: `M 124,280 a 156,86 0 1,0 312,0 a 156,86 0 1,0 -312,0`,
    stroke: "#B2B2C6", width: 0.9, dash: "4 6", opacity: 0.42,
    ball: { color: "#059669", coreR: 2.4, haloR: 5, dur: 15, delay: 3,  reverse: false },
  },
] as const;

// Drifting background particles
const PARTICLES = [
  { id: "pa", x: "11%", y: "16%", r: 2.5, op: 0.28, dur: 5.2 },
  { id: "pb", x: "83%", y: "11%", r: 2.0, op: 0.20, dur: 6.8 },
  { id: "pc", x: "89%", y: "73%", r: 3.0, op: 0.25, dur: 7.3 },
  { id: "pd", x:  "7%", y: "79%", r: 2.5, op: 0.22, dur: 5.7 },
  { id: "pe", x: "53%", y:  "4%", r: 1.8, op: 0.18, dur: 8.1 },
  { id: "pf", x: "97%", y: "45%", r: 2.0, op: 0.16, dur: 6.2 },
] as const;

// Hand-drawn doodle elements scattered in the scene margins (Gen-Z accent).
// PNGs are black on transparent — rendered at low opacity for a sketched feel.
const DOODLES = [
  { src: "/elements/paper-airplane.png", size: 26, rotate:  -8, opacity: 0.22, float: { y: 9, dur: 6.5 }, pos: { top: "13%", left: "26%" } },
  { src: "/elements/doodle-stars.png",   size: 24, rotate:   5, opacity: 0.20, float: { y: 7, dur: 5.4 }, pos: { top:  "5%", left: "48%" } },
  { src: "/elements/star.png",           size: 20, rotate:  10, opacity: 0.18, float: { y: 8, dur: 7.1 }, pos: { top: "23%", right: "6%" } },
  { src: "/elements/doodle-stars.png",   size: 16, rotate: -12, opacity: 0.16, float: { y: 6, dur: 6.0 }, pos: { top: "57%", left:  "2%" } },
  { src: "/elements/paper-airplane.png", size: 20, rotate: 162, opacity: 0.20, float: { y: 8, dur: 6.8 }, pos: { bottom: "31%", right: "4%" } },
  { src: "/elements/star.png",           size: 17, rotate:  -6, opacity: 0.17, float: { y: 7, dur: 5.8 }, pos: { bottom: "5%", left: "31%" } },
] as const;

/* ─── Viewport-wide parallax tilt ────────────────────────────────────────── */
/* ─── Parallax depth shift (2D-safe, opposite-mouse drift) ───────────────── */
function ParallaxDepth({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const mouse  = useRef({ x: 0, y: 0 });
  const lerped = useRef({ x: 0, y: 0 });
  const raf    = useRef<number>(0);

  useEffect(() => {
    if (disabled) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      const LERP = 0.055;
      lerped.current.x += (mouse.current.x - lerped.current.x) * LERP;
      lerped.current.y += (mouse.current.y - lerped.current.y) * LERP;
      const el = ref.current;
      if (el) {
        // Opposite direction → character appears on a deeper layer than cards
        el.style.transform = `translate(${-lerped.current.x * 14}px, ${-lerped.current.y * 8}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [disabled]);

  return (
    <div ref={ref} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/* ─── Orbit rings + nodes SVG ─────────────────────────────────────────────── */
function OrbitalSVG({
  activeCardId,
  prefersReduced,
}: {
  activeCardId: string | null;
  prefersReduced: boolean | null;
}) {
  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="55%" r="55%">
          <stop offset="0%"   stopColor="#8B5CF6" stopOpacity="0.16" />
          <stop offset="40%"  stopColor="#A78BFA" stopOpacity="0.10" />
          <stop offset="70%"  stopColor="#F0ABFC" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        {/* Soft glow for the traveling orbit balls */}
        <filter id="ballGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Multi-color gradient for the constellation ring (node colors) */}
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8B5CF6" />
          <stop offset="28%"  stopColor="#2563EB" />
          <stop offset="55%"  stopColor="#059669" />
          <stop offset="80%"  stopColor="#E11D48" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Background radial glow */}
      <circle cx={CX} cy={CY} r={255} fill="url(#heroGlow)" opacity={1} />

      {/* Tilted orbit rings + their traveling glow-balls.
          Path and ball share one rotated group, so the ball rides the
          visible tilted ellipse (mpath uses the path's local geometry). */}
      {ORBIT_PATHS.map((o) => (
        <g key={o.id} transform={`rotate(${o.rotate} ${CX} ${CY})`}>
          <motion.path
            id={o.id}
            d={o.d}
            fill="none"
            stroke={o.stroke}
            strokeWidth={o.width}
            strokeDasharray={o.dash}
            opacity={o.opacity}
            animate={!prefersReduced ? { strokeDashoffset: o.ball.reverse ? [0, 240] : [0, -240] } : {}}
            transition={{ duration: o.ball.dur, repeat: Infinity, ease: "linear" }}
          />
          {/* outer soft halo */}
          <circle r={o.ball.haloR} fill={o.ball.color} opacity={0.22} filter="url(#ballGlow)">
            {!prefersReduced && (
              <animateMotion
                dur={`${o.ball.dur}s`}
                begin={`-${o.ball.delay}s`}
                repeatCount="indefinite"
                rotate="auto"
                keyPoints={o.ball.reverse ? "1;0" : "0;1"}
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath href={`#${o.id}`} />
              </animateMotion>
            )}
          </circle>
          {/* bright core */}
          <circle r={o.ball.coreR} fill={o.ball.color} opacity={0.95} filter="url(#ballGlow)">
            {!prefersReduced && (
              <animateMotion
                dur={`${o.ball.dur}s`}
                begin={`-${o.ball.delay}s`}
                repeatCount="indefinite"
                rotate="auto"
                keyPoints={o.ball.reverse ? "1;0" : "0;1"}
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath href={`#${o.id}`} />
              </animateMotion>
            )}
          </circle>
        </g>
      ))}

      {/* Constellation ring — curved network linking the colored nodes,
          with a slow flowing dash (energy moving through the system) */}
      <motion.path
        d={NODE_RING}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={1.2}
        strokeDasharray="5 9"
        opacity={0.5}
        strokeLinecap="round"
        animate={!prefersReduced ? { strokeDashoffset: [0, -28] } : {}}
        transition={{ duration: 3.0, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbit nodes — colored pulsing halos */}
      {ORBIT_NODES.map((n) => {
        const on = activeCardId === n.id;
        return (
          <g key={`node-${n.id}`}>
            {/* Outer diffuse glow */}
            <motion.circle
              cx={n.svgX} cy={n.svgY} r={24}
              style={{ fill: n.color }}
              animate={!prefersReduced
                ? { opacity: on ? [0.26, 0.42, 0.26] : [0.12, 0.22, 0.12] }
                : { opacity: on ? 0.26 : 0.12 }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
            />
            {/* Inner halo */}
            <motion.circle
              cx={n.svgX} cy={n.svgY} r={13}
              style={{ fill: n.color }}
              animate={!prefersReduced
                ? { opacity: on ? [0.40, 0.60, 0.40] : [0.20, 0.34, 0.20] }
                : { opacity: on ? 0.40 : 0.20 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatType: "loop", delay: 0.35 }}
            />
            {/* Core dot — pulses scale slightly */}
            <motion.circle
              cx={n.svgX} cy={n.svgY} r={6.5}
              fill={n.color}
              opacity={on ? 1 : 0.92}
              animate={!prefersReduced
                ? { scale: on ? [1, 1.25, 1] : [1, 1.1, 1] }
                : {}}
              transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
              style={{ transformOrigin: `${n.svgX}px ${n.svgY}px`, transition: "opacity 0.4s ease" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Glass capability card ───────────────────────────────────────────────── */
function GlassCard({
  card,
  prefersReduced,
  onHover,
  onLeave,
}: {
  card: SkillCard;
  prefersReduced: boolean | null;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  const Icon    = CARD_ICONS[card.icon];
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → +0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transition = "transform 0.08s ease";
    el.style.transform  = `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 12}deg) scale(1.03)`;
  };

  const handleMouseEnter = () => {
    onHover(card.id);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (el) {
      el.style.transition = "transform 0.55s cubic-bezier(0.23,1,0.32,1)";
      el.style.transform  = "perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)";
    }
    onLeave();
  };

  return (
    <motion.div
      animate={!prefersReduced ? { y: [0, -card.float.y, 0] } : {}}
      transition={{ duration: card.float.duration, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background:           `linear-gradient(145deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.70) 50%, ${card.color}22 100%)`,
          backdropFilter:       "blur(28px) saturate(170%)",
          WebkitBackdropFilter: "blur(28px) saturate(170%)",
          border:               `1px solid ${card.color}26`,
          boxShadow:            `0 10px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), 0 0 22px ${card.color}1A, inset 0 1px 0 rgba(255,255,255,0.95)`,
          borderRadius:         "18px",
          padding:              "1.05rem 1.15rem",
          minHeight:            "118px",
          boxSizing:            "border-box",
          display:              "flex",
          flexDirection:        "column",
          justifyContent:       "center",
          gap:                  "0.55rem",
          cursor:               "default",
          willChange:           "transform",
          transformStyle:       "preserve-3d",
        }}
      >
        {/* Top row: large icon + title/badge column */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{
            width: 42, height: 42, borderRadius: "12px", flexShrink: 0,
            background: `linear-gradient(135deg, ${card.color}33 0%, ${card.color}1A 100%)`,
            border: `1px solid ${card.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 3px 10px ${card.color}24`,
          }}>
            <Icon size={19} strokeWidth={2} style={{ color: card.color }} aria-hidden="true" />
          </div>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "0.8rem", color: "var(--text)", lineHeight: 1.2, whiteSpace: "normal",
          }}>
            {card.title}
          </span>
        </div>

        {/* Description */}
        <p style={{ fontSize: "0.68rem", lineHeight: 1.55, color: "var(--text-muted)", margin: 0 }}>
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Desktop orbital scene ───────────────────────────────────────────────── */
function OrbitalScene({ prefersReduced }: { prefersReduced: boolean | null }) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  return (
    <div
      style={{
        position:    "relative",
        width:       "100%",
        maxWidth:    "580px",
        aspectRatio: "1",
        overflow:    "visible",
        margin:      "0 auto",
      }}
    >
      {/* SVG layer — orbit rings, connector lines, colored orbit nodes */}
      <OrbitalSVG activeCardId={activeCardId} prefersReduced={prefersReduced} />

      {/* Large diffuse radial glow behind the character — purple/blue, pulsing */}
      <motion.div
        aria-hidden="true"
        animate={!prefersReduced ? { opacity: [0.8, 1, 0.8], scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position:     "absolute",
          left:         "50%",
          top:          "45%",
          transform:    "translate(-50%, -50%)",
          width:        "80%",
          height:       "84%",
          background:   "radial-gradient(circle, rgba(168,130,255,0.22) 0%, rgba(96,130,255,0.12) 45%, transparent 72%)",
          borderRadius: "50%",
          zIndex:       1,
          pointerEvents: "none",
          filter:       "blur(26px)",
        }}
      />

      {/* Platform ambient glow — soft blue/purple pool beneath the feet */}
      <div
        aria-hidden="true"
        style={{
          position:     "absolute",
          left:         "50%",
          top:          "85%",
          transform:    "translate(-50%, -50%)",
          width:        "64%",
          height:       "100px",
          background:   "radial-gradient(ellipse at center, rgba(110,110,255,0.42) 0%, rgba(180,130,255,0.22) 50%, transparent 76%)",
          borderRadius: "50%",
          zIndex:       1,
          pointerEvents: "none",
          filter:       "blur(20px)",
        }}
      />

      {/* Character — pushed behind the cards (z:2); sits slightly lower for balance */}
      <div
        style={{
          position:  "absolute",
          left:      "50%",
          top:       "53%",
          transform: "translate(-50%, -50%)",
          width:     CHAR_W_PCT,
          zIndex:    2,
        }}
      >
        <ParallaxDepth disabled={!!prefersReduced}>
          <motion.div
            animate={!prefersReduced ? { y: [-5, 5, -5] } : {}}
            transition={{ duration: 6.0, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
          >
            <Image
              src={characterSrc}
              alt="Rahul — 3D character"
              width={1024}
              height={1536}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>
        </ParallaxDepth>
      </div>


      {/* Drifting particles */}
      {!prefersReduced && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              animate={{ y: [0, -8, 0], opacity: [p.op, p.op * 0.5, p.op] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
              style={{
                position: "absolute", left: p.x, top: p.y,
                width: p.r * 2, height: p.r * 2,
                borderRadius: "50%", background: "var(--text-muted)", opacity: p.op,
              }}
            />
          ))}
        </div>
      )}

      {/* Hand-drawn doodle PNGs — scattered margin accents */}
      {DOODLES.map((d, i) => (
        <motion.div
          key={`doodle-${i}`}
          aria-hidden="true"
          animate={!prefersReduced ? { y: [0, -d.float.y, 0] } : {}}
          transition={{ duration: d.float.dur, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
          style={{
            position: "absolute", zIndex: 1, pointerEvents: "none",
            opacity: d.opacity, rotate: d.rotate, ...d.pos,
          }}
        >
          <Image src={d.src} alt="" width={d.size} height={d.size}
            style={{ width: d.size, height: d.size, display: "block" }} />
        </motion.div>
      ))}

      {/* Glass cards — orbit the character. Most sit in front (z:3); the
         top-center "AI & Tools" card drops behind the character (z:1) so it
         doesn't clip the hair. */}
      {skillCards.map((card) => (
        <div
          key={card.id}
          style={{ position: "absolute", width: CARD_W_PCT, zIndex: card.id === "ai-tools" ? 1 : 3, ...card.pos }}
        >
          <GlassCard
            card={card}
            prefersReduced={prefersReduced}
            onHover={setActiveCardId}
            onLeave={() => setActiveCardId(null)}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Mobile cards ────────────────────────────────────────────────────────── */
function MobileCards({ prefersReduced }: { prefersReduced: boolean | null }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 w-full">
      {skillCards
        .filter((c) => c.showOnMobile)
        .map((card) => (
          <div key={card.id} style={{ width: "calc(50% - 0.375rem)", minWidth: 130, maxWidth: 190 }}>
            <GlassCard card={card} prefersReduced={prefersReduced} onHover={() => {}} onLeave={() => {}} />
          </div>
        ))}
    </div>
  );
}

/* ─── Stats bar ───────────────────────────────────────────────────────────── */
function HeroStatsBar({ prefersReduced }: { prefersReduced: boolean | null }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const cols = isMobile ? 2 : 4;

  return (
    <motion.div
      initial={!prefersReduced ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        display:              "grid",
        gridTemplateColumns:  `repeat(${cols}, 1fr)`,
        background:           "rgba(255,255,255,0.64)",
        backdropFilter:       "blur(24px) saturate(165%)",
        WebkitBackdropFilter: "blur(24px) saturate(165%)",
        border:               "1px solid rgba(255,255,255,0.6)",
        boxShadow:            "0 8px 30px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
        borderRadius:         "var(--radius-xl)",
        overflow:             "hidden",
      }}
    >
      {(statsBar as readonly StatItem[]).map((stat, i) => {
        const Icon = STAT_ICONS[stat.icon];
        const isLastInRow = (i + 1) % cols === 0;
        const isInSecondRow = i >= cols;
        return (
          <div
            key={stat.icon}
            style={{
              display:     "flex",
              alignItems:  "center",
              gap:         "0.65rem",
              padding:     "0.72rem 1.1rem",
              borderRight: !isLastInRow ? "1px solid var(--border)" : "none",
              borderTop:   isInSecondRow ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: "var(--radius-md)",
              background: `${stat.color}18`, border: `1px solid ${stat.color}28`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon size={16} strokeWidth={1.8} style={{ color: stat.color }} aria-hidden="true" />
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(0.95rem, 1.1vw, 1.25rem)",
                color: "var(--text)", lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "0.65rem",
                color: "var(--text-muted)", marginTop: "0.18rem", letterSpacing: "0.04em",
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ─── Stagger animation constants ─────────────────────────────────────────── */
const STAGGER = {
  container: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
  },
  item: {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
};

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
export function Hero() {
  const prefersReduced = useReducedMotion();

  const handleNavigate = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: prefersReduced ? "instant" : "smooth" });
  };

  return (
    /*
     * section = 100svh, flex-column.
     * Container fills it (flex:1).
     * Grid (flex:1) + stats bar (flex-shrink:0) together fill the Container.
     * This pins the stats bar at the bottom of the viewport with no scroll needed.
     */
    <section
      id="hero"
      className="min-h-[100svh] lg:h-[100svh]"
      style={{
        display:         "flex",
        flexDirection:   "column",
        backgroundColor: "var(--bg)",
        overflowX:       "clip",
      }}
    >
      <Container style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* ── Two-column grid — right column is wider (64%) for the scene ──── */}
        <div
          className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[36%_64%] lg:gap-10"
          style={{ flex: 1, minHeight: 0 }}
        >
          {/* ── Left column: text ─────────────────────────────────────────────── */}
          <div className="flex flex-col justify-center py-8 lg:py-0">
            <motion.div
              variants={STAGGER.container}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4"
              style={{ maxWidth: "520px" }}
            >
              {/* Pill eyebrow */}
              <motion.div variants={STAGGER.item}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.28em 0.8em", borderRadius: "999px",
                  border: "1px solid rgba(37,99,235,0.22)",
                  background: "rgba(37,99,235,0.06)",
                }}>
                  <Sparkles size={11} strokeWidth={2} style={{ color: "var(--accent)" }} aria-hidden="true" />
                  <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "var(--accent)",
                  }}>
                    The Product Builder
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={STAGGER.item}
                style={{
                  fontSize:      "clamp(2.25rem, 3.8vw, 3.5rem)",
                  fontFamily:    "var(--font-display)",
                  fontWeight:    600,
                  lineHeight:    0.98,
                  letterSpacing: "-0.028em",
                  color:         "var(--text)",
                  margin:        0,
                }}
              >
                <span style={{ display: "block", color: "var(--text-muted)", fontWeight: 500 }}>
                  Most products break between
                </span>
                <span style={{ display: "block", color: "var(--text-muted)", fontWeight: 500 }}>
                  idea and execution.
                </span>
                <span style={{ display: "block", marginTop: "0.06em" }}>
                  {"I build "}
                  <span style={{ position: "relative", display: "inline-block" }}>
                    <span style={{ color: "var(--accent)" }}>across</span>
                    <svg
                      width="100%" height="6" viewBox="0 0 60 6"
                      preserveAspectRatio="none" aria-hidden="true"
                      style={{ position: "absolute", bottom: "-2px", left: 0, overflow: "visible" }}
                    >
                      <path d="M0 4 Q15 1 30 4 Q45 7 60 4"
                        stroke="var(--accent)" strokeWidth="1.5" fill="none"
                        opacity="0.65" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span style={{ color: "var(--accent)" }}>{" that gap."}</span>
                </span>
              </motion.h1>

              {/* Subline — handwritten, "love" underlined */}
              <motion.p
                variants={STAGGER.item}
                style={{
                  fontFamily: "var(--font-caveat)", fontSize: "1.4rem", lineHeight: 1.5,
                  color: "var(--text-muted)", maxWidth: "30ch", margin: 0,
                }}
              >
                {"Turning messy ideas into real products people use, pay for, and "}
                <span style={{ position: "relative", display: "inline" }}>
                  <span style={{ color: "var(--text)" }}>love</span>
                  <svg
                    width="100%" height="5" viewBox="0 0 40 5"
                    preserveAspectRatio="none" aria-hidden="true"
                    style={{ position: "absolute", bottom: "-3px", left: 0, overflow: "visible" }}
                  >
                    <path d="M0 3 Q20 0 40 3"
                      stroke="var(--accent)" strokeWidth="1.4" fill="none"
                      opacity="0.6" strokeLinecap="round" />
                  </svg>
                </span>
                {"."}
              </motion.p>

              {/* Capability row */}
              <motion.p
                variants={STAGGER.item}
                style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-display)", margin: 0 }}
              >
                Product Thinking&nbsp;&nbsp;•&nbsp;&nbsp;Design&nbsp;&nbsp;•&nbsp;&nbsp;Engineering&nbsp;&nbsp;•&nbsp;&nbsp;AI&nbsp;&nbsp;•&nbsp;&nbsp;Growth
              </motion.p>

              {/* CTA row */}
              <motion.div variants={STAGGER.item} className="flex flex-wrap items-center gap-3">
                <a
                  href={hero.ctas.primary.href}
                  onClick={(e) => { e.preventDefault(); handleNavigate(hero.ctas.primary.href); }}
                  className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: "var(--text)", color: "var(--bg)",
                    fontFamily: "var(--font-display)", minHeight: "44px", textDecoration: "none",
                  }}
                >
                  {hero.ctas.primary.label}
                  <ArrowUpRight size={14} strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true" />
                </a>

                <a
                  href={hero.ctas.secondary.href}
                  onClick={(e) => { e.preventDefault(); handleNavigate(hero.ctas.secondary.href); }}
                  className="group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 hover:border-[var(--text)] hover:text-[var(--text)]"
                  style={{
                    borderColor: "var(--border)", color: "var(--text-muted)",
                    fontFamily: "var(--font-display)", minHeight: "44px", textDecoration: "none",
                  }}
                >
                  {hero.ctas.secondary.label}
                  <ArrowRight size={13} strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true" />
                </a>
              </motion.div>

              {/* Scroll indicator — mouse glyph */}
              <motion.div variants={STAGGER.item} className="flex items-center gap-2.5 pt-1" aria-hidden="true">
                <svg width="15" height="22" viewBox="0 0 15 22" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="13" height="20" rx="6.5"
                    stroke="var(--text-muted)" strokeWidth="1.4" />
                  <motion.line
                    x1="7.5" y1="5.5" x2="7.5" y2="9"
                    stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round"
                    animate={!prefersReduced ? { y: [0, 3, 0], opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 600,
                  letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)",
                }}>
                  Scroll Down
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Right column: scene + stats bar at its bottom (ref layout) ──── */}
          <motion.div
            className="relative flex flex-col"
            style={{ alignSelf: "stretch", minHeight: 0 }}
            initial={!prefersReduced ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Desktop: full orbital scene — fills available height, centered */}
            <div className="hidden lg:flex flex-1 w-full items-center justify-center" style={{ minHeight: 0 }}>
              <OrbitalScene prefersReduced={prefersReduced} />
            </div>

            {/* Mobile: character + 3 cards stacked */}
            <div className="flex flex-col items-center gap-5 pb-6 w-full lg:hidden">
              <div style={{ width: "52%", maxWidth: "200px" }}>
                <Image
                  src={characterSrc}
                  alt="Rahul — 3D character"
                  width={1024}
                  height={1536}
                  priority
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <MobileCards prefersReduced={prefersReduced} />
            </div>

            {/* Stats bar — lifted up so it sits parallel with the left
                "Scroll Down"; soft shadow overlay grounds it below */}
            <div className="w-full" style={{ flexShrink: 0, paddingBottom: "clamp(2.5rem, 7vh, 5.5rem)" }}>
              <HeroStatsBar prefersReduced={prefersReduced} />
              {/* Soft ground-shadow overlay beneath the bar */}
              <div aria-hidden="true" style={{
                width: "68%", height: "26px", margin: "12px auto 0",
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.13) 0%, transparent 72%)",
                filter: "blur(8px)", pointerEvents: "none",
              }} />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
