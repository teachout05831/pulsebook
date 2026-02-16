'use client'

import { useState, useEffect, useCallback } from 'react'

interface ExpirationBannerProps {
  expiresAt: string | null
  primaryColor?: string
  secondaryColor?: string
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function getStatus(expiresAt: string) {
  const now = Date.now()
  const expires = new Date(expiresAt).getTime()
  const diffMs = expires - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
  if (diffMs <= 0) return { state: 'expired' as const, label: 'This estimate has expired' }
  if (diffDays <= 3) {
    const label = diffHours <= 24
      ? `Expires in ${diffHours} hour${diffHours === 1 ? '' : 's'}`
      : `Expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`
    return { state: 'soon' as const, label }
  }
  return { state: 'valid' as const, label: `Estimate valid through ${formatDate(new Date(expiresAt))}` }
}

const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export function ExpirationBanner({ expiresAt, secondaryColor = '#6366f1' }: ExpirationBannerProps) {
  const computeStatus = useCallback(() => (expiresAt ? getStatus(expiresAt) : null), [expiresAt])
  // Initialize as null to avoid hydration mismatch (Date.now() differs server/client)
  const [status, setStatus] = useState<ReturnType<typeof getStatus> | null>(null)

  useEffect(() => {
    setStatus(computeStatus())
    if (!expiresAt) return
    const interval = setInterval(() => setStatus(computeStatus()), 60_000)
    return () => clearInterval(interval)
  }, [expiresAt, computeStatus])

  if (!status) return null

  const bgColor =
    status.state === 'expired' ? '#dc2626' :
    status.state === 'soon' ? '#d97706' : secondaryColor

  const Icon = status.state === 'expired' ? WarningIcon : status.state === 'soon' ? ClockIcon : CheckIcon

  return (
    <div style={{ backgroundColor: bgColor }} className="py-2 text-sm text-white text-center">
      <span className="inline-flex items-center gap-1.5">
        <Icon /> {status.label}
      </span>
    </div>
  )
}
