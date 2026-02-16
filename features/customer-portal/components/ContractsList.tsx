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
import { useCustomerContracts } from "../hooks/useCustomerContracts";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-purple-100 text-purple-700",
  signed: "bg-green-100 text-green-700",
  paid: "bg-emerald-100 text-emerald-700",
  completed: "bg-teal-100 text-teal-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ContractsList() {
  const { contracts, isLoading, error } = useCustomerContracts();

  if (isLoading) {
    return <div className="animate-pulse h-40 rounded bg-muted" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (contracts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No contracts yet.
      </p>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {contracts.map((contract) => (
          <div key={contract.id} className="rounded-lg border bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">
                {contract.templateName || "Contract"}
              </p>
              <Badge
                variant="secondary"
                className={`text-xs ${statusColors[contract.status] || ""}`}
              >
                {contract.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Created: {formatDate(contract.createdAt)}
            </p>
            {contract.signedAt && (
              <p className="text-xs text-muted-foreground">
                Signed: {formatDate(contract.signedAt)}
              </p>
            )}
            {contract.signingToken && contract.status !== "signed" && (
              <a
                href={`/sign/${contract.signingToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary mt-2"
              >
                Sign Now <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Signed</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">
                  {contract.templateName || "Contract"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[contract.status] || ""}
                  >
                    {contract.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(contract.createdAt)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {contract.signedAt ? formatDate(contract.signedAt) : "—"}
                </TableCell>
                <TableCell>
                  {contract.signingToken && contract.status !== "signed" && (
                    <a
                      href={`/sign/${contract.signingToken}`}
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
