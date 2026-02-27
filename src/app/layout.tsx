import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import '../styles/globals.css'
import Header from '@/components/header'
import { Footer } from '@/components/footer'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const LIVE_DOMAIN = process.env.LIVE_DOMAIN || 'https://encoteki.com'
const LIVE_LOGO = '/encoteki.png'
const ICON_DARK = '/icon-black.png'
const ICON_LIGHT = '/icon-white.png'

export const metadata: Metadata = {
  metadataBase: new URL(LIVE_DOMAIN),
  title: {
    default: 'Encoteki',
    template: '%s | Encoteki',
  },
  description:
    'Encoteki is a platform dedicated to sustainability and green technology. Join us to tokenize real-world assets and build a better future.',
  keywords: [
    'Encoteki',
    'Sustainability',
    'Green Tech',
    'RWA',
    'NFT',
    'Blockchain',
    'Environment',
    'Community',
  ],
  authors: [{ name: 'Encoteki Team', url: LIVE_DOMAIN }],
  creator: 'Encoteki',
  publisher: 'Encoteki',
  alternates: {
    canonical: LIVE_DOMAIN,
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: LIVE_DOMAIN,
    title: 'Encoteki - Join the Community and Save the World',
    description:
      'Empowering communities through green technology and sustainable innovation.',
    siteName: 'Encoteki',
    images: [
      {
        url: LIVE_LOGO,
        width: 1200,
        height: 630,
        alt: 'Encoteki - Join the Community and Save the World',
      },
    ],
  },

  // Twitter / X Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Encoteki - Join the Community and Save the World',
    description: 'Join the community and save the world!',
    images: [LIVE_LOGO],
    creator: '@encoteki',
  },

  // Icon Website (Favicon) — dark & light mode
  icons: {
    icon: [
      // Light mode
      {
        url: ICON_DARK,
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: ICON_DARK,
        type: 'image/png',
        sizes: '192x192',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: ICON_DARK,
        type: 'image/png',
        sizes: '512x512',
        media: '(prefers-color-scheme: light)',
      },
      // Dark mode
      {
        url: ICON_LIGHT,
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: ICON_LIGHT,
        type: 'image/png',
        sizes: '192x192',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: ICON_LIGHT,
        type: 'image/png',
        sizes: '512x512',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    shortcut: ICON_LIGHT,
    apple: [{ url: LIVE_LOGO, sizes: '180x180', type: 'image/png' }],
  },

  // Robot Google
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased`}
        suppressHydrationWarning
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
