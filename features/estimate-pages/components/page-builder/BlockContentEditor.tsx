"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getFieldLabel, isLongText, replaceVariables } from "../../utils/blockHelpers";
import type { HtmlBlock } from "../../types/htmlBlocks";

interface BlockContentEditorProps {
  block: HtmlBlock | null;
  open: boolean;
  onClose: () => void;
  onInsert: (html: string, css: string, values: Record<string, string>) => void;
}

export function BlockContentEditor({ block, open, onClose, onInsert }: BlockContentEditorProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleValueChange = (varName: string, value: string) => {
    setValues((prev) => ({ ...prev, [varName]: value }));
  };

  const handleInsert = () => {
    if (!block) return;

    const html = replaceVariables(block.html, values);
    const css = replaceVariables(block.css, values);

    onInsert(html, css, values);
    setValues({});
    onClose();
  };

  const handleCancel = () => {
    setValues({});
    onClose();
  };

  if (!block) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Customize {block.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">{block.description}</p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {block.variables.map((varName) => {
            const label = getFieldLabel(varName);
            const isLong = isLongText(varName);
            const value = values[varName] || "";

            return (
              <div key={varName} className="space-y-1.5">
                <Label htmlFor={varName} className="text-sm font-medium">
                  {label}
                </Label>
                {isLong ? (
                  <Textarea
                    id={varName}
                    value={value}
                    onChange={(e) => handleValueChange(varName, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    className="min-h-[80px]"
                    rows={3}
                  />
                ) : (
                  <Input
                    id={varName}
                    value={value}
                    onChange={(e) => handleValueChange(varName, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>
            Insert Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
