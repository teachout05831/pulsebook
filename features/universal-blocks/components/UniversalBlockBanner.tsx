"use client";

import { Link2, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  blockName: string;
  onDisconnect: () => void;
}

export function UniversalBlockBanner({ blockName, onDisconnect }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <Link2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-blue-900 truncate">
          Connected to &ldquo;{blockName}&rdquo;
        </p>
        <p className="text-xs text-blue-700">
          Edits here update this block everywhere it&apos;s used.
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-700 hover:text-blue-900 hover:bg-blue-100 flex-shrink-0"
        onClick={onDisconnect}
      >
        <Unlink className="h-3.5 w-3.5 mr-1.5" />
        Disconnect
      </Button>
    </div>
  );
}
