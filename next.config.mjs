import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,

  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Proxy API requests to the Express Backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://university-library-management-backe.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
