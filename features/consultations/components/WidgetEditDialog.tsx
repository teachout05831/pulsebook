"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Settings2, Paintbrush, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { WidgetContentEditor } from "./WidgetContentEditor";
import { WidgetPreview } from "./WidgetPreview";
import type { CallWidget } from "../types";

interface WidgetEditDialogProps {
  widget: CallWidget | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (widget: CallWidget) => void;
}

export function WidgetEditDialog({ widget, open, onClose, onUpdate }: WidgetEditDialogProps) {
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    onClose();
    setShowPreview(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-h-[80vh] flex flex-col sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit {widget?.label}</DialogTitle>
            <div className="flex gap-1 rounded-lg bg-muted p-0.5">
              <button onClick={() => setShowPreview(false)} className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${!showPreview ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Settings2 className="h-3 w-3" />Configure
              </button>
              <button onClick={() => setShowPreview(true)} className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${showPreview ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Eye className="h-3 w-3" />Preview
              </button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {widget && !showPreview && (
            <>
              <div className="space-y-1.5">
                <Label>Button Label</Label>
                <Input value={widget.label} onChange={(e) => onUpdate({ ...widget, label: e.target.value })} />
              </div>
              <WidgetContentEditor widget={widget} onChange={onUpdate} />
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push(`/settings/consultations/widget-builder?type=${widget.type}`);
                }}
                className="flex items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors w-full text-left"
              >
                <Paintbrush className="h-4 w-4 shrink-0" />
                <span className="flex-1">Edit in Builder</span>
                <span className="text-xs">
                  {widget.sections?.length ? `${widget.sections.length} sections` : "Design rich content"}
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            </>
          )}
          {widget && showPreview && <WidgetPreview widget={widget} />}
        </div>
        <DialogFooter><Button onClick={handleClose}>Done</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
