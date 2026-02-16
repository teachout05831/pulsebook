"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface JobFormData {
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: string;
  address: string;
}

const INITIAL_FORM: JobFormData = {
  title: "",
  description: "",
  scheduledDate: "",
  scheduledTime: "09:00",
  estimatedDuration: "60",
  address: "",
};

interface UseCreateJobOptions {
  customerId: string;
  onSuccess?: () => void;
  onClose: () => void;
}

export function useCreateJob({ customerId, onSuccess, onClose }: UseCreateJobOptions) {
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = useCallback((field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
  }, []);

  const isValid = formData.title.trim().length > 0 && formData.scheduledDate.length > 0;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime || null,
          estimatedDuration: formData.estimatedDuration
            ? parseInt(formData.estimatedDuration)
            : null,
          address: formData.address.trim() || null,
          status: "scheduled",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to create job");
        return;
      }

      toast.success("Job created successfully");
      resetForm();
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Failed to create job");
    } finally {
      setIsLoading(false);
    }
  }, [isValid, customerId, formData, resetForm, onClose, onSuccess]);

  return { formData, updateField, isLoading, isValid, handleSubmit };
}
