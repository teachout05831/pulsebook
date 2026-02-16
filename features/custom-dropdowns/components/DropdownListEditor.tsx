"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import type { DropdownOption } from "@/types/company";

interface Props {
  options: DropdownOption[];
  onChange: (options: DropdownOption[]) => void;
  description: string;
}

export function DropdownListEditor({ options, onChange, description }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditLabel(options[index].label);
  };

  const confirmEdit = () => {
    if (editingIndex === null || !editLabel.trim()) return;
    const updated = options.map((opt, i) =>
      i === editingIndex ? { ...opt, label: editLabel.trim(), value: editLabel.trim().toLowerCase().replace(/\s+/g, "_") } : opt
    );
    onChange(updated);
    setEditingIndex(null);
  };

  const addOption = () => {
    if (!newLabel.trim()) return;
    const value = newLabel.trim().toLowerCase().replace(/\s+/g, "_");
    onChange([...options, { value, label: newLabel.trim() }]);
    setNewLabel("");
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...options];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onChange(reordered);
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">{description}</p>
      <div className="space-y-1">
        {options.map((opt, i) => (
          <div
            key={`${opt.value}-${i}`}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className="flex items-center gap-2 rounded-md border bg-white px-2 py-1.5 text-sm hover:bg-slate-50"
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-400" />
            {editingIndex === i ? (
              <>
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                  className="h-7 flex-1"
                  autoFocus
                />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={confirmEdit}>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingIndex(null)}>
                  <X className="h-3.5 w-3.5 text-slate-400" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">{opt.label}</span>
                {opt.isDefault && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">DEFAULT</span>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(i)}>
                  <Pencil className="h-3.5 w-3.5 text-slate-400" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeOption(i)}>
                  <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addOption()}
          placeholder="Add new option..."
          className="h-8 flex-1"
        />
        <Button variant="outline" size="sm" onClick={addOption} disabled={!newLabel.trim()}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add
        </Button>
      </div>
    </div>
  );
}
