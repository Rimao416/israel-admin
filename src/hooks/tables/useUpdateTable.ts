// hooks/tables/useUpdateTable.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTable } from '@/services/table.service';
import { UpdateTableData } from '@/types/table.types';

export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTableData) => updateTable(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['table', variables.id] });
    },
  });
};

