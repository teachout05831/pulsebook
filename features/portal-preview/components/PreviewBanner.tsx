"use client";

import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  customerName: string;
  onClose: () => void;
}

export function PreviewBanner({ customerName, onClose }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
        <Eye className="h-4 w-4 shrink-0" />
        <span>Previewing portal as <strong>{customerName}</strong></span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-7 px-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
