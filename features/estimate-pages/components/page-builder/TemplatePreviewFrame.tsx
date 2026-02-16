"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Monitor, Smartphone, Tablet, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PublicEstimatePage } from "../PublicEstimatePage";
import type { PageSection, DesignTheme, IncentiveConfig } from "../../types";

interface TemplatePreviewFrameProps {
  templateId: string;
  templateName: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  brandKit: Parameters<typeof PublicEstimatePage>[0]["brandKit"];
  incentiveConfig?: IncentiveConfig | null;
}

const MOCK_ESTIMATE = {
  estimateNumber: "EST-PREVIEW",
  total: 4200,
  subtotal: 4200,
  taxRate: 0,
  taxAmount: 0,
  lineItems: [
    { description: "Professional Service Package", quantity: 1, unitPrice: 3500, total: 3500 },
    { description: "Materials & Supplies", quantity: 1, unitPrice: 500, total: 500 },
    { description: "Cleanup & Disposal", quantity: 1, unitPrice: 200, total: 200 },
  ],
};

const MOCK_CUSTOMER = { name: "John Smith", email: "john@example.com", phone: "(555) 123-4567" };

const MOCK_SETTINGS = {
  allowVideoCall: true,
  allowScheduling: true,
  allowChat: true,
  allowInstantApproval: true,
  requireDeposit: false,
  depositAmount: null,
  depositType: "flat" as const,
};

const DEVICES = [
  { id: "desktop", icon: Monitor, width: "w-full max-w-5xl" },
  { id: "tablet", icon: Tablet, width: "w-[768px]" },
  { id: "mobile", icon: Smartphone, width: "w-[375px]" },
] as const;

export function TemplatePreviewFrame({
  templateId, templateName, sections, designTheme, brandKit, incentiveConfig,
}: TemplatePreviewFrameProps) {
  const router = useRouter();
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const current = DEVICES.find((d) => d.id === device)!;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/estimate-pages/templates/${templateId}/builder`)}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Builder
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Preview: {templateName}</span>
        </div>
        <div className="flex items-center gap-2">
          {DEVICES.map((d) => (
            <Button key={d.id} variant={device === d.id ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setDevice(d.id)}>
              <d.icon className="h-3.5 w-3.5" />
            </Button>
          ))}
          <div className="h-5 w-px bg-border" />
          <Button variant="outline" size="sm" onClick={async () => {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Preview link copied");
          }}>
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Link
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/estimate-pages/templates/${templateId}/builder`)}>
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open Builder
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex justify-center bg-muted/30 p-4">
        <div className={`${current.width} bg-white shadow-lg rounded-lg overflow-hidden transition-all`}>
          <PublicEstimatePage
            pageId={`template-${templateId}`}
            sections={sections}
            designTheme={designTheme}
            status="draft"
            estimate={MOCK_ESTIMATE}
            customer={MOCK_CUSTOMER}
            brandKit={brandKit}
            settings={MOCK_SETTINGS}
            incentiveConfig={incentiveConfig}
          />
        </div>
      </div>
    </div>
  );
}
