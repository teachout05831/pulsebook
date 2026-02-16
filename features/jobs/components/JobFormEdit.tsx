"use client";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomFieldsForm } from "@/features/custom-fields";
import { TagSelector } from "@/features/tags";
import { ContractsTab } from "@/features/contracts";
import { RecurrenceForm } from "@/features/recurring-jobs";
import { StopsEditor } from "@/features/job-stops";
import { useJobFormEdit } from "../hooks/useJobFormEdit";
import type { JobStatus } from "@/types";
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from "@/types";

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
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
        <div key={i} className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
      ))}
    </div>
  );
}
export function JobFormEdit() {
  const h = useJobFormEdit();

  if (h.isError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={h.handleBack}><ArrowLeft className="mr-2 h-4 w-4" />Back to Jobs</Button>
        <Card><CardContent className="py-12"><div className="text-center text-destructive">Failed to load job. The job may not exist.</div></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={h.handleBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{h.isLoading ? "Loading..." : h.job?.title || "Job"}</h1>
              {!h.isLoading && h.job && <Badge variant="secondary" className={JOB_STATUS_COLORS[h.job.status]}>{JOB_STATUS_LABELS[h.job.status]}</Badge>}
            </div>
            <p className="text-muted-foreground">{h.isLoading ? "" : h.job?.customerName ? `Customer: ${h.job.customerName}` : "Edit job details"}</p>
          </div>
        </div>
        {!h.isLoading && h.job && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={h.isDeleting}>{h.isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Delete Job</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this job? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={h.handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <Tabs defaultValue="details">
        <TabsList><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="contracts">Contracts</TabsTrigger></TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
            <CardContent>
              {h.isLoading ? <FormSkeleton /> : (
                <form onSubmit={h.handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField label="Title *" error={h.errors.title}><Input name="title" value={h.formData.title} onChange={h.handleChange} placeholder="Job title" /></FormField>
                    <FormField label="Status">
                      <Select value={h.formData.status} onValueChange={h.handleStatusChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUS_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Scheduled Date *" error={h.errors.scheduledDate}><Input name="scheduledDate" type="date" value={h.formData.scheduledDate} onChange={h.handleChange} /></FormField>
                    <FormField label="Scheduled Time"><Input name="scheduledTime" type="time" value={h.formData.scheduledTime} onChange={h.handleChange} /></FormField>
                    <FormField label="Estimated Duration (minutes)"><Input name="estimatedDuration" type="number" value={h.formData.estimatedDuration} onChange={h.handleChange} placeholder="60" /></FormField>
                    <FormField label="Assigned To">
                      {h.assignmentMode === "both" && (
                        <div className="flex gap-2 mb-2">
                          <Button type="button" size="sm" variant={h.assignType === "individual" ? "default" : "outline"} onClick={() => h.setAssignType("individual")}>Individual</Button>
                          <Button type="button" size="sm" variant={h.assignType === "crew" ? "default" : "outline"} onClick={() => h.setAssignType("crew")}>Crew</Button>
                        </div>
                      )}
                      {(h.assignmentMode === "individual" || (h.assignmentMode === "both" && h.assignType === "individual")) && (
                        <Select value={h.formData.assignedTo || undefined} onValueChange={h.setAssignedTo}>
                          <SelectTrigger><SelectValue placeholder="Select a team member" /></SelectTrigger>
                          <SelectContent>{h.teamMembers.map((tm) => (<SelectItem key={tm.id} value={tm.id}>{tm.name}</SelectItem>))}</SelectContent>
                        </Select>
                      )}
                      {(h.assignmentMode === "crew" || (h.assignmentMode === "both" && h.assignType === "crew")) && (
                        <Select value={h.formData.assignedCrewId || undefined} onValueChange={h.setAssignedCrewId}>
                          <SelectTrigger><SelectValue placeholder="Select a crew" /></SelectTrigger>
                          <SelectContent>{h.crews.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}{c.vehicleName ? ` — ${c.vehicleName}` : ""}</SelectItem>))}</SelectContent>
                        </Select>
                      )}
                    </FormField>
                  </div>
                  <FormField label="Address"><Input name="address" value={h.formData.address} onChange={h.handleChange} placeholder="Service address" /></FormField>
                  {h.multiStopRoutesEnabled && <StopsEditor stops={h.jobStops.stops} onAddStop={() => { h.jobStops.addStop(); }} onRemoveStop={(i) => { h.jobStops.removeStop(i); }} onUpdateStop={(i, f, v) => { h.jobStops.updateStop(i, f, v); }} isLoading={h.jobStops.isLoading} />}
                  <FormField label="Description"><Textarea name="description" value={h.formData.description} onChange={h.handleChange} placeholder="Job description..." rows={3} /></FormField>
                  <FormField label="Notes"><Textarea name="notes" value={h.formData.notes} onChange={h.handleChange} placeholder="Internal notes..." rows={3} /></FormField>
                  <FormField label="Tags"><TagSelector entityType="job" selectedTags={h.tags} onChange={h.setTags} /></FormField>
                  {h.recurringJobsEnabled && <RecurrenceForm isRecurring={h.recurrence.isRecurring} onIsRecurringChange={(v) => { h.recurrence.setIsRecurring(v); }} config={h.recurrence.config} onFrequencyChange={(f) => { h.recurrence.updateFrequency(f); }} onToggleDay={(d) => { h.recurrence.toggleDay(d); }} onFieldChange={(k, v) => { h.recurrence.updateField(k, v); }} />}
                  <CustomFieldsForm entityType="job" values={h.customFields} onChange={h.setCustomFields} />
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={h.handleBack}>Cancel</Button>
                    <Button type="submit" disabled={h.isUpdating || !h.isDirty}>{h.isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contracts">
          <Card>
            <CardHeader><CardTitle>Contracts</CardTitle></CardHeader>
            <CardContent>{!h.isLoading && h.job && <ContractsTab jobId={h.jobId} customerId={h.job.customerId || ""} />}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
