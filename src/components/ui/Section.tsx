import { type HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render. Default: "section". */
  as?: "section" | "div" | "article" | "aside" | "main";
  /** Vertical padding size. Default: "default". */
  size?: "sm" | "default" | "lg" | "none";
  /** Background fill variant. Default: "default". */
  bg?: "default" | "surface" | "none";
  /**
   * Opt out of the default `overflow-hidden`. Needed for any section using
   * `position: sticky` internally — a clipping ancestor prevents sticky from
   * engaging against the real viewport at all. Default: false (unchanged
   * behavior for every existing section).
   */
  overflowVisible?: boolean;
}

// Vertical rhythm reduced ~18% from the original scale — sections felt
// over-padded ("empty" rather than "intentional"). Premium but tighter.
const paddingMap = {
  none: "",
  sm: "py-[clamp(2rem,4vw,4rem)]",
  default: "py-[clamp(3.25rem,5.5vw,6.5rem)]",
  lg: "py-[clamp(4rem,7.5vw,8rem)]",
};

const bgMap = {
  none: "",
  default: "bg-[var(--bg)]",
  surface: "bg-[var(--surface)]",
};

/**
 * Section wrapper — enforces vertical rhythm and background fills.
 * Always nest <Container> inside for horizontal constraints.
 */
export function Section({
  as: Tag = "section",
  size = "default",
  bg = "default",
  overflowVisible = false,
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={[paddingMap[size], bgMap[bg], overflowVisible ? "relative" : "relative overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
