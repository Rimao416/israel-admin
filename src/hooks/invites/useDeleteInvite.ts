// hooks/invites/useDeleteInvite.ts
import { deleteInvites } from '@/services/invite.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteInvites(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

