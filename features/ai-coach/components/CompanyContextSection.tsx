'use client'

import { useState } from 'react'
import type { CoachLibraryCustomization } from '../types'

interface Props {
  library: CoachLibraryCustomization
  onSave: (updates: Partial<CoachLibraryCustomization>) => Promise<{ success?: boolean; error?: string }>
  isSaving: boolean
}

export function CompanyContextSection({ library, onSave, isSaving }: Props) {
  const [value, setValue] = useState(library.companyContext)

  const handleBlur = () => {
    if (value !== library.companyContext) {
      onSave({ companyContext: value })
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h4 className="text-sm font-semibold mb-1">Company Context</h4>
      <p className="text-xs text-muted-foreground mb-4">
        Describe your company, industry, and unique selling points. This appears as a reminder card at the start of each call.
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        maxLength={2000}
        placeholder="Example: We are a residential HVAC company serving the greater Austin area. We specialize in energy-efficient AC installations and offer a 10-year parts warranty..."
        className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">
          {value.length}/2000 characters
        </span>
        {isSaving && <span className="text-xs text-muted-foreground">Saving...</span>}
      </div>
    </div>
  )
}
