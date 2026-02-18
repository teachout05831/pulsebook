'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ContactFormDialog } from './ContactFormDialog'
import type { NavVariant } from '../types'

interface Props {
  variant?: NavVariant
}

const variantStyles: Record<NavVariant, { bg: string; text: string; accent: string }> = {
  light: {
    bg: 'bg-white/90 backdrop-blur border-b border-slate-200',
    text: 'text-slate-900',
    accent: 'text-blue-600',
  },
  dark: {
    bg: 'bg-slate-950/90 backdrop-blur border-b border-slate-800',
    text: 'text-white',
    accent: 'text-blue-400',
  },
  transparent: {
    bg: 'bg-transparent',
    text: 'text-white',
    accent: 'text-white/80',
  },
}

export function MarketingNav({ variant = 'light' }: Props) {
  const styles = variantStyles[variant]

  return (
    <nav className={cn('sticky top-0 z-50', styles.bg)}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className={cn('text-xl font-bold tracking-tight', styles.text)}>
          Pulsebook<span className={styles.accent}>.co</span>
        </div>
        <div className="flex items-center gap-3">
          <ContactFormDialog
            triggerClassName={cn(
              variant === 'transparent'
                ? 'bg-white text-slate-900 hover:bg-white/90'
                : undefined
            )}
          />
          <Button variant="ghost" asChild className={cn('h-9', styles.text, 'hover:bg-white/10')}>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
