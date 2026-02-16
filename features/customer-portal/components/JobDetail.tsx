"use client";

import { ArrowLeft, Calendar, MapPin, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerPhotoUpload } from "./CustomerPhotoUpload";
import { useCustomerJobDetail } from "../hooks/useCustomerJobDetail";

interface Props {
  jobId: string;
  showPhotos: boolean;
  showNotes: boolean;
  showCrewName: boolean;
  allowPhotoUpload: boolean;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function JobDetail({
  jobId,
  showPhotos,
  showNotes,
  showCrewName,
  allowPhotoUpload,
}: Props) {
  const { job, isLoading, error, uploadPhoto } =
    useCustomerJobDetail(jobId);

  if (isLoading) {
    return <div className="animate-pulse h-60 rounded bg-muted" />;
  }

  if (error || !job) {
    return <p className="text-sm text-red-500">{error || "Job not found"}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/portal/jobs"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{job.title}</h1>
          <Badge variant="secondary" className="mt-1">
            {job.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{formatDate(job.scheduledDate)}</p>
            {job.scheduledTime && <p className="text-muted-foreground">{job.scheduledTime}</p>}
          </CardContent>
        </Card>

        {job.address && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Location
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{job.address}</CardContent>
          </Card>
        )}

        {showCrewName && job.crewName && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" /> Assigned Crew
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{job.crewName}</CardContent>
          </Card>
        )}
      </div>

      {(job.description || (showNotes && job.notes)) && (
        <Card>
          <CardContent className="pt-4 space-y-3 text-sm">
            {job.description && (
              <div>
                <p className="font-medium mb-1">Description</p>
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            )}
            {showNotes && job.notes && (
              <div>
                <p className="font-medium mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Notes</p>
                <p className="whitespace-pre-wrap">{job.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showPhotos && job.photos.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {job.photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-md overflow-hidden border bg-muted"
                >
                  <img
                    src={photo.url}
                    alt={photo.fileName}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {allowPhotoUpload && (
        <CustomerPhotoUpload onUpload={uploadPhoto} />
      )}
    </div>
  );
}
