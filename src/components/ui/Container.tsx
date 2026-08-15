import { type CSSProperties, type HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Constrain to 1200px content-width. Default: true. */
  constrained?: boolean;
}

/**
 * Centered content wrapper.
 *
 * maxWidth + marginInline are set via inline style — this guarantees they
 * apply regardless of CSS layer ordering. Tailwind v4 utilities are inside
 * @layer utilities, which unlayered reset rules (margin:0, padding:0) can
 * silently override. Inline styles are not part of the cascade and always win.
 *
 * paddingInline is also inline-style to sidestep the same issue.
 * Responsive: 24px on mobile → 40px on wide screens (clamp).
 */
export function Container({
  constrained = true,
  className = "",
  style,
  children,
  ...props
}: ContainerProps) {
  const containerStyle: CSSProperties = {
    width: "100%",
    maxWidth: constrained ? "1200px" : "1440px",
    marginInline: "auto",
    paddingInline: "clamp(1.5rem, 5vw, 2.5rem)",
    ...style,
  };

  return (
    <div className={className || undefined} style={containerStyle} {...props}>
      {children}
    </div>
  );
}
