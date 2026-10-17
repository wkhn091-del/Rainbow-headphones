import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "256kb",
      allowedOrigins: [
        "localhost:3000",
        "nexaaudio.co.il",
        "www.nexaaudio.co.il",
        "nexa-3d.com",
        "www.nexa-3d.com",
      ],
    },
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
