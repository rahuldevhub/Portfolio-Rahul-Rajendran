/**
 * InitialsAvatar — monochrome circle with up to 2 initials.
 * Swap this component for a real <Image> avatar when photos are available.
 * Design: --surface bg, hairline --border ring, --text-muted initials.
 */

interface Props {
  name: string;
  size?: number;
}

export function InitialsAvatar({ name, size = 40 }: Props) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      aria-hidden="true"
      style={{
        width:           size,
        height:          size,
        borderRadius:    "50%",
        backgroundColor: "var(--surface)",
        border:          "1px solid var(--border)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        flexShrink:      0,
      }}
    >
      <span
        style={{
          fontSize:    Math.round(size * 0.33),
          fontWeight:  600,
          color:       "var(--text-muted)",
          fontFamily:  "var(--font-display)",
          letterSpacing: "-0.01em",
          lineHeight:  1,
          userSelect:  "none",
        }}
      >
        {initials}
      </span>
    </div>
  );
}
