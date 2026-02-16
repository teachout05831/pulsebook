'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { ContractInstance } from '../types'

interface Props {
  contract: ContractInstance
  onNext: () => void
  onBack: () => void
}

export function SigningTerms({ contract, onNext, onBack }: Props) {
  const [agreed, setAgreed] = useState(false)
  const name = contract.templateSnapshot?.name || 'Contract'

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Terms & Conditions</h2>
        <p className="text-sm text-muted-foreground">
          Please read and accept the terms before signing.
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
        <p className="text-sm leading-relaxed">
          By signing this {name}, you agree to the terms outlined in the contract
          including all pricing, scope of work, and conditions described in the
          preceding sections. This agreement is legally binding once signed by all
          parties. You acknowledge that you have reviewed the complete contract and
          understand your obligations.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          id="agree"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
        />
        <Label htmlFor="agree" className="text-sm cursor-pointer">
          I have read and agree to the terms and conditions
        </Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={!agreed} className="flex-1">
          Proceed to Sign
        </Button>
      </div>
    </div>
  )
}
