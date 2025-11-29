// hooks/tables/useTables.ts
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getTables } from '@/services/table.service';
import { useTableStore } from '@/store/tableStore';

export const useTables = () => {
  const { tables, setTables, setError, setLoading } = useTableStore();

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    setLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setLoading]);

  useEffect(() => {
    if (data) {
      const formattedData = data.map(table => ({
        ...table,
        createdAt: new Date(table.createdAt),
        updatedAt: new Date(table.updatedAt),
      }));
      setTables(formattedData);
    }
  }, [data, setTables]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
      setError(message);
    }
  }, [error, setError]);

  return {
    data: tables,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

