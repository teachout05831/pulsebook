"use client";

import { FileText, Download, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/features/customer-files";
import type { CustomerFile } from "@/features/customer-files";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface FileListCardProps {
  files: CustomerFile[];
  onDownload: (f: CustomerFile) => void;
  onDelete: (id: string) => void;
  showSigned?: boolean;
}

export function FileListCard({ files, onDownload, onDelete, showSigned }: FileListCardProps) {
  return (
    <Card>
      <CardContent className="py-0 divide-y">
        {files.map((file) => (
          <div key={file.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{file.fileName}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {formatFileSize(file.fileSize)} - {formatDate(file.createdAt)}
                  {file.description && ` - ${file.description}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-[calc(2.5rem+0.75rem)] sm:pl-0 shrink-0">
              {showSigned && file.isSigned && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Signed</Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => onDownload(file)}>
                <Download className="mr-1 h-3.5 w-3.5" />Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(file.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
