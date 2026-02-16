import { getAuthCompany } from '@/lib/auth/getAuthCompany';
import type { FollowUp } from '../types';

export async function getFollowUps(): Promise<FollowUp[]> {
  const { supabase, companyId } = await getAuthCompany();

  const { data, error } = await supabase
    .from('follow_ups')
    .select(`
      id, company_id, customer_id, type, details, due_date,
      status, assigned_to, completed_at, created_by, created_at, updated_at,
      customers:customer_id(name, last_contact_date)
    `)
    .eq('company_id', companyId)
    .eq('status', 'pending')
    .order('due_date', { ascending: true })
    .limit(100);

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.id,
    companyId: item.company_id,
    customerId: item.customer_id,
    type: item.type,
    details: item.details,
    dueDate: new Date(item.due_date),
    status: item.status,
    assignedTo: item.assigned_to,
    completedAt: item.completed_at ? new Date(item.completed_at) : null,
    createdBy: item.created_by,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
    customerName: (item.customers as unknown as { name: string; last_contact_date: string | null } | null)?.name,
    lastContactDate: (item.customers as unknown as { name: string; last_contact_date: string | null } | null)?.last_contact_date ?? undefined,
  }));
}

export async function getCustomerFollowUps(customerId: string): Promise<FollowUp[]> {
  const { supabase, companyId } = await getAuthCompany();

  const { data, error } = await supabase
    .from('follow_ups')
    .select('id, company_id, customer_id, type, details, due_date, status, assigned_to, completed_at, created_by, created_at, updated_at')
    .eq('company_id', companyId)
    .eq('customer_id', customerId)
    .order('due_date', { ascending: true })
    .limit(50);

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.id,
    companyId: item.company_id,
    customerId: item.customer_id,
    type: item.type,
    details: item.details,
    dueDate: new Date(item.due_date),
    status: item.status,
    assignedTo: item.assigned_to,
    completedAt: item.completed_at ? new Date(item.completed_at) : null,
    createdBy: item.created_by,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  }));
}
