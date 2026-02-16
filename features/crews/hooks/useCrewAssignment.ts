"use client";

import { useState, useEffect } from "react";
import type { Crew, CrewManagementSettings } from "../types";
import { defaultCrewManagementSettings } from "../types";

interface CrewAssignmentResult {
  crews: Crew[];
  assignmentMode: CrewManagementSettings["assignmentMode"];
  isLoading: boolean;
}

export function useCrewAssignment(): CrewAssignmentResult {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [mode, setMode] = useState<CrewManagementSettings["assignmentMode"]>("individual");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [crewRes, companyRes] = await Promise.all([
          fetch("/api/crews"),
          fetch("/api/company"),
        ]);
        if (crewRes.ok) {
          const { data } = await crewRes.json();
          setCrews(data || []);
        }
        if (companyRes.ok) {
          const { data } = await companyRes.json();
          const settings = data?.settings?.crewManagement || defaultCrewManagementSettings;
          setMode(settings.assignmentMode);
        }
      } catch {
        // Defaults are safe — individual mode, no crews
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { crews, assignmentMode: mode, isLoading };
}
