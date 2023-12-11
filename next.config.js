/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["cdn.pixabay.com"],
    minimumCacheTTL: 0,
  },
};

module.exports = nextConfig;
