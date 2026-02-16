'use client'

import { Button } from '@/components/ui/button'
import { BlockRenderer } from './BlockRenderer'
import { STAGE_COLORS } from '../types'
import type { ContractInstance } from '../types'

interface Props {
  contract: ContractInstance
  onNext: () => void
}

export function SigningReview({ contract, onNext }: Props) {
  const blocks = contract.filledBlocks || []
  const name = contract.templateSnapshot?.name || 'Contract'

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">Please review the contract details below.</p>
      </div>

      {blocks.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No content to display.</p>
      ) : (
        <div className="space-y-2">
          {blocks.map((block) => {
            const color = STAGE_COLORS[block.stage]
            return (
              <div
                key={block.id}
                className="rounded-md p-3"
                style={{ borderLeft: `3px solid ${color.border}`, backgroundColor: color.bg }}
              >
                <BlockRenderer block={block} mode="view" />
              </div>
            )
          })}
        </div>
      )}

      <div className="pt-4">
        <Button onClick={onNext} className="w-full">Continue to Pricing</Button>
      </div>
    </div>
  )
}
