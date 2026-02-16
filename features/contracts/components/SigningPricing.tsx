'use client'

import { Button } from '@/components/ui/button'
import { BlockRenderer } from './BlockRenderer'
import type { ContractInstance } from '../types'

interface Props {
  contract: ContractInstance
  onNext: () => void
  onBack: () => void
}

export function SigningPricing({ contract, onNext, onBack }: Props) {
  const blocks = contract.filledBlocks || []
  const pricingBlocks = blocks.filter((b) => b.type === 'pricing_table')

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Pricing Summary</h2>
        <p className="text-sm text-muted-foreground">Review the pricing details for this contract.</p>
      </div>

      {pricingBlocks.length === 0 ? (
        <div className="border rounded-lg p-6 text-center text-muted-foreground">
          <p className="text-sm">No pricing information included in this contract.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pricingBlocks.map((block) => (
            <div key={block.id} className="border rounded-lg p-4">
              <BlockRenderer block={block} mode="view" />
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue to Terms</Button>
      </div>
    </div>
  )
}
