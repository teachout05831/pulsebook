'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ContractTemplate, CreateTemplateInput, UpdateTemplateInput } from '../types'

export function useContractTemplates() {
  const [templates, setTemplates] = useState<ContractTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contracts/templates')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setTemplates(json.data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  const create = useCallback(async (input: CreateTemplateInput) => {
    const res = await fetch('/api/contracts/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    await fetchTemplates()
    return { success: true, data: json.data }
  }, [fetchTemplates])

  const update = useCallback(async (id: string, input: UpdateTemplateInput) => {
    const res = await fetch(`/api/contracts/templates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    await fetchTemplates()
    return { success: true }
  }, [fetchTemplates])

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/contracts/templates/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    await fetchTemplates()
    return { success: true }
  }, [fetchTemplates])

  const seedSamples = useCallback(async () => {
    const res = await fetch('/api/contracts/templates/seed', { method: 'POST' })
    const json = await res.json()
    if (!res.ok) return { error: json.error }
    await fetchTemplates()
    return { success: true, count: json.data?.count || 0 }
  }, [fetchTemplates])

  return { templates, isLoading, error, create, update, remove, seedSamples, refresh: fetchTemplates }
}
