'use client'

import { useState, useCallback, useEffect } from 'react'
import { useOfflineContracts } from './useOfflineContracts'
import { offlineFetch } from '../utils/offlineFetch'
import type { ContractInstance } from '../types'

export function useContractInstance(instanceId: string | null) {
  const [instance, setInstance] = useState<ContractInstance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { cacheInstance, getCachedInstance, queueAction } = useOfflineContracts()

  const fetchInstance = useCallback(async () => {
    if (!instanceId) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/contracts/instances/${instanceId}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setInstance(json.data)
      cacheInstance(json.data)
    } catch (e) {
      // Offline fallback: try IndexedDB cache
      const cached = await getCachedInstance(instanceId)
      if (cached) {
        setInstance(cached)
        setError(null)
      } else {
        setError(e instanceof Error ? e.message : 'Failed to load')
      }
    } finally {
      setIsLoading(false)
    }
  }, [instanceId, cacheInstance, getCachedInstance])

  useEffect(() => { fetchInstance() }, [fetchInstance])

  const update = useCallback(async (changes: {
    status?: string
    filledBlocks?: unknown[]
  }) => {
    if (!instanceId) return { error: 'No instance selected' }
    const res = await offlineFetch(
      `/api/contracts/instances/${instanceId}`,
      { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) },
      queueAction
    )
    if (res) {
      const json = await res.json()
      if (!res.ok) return { error: json.error }
      await fetchInstance()
      return { success: true }
    }
    // Offline: update local state optimistically
    if (instance) {
      const updated = { ...instance, ...changes } as ContractInstance
      setInstance(updated)
      cacheInstance(updated)
    }
    return { success: true }
  }, [instanceId, fetchInstance, queueAction, instance, cacheInstance])

  return { instance, isLoading, error, update, refresh: fetchInstance }
}
