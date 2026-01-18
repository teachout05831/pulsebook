"use client";

import { useState, useEffect } from "react";
import { useOne, useUpdate, useDelete } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Job, JobStatus } from "@/types";
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from "@/types";

function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

interface FormData {
  title: string;
  description: string;
  status: JobStatus;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: string;
  address: string;
  assignedTo: string;
  notes: string;
}

interface FormErrors {
  title?: string;
  scheduledDate?: string;
}

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  // Fetch job data
  const { query } = useOne<Job>({
    resource: "jobs",
    id: jobId,
  });

  const { data: jobData, isLoading, isError } = query;
  const job = jobData?.data;

  // Update mutation
  const { mutate: updateJob, mutation } = useUpdate<Job>();
  const isUpdating = mutation.isPending;

  // Delete mutation
  const { mutate: deleteJob, mutation: deleteMutation } = useDelete<Job>();
  const isDeleting = deleteMutation.isPending;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "scheduled",
    scheduledDate: "",
    scheduledTime: "",
    estimatedDuration: "",
    address: "",
    assignedTo: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  // Populate form when job data loads
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        status: job.status,
        scheduledDate: job.scheduledDate || "",
        scheduledTime: job.scheduledTime || "",
        estimatedDuration: job.estimatedDuration?.toString() || "",
        address: job.address || "",
        assignedTo: job.assignedTo || "",
        notes: job.notes || "",
      });
    }
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStatusChange = (value: JobStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
    setIsDirty(true);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Scheduled date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateJob(
      {
        resource: "jobs",
        id: jobId,
        values: {
          ...formData,
          estimatedDuration: formData.estimatedDuration
            ? parseInt(formData.estimatedDuration, 10)
            : null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Job updated successfully");
          setIsDirty(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update job");
        },
      }
    );
  };

  const handleBack = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/jobs");
      }
    } else {
      router.push("/jobs");
    }
  };

  const handleDelete = () => {
    deleteJob(
      {
        resource: "jobs",
        id: jobId,
      },
      {
        onSuccess: () => {
          toast.success("Job deleted successfully");
          router.push("/jobs");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete job");
        },
      }
    );
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              Failed to load job. The job may not exist.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {isLoading ? "Loading..." : job?.title || "Job"}
              </h1>
              {!isLoading && job && (
                <Badge variant="secondary" className={JOB_STATUS_COLORS[job.status]}>
                  {JOB_STATUS_LABELS[job.status]}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {isLoading ? "" : job?.customerName ? `Customer: ${job.customerName}` : "Edit job details"}
            </p>
          </div>
        </div>
        {!isLoading && job && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Job</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this job? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField label="Title *" error={errors.title}>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Job title"
                  />
                </FormField>

                <FormField label="Status">
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Scheduled Date *" error={errors.scheduledDate}>
                  <Input
                    name="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Scheduled Time">
                  <Input
                    name="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Estimated Duration (minutes)">
                  <Input
                    name="estimatedDuration"
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    placeholder="60"
                  />
                </FormField>

                <FormField label="Assigned To">
                  <Input
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    placeholder="Technician name"
                  />
                </FormField>
              </div>

              <FormField label="Address">
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Service address"
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Job description..."
                  rows={3}
                />
              </FormField>

              <FormField label="Notes">
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Internal notes..."
                  rows={3}
                />
              </FormField>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating || !isDirty}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
