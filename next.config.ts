import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  // Remark/rehype plugins can be added here later
  options: {},
});

const nextConfig: NextConfig = {
  // Allow .mdx pages and components
  pageExtensions: ["ts", "tsx", "mdx"],

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Required for Three.js (avoids "Can't resolve 'fs'" errors)
  webpack(config) {
    return config;
  },
};

export default withMDX(nextConfig);
