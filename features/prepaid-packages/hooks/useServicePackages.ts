"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { ServicePackage, CreatePackageInput } from "../types";

export function useServicePackages(initialItems: ServicePackage[]) {
  const [packages, setPackages] = useState<ServicePackage[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/prepaid-packages");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setPackages(json.data);
    } catch {
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPackage = useCallback(
    async (input: CreatePackageInput) => {
      try {
        const res = await fetch("/api/prepaid-packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const json = await res.json();
        if (!res.ok) return { error: json.error || "Failed to create" };
        await refresh();
        toast.success("Package created");
        return { success: true };
      } catch {
        return { error: "Failed to create package" };
      }
    },
    [refresh]
  );

  const updatePackage = useCallback(
    async (id: string, input: Record<string, unknown>) => {
      try {
        const res = await fetch(`/api/prepaid-packages/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const json = await res.json();
        if (!res.ok) return { error: json.error || "Failed to update" };
        setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...json.data } : p)));
        toast.success("Package updated");
        return { success: true };
      } catch {
        return { error: "Failed to update package" };
      }
    },
    []
  );

  const deletePackage = useCallback(
    async (id: string) => {
      const prev = packages;
      setPackages((p) => p.filter((i) => i.id !== id));
      const res = await fetch(`/api/prepaid-packages/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setPackages(prev);
        toast.error("Failed to delete");
        return { error: "Failed to delete" };
      }
      toast.success("Package deleted");
      return { success: true };
    },
    [packages]
  );

  return { packages, isLoading, refresh, createPackage, updatePackage, deletePackage };
}
