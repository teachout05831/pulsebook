'use client'

import '../styles/print.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BlockRenderer } from './BlockRenderer'
import { fillVariables } from '../utils/fillVariables'
import { migrateBlocks } from '../utils/migrateBlocks'
import { STAGE_COLORS } from '../types'
import type { ContractTemplate, ContractBlock } from '../types'

interface Props {
  templateId: string
}

export function ContractLiveTest({ templateId }: Props) {
  const router = useRouter()
  const [template, setTemplate] = useState<ContractTemplate | null>(null)
  const [blocks, setBlocks] = useState<ContractBlock[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/contracts/templates/${templateId}`)
      .then((r) => r.json())
      .then((d) => {
        setTemplate(d.data)
        setBlocks(fillVariables(migrateBlocks(d.data?.blocks || [])))
      })
      .catch(() => toast.error('Failed to load template'))
      .finally(() => setIsLoading(false))
  }, [templateId])

  const handleBlockUpdate = (blockId: string, content: Record<string, unknown>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content: { ...b.content, ...content } } : b))
    )
  }

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-blue-700" onClick={() => router.push('/settings')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Exit Test
          </Button>
          <span className="text-sm font-medium">LIVE TEST MODE — Interactive</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-blue-700" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-blue-700" onClick={() => router.push(`/contracts/builder/${templateId}`)}>
            Edit Template
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto my-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden contract-print-area">
          <div className="px-8 py-6 border-b bg-gray-50">
            <h1 className="text-xl font-bold">{template.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{template.category} Contract</p>
          </div>
          <div className="space-y-0">
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
                  <BlockRenderer
                    block={block}
                    mode="live"
                    onUpdate={(content) => handleBlockUpdate(block.id, content)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
