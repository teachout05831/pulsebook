"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerJobs } from "../hooks/useCustomerJobs";

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function JobsList() {
  const { jobs, isLoading, error } = useCustomerJobs();

  if (isLoading) {
    return <div className="animate-pulse h-40 rounded bg-muted" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (jobs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No jobs yet.
      </p>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/portal/jobs/${job.id}`}
            className="flex items-center gap-3 rounded-lg border bg-white p-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{job.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={`text-xs ${statusColors[job.status] || ""}`}
                >
                  {job.status.replace("_", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(job.scheduledDate)}
                </span>
              </div>
              {job.crewName && (
                <p className="text-xs text-muted-foreground mt-1">
                  {job.crewName}
                </p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Crew</TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <Link
                    href={`/portal/jobs/${job.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[job.status] || ""}
                  >
                    {job.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(job.scheduledDate)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.crewName || "—"}
                </TableCell>
                <TableCell>
                  <Link href={`/portal/jobs/${job.id}`}>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
