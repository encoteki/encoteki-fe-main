import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Whitelist',
  description:
    'Claim your Encoteki NFT mint whitelist spot — follow, repost, and submit your wallet address.',
  alternates: { canonical: '/whitelist' },
}

export default function WhitelistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}
