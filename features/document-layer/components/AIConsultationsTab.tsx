"use client";

import { Video, Eye, ExternalLink, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PipelineStatusBadge } from "./PipelineStatusBadge";
import { useConsultationEstimates } from "../hooks/useConsultationEstimates";
import type { PipelineStatus } from "../types";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "-";
  const m = Math.floor(seconds / 60);
  return m < 1 ? "<1 min" : `${m} min`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function AIConsultationsTab() {
  const { items, total, isLoading, page, setPage } = useConsultationEstimates();
  const totalPages = Math.ceil(total / 20);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Video className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="font-medium text-muted-foreground">No AI consultations yet</h3>
        <p className="text-sm text-muted-foreground/60 mt-1">Complete a video consultation to see AI-processed results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Call Status</TableHead>
            <TableHead>Pipeline</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.customerName || "Walk-in"}</TableCell>
              <TableCell className="text-muted-foreground">{item.title}</TableCell>
              <TableCell>
                <Badge variant={item.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <PipelineStatusBadge status={item.pipelineStatus as PipelineStatus} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDuration(item.durationSeconds)}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(item.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {item.pipelineStatus === "ready" && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/consultations/${item.id}`}><Eye className="h-3.5 w-3.5 mr-1" />Review</a>
                    </Button>
                  )}
                  {item.estimateId && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/estimates/${item.estimateId}`}><ExternalLink className="h-3.5 w-3.5 mr-1" />Estimate</a>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages} ({total} total)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
