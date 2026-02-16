'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Plus, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useActiveCompany } from '../hooks'
import { createCompany } from '../actions'
import type { Company, UserCompany } from '../types'

interface CompanySwitcherProps {
  activeCompany: Company | null
  userCompanies: UserCompany[]
}

export function CompanySwitcher({ activeCompany, userCompanies }: CompanySwitcherProps) {
  const router = useRouter()
  const { companies, isLoading, switchCompany } = useActiveCompany({
    activeCompany,
    userCompanies,
  })
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) return

    setIsCreating(true)
    setCreateError(null)
    const result = await createCompany({ name: newCompanyName })

    if (result.success) {
      setShowNewCompanyDialog(false)
      setNewCompanyName('')
      router.refresh()
    } else {
      setCreateError(result.error || 'Failed to create company')
    }
    setIsCreating(false)
  }

  if (!activeCompany) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">{activeCompany.name}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {companies.map((uc) => (
            <DropdownMenuItem
              key={uc.company.id}
              onClick={() => switchCompany(uc.company.id)}
              className="cursor-pointer"
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  activeCompany.id === uc.company.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span className="truncate">{uc.company.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => { setShowNewCompanyDialog(true); setCreateError(null) }}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Company
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Company</DialogTitle>
            <DialogDescription>
              Add a new company to manage separately from your existing companies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter company name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                disabled={isCreating}
              />
              {createError && (
                <p className="text-sm text-red-500">{createError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewCompanyDialog(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCompany} disabled={isCreating || !newCompanyName.trim()}>
              {isCreating ? 'Creating...' : 'Create Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
