"use client";

import { SchedulingSetupWizard } from "@/features/scheduling/components/SchedulingSetupWizard";
import { SchedulingSettingsPage } from "@/features/scheduling/components/SchedulingSettingsPage";
import { useSchedulingConfig } from "@/features/scheduling/hooks/useSchedulingConfig";
import type { UpdateSchedulingConfigInput } from "@/features/scheduling/types";

interface Props { hasConfig: boolean }

export function SchedulingSettingsClient({ hasConfig }: Props) {
  const { config, isLoading, updateConfig, refresh } = useSchedulingConfig();

  const handleWizardComplete = async (input: UpdateSchedulingConfigInput) => {
    await updateConfig(input);
    await refresh();
  };

  if (!hasConfig && !config) {
    if (isLoading) return null;
    return <SchedulingSetupWizard onComplete={handleWizardComplete} />;
  }

  return <SchedulingSettingsPage />;
}
