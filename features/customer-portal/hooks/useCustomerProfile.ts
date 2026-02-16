"use client";

import { useState, useEffect } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerProfileData } from "../types";

export function useCustomerProfile() {
  const { apiPrefix } = usePortalPreview();
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiPrefix}/profile`);
        if (!res.ok) {
          setError("Failed to load profile");
          return;
        }
        const json = await res.json();
        setProfile(json.data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { profile, isLoading, error };
}
