'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Square } from 'lucide-react'
import type { StopReasonConfig } from '@/types/company'

interface Props {
  reasons: StopReasonConfig[]
  onSelect: (reason: string, billable: boolean) => void
  children?: React.ReactNode
}

export function StopReasonPopover({ reasons, onSelect, children }: Props) {
  const [open, setOpen] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [showOther, setShowOther] = useState(false)

  const handleSelect = (reason: string, billable: boolean) => {
    onSelect(reason, billable)
    setOpen(false)
    setShowOther(false)
    setOtherText('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button size="sm" variant="destructive">
            <Square className="h-4 w-4 mr-1" /> Stop
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <p className="text-xs font-medium text-muted-foreground px-2 py-1">Why are you stopping?</p>
        <div className="space-y-1">
          {reasons.map((r) => (
            <Button key={r.label} variant="ghost" size="sm" className="w-full justify-between"
              onClick={() => handleSelect(r.label, r.billable)}>
              <span>{r.label}</span>
              <span className={`text-[10px] ${r.billable ? 'text-green-600' : 'text-muted-foreground'}`}>
                {r.billable ? 'billable' : 'non-bill'}
              </span>
            </Button>
          ))}
          {!showOther ? (
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground"
              onClick={() => setShowOther(true)}>Other...</Button>
          ) : (
            <div className="flex gap-1 px-1">
              <Input className="h-8 text-sm" placeholder="Reason" value={otherText}
                onChange={e => setOtherText(e.target.value)} autoFocus />
              <Button size="sm" className="h-8" disabled={!otherText.trim()}
                onClick={() => handleSelect(otherText.trim(), false)}>OK</Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
