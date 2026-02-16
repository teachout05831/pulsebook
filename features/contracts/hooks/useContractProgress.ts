'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { StatusEvent, TimeEntry } from '../types'

interface ProgressData {
  statusEvents: StatusEvent[]
  timeEntries: TimeEntry[]
  currentStatus: string | null
}

export function useContractProgress(contractId: string | null, pollInterval = 30000) {
  const [data, setData] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const fetchProgress = useCallback(async () => {
    if (!contractId) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/contracts/instances/${contractId}/progress`)
      if (!res.ok) return
      const json = await res.json()
      setData(json.data)
    } finally {
      setIsLoading(false)
    }
  }, [contractId])

  useEffect(() => {
    fetchProgress()
    if (contractId && pollInterval > 0) {
      intervalRef.current = setInterval(fetchProgress, pollInterval)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [fetchProgress, contractId, pollInterval])

  const totalSeconds = data?.timeEntries?.reduce((sum, e) => {
    if (e.eventType !== 'start') return sum
    const start = new Date(e.recordedAt).getTime()
    const end = e.notes?.includes('stop') ? Date.now() : Date.now()
    return sum + (end - start) / 1000
  }, 0) || 0

  const billableHours = (data?.timeEntries || []).reduce((sum, e) => {
    if (!e.isBillable || e.eventType !== 'start') return sum
    return sum + 1
  }, 0)

  return {
    statusEvents: data?.statusEvents || [],
    timeEntries: data?.timeEntries || [],
    currentStatus: data?.currentStatus || null,
    totalSeconds,
    billableHours,
    isLoading,
    refresh: fetchProgress,
  }
}
