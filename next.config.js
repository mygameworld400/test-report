/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/test-report',
  assetPrefix: '/test-report/',
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
