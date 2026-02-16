"use client";

import { useState } from "react";
import { Video, Save, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useConsultationSettings } from "../hooks/useConsultationSettings";
import { ConsultationGeneralSettings } from "./ConsultationGeneralSettings";
import { ConsultationWidgetSettings } from "./ConsultationWidgetSettings";
import { AssetLibraryManager } from "@/features/media/components/AssetLibraryManager";
import { CoachSettingsSection } from "@/features/ai-coach/components/CoachSettingsSection";
import { IDLSettingsSection } from "@/features/document-layer/components/IDLSettingsSection";

export function ConsultationSettingsPage() {
  const { settings, isLoading, isSaving, save, updateSettings } = useConsultationSettings();
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = async () => {
    const result = await save();
    if ("success" in result) {
      toast.success("Settings saved");
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
            <Video className="h-6 w-6" />
            Consultation Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure your video consultation experience for customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open("/c/demo", "_blank")}>
            <Eye className="h-4 w-4 mr-1" />
            Demo Preview
          </Button>
          <Button variant="default" size="sm" onClick={() => window.open("/c/preview", "_blank")}>
            <Eye className="h-4 w-4 mr-1" />
            Preview My Setup
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="asset-library">Asset Library</TabsTrigger>
          <TabsTrigger value="widgets">Call Widgets</TabsTrigger>
          <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
          <TabsTrigger value="document-layer">Document Layer</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
          <ConsultationGeneralSettings settings={settings} onChange={updateSettings} widgetCount={settings.widgets.length} onDesignWidgets={() => setActiveTab("widgets")} />
        </TabsContent>
        <TabsContent value="asset-library" className="mt-6">
          <AssetLibraryManager />
        </TabsContent>
        <TabsContent value="widgets" className="mt-6">
          <ConsultationWidgetSettings
            widgets={settings.widgets}
            onChange={(widgets) => updateSettings({ widgets })}
          />
        </TabsContent>
        <TabsContent value="ai-coach" className="mt-6">
          <CoachSettingsSection />
        </TabsContent>
        <TabsContent value="document-layer" className="mt-6">
          <IDLSettingsSection
            settings={settings.idlSettings}
            onChange={(partial) => updateSettings({ idlSettings: { ...settings.idlSettings, ...partial } as any })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
