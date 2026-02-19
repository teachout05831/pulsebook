"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Eye, ExternalLink, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PipelineStatusBadge } from "@/features/document-layer/components/PipelineStatusBadge";
import type { PipelineStatus } from "@/features/consultations/types";

interface ConsultationItem {
  id: string;
  title: string;
  purpose: string | null;
  status: string;
  pipelineStatus: string;
  hostName: string;
  durationSeconds: number | null;
  scheduledAt: string | null;
  createdAt: string;
  estimateId: string | null;
  publicToken: string;
}

interface ConsultationsTabProps {
  customerId: string;
  customerName: string;
  onNewConsultation?: () => void;
}

function formatDuration(s: number | null): string {
  if (!s) return "-";
  const m = Math.floor(s / 60);
  return m < 1 ? "<1 min" : `${m} min`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <Button variant="ghost" size="sm" onClick={copy} className="h-7 px-2">
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

export function ConsultationsTab({ customerId, customerName, onNewConsultation }: ConsultationsTabProps) {
  const [items, setItems] = useState<ConsultationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/consultations?customerId=${customerId}&_limit=50`, { signal: controller.signal })
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((json) => setItems(json.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [customerId]);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{items.length} consultation{items.length !== 1 ? "s" : ""}</span>
        {onNewConsultation && <Button size="sm" onClick={onNewConsultation}>+ New Consultation</Button>}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Video className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No consultations with {customerName} yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pipeline</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c) => {
              const hostLink = `${window.location.origin}/c/${c.publicToken}?role=host`;
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell><Badge variant={c.status === "completed" ? "default" : "secondary"} className="text-xs">{c.status}</Badge></TableCell>
                  <TableCell><PipelineStatusBadge status={c.pipelineStatus as PipelineStatus} /></TableCell>
                  <TableCell className="text-muted-foreground">{formatDuration(c.durationSeconds)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(c.scheduledAt || c.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {c.status === "pending" && <><CopyBtn text={hostLink} /><Button variant="default" size="sm" className="h-7" asChild><a href={hostLink} target="_blank" rel="noopener noreferrer">Join</a></Button></>}
                      {c.pipelineStatus === "ready" && <Button variant="ghost" size="sm" className="h-7" asChild><Link href={`/consultations/${c.id}`}><Eye className="h-3.5 w-3.5 mr-1" />Review</Link></Button>}
                      {c.estimateId && <Button variant="ghost" size="sm" className="h-7" asChild><Link href={`/estimates/${c.estimateId}`}><ExternalLink className="h-3.5 w-3.5 mr-1" />Estimate</Link></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
