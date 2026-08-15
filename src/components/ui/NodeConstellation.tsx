/**
 * NodeConstellation — lightweight SVG node motif.
 * Same visual DNA as ProductEcosystemFallback: elliptical orbits, small nodes,
 * hairline connectors, muted palette. Used decoratively in Lab and Contact sections.
 *
 * Purely presentational — aria-hidden="true" on the SVG wrapper.
 */

export interface ConstellationNode {
  label?: string;
  cx: number;
  cy: number;
  r?: number;
  accent?: boolean;
}

interface Props {
  nodes: ConstellationNode[];
  viewBox: string;
  className?: string;
  /** Draw hairline lines from each node to origin (0,0) */
  showConnectors?: boolean;
  /** Opacity of the whole constellation (default 1) */
  opacity?: number;
}

export function NodeConstellation({
  nodes,
  viewBox,
  className = "",
  showConnectors = true,
  opacity = 1,
}: Props) {
  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={["h-full w-full", className].filter(Boolean).join(" ")}
      style={{ overflow: "visible", opacity }}
      aria-hidden="true"
    >
      {/* Connector lines from origin to each node */}
      {showConnectors &&
        nodes.map((node, i) => (
          <line
            key={`line-${i}`}
            x1="0" y1="0"
            x2={node.cx} y2={node.cy}
            stroke="var(--border)"
            strokeWidth="0.6"
          />
        ))}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const r = node.r ?? 4.5;
        return (
          <g key={`node-${i}`}>
            {/* Glow for accent nodes */}
            {node.accent && (
              <circle
                cx={node.cx} cy={node.cy} r={r + 4}
                fill="var(--accent)" opacity="0.1"
              />
            )}
            {/* Node */}
            <circle
              cx={node.cx} cy={node.cy} r={r}
              fill={node.accent ? "var(--accent)" : "var(--surface)"}
              stroke={node.accent ? "none" : "var(--border)"}
              strokeWidth="0.8"
            />
            {/* Label */}
            {node.label && (
              <text
                x={node.cx}
                y={node.cy - (r + 6)}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="var(--font-display, system-ui, sans-serif)"
                fontWeight="500"
                fill="var(--text-muted)"
              >
                {node.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Center origin node — quiet dot */}
      <circle cx="0" cy="0" r="3.5" fill="var(--accent)" opacity="0.6" />
      <circle cx="0" cy="0" r="7" fill="var(--accent)" opacity="0.08" />
    </svg>
  );
}
