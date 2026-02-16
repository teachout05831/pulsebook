"use client";

import { Button } from "@/components/ui/button";

interface JobsTabHeaderProps {
  totalCount: number;
  activeCount: number;
  onCreateJob: () => void;
}

export function JobsTabHeader({ totalCount, activeCount, onCreateJob }: JobsTabHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">Jobs</h2>
        <p className="text-sm text-muted-foreground">
          {totalCount} total jobs &middot; {activeCount} active
        </p>
      </div>
      <Button className="w-full sm:w-auto" onClick={onCreateJob}>
        + Schedule Job
      </Button>
    </div>
  );
}
