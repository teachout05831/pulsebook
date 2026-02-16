'use client';

import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { InvoiceListItem } from '../types';

export function useInvoicesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;
  const [, startTransition] = useTransition();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const searchQuery = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = new URLSearchParams();
      params.set('_page', String(currentPage));
      params.set('_limit', String(pageSize));
      if (searchQuery) params.set('q', searchQuery);
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const res = await fetch(`/api/invoices?${params.toString()}`);
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      setInvoices(json.data || []);
      setTotal(json.total || 0);
      setUnpaidCount(json.unpaidCount ?? 0);
    } catch {
      setIsError(true);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, statusFilter, dateFrom, dateTo]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);
  const isFiltered = searchQuery.length > 0 || statusFilter !== 'all' || !!dateFrom || !!dateTo;
  const totalUnpaid = invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled').reduce((s, i) => s + i.amountDue, 0);

  const updateParams = useCallback(
    (updates: { page?: number; pageSize?: number; q?: string; status?: string; dateFrom?: string; dateTo?: string }) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (updates.page !== undefined) params.set('page', String(updates.page));
      if (updates.pageSize !== undefined) params.set('pageSize', String(updates.pageSize));
      if (updates.q !== undefined) { updates.q ? params.set('q', updates.q) : params.delete('q'); }
      if (updates.status !== undefined) { updates.status && updates.status !== 'all' ? params.set('status', updates.status) : params.delete('status'); }
      if (updates.dateFrom !== undefined) { updates.dateFrom ? params.set('dateFrom', updates.dateFrom) : params.delete('dateFrom'); }
      if (updates.dateTo !== undefined) { updates.dateTo ? params.set('dateTo', updates.dateTo) : params.delete('dateTo'); }
      router.push(`/invoices?${params.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) updateParams({ q: searchInput, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateParams]);

  useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);

  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) updateParams({ page }); };
  const handlePageSizeChange = (size: string) => updateParams({ pageSize: parseInt(size, 10), page: 1 });
  const handleStatusChange = (status: string) => updateParams({ status, page: 1 });
  const handleDateFromChange = (d: string) => updateParams({ dateFrom: d, page: 1 });
  const handleDateToChange = (d: string) => updateParams({ dateTo: d, page: 1 });
  const clearSearch = () => { setSearchInput(''); updateParams({ q: '', page: 1 }); };
  const navigateToInvoice = useCallback((id: string) => { setNavigatingTo(id); startTransition(() => { router.push(`/invoices/${id}`); }); }, [router]);

  return {
    invoices, total, totalUnpaid, unpaidCount, isLoading, isError, isFiltered,
    currentPage, pageSize, totalPages, startItem, endItem, goToPage, handlePageSizeChange,
    searchInput, setSearchInput, searchQuery, statusFilter, handleStatusChange, clearSearch,
    dateFrom, dateTo, handleDateFromChange, handleDateToChange,
    router, navigatingTo, navigateToInvoice,
  };
}
