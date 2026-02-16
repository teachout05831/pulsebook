import { JobsList } from "@/features/customer-portal/components/JobsList";

export default function CustomerJobsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Track your service jobs
        </p>
      </div>
      <JobsList />
    </div>
  );
}
