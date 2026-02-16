"use client";

import { useRouter } from "next/navigation";
import { Eye, Download, Send, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { ContractListItem } from "../types";
import { STATUS_CONFIG, formatContractDate } from "./ContractsTableHelpers";
import { ContractsPagination } from "./ContractsPagination";

interface ContractsTableProps {
  instances: ContractListItem[];
  isLoading: boolean;
  visibleColumns: string[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function ContractsTable({
  instances, isLoading, visibleColumns,
  page, pageSize, total, totalPages, onPageChange,
}: ContractsTableProps) {
  const router = useRouter();
  const show = (id: string) => visibleColumns.includes(id);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="h-6 w-6 mx-auto border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground mt-2">Loading contracts...</p>
      </div>
    );
  }

  if (instances.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ScrollText className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No contracts found.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {show("contract") && <TableHead>Contract</TableHead>}
            {show("customer") && <TableHead>Customer</TableHead>}
            {show("job") && <TableHead>Job</TableHead>}
            {show("status") && <TableHead>Status</TableHead>}
            {show("templateType") && <TableHead>Template Type</TableHead>}
            {show("signedDate") && <TableHead>Signed Date</TableHead>}
            {show("created") && <TableHead>Created</TableHead>}
            {show("actions") && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {instances.map((inst) => {
            const cfg = STATUS_CONFIG[inst.status];
            const isCancelled = inst.status === "cancelled";
            return (
              <TableRow key={inst.id} className="hover:bg-slate-50/50">
                {show("contract") && (
                  <TableCell>
                    <p className="font-medium">{inst.templateName || "Contract"}</p>
                    {inst.templateCategory && (
                      <p className="text-xs text-muted-foreground">{inst.templateCategory}</p>
                    )}
                  </TableCell>
                )}
                {show("customer") && (
                  <TableCell>
                    <button className="text-blue-600 hover:underline text-sm"
                      onClick={() => router.push(`/customers/${inst.customerId}`)}>
                      {inst.customerName}
                    </button>
                  </TableCell>
                )}
                {show("job") && (
                  <TableCell>
                    {inst.jobTitle ? (
                      <button
                        className={`hover:text-blue-600 hover:underline text-sm ${isCancelled ? "line-through text-muted-foreground" : "text-gray-600"}`}
                        onClick={() => router.push(`/jobs/${inst.jobId}`)}>
                        {inst.jobTitle}
                      </button>
                    ) : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                )}
                {show("status") && (
                  <TableCell>
                    <Badge className={`${cfg.class} text-xs font-medium`}>{cfg.icon}{cfg.label}</Badge>
                  </TableCell>
                )}
                {show("templateType") && (
                  <TableCell className="text-sm text-muted-foreground">{inst.templateCategory || "-"}</TableCell>
                )}
                {show("signedDate") && (
                  <TableCell className={inst.signedAt ? "text-gray-600" : "text-muted-foreground"}>
                    {formatContractDate(inst.signedAt)}
                  </TableCell>
                )}
                {show("created") && (
                  <TableCell className="text-muted-foreground">{formatContractDate(inst.createdAt)}</TableCell>
                )}
                {show("actions") && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View"
                        onClick={() => router.push(`/contracts/${inst.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(inst.status === "signed" || inst.status === "completed") && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Download PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {(inst.status === "sent" || inst.status === "viewed") && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Resend">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ContractsPagination page={page} pageSize={pageSize} total={total} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
