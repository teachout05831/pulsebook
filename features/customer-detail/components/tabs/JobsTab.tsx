"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Job } from "@/types/job";
import type { JobsFilterStatus } from "../../types";
import { CreateJobModal } from "@/features/jobs";
import {
  JobsTabHeader,
  JobsStatsGrid,
  JobsFilterBar,
  UpcomingJobsList,
  CompletedJobsTable,
  JobDetailSheet,
} from "./jobs";

interface JobsTabProps {
  jobs: Job[];
  customerId: string;
  customerName?: string;
  onRefresh?: () => void;
}

export function JobsTab({ jobs, customerId, customerName, onRefresh }: JobsTabProps) {
  const [filter, setFilter] = useState<JobsFilterStatus>("all");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { upcomingJobs, scheduledJobs, inProgressJobs, completedJobs, filteredJobs, stats } =
    useMemo(() => {
      const upcoming = jobs.filter((j) => j.status === "scheduled" || j.status === "in_progress");
      const scheduled = jobs.filter((j) => j.status === "scheduled");
      const inProgress = jobs.filter((j) => j.status === "in_progress");
      const completed = jobs.filter((j) => j.status === "completed");
      const totalRevenue = completed.reduce((sum, j) => sum + (j.total || 0), 0);

      const filtered =
        filter === "scheduled" ? scheduled
        : filter === "in_progress" ? inProgress
        : filter === "completed" ? completed
        : jobs;

      return {
        upcomingJobs: upcoming,
        scheduledJobs: scheduled,
        inProgressJobs: inProgress,
        completedJobs: completed,
        filteredJobs: filtered,
        stats: {
          totalJobs: jobs.length,
          totalRevenue,
          avgJobValue: completed.length > 0 ? totalRevenue / completed.length : 0,
          completionRate: jobs.length > 0 ? Math.round((completed.length / jobs.length) * 100) : 0,
        },
      };
    }, [jobs, filter]);

  // Show cards for upcoming-style filters (all, scheduled, in_progress)
  const showCards = filter === "all" || filter === "scheduled" || filter === "in_progress";
  const cardJobs = filter === "scheduled" ? scheduledJobs
    : filter === "in_progress" ? inProgressJobs
    : upcomingJobs;

  // Show table for all and completed filters
  const showTable = filter === "all" || filter === "completed";
  const tableTitle = filter === "completed" ? "Completed Jobs" : "All Jobs";
  const tableJobs = filter === "completed" ? completedJobs : filteredJobs;

  return (
    <div className="space-y-6">
      <JobsTabHeader
        totalCount={jobs.length}
        activeCount={upcomingJobs.length}
        onCreateJob={() => setCreateModalOpen(true)}
      />
      <JobsStatsGrid {...stats} />
      <JobsFilterBar
        filter={filter}
        counts={{
          all: jobs.length,
          scheduled: scheduledJobs.length,
          inProgress: inProgressJobs.length,
          completed: completedJobs.length,
        }}
        onFilterChange={setFilter}
      />

      {showCards && <UpcomingJobsList jobs={cardJobs} onJobClick={setSelectedJobId} />}

      {showTable && tableJobs.length > 0 && (
        <CompletedJobsTable
          jobs={tableJobs}
          title={tableTitle}
          onJobClick={setSelectedJobId}
        />
      )}

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">No jobs found</CardContent>
        </Card>
      )}

      <JobDetailSheet
        jobId={selectedJobId}
        open={selectedJobId !== null}
        onClose={() => setSelectedJobId(null)}
      />
      <CreateJobModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        customerId={customerId}
        customerName={customerName}
        onSuccess={onRefresh}
      />
    </div>
  );
}
