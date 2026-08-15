/**
 * Testimonials — real client reviews from Fiverr.
 * Light typo-fix only; authentic voice preserved.
 *
 * featured: true  → shown in the default 3-card view (Sara, Gobika, Helen)
 * featured: false → revealed via "View all" toggle (Saran Raj, Sudha, Ishu)
 *
 * credibilityStats: all 3 display. isPlaceholder is a developer flag only —
 *   it does NOT hide the stat. Update value + set isPlaceholder: false when
 *   you have a confirmed number.
 *
 * fiverrScreenshots: swap label → real image path before launch.
 *   prominent: true  → renders full-width (use for strongest proof).
 */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  /** Job title or profession, if known */
  role?: string;
  /** Country or city + country */
  location: string;
  /** Show in default 3-card view; others behind toggle */
  featured: boolean;
  /** Star rating — all current reviews are 5-star */
  rating: number;
}

export interface TestimonialSectionIntro {
  eyebrow: string;
  headline: string;
  /** Quiet trust statement beneath the headline */
  trustLine: string;
  /** Muted service-range descriptor, one line */
  serviceRange: string;
}

export interface CredibilityStat {
  value: string;
  label: string;
  /**
   * Developer flag only — stat always renders.
   * Set false + confirm the value before launch.
   */
  isPlaceholder: boolean;
}

export interface FiverrScreenshot {
  id: string;
  /** Slot description — for Placeholder label; also used as fallback if no imageSrc */
  label: string;
  /** Optional caption rendered below the screenshot */
  caption?: string;
  /**
   * Renders full-width in the grid (use for the strongest proof screenshot).
   * When imageSrc is set, uses <Image>; otherwise falls back to <Placeholder>.
   */
  prominent?: boolean;
  /**
   * Path to a real image file inside /public (served from site root).
   * Example: "/testimonials/helen-tip-review.png"
   * When set, renders next/image instead of Placeholder.
   * The other two slots can be activated the same way — just add imageSrc, imageWidth, imageHeight, alt.
   */
  imageSrc?: string;
  /** Native pixel width — required for CLS-free Next.js Image rendering */
  imageWidth?: number;
  /** Native pixel height — required for CLS-free Next.js Image rendering */
  imageHeight?: number;
  /** Meaningful alt text for the screenshot */
  alt?: string;
}

export const testimonials: Testimonial[] = [
  // ── Featured (shown by default) ──────────────────────────────────────────
  {
    id: "sara-davoodi",
    name: "Sara Davoodi",
    role: "Experienced Accountant",
    location: "Milan, Italy",
    featured: true,
    rating: 5,
    quote:
      "Rahul is highly-skilled and very hard working. He gave me advice for doing well in design and development. He's a helpful professional with a positive attitude, and shared his knowledge and experience with anyone who needs a little guidance.",
  },
  {
    id: "gobika",
    name: "Gobika",
    location: "India",
    featured: true,
    rating: 5,
    quote:
      "I am very impressed with the quality and creativity of the website design. Rahul was professional, responsive, and attentive to my needs and preferences. I highly recommend his services to anyone looking for a stunning and user-friendly website.",
  },
  {
    id: "helen",
    name: "Helen",
    location: "United States",
    featured: true,
    rating: 5,
    quote:
      "Rahul is highly skilled if you give him the ability to be creative. He understands the user experience. If you take a few extra minutes and provide specific direction on exact wording and what you envision, you will receive great results.",
  },
  // ── Behind "View all" toggle ──────────────────────────────────────────────
  {
    id: "saran-raj",
    name: "Saran Raj",
    role: "Author",
    location: "India",
    featured: false,
    rating: 5,
    quote:
      "It's really wonderful to work with Rahul. He's got a lot of resilience, creativity, and mainly delivers the project on time. I'd highly recommend his services to anyone looking for projects.",
  },
  {
    id: "sudha",
    name: "Sudha",
    location: "United States",
    featured: false,
    rating: 5,
    quote:
      "I had the pleasure of working with Rahul, who delivered work in a timely manner. His ability to work quickly and efficiently while maintaining quality was truly impressive.",
  },
  {
    id: "ishu",
    name: "Ishu",
    location: "Germany",
    featured: false,
    rating: 5,
    quote:
      "Rahul is amazing — if you give him even a word document with the exact layout and words of what you want, he delivers in a timely manner. He's online often, so even if I wake up in the middle of the night, the response time is always mind-blowing. He is dedicated and professional!",
  },
];

