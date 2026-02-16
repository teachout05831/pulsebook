"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadField } from "@/features/media/components/ImageUploadField";

interface TrustBadge {
  id: string;
  label: string;
  imageUrl?: string;
}

export type { TrustBadge };

export function TrustBadgeListEditor({
  badges,
  onChange,
}: { badges: TrustBadge[]; onChange: (badges: TrustBadge[]) => void }) {
  const update = (i: number, field: keyof TrustBadge, value: string) => {
    const copy = [...badges];
    copy[i] = { ...copy[i], [field]: value };
    onChange(copy);
  };
  const remove = (i: number) => onChange(badges.filter((_, idx) => idx !== i));
  const add = () => onChange([...badges, { id: crypto.randomUUID(), label: "" }]);

  return (
    <div className="space-y-2">
      <Label className="text-xs">Custom Badges</Label>
      {badges.map((badge, i) => (
        <div key={badge.id} className="relative space-y-1.5 rounded border p-2.5 pr-8">
          <Input className="h-7 text-xs" placeholder="Badge label (e.g. BBB A+ Rated)"
            value={badge.label} onChange={(e) => update(i, "label", e.target.value)} />
          <ImageUploadField value={badge.imageUrl || null}
            onChange={(url) => update(i, "imageUrl", url || "")} label="Badge Icon (optional)" context="estimate-page" />
          <button type="button" onClick={() => remove(i)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={add}>
        <Plus className="h-3 w-3 mr-1" /> Add Badge
      </Button>
    </div>
  );
}
