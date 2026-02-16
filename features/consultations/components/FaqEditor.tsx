"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FaqItem } from "./CallWidgetBar";

interface FaqEditorProps {
  faqs: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
}

const MAX_FAQS = 15;

export function FaqEditor({ faqs, onChange }: FaqEditorProps) {
  const handleAdd = () => {
    if (faqs.length >= MAX_FAQS) return;
    onChange([...faqs, { question: "", answer: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(faqs.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof FaqItem, value: string) => {
    const next = [...faqs];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">FAQ Items</Label>
        <span className="text-xs text-muted-foreground">{faqs.length}/{MAX_FAQS}</span>
      </div>

      {faqs.length === 0 && (
        <p className="text-xs text-muted-foreground py-4 text-center">No FAQs yet. Add your first question below.</p>
      )}

      {faqs.map((faq, i) => (
        <div key={`faq-${i}`} className="rounded-lg border p-3 space-y-2 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground shrink-0 w-5 text-center">Q{i + 1}</span>
            <Input
              value={faq.question}
              onChange={(e) => handleUpdate(i, "question", e.target.value)}
              placeholder="Question"
              className="h-8 text-sm"
            />
            <div className="flex items-center gap-0.5 shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(i, -1)} disabled={i === 0}>
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(i, 1)} disabled={i === faqs.length - 1}>
                <ArrowDown className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemove(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Textarea
            value={faq.answer}
            onChange={(e) => handleUpdate(i, "answer", e.target.value)}
            placeholder="Answer"
            className="text-sm min-h-[60px] resize-none"
            rows={2}
          />
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full" onClick={handleAdd} disabled={faqs.length >= MAX_FAQS}>
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add FAQ
      </Button>
    </div>
  );
}
