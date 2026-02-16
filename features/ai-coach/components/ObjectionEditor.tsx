'use client'

import { useState } from 'react'
import { ChevronDown, Plus, Trash2, X } from 'lucide-react'
import { OBJECTION_PATTERNS } from '../constants/objectionPatterns'
import type { CoachLibraryCustomization, CustomObjection } from '../types'

const CATS = ['price', 'timing', 'competitor', 'trust', 'scope', 'custom'] as const
const inputCls = 'w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
const textareaCls = `${inputCls} min-h-[60px] resize-y`
const badgeCls = 'text-xs px-2 py-1 rounded-md'

interface Props {
  library: CoachLibraryCustomization
  onSave: (updates: Partial<CoachLibraryCustomization>) => Promise<{ success?: boolean; error?: string }>
}

export function ObjectionEditor({ library, onSave }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const [kwInput, setKwInput] = useState('')

  const saveOv = (id: string, field: string, value: unknown) => {
    const prev = library.objectionOverrides[id] || {}
    onSave({ objectionOverrides: { ...library.objectionOverrides, [id]: { ...prev, [field]: value || undefined } } })
  }
  const resetOv = (id: string) => { const { [id]: _, ...rest } = library.objectionOverrides; onSave({ objectionOverrides: rest }) }
  const addDefKw = (id: string) => {
    const kw = kwInput.trim().toLowerCase(); if (!kw) return
    const extra = library.objectionOverrides[id]?.extraKeywords || []
    const pat = OBJECTION_PATTERNS.find((p) => p.id === id)
    if (extra.includes(kw) || pat?.keywords.includes(kw)) { setKwInput(''); return }
    saveOv(id, 'extraKeywords', [...extra, kw]); setKwInput('')
  }
  const rmDefKw = (id: string, kw: string) => {
    const extra = library.objectionOverrides[id]?.extraKeywords || []
    saveOv(id, 'extraKeywords', extra.filter((k) => k !== kw))
  }
  const toggleDefKw = (id: string, kw: string) => { const d = library.objectionOverrides[id]?.disabledKeywords || []; saveOv(id, 'disabledKeywords', d.includes(kw) ? d.filter((k) => k !== kw) : [...d, kw]) }
  const addCo = () => {
    const id = `custom_${Date.now()}`
    onSave({ customObjections: [...library.customObjections, { id, keywords: [], category: 'custom', response: '', alternateResponses: [] }] }); setOpen(id)
  }
  const updCo = (id: string, u: Partial<CustomObjection>) => onSave({ customObjections: library.customObjections.map((co) => (co.id === id ? { ...co, ...u } : co)) })
  const rmCo = (id: string) => onSave({ customObjections: library.customObjections.filter((co) => co.id !== id) })
  const addCoKw = (id: string) => {
    const kw = kwInput.trim().toLowerCase(); if (!kw) return
    const co = library.customObjections.find((c) => c.id === id)
    if (!co || co.keywords.includes(kw)) { setKwInput(''); return }
    updCo(id, { keywords: [...co.keywords, kw] }); setKwInput('')
  }
  const rmCoKw = (id: string, kw: string) => {
    const co = library.customObjections.find((c) => c.id === id)
    if (co) updCo(id, { keywords: co.keywords.filter((k) => k !== kw) })
  }
  const kwEnter = (e: React.KeyboardEvent, fn: () => void) => { if (e.key === 'Enter') { e.preventDefault(); fn() } }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h4 className="text-sm font-semibold mb-1">Objection Responses</h4>
      <p className="text-xs text-muted-foreground mb-4">Customize responses to common objections and add custom patterns for your industry.</p>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Default Objections</p>
      <div className="space-y-2 mb-6">
        {OBJECTION_PATTERNS.map((pat) => {
          const isO = open === pat.id, ov = library.objectionOverrides[pat.id], extra = ov?.extraKeywords || []
          return (
            <div key={pat.id} className="border rounded-md overflow-hidden">
              <button onClick={() => setOpen(isO ? null : pat.id)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 capitalize`}>{pat.category}</span>
                  <span className="text-sm font-medium">{pat.id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  {ov && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">Customized</span>}
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isO ? 'rotate-180' : ''}`} />
              </button>
              {isO && (
                <div className="border-t px-4 py-4 space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Default keywords (click to toggle)</label>
                    <div className="flex flex-wrap gap-1.5">{pat.keywords.map((kw) => {
                      const off = (ov?.disabledKeywords || []).includes(kw)
                      return <button key={kw} onClick={() => toggleDefKw(pat.id, kw)} className={`${badgeCls} cursor-pointer transition-colors ${off ? 'bg-red-500/10 text-red-400 line-through opacity-60' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{kw}</button>
                    })}</div>
                  </div>
                  <div>
                    <label className="text-xs text-blue-500 mb-1 block">Custom keywords</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {extra.map((kw) => <span key={kw} className={`${badgeCls} bg-blue-500/10 text-blue-500 flex items-center gap-1`}>{kw}<button onClick={() => rmDefKw(pat.id, kw)}><X className="h-3 w-3" /></button></span>)}
                    </div>
                    <input value={kwInput} onChange={(e) => setKwInput(e.target.value)} onKeyDown={(e) => kwEnter(e, () => addDefKw(pat.id))} placeholder="Add keyword and press Enter..." className={inputCls} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-muted-foreground">Primary Response</label>
                      {ov && <button onClick={() => resetOv(pat.id)} className="text-xs text-muted-foreground hover:text-foreground">Reset all</button>}
                    </div>
                    <textarea defaultValue={ov?.response ?? ''} placeholder={pat.response} onBlur={(e) => saveOv(pat.id, 'response', e.target.value)} className={textareaCls} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Custom Objections</p>
      <div className="space-y-2 mb-4">
        {library.customObjections.map((co) => {
          const isO = open === co.id
          return (
            <div key={co.id} className="border rounded-md overflow-hidden">
              <button onClick={() => setOpen(isO ? null : co.id)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 capitalize">{co.category}</span>
                  <span className="text-sm font-medium">{co.keywords.length ? co.keywords.slice(0, 3).join(', ') : 'New Objection'}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-500/10 text-green-600">Custom</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isO ? 'rotate-180' : ''}`} />
              </button>
              {isO && (
                <div className="border-t px-4 py-4 space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Keywords</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {co.keywords.map((kw) => <span key={kw} className={`${badgeCls} bg-blue-500/10 text-blue-500 flex items-center gap-1`}>{kw}<button onClick={() => rmCoKw(co.id, kw)}><X className="h-3 w-3" /></button></span>)}
                    </div>
                    <input value={kwInput} onChange={(e) => setKwInput(e.target.value)} onKeyDown={(e) => kwEnter(e, () => addCoKw(co.id))} placeholder="Add keyword..." className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                    <select value={co.category} onChange={(e) => updCo(co.id, { category: e.target.value as CustomObjection['category'] })} className={inputCls}>
                      {CATS.map((cat) => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Response</label>
                    <textarea defaultValue={co.response} onBlur={(e) => updCo(co.id, { response: e.target.value })} placeholder="What should the rep say?" className={textareaCls} />
                  </div>
                  <button onClick={() => rmCo(co.id)} className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80"><Trash2 className="h-3 w-3" /> Remove</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button onClick={addCo} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4" /> Add Custom Objection</button>
    </div>
  )
}
