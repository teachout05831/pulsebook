import { getTerminology } from "@/features/terminology/queries/getTerminology";
import { TerminologySettingsPage } from "@/features/terminology";

export default async function TerminologyPage() {
  const terminology = await getTerminology();
  return <TerminologySettingsPage initialTerminology={terminology} />;
}
