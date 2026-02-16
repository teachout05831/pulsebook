"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTechJobDetail } from "../hooks/useTechJobs";
import { TechCustomerCard } from "./TechCustomerCard";
import { TechNotesSection } from "./TechNotesSection";
import { TechContractsCard } from "./TechContractsCard";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

interface Props {
  jobId: string;
}

export function TechJobDetail({ jobId }: Props) {
  const router = useRouter();
  const { job, isLoading, updateStatus } = useTechJobDetail(jobId);

  const handleStatusUpdate = async (status: string) => {
    const ok = await updateStatus(status);
    if (ok) {
      toast.success(status === "in_progress" ? "Job started" : "Job completed");
    } else {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job not found</p>
        <Button variant="ghost" onClick={() => router.push("/tech")} className="mt-4">
          Back to Schedule
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.push("/tech")} className="-ml-2">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <Badge className={STATUS_COLORS[job.status] || "bg-gray-100"}>
              {job.status === "in_progress" ? "In Progress" : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>
          {job.scheduledTime && (
            <p className="text-sm text-muted-foreground">
              {new Date(job.scheduledDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              {" at "}{job.scheduledTime}
              {job.estimatedDuration && ` (${job.estimatedDuration} min)`}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {job.description && <p className="text-sm">{job.description}</p>}
          {job.notes && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
              <p className="text-sm">{job.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <TechCustomerCard customer={job.customer} address={job.address} />

      <TechNotesSection
        jobId={job.id}
        crewNotes={job.crewNotes}
        customerNotes={job.customerNotes}
        crewFeedback={job.crewFeedback}
      />

      <TechContractsCard jobId={job.id} />

      {job.status !== "completed" && job.status !== "cancelled" && (
        <div className="flex gap-3">
          {job.status === "scheduled" && (
            <Button className="flex-1" onClick={() => handleStatusUpdate("in_progress")}>
              Start Job
            </Button>
          )}
          {job.status === "in_progress" && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusUpdate("completed")}>
              Complete Job
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
