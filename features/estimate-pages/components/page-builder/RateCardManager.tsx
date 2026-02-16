'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { RateCard, RateCardItem, RateCardInput } from '../../types'

const BLANK: RateCardItem = { name: '', description: '', unit: 'flat', basePrice: 0, minPrice: 0, maxPrice: 0 }
const UNITS: Record<RateCardItem['unit'], string> = { per_room: 'Per Room', per_hour: 'Per Hour', flat: 'Flat', per_sqft: 'Per SqFt' }

export function RateCardManager() {
  const [cards, setCards] = useState<RateCard[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<RateCardInput>({ name: '', category: '', items: [{ ...BLANK }] })

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/rate-cards');
      if (r.ok) { const json = await r.json(); setCards(Array.isArray(json) ? json : json.data || json.cards || []); }
    } catch { /* silent */ }
  }, [])
  useEffect(() => { load() }, [load])

  const open = (card?: RateCard) => {
    setEditingId(card?.id ?? null)
    setForm(card ? { name: card.name, category: card.category ?? '', items: card.items.length ? card.items : [{ ...BLANK }] } : { name: '', category: '', items: [{ ...BLANK }] })
    setDialogOpen(true)
  }
  const setItem = (i: number, f: keyof RateCardItem, v: string | number) => {
    setForm(p => ({ ...p, items: p.items.map((it, j) => j === i ? { ...it, [f]: v } : it) }))
  }
  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    const url = editingId ? `/api/rate-cards/${editingId}` : '/api/rate-cards'
    try {
      const r = await fetch(url, { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!r.ok) { toast.error((await r.json()).error ?? 'Save failed'); return }
      toast.success(editingId ? 'Rate card updated' : 'Rate card created')
      setDialogOpen(false); load()
    } catch { toast.error('Save failed') }
  }
  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const r = await fetch(`/api/rate-cards/${deleteId}`, { method: 'DELETE' })
      if (!r.ok) { toast.error('Delete failed'); return }
      toast.success('Rate card deleted'); setDeleteId(null); load()
    } catch { toast.error('Delete failed') }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Rate Cards</CardTitle>
          <CardDescription>Pricing references for AI estimate generation</CardDescription>
        </div>
        <Button size="sm" onClick={() => open()}><Plus className="h-4 w-4 mr-1" /> Add Rate Card</Button>
      </CardHeader>
      <CardContent>
        {cards.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No rate cards yet. Add one to get started.</p>
        ) : (
          <div className="border rounded-lg divide-y">
            {cards.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {c.category && <Badge variant="outline" className="text-xs">{c.category}</Badge>}
                    <span>{c.items.length} item{c.items.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => open(c)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteId(c.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Rate Card</DialogTitle>
            <DialogDescription>Define pricing items for estimate generation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Residential Cleaning" /></div>
              <div><Label>Category</Label><Input value={form.category ?? ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Cleaning" /></div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <Label>Items</Label>
              <Button variant="outline" size="sm" onClick={() => setForm(p => ({ ...p, items: [...p.items, { ...BLANK }] }))}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
            </div>
            {form.items.map((item, i) => (
              <div key={`rate-item-${i}`} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-end border rounded p-2">
                <div><Label className="text-xs">Name</Label><Input className="h-8 text-sm" value={item.name} onChange={e => setItem(i, 'name', e.target.value)} placeholder="Service" /></div>
                <div><Label className="text-xs">Unit</Label>
                  <Select value={item.unit} onValueChange={v => setItem(i, 'unit', v)}>
                    <SelectTrigger className="h-8 w-[110px] text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(UNITS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Base $</Label><Input className="h-8 w-20 text-sm" type="number" value={item.basePrice || ''} onChange={e => setItem(i, 'basePrice', +e.target.value)} /></div>
                <div><Label className="text-xs">Min $</Label><Input className="h-8 w-20 text-sm" type="number" value={item.minPrice || ''} onChange={e => setItem(i, 'minPrice', +e.target.value)} /></div>
                <div><Label className="text-xs">Max $</Label><Input className="h-8 w-20 text-sm" type="number" value={item.maxPrice || ''} onChange={e => setItem(i, 'maxPrice', +e.target.value)} /></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" disabled={form.items.length <= 1} onClick={() => setForm(p => ({ ...p, items: p.items.filter((_, j) => j !== i) }))}><Trash2 className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Rate Card?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone. The rate card will be permanently removed.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
