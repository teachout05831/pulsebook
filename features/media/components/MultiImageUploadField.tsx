'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';
import { Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBunnyUpload } from '../hooks/useBunnyUpload';
import type { MediaContext, FileCategory } from '../types';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  label: string;
  context: MediaContext;
  category?: FileCategory;
  maxImages?: number;
  accept?: string;
  maxSizeMb?: number;
}

export function MultiImageUploadField({
  value,
  onChange,
  label,
  context,
  category = 'photo',
  maxImages = 20,
  accept = 'image/*',
  maxSizeMb = 10,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useBunnyUpload();

  const handleFiles = useCallback(async (files: FileList) => {
    const remaining = maxImages - value.length;
    const toUpload = Array.from(files).slice(0, remaining);
    const newUrls: string[] = [];

    for (const file of toUpload) {
      if (file.size > maxSizeMb * 1024 * 1024) continue;
      if (!file.type.startsWith('image/')) continue;
      const result = await upload(file, { context, category });
      if (result.url) newUrls.push(result.url);
    }

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }
  }, [upload, context, category, maxImages, maxSizeMb, value, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  }, [handleFiles]);

  const handleRemove = useCallback((index: number) => {
    onChange(value.filter((_, i) => i !== index));
  }, [value, onChange]);

  const canAdd = value.length < maxImages;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label} ({value.length}/{maxImages})</Label>
      <div className="grid grid-cols-3 gap-2">
        {value.map((url, i) => (
          <div key={url} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
            <Image src={url} alt={`${label} ${i + 1}`} fill className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(i)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {canAdd && (
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Add</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
