"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, ExternalLink, Copy, Check, Trash2, XCircle, CalendarClock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PipelineStatusBadge } from "@/features/document-layer/components/PipelineStatusBadge";
import { DateTimePicker } from "./DateTimePicker";
import { cn } from "@/lib/utils";
import type { PipelineStatus } from "../types";

const PURPOSE_COLORS: Record<string, string> = { discovery: "bg-violet-500", estimate_review: "bg-amber-500", follow_up: "bg-emerald-500" };
const STATUS_BADGES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  pending: { variant: "secondary", label: "Upcoming" },
  active: { variant: "default", label: "Active" },
  completed: { variant: "default", label: "Completed" },
  cancelled: { variant: "outline", label: "Cancelled" },
};

function formatDuration(s: number | null): string { if (!s) return "-"; const m = Math.floor(s / 60); return m < 1 ? "<1 min" : `${m} min`; }
function formatDateTime(iso: string): string { const d = new Date(iso); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }

interface ConsultationRowProps {
  c: {
    id: string; title: string; purpose: string | null; status: string; pipelineStatus: string;
    customerName: string | null; durationSeconds: number | null;
    scheduledAt: string | null; createdAt: string; estimateId: string | null; publicToken: string;
  };
  onCancel: (id: string) => void;
  onReschedule: (id: string, date: string) => void;
  onDelete: (id: string) => void;
  onEditDate: (id: string, date: string) => void;
}

export function ConsultationRow({ c, onCancel, onReschedule, onDelete, onEditDate }: ConsultationRowProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState("");
  const hostLink = `${window.location.origin}/c/${c.publicToken}?role=host`;
  const badge = STATUS_BADGES[c.status] || STATUS_BADGES.pending;

  const copyLink = async () => { await navigator.clipboard.writeText(hostLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const submitDate = () => {
    if (!pendingDate) return;
    if (c.status === "cancelled") onReschedule(c.id, pendingDate);
    else onEditDate(c.id, pendingDate);
    setDateOpen(false);
  };

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/consultations/${c.id}`)}>
      <TableCell>
        <span className={cn("block w-2 h-2 rounded-full", PURPOSE_COLORS[c.purpose || ""] || "bg-gray-300")} />
      </TableCell>
      <TableCell className="font-medium">{c.customerName || "Walk-in"}</TableCell>
      <TableCell className="text-muted-foreground">{c.title}</TableCell>
      <TableCell>
        <Badge variant={badge.variant} className={cn("text-xs", c.status === "cancelled" && "text-red-500 border-red-200")}>{badge.label}</Badge>
      </TableCell>
      <TableCell><PipelineStatusBadge status={c.pipelineStatus as PipelineStatus} /></TableCell>
      <TableCell className="text-muted-foreground">{formatDuration(c.durationSeconds)}</TableCell>
      <TableCell className="text-muted-foreground text-xs">{formatDateTime(c.scheduledAt || c.createdAt)}</TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          {c.status === "pending" && (
            <>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={copyLink}>
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2"><Pencil className="h-3.5 w-3.5" /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="end">
                  <p className="text-sm font-medium mb-2">Change Date & Time</p>
                  <DateTimePicker value={c.scheduledAt || c.createdAt} onChange={setPendingDate} submitLabel="Save" onSubmit={submitDate} />
                </PopoverContent>
              </Popover>
              <Button variant="default" size="sm" className="h-7" asChild>
                <a href={hostLink} target="_blank" rel="noopener noreferrer">Join</a>
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-orange-500" onClick={() => onCancel(c.id)} title="Cancel">
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          {c.status === "cancelled" && (
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7"><CalendarClock className="h-3.5 w-3.5 mr-1" />Reschedule</Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="end">
                <p className="text-sm font-medium mb-2">Reschedule Consultation</p>
                <DateTimePicker onChange={setPendingDate} submitLabel="Reschedule" onSubmit={submitDate} />
              </PopoverContent>
            </Popover>
          )}
          {c.pipelineStatus === "ready" && (
            <Button variant="ghost" size="sm" className="h-7" asChild>
              <Link href={`/consultations/${c.id}`}><Eye className="h-3.5 w-3.5 mr-1" />Review</Link>
            </Button>
          )}
          {c.estimateId && (
            <Button variant="ghost" size="sm" className="h-7" asChild>
              <Link href={`/estimates/${c.estimateId}`}><ExternalLink className="h-3.5 w-3.5 mr-1" />Estimate</Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-red-500" onClick={() => { if (confirm("Delete this consultation?")) onDelete(c.id); }} title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
