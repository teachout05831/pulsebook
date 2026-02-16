'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { WIDGET_SECTION_TYPES } from '@/features/estimate-pages/types'
import type { PageSection, DesignTheme, BrandKit } from '@/features/estimate-pages/types'

const PageBuilder = dynamic(
  () => import('@/features/estimate-pages/components/page-builder/PageBuilder').then((mod) => ({ default: mod.PageBuilder })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    ),
  }
)

interface WidgetBuilderClientProps {
  widgetType: string
  initialSections: PageSection[]
  initialTheme: DesignTheme
  brandKit: BrandKit | null
}

export function WidgetBuilderClient({
  widgetType,
  initialSections,
  initialTheme,
  brandKit,
}: WidgetBuilderClientProps) {
  const [key, setKey] = useState(0)

  const handleTemplateLoad = async (data: { sections: PageSection[], designTheme: DesignTheme }) => {
    try {
      const res = await fetch(`/api/settings/consultations/widgets/${widgetType}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: data.sections,
          designTheme: data.designTheme,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to load template')
      }

      // Force re-render with new data by changing key
      setKey((k) => k + 1)
      toast.success('Template loaded successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load template')
    }
  }

  return (
    <PageBuilder
      key={key}
      pageId={widgetType}
      initialSections={initialSections}
      initialTheme={initialTheme}
      initialIncentiveConfig={null}
      estimate={null}
      customer={null}
      brandKit={brandKit}
      mode="widget"
      saveEndpoint={`/api/settings/consultations/widgets/${widgetType}`}
      allowedSectionTypes={WIDGET_SECTION_TYPES}
      backHref="/settings/consultations"
      onTemplateLoad={handleTemplateLoad}
    />
  )
}
