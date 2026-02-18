import { cn } from '@/lib/utils'
import type { FooterVariant } from '../types'

interface Props {
  variant?: FooterVariant
}

export function MarketingFooter({ variant = 'light' }: Props) {
  const isDark = variant === 'dark'

  return (
    <footer
      className={cn(
        'border-t py-8 text-center text-sm',
        isDark
          ? 'border-slate-800 bg-slate-950 text-slate-400'
          : 'border-slate-200 bg-white text-slate-500'
      )}
    >
      <p>&copy; 2026 Pulsebook. All rights reserved.</p>
    </footer>
  )
}
