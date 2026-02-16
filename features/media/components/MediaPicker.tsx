'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ImageIcon, Upload, Link2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaFiles } from '../hooks/useMediaFiles';
import { ImageUploadField } from './ImageUploadField';

interface Props {
  open: boolean;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function MediaPicker({ open, onSelect, onClose }: Props) {
  const { files, isLoading } = useMediaFiles({ category: 'photo' });
  const [pasteUrl, setPasteUrl] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handlePasteSubmit = useCallback(() => {
    if (pasteUrl.trim()) {
      onSelect(pasteUrl.trim());
      setPasteUrl('');
      onClose();
    }
  }, [pasteUrl, onSelect, onClose]);

  const handleUploadComplete = useCallback((url: string | null) => {
    if (url) {
      setUploadedUrl(url);
      onSelect(url);
      onClose();
    }
  }, [onSelect, onClose]);

  const handleLibrarySelect = useCallback((url: string) => {
    onSelect(url);
    onClose();
  }, [onSelect, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library"><ImageIcon className="mr-1.5 h-3.5 w-3.5" />Library</TabsTrigger>
            <TabsTrigger value="upload"><Upload className="mr-1.5 h-3.5 w-3.5" />Upload</TabsTrigger>
            <TabsTrigger value="url"><Link2 className="mr-1.5 h-3.5 w-3.5" />Paste URL</TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : files.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No images uploaded yet. Upload one or paste a URL.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {files.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="relative aspect-square rounded-md overflow-hidden border hover:border-primary hover:ring-2 hover:ring-primary/20 transition-all"
                    onClick={() => handleLibrarySelect(f.storagePath)}
                  >
                    <Image src={f.storagePath} alt={f.fileName} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="mt-2">
            <ImageUploadField
              value={uploadedUrl}
              onChange={handleUploadComplete}
              label="Upload New Image"
              context="estimate-page"
            />
          </TabsContent>

          <TabsContent value="url" className="mt-2 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Image URL</Label>
              <Input
                className="text-xs"
                value={pasteUrl}
                onChange={(e) => setPasteUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Button size="sm" onClick={handlePasteSubmit} disabled={!pasteUrl.trim()}>
              Use This URL
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
