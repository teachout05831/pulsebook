'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export interface TimerEntry {
  start: string
  end: string | null
  reason?: string
  billable?: boolean
}

function entrySeconds(e: TimerEntry): number {
  const end = e.end ? new Date(e.end).getTime() : Date.now()
  return Math.max(0, (end - new Date(e.start).getTime()) / 1000)
}

function fmtDuration(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
  const s = String(Math.floor(secs % 60)).padStart(2, '0')
  return `${h}:${m}:${s}`
}

interface UseLiveTimerOptions {
  maxHours?: number
  storageKey?: string
}

function loadEntries(key: string): TimerEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function useLiveTimer(options?: UseLiveTimerOptions) {
  const key = options?.storageKey || 'sp_timer'
  const [entries, setEntries] = useState<TimerEntry[]>(() => loadEntries(key))
  const [, rerender] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const isRunning = entries.length > 0 && !entries[entries.length - 1].end

  const start = useCallback(() => {
    setEntries(prev => [...prev, { start: new Date().toISOString(), end: null }])
  }, [])

  const stop = useCallback((reason?: string, billable?: boolean) => {
    setEntries(prev => prev.map((e, i) =>
      i === prev.length - 1 && !e.end
        ? { ...e, end: new Date().toISOString(), reason, billable }
        : e
    ))
  }, [])

  const reset = useCallback(() => setEntries([]), [])

  // Persist entries to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(entries)) } catch { /* full storage */ }
  }, [entries, key])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        rerender(p => p + 1)
      }
    }, 1000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        rerender(p => p + 1)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [isRunning])

  // Auto-stop
  useEffect(() => {
    if (!isRunning || !options?.maxHours) return
    const last = entries[entries.length - 1]
    const elapsed = entrySeconds(last)
    const maxSecs = options.maxHours * 3600
    if (elapsed >= maxSecs) {
      stop('Auto-stopped', true)
    }
  })

  const totalSeconds = entries.reduce((sum, e) => sum + entrySeconds(e), 0)
  const billableSeconds = entries.reduce((sum, e) =>
    sum + (e.billable !== false ? entrySeconds(e) : 0), 0)
  const nonBillableSeconds = totalSeconds - billableSeconds

  return {
    entries, isRunning, totalSeconds, billableSeconds, nonBillableSeconds,
    formattedTotal: fmtDuration(totalSeconds),
    entrySeconds, fmtDuration, start, stop, reset,
  }
}
