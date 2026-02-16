"use client";

import { useState } from "react";
import { Camera, Download, Trash2, ZoomIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/features/customer-files";
import type { CustomerFile } from "@/features/customer-files";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface PhotoCardProps {
  file: CustomerFile;
  onDownload: (f: CustomerFile) => void;
  onDelete: (id: string) => void;
  onPreview: () => void;
}

export function PhotoCard({ file, onDownload, onDelete, onPreview }: PhotoCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <div
        className="aspect-[4/3] bg-muted flex items-center justify-center relative cursor-pointer"
        onClick={onPreview}
      >
        {!imageError && file.storagePath ? (
          <img
            src={file.storagePath}
            alt={file.fileName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Camera className="h-12 w-12 text-muted-foreground/50" />
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onPreview(); }}><ZoomIn className="h-4 w-4" /></Button>
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onDownload(file); }}><Download className="h-4 w-4" /></Button>
          <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="font-medium text-sm truncate">{file.fileName}</div>
        <div className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)} - {formatDate(file.createdAt)}</div>
      </CardContent>
    </Card>
  );
}
