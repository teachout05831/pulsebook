"use client";

import { ArrowLeft, Save, Globe, Eye, BarChart3, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BuilderTopBarProps {
  mode: "page" | "template" | "widget" | "scheduling";
  isDirty: boolean;
  isSaving: boolean;
  pageId: string;
  backHref?: string;
  onSave: () => void;
  onPublish: () => void;
  onLoadTemplate?: () => void;
}

export function BuilderTopBar({ mode, isDirty, isSaving, pageId, backHref, onSave, onPublish, onLoadTemplate }: BuilderTopBarProps) {
  const title = mode === "scheduling" ? "Scheduling Page Builder" : mode === "widget" ? "Widget Builder" : mode === "template" ? "Template Builder" : "Page Builder";

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        {(mode === "widget" || mode === "scheduling") && backHref && (
          <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
            <a href={backHref}><ArrowLeft className="h-3.5 w-3.5" /></a>
          </Button>
        )}
        <h2 className="text-sm font-semibold">{title}</h2>
        {isDirty && <Badge variant="outline" className="text-xs text-amber-600">Unsaved</Badge>}
      </div>
      <div className="flex items-center gap-2">
        {mode === "widget" && onLoadTemplate && (
          <Button variant="outline" size="sm" onClick={onLoadTemplate}>
            <Wand2 className="mr-1.5 h-3.5 w-3.5" />
            Load from Template
          </Button>
        )}
        {mode === "page" && (
          <Button variant="ghost" size="sm" asChild>
            <a href={`/estimate-pages/${pageId}/preview`}><Eye className="mr-1.5 h-3.5 w-3.5" />Preview</a>
          </Button>
        )}
        {mode === "template" && (
          <Button variant="ghost" size="sm" asChild>
            <a href={`/template-preview/${pageId}`} target="_blank"><Eye className="mr-1.5 h-3.5 w-3.5" />Preview</a>
          </Button>
        )}
        {mode === "page" && (
          <Button variant="ghost" size="sm" asChild>
            <a href={`/estimate-pages/${pageId}/analytics`}><BarChart3 className="mr-1.5 h-3.5 w-3.5" />Analytics</a>
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving || !isDirty}>
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
        {(mode === "page" || mode === "scheduling") && (
          <Button size="sm" onClick={onPublish} disabled={isSaving}>
            <Globe className="mr-1.5 h-3.5 w-3.5" />
            Publish
          </Button>
        )}
      </div>
    </div>
  );
}
