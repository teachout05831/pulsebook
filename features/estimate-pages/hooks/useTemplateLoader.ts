'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { WIDGET_SECTION_TYPES } from '../types/constants'
import type { PageTemplate, PageSection, DesignTheme } from '../types'

interface UseTemplateLoaderProps {
  open: boolean
}

export function useTemplateLoader({ open }: UseTemplateLoaderProps) {
  const [templates, setTemplates] = useState<PageTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    if (!open) return
    setIsLoading(true)
    fetch('/api/estimate-pages/templates')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((json) => setTemplates(json.data || []))
      .catch(() => toast.error('Failed to load templates'))
      .finally(() => setIsLoading(false))
  }, [open])

  const loadTemplate = async (
    templateId: string,
    onSuccess: (data: { sections: PageSection[], designTheme: DesignTheme }) => void
  ) => {
    setIsApplying(true)
    try {
      const res = await fetch(`/api/estimate-pages/templates/${templateId}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load template')

      const template: PageTemplate = json.data

      // Filter sections to only widget-compatible types
      const widgetSections = template.sections.filter((section) =>
        WIDGET_SECTION_TYPES.includes(section.type)
      )

      onSuccess({
        sections: widgetSections,
        designTheme: template.designTheme || {},
      })

      toast.success(`Loaded ${widgetSections.length} sections from "${template.name}"`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load template')
    } finally {
      setIsApplying(false)
    }
  }

  const filterTemplates = (templates: PageTemplate[], search: string) => {
    return templates.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  return { templates, isLoading, isApplying, loadTemplate, filterTemplates }
}