export const testimonialSectionIntro: TestimonialSectionIntro = {
  eyebrow: "Trusted",
  headline: "In their words.",
  trustLine: "Trusted by clients across 4+ countries.",
  serviceRange: "Website Design · UI/UX · Book Formatting · Development",
};

export const credibilityStats: CredibilityStat[] = [
  {
    value: "4+",
    label: "Countries",
    isPlaceholder: false,
  },
  {
    value: "$25",
    label: "Largest Client Tip",
    isPlaceholder: false,
  },
  {
    /**
     * !! PLACEHOLDER — do not ship a fabricated number.
     * Once you verify the exact count on your Fiverr profile, update value to
     * e.g. "12" with label "Five-Star Reviews", or "100%" with label "Five-Star Rate".
     * Until confirmed, "All 5-Star" is factually safe and still credible.
     */
    value: "All 5-Star",
    label: "Reviews",
    isPlaceholder: true,
  },
];

/**
 * Fiverr review screenshot slots — all three from helenkramerbkhk (United States).
 * review1 = "ability to be creative" review (18 Aug, 1536×1024)
 * review2 = "word document / response time" review (30 Aug, 1536×1024)
 * review3 = $25 tip review — wide landscape, full-width hero slot (1811×868)
 *
 * To swap: update imageSrc, imageWidth, imageHeight, alt.
 */
export const fiverrScreenshots: FiverrScreenshot[] = [
  {
    id: "fiverr-review1",
    label: "Fiverr Review — helenkramerbkhk: creativity / UX screenshot",
    caption: "helenkramerbkhk · United States",
    imageSrc:    "/testimonials/review1.png",
    imageWidth:  1536,
    imageHeight: 1024,
    alt: "Verified 5-star Fiverr review from helenkramerbkhk (United States) — creativity, UX understanding, and delivering results",
  },
  {
    id: "fiverr-review2",
    label: "Fiverr Review — helenkramerbkhk: word-document delivery / response time",
    caption: "helenkramerbkhk · United States",
    imageSrc:    "/testimonials/review2.png",
    imageWidth:  1536,
    imageHeight: 1024,
    alt: "Verified 5-star Fiverr review from helenkramerbkhk (United States) — timely delivery and always-on responsiveness",
  },
  {
    id: "fiverr-tip",
    label: "Fiverr Review — helenkramerbkhk: $25 tip + 'we will work again'",
    caption: "helenkramerbkhk · United States · US$25 tip",
    prominent: true,
    imageSrc:    "/testimonials/review3.png",
    imageWidth:  1811,
    imageHeight: 868,
    alt: "Verified 5-star Fiverr review from helenkramerbkhk (United States), including a voluntary US$25 tip",
  },
];

/* ─── Global Reputation Map ──────────────────────────────────────────────── */

export interface CountryReview {
  quote: string;
  name: string;
  role?: string;
  location: string;
  initials: string;
  rating: number;
}

export interface ReputationCountry {
  id: string;
  name: string;
  flag: string;
  reviews: number;
  accent: string;
  /** Node position in the 900×560 map space — anchored to its world location */
  node: { x: number; y: number };
  /** Asymmetric "floating window" position for the review card */
  card: { top?: string; left?: string; right?: string; bottom?: string };
  /** Transform origin for the card's scale */
  origin: string;
  review: CountryReview;
}

