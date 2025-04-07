/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'dkmandiri.id'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dkmandiri.id',
        port: '',
        pathname: '/api/uploads/**',
      },
    ],
  },
  
  eslint: {
    // This allows builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    unstable_suppressHydrationWarning: true,
  }
};

module.exports = nextConfig;