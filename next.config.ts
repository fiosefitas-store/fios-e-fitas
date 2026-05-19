import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  allowedDevOrigins: [
    "*.replit.dev",
    "*.picard.replit.dev",
    "*.kirk.replit.dev",
  ],
};

export default nextConfig;
