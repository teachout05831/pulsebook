"use client";

import { useRef, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Props {
  onUpload: (file: File) => Promise<{ error?: string; success?: boolean }>;
  maxSizeMb?: number;
}

export function CustomerPhotoUpload({ onUpload, maxSizeMb = 10 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMb}MB)`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Only images are allowed");
      return;
    }

    setIsUploading(true);
    setError(null);
    const result = await onUpload(file);
    setIsUploading(false);

    if (result.error) setError(result.error);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Upload Photo</Label>
      <button
        type="button"
        className="flex items-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 px-4 py-3 cursor-pointer transition-colors w-full justify-center"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Plus className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm text-muted-foreground">
          {isUploading ? "Uploading..." : "Add photo"}
        </span>
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
