import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts", 
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 1. Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2. Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withSerwist(nextConfig);