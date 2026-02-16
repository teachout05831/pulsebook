'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useCompanyTimeSettings } from './useCompanyTimeSettings'
import type { TimeEntry, TimePair, RecordTimeEntryInput, UpdateTimeEntryInput } from '../types'

function pairEntries(entries: TimeEntry[]): TimePair[] {
  const pairs: TimePair[] = []
  let i = 0
  while (i < entries.length) {
    const start = entries[i]
    if (start.eventType !== 'start') { i++; continue }
    const stop = entries[i + 1]?.eventType === 'stop' ? entries[i + 1] : null
    const ms = stop ? new Date(stop.recordedAt).getTime() - new Date(start.recordedAt).getTime() : null
    pairs.push({
      start,
      stop,
      duration: ms !== null ? ms / 60000 : null,
      reason: start.reason,
      isBillable: start.isBillable,
    })
    i += stop ? 2 : 1
  }
  return pairs
}

export function useTimeTracking(contractId: string, isOfficeUser = true) {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { settings } = useCompanyTimeSettings()
  const canEdit = settings.editPermission === 'crew_and_office' || isOfficeUser

  const fetchEntries = useCallback(async () => {
    if (!contractId) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/contracts/time-entries?contractId=${contractId}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setEntries(json.data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [contractId])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const pairs = useMemo(() => pairEntries(entries), [entries])

  const totals = useMemo(() => {
    let totalMin = 0, billableMin = 0, breakMin = 0
    for (const p of pairs) {
      if (p.duration === null) continue
      totalMin += p.duration
      if (p.isBillable) billableMin += p.duration
      else breakMin += p.duration
    }
    return {
      totalHours: totalMin / 60,
      billableHours: billableMin / 60,
      breakHours: breakMin / 60,
    }
  }, [pairs])

  const record = useCallback(async (input: RecordTimeEntryInput) => {
    const res = await fetch('/api/contracts/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    await fetchEntries()
    return { success: true }
  }, [fetchEntries])

  const update = useCallback(async (id: string, input: UpdateTimeEntryInput) => {
    const res = await fetch(`/api/contracts/time-entries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    await fetchEntries()
    return { success: true }
  }, [fetchEntries])

  return { entries, pairs, totals, isLoading, error, canEdit, record, update, refresh: fetchEntries }
}
