import { getSchedulingConfig } from "@/features/scheduling/queries/getSchedulingConfig";
import { SchedulingSettingsClient } from "./client";

export default async function SchedulingSettingsPage() {
  const config = await getSchedulingConfig();
  return <SchedulingSettingsClient hasConfig={!!config} />;
}
