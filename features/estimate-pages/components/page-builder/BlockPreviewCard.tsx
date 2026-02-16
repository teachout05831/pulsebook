"use client";

import DOMPurify from "dompurify";
import { Code2, Expand } from "lucide-react";
import { HTML_BLOCK_CATEGORIES, type HtmlBlock } from "../../types/htmlBlocks";
import { generatePreviewData } from "../../utils/blockPreviewData";
import { replaceVariables } from "../../utils/blockHelpers";

interface BlockPreviewCardProps {
  block: HtmlBlock;
  onSelect: (block: HtmlBlock) => void;
  onPreview: (block: HtmlBlock) => void;
}

export function BlockPreviewCard({ block, onSelect, onPreview }: BlockPreviewCardProps) {
  const previewData = generatePreviewData(block.variables);
  const previewHtml = replaceVariables(block.html, previewData);
  const previewCss = replaceVariables(block.css, previewData);

  return (
    <div className="group relative border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all bg-card">
      {/* Visual Preview */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-b">
        <div className="absolute inset-0 p-4 overflow-hidden">
          <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewCss) }} />
          <div
            className="transform scale-75 origin-top-left"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewHtml) }}
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(block);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
          title="Full preview"
        >
          <Expand className="h-3.5 w-3.5 text-slate-600" />
        </button>
      </div>

      {/* Block Info */}
      <button
        onClick={() => onSelect(block)}
        className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary shrink-0" />
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {block.name}
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
            {HTML_BLOCK_CATEGORIES.find((c) => c.value === block.category)?.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{block.description}</p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{block.variables.length} fields</span>
          <span>•</span>
          <span>Click to insert</span>
        </div>
      </button>
    </div>
  );
}
