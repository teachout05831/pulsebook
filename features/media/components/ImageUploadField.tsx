'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBunnyUpload } from '../hooks/useBunnyUpload';
import type { MediaContext, FileCategory } from '../types';

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  context: MediaContext;
  category?: FileCategory;
  accept?: string;
  maxSizeMb?: number;
}

export function ImageUploadField({
  value,
  onChange,
  label,
  context,
  category = 'photo',
  accept = 'image/*',
  maxSizeMb = 10,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { upload, isUploading } = useBunnyUpload();

  const handleFile = useCallback(async (file: File) => {
    if (file.size > maxSizeMb * 1024 * 1024) return;
    const result = await upload(file, { context, category });
    if (result.url) onChange(result.url);
  }, [upload, context, category, maxSizeMb, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {value ? (
        <div className="relative group w-full aspect-video rounded-md overflow-hidden border bg-muted">
          <Image src={value} alt={label} fill className="object-contain" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center gap-2 w-full aspect-video rounded-md border-2 border-dashed cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Drop image or click to upload
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                Max {maxSizeMb}MB
              </span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
