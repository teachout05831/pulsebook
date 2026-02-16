'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { ContractTemplate, ContractBlock } from '../types'

export function useContractBuilderPage(templateId: string) {
  const [template, setTemplate] = useState<ContractTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/contracts/templates/${templateId}`)
      .then((r) => r.json())
      .then((d) => setTemplate(d.data))
      .catch(() => toast.error('Failed to load template'))
      .finally(() => setIsLoading(false))
  }, [templateId])

  const handleSave = useCallback(async (blocks: ContractBlock[]) => {
    const res = await fetch(`/api/contracts/templates/${templateId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    })
    if (!res.ok) { toast.error('Failed to save'); return }
    toast.success('Template saved')
  }, [templateId])

  return { template, isLoading, handleSave }
}
