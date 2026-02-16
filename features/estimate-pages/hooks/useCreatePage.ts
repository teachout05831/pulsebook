'use client'

import { useState, useCallback } from 'react'
import type { PageSection, DesignTheme, IncentiveConfig } from '../types'

interface CreatePageInput {
  estimateId: string
  templateId?: string
}

interface CreatePageResult {
  id: string
  publicToken: string
}

export function useCreatePage() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPage = useCallback(
    async (input: CreatePageInput): Promise<{ id: string } | { error: string }> => {
      setIsCreating(true)
      setError(null)

      try {
        let sections: PageSection[] | undefined
        let designTheme: DesignTheme | undefined
        let incentiveConfig: IncentiveConfig | undefined

        // If a template is selected, fetch its sections and theme first
        if (input.templateId) {
          const tplRes = await fetch(
            `/api/estimate-pages/templates/${input.templateId}`
          )

          if (!tplRes.ok) {
            const tplJson = await tplRes.json()
            const msg = tplJson.error || 'Failed to load template'
            setError(msg)
            return { error: msg }
          }

          const tplJson = await tplRes.json()
          const template = tplJson.data
          sections = template.sections
          designTheme = template.designTheme
          incentiveConfig = template.incentiveConfig || undefined
        }

        // Create the estimate page
        const res = await fetch('/api/estimate-pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estimateId: input.estimateId,
            templateId: input.templateId,
            sections,
            designTheme,
            incentiveConfig,
          }),
        })

        const json = await res.json()

        if (!res.ok) {
          const msg = json.error || 'Failed to create page'
          setError(msg)
          return { error: msg }
        }

        const result = json.data as CreatePageResult
        return { id: result.id }
      } catch {
        const msg = 'Failed to create page'
        setError(msg)
        return { error: msg }
      } finally {
        setIsCreating(false)
      }
    },
    []
  )

  return { createPage, isCreating, error }
}
