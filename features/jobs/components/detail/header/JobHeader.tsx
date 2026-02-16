"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, DollarSign, FileText, Trash2, Zap } from "lucide-react";
import { JobActions } from "./JobActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from "@/types/job";
import type { JobDetail, JobStatus } from "@/types/job";

interface Props {
  job: JobDetail;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isSaving: boolean;
  onOpenPanel?: (panel: "payments" | "activity") => void;
  onOpenDocs?: () => void;
  onSchedule?: () => void;
}

export function JobHeader({ job, onStatusChange, onDelete, onDuplicate, isSaving, onOpenPanel, onOpenDocs, onSchedule }: Props) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <Link href="/jobs" className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link href={`/customers/${job.customerId}`} className="text-lg font-bold hover:underline">
            {job.customerName}
          </Link>
          <Badge variant="secondary" className={JOB_STATUS_COLORS[job.status]}>
            {JOB_STATUS_LABELS[job.status]}
          </Badge>
          {isSaving && <span className="text-xs text-muted-foreground">Saving...</span>}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
        <h1 className="text-xl font-bold">{job.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenDocs && (
            <Button variant="outline" size="icon" className="h-8 w-8" title="Documents"
              onClick={onOpenDocs}>
              <FileText className="h-4 w-4 text-slate-500" />
            </Button>
          )}
          {onOpenPanel && (
            <Button variant="outline" size="icon" className="h-8 w-8" title="Activity"
              onClick={() => onOpenPanel("activity")}>
              <Zap className="h-4 w-4 text-slate-500" />
            </Button>
          )}
          {onOpenPanel && (
            <Button variant="outline" size="icon" className="h-8 w-8" title="Payments"
              onClick={() => onOpenPanel("payments")}>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </Button>
          )}
          {onOpenPanel && (
            <JobActions onDuplicate={onDuplicate} onOpenPanel={onOpenPanel} onSchedule={onSchedule!} />
          )}
          <Select value={job.status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{JOB_STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Job</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this job? This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
