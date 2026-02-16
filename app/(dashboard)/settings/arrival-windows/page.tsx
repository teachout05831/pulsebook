import { getArrivalWindows } from "@/features/arrival-windows/queries/getArrivalWindows";
import { ArrivalWindowsSettingsPage } from "@/features/arrival-windows";

export default async function ArrivalWindowsPage() {
  const windows = await getArrivalWindows();
  return <ArrivalWindowsSettingsPage initialWindows={windows} />;
}
