import { TechSchedule } from "@/features/tech-portal";

export default function TechSchedulePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">My Schedule</h1>
        <p className="text-sm text-muted-foreground">
          Your assigned jobs
        </p>
      </div>
      <TechSchedule />
    </div>
  );
}
