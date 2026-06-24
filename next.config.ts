import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "https://preview-chat-f18ad1c5-372e-48b0-94fe-477afce1dd3a.space-z.ai",
  ],
};

export default nextConfig;
