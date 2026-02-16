"use client";

import { useState, useMemo } from "react";
import DOMPurify from "dompurify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { HTML_BLOCKS, HTML_BLOCK_CATEGORIES, type HtmlBlock, type HtmlBlockCategory, type HtmlBlockCategoryDef } from "../../types/htmlBlocks";
import { generatePreviewData } from "../../utils/blockPreviewData";
import { replaceVariables } from "../../utils/blockHelpers";
import { BlockPreviewCard } from "./BlockPreviewCard";

export interface BlockSource {
  label: string;
  blocks: HtmlBlock[];
  categories: HtmlBlockCategoryDef[];
}

interface HtmlBlockPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (block: HtmlBlock) => void;
  sources?: BlockSource[];
  defaultSourceIndex?: number;
}

export function HtmlBlockPicker({ open, onClose, onSelect, sources, defaultSourceIndex = 0 }: HtmlBlockPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<HtmlBlockCategory | "all">("all");
  const [previewBlock, setPreviewBlock] = useState<HtmlBlock | null>(null);
  const [sourceIndex, setSourceIndex] = useState(defaultSourceIndex);

  const activeBlocks = sources ? sources[sourceIndex]?.blocks ?? [] : HTML_BLOCKS;
  const activeCategories = sources ? sources[sourceIndex]?.categories ?? [] : HTML_BLOCK_CATEGORIES;

  const filteredBlocks = useMemo(() => {
    return activeBlocks.filter((block) => {
      const matchesSearch = search === "" ||
        block.name.toLowerCase().includes(search.toLowerCase()) ||
        block.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || block.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category, activeBlocks]);

  const handleSelect = (block: HtmlBlock) => {
    onSelect(block);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>HTML Block Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {sources && sources.length > 1 && (
            <div className="flex gap-1 rounded-lg bg-muted p-0.5 w-fit">
              {sources.map((source) => (
                <button key={source.label} onClick={() => { setSourceIndex(sources.indexOf(source)); setCategory("all"); }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    sourceIndex === sources.indexOf(source) ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>{source.label}</button>
              ))}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search blocks..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button variant={category === "all" ? "default" : "outline"} size="sm"
              onClick={() => setCategory("all")}>All</Button>
            {activeCategories.map((cat) => (
              <Button key={cat.value} variant={category === cat.value ? "default" : "outline"}
                size="sm" onClick={() => setCategory(cat.value)}>{cat.label}</Button>
            ))}
          </div>
        </div>

        {/* Blocks Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredBlocks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No blocks found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
              {filteredBlocks.map((block) => (
                <BlockPreviewCard
                  key={block.id}
                  block={block}
                  onSelect={handleSelect}
                  onPreview={setPreviewBlock}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> All blocks use <code className="bg-muted px-1 rounded">&#123;&#123;variable&#125;&#125;</code> syntax
            for dynamic content and <code className="bg-muted px-1 rounded">:scope</code> for scoped CSS.
          </p>
        </div>
      </DialogContent>

      {previewBlock && (
        <Dialog open={!!previewBlock} onOpenChange={() => setPreviewBlock(null)}>
          <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{previewBlock.name} - Full Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8">
              <style dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(replaceVariables(previewBlock.css, generatePreviewData(previewBlock.variables)))
              }} />
              <div dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(replaceVariables(previewBlock.html, generatePreviewData(previewBlock.variables)))
              }} />
            </div>
            <div className="border-t pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewBlock(null)}>Close Preview</Button>
              <Button onClick={() => { handleSelect(previewBlock); setPreviewBlock(null); }}>
                Insert This Block
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
