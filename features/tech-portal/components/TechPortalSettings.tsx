"use client";

import { Smartphone, Eye, EyeOff, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTechPortalSettings } from "../hooks/useTechPortalSettings";
import type { TechPortalSettings as Settings } from "@/types/company";

interface PrivacyToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}

function PrivacyToggle({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: PrivacyToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}

export function TechPortalSettings() {
  const { settings, updateSetting, isLoading } = useTechPortalSettings();

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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Smartphone className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-base">Technician Portal</CardTitle>
            <p className="text-sm text-muted-foreground">
              Mobile access for your technicians to view assigned jobs
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <PrivacyToggle
          label="Enable Tech Portal"
          description="Allow technicians with portal access to log in and view their jobs"
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
            <span className="text-sm font-medium">
              Customer Privacy Controls
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Control what customer information technicians can see. Service
            address is always visible for navigation.
          </p>

          <PrivacyToggle
            label="Show Customer Email"
            description="Techs can see the customer's email address"
            checked={settings.showCustomerEmail}
            onCheckedChange={(v) => updateSetting("showCustomerEmail", v)}
            disabled={!settings.enabled}
          />
          <PrivacyToggle
            label="Show Customer Phone"
            description="Techs can see the customer's phone number"
            checked={settings.showCustomerPhone}
            onCheckedChange={(v) => updateSetting("showCustomerPhone", v)}
            disabled={!settings.enabled}
          />
          <PrivacyToggle
            label="Show Customer Notes"
            description="Techs can see notes attached to the customer"
            checked={settings.showCustomerNotes}
            onCheckedChange={(v) => updateSetting("showCustomerNotes", v)}
            disabled={!settings.enabled}
          />
        </div>

        <div className="border-t pt-3 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Job Information Controls</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Control what job details technicians can see in their portal.
          </p>

          <PrivacyToggle
            label="Show Contracts"
            description="Techs can see contracts attached to their jobs"
            checked={settings.showContracts}
            onCheckedChange={(v) => updateSetting("showContracts", v)}
            disabled={!settings.enabled}
          />
          <PrivacyToggle
            label="Show Crew Notes"
            description="Techs can see crew notes and instructions on jobs"
            checked={settings.showCrewNotes}
            onCheckedChange={(v) => updateSetting("showCrewNotes", v)}
            disabled={!settings.enabled}
          />
          <PrivacyToggle
            label="Show Customer Job Notes"
            description="Techs can see customer-facing notes on jobs"
            checked={settings.showCustomerJobNotes}
            onCheckedChange={(v) => updateSetting("showCustomerJobNotes", v)}
            disabled={!settings.enabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
