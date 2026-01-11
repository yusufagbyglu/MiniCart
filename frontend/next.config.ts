import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is now the default in Next.js 16
  // We use the new turbopack property to handle SVGs
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Keep webpack for safety if you ever run with --webpack
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;