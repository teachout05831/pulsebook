'use client'

import { Loader2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlockRenderer } from './BlockRenderer'
import { OfflineBanner } from '@/components/OfflineBanner'
import { useContractLive } from '../hooks/useContractLive'
import { STAGE_COLORS } from '../types'
import type { BlockStage, ContractBlock } from '../types'

interface Props {
  instanceId: string
  onClose: () => void
}

const STAGE_ORDER: BlockStage[] = ['before_job', 'neutral', 'crew', 'after_job']

function groupByStage(blocks: ContractBlock[]) {
  const groups: { stage: BlockStage; blocks: ContractBlock[] }[] = []
  for (const stage of STAGE_ORDER) {
    const stageBlocks = blocks.filter(b => b.stage === stage)
    if (stageBlocks.length > 0) groups.push({ stage, blocks: stageBlocks })
  }
  return groups
}

export function ContractLiveView({ instanceId, onClose }: Props) {
  const {
    instance, filledBlocks, isLoading, error, isSaving,
    updateBlock, completeContract, pendingSyncs,
  } = useContractLive(instanceId)

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !instance) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || 'Contract not found'}</p>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    )
  }

  const templateName = instance.templateSnapshot?.name || 'Contract'
  const groups = groupByStage(filledBlocks)
  const isCompleted = instance.status === 'completed'

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      <OfflineBanner pendingSyncs={pendingSyncs} />
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{templateName}</h2>
          <p className="text-xs text-muted-foreground">
            {isCompleted ? 'Completed' : 'In Progress'}
            {isSaving && ' — Saving...'}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {groups.map(({ stage, blocks }) => {
          const color = STAGE_COLORS[stage]
          return (
            <div key={stage}>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color.border }} />
                <span className="text-xs font-medium text-muted-foreground uppercase">{color.label}</span>
              </div>
              <div className="space-y-4">
                {blocks.map(block => (
                  <div key={block.id} className="rounded-lg border p-4"
                    style={{ borderLeftColor: color.border, borderLeftWidth: 3, backgroundColor: block.settings?.background !== '#FFFFFF' ? block.settings?.background : undefined }}>
                    <BlockRenderer
                      block={block}
                      mode="live"
                      onUpdate={(content) => updateBlock(block.id, content)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {!isCompleted && (
          <div className="pt-4 border-t">
            <Button className="w-full" size="lg" onClick={completeContract}>
              <Check className="h-5 w-5 mr-2" /> Complete Contract
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
