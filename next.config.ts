import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "images.reeflifesurvey.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
