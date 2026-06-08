"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, MotionConfig } from "motion/react";
import { Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { label: "Story", href: "#story" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for active section tracking
  useEffect(() => {
    const sections = NAV_ITEMS.map(({ href }) =>
      document.querySelector(href)
    ).filter(Boolean) as Element[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: shouldReduceMotion ? "instant" : "smooth" });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "h-[var(--nav-height)]",
          "flex items-center",
          "transition-all duration-300",
          scrolled
            ? "border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md"
            : "bg-transparent",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/*
         * Inner wrapper matches Container exactly: 1200px max-width, centered,
         * same paddingInline — so brand left-edge aligns with headline left-edge.
         * Inline styles bypass the CSS layer cascade issue (see globals.css).
         */}
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            marginInline: "auto",
            paddingInline: "clamp(1.5rem, 5vw, 2.5rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "var(--nav-height)",
          }}
        >
          {/* Wordmark — "R." monogram + name */}
          <a
            href="/"
            className="inline-flex items-baseline gap-2.5 text-sm font-semibold tracking-[-0.02em] text-[var(--text)] transition-opacity hover:opacity-70"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "1.35rem", lineHeight: 1, letterSpacing: "-0.04em",
                color: "var(--text)", flexShrink: 0,
              }}
            >
              R<span style={{ color: "var(--accent)" }}>.</span>
            </span>
            Rahul Rajendran
          </a>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map(({ label, href }) => {
              // Default to "Story" active when no section is intersecting (top of page)
              const isActive = (activeSection ?? "#story") === href;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={[
                    "relative inline-flex items-center gap-1.5 px-1 py-1.5 text-sm transition-colors duration-200",
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {isActive && (
                    <Sparkles size={13} strokeWidth={2.2} aria-hidden="true" />
                  )}
                  <span className="relative">
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[var(--accent)]"
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                    )}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Mobile menu toggle — placeholder for now */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text)] md:hidden"
            aria-label="Open menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 4.5h14M2 9h14M2 13.5h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </motion.header>
    </MotionConfig>
  );
}
