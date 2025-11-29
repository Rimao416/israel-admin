// hooks/tables/useDeleteTable.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTables } from '@/services/table.service';

export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteTables(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};