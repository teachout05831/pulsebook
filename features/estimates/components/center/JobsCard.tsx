"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { calculateTotals } from "../../utils/calculateTotals";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
}

const formatDate = (d: string | null) => {
  if (!d) return "Unscheduled";
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "Unscheduled"; }
};

const formatMoney = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function JobsCard({ estimate }: Props) {
  const totals = calculateTotals({
    lineItems: estimate.lineItems,
    resources: estimate.resources,
    pricingModel: estimate.pricingModel,
    taxRate: estimate.taxRate,
    depositType: estimate.depositType,
    depositValue: estimate.depositAmount || 0,
    depositPaid: estimate.depositPaid,
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Jobs</span>
          {!estimate.jobId && (
            <Link
              href={`/jobs/new?customerId=${estimate.customerId}&fromEstimate=${estimate.id}`}
              className="text-blue-600 text-xs hover:underline"
            >
              + Add Job
            </Link>
          )}
        </div>

        {estimate.jobId ? (
          <Link href={`/jobs/${estimate.jobId}`} className="block">
            <div className="border-2 border-green-600 rounded-lg p-3 flex flex-wrap items-center gap-3 hover:bg-green-50/50 transition-colors">
              <div>
                <div className="text-[11px] text-slate-500">Job {estimate.estimateNumber}-1</div>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  {estimate.scheduledDate ? "Scheduled" : "Unscheduled"}
                </span>
              </div>
              <span className="text-[13px] text-blue-600 font-medium">{formatDate(estimate.scheduledDate)}</span>
              <span className="font-semibold text-sm ml-auto">{formatMoney(totals.total)}</span>
            </div>
          </Link>
        ) : (
          <p className="text-center text-slate-400 text-xs py-3">No jobs linked yet</p>
        )}
      </CardContent>
    </Card>
  );
}
