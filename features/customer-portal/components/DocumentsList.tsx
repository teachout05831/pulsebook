"use client";

import { Download, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerDocuments } from "../hooks/useCustomerDocuments";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCategory(cat: string | null): string {
  if (!cat) return "Other";
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DocumentsList() {
  const { documents, isLoading, error } = useCustomerDocuments();

  if (isLoading) {
    return <div className="animate-pulse h-40 rounded bg-muted" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No documents yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Documents</h1>
      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-lg border bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm truncate flex-1 mr-2">
                {doc.fileName}
              </p>
              {doc.url && (
                <Button variant="ghost" size="sm" className="shrink-0" asChild>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatCategory(doc.category)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(doc.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.fileName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {doc.fileType || "—"}
                </TableCell>
                <TableCell>{formatCategory(doc.category)}</TableCell>
                <TableCell>{formatDate(doc.createdAt)}</TableCell>
                <TableCell>
                  {doc.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
