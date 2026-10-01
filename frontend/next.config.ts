import type { NextConfig } from "next";

const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ai-company-intelligence.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
