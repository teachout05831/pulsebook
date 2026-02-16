"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Zap, DollarSign, ChevronLeft } from "lucide-react";
import { StatusActions } from "./StatusActions";
import { DeleteEstimateDialog } from "../shared/DeleteEstimateDialog";
import { MiniStepper } from "./MiniStepper";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
  onStatusChange: (status: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isSaving: boolean;
  onOpenPanel: (panel: "docs" | "history" | "activity" | "payments") => void;
}

const BACK_LINKS: Record<string, { href: string; label: string }> = {
  "my-leads": { href: "/sales?tab=my-leads", label: "BACK TO MY LEADS" },
  "follow-ups": { href: "/sales?tab=follow-up", label: "BACK TO FOLLOW-UPS" },
};

export function EstimateHeader({ estimate, onStatusChange, onDuplicate, onDelete, isSaving, onOpenPanel }: Props) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "my-leads";
  const customerId = searchParams.get("customerId");
  const backLink = from === "lead-profile" && customerId
    ? { href: `/customers/${customerId}`, label: "BACK TO LEAD" }
    : BACK_LINKS[from] || BACK_LINKS["my-leads"];

  return (
    <div>
      {/* Row 1: Back breadcrumb + contact info (compact) */}
      <div className="flex items-center gap-3 mb-1.5">
        <Link
          href={backLink.href}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {backLink.label}
        </Link>
        <span className="text-slate-300">·</span>
        <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
          {estimate.customerPhone && <a href={`tel:${estimate.customerPhone}`} className="text-slate-500 hover:text-blue-600">{estimate.customerPhone}</a>}
          {estimate.customerEmail && (
            <>
              <span className="text-slate-300">·</span>
              <a href={`mailto:${estimate.customerEmail}`} className="text-slate-500 hover:text-blue-600">{estimate.customerEmail}</a>
            </>
          )}
          {estimate.issueDate && (
            <>
              <span className="text-slate-300">·</span>
              <span>Issued {new Date(estimate.issueDate).toLocaleDateString()}</span>
            </>
          )}
          {isSaving && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400">Saving...</span>
            </>
          )}
        </div>
      </div>

      {/* Row 2: Name + EST # + mini stepper | Action buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex items-baseline gap-2.5">
            <Link href={`/customers/${estimate.customerId}`} className="text-[17px] font-bold hover:underline">
              {estimate.customerName}
            </Link>
            <span className="text-sm text-slate-500 font-medium">EST-{estimate.estimateNumber}</span>
          </div>
          <MiniStepper estimate={estimate} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="icon" className="h-9 w-9" title="Payments" onClick={() => onOpenPanel("payments")}>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" title="Documents" onClick={() => onOpenPanel("docs")}>
            <FileText className="h-4 w-4 text-slate-500" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" title="History" onClick={() => onOpenPanel("history")}>
            <Clock className="h-4 w-4 text-slate-500" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" title="Activity" onClick={() => onOpenPanel("activity")}>
            <Zap className="h-4 w-4 text-slate-500" />
          </Button>
          <StatusActions estimate={estimate} onStatusChange={onStatusChange} onDuplicate={onDuplicate} onOpenPanel={onOpenPanel} />
          <DeleteEstimateDialog estimateNumber={estimate.estimateNumber} onConfirm={onDelete} />
        </div>
      </div>
    </div>
  );
}
