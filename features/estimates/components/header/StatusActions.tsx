"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Send, CheckCircle, XCircle, Ban, Copy, Eye, Briefcase, CreditCard, Presentation, Pencil } from "lucide-react";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
  onStatusChange: (status: string) => void;
  onDuplicate: () => void;
  onOpenPanel: (panel: "payments") => void;
}

export function StatusActions({ estimate, onStatusChange, onDuplicate, onOpenPanel }: Props) {
  const router = useRouter();
  const { status, pageToken, pageId, customerId, id } = estimate;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white h-9 px-3 text-sm font-medium">
          Book <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {status === "draft" && (
          <DropdownMenuItem onClick={() => onStatusChange("sent")}>
            <Send className="mr-2 h-4 w-4" />Send Estimate
          </DropdownMenuItem>
        )}

        {status === "sent" && (
          <>
            <DropdownMenuItem onClick={() => onStatusChange("approved")} className="text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("declined")} className="text-red-600">
              <XCircle className="mr-2 h-4 w-4" />Decline
            </DropdownMenuItem>
          </>
        )}

        {status === "approved" && !estimate.jobId && (
          <DropdownMenuItem onClick={() => router.push(`/jobs/new?customerId=${customerId}&fromEstimate=${id}`)}>
            <Briefcase className="mr-2 h-4 w-4" />Convert to Job
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => onOpenPanel("payments")}>
          <CreditCard className="mr-2 h-4 w-4" />Take Payment
        </DropdownMenuItem>

        {(status === "draft" || status === "sent") && (
          <DropdownMenuItem onClick={() => onStatusChange("lost")} className="text-orange-600">
            <Ban className="mr-2 h-4 w-4" />Mark Lost
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {pageToken && (
          <DropdownMenuItem onClick={() => window.open(`/e/${pageToken}`, "_blank")}>
            <Eye className="mr-2 h-4 w-4" />Preview Estimate
          </DropdownMenuItem>
        )}

        {pageId ? (
          <DropdownMenuItem onClick={() => router.push(`/estimate-pages/${pageId}`)}>
            <Pencil className="mr-2 h-4 w-4" />Edit Page
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push(`/estimate-pages/templates?estimateId=${id}`)}>
            <Presentation className="mr-2 h-4 w-4" />Create Page
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
