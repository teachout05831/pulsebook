"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { GhlIntegrationSettings } from "../types";

interface Props {
  settings: GhlIntegrationSettings;
  onUpdate: (partial: Partial<GhlIntegrationSettings>) => void;
}

export function GhlSettingsCard({ settings, onUpdate }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GoHighLevel (GHL)</CardTitle>
        <CardDescription>
          Automatically sync inbound leads to your GHL account for texting
          and automation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable GHL Sync</Label>
            <p className="text-xs text-muted-foreground">
              Master toggle for all GHL sync triggers
            </p>
          </div>
          <Switch
            checked={settings.ghlEnabled}
            onCheckedChange={(v) => onUpdate({ ghlEnabled: v })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>API Token</Label>
          <Input
            type="password"
            placeholder="Enter your GHL Private Integration token"
            value={settings.ghlApiToken}
            onChange={(e) => onUpdate({ ghlApiToken: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            {"Found in GHL → Settings → Business Profile → Integrations"}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Location ID</Label>
          <Input
            placeholder="Your GHL sub-account Location ID"
            value={settings.ghlLocationId}
            onChange={(e) => onUpdate({ ghlLocationId: e.target.value })}
          />
        </div>

        <div className="border-t pt-4 space-y-3">
          <p className="text-sm font-medium">Sync Triggers</p>

          <div className="flex items-center justify-between">
            <div>
              <Label>New Lead Arrives</Label>
              <p className="text-xs text-muted-foreground">
                Create GHL contact when inbound lead is received
              </p>
            </div>
            <Switch
              checked={settings.ghlSyncNewLeads}
              onCheckedChange={(v) => onUpdate({ ghlSyncNewLeads: v })}
            />
          </div>

          <div className="flex items-center justify-between opacity-50">
            <div>
              <Label>Job Booked</Label>
              <p className="text-xs text-muted-foreground">
                Update GHL contact when a job is booked (coming soon)
              </p>
            </div>
            <Switch checked={false} disabled />
          </div>

          <div className="flex items-center justify-between opacity-50">
            <div>
              <Label>Lead Lost</Label>
              <p className="text-xs text-muted-foreground">
                Update GHL contact when a lead is marked lost (coming soon)
              </p>
            </div>
            <Switch checked={false} disabled />
          </div>
        </div>

        <div className="border-t pt-4 space-y-1.5">
          <Label>Default Tags</Label>
          <Input
            placeholder="e.g., inbound-lead, service-pro (comma-separated)"
            value={settings.ghlDefaultTags.join(", ")}
            onChange={(e) =>
              onUpdate({
                ghlDefaultTags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
          />
          <p className="text-xs text-muted-foreground">
            Tags applied to every contact synced to GHL
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
