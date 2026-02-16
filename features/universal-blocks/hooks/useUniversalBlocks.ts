"use client";

import { useState, useCallback, useEffect } from "react";
import type { UniversalBlock, CreateUniversalBlockInput, UpdateUniversalBlockInput } from "../types";

export function useUniversalBlocks() {
  const [blocks, setBlocks] = useState<UniversalBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/universal-blocks");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setBlocks(json.data || []);
    } catch {
      setError("Failed to load blocks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(
    async (input: CreateUniversalBlockInput) => {
      const res = await fetch("/api/universal-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to create" };
      if (json.data) {
        setBlocks((prev) => [json.data, ...prev]);
      }
      return { success: true as const, data: json.data };
    },
    []
  );

  const update = useCallback(
    async (id: string, input: UpdateUniversalBlockInput) => {
      const res = await fetch(`/api/universal-blocks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to update" };
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...json.data } : b))
      );
      return { success: true as const };
    },
    []
  );

  const remove = useCallback(
    async (id: string) => {
      const prev = blocks;
      setBlocks((p) => p.filter((b) => b.id !== id));
      const res = await fetch(`/api/universal-blocks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setBlocks(prev);
        return { error: "Failed to delete" };
      }
      return { success: true as const };
    },
    [blocks]
  );

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  return { blocks, isLoading, error, create, update, remove, refresh: fetchBlocks };
}
