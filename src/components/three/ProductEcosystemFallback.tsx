/**
 * Static SVG fallback for the Product Ecosystem 3D visual.
 * Shown on mobile and when prefers-reduced-motion is set.
 * The main ring rotates slowly via CSS; disabled for reduced-motion.
 */

interface Props {
  className?: string;
}

// Nodes positioned on three elliptical orbits (SVG coordinate space)
// Origin at center (0,0). X right, Y down in SVG.
const SVG_NODES = [
  // Inner ellipse: rx=58, ry=28 — 2 nodes
  { label: "Product",     cx:  58,  cy:  0,   accent: true  },
  { label: "Design",      cx: -58,  cy:  0,   accent: false },
  // Middle ellipse: rx=80, ry=38 — 2 nodes (offset ~45°)
  { label: "Engineering", cx:  57,  cy:  27,  accent: true  },
  { label: "AI",          cx: -57,  cy: -27,  accent: false },
  // Outer ellipse: rx=102, ry=50 — 3 nodes
  { label: "Marketing",   cx:  88,  cy:  26,  accent: false },
  { label: "Publishing",  cx: -62,  cy:  43,  accent: false },
  { label: "AR",          cx:  16,  cy: -48,  accent: false },
] as const;

// Text anchor + offset based on node position
type TextAnchor = "start" | "end" | "middle";

function labelAnchor(cx: number): { anchor: TextAnchor; dx: number } {
  if (cx > 10)  return { anchor: "start",  dx: 10 };
  if (cx < -10) return { anchor: "end",    dx: -10 };
  return { anchor: "middle", dx: 0 };
}

export function ProductEcosystemFallback({ className = "" }: Props) {
  return (
    <div
      className={["flex items-center justify-center", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <svg
        viewBox="-108 -68 216 136"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full max-h-[560px]"
        style={{ overflow: "visible" }}
      >
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .eco-orbit-group {
              transform-origin: 0 0;
              animation: eco-slow-spin 55s linear infinite;
            }
          }
          @keyframes eco-slow-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>

        {/* ── Orbiting group (rotates) ─────────────────────────────── */}
        <g className="eco-orbit-group">
          {/* Orbit ellipses */}
          <ellipse cx="0" cy="0" rx="58"  ry="28" fill="none" stroke="var(--border)"    strokeWidth="0.6" />
          <ellipse cx="0" cy="0" rx="80"  ry="38" fill="none" stroke="var(--border)"    strokeWidth="0.6" />
          <ellipse cx="0" cy="0" rx="102" ry="50" fill="none" stroke="var(--border)"    strokeWidth="0.6" />

          {/* Orbital nodes */}
          {SVG_NODES.map(({ label, cx, cy, accent }) => {
            const { anchor, dx } = labelAnchor(cx);
            return (
              <g key={label}>
                {/* Glow ring for accent nodes */}
                {accent && (
                  <circle
                    cx={cx} cy={cy} r="9"
                    fill="var(--accent)" opacity="0.13"
                  />
                )}
                {/* Node sphere */}
                <circle
                  cx={cx} cy={cy} r="5.5"
                  fill={accent ? "var(--accent)" : "var(--surface)"}
                  stroke={accent ? "none" : "var(--border)"}
                  strokeWidth="0.8"
                />
                {/* Label — counter-rotates so text stays upright */}
                <text
                  x={cx + dx}
                  y={cy - 8}
                  textAnchor={anchor}
                  fontSize="8"
                  fontFamily="var(--font-display, system-ui, sans-serif)"
                  fontWeight="500"
                  fill="var(--text-muted)"
                  style={{ transform: `rotate(0deg)` }}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Center node (fixed, not rotating) ───────────────────── */}
        {/* Outer glow */}
        <circle cx="0" cy="0" r="20" fill="var(--accent)" opacity="0.07" />
        {/* Inner glow */}
        <circle cx="0" cy="0" r="14" fill="var(--accent)" opacity="0.13" />
        {/* Core */}
        <circle cx="0" cy="0" r="9" fill="var(--accent)" />
        {/* Initials */}
        <text
          x="0" y="3.5"
          textAnchor="middle"
          fontSize="7.5"
          fontFamily="var(--font-display, system-ui, sans-serif)"
          fontWeight="600"
          fill="white"
          letterSpacing="0.5"
        >
          RR
        </text>
      </svg>
    </div>
  );
}
