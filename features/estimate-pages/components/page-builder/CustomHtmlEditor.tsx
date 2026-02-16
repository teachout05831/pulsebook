"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Code2, Blocks } from "lucide-react";
import { HtmlBlockPicker } from "./HtmlBlockPicker";
import { BlockContentEditor } from "./BlockContentEditor";
import type { HtmlBlock } from "../../types/htmlBlocks";

interface CustomHtmlEditorProps {
  html: string;
  css: string;
  onHtml: (v: string) => void;
  onCss: (v: string) => void;
  onBatchUpdateContent?: (updates: Record<string, unknown>) => void;
}

export function CustomHtmlEditor({ html, css, onHtml, onCss, onBatchUpdateContent }: CustomHtmlEditorProps) {
  const [editing, setEditing] = useState<"html" | "css" | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<HtmlBlock | null>(null);
  const hasHtml = html.length > 0;
  const hasCss = css.length > 0;

  const handleBlockSelect = (block: HtmlBlock) => {
    setSelectedBlock(block);
    setShowBlockPicker(false);
  };

  const handleBlockInsert = (blockHtml: string, blockCss: string, blockValues: Record<string, string>) => {
    const newHtml = html + "\n" + blockHtml;
    const newCss = css + "\n\n" + blockCss;

    // Store block metadata so we can edit it visually later
    if (onBatchUpdateContent && selectedBlock) {
      onBatchUpdateContent({
        html: newHtml,
        css: newCss,
        blockId: selectedBlock.id,
        blockValues: blockValues,
      });
    } else {
      onHtml(newHtml);
      onCss(newCss);
    }
    setSelectedBlock(null);
  };

  return (
    <>
      <div className="space-y-2">
        <Button variant="default" size="sm" className="w-full justify-start gap-2 h-9" onClick={() => setShowBlockPicker(true)}>
          <Blocks className="h-3.5 w-3.5" />
          <span className="text-xs">Browse Block Library</span>
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9" onClick={() => setEditing("html")}>
          <Code2 className="h-3.5 w-3.5" />
          <span className="text-xs">{hasHtml ? `Edit HTML (${html.length} chars)` : "Add HTML"}</span>
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9" onClick={() => setEditing("css")}>
          <Code2 className="h-3.5 w-3.5" />
          <span className="text-xs">{hasCss ? `Edit CSS (${css.length} chars)` : "Add CSS"}</span>
        </Button>
        {hasHtml && <p className="text-[11px] text-muted-foreground">Use :scope in CSS to target this section only.</p>}
      </div>
      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editing === "html" ? "Edit HTML" : "Edit CSS"}</DialogTitle>
          </DialogHeader>
          <Textarea
            className="flex-1 font-mono text-xs leading-relaxed resize-none"
            placeholder={editing === "html" ? "<div>Your HTML here...</div>" : ":scope .my-class { color: red; }"}
            value={editing === "html" ? html : css}
            onChange={(e) => editing === "html" ? onHtml(e.target.value) : onCss(e.target.value)}
          />
        </DialogContent>
      </Dialog>
      <HtmlBlockPicker open={showBlockPicker} onClose={() => setShowBlockPicker(false)} onSelect={handleBlockSelect} />
      <BlockContentEditor block={selectedBlock} open={!!selectedBlock} onClose={() => setSelectedBlock(null)} onInsert={handleBlockInsert} />
    </>
  );
}
