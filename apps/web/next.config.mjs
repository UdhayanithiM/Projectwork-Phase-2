import "dotenv/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Warning: This allows production builds to complete even if there are TS errors.
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  experimental: {
    optimizeCss: true,
    // esmExternals: "loose"  <-- DELETED (Causes Crash in Next.js 16)
  },

  // ⭐ REQUIRED FOR SPLINE + THREE + FRAMER MOTION
  transpilePackages: [
    "@splinetool/react-spline",
    "@splinetool/runtime",
    "three",
    "framer-motion"
  ],

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // prevent server-side fs errors
    };
    return config;
  },

  // ⭐ Backend rewrite (Connects Next.js to Python)
  async rewrites() {
    return [
      // 1. WebSocket Proxy for Hume AI (Voice Mode)
      {
        source: "/ws/hume/:path*",
        destination: "http://127.0.0.1:8000/ws/hume/:path*",
      },
      // 2. REST API Proxy (Resume Parsing, Assessment Generation)
      {
        source: "/api/ai/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

export default nextConfig;