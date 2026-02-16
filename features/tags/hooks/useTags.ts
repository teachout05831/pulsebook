'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Tag, TagEntityType } from '../types'

export function useTags(entityType: TagEntityType = 'customer') {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/tags?entityType=${entityType}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setTags(json.data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [entityType])

  useEffect(() => { fetchTags() }, [fetchTags])

  const create = useCallback(async (input: { name: string; color?: string }) => {
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, entityType }),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    if (json.data) {
      setTags(prev => [...prev, json.data])
    }
    return { success: true, data: json.data }
  }, [entityType])

  const update = useCallback(async (id: string, input: { name?: string; color?: string }) => {
    const res = await fetch(`/api/tags/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    setTags(prev => prev.map(t => t.id === id ? { ...t, ...input } : t))
    return { success: true }
  }, [])

  const remove = useCallback(async (id: string) => {
    const prev = tags
    setTags(p => p.filter(t => t.id !== id))
    const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) {
      setTags(prev)
      return { error: json.error }
    }
    return { success: true }
  }, [tags])

  return { tags, isLoading, error, create, update, remove, refresh: fetchTags }
}
