/**
 * Contact — "Let's build something worth it."
 * A conversion section, not a form: the pitch (why reach out), the orbit of
 * reasons people hire Rahul, every direct contact method, and the moments
 * worth reaching out for.
 */

export type ContactIcon =
  | "phone" | "mail" | "github" | "linkedin" | "x" | "instagram";
export type TraitIcon =
  | "brain" | "target" | "heart" | "code" | "spark" | "cube";
export type ReasonIcon = "bulb" | "rocket" | "users" | "crosshair";

export const contactIntro = {
  eyebrow: "Contact",
  headline: "Let's build\nsomething\n",
  highlight: "worth it.",
  supporting: [
    "I turn ideas into real products.",
    "I solve problems that actually matter.",
    "I care about impact, not just deliverables.",
  ],
  note: "That's why you should reach out.",
  reachLabel: "Reach me directly",
  reasonsKicker: "Good reasons to",
  reasonsLabel: "reach out",
};

/** Traits orbiting the central "R." — the reasons people hire him. */
export const orbitTraits: { id: string; label: string; icon: TraitIcon; accent: string; angle: number }[] = [
  { id: "product",   label: "Product\nThinking",  icon: "brain",  accent: "#2563EB", angle: -126 },
  { id: "problem",   label: "Problem\nSolver",    icon: "target", accent: "#8B5CF6", angle: -54 },
  { id: "reliable",  label: "Reliable\nPartner",  icon: "heart",  accent: "#EC4899", angle: 8 },
  { id: "design",    label: "Design\n+ Tech",     icon: "code",   accent: "#6D5EF8", angle: 60 },
  { id: "curious",   label: "Always\nCurious",    icon: "spark",  accent: "#059669", angle: 122 },
  { id: "endtoend",  label: "End to End",          icon: "cube",   accent: "#D97706", angle: 180 },
];

export interface ContactMethod {
  id: string;
  label: string;
  value: string;
  /** tel:/mailto:/https: target */
  href: string;
  /** copy = clipboard button; link = open external */
  action: "copy" | "link";
  /** Raw value to copy (for copy actions) */
  copyValue?: string;
  icon: ContactIcon;
  accent: string;
}

export const contactMethods: ContactMethod[] = [
  { id: "phone",     label: "Phone",       value: "+91 77081 33665",                 href: "tel:+917708133665",                       action: "copy", copyValue: "+91 77081 33665",                 icon: "phone",     accent: "#4F7CFF" },
  { id: "email",     label: "Email",       value: "iamrahulrajendran01@gmail.com",   href: "mailto:iamrahulrajendran01@gmail.com",    action: "copy", copyValue: "iamrahulrajendran01@gmail.com",   icon: "mail",      accent: "#2563EB" },
  { id: "github",    label: "GitHub",      value: "github.com/rahulrajendran01",     href: "https://github.com/rahulrajendran01",     action: "link", icon: "github",    accent: "#0F172A" },
  { id: "linkedin",  label: "LinkedIn",    value: "linkedin.com/in/rahulrajendran01", href: "https://linkedin.com/in/rahulrajendran01", action: "link", icon: "linkedin",  accent: "#0A66C2" },
  { id: "x",         label: "X (Twitter)", value: "x.com/rahul_riyaz_",              href: "https://x.com/rahul_riyaz_",              action: "link", icon: "x",         accent: "#0F172A" },
  { id: "instagram", label: "Instagram",   value: "instagram.com/rahul.riyaz_",      href: "https://instagram.com/rahul.riyaz_",      action: "link", icon: "instagram", accent: "#E1306C" },
];

export const reachReasons: { id: string; icon: ReasonIcon; title: string; accent: string }[] = [
  { id: "fulltime",  icon: "bulb",      title: "For full-time\nopportunities",   accent: "#8B5CF6" },
  { id: "freelance", icon: "rocket",    title: "For freelance\nprojects",        accent: "#059669" },
  { id: "company",   icon: "users",     title: "For company\ncollaborations",    accent: "#6D5EF8" },
  { id: "ideas",     icon: "crosshair", title: "For new ideas\n& partnerships",  accent: "#F59E0B" },
];

export const contactMeta = {
  availability: "Currently available for new opportunities",
  availabilityNote: "Let's create something awesome!",
  location: "Based in Kerala, India",
};
