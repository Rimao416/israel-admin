// hooks/invites/useInvite.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useInviteStore } from '@/store/inviteStore';
import { getInviteById } from '@/services/invite.service';

export const useInvite = (id: string) => {
  const {
    selectInvite,
    selectedInvite,
    setLoading,
    setError,
  } = useInviteStore();

  const isValidId = !!id && id.trim() !== '';

  const query = useQuery({
    queryKey: ['invite', id],
    queryFn: () => getInviteById(id),
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
      selectInvite(data);
    }
  }, [data, selectInvite]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(message);
    }
  }, [error, setError]);

  return {
    ...query,
    data: selectedInvite,
  };
};
