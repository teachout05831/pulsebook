'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CoachLibraryCustomization } from '../types'

const EMPTY: CoachLibraryCustomization = {
  companyContext: '',
  stageOverrides: {},
  objectionOverrides: {},
  customObjections: [],
}

export function useCoachLibrary() {
  const [library, setLibrary] = useState<CoachLibraryCustomization>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/settings/ai-coach/library')
        if (res.ok) {
          const data = await res.json()
          setLibrary({ ...EMPTY, ...data })
        }
      } catch {
        // defaults
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const saveLibrary = useCallback(
    async (updates: Partial<CoachLibraryCustomization>) => {
      const prev = library
      const next = { ...library, ...updates }
      setLibrary(next)
      setIsSaving(true)
      try {
        const res = await fetch('/api/settings/ai-coach/library', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        })
        if (!res.ok) throw new Error()
        return { success: true }
      } catch {
        setLibrary(prev)
        return { error: 'Failed to save' }
      } finally {
        setIsSaving(false)
      }
    },
    [library]
  )

  const resetToDefaults = useCallback(async () => {
    return saveLibrary(EMPTY)
  }, [saveLibrary])

  return { library, isLoading, isSaving, saveLibrary, resetToDefaults }
}
