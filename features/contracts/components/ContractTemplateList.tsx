'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useContractTemplates } from '../hooks/useContractTemplates'
import { ContractTemplateCard } from './ContractTemplateCard'
import type { ContractTemplate } from '../types'

const CATEGORIES = ['General', 'Residential', 'Commercial', 'Maintenance', 'Emergency']

export function ContractTemplateList() {
  const router = useRouter()
  const { templates, isLoading, create, update, remove, seedSamples } = useContractTemplates()
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('General')
  const [isSaving, setIsSaving] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) return
    setIsSaving(true)
    const result = await create({ name: newName.trim(), category: newCategory })
    setIsSaving(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Template created')
      setCreateOpen(false)
      setNewName('')
      setNewCategory('General')
    }
  }

  const handlePreview = (template: ContractTemplate) => {
    router.push(`/settings/contracts/preview/${template.id}`)
  }

  const handleTestLive = (template: ContractTemplate) => {
    router.push(`/settings/contracts/test/${template.id}`)
  }

  const handleEdit = (template: ContractTemplate) => {
    router.push(`/contracts/builder/${template.id}`)
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const result = await update(id, { isActive })
    if (result.error) toast.error(result.error)
    else toast.success(isActive ? 'Template activated' : 'Template deactivated')
  }

  const handleSeed = async () => {
    setIsSaving(true)
    const r = await seedSamples()
    setIsSaving(false)
    r.error ? toast.error(r.error) : toast.success(`${r.count} sample template(s) loaded`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template? This cannot be undone.')) return
    const result = await remove(id)
    if (result.error) toast.error(result.error)
    else toast.success('Template deleted')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Contract templates define the structure and layout for job contracts.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSeed} disabled={isSaving}>Load Samples</Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> Create Template</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No contract templates yet.</p>
          <p className="text-sm mt-1">Click &quot;Load Samples&quot; or &quot;Create Template&quot; to get started.</p>
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {templates.map((template) => (
            <ContractTemplateCard
              key={template.id}
              template={template}
              onPreview={handlePreview}
              onTestLive={handleTestLive}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Template Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Standard Service Contract"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSaving || !newName.trim()}>
              {isSaving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
