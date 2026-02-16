'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import type { CustomFieldDefinition, CustomFieldEntity, CustomFieldSection } from '../types'

export function useCustomFieldDefinitions(entityType: CustomFieldEntity) {
  const [definitions, setDefinitions] = useState<CustomFieldDefinition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDefinitions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/custom-fields?entityType=${entityType}`, { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setDefinitions(json.data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [entityType])

  useEffect(() => { fetchDefinitions() }, [fetchDefinitions])

  const sections: CustomFieldSection[] = useMemo(() => {
    const map = new Map<string, CustomFieldSection>()
    for (const def of definitions) {
      if (!map.has(def.section)) {
        map.set(def.section, { name: def.section, sectionOrder: def.sectionOrder, fields: [] })
      }
      map.get(def.section)!.fields.push(def)
    }
    return Array.from(map.values()).sort((a, b) => a.sectionOrder - b.sectionOrder)
  }, [definitions])

  const create = useCallback(async (input: Record<string, unknown>) => {
    const res = await fetch('/api/custom-fields', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, entityType }),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    if (json.data) {
      setDefinitions(prev => [...prev, json.data])
    }
    return { success: true, data: json.data }
  }, [entityType])

  const update = useCallback(async (id: string, input: Record<string, unknown>) => {
    const res = await fetch(`/api/custom-fields/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    setDefinitions(prev => prev.map(d => d.id === id ? { ...d, ...json.data } : d))
    return { success: true }
  }, [])

  const remove = useCallback(async (id: string) => {
    const prev = definitions
    setDefinitions(p => p.filter(d => d.id !== id))
    const res = await fetch(`/api/custom-fields/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) {
      setDefinitions(prev)
      return { error: json.error }
    }
    return { success: true }
  }, [definitions])

  return { definitions, sections, isLoading, error, create, update, remove, refresh: fetchDefinitions }
}
