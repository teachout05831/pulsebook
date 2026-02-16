'use client'

import { useState } from 'react'
import { Key, Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useApiKeys } from '../hooks/useApiKeys'
import { ApiKeyCreatedDialog } from './ApiKeyCreatedDialog'
import { CreateApiKeyDialog } from './CreateApiKeyDialog'

export function ApiKeysManager() {
  const { apiKeys, isLoading, create, remove } = useApiKeys()
  const [createOpen, setCreateOpen] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [createdKeyName, setCreatedKeyName] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreate = async (name: string) => {
    const result = await create({ name })
    if (result.error) { toast.error(result.error); return { error: result.error } }
    setCreatedKeyName(name)
    setCreatedKey(result.data?.key || null)
    toast.success('API key created')
    return {}
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await remove(deleteId)
    setDeleteId(null)
    if (result.error) toast.error(result.error)
    else toast.success('API key deleted')
  }

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Create API keys to connect AI agents and external integrations to your account.</p>
        </div>
        <a href="/docs/api" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-2" />View Documentation</Button>
        </a>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" />Your API Keys</CardTitle>
            <CardDescription>Manage keys for external access to your data.</CardDescription>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm"><Plus className="h-4 w-4 mr-2" />Create Key</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No API keys yet. Create one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell><code className="text-sm bg-slate-100 px-2 py-0.5 rounded">{key.keyPrefix}****</code></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(key.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {key.lastUsedAt ? formatDate(key.lastUsedAt) : <Badge variant="secondary">Never</Badge>}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(key.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateApiKeyDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
      <ApiKeyCreatedDialog open={!!createdKey} onClose={() => setCreatedKey(null)} apiKey={createdKey} keyName={createdKeyName} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription>Any integrations using this key will immediately lose access. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
