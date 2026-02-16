'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FollowUp, FollowUpUrgency } from '../types';
import { getFollowUpUrgency, getDaysOverdue } from '../types';

export interface FollowUpWithUrgency extends FollowUp {
  urgency: FollowUpUrgency;
  daysOverdue: number;
  displayName: string;
}

interface ApiFollowUp {
  id: string; companyId: string; customerId: string; customerName?: string;
  type: 'call' | 'email' | 'meeting'; details: string | null; dueDate: string;
  status: string; assignedTo: string | null; completedAt: string | null;
  createdBy: string | null; createdAt: string; updatedAt: string;
}

function enrich(item: ApiFollowUp): FollowUpWithUrgency {
  const due = new Date(item.dueDate);
  return {
    id: item.id, companyId: item.companyId, customerId: item.customerId,
    type: item.type, details: item.details, dueDate: due,
    status: item.status as FollowUp['status'],
    assignedTo: item.assignedTo, completedAt: item.completedAt ? new Date(item.completedAt) : null,
    createdBy: item.createdBy, createdAt: new Date(item.createdAt), updatedAt: new Date(item.updatedAt),
    customerName: item.customerName,
    urgency: getFollowUpUrgency(due),
    daysOverdue: getDaysOverdue(due),
    displayName: item.customerName || 'Unknown',
  };
}

export function useFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUpWithUrgency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/follow-ups');
      if (!res.ok) throw new Error('fetch failed');
      const json: { data: ApiFollowUp[] } = await res.json();
      setFollowUps((json.data || []).map(enrich));
    } catch {
      setError('Failed to load follow-ups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleComplete = useCallback(async (id: string) => {
    const res = await fetch(`/api/follow-ups/${id}/complete`, { method: 'POST' });
    if (res.ok) setFollowUps((prev) => prev.filter((f) => f.id !== id));
    return { success: res.ok };
  }, []);

  const handleCancel = useCallback(async (id: string) => {
    const res = await fetch(`/api/follow-ups/${id}/complete`, { method: 'POST' });
    if (res.ok) setFollowUps((prev) => prev.filter((f) => f.id !== id));
    return { success: res.ok };
  }, []);

  const handleReschedule = useCallback(async (id: string, newDate: string) => {
    const res = await fetch(`/api/follow-ups/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dueDate: newDate }),
    });
    if (res.ok) await refresh();
    return { success: res.ok };
  }, [refresh]);

  const handleCreate = useCallback(async (input: { customerId: string; type: string; details?: string; dueDate: string; assignedTo?: string }) => {
    const res = await fetch('/api/follow-ups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (res.ok) await refresh();
    return json;
  }, [refresh]);

  const overdue = followUps.filter((f) => f.urgency === 'overdue');
  const today = followUps.filter((f) => f.urgency === 'today');
  const upcoming = followUps.filter((f) => f.urgency === 'upcoming');

  return {
    followUps, overdue, today, upcoming,
    isLoading, error, refresh,
    handleCreate, handleComplete, handleCancel, handleReschedule,
  };
}
