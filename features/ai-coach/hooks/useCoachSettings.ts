'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AICoachSettings } from '../types'

const DEFAULT_SETTINGS: AICoachSettings = {
  enabled: true,
  showTranscript: true,
  showServiceSuggestions: true,
  showObjectionResponses: true,
  autoAdvanceStage: true,
}

export function useCoachSettings() {
  const [settings, setSettings] = useState<AICoachSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/settings/ai-coach')
        if (res.ok) {
          const data = await res.json()
          setSettings({ ...DEFAULT_SETTINGS, ...data })
        }
      } catch {
        // Use defaults on error
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const updateSettings = useCallback(async (updates: Partial<AICoachSettings>) => {
    const next = { ...settings, ...updates }
    setSettings(next)
    try {
      await fetch('/api/settings/ai-coach', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
    } catch {
      // Revert on error
      setSettings(settings)
    }
  }, [settings])

  return { settings, isLoading, updateSettings }
}
