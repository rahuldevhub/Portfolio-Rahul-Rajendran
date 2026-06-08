import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Caveat } from "next/font/google";
import { MotionConfig } from "motion/react";
import { LenisProvider } from "@/lib/lenis";
import { Nav } from "@/components/ui";
import { site } from "@/content/site";
import "./globals.css";

/* ─── Fonts ──────────────────────────────────────────────────────────────── */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

/* ─── Metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF7",
  colorScheme: "light",
};

/* ─── Root Layout ────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full"
        style={{
          fontFamily: "var(--font-inter, system-ui, sans-serif)",
          backgroundColor: "var(--bg)",
          color: "var(--text)",
        }}
      >
        <MotionConfig reducedMotion="user">
          <LenisProvider>
            <Nav />
            <main className="pt-[var(--nav-height)]">{children}</main>
          </LenisProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
