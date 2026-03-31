/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Rewrite paths for static assets
      {
        source: '/css/:path*',
        destination: '/css/:path*',
      },
      {
        source: '/js/:path*',
        destination: '/js/:path*',
      },
      {
        source: '/images/:path*',
        destination: '/images/:path*',
      },
      {
        source: '/fonts/:path*',
        destination: '/fonts/:path*',
      },
    ]
  },
}

export default nextConfig
