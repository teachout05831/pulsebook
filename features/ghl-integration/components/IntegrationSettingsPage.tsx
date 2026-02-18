"use client";

import { Link2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIntegrationSettings } from "../hooks/useIntegrationSettings";
import { GhlSettingsCard } from "./GhlSettingsCard";

export function IntegrationSettingsPage() {
  const { settings, isLoading, isSaving, save, updateSettings } =
    useIntegrationSettings();

  const handleSave = async () => {
    const result = await save(settings);
    if ("success" in result) {
      toast.success("Integration settings saved");
    } else {
      toast.error(result.error || "Failed to save settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="h-6 w-6" />
            Integrations
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Connect external services to sync leads and contacts
          </p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Save Changes
        </Button>
      </div>

      <GhlSettingsCard settings={settings} onUpdate={updateSettings} />
    </div>
  );
}
