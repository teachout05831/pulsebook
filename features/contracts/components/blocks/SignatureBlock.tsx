'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PenLine, Check, RotateCcw } from 'lucide-react'
import { SignaturePad } from '../SignaturePad'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

function fmtSignedAt(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function SigHeader({ label, role, description }: { label: string; role: string; description?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label} ({role})</p>
      {description && <p className="text-sm text-foreground">{description}</p>}
    </div>
  )
}

export function SignatureBlock({ block, mode, onUpdate }: Props) {
  const role = (block.content.role as string) || 'Customer'
  const label = (block.content.label as string) || 'Signature'
  const signed = (block.content.signed as boolean) || false
  const signatureData = block.content.signatureData as string | undefined
  const signedAt = block.content.signedAt as string | undefined
  const description = (block.content.description as string) || ''
  const [confirmRedo, setConfirmRedo] = useState(false)

  const handleCapture = (data: string) => {
    onUpdate?.({ ...block.content, signed: true, signatureData: data, signedAt: new Date().toISOString() })
    setConfirmRedo(false)
  }

  const handleRedo = () => {
    onUpdate?.({ ...block.content, signed: false, signatureData: undefined, signedAt: undefined })
    setConfirmRedo(false)
  }

  if (mode === 'live') {
    if (signed && signatureData && !confirmRedo) {
      return (
        <div className="space-y-2">
          <SigHeader label={label} role={role} description={description} />
          <div className="rounded border p-4 bg-white">
            <img src={signatureData} alt={`${role} signature`} className="h-16 object-contain" />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-xs font-medium">Signed</span>
                {signedAt && <span className="text-xs text-muted-foreground ml-1">{fmtSignedAt(signedAt)}</span>}
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground"
                onClick={() => setConfirmRedo(true)}>
                <RotateCcw className="h-3 w-3 mr-1" /> Redo
              </Button>
            </div>
          </div>
        </div>
      )
    }
    if (confirmRedo) {
      return (
        <div className="space-y-2">
          <SigHeader label={label} role={role} description={description} />
          <div className="rounded border border-yellow-300 bg-yellow-50 p-4 text-center space-y-2">
            <p className="text-sm">Clear this signature and sign again?</p>
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="destructive" onClick={handleRedo}>Yes, Redo</Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmRedo(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="space-y-2">
        <SigHeader label={label} role={role} description={description} />
        <SignaturePad onCapture={handleCapture} />
      </div>
    )
  }

  if (mode === 'view') {
    return (
      <div className="space-y-2">
        <SigHeader label={label} role={role} description={description} />
        {signed && signatureData ? (
          <div className="rounded border p-4 bg-white">
            <img src={signatureData} alt={`${role} signature`} className="h-16 object-contain" />
            {signedAt && <p className="text-xs text-muted-foreground mt-2">Signed {fmtSignedAt(signedAt)}</p>}
          </div>
        ) : (
          <div className="flex items-center justify-center rounded border-2 border-dashed border-muted-foreground/30 p-8">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <PenLine className="h-6 w-6" />
              <span className="text-sm">Awaiting signature</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Role</label>
          <Select value={role} onValueChange={(val) => onUpdate?.({ ...block.content, role: val })}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Technician">Technician</SelectItem>
              <SelectItem value="Witness">Witness</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Label</label>
          <Input value={label} placeholder="Signature label"
            onChange={(e) => onUpdate?.({ ...block.content, label: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Description (shown to signer)</label>
        <Textarea value={description} placeholder="e.g. I acknowledge the start time and agree to the terms above."
          rows={2} onChange={(e) => onUpdate?.({ ...block.content, description: e.target.value })} />
      </div>
      <div className="flex flex-col items-center gap-1 rounded border-2 border-dashed border-muted-foreground/30 p-6 text-muted-foreground">
        <PenLine className="h-5 w-5" />
        <span className="text-xs">Signature area placeholder</span>
      </div>
    </div>
  )
}
