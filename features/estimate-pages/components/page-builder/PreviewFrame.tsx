"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Monitor, Smartphone, Tablet, Copy, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PublicEstimatePage } from "../PublicEstimatePage";
import { DESIGN_PRESETS, getPresetById } from "../../constants";
import type { PageSection, DesignTheme } from "../../types";

interface PreviewFrameProps {
  pageId: string;
  publicToken: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  status: string;
  estimate: {
    estimateNumber: string;
    total: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  } | null;
  customer: { name: string; email: string; phone: string } | null;
  brandKit: Parameters<typeof PublicEstimatePage>[0]["brandKit"];
  settings: Parameters<typeof PublicEstimatePage>[0]["settings"];
}

const DEVICES = [
  { id: "desktop", icon: Monitor, width: "w-full max-w-5xl" },
  { id: "tablet", icon: Tablet, width: "w-[768px]" },
  { id: "mobile", icon: Smartphone, width: "w-[375px]" },
] as const;

export function PreviewFrame({
  pageId, publicToken, sections, designTheme, status,
  estimate, customer, brandKit, settings,
}: PreviewFrameProps) {
  const router = useRouter();
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = useState<DesignTheme>(designTheme);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePresetChange = useCallback((presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) return;
    setPreviewTheme(preset.theme);
    setHasChanges(true);
  }, []);

  const handleSaveStyle = useCallback(async () => {
    const res = await fetch(`/api/estimate-pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ designTheme: previewTheme }),
    });
    if (res.ok) { toast.success("Design style saved"); setHasChanges(false); }
    else toast.error("Failed to save style");
  }, [pageId, previewTheme]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/e/${publicToken}`);
    toast.success("Public link copied");
  };

  const currentDevice = DEVICES.find((d) => d.id === device)!;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/estimate-pages/${pageId}`)}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Editor
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Preview</span>
        </div>
        <div className="flex items-center gap-2">
          {DEVICES.map((d) => (
            <Button key={d.id} variant={device === d.id ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setDevice(d.id)}>
              <d.icon className="h-3.5 w-3.5" />
            </Button>
          ))}
          <div className="h-5 w-px bg-border" />
          <Palette className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={previewTheme.activePresetId || ""} onValueChange={handlePresetChange}>
            <SelectTrigger className="h-7 w-[160px] text-xs">
              <SelectValue placeholder="Choose style..." />
            </SelectTrigger>
            <SelectContent>
              {DESIGN_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasChanges && (
            <Button variant="default" size="sm" className="h-7" onClick={handleSaveStyle}>
              <Save className="mr-1 h-3 w-3" /> Save Style
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Link
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex justify-center bg-muted/30 p-4">
        <div className={`${currentDevice.width} bg-white shadow-lg rounded-lg overflow-hidden transition-all`}>
          <PublicEstimatePage
            pageId={pageId}
            sections={sections}
            designTheme={previewTheme}
            status={status}
            estimate={estimate}
            customer={customer}
            brandKit={brandKit}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
}
