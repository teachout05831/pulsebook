'use client'

import '../styles/print.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Pencil, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { BlockRenderer } from './BlockRenderer'
import { migrateBlocks } from '../utils/migrateBlocks'
import { STAGE_COLORS } from '../types'
import type { ContractTemplate } from '../types'

interface Props {
  templateId: string
}

export function ContractTemplatePreview({ templateId }: Props) {
  const router = useRouter()
  const [template, setTemplate] = useState<ContractTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/contracts/templates/${templateId}`)
      .then((r) => r.json())
      .then((d) => setTemplate(d.data))
      .catch(() => toast.error('Failed to load template'))
      .finally(() => setIsLoading(false))
  }, [templateId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-destructive">Template not found</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const blocks = migrateBlocks(template.blocks || [])

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6 no-print">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{template.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-xs">{template.category}</Badge>
              <span className="text-xs text-muted-foreground">{blocks.length} blocks</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 no-print">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          <Button size="sm" onClick={() => router.push(`/contracts/builder/${templateId}`)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit Template
          </Button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <p className="text-muted-foreground">This template has no blocks yet.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => router.push(`/contracts/builder/${templateId}`)}
          >
            Open in Builder
          </Button>
        </div>
      ) : (
        <div className="space-y-0 border rounded-lg bg-white shadow-sm overflow-hidden contract-print-area">
          {blocks.map((block) => {
            const stageColor = STAGE_COLORS[block.stage]
            return (
              <div
                key={block.id}
                className="px-6 py-4"
                style={{
                  borderLeft: `4px solid ${stageColor.border}`,
                  backgroundColor: block.settings?.background !== '#FFFFFF' ? block.settings?.background : stageColor.bg,
                }}
              >
                <BlockRenderer block={block} mode="view" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
