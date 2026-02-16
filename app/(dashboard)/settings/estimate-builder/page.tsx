import { getEstimateSettings } from "@/features/estimate-settings/queries/getEstimateSettings";
import { EstimateSettingsPage } from "@/features/estimate-settings";

export default async function EstimateBuilderSettingsPage() {
  const settings = await getEstimateSettings();
  return <EstimateSettingsPage initialSettings={settings} />;
}
