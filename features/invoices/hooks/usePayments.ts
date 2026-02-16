'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { PaymentsQueryResult } from '../types';

const DEBOUNCE_MS = 300;

export function usePayments(initialData: PaymentsQueryResult) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [payments, setPayments] = useState(initialData.payments);
  const [stats, setStats] = useState(initialData.stats);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPayments(initialData.payments);
    setStats(initialData.stats);
    setPagination(initialData.pagination);
    setIsLoading(false);
  }, [initialData]);

  const searchQuery = searchParams.get('q') || '';
  const methodFilter = searchParams.get('method') || 'all';
  const month = searchParams.get('month') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);

  const updateParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || value === 'all' || (key === 'page' && value === 1) || (key === 'pageSize' && value === 10)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      const qs = params.toString();
      setIsLoading(true);
      startTransition(() => {
        router.push(qs ? `/payments?${qs}` : '/payments', { scroll: false });
      });
    },
    [searchParams, router]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== searchQuery) updateParams({ q: searchInput, page: 1 });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput, searchQuery, updateParams]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) updateParams({ page });
    },
    [pagination.totalPages, updateParams]
  );

  return {
    isLoading,
    paginatedPayments: payments,
    stats,
    isFiltered: searchQuery.length > 0 || methodFilter !== 'all' || !!month || !!dateFrom,
    searchInput, setSearchInput,
    methodFilter, month, dateFrom, dateTo,
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    startIndex: (pagination.page - 1) * pagination.pageSize,
    updateParams, goToPage, router,
  };
}
