"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadField } from "@/features/media/components/ImageUploadField";

interface FAQItem { question: string; answer: string }
interface Testimonial { name: string; text: string; rating: number }
interface TimelineStep { title: string; description: string }
interface PhotoItem { url: string; caption?: string }

function ItemWrap({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative space-y-1.5 rounded border p-2.5 pr-8">
      {children}
      <button type="button" onClick={onRemove} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (<Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={onClick}><Plus className="h-3 w-3 mr-1" /> {label}</Button>);
}

export function FAQListEditor({ items, onChange }: { items: FAQItem[]; onChange: (items: FAQItem[]) => void }) {
  const update = (i: number, field: keyof FAQItem, value: string) => {
    const copy = [...items]; copy[i] = { ...copy[i], [field]: value }; onChange(copy);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { question: "", answer: "" }]);
  return (
    <div className="space-y-2">
      <Label className="text-xs">FAQ Items</Label>
      {items.map((item, i) => (
        <ItemWrap key={`faq-${i}`} onRemove={() => remove(i)}>
          <Input className="h-7 text-xs" placeholder="Question" value={item.question}
            onChange={(e) => update(i, "question", e.target.value)} />
          <Textarea className="text-xs min-h-[40px]" placeholder="Answer" value={item.answer}
            onChange={(e) => update(i, "answer", e.target.value)} rows={2} />
        </ItemWrap>
      ))}
      <AddBtn label="Add Question" onClick={add} />
    </div>
  );
}

export function TestimonialListEditor({ items, onChange }: { items: Testimonial[]; onChange: (items: Testimonial[]) => void }) {
  const update = (i: number, field: keyof Testimonial, value: string | number) => {
    const copy = [...items]; copy[i] = { ...copy[i], [field]: value }; onChange(copy);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { name: "", text: "", rating: 5 }]);
  return (
    <div className="space-y-2">
      <Label className="text-xs">Testimonials</Label>
      {items.map((item, i) => (
        <ItemWrap key={`testimonial-${i}`} onRemove={() => remove(i)}>
          <div className="flex gap-1.5">
            <Input className="h-7 text-xs flex-1" placeholder="Name" value={item.name}
              onChange={(e) => update(i, "name", e.target.value)} />
            <select className="h-7 w-14 text-xs border rounded bg-background px-1"
              value={item.rating} onChange={(e) => update(i, "rating", Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}★</option>)}
            </select>
          </div>
          <Textarea className="text-xs min-h-[40px]" placeholder="Review text..." value={item.text}
            onChange={(e) => update(i, "text", e.target.value)} rows={2} />
        </ItemWrap>
      ))}
      <AddBtn label="Add Testimonial" onClick={add} />
    </div>
  );
}

export function TimelineListEditor({ steps, onChange }: { steps: TimelineStep[]; onChange: (steps: TimelineStep[]) => void }) {
  const update = (i: number, field: keyof TimelineStep, value: string) => {
    const copy = [...steps]; copy[i] = { ...copy[i], [field]: value }; onChange(copy);
  };
  const remove = (i: number) => onChange(steps.filter((_, idx) => idx !== i));
  const add = () => onChange([...steps, { title: "", description: "" }]);
  return (
    <div className="space-y-2">
      <Label className="text-xs">Timeline Steps</Label>
      {steps.map((step, i) => (
        <ItemWrap key={`timeline-${i}`} onRemove={() => remove(i)}>
          <Input className="h-7 text-xs" placeholder="Step title" value={step.title}
            onChange={(e) => update(i, "title", e.target.value)} />
          <Input className="h-7 text-xs" placeholder="Description" value={step.description}
            onChange={(e) => update(i, "description", e.target.value)} />
        </ItemWrap>
      ))}
      <AddBtn label="Add Step" onClick={add} />
    </div>
  );
}

export function PhotoListEditor({ items, onChange }: { items: PhotoItem[]; onChange: (items: PhotoItem[]) => void }) {
  const update = (i: number, field: keyof PhotoItem, value: string) => {
    const copy = [...items]; copy[i] = { ...copy[i], [field]: value }; onChange(copy);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { url: "", caption: "" }]);
  return (
    <div className="space-y-2">
      <Label className="text-xs">Photos</Label>
      {items.map((item, i) => (
        <ItemWrap key={`photo-${i}`} onRemove={() => remove(i)}>
          <ImageUploadField value={item.url || null} onChange={(url) => update(i, "url", url || "")}
            label={`Photo ${i + 1}`} context="estimate-page" />
          <Input className="h-7 text-xs" placeholder="Photo caption" value={item.caption ?? ""}
            onChange={(e) => update(i, "caption", e.target.value)} />
        </ItemWrap>
      ))}
      <AddBtn label="Add Photo" onClick={add} />
    </div>
  );
}
