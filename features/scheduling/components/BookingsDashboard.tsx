"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useBookings } from "../hooks/useBookings";
import { BookingStatusBadge } from "./BookingStatusBadge";
import type { Booking, BookingStatus } from "../types/booking";

const TABS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" }, { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" }, { value: "completed", label: "Completed" },
];

export function BookingsDashboard() {
  const { bookings, total, isLoading, page, setPage, statusFilter, setStatusFilter, updateStatus } = useBookings();
  const [detail, setDetail] = useState<Booking | null>(null);
  const totalPages = Math.ceil(total / 20);

  const handleAction = async (id: string, status: string) => {
    const result = await updateStatus(id, status);
    if (result.error) toast.error(result.error);
    else { toast.success(`Booking ${status}`); setDetail(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><CalendarDays className="h-6 w-6" />Bookings</h1>
          <p className="text-muted-foreground mt-1">{total} total bookings</p>
        </div>
      </div>

      <div className="flex gap-2">
        {TABS.map(tab => (
          <Button key={tab.value} variant={statusFilter === tab.value ? "default" : "outline"} size="sm" onClick={() => { setStatusFilter(tab.value); setPage(1); }}>{tab.label}</Button>
        ))}
      </div>

      {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : bookings.length === 0 ? (
        <div className="text-center py-16 border rounded-lg border-dashed"><p className="text-muted-foreground">No bookings found</p></div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Score</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.customerName}</p>
                    {b.customerEmail && <p className="text-xs text-muted-foreground">{b.customerEmail}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{b.preferredDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.preferredTime}</td>
                  <td className="px-4 py-3"><BookingStatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{b.score ? b.score.toFixed(1) : "—"}</td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetail(b)}><Eye className="h-3 w-3" /></Button>
                    {b.status === "pending" && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleAction(b.id, "confirmed")}>Confirm</Button>}
                    {b.status === "pending" && <Button size="sm" variant="outline" className="h-7 text-xs text-red-600" onClick={() => handleAction(b.id, "declined")}>Decline</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={o => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
          {detail && <BookingDetail booking={detail} onAction={handleAction} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BookingDetail({ booking: b, onAction }: { booking: Booking; onAction: (id: string, status: string) => void }) {
  const explanation = b.scoringExplanation;
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div><span className="text-muted-foreground">Customer</span><p className="font-medium">{b.customerName}</p></div>
        <div><span className="text-muted-foreground">Status</span><div><BookingStatusBadge status={b.status} /></div></div>
        <div><span className="text-muted-foreground">Date</span><p>{b.preferredDate}</p></div>
        <div><span className="text-muted-foreground">Time</span><p>{b.preferredTime}</p></div>
        {b.customerEmail && <div><span className="text-muted-foreground">Email</span><p>{b.customerEmail}</p></div>}
        {b.customerPhone && <div><span className="text-muted-foreground">Phone</span><p>{b.customerPhone}</p></div>}
        {b.score != null && <div><span className="text-muted-foreground">Score</span><p>{b.score.toFixed(1)}</p></div>}
      </div>
      {explanation && (
        <div className="border rounded p-3 bg-muted/30">
          <p className="font-medium text-xs mb-1">Scoring Decision</p>
          <p className="text-xs text-muted-foreground">{explanation.explanation}</p>
          <p className="text-xs mt-1">Mode: {explanation.mode} | Crew Override: {explanation.crewOverride ? "Yes" : "No"}</p>
        </div>
      )}
      {b.notes && <div><span className="text-muted-foreground">Notes</span><p>{b.notes}</p></div>}
      <div className="flex gap-2 pt-2">
        {b.status === "pending" && <Button size="sm" onClick={() => onAction(b.id, "confirmed")}>Confirm</Button>}
        {b.status === "pending" && <Button size="sm" variant="destructive" onClick={() => onAction(b.id, "declined")}>Decline</Button>}
        {b.status === "confirmed" && <Button size="sm" onClick={() => onAction(b.id, "completed")}>Mark Complete</Button>}
        {b.status === "confirmed" && <Button size="sm" variant="outline" onClick={() => onAction(b.id, "cancelled")}>Cancel</Button>}
      </div>
    </div>
  );
}
