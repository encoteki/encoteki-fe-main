import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

const supabaseDomain = process.env.SUPABASE_DOMAIN

const nextConfig: NextConfig = {
  images: {
    // Only register the Supabase remote pattern when the host is configured.
    // An empty hostname makes Next throw "Expected a non-empty string" during
    // the build's image-optimization step — which is what happens in CI, where
    // there is no .env. When unset, ship no remote patterns instead.
    remotePatterns: supabaseDomain
      ? [
          {
            protocol: 'https',
            hostname: supabaseDomain,
            port: '',
            pathname: '/**',
          },
        ]
      : [],
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/array/:path*',
        destination: 'https://us-assets.i.posthog.com/array/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
  skipTrailingSlashRedirect: true,
  async headers() {
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
            value: 'DENY',
          },
          {
            // Legacy XSS auditor; disabled per modern guidance (it has caused
            // info-leak issues). CSP in middleware.ts is the real XSS backstop.
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
