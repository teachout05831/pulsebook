'use client';

import { ImageUploadField, MultiImageUploadField } from '@/features/media';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BrandKitInput } from '../../types';

interface Props {
  form: BrandKitInput;
  set: (key: keyof BrandKitInput, value: unknown) => void;
}

export function BrandMediaTab({ form, set }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Assets</CardTitle>
        <CardDescription>Logo, images, and video for your brand</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <ImageUploadField
          value={form.logoUrl ?? null}
          onChange={(url) => set('logoUrl', url)}
          label="Company Logo"
          context="brand-kit"
        />
        <ImageUploadField
          value={form.faviconUrl ?? null}
          onChange={(url) => set('faviconUrl', url)}
          label="Favicon"
          context="brand-kit"
          maxSizeMb={2}
        />
        <div className="sm:col-span-2">
          <ImageUploadField
            value={form.heroImageUrl ?? null}
            onChange={(url) => set('heroImageUrl', url)}
            label="Hero Image"
            context="brand-kit"
            maxSizeMb={15}
          />
        </div>
        <div className="sm:col-span-2">
          <MultiImageUploadField
            value={form.companyPhotos ?? []}
            onChange={(urls) => set('companyPhotos', urls)}
            label="Company Photos"
            context="brand-kit"
            maxImages={12}
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-xs">Video Intro URL</Label>
          <Input
            className="h-8 text-xs"
            value={form.videoIntroUrl ?? ''}
            onChange={(e) => set('videoIntroUrl', e.target.value || null)}
            placeholder="https://... (Bunny Stream or YouTube URL)"
          />
        </div>
      </CardContent>
    </Card>
  );
}
