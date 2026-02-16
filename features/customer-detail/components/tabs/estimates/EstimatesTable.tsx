"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { Estimate } from "@/types/estimate";
import { ESTIMATE_STATUS_COLORS, ESTIMATE_STATUS_LABELS } from "@/types/estimate";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface EstimatesTableProps {
  estimates: Estimate[];
  backTo?: string;
}

export function EstimatesTable({ estimates, backTo }: EstimatesTableProps) {
  const router = useRouter();
  const estimateLink = (id: string) => backTo ? `/estimates/${id}?from=${backTo}` : `/estimates/${id}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Estimates</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {estimates.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estimate #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((estimate) => (
                  <TableRow
                    key={estimate.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(estimateLink(estimate.id))}
                  >
                    <TableCell className="font-medium">{estimate.estimateNumber}</TableCell>
                    <TableCell>{formatDate(estimate.issueDate)}</TableCell>
                    <TableCell>{estimate.expiryDate ? formatDate(estimate.expiryDate) : "-"}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(estimate.total)}</TableCell>
                    <TableCell>
                      <Badge className={ESTIMATE_STATUS_COLORS[estimate.status]}>
                        {ESTIMATE_STATUS_LABELS[estimate.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(estimateLink(estimate.id)); }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">No estimates found</div>
        )}
      </CardContent>
    </Card>
  );
}
