import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.CONTAINER_BUILD === "1" ? { output: "standalone" as const } : {}),
  /* config options here */
};

export default nextConfig;
