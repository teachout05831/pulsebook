"use client";

import { useCallback } from "react";
import { useEstimateSettings } from "../hooks/useEstimateSettings";
import { IndustryPresetSelector } from "./IndustryPresetSelector";
import { PricingModelConfig } from "./PricingModelConfig";
import { ResourceFieldsConfig } from "./ResourceFieldsConfig";
import { PricingCategoriesConfig } from "./PricingCategoriesConfig";
import { DepositConfig } from "./DepositConfig";
import { AutoFeesConfig } from "./AutoFeesConfig";
import { HourlyDisplayConfig } from "./HourlyDisplayConfig";
import { AssignmentFieldsConfig } from "./AssignmentFieldsConfig";
import type { EstimateBuilderSettings } from "@/types/company";

interface Props {
  initialSettings: EstimateBuilderSettings;
}

export function EstimateSettingsPage({ initialSettings }: Props) {
  const { settings, isSaving, error, save, updateField } = useEstimateSettings(initialSettings);

  const applyPreset = useCallback(
    (partial: Partial<EstimateBuilderSettings>) => {
      save({ ...settings, ...partial });
    },
    [settings, save]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Estimate Builder</h2>
        <p className="text-sm text-muted-foreground">
          Configure default settings for new estimates
          {isSaving && <span className="ml-2 text-blue-600">Saving...</span>}
          {error && <span className="ml-2 text-red-500">{error}</span>}
        </p>
      </div>
      <IndustryPresetSelector onApply={applyPreset} />
      <PricingModelConfig settings={settings} onUpdate={updateField} />
      <HourlyDisplayConfig settings={settings} onUpdate={updateField} />
      <AssignmentFieldsConfig settings={settings} onUpdate={updateField} />
      <ResourceFieldsConfig settings={settings} onUpdate={updateField} />
      <PricingCategoriesConfig settings={settings} onUpdate={updateField} />
      <DepositConfig settings={settings} onUpdate={updateField} />
      <AutoFeesConfig settings={settings} onUpdate={updateField} />
    </div>
  );
}
