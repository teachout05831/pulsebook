"use client";

import { Globe, Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCustomerPortalSettings } from "../hooks/useCustomerPortalSettings";

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}

function SettingToggle({ label, description, checked, onCheckedChange, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

export function CustomerPortalSettingsPanel() {
  const { settings, updateSetting, isLoading } = useCustomerPortalSettings();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Globe className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-base">Customer Portal</CardTitle>
            <p className="text-sm text-muted-foreground">
              Self-service portal for your customers to view jobs, invoices, and documents
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <SettingToggle
          label="Enable Customer Portal"
          description="Allow customers with portal access to log in and view their data"
          checked={settings.enabled}
          onCheckedChange={(v) => updateSetting("enabled", v)}
        />
        <div className="border-t pt-3 mt-2">
          <div className="flex items-center gap-2 mb-3">
            {settings.enabled ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">Visibility Controls</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Control what information customers can see in their portal.
          </p>
          <SettingToggle
            label="Show Job Progress"
            description="Customers can see job status and progress"
            checked={settings.showJobProgress}
            onCheckedChange={(v) => updateSetting("showJobProgress", v)}
            disabled={!settings.enabled}
          />
          <SettingToggle
            label="Show Crew Name"
            description="Customers can see which crew is assigned to their job"
            checked={settings.showCrewName}
            onCheckedChange={(v) => updateSetting("showCrewName", v)}
            disabled={!settings.enabled}
          />
          <SettingToggle
            label="Show Job Notes"
            description="Customers can see notes on their jobs"
            checked={settings.showNotes}
            onCheckedChange={(v) => updateSetting("showNotes", v)}
            disabled={!settings.enabled}
          />
          <SettingToggle
            label="Show Photos"
            description="Customers can see photos attached to their jobs"
            checked={settings.showPhotos}
            onCheckedChange={(v) => updateSetting("showPhotos", v)}
            disabled={!settings.enabled}
          />
          <SettingToggle
            label="Allow Photo Upload"
            description="Customers can upload photos for their jobs"
            checked={settings.allowPhotoUpload}
            onCheckedChange={(v) => updateSetting("allowPhotoUpload", v)}
            disabled={!settings.enabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
