import { getCustomDropdowns } from "@/features/custom-dropdowns/queries/getCustomDropdowns";
import { DropdownsSettingsPage } from "@/features/custom-dropdowns";

export default async function DropdownsPage() {
  const dropdowns = await getCustomDropdowns();
  return <DropdownsSettingsPage initialDropdowns={dropdowns} />;
}
