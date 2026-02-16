"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { Job } from "@/types/job";
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from "@/types/job";
import { RecurringBadge } from "@/features/recurring-jobs";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function abbreviateName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

interface CompletedJobsTableProps {
  jobs: Job[];
  title: string;
  onJobClick: (jobId: string) => void;
}

export function CompletedJobsTable({ jobs, title, onJobClick }: CompletedJobsTableProps) {
  if (jobs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onJobClick(job.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {job.title}
                      {job.isRecurringTemplate && job.recurrenceConfig && (
                        <RecurringBadge config={job.recurrenceConfig} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(job.scheduledDate)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {job.assignedTo ? abbreviateName(job.assignedTo) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap">
                    {job.total ? fmt(job.total) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={JOB_STATUS_COLORS[job.status]}>
                      {JOB_STATUS_LABELS[job.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
