"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Code2, RefreshCw } from "lucide-react";
import { HTML_BLOCKS, type HtmlBlock } from "../../types/htmlBlocks";
import { replaceVariables } from "../../utils/blockHelpers";
import { HtmlBlockPicker } from "./HtmlBlockPicker";
import { BlockNotFoundWarning } from "./BlockNotFoundWarning";
import { BlockFieldList } from "./BlockFieldList";
import type { PageSection, CustomHtmlContent } from "../../types";

interface BlockFieldsEditorProps {
  section: PageSection;
  onUpdateContent: (key: string, value: unknown) => void;
  onBatchUpdateContent?: (updates: Record<string, unknown>) => void;
}

export function BlockFieldsEditor({ section, onUpdateContent, onBatchUpdateContent }: BlockFieldsEditorProps) {
  const content = section.content as Partial<CustomHtmlContent>;
  const blockId = content.blockId;
  const block = blockId ? HTML_BLOCKS.find(b => b.id === blockId) : null;

  const [values, setValues] = useState<Record<string, string>>(content.blockValues || {});
  const [showBlockPicker, setShowBlockPicker] = useState(false);

  // Initialize values from blockValues on mount
  useEffect(() => {
    if (content.blockValues) {
      setValues(content.blockValues);
    }
  }, [content.blockValues]);

  const handleValueChange = (varName: string, value: string) => {
    if (!block) return;
    const newValues = { ...values, [varName]: value };
    setValues(newValues);

    // Regenerate HTML and CSS with new values
    const newHtml = replaceVariables(block.html, newValues);
    const newCss = replaceVariables(block.css, newValues);

    // Update all at once
    if (onBatchUpdateContent) {
      onBatchUpdateContent({
        html: newHtml,
        css: newCss,
        blockValues: newValues,
      });
    } else {
      onUpdateContent('html', newHtml);
      onUpdateContent('css', newCss);
      onUpdateContent('blockValues', newValues);
    }
  };

  const handleSwitchToRawHtml = () => {
    if (onBatchUpdateContent) {
      onBatchUpdateContent({ blockId: undefined, blockValues: undefined });
    }
  };

  const handleSwitchBlock = (newBlock: HtmlBlock) => {
    // Keep existing values where variable names match
    const matchingValues: Record<string, string> = {};
    newBlock.variables.forEach((varName) => {
      if (values[varName]) {
        matchingValues[varName] = values[varName];
      }
    });

    setValues(matchingValues);

    // Generate HTML/CSS with new block
    const newHtml = replaceVariables(newBlock.html, matchingValues);
    const newCss = replaceVariables(newBlock.css, matchingValues);

    if (onBatchUpdateContent) {
      onBatchUpdateContent({
        html: newHtml,
        css: newCss,
        blockId: newBlock.id,
        blockValues: matchingValues,
      });
    }
    setShowBlockPicker(false);
  };

  if (!block) {
    return <BlockNotFoundWarning onSwitchToRawHtml={handleSwitchToRawHtml} />;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-foreground">Editing: {block.name}</h4>
          <p className="text-[11px] text-muted-foreground">{block.description}</p>
        </div>

        <BlockFieldList variables={block.variables} values={values} onChange={handleValueChange} />

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 h-8 text-xs"
            onClick={() => setShowBlockPicker(true)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Switch to Different Block
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 h-8 text-xs"
            onClick={handleSwitchToRawHtml}
          >
            <Code2 className="h-3.5 w-3.5" />
            Switch to Raw HTML Mode
          </Button>
        </div>
      </div>

      <HtmlBlockPicker
        open={showBlockPicker}
        onClose={() => setShowBlockPicker(false)}
        onSelect={handleSwitchBlock}
      />
    </>
  );
}
