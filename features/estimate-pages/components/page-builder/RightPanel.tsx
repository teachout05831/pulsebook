"use client";

import { useState } from "react";
import { Code2, Paintbrush, Settings2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SectionEditor } from "./SectionEditor";
import { DesignThemePanel } from "./DesignThemePanel";
import { IncentiveEditor } from "./IncentiveEditor";
import type { PageSection, DesignTheme, IncentiveConfig } from "../../types";

type Tab = "section" | "theme" | "incentive" | "code";

interface RightPanelProps {
  selectedSection: PageSection | null;
  designTheme: DesignTheme;
  incentiveConfig: IncentiveConfig | null;
  primaryColor: string;
  secondaryColor: string;
  onUpdateSection: (id: string, updates: Partial<PageSection> | ((s: PageSection) => Partial<PageSection>)) => void;
  onUpdateTheme: (updates: Partial<DesignTheme>) => void;
  onSelectPreset: (presetId: string) => void;
  onUpdateIncentiveConfig: (config: IncentiveConfig) => void;
  onCloseSection: () => void;
  onDisconnectSection?: (sectionId: string) => void;
}

export function RightPanel({
  selectedSection,
  designTheme,
  incentiveConfig,
  primaryColor,
  secondaryColor,
  onUpdateSection,
  onUpdateTheme,
  onSelectPreset,
  onUpdateIncentiveConfig,
  onCloseSection,
  onDisconnectSection,
}: RightPanelProps) {
  const [tab, setTab] = useState<Tab>("section");
  const [editing, setEditing] = useState<"html" | "css" | null>(null);
  const isCustomHtml = selectedSection?.type === "custom_html";

  const html = isCustomHtml ? (selectedSection.content.html as string) || "" : "";
  const css = isCustomHtml ? (selectedSection.content.css as string) || "" : "";

  const updateCode = (key: "html" | "css", value: string) => {
    if (!selectedSection) return;
    onUpdateSection(selectedSection.id, (s) => ({ content: { ...s.content, [key]: value } }));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none gap-1.5 ${tab === "section" ? "border-b-2 border-primary" : ""}`}
          onClick={() => setTab("section")}
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span className="text-xs">Section</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none gap-1.5 ${tab === "theme" ? "border-b-2 border-primary" : ""}`}
          onClick={() => setTab("theme")}
        >
          <Paintbrush className="h-3.5 w-3.5" />
          <span className="text-xs">Theme</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none gap-1.5 ${tab === "incentive" ? "border-b-2 border-primary" : ""}`}
          onClick={() => setTab("incentive")}
        >
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs">Offers</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none gap-1.5 ${tab === "code" ? "border-b-2 border-primary" : ""}`}
          onClick={() => setTab("code")}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span className="text-xs">Code</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === "section" ? (
          <SectionEditor
            section={selectedSection}
            onUpdate={onUpdateSection}
            onClose={onCloseSection}
            onDisconnect={onDisconnectSection}
          />
        ) : tab === "theme" ? (
          <DesignThemePanel
            theme={designTheme}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onUpdate={onUpdateTheme}
            onSelectPreset={onSelectPreset}
          />
        ) : tab === "code" ? (
          isCustomHtml ? (
            <div className="flex flex-col gap-3 p-4">
              <h3 className="text-sm font-semibold">HTML & CSS</h3>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9" onClick={() => setEditing("html")}>
                <Code2 className="h-3.5 w-3.5" />
                <span className="text-xs">{html.length > 0 ? `Edit HTML (${html.length} chars)` : "Add HTML"}</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9" onClick={() => setEditing("css")}>
                <Code2 className="h-3.5 w-3.5" />
                <span className="text-xs">{css.length > 0 ? `Edit CSS (${css.length} chars)` : "Add CSS"}</span>
              </Button>
              {html.length > 0 && <p className="text-[11px] text-muted-foreground">Use <code>:scope</code> in CSS to target this section only.</p>}
              <hr className="border-border" />
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">Template Variables</p>
                <p className="text-[11px] text-muted-foreground">Use these in your HTML to pull in live data:</p>
                <div className="text-[10px] font-mono text-muted-foreground space-y-0.5">
                  <p>{"{{customer.name}}"} {"{{customer.email}}"} {"{{customer.phone}}"}</p>
                  <p>{"{{estimate.total}}"} {"{{estimate.number}}"} {"{{estimate.subtotal}}"}</p>
                  <p>{"{{brand.tagline}}"} {"{{brand.logoUrl}}"} {"{{brand.googleRating}}"}</p>
                </div>
              </div>
              <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex gap-2">
                      <Button variant={editing === "html" ? "default" : "outline"} size="sm" onClick={() => setEditing("html")}>HTML</Button>
                      <Button variant={editing === "css" ? "default" : "outline"} size="sm" onClick={() => setEditing("css")}>CSS</Button>
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    className="flex-1 font-mono text-xs leading-relaxed resize-none"
                    placeholder={editing === "html" ? "<div>Your HTML here...</div>" : ":scope .my-class { color: red; }"}
                    value={editing === "html" ? html : css}
                    onChange={(e) => editing && updateCode(editing, e.target.value)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <Code2 className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm font-medium">Code Editor</p>
                <p className="text-xs text-muted-foreground">Select a <strong>Custom HTML</strong> section from the left panel to edit its HTML & CSS code.</p>
                <p className="text-xs text-muted-foreground">You can add one using the + button at the bottom of the section list.</p>
              </div>
            </div>
          )
        ) : (
          <IncentiveEditor config={incentiveConfig} onUpdate={onUpdateIncentiveConfig} />
        )}
      </div>
    </div>
  );
}
