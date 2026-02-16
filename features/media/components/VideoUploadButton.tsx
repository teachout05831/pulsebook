'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, Loader2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBunnyVideoUpload } from '../hooks/useBunnyVideoUpload';
import type { VideoCategory } from '@/features/estimate-pages/types/core';

interface Props {
  onUploadComplete: (videoId: string) => void;
  defaultCategory?: VideoCategory;
}

const CATEGORIES: { value: VideoCategory; label: string }[] = [
  { value: 'intro', label: 'Introduction' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'process', label: 'Process' },
  { value: 'site_visit', label: 'Site Visit' },
  { value: 'before_after', label: 'Before & After' },
  { value: 'personal_message', label: 'Personal Message' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'other', label: 'Other' },
];

export function VideoUploadButton({ onUploadComplete, defaultCategory = 'intro' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VideoCategory>(defaultCategory);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadVideo, isUploading, progress } = useBunnyVideoUpload();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
    }
  }, [title]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !title.trim()) return;
    const result = await uploadVideo(selectedFile, { title: title.trim(), category });
    if (result.videoId) {
      onUploadComplete(result.videoId);
      setSelectedFile(null);
      setTitle('');
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [selectedFile, title, category, uploadVideo, onUploadComplete]);

  return (
    <div className="space-y-3 p-3 border rounded-md">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Film className="h-4 w-4" />Upload Video
      </div>
      {!selectedFile ? (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Upload className="mr-2 h-3.5 w-3.5" />Choose Video File
        </Button>
      ) : (
        <>
          <p className="text-xs text-muted-foreground truncate">{selectedFile.name}</p>
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input className="h-8 text-xs" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as VideoCategory)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {isUploading && <Progress value={progress} className="h-1.5" />}
          <Button type="button" size="sm" onClick={handleUpload} disabled={isUploading || !title.trim()}>
            {isUploading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-2 h-3.5 w-3.5" />}
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </>
      )}
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
    </div>
  );
}
