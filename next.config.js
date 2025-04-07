/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  eslint: {
    // This allows builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    unstable_suppressHydrationWarning: true,
  }
  // Hapus bagian compiler: { emotion: false }
};

module.exports = nextConfig;