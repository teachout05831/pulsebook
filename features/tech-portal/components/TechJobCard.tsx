"use client";

import { Clock, MapPin, User, ChevronRight, AlarmClock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TechJob } from "../types";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface Props {
  job: TechJob;
}

export function TechJobCard({ job }: Props) {
  return (
    <Link href={`/tech/jobs/${job.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]">
        <CardContent className="flex items-center justify-between p-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{job.title}</span>
              <Badge className={STATUS_COLORS[job.status] || "bg-gray-100"}>
                {STATUS_LABELS[job.status] || job.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {job.scheduledTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {job.scheduledTime}
                </span>
              )}
              {job.arrivalWindow && (
                <span className="flex items-center gap-1">
                  <AlarmClock className="h-3.5 w-3.5" />
                  {job.arrivalWindow}
                </span>
              )}
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {job.customer.name}
              </span>
              {job.address && (
                <span className="flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {job.address}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
        </CardContent>
      </Card>
    </Link>
  );
}
