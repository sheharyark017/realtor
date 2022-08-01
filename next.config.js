/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  nextConfig,
  images: { domains: ['bayut-production.s3.eu-central-1.amazonaws.com'] },
};
