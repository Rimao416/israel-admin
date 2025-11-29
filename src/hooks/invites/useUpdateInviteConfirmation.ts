// hooks/invites/useUpdateInviteConfirmation.ts
import { updateInviteConfirmation } from '@/services/invite.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateInviteConfirmation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, confirme }: { id: string; confirme: 'OUI' | 'NON' | 'EN_ATTENTE' }) =>
      updateInviteConfirmation(id, confirme),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['invite', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

