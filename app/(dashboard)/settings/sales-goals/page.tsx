import { getSalesGoalsData } from "@/features/sales-goals/queries/getSalesGoalsData";
import { SalesGoalsManager } from "@/features/sales-goals";

export const metadata = { title: "Sales Goals - Settings", description: "Set monthly sales targets for your team" };

export default async function SalesGoalsPage() {
  const teamMembers = await getSalesGoalsData();
  return <SalesGoalsManager teamMembers={teamMembers} />;
}
