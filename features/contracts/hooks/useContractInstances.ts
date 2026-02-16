'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ContractInstance, CreateInstanceInput } from '../types'

export function useContractInstances(jobId: string) {
  const [instances, setInstances] = useState<ContractInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInstances = useCallback(async (signal?: AbortSignal) => {
    if (!jobId) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/contracts/instances?jobId=${jobId}`, { signal })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setInstances(json.data || [])
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    const controller = new AbortController()
    fetchInstances(controller.signal)
    return () => controller.abort()
  }, [fetchInstances])

  const create = useCallback(async (input: CreateInstanceInput) => {
    const res = await fetch('/api/contracts/instances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    await fetchInstances()
    return { success: true, data: json.data }
  }, [fetchInstances])

  return { instances, isLoading, error, create, refresh: fetchInstances }
}
