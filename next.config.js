/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
