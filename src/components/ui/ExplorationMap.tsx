"use client";

/**
 * ExplorationMap — Phase 4 orbital "What's Next" interactive map.
 *
 * Architecture: hybrid SVG + HTML overlay.
 *  • SVG layer   → orbit rings (slowly rotating), glow circles, connecting lines,
 *                  center node, SVG labels, annotation notes + arrows.
 *  • HTML overlay → interactive icon buttons (positioned via CSS %).
 *
 * CRITICAL positioning rule:
 *   Plain <g transform="translate(x,y)"> for position — never motion.g with
 *   translate, because motion's CSS transform overrides SVG presentation attributes.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  Clapperboard,
  Layers,
  Scan,
  type LucideIcon,
} from "lucide-react";
import { mapNodes } from "@/content/lab";
import type { MapNode } from "@/content/lab";

// ─── SVG layout constants ──────────────────────────────────────────────────────
const VB_W    = 700;
const VB_H    = 460;
const CX      = 350;
const CY      = 230;
const RADIUS  = 120;
const NODE_PX = 38; // HTML button diameter (CSS px)

const AUTOPLAY_INTERVAL = 4000;

// ─── Icon registry ─────────────────────────────────────────────────────────────
const ICONS: Record<MapNode["icon"], LucideIcon> = {
  sparkles:     Sparkles,
  "trending-up": TrendingUp,
  clapperboard: Clapperboard,
  layers:       Layers,
  scan:         Scan,
};

// ─── Radial placement ──────────────────────────────────────────────────────────
type LabelDir = "above" | "right" | "below" | "left";

interface PlacedNode extends MapNode {
  angleDeg: number;
  svgX: number;
  svgY: number;
  pctLeft: string;
  pctTop: string;
  labelDir: LabelDir;
}

function computePlaced(): PlacedNode[] {
  return mapNodes.map((node, i) => {
    const angleDeg = -90 + i * (360 / mapNodes.length);
    const rad = (angleDeg * Math.PI) / 180;
    const svgX = CX + RADIUS * Math.cos(rad);
    const svgY = CY + RADIUS * Math.sin(rad);

    // Extended "below" covers 45°–225° so Interactive Design (198°) labels below
    let labelDir: LabelDir;
    if (angleDeg >= -135 && angleDeg < -45)    labelDir = "above";
    else if (angleDeg >= -45 && angleDeg < 45) labelDir = "right";
    else if (angleDeg >= 45 && angleDeg < 225) labelDir = "below";
    else                                        labelDir = "left";

    return {
      ...node,
      angleDeg,
      svgX,
      svgY,
      pctLeft: `${(svgX / VB_W) * 100}%`,
      pctTop:  `${(svgY / VB_H) * 100}%`,
      labelDir,
    };
  });
}

const placed = computePlaced();

// ─── Label offset helper ───────────────────────────────────────────────────────
// LABEL_OFFSET is in SVG user units — how far from node center the text sits
const LABEL_OFFSET = 26;

function svgLabelAttrs(node: PlacedNode): { x: number; y: number; textAnchor: "start" | "middle" | "end" } {
  switch (node.labelDir) {
    case "above": return { x: node.svgX,                  y: node.svgY - LABEL_OFFSET, textAnchor: "middle" };
    case "right": return { x: node.svgX + LABEL_OFFSET,   y: node.svgY,               textAnchor: "start"  };
    case "below": return { x: node.svgX,                  y: node.svgY + LABEL_OFFSET, textAnchor: "middle" };
    case "left":  return { x: node.svgX - LABEL_OFFSET,   y: node.svgY,               textAnchor: "end"    };
  }
}

// ─── Status badge (inside dark info card) ─────────────────────────────────────
function StatusBadge({ status, color }: { status: MapNode["status"]; color: string }) {
  const isActive = status === "Active";
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.6rem",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "0.18em 0.6em",
        borderRadius: "999px",
        background: isActive ? `${color}33` : "rgba(255,255,255,0.08)",
        color:      isActive ? color        : "rgba(250,250,247,0.5)",
        flexShrink: 0,
        border: isActive ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {status}
    </span>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function ExplorationMap() {
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(mapNodes[0].id);
  const [isUserControlled, setIsUserControlled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect mobile for annotation visibility
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Clear active highlight when reduced-motion is set
  useEffect(() => {
    if (prefersReduced) {
      setActiveId(null);
      setIsUserControlled(false);
    }
  }, [prefersReduced]);

  // Autoplay cycle
  useEffect(() => {
    if (prefersReduced || isUserControlled) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setActiveId((prev) => {
        const idx = prev ? mapNodes.findIndex((n) => n.id === prev) : -1;
        return mapNodes[(idx + 1) % mapNodes.length].id;
      });
    }, AUTOPLAY_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [prefersReduced, isUserControlled]);

  const handleActivate = (id: string) => { setIsUserControlled(true); setActiveId(id); };
  const handleDeactivate = () => setIsUserControlled(false);

  const activeNode = placed.find((n) => n.id === activeId) ?? null;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* ── Orbital map wrapper ────────────────────────────────────────────────── */}
      <div
        style={{ position: "relative", width: "100%", aspectRatio: `${VB_W} / ${VB_H}` }}
        role="img"
        aria-label="Orbital exploration map showing Rahul's current areas of focus"
      >
        {/* ── SVG layer ────────────────────────────────────────────────────────── */}
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          aria-hidden="true"
        >
          <defs>
            {/* Center node radial gradient */}
            <radialGradient id="em-center-grad" cx="50%" cy="35%" r="60%">
              <stop offset="0%"   stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </radialGradient>

            {/* Arrowhead marker */}
            <marker
              id="em-arrow"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(150,150,160,0.5)" />
            </marker>
          </defs>

          {/* Slowly rotating orbit rings group */}
          {!prefersReduced && (
            <motion.g
              style={{ transformOrigin: `${CX}px ${CY}px` }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
            >
              <ellipse
                cx={CX} cy={CY}
                rx={RADIUS * 1.35} ry={RADIUS * 0.62}
                transform={`rotate(-22 ${CX} ${CY})`}
                fill="none" stroke="var(--border)"
                strokeWidth={0.6} strokeDasharray="3 8"
                opacity={0.3}
              />
              <ellipse
                cx={CX} cy={CY}
                rx={RADIUS * 0.88} ry={RADIUS * 0.46}
                transform={`rotate(16 ${CX} ${CY})`}
                fill="none" stroke="var(--border)"
                strokeWidth={0.45} strokeDasharray="2 6"
                opacity={0.18}
              />
            </motion.g>
          )}
          {/* Static fallback rings for reduced-motion */}
          {prefersReduced && (
            <g>
              <ellipse
                cx={CX} cy={CY}
                rx={RADIUS * 1.35} ry={RADIUS * 0.62}
                transform={`rotate(-22 ${CX} ${CY})`}
                fill="none" stroke="var(--border)"
                strokeWidth={0.6} strokeDasharray="3 8"
                opacity={0.3}
              />
              <ellipse
                cx={CX} cy={CY}
                rx={RADIUS * 0.88} ry={RADIUS * 0.46}
                transform={`rotate(16 ${CX} ${CY})`}
                fill="none" stroke="var(--border)"
                strokeWidth={0.45} strokeDasharray="2 6"
                opacity={0.18}
              />
            </g>
          )}

          {/* Main dashed orbit circle */}
          <circle
            cx={CX} cy={CY} r={RADIUS}
            fill="none" stroke="var(--border)"
            strokeWidth={0.7} strokeDasharray="2.5 7"
            opacity={0.35}
          />

          {/* Tiny decorative particles on orbit */}
          {placed.map((node) => {
            const particleAngle = ((node.angleDeg + 36) * Math.PI) / 180;
            const px = CX + RADIUS * Math.cos(particleAngle);
            const py = CY + RADIUS * Math.sin(particleAngle);
            return (
              <circle
                key={`particle-${node.id}`}
                cx={px} cy={py} r={1.8}
                fill={node.color}
                opacity={0.45}
              />
            );
          })}

          {/* Connecting lines: center → outer node */}
          {placed.map((node) => {
            const isActive = node.id === activeId;
            return (
              <line
                key={`line-${node.id}`}
                x1={CX} y1={CY}
                x2={node.svgX} y2={node.svgY}
                style={{
                  stroke:      isActive ? node.color : "var(--border)",
                  strokeWidth: isActive ? 1.2 : 0.7,
                  opacity:     isActive ? 0.5 : 0.2,
                  transition:  "stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease",
                }}
              />
            );
          })}

          {/* Outer node glow circles (SVG only, behind HTML buttons) */}
          {placed.map((node) => {
            const isActive = node.id === activeId;
            return (
              <g key={`glow-${node.id}`}>
                {/* Large soft glow */}
                <circle
                  cx={node.svgX} cy={node.svgY} r={26}
                  fill={node.color}
                  opacity={isActive ? 0.12 : 0}
                  style={{ transition: "opacity 0.35s ease" }}
                />
                {/* Medium ring glow */}
                <circle
                  cx={node.svgX} cy={node.svgY} r={20}
                  fill={node.color}
                  opacity={isActive ? 0.08 : 0}
                  style={{ transition: "opacity 0.35s ease" }}
                />
              </g>
            );
          })}

          {/* Center node */}
          {/* Outer glow rings */}
          <circle cx={CX} cy={CY} r={42} fill="#3B82F6" opacity={0.06} />
          <circle cx={CX} cy={CY} r={32} fill="#3B82F6" opacity={0.09} />
          {/* Filled circle with gradient */}
          <circle cx={CX} cy={CY} r={22} fill="url(#em-center-grad)" />
          {/* RAHUL label */}
          <text
            x={CX} y={CY}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fill: "#FAFAF7",
              fontSize: "7px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.14em",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            RAHUL
          </text>

          {/* SVG labels for outer nodes */}
          {placed.map((node) => {
            const isActive = node.id === activeId;
            const attrs = svgLabelAttrs(node);
            return (
              <text
                key={`label-${node.id}`}
                x={attrs.x}
                y={attrs.y}
                textAnchor={attrs.textAnchor}
                dominantBaseline="middle"
                style={{
                  fill:            isActive ? "var(--text)" : "var(--text-muted)",
                  fontSize:        "7.5px",
                  fontFamily:      "var(--font-display)",
                  fontWeight:      600,
                  letterSpacing:   "0.1em",
                  textTransform:   "uppercase",
                  pointerEvents:   "none",
                  userSelect:      "none",
                  transition:      "fill 0.3s ease",
                }}
              >
                {node.title}
              </text>
            );
          })}

          {/* Annotation notes + arrows — hidden on mobile via opacity */}
          <g style={{ opacity: isMobile ? 0 : 1, transition: "opacity 0.3s ease" }} aria-hidden="true">
            {placed.map((node) => {
              const cfg = node.noteConfig;
              return (
                <g key={`note-${node.id}`}>
                  {/* Curved arrow */}
                  <path
                    d={cfg.arrowPath}
                    fill="none"
                    stroke="rgba(150,150,160,0.45)"
                    strokeWidth={1}
                    markerEnd="url(#em-arrow)"
                  />
                  {/* Note lines in Caveat */}
                  {cfg.lines.map((line, li) => (
                    <text
                      key={li}
                      x={cfg.x}
                      y={cfg.y + li * 15}
                      textAnchor={cfg.anchor}
                      style={{
                        fill:       "rgba(150,150,160,0.7)",
                        fontSize:   "12px",
                        fontFamily: "var(--font-caveat)",
                        fontWeight: 400,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </g>
        </svg>

        {/* ── HTML overlay: interactive icon buttons ──────────────────────────── */}
        {placed.map((node) => {
          const isActive = node.id === activeId;
          const Icon = ICONS[node.icon];

          return (
            <div
              key={node.id}
              style={{
                position:  "absolute",
                left:      node.pctLeft,
                top:       node.pctTop,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.button
                type="button"
                animate={prefersReduced ? {} : { scale: isActive ? 1.12 : 1 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  width:           NODE_PX,
                  height:          NODE_PX,
                  borderRadius:    "50%",
                  background:      isActive ? node.color : "var(--surface)",
                  border:          `1.5px solid ${isActive ? node.color : "var(--border)"}`,
                  boxShadow:       isActive && !prefersReduced
                    ? `0 0 0 8px ${node.color}18, 0 0 0 1px ${node.color}40`
                    : "none",
                  cursor:          "pointer",
                  outline:         "none",
                  transition:      "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  // 44px touch target
                  minWidth:        44,
                  minHeight:       44,
                }}
                aria-label={`${node.title} — ${node.status}`}
                aria-pressed={isActive}
                onMouseEnter={() => handleActivate(node.id)}
                onMouseLeave={handleDeactivate}
                onFocus={() => handleActivate(node.id)}
                onBlur={handleDeactivate}
                onClick={() => handleActivate(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleActivate(node.id);
                  }
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={1.9}
                  style={{
                    color:      isActive ? "#FAFAF7" : "var(--text-muted)",
                    transition: "color 0.3s ease",
                    display:    "block",
                  }}
                  aria-hidden="true"
                />
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* ── Info card ─────────────────────────────────────────────────────────── */}
      <div style={{ minHeight: 120 }}>
        <AnimatePresence mode="wait">
          {activeNode && (() => {
            const Icon = ICONS[activeNode.icon];
            return (
              <motion.div
                key={activeNode.id}
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  marginTop:    "1.25rem",
                  padding:      "1.1rem 1.25rem",
                  borderRadius: "12px",
                  background:   "#111113",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.7rem" }}>
                  {/* Icon tile tinted with node color */}
                  <div
                    style={{
                      width:           34,
                      height:          34,
                      borderRadius:    "8px",
                      background:      `${activeNode.color}28`,
                      border:          `1px solid ${activeNode.color}40`,
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      flexShrink:      0,
                    }}
                  >
                    <Icon size={15} strokeWidth={1.8} style={{ color: activeNode.color }} aria-hidden="true" />
                  </div>

                  {/* Title + status */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", paddingTop: "0.45rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize:   "0.875rem",
                        color:      "#FAFAF7",
                        lineHeight: 1.2,
                      }}
                    >
                      {activeNode.title}
                    </span>
                    <StatusBadge status={activeNode.status} color={activeNode.color} />
                  </div>
                </div>

                {/* Description */}
                <p style={{ margin: "0 0 0.85rem", fontSize: "0.8125rem", lineHeight: 1.65, color: "rgba(250,250,247,0.52)" }}>
                  {activeNode.description}
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: "0.7rem" }} />

                {/* Focus tags */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize:      "0.6rem",
                      fontFamily:    "var(--font-display)",
                      fontWeight:    600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color:         "rgba(250,250,247,0.28)",
                      marginRight:   "0.2rem",
                    }}
                  >
                    Focus
                  </span>
                  {activeNode.focusTags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize:      "0.6rem",
                        fontFamily:    "var(--font-display)",
                        fontWeight:    500,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding:       "0.22em 0.6em",
                        borderRadius:  "999px",
                        border:        "1px solid rgba(255,255,255,0.1)",
                        background:    "rgba(255,255,255,0.05)",
                        color:         "rgba(250,250,247,0.58)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* ── Status bar ────────────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop:      "0.75rem",
          display:        "flex",
          alignItems:     "center",
          gap:            "0.5rem",
          padding:        "0.35rem 0.75rem",
          borderRadius:   "999px",
          border:         "1px solid var(--border)",
          background:     "var(--surface)",
          width:          "fit-content",
        }}
      >
        {/* Dot-grid glyph */}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          {[0,4,8].flatMap(x => [0,4,8].map(y => (
            <circle key={`${x}-${y}`} cx={x+2} cy={y+2} r={0.9} fill="var(--text-muted)" opacity={0.5} />
          )))}
        </svg>
        <span
          style={{
            fontSize:      "0.65rem",
            fontFamily:    "var(--font-display)",
            fontWeight:    500,
            letterSpacing: "0.08em",
            color:         "var(--text-muted)",
          }}
        >
          5 active explorations
        </span>
        <span
          style={{
            fontSize:      "0.6rem",
            fontFamily:    "var(--font-display)",
            fontWeight:    600,
            letterSpacing: "0.1em",
            padding:       "0.1em 0.45em",
            borderRadius:  "999px",
            background:    "var(--border)",
            color:         "var(--text-muted)",
          }}
        >
          v1.0
        </span>
      </div>
    </motion.div>
  );
}
