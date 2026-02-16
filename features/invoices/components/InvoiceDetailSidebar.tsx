'use client';

import { useRouter } from 'next/navigation';
import { Send, Link2, User, Wrench, FileText, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Invoice, InvoiceStatus } from '@/types';
import { formatDate, STATUS_OPTIONS } from './InvoiceDetailHelpers';

interface InvoiceDetailSidebarProps {
  invoice: Invoice;
  isUpdating: boolean;
  onStatusChange: (status: InvoiceStatus) => void;
  onNavigateToJob: (jobId: string) => void;
}

interface ConnectedItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  onClick: () => void;
}

function ConnectedItem({ label, value, icon, bgColor, onClick }: ConnectedItemProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors w-full text-left">
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-blue-600 truncate">{value}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

export function InvoiceDetailSidebar({ invoice, isUpdating, onStatusChange, onNavigateToJob }: InvoiceDetailSidebarProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Connected To */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><Link2 className="h-4 w-4 text-muted-foreground" />Connected To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ConnectedItem label="Customer" value={invoice.customerName}
            icon={<User className="h-3.5 w-3.5 text-blue-600" />} bgColor="bg-blue-100"
            onClick={() => router.push(`/customers/${invoice.customerId}`)} />
          {invoice.jobId && (
            <ConnectedItem label="Job" value={invoice.jobTitle || 'View Job'}
              icon={<Wrench className="h-3.5 w-3.5 text-amber-600" />} bgColor="bg-amber-100"
              onClick={() => onNavigateToJob(invoice.jobId!)} />
          )}
          {invoice.estimateId && (
            <ConnectedItem label="Estimate" value={invoice.estimateId}
              icon={<FileText className="h-3.5 w-3.5 text-green-600" />} bgColor="bg-green-100"
              onClick={() => router.push(`/estimates/${invoice.estimateId}`)} />
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Status</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Select value={invoice.status} onValueChange={(v) => onStatusChange(v as InvoiceStatus)} disabled={isUpdating}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {invoice.status === 'draft' && (
            <Button variant="outline" size="sm" className="w-full" onClick={() => onStatusChange('sent')} disabled={isUpdating}>
              <Send className="mr-2 h-4 w-4" />Mark as Sent
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <Label className="text-muted-foreground text-xs">Issue Date</Label>
            <p className="font-medium">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Due Date</Label>
            <p className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'font-medium'}>{formatDate(invoice.dueDate)}</p>
          </div>
          {invoice.address && (
            <div>
              <Label className="text-muted-foreground text-xs">Address</Label>
              <p>{invoice.address}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <Label className="text-muted-foreground text-xs">Terms</Label>
              <p>{invoice.terms}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
