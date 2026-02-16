"use client";

import { useState, useEffect } from "react";
import { useRecurrenceConfig } from "@/features/recurring-jobs";
import { useJobStops } from "@/features/job-stops";
import { usePrebuiltFields } from "@/features/prebuilt-fields";
import { useCrewAssignment } from "@/features/crews";
import { useArrivalWindows } from "@/features/arrival-windows";
import type { Customer, Estimate, TeamMember } from "@/types";

export function useJobFormData(fromEstimateId: string | null) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [estimate, setEstimate] = useState<Estimate | undefined>();
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);

  useEffect(() => {
    fetch("/api/customers?_page=1&_limit=100")
      .then((r) => r.json())
      .then((res) => { setCustomers(res.data || []); setIsLoadingCustomers(false); })
      .catch(() => setIsLoadingCustomers(false));
    fetch("/api/team-members?active=true")
      .then((r) => r.json())
      .then((res) => {
        setTeamMembers((res.data || []).filter((m: TeamMember) => m.role === "technician" || m.role === "admin"));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!fromEstimateId) return;
    setIsLoadingEstimate(true);
    fetch(`/api/estimates/${fromEstimateId}`)
      .then((r) => r.json())
      .then((res) => { setEstimate(res.data); setIsLoadingEstimate(false); })
      .catch(() => setIsLoadingEstimate(false));
  }, [fromEstimateId]);

  const { recurringJobsEnabled, multiStopRoutesEnabled } = usePrebuiltFields();
  const { crews, assignmentMode } = useCrewAssignment();
  const { arrivalWindows } = useArrivalWindows();
  const recurrence = useRecurrenceConfig();
  const jobStops = useJobStops();

  return {
    customers, isLoadingCustomers, teamMembers,
    estimate, isLoadingEstimate,
    recurringJobsEnabled, multiStopRoutesEnabled,
    crews, assignmentMode, arrivalWindows,
    recurrence, jobStops,
  };
}
