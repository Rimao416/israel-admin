// hooks/tables/useCreateTable.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTable } from '@/services/table.service';
import { CreateTableData } from '@/types/table.types';

export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTableData) => createTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

