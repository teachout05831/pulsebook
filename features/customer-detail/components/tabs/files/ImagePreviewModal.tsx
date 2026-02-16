"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/features/customer-files";
import type { CustomerFile } from "@/features/customer-files";

interface ImagePreviewModalProps {
  file: CustomerFile;
  onClose: () => void;
}

export function ImagePreviewModal({ file, onClose }: ImagePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <Button
          variant="secondary"
          size="icon"
          className="absolute -top-12 right-0 rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        <img
          src={file.storagePath}
          alt={file.fileName}
          className="w-full h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="absolute -bottom-12 left-0 right-0 text-center text-white">
          <p className="font-medium">{file.fileName}</p>
          <p className="text-sm text-white/70">{formatFileSize(file.fileSize)}</p>
        </div>
      </div>
    </div>
  );
}
