
// hooks/invites/useCreateInvite.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateInviteData } from '@/types/table.types';
import { createInvite } from '@/services/invite.service';

export const useCreateInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInviteData) => createInvite(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['invites', data.tableId] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['table', data.tableId] });
    },
  });
};

