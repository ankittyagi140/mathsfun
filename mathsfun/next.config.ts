import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.maths2fun.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/old-quiz/:path*',
        destination: '/quizzes/:path*',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/robots',
      },
    ]
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' maths2fun.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
            ].join('; ')
          },
        ],
      },
    ]
  },
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
  },
  webpack: (config, { isServer, webpack }) => {
    // Only apply Webpack-specific config when not using Turbopack
    if (!process.env.TURBOPACK) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      })
    }
    return config
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '@/components': './components',
        '@/utils': './utils',
      },
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack-loader'],
          as: '*.jsx',
        }
      }
    },
    optimizePackageImports: [
      'lodash-es',
      'react-icons',
      '@radix-ui/react-icons'
    ],
  },
  serverExternalPackages: ['sharp', 'canvas', 'fs-extra'],
}

export default nextConfig