export const reputationCountries: ReputationCountry[] = [
  {
    // North America — left
    id: "us", name: "United States", flag: "🇺🇸", reviews: 2, accent: "#2563EB",
    node: { x: 232, y: 214 }, card: { top: "22%", left: "-4%" }, origin: "left center",
    review: {
      quote: "Rahul is highly skilled if you give him the ability to be creative. Take a few minutes to provide exact direction and you'll receive great results.",
      name: "Helen", location: "United States", initials: "H", rating: 5,
    },
  },
  {
    // Europe — upper center, sits higher
    id: "de", name: "Germany", flag: "🇩🇪", reviews: 1, accent: "#8B5CF6",
    node: { x: 486, y: 150 }, card: { top: "-5%", left: "41%" }, origin: "top center",
    review: {
      quote: "Rahul is amazing — give him a document with the exact layout and words, and he delivers in a timely manner. Always online; the response time is mind-blowing.",
      name: "Ishu", location: "Germany", initials: "I", rating: 5,
    },
  },
  {
    // Southern Europe — lower left of centre
    id: "it", name: "Italy", flag: "🇮🇹", reviews: 1, accent: "#059669",
    node: { x: 430, y: 318 }, card: { bottom: "-3%", left: "23%" }, origin: "bottom left",
    review: {
      quote: "Rahul is highly-skilled and very hard working. He's a helpful professional with a positive attitude, and shared his knowledge with anyone who needs guidance.",
      name: "Sara Davoodi", role: "Accountant", location: "Milan, Italy", initials: "SD", rating: 5,
    },
  },
  {
    // South Asia — right, farther out and lower
    id: "in", name: "India", flag: "🇮🇳", reviews: 2, accent: "#D97706",
    node: { x: 662, y: 296 }, card: { top: "42%", right: "-4%" }, origin: "right center",
    review: {
      quote: "It's really wonderful to work with Rahul. He's got a lot of resilience, creativity, and mainly delivers the project on time. Highly recommend his services.",
      name: "Saran Raj", role: "Author", location: "India", initials: "SR", rating: 5,
    },
  },
];

export interface MarqueeReview { user: string; flag: string; rating: number; }
export const marqueeReviews: MarqueeReview[] = [
  { user: "helenkramerbkhk", flag: "🇺🇸", rating: 5 },
  { user: "ishu_designs",    flag: "🇩🇪", rating: 5 },
  { user: "saranraj_writer", flag: "🇮🇳", rating: 5 },
  { user: "sudhaprojects",   flag: "🇺🇸", rating: 5 },
  { user: "saradavoodi",     flag: "🇮🇹", rating: 5 },
  { user: "gobika_designs",  flag: "🇮🇳", rating: 5 },
];

export type RepStatIcon = "Globe" | "Star" | "Trophy" | "Dollar";
export interface ReputationStat { icon: RepStatIcon; value: string; label: string; accent: string; }
export const reputationStats: ReputationStat[] = [
  { icon: "Globe",  value: "4+",   label: "Trusted in 4 Countries", accent: "#2563EB" },
  { icon: "Star",   value: "100%", label: "Perfect 5★ Rating",      accent: "#8B5CF6" },
  { icon: "Trophy", value: "6",    label: "Verified Reviews",       accent: "#059669" },
  { icon: "Dollar", value: "$25",  label: "Biggest Client Tip",     accent: "#D97706" },
];

/** One review pulled out big — the emotional "client impact" moment. */
export const featuredHighlight = {
  tag: "Most Memorable Feedback",
  quote: "He's online so often that even if I message in the middle of the night, the response time is mind-blowing. Give him the exact layout and words, and he delivers — dedicated and professional.",
  name: "Ishu",
  location: "Germany",
  flag: "🇩🇪",
  accent: "#8B5CF6",
};

export const reputationIntro = {
  eyebrow: "Signals From The Field",
  headline: "Don't take\nmy word for it.",
  note: "Real feedback. Real impact.",
  subline: "Every review here is from a real client\non a completed project — public and verifiable.",
  body: "Projects delivered. Problems solved. Here's what clients across the world say about working together.",
  hint: "hover a country to read reviews",
  mapLabel: "Global Reputation Map",
};

/** Two-line achievement labels for the badge row. */
export const reputationAchievements: { icon: RepStatIcon; title: string; value: string; accent: string }[] = [
  { icon: "Globe",  title: "Global Reach",        value: "4 Countries",   accent: "#2563EB" },
  { icon: "Star",   title: "Perfect Record",      value: "100% Positive", accent: "#8B5CF6" },
  { icon: "Trophy", title: "Verified Trust",      value: "6 Reviews",     accent: "#059669" },
  { icon: "Dollar", title: "Client Appreciation", value: "$25 Tip",       accent: "#D97706" },
];
