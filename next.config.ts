import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remote image support (currently allows all HTTPS images)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ⚠️ Wide open, you may want to restrict later
      },
    ],
  },

  // ESLint: don’t fail the build on Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript: don’t fail the build on Vercel
  typescript: {
    ignoreBuildErrors: true,
  },

  // Security headers (needed for SharedArrayBuffer / wasm editors, etc.)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
