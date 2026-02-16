'use client'

import { useState, useEffect } from 'react'
import { defaultTimeTrackingSettings } from '@/types/company'
import type { TimeTrackingSettings } from '@/types/company'

export function useCompanyTimeSettings() {
  const [settings, setSettings] = useState<TimeTrackingSettings>(defaultTimeTrackingSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/company')
        if (!res.ok) return
        const json = await res.json()
        const ts = json.data?.settings?.timeTracking
        if (ts) setSettings({ ...defaultTimeTrackingSettings, ...ts })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return { settings, isLoading }
}
