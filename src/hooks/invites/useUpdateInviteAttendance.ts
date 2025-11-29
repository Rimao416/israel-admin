
// hooks/invites/useUpdateInviteAttendance.ts
import { updateInviteAttendance } from '@/services/invite.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateInviteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assiste }: { id: string; assiste: boolean }) =>
      updateInviteAttendance(id, assiste),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['invite', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};