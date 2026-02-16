'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Send, CheckCircle2, XCircle, Briefcase,
  FileText, Eye, Trash2
} from 'lucide-react'

export function ActionsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select defaultValue="draft">
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Send className="h-3 w-3" /> Mark Sent
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs text-green-600 hover:text-green-700">
            <CheckCircle2 className="h-3 w-3" /> Approve
          </Button>
        </div>

        <div className="border-t pt-3 space-y-2">
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
            <Briefcase className="h-3 w-3" /> Convert to Job
          </Button>
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
            <FileText className="h-3 w-3" /> Create Estimate Page
          </Button>
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
            <Eye className="h-3 w-3" /> Preview Page
          </Button>
        </div>

        <div className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-1.5 text-xs text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" /> Delete Estimate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
