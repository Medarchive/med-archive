import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    // Strip console.* from production builds (dev keeps them). console.error
    // stays so real failures — error boundaries, the API proxy — still
    // surface. Temporary: remove this block to bring production logs back.
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
