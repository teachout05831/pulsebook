'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { COACHING_CARDS } from '../constants/coachingLibrary'
import { STAGE_ORDER } from '../constants/stagePatterns'
import type { CoachLibraryCustomization, StageOverride, SalesStage } from '../types'

interface Props {
  library: CoachLibraryCustomization
  onSave: (updates: Partial<CoachLibraryCustomization>) => Promise<{ success?: boolean; error?: string }>
}

export function StageScriptsEditor({ library, onSave }: Props) {
  const [open, setOpen] = useState<SalesStage | null>(null)

  const getOverride = (stage: SalesStage, cardId: string, field: 'title' | 'body' | 'scriptText') => {
    const card = library.stageOverrides[stage]?.cards?.find((c) => c.id === cardId)
    return card?.[field]
  }

  const saveCardField = (stage: SalesStage, cardId: string, field: string, value: string) => {
    const prev = library.stageOverrides[stage] || {}
    const prevCards = prev.cards || []
    const existing = prevCards.find((c) => c.id === cardId)
    const updated = existing ? { ...existing, [field]: value || undefined } : { id: cardId, [field]: value || undefined }
    const cards = existing ? prevCards.map((c) => (c.id === cardId ? updated : c)) : [...prevCards, updated]
    const stageOverrides = { ...library.stageOverrides, [stage]: { ...prev, cards } }
    onSave({ stageOverrides })
  }

  const resetCard = (stage: SalesStage, cardId: string) => {
    const prev = library.stageOverrides[stage]
    if (!prev?.cards) return
    const cards = prev.cards.filter((c) => c.id !== cardId)
    const override: StageOverride = { ...prev, cards: cards.length ? cards : undefined }
    const stageOverrides = { ...library.stageOverrides, [stage]: override }
    onSave({ stageOverrides })
  }

  const isCustomized = (stage: SalesStage) =>
    (library.stageOverrides[stage]?.cards?.length ?? 0) > 0

  return (
    <div className="rounded-lg border bg-card p-6">
      <h4 className="text-sm font-semibold mb-1">Stage Coaching Scripts</h4>
      <p className="text-xs text-muted-foreground mb-4">
        Customize what the coach says at each sales stage. Leave blank to use defaults.
      </p>
      <div className="space-y-2">
        {STAGE_ORDER.map((stage) => {
          const defaults = COACHING_CARDS[stage] || []
          const isOpen = open === stage
          return (
            <div key={stage} className="border rounded-md overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : stage)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{stage.replace(/_/g, ' ')}</span>
                  <span className="text-xs text-muted-foreground">({defaults.length} card{defaults.length !== 1 ? 's' : ''})</span>
                  {isCustomized(stage) && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">Customized</span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t px-4 py-4 space-y-6">
                  {defaults.map((card) => {
                    const hasOverride = !!library.stageOverrides[stage]?.cards?.find((c) => c.id === card.id)
                    return (
                      <div key={card.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">{card.id}</span>
                          {hasOverride ? (
                            <button onClick={() => resetCard(stage, card.id)} className="text-xs text-muted-foreground hover:text-foreground">
                              Reset to default
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">Using default</span>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                          <input
                            defaultValue={getOverride(stage, card.id, 'title') ?? ''}
                            placeholder={card.title}
                            onBlur={(e) => saveCardField(stage, card.id, 'title', e.target.value)}
                            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Body</label>
                          <textarea
                            defaultValue={getOverride(stage, card.id, 'body') ?? ''}
                            placeholder={card.body}
                            onBlur={(e) => saveCardField(stage, card.id, 'body', e.target.value)}
                            className="w-full min-h-[50px] rounded-md border bg-background px-3 py-1.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        {card.scriptText !== undefined && (
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Script Text</label>
                            <textarea
                              defaultValue={getOverride(stage, card.id, 'scriptText') ?? ''}
                              placeholder={card.scriptText}
                              onBlur={(e) => saveCardField(stage, card.id, 'scriptText', e.target.value)}
                              className="w-full min-h-[60px] rounded-md border bg-background px-3 py-1.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        )}
                        {card !== defaults[defaults.length - 1] && <hr className="border-muted" />}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
