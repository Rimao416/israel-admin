// hooks/invites/useUpdateInvite.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateInviteData } from '@/types/table.types';
import { updateInvite } from '@/services/invite.service';

export const useUpdateInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInviteData) => updateInvite(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['invites', data.tableId] });
      queryClient.invalidateQueries({ queryKey: ['invite', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['table', data.tableId] });
    },
  });
};

