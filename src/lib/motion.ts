/**
 * Shared motion variants and transition presets.
 * All animations respect prefers-reduced-motion via <MotionConfig reducedMotion="user">.
 */

export const transitions = {
  /** Default smooth transition — Apple-like */
  smooth: {
    type: "tween" as const,
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1],
  },
  /** Slightly slower for large reveals */
  reveal: {
    type: "tween" as const,
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1],
  },
  /** Snappy for micro-interactions */
  snappy: {
    type: "tween" as const,
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1],
  },
} as const;

export const variants = {
  /** Fade up — standard section reveal */
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  /** Fade in — no movement */
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  /** Staggered container — use with children that have variants */
  stagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  /** Slide in from left */
  slideLeft: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  /** Slide in from right */
  slideRight: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
} as const;
