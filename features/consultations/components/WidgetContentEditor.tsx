"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProcessStepEditor } from "./ProcessStepEditor";
import { FaqEditor } from "./FaqEditor";
import { VideoAssetPicker } from "@/features/media/components/VideoAssetPicker";
import type { CallWidget, ProcessStep, FaqItem } from "./CallWidgetBar";

interface WidgetContentEditorProps {
  widget: CallWidget;
  onChange: (widget: CallWidget) => void;
}

export function WidgetContentEditor({ widget, onChange }: WidgetContentEditorProps) {
  const update = (fields: Partial<CallWidget>) => onChange({ ...widget, ...fields });

  if (widget.type === "process") {
    return (
      <ProcessStepEditor
        steps={widget.processSteps || []}
        onChange={(processSteps: ProcessStep[]) => update({ processSteps })}
      />
    );
  }

  if (widget.type === "faq") {
    return (
      <FaqEditor
        faqs={widget.faqs || []}
        onChange={(faqs: FaqItem[]) => update({ faqs })}
      />
    );
  }

  if (widget.type === "video") {
    return (
      <VideoAssetPicker
        selectedIds={widget.videoAssetIds || []}
        onChange={(videoAssetIds) => update({ videoAssetIds })}
      />
    );
  }

  if (widget.type === "custom_link") {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Content URL</Label>
          <Input
            value={widget.url || ""}
            onChange={(e) => update({ url: e.target.value || undefined })}
            placeholder="https://..."
          />
          <p className="text-xs text-muted-foreground">Page will be embedded inline during the call</p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Or paste text content</Label>
          <Textarea
            value={widget.content || ""}
            onChange={(e) => update({ content: e.target.value || undefined })}
            placeholder="Enter text content to display..."
            rows={4}
            className="text-sm resize-none"
          />
        </div>
      </div>
    );
  }

  // Reviews & Portfolio pull from Brand Kit
  if (widget.type === "reviews" || widget.type === "portfolio") {
    return (
      <div className="rounded-lg border p-3 bg-muted/50">
        <p className="text-xs text-muted-foreground">
          {widget.type === "reviews"
            ? "Reviews, testimonials, and Google rating are pulled from your Brand Kit automatically."
            : "Work photos and before/after images are pulled from your Brand Kit automatically."}
          {" "}Update your <a href="/settings/brand-kit" className="text-primary underline">Brand Kit</a> to change this content.
        </p>
      </div>
    );
  }

  // Estimate & Contract are auto-linked
  if (widget.type === "estimate" || widget.type === "contract") {
    return (
      <div className="rounded-lg border p-3 bg-muted/50">
        <p className="text-xs text-muted-foreground">
          {widget.type === "estimate"
            ? "The estimate widget automatically shows the linked estimate during the consultation. No configuration needed."
            : "The contract widget automatically shows the linked service agreement. No configuration needed."}
        </p>
      </div>
    );
  }

  return null;
}
