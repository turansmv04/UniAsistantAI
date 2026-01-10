import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint yoxlamasını deploy zamanı söndür
  },
};

export default nextConfig;
