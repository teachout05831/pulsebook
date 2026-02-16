"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader2, FileText } from "lucide-react";
import { useDocuments } from "../hooks/useDocuments";
import { DocumentRow } from "./DocumentRow";
import type { DocumentItem } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  estimateId?: string;
  jobId?: string;
}

function groupDocuments(docs: DocumentItem[]) {
  const estimate: DocumentItem[] = [];
  const job: DocumentItem[] = [];
  for (const d of docs) {
    if (d.entityType === "estimate") estimate.push(d);
    else job.push(d);
  }
  return { estimate, job };
}

export function DocumentsPanel({ open, onClose, estimateId, jobId }: Props) {
  const { documents, isLoading } = useDocuments(open, estimateId, jobId);
  const { estimate, job } = groupDocuments(documents);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="p-0 w-[380px] sm:max-w-[380px]">
        <div className="bg-slate-800 text-white px-5 py-4 sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle className="text-white font-semibold text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />Documents
            </SheetTitle>
            <SheetDescription className="sr-only">Documents for this record</SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...
            </div>
          ) : documents.length === 0 ? (
            <p className="text-[13px] text-slate-400 py-4 text-center">No documents yet</p>
          ) : (
            <>
              {estimate.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Estimate
                  </p>
                  {estimate.map((doc) => (
                    <DocumentRow key={doc.id} document={doc} />
                  ))}
                </div>
              )}

              {job.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Job
                  </p>
                  {job.map((doc) => (
                    <DocumentRow key={doc.id} document={doc} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
