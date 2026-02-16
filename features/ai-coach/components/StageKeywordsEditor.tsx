'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { STAGE_CONFIGS } from '../constants/stagePatterns'
import { STAGE_ORDER } from '../constants/stagePatterns'
import type { CoachLibraryCustomization, SalesStage } from '../types'

interface Props {
  library: CoachLibraryCustomization
  onSave: (updates: Partial<CoachLibraryCustomization>) => Promise<{ success?: boolean; error?: string }>
}

export function StageKeywordsEditor({ library, onSave }: Props) {
  const [open, setOpen] = useState<SalesStage | null>(null)
  const [input, setInput] = useState('')

  const getDefaultKeywords = (stage: SalesStage) => {
    const config = STAGE_CONFIGS.find((c) => c.stage === stage)
    return config ? config.keywords.flat() : []
  }

  const getCustomKeywords = (stage: SalesStage): string[] => {
    const extra = library.stageOverrides[stage]?.extraKeywords
    return extra ? extra.flat() : []
  }

  const getDisabled = (stage: SalesStage) => library.stageOverrides[stage]?.disabledKeywords || []

  const toggleDefault = (stage: SalesStage, kw: string) => {
    const prev = library.stageOverrides[stage] || {}
    const dis = prev.disabledKeywords || []
    const disabledKeywords = dis.includes(kw) ? dis.filter((k) => k !== kw) : [...dis, kw]
    onSave({ stageOverrides: { ...library.stageOverrides, [stage]: { ...prev, disabledKeywords: disabledKeywords.length ? disabledKeywords : undefined } } })
  }

  const addKeyword = (stage: SalesStage) => {
    const keyword = input.trim().toLowerCase()
    if (!keyword) return
    const existing = getCustomKeywords(stage)
    if (existing.includes(keyword) || getDefaultKeywords(stage).includes(keyword)) {
      setInput('')
      return
    }
    const prev = library.stageOverrides[stage] || {}
    const extraKeywords = [...(prev.extraKeywords || []), [keyword]]
    const stageOverrides = { ...library.stageOverrides, [stage]: { ...prev, extraKeywords } }
    onSave({ stageOverrides })
    setInput('')
  }

  const removeKeyword = (stage: SalesStage, keyword: string) => {
    const prev = library.stageOverrides[stage]
    if (!prev?.extraKeywords) return
    const extraKeywords = prev.extraKeywords.filter((g) => g[0] !== keyword)
    const stageOverrides = {
      ...library.stageOverrides,
      [stage]: { ...prev, extraKeywords: extraKeywords.length ? extraKeywords : undefined },
    }
    onSave({ stageOverrides })
  }

  const handleKeyDown = (e: React.KeyboardEvent, stage: SalesStage) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword(stage)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h4 className="text-sm font-semibold mb-1">Stage Keywords</h4>
      <p className="text-xs text-muted-foreground mb-4">
        Click default keywords to disable them. Add custom keywords for your industry.
      </p>
      <div className="space-y-2">
        {STAGE_ORDER.map((stage) => {
          const defaults = getDefaultKeywords(stage)
          const custom = getCustomKeywords(stage)
          const disabled = getDisabled(stage)
          const isOpen = open === stage
          return (
            <div key={stage} className="border rounded-md overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : stage)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{stage.replace(/_/g, ' ')}</span>
                  {custom.length > 0 && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">
                      +{custom.length} custom
                    </span>
                  )}
                  {disabled.length > 0 && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                      {disabled.length} disabled
                    </span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t px-4 py-4 space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Default keywords (click to toggle)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {defaults.map((kw) => {
                        const off = disabled.includes(kw)
                        return (
                          <button key={kw} onClick={() => toggleDefault(stage, kw)} className={`text-xs px-2 py-1 rounded-md transition-colors cursor-pointer ${off ? 'bg-red-500/10 text-red-400 line-through opacity-60' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{kw}</button>
                        )
                      })}
                    </div>
                  </div>
                  {custom.length > 0 && (
                    <div>
                      <label className="text-xs text-blue-500 mb-2 block">Custom keywords</label>
                      <div className="flex flex-wrap gap-1.5">
                        {custom.map((kw) => (
                          <span key={kw} className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 flex items-center gap-1">
                            {kw}
                            <button onClick={() => removeKeyword(stage, kw)} className="hover:text-blue-300">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, stage)}
                    placeholder="Type a keyword and press Enter..."
                    className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
