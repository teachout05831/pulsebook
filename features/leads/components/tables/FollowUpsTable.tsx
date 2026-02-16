"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ExternalLink, Phone, Mail, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FollowUpTableCard } from "./FollowUpTableCard";
import { ConfirmCompleteDialog } from "@/features/follow-ups/components/ConfirmCompleteDialog";
import { parseFollowUpDueDate } from "@/features/follow-ups/types";
import type { FollowUpWithUrgency } from "@/features/follow-ups/hooks/useFollowUps";

interface FollowUpsTableProps {
  followUps: FollowUpWithUrgency[];
  total: number;
  isLoading?: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
  onComplete?: (id: string) => void;
}

const TYPE_ICONS = { call: Phone, email: Mail, meeting: MapPin };

function formatDueDate(date: Date) {
  const p = parseFollowUpDueDate(date);
  return p.displayTime ? `${p.displayDate} at ${p.displayTime}` : p.displayDate;
}

function getRelativeContact(date?: string) {
  if (!date) return "--";
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d}d ago`;
}

export function FollowUpsTable({
  followUps, total, isLoading, page = 1, onPageChange, onComplete,
}: FollowUpsTableProps) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirmTarget = followUps.find((f) => f.id === confirmId);

  if (isLoading) {
    return <Card className="p-8 text-center text-slate-500">Loading follow-ups...</Card>;
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {followUps.map((followUp) => (
          <FollowUpTableCard key={followUp.id} followUp={followUp} onComplete={onComplete} />
        ))}
        {followUps.length === 0 && (
          <Card className="p-8 text-center text-slate-500">No follow-ups found</Card>
        )}
      </div>

      {/* Desktop table view */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="w-10 p-3"><input type="checkbox" className="h-4 w-4 rounded" /></th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="text-left p-3 text-xs font-semibold text-blue-600 uppercase bg-blue-50">Date</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Last Contact</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
              </tr>
            </thead>
            <tbody>
              {followUps.map((followUp) => {
                const Icon = TYPE_ICONS[followUp.type];
                const isOverdue = followUp.urgency === "overdue";
                return (
                  <tr key={followUp.id} className={cn("border-b hover:bg-slate-50 cursor-pointer", isOverdue && "bg-red-50")} onClick={() => router.push(`/customers/${followUp.customerId}`)}>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="h-4 w-4 rounded cursor-pointer" checked={false} onChange={() => setConfirmId(followUp.id)} />
                    </td>
                    <td className="p-3">
                      <span className="text-blue-600 flex items-center gap-1">{followUp.id.slice(0, 5)}<ExternalLink className="h-3 w-3" /></span>
                    </td>
                    <td className="p-3">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded text-xs font-medium",
                        followUp.status === "pending" && "bg-amber-100 text-amber-700",
                        followUp.status === "completed" && "bg-green-100 text-green-700",
                        followUp.status === "cancelled" && "bg-gray-100 text-gray-700"
                      )}>{followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}</span>
                    </td>
                    <td className="p-3 font-medium text-blue-600 hover:underline">{followUp.displayName}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", isOverdue ? "text-red-500" : "text-slate-400")} />
                        <span className={cn("text-sm", isOverdue && "text-red-600 font-medium")}>{followUp.details || `${followUp.type} follow-up`}</span>
                      </div>
                    </td>
                    <td className={cn("p-3 text-sm", isOverdue ? "bg-red-100 text-red-600 font-medium" : "bg-blue-50")}>{formatDueDate(followUp.dueDate)}</td>
                    <td className="p-3">
                      {(() => {
                        const label = getRelativeContact(followUp.lastContactDate);
                        const stale = followUp.lastContactDate && Math.floor((Date.now() - new Date(followUp.lastContactDate).getTime()) / 86400000) > 2;
                        return <span className={cn("text-sm font-medium", label === "--" ? "text-slate-400" : stale ? "text-amber-600" : "text-green-600")}>{label}</span>;
                      })()}
                    </td>
                    <td className="p-3 text-sm capitalize">{followUp.type}</td>
                  </tr>
                );
              })}
              {followUps.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-slate-500">No follow-ups found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 md:border-t">
        <span className="text-sm text-slate-500">Showing {followUps.length} of {total}</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
          <Button variant="default" size="sm" className="min-w-8">{page}</Button>
          <Button variant="outline" size="sm" disabled={followUps.length < 50} onClick={() => onPageChange?.(page + 1)}>
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmCompleteDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        onConfirm={() => { if (confirmId) { onComplete?.(confirmId); setConfirmId(null); } }}
        displayName={confirmTarget?.displayName}
      />
    </>
  );
}
