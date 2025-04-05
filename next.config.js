/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    unstable_suppressHydrationWarning: true,
  }
  // Hapus bagian compiler: { emotion: false }
};

module.exports = nextConfig;