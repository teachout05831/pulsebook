"use client";

import { Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ConsultationSettings } from "../types";

interface ConsultationGeneralSettingsProps {
  settings: ConsultationSettings;
  onChange: (partial: Partial<ConsultationSettings>) => void;
  widgetCount: number;
  onDesignWidgets: () => void;
}

export function ConsultationGeneralSettings({ settings, onChange, widgetCount, onDesignWidgets }: ConsultationGeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic consultation settings for your company</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Consultations</Label>
              <p className="text-xs text-muted-foreground">Allow creating video consultations from customer pages</p>
            </div>
            <Switch checked={settings.enabled} onCheckedChange={(v) => onChange({ enabled: v })} />
          </div>
          <div className="space-y-1.5">
            <Label>Default Title</Label>
            <Input value={settings.defaultTitle} onChange={(e) => onChange({ defaultTitle: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Link Expiration (hours)</Label>
              <Input type="number" value={settings.expirationHours} onChange={(e) => onChange({ expirationHours: Number(e.target.value) })} />
              <p className="text-xs text-muted-foreground">How long the consultation link stays active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lobby Experience</CardTitle>
          <CardDescription>What customers see before joining the call</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Trust Signals</Label>
              <p className="text-xs text-muted-foreground">Display Google rating, certifications, and insurance in the lobby</p>
            </div>
            <Switch checked={settings.showTrustSignals} onCheckedChange={(v) => onChange({ showTrustSignals: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Portfolio</Label>
              <p className="text-xs text-muted-foreground">Display work photos and before/after in the lobby gallery</p>
            </div>
            <Switch checked={settings.showPortfolio} onCheckedChange={(v) => onChange({ showPortfolio: v })} />
          </div>
          <div className="rounded-lg border p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground">
              Trust signals, photos, and testimonials are pulled from your <a href="/settings/brand-kit" className="text-primary underline">Brand Kit</a>.
              Update your brand kit to change what appears in the lobby.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recording</CardTitle>
          <CardDescription>Automatically record consultations for training and review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Record Calls</Label>
              <p className="text-xs text-muted-foreground">Record all consultations automatically (customers are notified)</p>
            </div>
            <Switch checked={settings.autoRecord} onCheckedChange={(v) => onChange({ autoRecord: v })} />
          </div>
        </CardContent>
      </Card>

      <button onClick={onDesignWidgets} className="w-full text-left group">
        <Card className="border-dashed hover:border-primary/50 hover:bg-accent/50 transition-colors">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Design Your Widgets</p>
              <p className="text-xs text-muted-foreground">
                {widgetCount > 0
                  ? `${widgetCount} widget${widgetCount === 1 ? "" : "s"} configured — click to edit`
                  : "Add buttons that customers can tap during the call to view reviews, FAQs, videos, and more"}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </CardContent>
        </Card>
      </button>
    </div>
  );
}
