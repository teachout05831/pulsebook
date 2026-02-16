'use client'

import { useState, useCallback, useEffect } from 'react'
import type { CustomerNote, NoteActionResult } from '../types'

export function useCustomerNotes(customerId: string) {
  const [notes, setNotes] = useState<CustomerNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!customerId) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/customer-notes?customerId=${customerId}`)
      if (!res.ok) throw new Error('Failed to load notes')
      const json = await res.json()
      setNotes(json.data || [])
    } catch (err) {
      setError('Failed to load notes')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [customerId])

  useEffect(() => { refresh() }, [refresh])

  const handleCreate = useCallback(async (
    content: string, isPinned = false
  ): Promise<NoteActionResult> => {
    try {
      const res = await fetch('/api/customer-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, content, isPinned }),
      })
      const json = await res.json()
      if (!res.ok) return { error: json.error || 'Failed to create note' }
      await refresh()
      return { success: true, data: json.data }
    } catch { return { error: 'Failed to create note' } }
  }, [customerId, refresh])

  const handleUpdate = useCallback(async (
    noteId: string, updates: { content?: string; isPinned?: boolean }
  ): Promise<NoteActionResult> => {
    try {
      const res = await fetch('/api/customer-notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, ...updates }),
      })
      const json = await res.json()
      if (!res.ok) return { error: json.error || 'Failed to update note' }
      await refresh()
      return { success: true, data: json.data }
    } catch { return { error: 'Failed to update note' } }
  }, [refresh])

  const handleDelete = useCallback(async (noteId: string): Promise<NoteActionResult> => {
    try {
      const res = await fetch(`/api/customer-notes?noteId=${noteId}`, { method: 'DELETE' })
      if (!res.ok) { const json = await res.json(); return { error: json.error || 'Failed to delete' } }
      await refresh()
      return { success: true }
    } catch { return { error: 'Failed to delete note' } }
  }, [refresh])

  const handleTogglePin = useCallback(async (noteId: string): Promise<NoteActionResult> => {
    const note = notes.find(n => n.id === noteId)
    if (!note) return { error: 'Note not found' }
    return handleUpdate(noteId, { isPinned: !note.isPinned })
  }, [notes, handleUpdate])

  const pinnedNotes = notes.filter(n => n.isPinned)
  const unpinnedNotes = notes.filter(n => !n.isPinned)

  return {
    notes, pinnedNotes, unpinnedNotes, isLoading, error,
    refresh, handleCreate, handleUpdate, handleDelete, handleTogglePin,
  }
}
