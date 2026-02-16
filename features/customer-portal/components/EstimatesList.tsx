"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerEstimates } from "../hooks/useCustomerEstimates";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  viewed: "bg-purple-100 text-purple-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-500",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EstimatesList() {
  const { estimates, isLoading, error } = useCustomerEstimates();

  if (isLoading) {
    return <div className="animate-pulse h-40 rounded bg-muted" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (estimates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No estimates yet.
      </p>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {estimates.map((est) => (
          <div key={est.id} className="rounded-lg border bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{est.estimateNumber}</p>
              {est.publicToken && (
                <a
                  href={`/e/${est.publicToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                variant="secondary"
                className={`text-xs ${statusColors[est.status] || ""}`}
              >
                {est.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(est.createdAt)}
              </span>
            </div>
            <p className="text-sm font-medium mt-1.5">
              {formatCurrency(est.total)}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estimate #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {estimates.map((est) => (
              <TableRow key={est.id}>
                <TableCell className="font-medium">
                  {est.estimateNumber}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[est.status] || ""}
                  >
                    {est.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(est.total)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(est.createdAt)}
                </TableCell>
                <TableCell>
                  {est.publicToken && (
                    <a
                      href={`/e/${est.publicToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
