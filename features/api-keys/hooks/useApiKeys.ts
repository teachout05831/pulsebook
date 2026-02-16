'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ApiKey, CreateApiKeyInput, CreateApiKeyResult } from '../types'

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApiKeys = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/api-keys', { signal })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setApiKeys(json.data || [])
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchApiKeys(controller.signal)
    return () => controller.abort()
  }, [fetchApiKeys])

  const create = useCallback(async (input: CreateApiKeyInput): Promise<{ error?: string; data?: CreateApiKeyResult }> => {
    const res = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    if (json.data) {
      setApiKeys(prev => [...prev, json.data])
    }
    return { data: json.data }
  }, [])

  const remove = useCallback(async (id: string) => {
    const prev = apiKeys
    setApiKeys(p => p.filter(k => k.id !== id))
    const res = await fetch(`/api/api-keys/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) {
      setApiKeys(prev)
      return { error: json.error }
    }
    return { success: true }
  }, [apiKeys])

  const update = useCallback(async (id: string, input: { name: string }) => {
    const res = await fetch(`/api/api-keys/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, ...input } : k))
    return { success: true }
  }, [])

  return { apiKeys, isLoading, error, create, remove, update, refresh: fetchApiKeys }
}
