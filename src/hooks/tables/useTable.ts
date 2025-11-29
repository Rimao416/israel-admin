// hooks/tables/useTable.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTableStore } from '@/store/tableStore';
import { getTableById } from '@/services/table.service';

export const useTable = (id: string) => {
  const {
    selectTable,
    selectedTable,
    setLoading,
    setError,
  } = useTableStore();

  const isValidId = !!id && id.trim() !== '';

  const query = useQuery({
    queryKey: ['table', id],
    queryFn: () => getTableById(id),
    enabled: isValidId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = query;

  useEffect(() => {
    setLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setLoading]);

  useEffect(() => {
    if (data) {
      selectTable(data);
    }
  }, [data, selectTable]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(message);
    }
  }, [error, setError]);

  return {
    ...query,
    data: selectedTable,
  };
};

