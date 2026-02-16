'use client'

import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BlockRenderer } from './BlockRenderer'
import { TimeTrackingTable } from './TimeTrackingTable'
import { STAGE_COLORS } from '../types'
import { useContractInstance } from '../hooks/useContractInstance'

interface Props {
  instanceId: string
  onClose: () => void
}

export function ContractViewer({ instanceId, onClose }: Props) {
  const { instance, isLoading, error } = useContractInstance(instanceId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !instance) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-destructive">{error || 'Contract not found'}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onClose}>
          Go Back
        </Button>
      </div>
    )
  }

  const blocks = instance.filledBlocks || []
  const templateName = instance.templateSnapshot?.name || 'Contract'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{templateName}</h3>
          <p className="text-sm text-muted-foreground">
            Status: <Badge variant="outline" className="ml-1">{instance.status}</Badge>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
      </div>

      {blocks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          This contract has no content blocks.
        </p>
      ) : (
        <div className="space-y-3 border rounded-lg p-4 bg-white">
          {blocks.map((block) => {
            const stageColor = STAGE_COLORS[block.stage]
            return (
              <div
                key={block.id}
                className="rounded-md p-4"
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

      <TimeTrackingTable contractId={instanceId} />
    </div>
  )
}
