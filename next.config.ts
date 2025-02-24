import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "render.guildwars2.com",
      },
    ],
  },
};

export default nextConfig;
