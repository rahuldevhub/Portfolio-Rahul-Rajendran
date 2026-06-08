# Rahul Rajendran — Personal Brand Site

## POSITIONING
"The Product Builder." Core message: most people specialize in one layer of a product; Rahul understands how all the layers connect (business, product, design, engineering, AI, automation). Every section reinforces this single identity.

## EMOTIONAL ARC
The site must create:
- 5s → "who is this?"
- 30s → "he does more than code"
- 1m → "he designed these too?"
- 2m → "he built the backend too?"
- 3m → "he launched and marketed them too?"
- exit → "I should talk to Rahul."

## BRAND PERSONALITY
Calm, confident, thoughtful, execution-focused. Never loud, hype-driven, or trying too hard.

## DESIGN TOKENS
All defined as CSS variables in `src/app/globals.css` via `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#FAFAF7` | Warm white page background |
| `--surface` | `#F1F0EC` | Light gray cards/surfaces |
| `--border` | `#E6E5E0` | Hairline borders |
| `--text` | `#0A0A0B` | Near-black body text |
| `--text-muted` | `#6B6B70` | Secondary text |
| `--accent` | `#2B6BFF` | Electric blue — primary CTA/highlight |
| `--accent-2` | `#6D5EF8` | Subtle purple — use sparingly |

Color is used with restraint — whitespace does most of the work. No heavy gradients, no glassmorphism overuse.

## TYPOGRAPHY
- Display/headings: Geist (CSS var `--font-display`)
- Body: Inter (CSS var `--font-body`)
- Extremely clear hierarchy: large confident headlines, ~65ch body width, generous line spacing
- Type should feel expensive

## LAYOUT
- max-width: 1440px
- content width: 1200px (`<Container>`)
- 12-column grid
- Vertical rhythm: `clamp(4rem, 7vw, 8rem)` section padding (64–128px) — intentional and full, never sparse
- Never cramped, but equally never half-empty

## NAVIGATION LABELS (exact, never change)
`Story · Work · Process · Lab · Contact`
Never use "About", "Skills", "Resume", or any other label.

## ANIMATION RULES
- Library: `motion` (NOT `framer-motion`) — import from `motion/react`
- Scroll choreography: GSAP + ScrollTrigger
- Smooth scroll: Lenis
- No bouncing, no elastic easing, no excessive parallax
- No distracting motion — Apple-like smoothness only
- Always respect `prefers-reduced-motion` via `useReducedMotion()`
- Wrap app in `<MotionConfig reducedMotion="user">`

## 3D RULES
- 3D explains concepts, never decoration
- Every R3F element must earn its place
- Lazy-load all `@react-three/fiber` components with `dynamic(..., { ssr: false })`
- Degrade gracefully to static/SVG fallback on mobile and reduced-motion
- The site must never feel like a Three.js demo

## HARD "DO NOT" LIST
- Generic portfolio layouts
- Cyberpunk/matrix aesthetics
- Gaming-style 3D
- Overly dark UI (dark mode is opt-in only, not default)
- Skill bars or progress bars
- Infinite-scroll gimmicks
- Artificial "AI-themed" neon visuals
- Template-feeling sections
- Hardcoding content inside components (use `src/content/` data files)

## PERFORMANCE
- Target Lighthouse 95+ on all four categories
- Lazy-load 3D and heavy media
- Prefer CSS/SVG over canvas where possible
- Keep dependencies lean

## CONTENT STRATEGY
- All content (copy, projects, testimonials, capabilities) lives in typed data files under `src/content/`
- Case studies use MDX under `src/content/work/`
- Profile photos, screenshots, videos use `<Placeholder>` component until swapped
- Structure everything for a future CMS migration

## STACK
- Next.js 16.x, App Router, TypeScript, `src/` directory
- Tailwind v4 — CSS-first via `@theme` in `globals.css`, NO `tailwind.config.js`
- `motion` v12 — import from `motion/react`
- `gsap` v3 + ScrollTrigger
- `lenis` v1 — smooth scroll
- `@react-three/fiber` + `@react-three/drei` + `three`
- `@next/mdx` + `@mdx-js/react` for case studies

## KEY FILES
- Design tokens: `src/app/globals.css`
- Layout primitives: `src/components/ui/`
  - `Section.tsx` — section wrapper with vertical padding
  - `Container.tsx` — 1200px centered content wrapper
  - `Placeholder.tsx` — labeled aspect-ratio-aware image/video placeholder
  - `Grid.tsx` — 12-column grid primitive
  - `Nav.tsx` — sticky top navigation
- Lenis provider: `src/lib/lenis.tsx`
- Motion helpers: `src/lib/motion.ts`
- Content data: `src/content/`
- 3D components: `src/components/three/`
- Page sections: `src/components/sections/`
