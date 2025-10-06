import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ファイル監視の問題を解決するための設定
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**']
      };
    }
    return config;
  },
};

export default nextConfig;
