"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { ContentCell } from "../../types";

const ICON_OPTIONS = ["shield", "star", "clock", "heart", "award", "zap", "users", "check-circle"];

export function CellFields({ cell, onChange }: { cell: ContentCell; onChange: (content: Record<string, unknown>) => void }) {
  const c = cell.content;
  const set = (k: string, v: unknown) => onChange({ ...c, [k]: v });

  switch (cell.type) {
    case "text":
      return <Textarea className="text-xs min-h-[60px]" placeholder="Enter text..." value={(c.text as string) || ""} onChange={(e) => set("text", e.target.value)} rows={3} />;

    case "heading":
      return (<div className="space-y-2">
        <Input className="h-8 text-xs" placeholder="Heading text" value={(c.text as string) || ""} onChange={(e) => set("text", e.target.value)} />
        <Select value={(c.level as string) || "h3"} onValueChange={(v) => set("level", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="h2" className="text-xs">H2 — Large</SelectItem>
            <SelectItem value="h3" className="text-xs">H3 — Medium</SelectItem>
            <SelectItem value="h4" className="text-xs">H4 — Small</SelectItem>
          </SelectContent>
        </Select>
      </div>);

    case "image":
      return (<div className="space-y-2">
        <Input className="h-8 text-xs" placeholder="Image URL" value={(c.url as string) || ""} onChange={(e) => set("url", e.target.value)} />
        <Input className="h-8 text-xs" placeholder="Alt text" value={(c.alt as string) || ""} onChange={(e) => set("alt", e.target.value)} />
        <Input className="h-8 text-xs" placeholder="Caption (optional)" value={(c.caption as string) || ""} onChange={(e) => set("caption", e.target.value)} />
      </div>);

    case "testimonial":
      return (<div className="space-y-2">
        <Input className="h-8 text-xs" placeholder="Customer name" value={(c.name as string) || ""} onChange={(e) => set("name", e.target.value)} />
        <Textarea className="text-xs min-h-[50px]" placeholder="Review text..." value={(c.text as string) || ""} onChange={(e) => set("text", e.target.value)} rows={2} />
        <Select value={String((c.rating as number) || 5)} onValueChange={(v) => set("rating", Number(v))}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[5, 4, 3, 2, 1].map((r) => <SelectItem key={r} value={String(r)} className="text-xs">{r} Star{r !== 1 ? "s" : ""}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>);

    case "bullet_list": {
      const items = (c.items as string[]) || [""];
      return (<div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={`bullet-${i}`} className="flex gap-1">
            <Input className="h-7 text-xs flex-1" placeholder={`Item ${i + 1}`} value={item} onChange={(e) => { const next = [...items]; next[i] = e.target.value; set("items", next); }} />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => set("items", items.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3 text-destructive" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={() => set("items", [...items, ""])}><Plus className="h-3 w-3 mr-1" />Add Item</Button>
      </div>);
    }

    case "icon_text":
      return (<div className="space-y-2">
        <Select value={(c.icon as string) || "shield"} onValueChange={(v) => set("icon", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ICON_OPTIONS.map((ic) => <SelectItem key={ic} value={ic} className="text-xs capitalize">{ic.replace("-", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input className="h-8 text-xs" placeholder="Title" value={(c.title as string) || ""} onChange={(e) => set("title", e.target.value)} />
        <Textarea className="text-xs min-h-[40px]" placeholder="Description" value={(c.description as string) || ""} onChange={(e) => set("description", e.target.value)} rows={2} />
      </div>);

    case "spacer":
      return (
        <Select value={(c.height as string) || "md"} onValueChange={(v) => set("height", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sm" className="text-xs">Small</SelectItem>
            <SelectItem value="md" className="text-xs">Medium</SelectItem>
            <SelectItem value="lg" className="text-xs">Large</SelectItem>
          </SelectContent>
        </Select>
      );

    default: return null;
  }
}
