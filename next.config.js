/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'dkmandiri.id', 'source.unsplash.com']
  },
  
  eslint: {
    // This allows builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'lib', 'src'],
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