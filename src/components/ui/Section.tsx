import { type HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render. Default: "section". */
  as?: "section" | "div" | "article" | "aside" | "main";
  /** Vertical padding size. Default: "default". */
  size?: "sm" | "default" | "lg" | "none";
  /** Background fill variant. Default: "default". */
  bg?: "default" | "surface" | "none";
}

const paddingMap = {
  none: "",
  sm: "py-[clamp(2.5rem,5vw,5rem)]",
  default: "py-[clamp(4rem,7vw,8rem)]",
  lg: "py-[clamp(5rem,9vw,10rem)]",
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
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={[paddingMap[size], bgMap[bg], "relative overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
