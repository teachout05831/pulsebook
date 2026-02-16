"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PageSection, ContentCell, CellType } from "../../types";
import { CellFields } from "./CellFields";

const CELL_TYPE_LABELS: Record<CellType, string> = {
  text: "Text", heading: "Heading", image: "Image", testimonial: "Testimonial",
  bullet_list: "Bullet List", icon_text: "Icon + Text", spacer: "Spacer",
};

interface Props {
  section: PageSection;
  onUpdateContent: (key: string, value: unknown) => void;
  onBatchUpdateContent?: (updates: Record<string, unknown>) => void;
}

function makeCell(type: CellType = "spacer"): ContentCell {
  return { id: crypto.randomUUID(), type, content: {} };
}

function getCells(section: PageSection): ContentCell[] {
  return (section.content.cells as ContentCell[]) || [];
}

export function ContentBlockEditor({ section, onUpdateContent: uc, onBatchUpdateContent: ucBatch }: Props) {
  const columns = (section.content.columns as number) || 2;
  const gapSize = (section.content.gap as string) || "md";
  const cells = getCells(section);

  const setColumns = (count: number) => {
    const current = [...cells];
    while (current.length < count) current.push(makeCell());
    const batch = ucBatch ?? ((u: Record<string, unknown>) => { Object.entries(u).forEach(([k, v]) => uc(k, v)); });
    batch({ cells: current.slice(0, count), columns: count });
  };

  const updateCell = (index: number, updates: Partial<ContentCell>) => {
    const next = cells.map((cell, i) => i === index ? { ...cell, ...updates } : cell);
    uc("cells", next);
  };

  const updateCellContent = (index: number, content: Record<string, unknown>) => {
    const next = cells.map((cell, i) => i === index ? { ...cell, content } : cell);
    uc("cells", next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Columns</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((n) => (
            <Button key={n} variant={columns === n ? "default" : "outline"} size="sm" className="flex-1 h-8 text-xs" onClick={() => setColumns(n)}>{n}</Button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Gap</Label>
        <div className="flex gap-1">
          {(["sm", "md", "lg"] as const).map((g) => (
            <Button key={g} variant={gapSize === g ? "default" : "outline"} size="sm" className="flex-1 h-8 text-xs capitalize" onClick={() => uc("gap", g)}>{g}</Button>
          ))}
        </div>
      </div>
      <hr className="border-border" />
      {cells.slice(0, columns).map((cell, i) => (
        <div key={cell.id} className="space-y-2 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Column {i + 1}</Label>
          </div>
          <Select value={cell.type} onValueChange={(v) => updateCell(i, { type: v as CellType, content: {} })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(CELL_TYPE_LABELS) as CellType[]).map((t) => (
                <SelectItem key={t} value={t} className="text-xs">{CELL_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CellFields cell={cell} onChange={(content) => updateCellContent(i, content)} />
        </div>
      ))}
    </div>
  );
}
