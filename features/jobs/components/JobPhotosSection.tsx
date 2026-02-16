'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBunnyUpload } from '@/features/media/hooks/useBunnyUpload';
import { useJobFiles } from '../hooks/useJobFiles';
import { formatFileSize } from '@/features/media/types';

interface Props {
  jobId: string;
}

export function JobPhotosSection({ jobId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { files, isLoading, handleUploadComplete, handleDelete } = useJobFiles(jobId);
  const { upload, isUploading } = useBunnyUpload();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    for (const file of Array.from(selectedFiles)) {
      if (!file.type.startsWith('image/')) continue;
      await upload(file, { context: 'job', category: 'photo', jobId });
    }
    handleUploadComplete();
    if (inputRef.current) inputRef.current.value = '';
  }, [upload, jobId, handleUploadComplete]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Job Photos</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="mr-2 h-3.5 w-3.5" />
          )}
          {isUploading ? 'Uploading...' : 'Upload Photos'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-md">
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No photos yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((file) => (
            <div key={file.id} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
              <Image src={file.storagePath} alt={file.fileName} fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white truncate">{file.fileName}</p>
                <p className="text-[10px] text-white/70">{formatFileSize(file.fileSize)}</p>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(file.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
