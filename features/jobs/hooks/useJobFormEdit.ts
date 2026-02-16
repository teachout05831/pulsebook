"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRecurrenceConfig } from "@/features/recurring-jobs";
import { useJobStops } from "@/features/job-stops";
import { usePrebuiltFields } from "@/features/prebuilt-fields";
import { useCrewAssignment } from "@/features/crews";
import type { Job, JobStatus, TeamMember } from "@/types";

type FD = { title: string; description: string; status: JobStatus; scheduledDate: string; scheduledTime: string; estimatedDuration: string; address: string; assignedTo: string; assignedCrewId: string; notes: string };
const INIT: FD = { title: "", description: "", status: "scheduled", scheduledDate: "", scheduledTime: "", estimatedDuration: "", address: "", assignedTo: "", assignedCrewId: "", notes: "" };
export function useJobFormEdit() {
  const router = useRouter();
  const jobId = useParams().id as string;
  const isValidId = Boolean(jobId && jobId !== "new" && jobId !== "create");
  const [job, setJob] = useState<Job | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<FD>(INIT);
  const [errors, setErrors] = useState<{ title?: string; scheduledDate?: string }>({});
  const [customFields, setCF] = useState<Record<string, unknown>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [assignType, setAssignType] = useState<"individual" | "crew">("individual");
  const { recurringJobsEnabled, multiStopRoutesEnabled } = usePrebuiltFields();
  const { crews, assignmentMode } = useCrewAssignment();
  const recurrence = useRecurrenceConfig();
  const jobStops = useJobStops(jobId);
  useEffect(() => {
    fetch("/api/team-members?active=true").then((r) => r.json())
      .then((res) => setTeamMembers((res.data || []).filter((m: TeamMember) => m.role === "technician" || m.role === "admin")))
      .catch(() => {});
    if (!isValidId) { setIsLoading(false); return; }
    fetch(`/api/jobs/${jobId}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((res) => { setJob(res.data); setIsLoading(false); })
      .catch(() => { setIsError(true); setIsLoading(false); });
  }, [jobId, isValidId]);
  useEffect(() => {
    if (!job) return;
    setFormData({ title: job.title || "", description: job.description || "", status: job.status, scheduledDate: job.scheduledDate || "", scheduledTime: job.scheduledTime || "", estimatedDuration: job.estimatedDuration?.toString() || "", address: job.address || "", assignedTo: job.assignedTo || "", assignedCrewId: job.assignedCrewId || "", notes: job.notes || "" });
    if (job.assignedCrewId) setAssignType("crew");
    setCF(job.customFields || {}); setTags(job.tags || []);
    if (job.isRecurringTemplate && job.recurrenceConfig) {
      recurrence.setIsRecurring(true);
      const c = job.recurrenceConfig;
      (["frequency", "daysOfWeek", "startDate", "endDate", "occurrences"] as const).forEach((k) => recurrence.updateField(k, c[k]));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setIsDirty(true); setErrors((p) => ({ ...p, [e.target.name]: undefined }));
  }, []);
  const handleStatusChange = useCallback((v: JobStatus) => { setFormData((p) => ({ ...p, status: v })); setIsDirty(true); }, []);
  const setAssignTypeWithDirty = useCallback((type: "individual" | "crew") => {
    setAssignType(type); setIsDirty(true);
    setFormData((p) => type === "individual" ? { ...p, assignedCrewId: "" } : { ...p, assignedTo: "" });
  }, []);
  const setAssignedTo = useCallback((v: string) => { setFormData((p) => ({ ...p, assignedTo: v })); setIsDirty(true); }, []);
  const setAssignedCrewId = useCallback((v: string) => { setFormData((p) => ({ ...p, assignedCrewId: v })); setIsDirty(true); }, []);
  const setTagsWithDirty = useCallback((val: string[]) => { setTags(val); setIsDirty(true); }, []);
  const setCFWithDirty = useCallback((vals: Record<string, unknown>) => { setCF(vals); setIsDirty(true); }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { title?: string; scheduledDate?: string } = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.scheduledDate) errs.scheduledDate = "Scheduled date is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsUpdating(true);
    try {
      const values = { ...formData, assignedCrewId: formData.assignedCrewId || null, estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration, 10) : null, customFields, tags, isRecurringTemplate: recurrence.isRecurring, recurrenceConfig: recurrence.isRecurring ? recurrence.config : null };
      const res = await fetch(`/api/jobs/${jobId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to update job"); }
      if (multiStopRoutesEnabled) jobStops.save(jobId);
      toast.success("Job updated successfully"); setIsDirty(false);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed to update job"); } finally { setIsUpdating(false); }
  };
  const handleBack = () => { if (!isDirty || confirm("You have unsaved changes. Are you sure you want to leave?")) router.push("/jobs"); };
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete job");
      toast.success("Job deleted successfully"); router.push("/jobs");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed to delete job"); } finally { setIsDeleting(false); }
  };
  return {
    jobId, job, isLoading, isError, isUpdating, isDeleting, isDirty,
    formData, errors, customFields, setCustomFields: setCFWithDirty,
    tags, setTags: setTagsWithDirty, teamMembers,
    assignType, setAssignType: setAssignTypeWithDirty, assignmentMode, crews,
    recurrence, recurringJobsEnabled, multiStopRoutesEnabled, jobStops,
    handleChange, handleStatusChange, setAssignedTo, setAssignedCrewId,
    handleSubmit, handleBack, handleDelete,
  };
}
