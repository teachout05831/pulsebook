import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pulsebook.co — Service Business Management',
  description: 'Run your service business from one platform.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
