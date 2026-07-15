import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@anthropic-ai/sdk'],
  env: {
    SA8_ANTHROPIC_API_KEY: process.env.SA8_ANTHROPIC_API_KEY,
  },
};

export default nextConfig;
