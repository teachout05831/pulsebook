import { SchedulingPageDashboard } from "@/features/scheduling/components/SchedulingPageDashboard";

export const metadata = { title: "Online Booking" };

export default function SchedulingPage() {
  return (
    <div className="p-6">
      <SchedulingPageDashboard />
    </div>
  );
}
