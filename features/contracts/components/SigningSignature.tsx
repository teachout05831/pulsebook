'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { SignaturePad } from './SignaturePad'
import type { ContractInstance } from '../types'

interface Props {
  contract: ContractInstance
  onSubmit: (data: {
    blockId: string; signerRole: string; signerName: string
    signerEmail?: string; signatureData: string
  }) => Promise<{ error?: string; success?: boolean }>
  isSubmitting: boolean
  onBack: () => void
}

export function SigningSignature({ contract, onSubmit, isSubmitting, onBack }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [signatureData, setSignatureData] = useState<string | null>(null)

  const sigBlock = (contract.filledBlocks || []).find((b) => b.type === 'signature')
  const blockId = sigBlock?.id || 'default-signature'

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error('Please enter your name'); return }
    if (!signatureData) { toast.error('Please sign above'); return }

    const result = await onSubmit({
      blockId,
      signerRole: 'customer',
      signerName: name.trim(),
      signerEmail: email.trim() || undefined,
      signatureData,
    })
    if (result.error) toast.error(result.error)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Sign Contract</h2>
        <p className="text-sm text-muted-foreground">
          Enter your name and sign below to complete the contract.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Full Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
        </div>
        <div className="space-y-1.5">
          <Label>Email (optional)</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Signature *</Label>
        <SignaturePad onCapture={setSignatureData} />
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={isSubmitting}>Back</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim() || !signatureData} className="flex-1">
          {isSubmitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Submit Signature
        </Button>
      </div>
    </div>
  )
}
