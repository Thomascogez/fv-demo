import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  httpAgentOptions: {
    keepAlive: false,
  },
  /* config options here */
};

export default nextConfig;
