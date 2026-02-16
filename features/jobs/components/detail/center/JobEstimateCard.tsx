"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Props {
  sourceEstimateId: string | null;
}

interface EstimateSummary {
  id: string;
  estimateNumber: string;
  status: string;
  total: number;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function JobEstimateCard({ sourceEstimateId }: Props) {
  const [estimate, setEstimate] = useState<EstimateSummary | null>(null);

  useEffect(() => {
    if (!sourceEstimateId) return;
    fetch(`/api/estimates/${sourceEstimateId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setEstimate({
          id: json.data.id, estimateNumber: json.data.estimateNumber,
          status: json.data.status, total: json.data.total,
        });
      })
      .catch(() => {});
  }, [sourceEstimateId]);

  if (!sourceEstimateId) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[13px] font-semibold mb-2">Source Estimate</div>
        {estimate ? (
          <Link href={`/estimates/${estimate.id}`} className="flex items-center gap-2 text-[13px] text-blue-600 hover:underline">
            <FileText className="h-3.5 w-3.5" />
            Estimate #{estimate.estimateNumber} — {estimate.status} — {fmt(estimate.total)}
          </Link>
        ) : (
          <span className="text-[13px] text-slate-400">Loading...</span>
        )}
      </CardContent>
    </Card>
  );
}
